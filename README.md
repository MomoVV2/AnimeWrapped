# AniList Wrapped 2024 🎉

A Spotify Wrapped-style year-in-review for your AniList anime watching history. See your 2024 anime stats in a beautiful, shareable format!

## Features

- 📊 Comprehensive 2024 stats (episodes watched, completion rate, watch time)
- 🎨 Top genres, studios, and anime formats
- ⭐ Rating patterns and score distribution
- 🎭 Top voice actors from your anime
- 📅 Monthly activity breakdown
- 🎉 Beautiful slide-based presentation with 13+ slides
- 🔐 Secure OAuth authentication with AniList

## Screenshots

[Your wrapped slides will look amazing here!]

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- AniList account
- AniList OAuth Application ([Create one here](https://anilist.co/settings/developer))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/wrapped_anilist.git
cd wrapped_anilist
```

2. **Create your .env file**
```bash
cp .env.example .env
```

3. **Configure AniList OAuth**
   - Go to https://anilist.co/settings/developer
   - Create a new API Client
   - Set Redirect URI to: `http://localhost:3000/auth/callback` (or your domain)
   - Copy your Client ID and Client Secret

4. **Update .env with your credentials**
```env
REACT_APP_ANILIST_CLIENT_ID=your_client_id_here
REACT_APP_ANILIST_CLIENT_SECRET=your_client_secret_here
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback
```

5. **Run with Docker**
```bash
docker-compose up -d
```

6. **Access the app**
   - Open http://localhost:3000
   - Click "Login with AniList"
   - Enjoy your 2024 wrapped!

## Manual Setup (Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables** (same as Docker setup steps 2-4)

3. **Start the proxy server** (in one terminal)
```bash
node server.js
```

4. **Start the React app** (in another terminal)
```bash
npm start
```

5. **Access the app at http://localhost:3000**

## Deployment

### Deploy to Production

1. **Update your .env for production**
```env
REACT_APP_REDIRECT_URI=https://yourdomain.com/auth/callback
```

2. **Update AniList OAuth settings**
   - Go to https://anilist.co/settings/developer
   - Update Redirect URI to your production domain

3. **Build and deploy with Docker**
```bash
docker-compose up -d --build
```

### Deploy to Cloud Platforms

#### Heroku
```bash
heroku create your-app-name
heroku config:set REACT_APP_ANILIST_CLIENT_ID=your_id
heroku config:set REACT_APP_ANILIST_CLIENT_SECRET=your_secret
heroku config:set REACT_APP_REDIRECT_URI=https://your-app-name.herokuapp.com/auth/callback
git push heroku main
```

#### Vercel / Netlify
- The app requires a backend server for OAuth, so you'll need to:
  - Deploy the proxy server separately (e.g., on Heroku, Railway)
  - Update `REACT_APP_PROXY_ENDPOINT` in your .env
  - Deploy the React app to Vercel/Netlify

#### Docker on VPS
```bash
# On your VPS
git clone your-repo
cd wrapped_anilist
cp .env.example .env
# Edit .env with your credentials
docker-compose up -d
```

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Backend**: Node.js + Express (OAuth proxy)
- **API**: AniList GraphQL API
- **Styling**: CSS with gradients and animations
- **Deployment**: Docker + Docker Compose

## Project Structure

```
wrapped_anilist/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (slides)
│   ├── services/        # API and auth logic
│   ├── App.tsx          # Main app component
│   └── index.tsx        # Entry point
├── server.js            # OAuth proxy server
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── .env.example         # Environment template
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT License - feel free to use this for your own wrapped!

## Acknowledgments

- [AniList](https://anilist.co) for the amazing API
- Inspired by Spotify Wrapped

## Support

If you like this project, give it a ⭐ on GitHub!

---

Made with ❤️ for the anime community
