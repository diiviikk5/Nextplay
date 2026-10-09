// Server-only dataset: loads data/db, derives ranking + indexes. Never imported by client code.
import fs from 'node:fs';
import path from 'node:path';
import { PLATFORMS, sortPlatforms } from '../src/lib/platforms.js';
import { monthKey } from '../src/lib/format.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (p, fallback) => (fs.existsSync(path.join(ROOT, p)) ? JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8')) : fallback);

// Build "now". Pin with NOW=2026-10-09 for reproducible builds/tests.
export const NOW = process.env.NOW ? Math.floor(new Date(process.env.NOW).getTime() / 1000) : Math.floor(Date.now() / 1000);
const DAY = 86400;

const rawGames = read('data/db/games.json', []);
const signals = read('data/db/signals.json', {});
const steam = read('data/db/steam.json', {});
export const seriesList = read('data/db/series.json', []);
export const meta = read('data/db/meta.json', {});
export const aliases = read('data/db/slug-aliases.json', {});
export const news = read('content/news.json', []);
export const blog = read('content/blog.json', []);

function interest(g, s) {
  const rank = (k, w) => (s[k] ? (Math.max(0, 1500 - s[k]) / 1500) * w : 0);
  const players = g.steam?.players ? Math.log10(g.steam.players + 1) * 25 : 0;
  return (
    (s.hypes || 0) * 2 +
    Math.sqrt(s.votes || 0) * 6 +
    rank('visits', 160) + rank('wantToPlay', 140) + rank('playing', 120) + rank('steamPeak', 120) + rank('twitchHours', 120) + rank('wishlisted', 140) +
    players
  );
}

export const games = rawGames.map((g) => {
  const s = signals[g.id] || {};
  const st = g.steamAppId ? steam[g.steamAppId] : null;
  const game = {
    ...g,
    platforms: sortPlatforms(g.platforms.filter((p) => PLATFORMS[p])),
    signals: s,
    steam: st ? { reviews: st.reviews || null, players: st.players ?? null, ...(st.details || {}) } : null,
  };
  // IGDB leaves first_release_date empty when the only dated release is Early Access; use it anyway.
  const firstDated = g.releases.filter((r) => r.date && r.precision !== 'tbd').sort((a, b) => a.date - b.date)[0];
  if (!game.date && firstDated) {
    game.date = firstDated.date;
    game.precision = firstDated.precision;
  }
  game.early = !!g.releases.find((r) => r.date === game.date && r.early);
  game.score = interest(game, s);
  game.released = !!game.date && game.precision === 'day' && game.date <= NOW;
  game.upcoming = !game.date || game.date > NOW || game.precision !== 'day';
  // Released-ish: dated in the past but with fuzzy precision (e.g. "2025") — treat as released.
  if (game.date && game.date <= NOW && game.precision !== 'day') {
    game.released = true;
    game.upcoming = false;
  }
  return game;
});

export const byId = new Map(games.map((g) => [g.id, g]));
export const bySlug = new Map(games.map((g) => [g.slug, g]));

const byScore = (a, b) => b.score - a.score;
const byDateAsc = (a, b) => (a.date || Infinity) - (b.date || Infinity) || b.score - a.score;
const byDateDesc = (a, b) => (b.date || 0) - (a.date || 0) || b.score - a.score;

export const ranked = [...games].sort(byScore);
export const upcoming = games.filter((g) => g.upcoming && g.status !== 'cancelled').sort(byDateAsc);
export const upcomingByHype = [...upcoming].sort((a, b) => (b.signals.hypes || 0) - (a.signals.hypes || 0) || byScore(a, b));
export const released = games.filter((g) => g.released).sort(byDateDesc);
export const sorters = { byScore, byDateAsc, byDateDesc };

// Rating that is safe to show: needs real vote volume.
export function bestRating(g) {
  if (g.signals.critic && g.signals.criticCount >= 3) return { value: g.signals.critic, label: 'Critics', count: g.signals.criticCount };
  if (g.signals.rating && g.signals.ratingCount >= 8) return { value: g.signals.rating, label: 'Players', count: g.signals.ratingCount };
  return null;
}

function group(keyFn) {
  const map = new Map();
  for (const g of games) for (const k of keyFn(g)) {
    if (!k) continue;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(g);
  }
  return map;
}

export const byPlatform = group((g) => g.platforms);
export const byGenre = group((g) => g.genres.map((x) => x.slug));
export const byTheme = group((g) => g.themes.map((x) => x.slug));
export const byDeveloper = group((g) => g.developers.map((x) => x.slug));
export const byPublisher = group((g) => g.publishers.map((x) => x.slug));
export const byMonth = group((g) => (g.date && g.precision !== 'tbd' && g.precision !== 'year' && !g.precision.startsWith('q') ? [monthKey(g.date)] : []));
export const byYear = group((g) => (g.date && g.precision !== 'tbd' ? [new Date(g.date * 1000).getUTCFullYear()] : []));

export const genreNames = new Map();
export const themeNames = new Map();
export const companyNames = new Map();
for (const g of games) {
  g.genres.forEach((x) => genreNames.set(x.slug, x.name));
  g.themes.forEach((x) => themeNames.set(x.slug, x.name));
  g.developers.concat(g.publishers).forEach((x) => companyNames.set(x.slug, x.name));
}

export const seriesBySlug = new Map(seriesList.map((s) => [s.slug, s]));

// Compact projection for lists/cards — keeps per-route JSON payloads small.
export function card(g) {
  return {
    id: g.id,
    slug: g.slug,
    name: g.name,
    cover: g.cover,
    date: g.date,
    precision: g.precision,
    platforms: g.platforms,
    type: g.type !== 'main' ? g.type : undefined,
    rating: bestRating(g)?.value ?? undefined,
    hypes: g.signals.hypes || undefined,
  };
}

export const cards = (list, n) => (n ? list.slice(0, n) : list).map(card);

const POOL = ranked.slice(0, 2500);
const similarCache = new Map();

export function similarTo(g, n = 12) {
  const key = `${g.id}:${n}`;
  if (!similarCache.has(key)) similarCache.set(key, computeSimilar(g, n));
  return similarCache.get(key);
}

function computeSimilar(g, n) {
  const fromIgdb = g.similar.map((id) => byId.get(id)).filter(Boolean);
  if (fromIgdb.length >= n) return fromIgdb.slice(0, n);
  // Top up with genre/theme overlap so every page has useful onward links.
  const genres = new Set(g.genres.map((x) => x.slug));
  const themes = new Set(g.themes.map((x) => x.slug));
  const seen = new Set([g.id, ...fromIgdb.map((x) => x.id)]);
  const extra = POOL
    .filter((x) => !seen.has(x.id))
    .map((x) => ({ x, s: x.genres.filter((k) => genres.has(k.slug)).length * 2 + x.themes.filter((k) => themes.has(k.slug)).length }))
    .filter((r) => r.s >= 3)
    .slice(0, n * 3)
    .sort((a, b) => b.s - a.s)
    .slice(0, n - fromIgdb.length)
    .map((r) => r.x);
  return fromIgdb.concat(extra);
}

export const isNewsworthy = (g) => g.score > 40;
export { DAY };
