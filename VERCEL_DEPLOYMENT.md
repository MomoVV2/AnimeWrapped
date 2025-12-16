# Vercel Deployment Guide

## Quick Setup (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Create React App

### 3. Configure Environment Variables
In the Vercel project settings (Settings → Environment Variables), add these:

**Frontend Variables** (exposed to browser - safe):
```
REACT_APP_ANILIST_CLIENT_ID=33299
REACT_APP_REDIRECT_URI=https://your-project-name.vercel.app/auth/callback
```

**Backend Variables** (server-side only - secure):
```
ANILIST_CLIENT_ID=33299
ANILIST_CLIENT_SECRET=UAXLN08IKXRap3uKUDSkqggxm5udq2McRzdNwK8D
ANILIST_REDIRECT_URI=https://your-project-name.vercel.app/auth/callback
```

**Quick Method**: Copy all variables from the `.env.vercel` file I created for you!

**Important**:
- Replace `your-project-name` with your actual Vercel project URL (you'll see it after first deployment)
- The `ANILIST_CLIENT_SECRET` should NEVER have the `REACT_APP_` prefix (keeps it secure on the backend only)

### 4. Deploy
Click "Deploy" - Vercel will build and deploy your app.

### 5. Update AniList Redirect URI
1. Go to https://anilist.co/settings/developer
2. Click on your "wrapped" API client
3. Update the Redirect URL to: `https://your-project-name.vercel.app/auth/callback`
4. Click "Save"

### 6. Redeploy with Correct URI
After updating the redirect URI in step 3:
1. Go back to Vercel dashboard
2. Update the `REACT_APP_REDIRECT_URI` environment variable with your actual Vercel URL
3. Click "Redeploy" in Vercel

## How It Works

- **Frontend**: React app is deployed to Vercel's CDN
- **Backend**: The `/api/token.js` serverless function handles OAuth token exchange
- **No separate server needed**: The Vercel serverless function replaces the Express server
- **Local development**: Still uses `server.js` on port 3001 (detected via NODE_ENV)

## Testing Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Click "Login with AniList"
3. Authorize the app
4. You should see your 2025 wrapped stats!

## Troubleshooting

**"Failed to authenticate" error**:
- Make sure the redirect URI in Vercel environment variables matches exactly what's in AniList settings
- Check Vercel function logs for errors

**"No data" or empty slides**:
- You need anime watched/completed in 2025
- Try adding some 2024 dates temporarily for testing

**Build errors**:
- Check Vercel build logs
- Make sure all environment variables are set

## Custom Domain (Optional)

1. In Vercel, go to Settings → Domains
2. Add your custom domain
3. Update `REACT_APP_REDIRECT_URI` to use your custom domain
4. Update the redirect URI in AniList settings
5. Redeploy

## Local Development

You still need to run TWO servers locally:

Terminal 1:
```bash
node server.js
```

Terminal 2:
```bash
npm start
```

The app automatically detects if it's running locally (NODE_ENV=development) and uses the local proxy server.
