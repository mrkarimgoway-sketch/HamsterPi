export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { paymentId, txid } = body || {};
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId || !PI_API_KEY) {
    return res.status(200).json({ status: 'PENDING', paymentId });
  }

  try {
    const statusRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Key ${PI_API_KEY}` },
    });

    if (statusRes.ok) {
      const payment = await statusRes.json();
      if (payment.status?.developer_completed) {
        return res.status(200).json({ status: 'COMPLETED', paymentId, payment });
      }

      if (payment.status?.transaction_verified && (txid || payment.transaction?.txid)) {
        const finalTxid = txid || payment.transaction?.txid;
        const completeRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: {
            Authorization: `Key ${PI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ txid: finalTxid }),
        });
        if (completeRes.ok) {
          const compData = await completeRes.json();
          return res.status(200).json({ status: 'COMPLETED', paymentId, payment: compData });
        }
      }

      return res.status(200).json({
        status: payment.status?.cancelled ? 'CANCELLED' : 'PENDING',
        paymentId,
        payment,
      });
    }
  } catch (err: any) {
    console.warn('[Incomplete Recovery] Error:', err);
  }

  return res.status(200).json({ status: 'PENDING', paymentId });
}
