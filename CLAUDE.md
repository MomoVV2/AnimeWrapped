# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **AniList Wrapped 2025** - a Spotify Wrapped-style year-in-review for AniList users. Built with React 19 + TypeScript with a dual-deployment architecture supporting both local development (Express proxy server) and production (Vercel serverless functions). Shows comprehensive 2025 anime watching statistics in a beautiful slide-based presentation with 13 interactive slides.

## Development Commands

### Local Development - Start Both Servers (Required)
You need TWO servers running for local development:

1. **OAuth Proxy Server** (Terminal 1):
```bash
node api/index.js
```
Runs on http://localhost:3001 - handles OAuth token exchange to avoid CORS issues. This is a standalone Express server that mimics what the Vercel serverless function does in production.

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
  - `services/auth.ts`: OAuth authentication logic with environment-based proxy detection
  - `services/anilist.ts`: GraphQL API queries for user stats (filters to 2025 data only)
- **api/**: Backend OAuth proxy (dual-purpose architecture)
  - `index.js`: Express server for local development (run with `node api/index.js`)
  - `token.js`: Vercel serverless function for production (auto-deployed to `/api/token`)
- **public/**: Static assets (HTML, icons, manifest)
- **Dockerfile**: Multi-stage Docker build for production
- **docker-compose.yml**: Easy deployment setup
- **vercel.json**: Vercel configuration for serverless deployment
- **.env.example**: Template for environment variables (never commit real .env!)

## Technology Stack

- **React 19.2.3** with TypeScript 4.9.5
- **Create React App 5.0.1**: Build tooling and configuration
- **React Testing Library**: Component testing
- **Jest**: Test runner (configured via react-scripts)

## Important Implementation Details

### Application Architecture

**Slide Navigation System**: The app uses an array-based slide system in `App.tsx:104-118`:
- 13 slides total (Welcome → WatchTime → CompletionRate → ... → GrandFinale)
- Navigation via arrow keys (Left/Right/Space) or on-screen buttons
- Slide indicators show current position
- Each slide is a React component receiving `UserStats` as props

**Dual-Environment OAuth Architecture**:

The app uses different OAuth proxy endpoints depending on the environment:
- **Development**: `services/auth.ts:17-20` detects `NODE_ENV=development` and uses `http://localhost:3001/api/token` (Express server in `api/index.js`)
- **Production**: Automatically uses `/api/token` (Vercel serverless function in `api/token.js`)
- **Override**: Set `REACT_APP_PROXY_ENDPOINT` to manually specify proxy URL

**OAuth Flow with StrictMode Protection**:
1. User clicks "Login with AniList" → `initiateLogin()` in `services/auth.ts:23-31`
2. Redirects to AniList OAuth with `response_type=code`
3. AniList redirects back with authorization code
4. Frontend sends code to proxy server (environment-dependent endpoint)
5. Proxy exchanges code for access token (prevents exposing client secret)
6. Token stored in localStorage for subsequent API calls
7. **Critical**: `App.tsx:29-56` uses `isExchangingRef` to prevent duplicate token exchanges in React 19 StrictMode (which runs effects twice in development)

**Why the dual architecture?**
- AniList OAuth requires a `client_secret` for token exchange
- Client secrets cannot be exposed in browser code
- Local development uses Express server (`api/index.js`) running on port 3001
- Production uses Vercel serverless function (`api/token.js`) at `/api/token`
- Both implementations are identical - they POST to AniList's token endpoint with the secret

### Data Filtering (2025 Only!)
The app fetches ALL anime data but filters to show only 2025 stats in `services/anilist.ts:fetchUserData`:
- Anime completed in 2025 (completedAt.year === 2025)
- Anime started in 2025 (startedAt.year === 2025)
- Anime updated in 2025 (updatedAt timestamp from 2025)
- All statistics (genres, studios, voice actors, etc.) are calculated ONLY from 2025 entries
- The filtering happens in `anilist.ts:164-168` and applies to all derived statistics

### Environment Variables (NEVER COMMIT .env!)

**CRITICAL SECURITY NOTE**: There's an inconsistency in the current code that needs to be understood:
- `api/token.js:16-17` (Vercel function) incorrectly reads `REACT_APP_ANILIST_CLIENT_SECRET`
- `api/index.js:16-17` (Express server) correctly reads `ANILIST_CLIENT_SECRET` (no prefix)
- The `REACT_APP_` prefix exposes variables to the browser bundle - NEVER use it for secrets!

**Correct Environment Variable Configuration**:

**Local Development** (`.env` file):
```env
# Frontend (exposed to browser - safe)
REACT_APP_ANILIST_CLIENT_ID=your_client_id
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback

# Backend (server-side only - SECURE)
ANILIST_CLIENT_ID=your_client_id
ANILIST_CLIENT_SECRET=your_client_secret
ANILIST_REDIRECT_URI=http://localhost:3000/auth/callback
```

**Vercel Production** (add in Vercel dashboard → Settings → Environment Variables):
```env
# Frontend
REACT_APP_ANILIST_CLIENT_ID=your_client_id
REACT_APP_REDIRECT_URI=https://your-app.vercel.app/auth/callback

# Backend (IMPORTANT: api/token.js currently uses REACT_APP_ prefix - this should be fixed!)
REACT_APP_ANILIST_CLIENT_SECRET=your_client_secret  # CURRENTLY REQUIRED (bug)
# Ideally should be:
# ANILIST_CLIENT_SECRET=your_client_secret
```

**Variable Reference by File**:
- `services/auth.ts:14` reads `REACT_APP_ANILIST_CLIENT_ID` (frontend - OK)
- `services/auth.ts:15` reads `REACT_APP_REDIRECT_URI` (frontend - OK)
- `api/index.js:16` reads `ANILIST_CLIENT_ID` (backend - CORRECT)
- `api/index.js:17` reads `ANILIST_CLIENT_SECRET` (backend - CORRECT)
- `api/token.js:16` reads `REACT_APP_ANILIST_CLIENT_ID` (backend - INCORRECT but works)
- `api/token.js:17` reads `REACT_APP_ANILIST_CLIENT_SECRET` (backend - SECURITY ISSUE)

**To fix the security issue**: Update `api/token.js` to use non-prefixed environment variables like `api/index.js` does.

### Deployment to Vercel

**Single deployment** - Everything runs on Vercel (no separate proxy server needed):

1. **Push to GitHub**:
   ```bash
   git push origin master
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and import your GitHub repo
   - Add ALL environment variables (see Environment Variables section above)
   - Deploy!

3. **Update AniList OAuth Settings**:
   - Go to https://anilist.co/settings/developer
   - Update Redirect URI to `https://your-vercel-url.vercel.app/auth/callback`

**How it works**:
- `vercel.json:3-10` configures Create React App build (`@vercel/static-build`)
- `vercel.json:11-14` configures serverless function deployment for `api/index.js`
- `vercel.json:16-25` routes `/api/*` to serverless function, everything else to `index.html`
- Frontend: React app served by Vercel CDN from `build/` directory
- Backend: `api/token.js` runs as a Vercel serverless function at `/api/token` endpoint
- The app auto-detects environment (`services/auth.ts:17-20`): uses `/api/token` in production, `localhost:3001/api/token` in development
- See `VERCEL_DEPLOYMENT.md` for detailed step-by-step guide with screenshots

**Vercel Configuration Details**:
- `vercel.json` has TWO builds configured but only ONE is used (inconsistency):
  - Build 1: Static React app from `package.json` → outputs to `build/`
  - Build 2: Serverless API from `api/index.js` (but the actual function is in `api/token.js`)
- The serverless function endpoint is `/api/token` which maps to `api/token.js` (not `api/index.js`)
- `api/index.js` is the Express server for local development only

### AniList GraphQL Data Flow

**User Statistics Fetching** (`services/anilist.ts:52-317`):

1. **User Query** (lines 54-96): Fetches basic user info and aggregate statistics
   - User ID, name, avatar
   - Global anime/manga statistics (not filtered by year)

2. **MediaListCollection Query** (lines 104-158): Fetches detailed anime list with:
   - Media details (title, cover, episodes, format, genres, studios)
   - Character and voice actor information (top 25 characters per anime)
   - Completion dates, scores, progress

3. **2025 Filtering** (lines 164-168): Critical year-based filtering
   - Filters entries where `completedAt.year === 2025`
   - OR `startedAt.year === 2025` (and not completed)
   - OR `updatedAt` timestamp is from 2025

4. **Statistics Calculation** (lines 170-316): All stats derived from filtered 2025 data
   - Episode counts, watch time estimates (24 min/episode)
   - Genre distribution from 2025 anime only
   - Studio distribution (only `isAnimationStudio === true`)
   - Voice actors from MAIN/SUPPORTING characters only
   - Score distribution, completion rates, monthly activity

**Important Data Notes**:
- Voice actors at `anilist.ts:242-254`: Only counts Japanese VAs for main/supporting characters
- Studios at `anilist.ts:228-239`: Filters to animation studios only (excludes producers)
- The `UserStats` interface at lines 3-31 defines the complete data structure passed to all slides

## TypeScript Configuration

- Strict mode enabled
- Target: ES5 (for maximum browser compatibility)
- Module: ESNext with Node resolution
- JSX: react-jsx (new transform, no need to import React in every file)
- All source code in `src/` directory only

## Common Development Tasks

**Adding a new slide**:
1. Create slide component in `components/WrappedSlides.tsx` or `components/NewSlides.tsx`
2. Export the component
3. Import in `App.tsx:3-19`
4. Add to slides array in `App.tsx:104-118`
5. Slide receives `stats: UserStats` as prop automatically

**Modifying AniList queries**:
- All GraphQL queries are in `services/anilist.ts`
- The query structure must match AniList's schema (see https://anilist.co/graphiql)
- Always filter by 2025 data using the filtering logic at lines 164-168
- Test with different user accounts to ensure data edge cases are handled

**Changing the year filter**:
- Update all `2025` references in `anilist.ts:164-168`
- Update UI text in slide components
- Update `activityByMonth` year at line 184

**Debugging OAuth issues**:
- Check browser console for auth flow logs (`App.tsx:38-40, 50, 58, 60`)
- Verify redirect URI matches exactly in: `.env`, AniList settings, and Vercel env vars
- Ensure proxy server is running on port 3001 for local development
- Check that `isExchangingRef` prevents duplicate exchanges (React StrictMode issue)
