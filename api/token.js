export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { code } = parsedBody;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  const requestBody = {
    grant_type: 'authorization_code',
    client_id: process.env.REACT_APP_ANILIST_CLIENT_ID,
    client_secret: process.env.REACT_APP_ANILIST_CLIENT_SECRET,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    code,
  };

  try {
    const response = await fetch('https://anilist.co/api/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
}
