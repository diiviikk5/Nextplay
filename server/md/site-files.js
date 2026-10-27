// Site-level files for AI agents, all generated at build time so they never go stale:
// llms.txt (map), llms-full.txt (content), ai.txt (usage policy), robots.txt, and the markdown catalog.
// Keep robots.txt, llms.txt and ai.txt in sync: they are all built from this file and src/lib/site.js.
import { SITE, BRAND, CONTACT, FOUNDED, DESCRIPTION, SOURCES, TAGLINE } from '../../src/lib/site.js';
import { ranked, upcomingByHype, games, upcoming } from '../db.js';
import { YEAR } from '../loaders.js';
import { renderMarkdown } from './registry.js';
import { abs, mdPath, gameList } from './format.js';

// Paths no crawler or agent should fetch (personal or query pages). Mirrored in ai.txt [scope].
// /data/ and /api/md/ stay crawlable: the app loads route data from /data/ and llms.txt links the catalog.
export const PRIVATE_PATHS = ['/search', '/watchlist'];
// AI search and user-fetch agents: they decide whether answer engines can cite us. Always allowed.
const SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];
// Training crawlers: allowed (owner's decision, 2026-10-28).
const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider'];

const FULL_LIMIT = 500_000;
const md = (p) => abs(mdPath(p));

const CORE = [
  ['/', 'Home', 'next big release, 7-day release radar, trending and most anticipated games'],
  ['/upcoming', 'Upcoming games', 'notable releases for each of the next six months'],
  ['/most-anticipated', 'Most anticipated games', 'top 100 upcoming games ranked by IGDB followers'],
  ['/trending', 'Trending games', 'most visited, watched on Twitch and played on Steam this week'],
  ['/new-releases', 'New releases', 'every notable game released in the last six weeks'],
  ['/game-pass', 'Xbox Game Pass games', 'coming soon, leaving soon and recently added, from the official US catalog, checked daily'],
  [`/releases/${YEAR}`, `${YEAR} release calendar`, 'every game releasing this year, month by month'],
  [`/best-games/${YEAR}`, `Best games of ${YEAR}`, 'highest-rated releases this year by critic and player score'],
  ['/can-i-run-it', 'Can I run it?', 'official minimum GPU for 400 PC games, from Steam'],
  ['/tier-list', 'Tier list maker', 'free S-F tier list maker for this year’s games'],
];
const BROWSE = [
  ['/platform', 'Games by platform', 'PS5, Xbox Series X|S, Nintendo Switch 2, PC, Mac and more'],
  ['/genre', 'Games by genre', 'RPG, shooter, horror, strategy, visual novel and more'],
  ['/series', 'Game series in order', 'every franchise in release order'],
  ['/developer', 'Developers', 'studios and their upcoming games'],
  ['/publisher', 'Publishers', 'publishers and their upcoming games'],
  ['/news', 'News', 'release news and features'],
  ['/blog', 'Blog', 'guides and opinion'],
];
const ABOUT = [
  ['/about', 'About', 'who runs NextPlay, data sources and how rankings work'],
  ['/contact', 'Contact', 'corrections and partnerships'],
  ['/privacy', 'Privacy policy', ''],
  ['/terms', 'Terms of service', ''],
  ['/disclaimer', 'Disclaimer', ''],
];
const item = ([p, name, desc]) => `- [${name}](${md(p)})${desc ? `: ${desc}` : ''}`;

export function llmsTxt(today) {
  const top = upcomingByHype.slice(0, 50);
  return `# ${BRAND}

> ${TAGLINE} ${DESCRIPTION}

Founded ${FOUNDED}. Free to use, no accounts, no paid placements. Covers ${games.length.toLocaleString('en-US')} games (${upcoming.length.toLocaleString('en-US')} upcoming). ${SOURCES} Contact: ${CONTACT}. Last update: ${today}.
Every page is available as markdown by adding .md to its URL (the homepage is /index.md). Keep in sync with /robots.txt and /ai.txt.

## Core pages
${CORE.map(item).join('\n')}

## Browse
${BROWSE.map(item).join('\n')}

## Most anticipated games
Each game page has release dates per platform, platform availability, Steam price, reviews and an FAQ. Top 50 below; all ${upcoming.length.toLocaleString('en-US')} upcoming games are in the [upcoming list](${md('/upcoming')}) and the [catalog](${SITE}/api/md/_catalog).
${top.map((g) => `- [${g.name}](${md(`/game/${g.slug}`)})`).join('\n')}

## Machine-readable
- [Full content](${SITE}/llms-full.txt): core pages and the top games concatenated as markdown
- [Markdown catalog](${SITE}/api/md/_catalog): every markdown URL
- [Sitemap](${SITE}/sitemap.xml)
- [AI usage policy](${SITE}/ai.txt)
- [RSS feed](${SITE}/rss.xml): notable releases this week and next

## Optional
${ABOUT.map(item).join('\n')}
`;
}

