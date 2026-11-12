import { createClient } from '@supabase/supabase-js';

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

// Baseline community funding totals
const BASELINE_FUNDING = {
  pimind_ai: {
    collectedPi: 134250,
    backersCount: 4890,
  },
  pi_battle_arena: {
    collectedPi: 412800,
    backersCount: 12640,
  },
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result: Record<string, { collectedPi: number; backersCount: number }> = {
      pimind_ai: { ...BASELINE_FUNDING.pimind_ai },
      pi_battle_arena: { ...BASELINE_FUNDING.pi_battle_arena },
    };

    // If Supabase is connected, query actual on-chain project payments
    if (supabase) {
      try {
        const { data: records, error } = await supabase
          .from('payment_records')
          .select('product_id, amount, pi_user_uid')
          .eq('status', 'COMPLETED');

        if (!error && Array.isArray(records)) {
          const pimindRecords = records.filter((r) => r.product_id?.includes('pimind_ai'));
          const arenaRecords = records.filter((r) => r.product_id?.includes('battle_arena'));

          if (pimindRecords.length > 0) {
            const addedPi = pimindRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
            const uniqueUsers = new Set(pimindRecords.map((r) => r.pi_user_uid)).size;
            result.pimind_ai.collectedPi += addedPi;
            result.pimind_ai.backersCount += uniqueUsers;
          }

          if (arenaRecords.length > 0) {
            const addedPi = arenaRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
            const uniqueUsers = new Set(arenaRecords.map((r) => r.pi_user_uid)).size;
            result.pi_battle_arena.collectedPi += addedPi;
            result.pi_battle_arena.backersCount += uniqueUsers;
          }
        }
      } catch (dbErr) {
        console.warn('[Projects Funding API] Supabase query skipped:', dbErr);
      }
    }

    return res.status(200).json({ funding: result });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Server error fetching project funding' });
  }
}
