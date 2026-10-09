// Enriches games with real Steam data: PC/Mac system requirements, price, review summary, live player counts.
// Incremental + cached in data/db/steam.json. Most-popular games first, never-fetched before stale.
// Usage: node scripts/data/fetch-steam.mjs [--budget=600]

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DB = path.join(ROOT, 'data/db');
const CACHE = path.join(DB, 'steam.json');

const budget = Number(process.argv.find((a) => a.startsWith('--budget='))?.split('=')[1] ?? 600);
const STALE_DAYS = { details: 14, reviews: 3 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const games = JSON.parse(fs.readFileSync(path.join(DB, 'games.json'), 'utf8'));
const signals = JSON.parse(fs.readFileSync(path.join(DB, 'signals.json'), 'utf8'));
const cache = fs.existsSync(CACHE) && fs.statSync(CACHE).size ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const now = Date.now();
const nowSec = now / 1000;

function interest(g) {
  const s = signals[g.id] || {};
  const rankBoost = ['visits', 'wantToPlay', 'playing', 'steamPeak', 'twitchHours', 'wishlisted'].reduce((acc, k) => acc + (s[k] ? Math.max(0, 1500 - s[k]) / 15 : 0), 0);
  return (s.hypes || 0) * 3 + (s.votes || 0) / 4 + rankBoost;
}

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

// Steam ships requirements as HTML lists: <li><strong>OS:</strong> Windows 10<br></li>
function parseRequirements(html) {
  if (!html || typeof html !== 'string') return null;
  const rows = [];
  for (const m of html.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
    const text = decode(m[1].replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const idx = text.indexOf(':');
    if (idx > 0 && idx < 40) rows.push([text.slice(0, idx).trim(), text.slice(idx + 1).trim()]);
    else if (text) rows.push(['Note', text]);
  }
  return rows.length ? rows : null;
}

const stale = (ts, days) => !ts || now - ts > days * 86400000;

async function getJson(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'NextPlay data bot (nextplaygame.me)' } });
    if (res.status === 429 || res.status === 403) {
      console.log(`[steam] rate limited, backing off ${30 * (attempt + 1)}s`);
      await sleep(30000 * (attempt + 1));
      continue;
    }
    if (!res.ok) return null;
    return res.json().catch(() => null);
  }
  return null;
}

async function fetchDetails(appid) {
  const data = await getJson(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=english`);
  const d = data?.[appid];
  if (!d?.success) return { ok: false };
  const x = d.data;
  return {
    ok: true,
    type: x.type,
    free: !!x.is_free,
    price: x.price_overview ? { final: x.price_overview.final / 100, initial: x.price_overview.initial / 100, discount: x.price_overview.discount_percent, currency: x.price_overview.currency } : null,
    comingSoon: !!x.release_date?.coming_soon,
    steamDate: x.release_date?.date || null,
    pc: { min: parseRequirements(x.pc_requirements?.minimum), rec: parseRequirements(x.pc_requirements?.recommended) },
    mac: x.platforms?.mac ? { min: parseRequirements(x.mac_requirements?.minimum), rec: parseRequirements(x.mac_requirements?.recommended) } : null,
    linux: !!x.platforms?.linux,
    deck: null,
    metacritic: x.metacritic?.score || null,
    controller: x.controller_support || null,
    languages: x.supported_languages ? decode(x.supported_languages.replace(/<[^>]+>/g, '')).split(',').map((s) => s.replace(/\*.*$/, '').trim()).filter(Boolean).slice(0, 30) : [],
  };
}

async function fetchReviews(appid) {
  const data = await getJson(`https://store.steampowered.com/appreviews/${appid}?json=1&language=all&purchase_type=all&num_per_page=0`);
  const q = data?.query_summary;
  if (!q || !q.total_reviews) return null;
  return { label: q.review_score_desc, positive: q.total_positive, total: q.total_reviews };
}

async function fetchPlayers(appid) {
  const data = await getJson(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`);
  return data?.response?.result === 1 ? data.response.player_count : null;
}

const candidates = games.filter((g) => g.steamAppId).sort((a, b) => interest(b) - interest(a));
let spent = 0;
let done = 0;

// Write to a temp file then rename, so a crash or full disk can never truncate the cache.
function save() {
  fs.writeFileSync(`${CACHE}.tmp`, '{\n' + Object.keys(cache).sort((a, b) => a - b).map((k) => `${JSON.stringify(k)}:${JSON.stringify(cache[k])}`).join(',\n') + '\n}\n');
  fs.renameSync(`${CACHE}.tmp`, CACHE);
}

// Pass 1: store details + reviews (rate-limited host, ~1 req / 1.6s)
for (const g of candidates) {
  if (spent >= budget) break;
  const id = g.steamAppId;
  const entry = (cache[id] ||= {});
  const released = g.date && g.date < nowSec;

  if (stale(entry.detailsAt, STALE_DAYS.details)) {
    const det = await fetchDetails(id);
    spent++;
    Object.assign(entry, { details: det.ok ? det : entry.details || null, detailsAt: now });
    await sleep(1600);
  }
  if (released && stale(entry.reviewsAt, STALE_DAYS.reviews) && spent < budget) {
    entry.reviews = (await fetchReviews(id)) || entry.reviews || null;
    entry.reviewsAt = now;
    spent++;
    await sleep(1600);
  }
  if (++done % 50 === 0) {
    save();
    console.log(`[steam] ${done} games processed, ${spent} requests`);
  }
}

// Pass 2: live player counts for the top released games (separate, more lenient API host).
const live = candidates.filter((g) => g.date && g.date < nowSec).slice(0, 400);
for (const g of live) {
  const entry = (cache[g.steamAppId] ||= {});
  entry.players = await fetchPlayers(g.steamAppId);
  entry.playersAt = now;
  await sleep(120);
}

save();
console.log(`[steam] done. ${spent} store requests, ${Object.keys(cache).length} apps cached, ${live.length} player counts`);
