export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { paymentId, txid, productId } = body || {};

    if (!paymentId || !txid) {
      return res.status(400).json({
        error: 'paymentId and txid are required',
        code: 'MISSING_PARAMS',
      });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      console.warn('[Pi Payments Serverless] PI_API_KEY is not set in environment variables');
      return res.status(503).json({
        error: 'PI_API_KEY is not configured on the server. Cannot finalize blockchain payment.',
        code: 'MISSING_PI_API_KEY',
      });
    }

    // 1. Fetch payment state from Pi Platform
    const statusRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
      },
    });

    if (statusRes.ok) {
      const current = await statusRes.json();
      if (current.status?.developer_completed) {
        return res.status(200).json({
          status: 'COMPLETED',
          paymentId,
          txid,
          productId,
        });
      }
    }

    // 2. Complete payment via Pi Platform API
    const completeResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    });

    if (!completeResponse.ok) {
      const errorText = await completeResponse.text();
      console.error(`[Pi Payments Serverless] Pi Platform completion failed for ${paymentId}:`, errorText);
      return res.status(completeResponse.status).json({
        error: 'Pi Platform rejected payment completion',
        details: errorText,
      });
    }

    const completedData = await completeResponse.json();

    // Optionally record to Supabase if configured
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    if (supabaseUrl && serviceRoleKey && !supabaseUrl.includes('your-project')) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
        await supabase.from('payment_records').upsert(
          {
            pi_payment_id: paymentId,
            pi_user_uid: completedData?.user_uid || '',
            amount: completedData?.amount || 0,
            memo: completedData?.memo || 'Pi Store Purchase',
            product_id: productId,
            status: 'COMPLETED',
            developer_approved: true,
            developer_completed: true,
            transaction_verified: true,
            server_txid: txid,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'pi_payment_id' }
        );
      } catch (dbErr) {
        console.warn('[Pi Payments Serverless] Optional Supabase record skipped:', dbErr);
      }
    }

    return res.status(200).json({
      status: 'COMPLETED',
      paymentId,
      txid,
      productId,
      payment: completedData,
    });
  } catch (err: any) {
    console.error('[Pi Payments Serverless] Exception completing payment:', err);
    return res.status(500).json({
      error: err?.message || 'Server error completing payment',
      code: 'COMPLETION_EXCEPTION',
    });
  }
}
