# NextPlay — nextplaygame.me

Video game release dates, countdowns and what to play next. ~7,800 games from IGDB + Steam, ~12,800 statically rendered pages, refreshed daily.

## How it works

```
scripts/data/fetch-igdb.mjs   ─┐  IGDB: games, per-platform release dates, studios, series, popularity
scripts/data/fetch-steam.mjs  ─┤  Steam: real PC/Mac requirements, prices, reviews, live player counts
                               ▼
data/db/*.json                    committed dataset (one game per line → small daily diffs)
                               ▼
server/db.js                      ranking (follower hype, IGDB visits, Twitch, Steam players) + indexes
server/loaders.js                 one loader per route: page data, title, description, JSON-LD, FAQ
server/seo.js                     search-intent titles ("X Release Date: Oct 21, 2026 (PC)"), schema
                               ▼
scripts/build/prerender.mjs       React SSR → dist/<route>/index.html + dist/data/<route>.json,
                                  sitemaps, robots.txt, llms.txt, llms-full.txt, rss.xml, search index
```

The browser hydrates the prerendered HTML and fetches `/data/<route>.json` for client-side navigation, so the full dataset never ships to users and crawlers (Google, Bing, GPTBot, ClaudeBot, Perplexity) get complete HTML.

Thin pages are never generated: hubs, studio pages, games-like and platform×genre pages all have minimum-content thresholds (`MIN` in `server/loaders.js`). URLs that already earn search impressions are kept via `data/db/keep-paths.json`; retired URLs 301 in `vercel.json`.

## Commands

```bash
npm run dev            # local dev server; route data computed on demand
npm run data           # refresh IGDB + Steam data (needs .env)
npm run build          # client + SSR bundles + full prerender into dist/
npm run lint
```

Build somewhere else (e.g. a bigger drive): `OUT_DIR=E:/nextplay-build/dist npm run build`, then preview with `OUT_DIR=E:/nextplay-build/dist node scripts/serve.mjs` (behaves like Vercel: clean URLs + real 404s).

## Setup

1. `cp .env.example .env` and add Twitch/IGDB credentials (https://dev.twitch.tv/console/apps).
2. GitHub → Settings → Secrets → Actions: add `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET`. The `Refresh game data` workflow then runs daily, commits fresh data, and Vercel redeploys.
3. Vercel uses `vercel.json` (build command, output dir, redirects, headers).

## Data credits

Game data © IGDB.com (Twitch). Requirements, prices and player counts from the Steam store. Artwork © respective owners.
