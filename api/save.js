// Save user stats to Vercel KV (Redis)
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, stats } = req.body;

    if (!username || !stats) {
      return res.status(400).json({ error: 'Username and stats required' });
    }

    // Sanitize username (alphanumeric + underscore only)
    const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!sanitizedUsername) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    // Save to Vercel KV with 90 day expiration
    await kv.set(`wrapped:${sanitizedUsername}`, {
      username: sanitizedUsername,
      stats,
      savedAt: new Date().toISOString()
    }, {
      ex: 60 * 60 * 24 * 90 // 90 days in seconds
    });

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://anime-wrapped-three.vercel.app';

    return res.status(200).json({
      success: true,
      shareUrl: `${baseUrl}/${sanitizedUsername}`
    });
  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({
      error: 'Failed to save stats',
      details: error.message
    });
  }
}
