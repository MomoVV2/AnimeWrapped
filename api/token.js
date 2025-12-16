// Vercel serverless function to exchange OAuth code for access token
// This replaces server.js for Vercel deployment

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  console.log('Received token exchange request with code:', code);

  const requestBody = {
    grant_type: 'authorization_code',
    client_id: process.env.ANILIST_CLIENT_ID,
    client_secret: process.env.ANILIST_CLIENT_SECRET,
    redirect_uri: process.env.ANILIST_REDIRECT_URI,
    code,
  };

  console.log('Sending to AniList:', { ...requestBody, client_secret: '***' });

  try {
    const response = await fetch('https://anilist.co/api/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('AniList response status:', response.status);

    if (!response.ok) {
      console.error('AniList error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
}
