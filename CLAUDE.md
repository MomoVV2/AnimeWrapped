# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **AniList Wrapped 2024** - a Spotify Wrapped-style year-in-review for AniList users. Built with React 19 + TypeScript and Node.js Express proxy server. Shows comprehensive 2024 anime watching statistics in a beautiful slide-based presentation.

## Development Commands

### Start Both Servers (Required)
You need TWO servers running:

1. **OAuth Proxy Server** (Terminal 1):
```bash
node server.js
```
Runs on http://localhost:3001 - handles OAuth token exchange to avoid CORS issues.

2. **React Development Server** (Terminal 2):
```bash
npm start
```
Opens the app at http://localhost:3000 with hot reloading enabled.

### Docker Development
```bash
docker-compose up
```
Starts both servers in a single container.

### Run Tests
```bash
npm test
```
Launches Jest test runner in interactive watch mode.

### Build for Production
```bash
npm run build
```
Creates optimized production build in `build/` folder.

## Project Structure

- **src/**: All TypeScript/React source code
  - `index.tsx`: Application entry point
  - `App.tsx`: Main app with slide navigation and auth flow
  - `components/WrappedSlides.tsx`: Original slide components (Welcome, WatchTime, Genres, Studios, etc.)
  - `components/NewSlides.tsx`: Additional slides (Completion, ScoreDistribution, VoiceActors, GrandFinale)
  - `services/auth.ts`: OAuth authentication logic (uses proxy server)
  - `services/anilist.ts`: GraphQL API queries for user stats (filters to 2024 data only)
- **server.js**: Express proxy server for OAuth token exchange (prevents CORS issues)
- **public/**: Static assets (HTML, icons, manifest)
- **Dockerfile**: Multi-stage Docker build for production
- **docker-compose.yml**: Easy deployment setup
- **.env.example**: Template for environment variables (never commit real .env!)

## Technology Stack

- **React 19.2.3** with TypeScript 4.9.5
- **Create React App 5.0.1**: Build tooling and configuration
- **React Testing Library**: Component testing
- **Jest**: Test runner (configured via react-scripts)

## Important Implementation Details

### OAuth Flow
1. User clicks "Login with AniList"
2. Redirects to AniList OAuth (response_type=code)
3. AniList redirects back with authorization code
4. Frontend sends code to proxy server at localhost:3001
5. Proxy exchanges code for access token (prevents exposing client secret)
6. Token stored in localStorage for subsequent API calls

### Data Filtering (2024 Only!)
The app fetches ALL anime data but filters to show only 2024 stats:
- Anime completed in 2024 (completedAt.year === 2024)
- Anime started in 2024 (startedAt.year === 2024)
- Calculated from individual entries, not lifetime AniList stats

### Environment Variables (NEVER COMMIT .env!)
- `REACT_APP_ANILIST_CLIENT_ID`: From AniList OAuth app
- `REACT_APP_ANILIST_CLIENT_SECRET`: From AniList OAuth app (used only in proxy server)
- `REACT_APP_REDIRECT_URI`: Must match AniList OAuth settings exactly

### Deployment Considerations
- Proxy server (server.js) must be deployed separately or with React build
- Update redirect URI in both .env and AniList OAuth settings for production
- Docker setup handles both servers in one container
- For Vercel/Netlify, deploy proxy server elsewhere (Heroku, Railway, etc.)

## TypeScript Configuration

- Strict mode enabled
- Target: ES5
- Module: ESNext with Node resolution
- JSX: react-jsx (new transform)