// Index pages that are mostly links; llms-full.txt points to them instead of inlining them.
const LINK_ONLY = new Set(['/can-i-run-it', '/series', '/developer', '/publisher', '/most-anticipated']);

// Core pages -> full upcoming release schedule (one line per game) -> top games by rank -> about/legal,
// capped at FULL_LIMIT characters.
export function llmsFullTxt(today, lastmodOf) {
  const page = (p) => {
    const r = renderMarkdown(p, { lastmod: lastmodOf(p), compact: true });
    return r.status === 200 ? `---\n<!-- source: ${abs(p)} -->\n${r.body}` : '';
  };
  const dated = upcoming.filter((g) => g.status !== 'cancelled' && g.date && g.precision !== 'tbd').sort((a, b) => a.date - b.date);
  const schedule = `---\n<!-- source: ${abs('/upcoming')} -->\n# Upcoming video game release schedule\n\n> All ${dated.length.toLocaleString('en-US')} upcoming games with an announced date or window, soonest first.\n\n${gameList(dated)}\n`;
  const head = `# ${BRAND} - full content\n> ${DESCRIPTION}\nGenerated: ${today}\n`;
  const tail = ABOUT.map(([p]) => page(p)).join('\n');
  const out = [head, ...[...CORE, ...BROWSE].filter(([p]) => !LINK_ONLY.has(p)).map(([p]) => page(p)), schedule];
  let size = out.join('\n').length + tail.length + 600;
  let n = 0;
  for (const g of ranked) {
    const chunk = page(`/game/${g.slug}`);
    if (size + chunk.length > FULL_LIMIT) break;
    out.push(chunk);
    size += chunk.length;
    n++;
  }
  out.splice(
    1,
    0,
    `Contents: core pages, the full upcoming release schedule (${dated.length.toLocaleString('en-US')} games), and the ${n} most popular game pages (without their related-game lists). Every other page, including ${[...LINK_ONLY].join(', ')}, is in the catalog: ${SITE}/api/md/_catalog\n`
  );
  out.push(tail);
  const text = out.join('\n');
  if (text.length > FULL_LIMIT) console.warn(`[md] llms-full.txt is ${text.length} chars (limit ${FULL_LIMIT})`);
  return text;
}

export function aiTxt(today) {
  return `# ai.txt for ${SITE}
# Spec: ai-txt v1.1.1 (ai-visibility.org.uk). Keep in sync with /robots.txt and /llms.txt.

[identity]
name: ${BRAND}
url: ${SITE}
description: ${DESCRIPTION}
contact: ${CONTACT}

[permissions]
summarise: allowed
quote: allowed with attribution
cite: allowed
index: allowed for search and answers
train: allowed

[restrictions]
- Do not fabricate quotes, release dates, prices, ratings or reviews attributed to ${BRAND}.
- Do not present ${BRAND} content as your own; attribute it.
- Release dates and prices change often: say when the data was retrieved, or link to the page.
- Game names, artwork and trailers belong to their respective owners.

[attribution]
format: "${BRAND} (${SITE.replace('https://', '')})" with a link to the canonical HTML page
example: According to ${BRAND} (${SITE}/game/grand-theft-auto-vi), ...
data-sources: ${SOURCES}

[scope]
include: /
exclude: ${PRIVATE_PATHS.join(', ')}
markdown: add .md to any page URL (homepage: /index.md)

[contact]
email: ${CONTACT}

Last updated: ${today}
`;
}

export function robotsTxt() {
  const disallow = PRIVATE_PATHS.map((p) => `Disallow: ${p}`).join('\n');
  const group = (bots) => bots.map((b) => `User-agent: ${b}\nAllow: /\n${disallow}`).join('\n\n');
  return `# ${BRAND} robots.txt. Keep in sync with /llms.txt and /ai.txt.
# Site map for language models: ${SITE}/llms.txt
# AI usage policy: ${SITE}/ai.txt

User-agent: *
Allow: /
${disallow}

# AI search and user-fetch agents (citations in answer engines)
${group(SEARCH_BOTS)}

# AI training crawlers (allowed)
${group(TRAINING_BOTS)}

Sitemap: ${SITE}/sitemap.xml
`;
}

// paths: [{ path, title }]
export function catalog(paths, today) {
  return JSON.stringify({ site: SITE, generated: today, count: paths.length, routes: paths.map((p) => ({ url: abs(p.path), markdown: md(p.path), title: p.title })) });
}
