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

    const { paymentId, productId } = body || {};

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId is required', code: 'MISSING_PAYMENT_ID' });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      console.warn('[Pi Payments Serverless] PI_API_KEY is not set in environment variables');
      return res.status(503).json({
        error: 'PI_API_KEY is not set in your Vercel environment variables. Please add PI_API_KEY from your Pi Developer Portal under App Configuration -> Server API Key.',
        code: 'MISSING_PI_API_KEY',
      });
    }

    // 1. Check current payment state on Pi Platform
    const statusRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
      },
    });

    if (statusRes.ok) {
      const current = await statusRes.json();
      if (current.status?.developer_approved) {
        return res.status(200).json({
          status: 'APPROVED',
          paymentId,
          alreadyApproved: true,
          payment: current,
        });
      }
    }

    // 2. Approve via Pi Platform API
    const approveResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!approveResponse.ok) {
      const errorText = await approveResponse.text();
      console.error(`[Pi Payments Serverless] Pi Platform approval rejected for ${paymentId}:`, errorText);
      return res.status(approveResponse.status).json({
        error: 'Pi Platform rejected payment approval',
        details: errorText,
      });
    }

    const approvedData = await approveResponse.json();
    return res.status(200).json({
      status: 'APPROVED',
      paymentId,
      productId,
      payment: approvedData,
    });
  } catch (err: any) {
    console.error('[Pi Payments Serverless] Exception during payment approval:', err);
    return res.status(500).json({
      error: err?.message || 'Server error approving payment',
      code: 'APPROVAL_EXCEPTION',
    });
  }
}
