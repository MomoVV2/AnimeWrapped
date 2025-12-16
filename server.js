const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/token', async (req, res) => {
  const { code } = req.body;

  console.log('Received token exchange request with code:', code);

  const requestBody = {
    grant_type: 'authorization_code',
    client_id: process.env.REACT_APP_ANILIST_CLIENT_ID,
    client_secret: process.env.REACT_APP_ANILIST_CLIENT_SECRET,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
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
    console.log('AniList response:', data);

    res.json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
