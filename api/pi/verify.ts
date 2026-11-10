export default async function handler(req: any, res: any) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ verified: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use empty object
        body = {};
      }
    }

    const accessToken = body?.accessToken;
    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({
        verified: false,
        error: 'accessToken string is required',
        code: 'MISSING_ACCESS_TOKEN',
      });
    }

    // Official Pi Platform API verification
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        verified: false,
        error: `Pi Platform API returned status ${response.status}`,
        details: errorText,
      });
    }

    const piUser = await response.json();
    return res.status(200).json({
      verified: true,
      user: {
        uid: piUser.uid,
        username: piUser.username,
        roles: piUser.roles || [],
      },
      isSandbox: process.env.PI_SANDBOX_MODE === 'true',
    });
  } catch (err: any) {
    return res.status(500).json({
      verified: false,
      error: err?.message || 'Server error verifying Pioneer token',
    });
  }
}
