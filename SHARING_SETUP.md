# Setting Up Shareable Stats

## Problem
We want users to be able to share their wrapped stats with a URL like:
`https://anime-wrapped-three.vercel.app/knownasmomo`

## Solution Options

### Option 1: Vercel KV (Redis) - RECOMMENDED
**Pros**: Free tier, fast, simple, official Vercel solution
**Cons**: Requires Vercel dashboard setup

**Setup Steps**:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database" → "KV" 
5. Name it "anime-wrapped-kv"
6. Connect to your project
7. Vercel will add environment variables automatically

Then tell me when done and I'll write the code!

### Option 2: Simpler Temporary Solution (No DB needed)
Store the data in the URL itself as a hash parameter. Users can copy/paste the full URL.
Example: `https://anime-wrapped-three.vercel.app/#abc123xyz` where the hash contains compressed data.

**Which do you prefer?**
