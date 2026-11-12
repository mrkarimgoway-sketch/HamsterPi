import { createClient } from '@supabase/supabase-js';

// In-memory cache for fast retrieval across requests in active server instance
const recentPaymentsCache: Map<string, any[]> = new Map();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  !supabaseUrl.includes('your-project') &&
  !serviceRoleKey.includes('your-')
);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle Recording New Completed Payment (POST)
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }

      const { piUserUid, record } = body || {};
      if (record && record.pi_payment_id) {
        const uidKey = piUserUid || 'anonymous';
        const existing = recentPaymentsCache.get(uidKey) || [];
        const filtered = existing.filter((item: any) => item.pi_payment_id !== record.pi_payment_id);
        recentPaymentsCache.set(uidKey, [record, ...filtered].slice(0, 30));

        // If Supabase is configured, persist to database table
        if (supabase) {
          try {
            await supabase.from('payment_records').upsert(
              {
                pi_payment_id: record.pi_payment_id,
                pi_user_uid: piUserUid || '',
                amount: record.amount,
                memo: record.memo,
                product_id: record.product_id,
                status: record.status || 'COMPLETED',
                developer_approved: true,
                developer_completed: true,
                transaction_verified: true,
                server_txid: record.server_txid,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'pi_payment_id' }
            );
          } catch (dbErr) {
            console.warn('[Payments API] Supabase write failed:', dbErr);
          }
        }
      }

      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to record transaction' });
    }
  }

  // Handle Querying Payment History (GET)
  if (req.method === 'GET') {
    const uid = (req.query?.uid as string) || '';

    // 1. Try fetching from Supabase if configured
    if (supabase && uid) {
      try {
        const { data, error } = await supabase
          .from('payment_records')
          .select('*')
          .eq('pi_user_uid', uid)
          .order('created_at', { ascending: false })
          .limit(25);

        if (!error && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((d: any) => ({
            id: d.id,
            pi_payment_id: d.pi_payment_id,
            amount: d.amount,
            memo: d.memo || 'Pi In-Game Purchase',
            product_id: d.product_id,
            status: d.status || 'COMPLETED',
            server_txid: d.server_txid,
            created_at: d.created_at || d.updated_at,
          }));
          return res.status(200).json({ history: formatted });
        }
      } catch (err) {
        console.warn('[Payments API] Supabase query failed:', err);
      }
    }

    // 2. Fallback to memory cache
    const cached = recentPaymentsCache.get(uid) || [];
    return res.status(200).json({ history: cached });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
