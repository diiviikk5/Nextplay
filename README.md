# NextPlay — nextplaygame.me

Video game release dates, countdowns and what to play next. ~7,800 games from IGDB + Steam, ~12,800 statically rendered pages, refreshed daily.

## How it works

```
scripts/data/fetch-igdb.mjs   ─┐  IGDB: games, per-platform release dates, studios, series, popularity
scripts/data/fetch-steam.mjs  ─┤  Steam: real PC/Mac requirements, prices, reviews, daily player counts (90-day history)
scripts/data/fetch-gamepass.mjs┤  Xbox Game Pass US catalog: in it, coming soon, leaving soon, recently added
                               ▼
data/db/*.json                    committed dataset (one game per line → small daily diffs)
                               ▼
server/db.js                      ranking (follower hype, IGDB visits, Twitch, Steam players) + indexes
server/loaders.js                 one loader per route: page data, title, description, JSON-LD, FAQ
server/seo.js                     search-intent titles ("X Release Date: Oct 21, 2026 (PC)"), schema
                               ▼
server/md/                        markdown version of every page, rendered from the same loader data
server/widgets.js                 embeddable countdown widgets
                               ▼
scripts/build/prerender.mjs       React SSR → dist/<route>/index.html + dist/data/<route>.json + dist/<route>.md,
                                  sitemaps, robots.txt, llms.txt, llms-full.txt, ai.txt, rss.xml, widgets, search index
```

## AI-readable pages

Every public page has a markdown twin for AI agents: `/game/x.md` (homepage: `/index.md`), also at `/api/md/game/x`. Markdown responses are `noindex` and point to the HTML page as canonical, so Google keeps indexing the HTML. `/llms.txt` maps the site, `/llms-full.txt` has the core pages plus the full release schedule, `/ai.txt` sets usage and attribution rules, and `/api/md/_catalog` lists every markdown URL.

To add a page type: add the route in `src/routes.js`, its loader in `server/loaders.js`, and a renderer in `RENDERERS` in `server/md/registry.js` (or a `SKIP` entry with a reason). `npm run check:md` and the build fail if a renderer is missing.

The browser hydrates the prerendered HTML and fetches `/data/<route>.json` for client-side navigation, so the full dataset never ships to users and crawlers (Google, Bing, GPTBot, ClaudeBot, Perplexity) get complete HTML.

Thin pages are never generated: hubs, studio pages, games-like and platform×genre pages all have minimum-content thresholds (`MIN` in `server/loaders.js`). URLs that already earn search impressions are kept via `data/db/keep-paths.json`; retired URLs 301 in `vercel.json`.

## Commands

```bash
npm run dev            # local dev server; route data computed on demand
npm run data           # refresh IGDB + Steam + Game Pass data (needs .env)
npm run build          # client + SSR bundles + full prerender into dist/
npm run check:md       # every page type has a working markdown renderer
npm run lint
```

Build somewhere else (e.g. a bigger drive): `OUT_DIR=E:/nextplay-build/dist npm run build`, then preview with `OUT_DIR=E:/nextplay-build/dist node scripts/serve.mjs` (behaves like Vercel: clean URLs + real 404s).

## Setup

1. `cp .env.example .env` and add Twitch/IGDB credentials (https://dev.twitch.tv/console/apps).
2. GitHub → Settings → Secrets → Actions: add `IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET` and `VERCEL_TOKEN`. The `Refresh game data` workflow then runs daily, commits fresh data and deploys to Vercel. Without `VERCEL_TOKEN` nothing redeploys, so date-based pages (this week, Game Pass, most played) go stale.
3. Vercel uses `vercel.json` (build command, output dir, redirects, headers).

## Data credits

Game data © IGDB.com (Twitch). Requirements, prices and player counts from the Steam store. Game Pass catalog from Microsoft's public catalog endpoints (US market). Artwork © respective owners.
