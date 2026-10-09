// Builds data/db/{games,signals,collections,meta}.json from IGDB.
// Usage: node --env-file=.env scripts/data/fetch-igdb.mjs
//
// Selection (deduplicated):
//   1. upcoming games with any hype, dated or TBA
//   2. games released in the last 12 months with real interest
//   3. IGDB/Steam/Twitch popularity charts (what people are playing & watching now)
//   4. every slug the site has served before, so ranked URLs never break
//   5. "similar games" + series entries of the most popular games (powers games-like & series pages)

import fs from 'node:fs';
import path from 'node:path';
import { assertCredentials, igdb, igdbAll, igdbByIds } from './igdb.mjs';

assertCredentials();

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'data/db');
fs.mkdirSync(OUT, { recursive: true });

const NOW = Math.floor(Date.now() / 1000);
const DAY = 86400;
const GAME_TYPES = '(0,4,8,9,10,11)'; // main, standalone expansion, remake, remaster, expanded, port

const FIELDS = [
  'name', 'slug', 'summary', 'storyline', 'first_release_date', 'game_type', 'game_status', 'updated_at',
  'hypes', 'rating', 'rating_count', 'aggregated_rating', 'aggregated_rating_count', 'total_rating_count',
  'cover.image_id', 'artworks.image_id', 'screenshots.image_id', 'videos.video_id', 'videos.name',
  'genres.name', 'genres.slug', 'themes.name', 'themes.slug', 'game_modes.name', 'player_perspectives.name', 'game_engines.name',
  'franchises.name', 'franchises.slug', 'collections.name', 'collections.slug',
  'involved_companies.company.name', 'involved_companies.company.slug', 'involved_companies.developer', 'involved_companies.publisher',
  'platforms',
  'release_dates.date', 'release_dates.platform', 'release_dates.date_format', 'release_dates.release_region.region', 'release_dates.status',
  'websites.url', 'websites.type', 'external_games.uid', 'external_games.external_game_source',
  'similar_games', 'parent_game.name', 'parent_game.slug', 'version_parent',
  'age_ratings.organization.name', 'age_ratings.rating_category.rating',
  'alternative_names.name',
].join(',');

// IGDB platform id -> our canonical short code. Anything else is dropped from display.
export const PLATFORMS = {
  6: 'pc', 167: 'ps5', 169: 'xsx', 130: 'switch', 508: 'switch-2', 48: 'ps4', 49: 'xone',
  14: 'mac', 3: 'linux', 34: 'android', 39: 'ios', 82: 'browser', 163: 'steamvr',
  386: 'quest-2', 471: 'quest-3', 390: 'psvr2',
  // legacy (display only)
  9: 'ps3', 8: 'ps2', 7: 'ps1', 38: 'psp', 46: 'vita', 12: 'x360', 11: 'xbox', 41: 'wiiu', 5: 'wii', 37: '3ds', 20: 'ds', 21: 'gc', 4: 'n64', 24: 'gba', 19: 'snes', 18: 'nes', 23: 'dc',
};

const DATE_PRECISION = { 0: 'day', 1: 'month', 2: 'year', 3: 'q1', 4: 'q2', 5: 'q3', 6: 'q4', 7: 'tbd' };
const GAME_TYPE = { 0: 'main', 4: 'standalone', 8: 'remake', 9: 'remaster', 10: 'expanded', 11: 'port' };
const GAME_STATUS = { 0: 'released', 2: 'alpha', 3: 'beta', 4: 'early-access', 5: 'offline', 6: 'cancelled', 7: 'rumored', 8: 'delisted' };
const WEBSITE = { 1: 'official', 3: 'wikipedia', 5: 'twitter', 9: 'youtube', 13: 'steam', 14: 'reddit', 15: 'itch', 16: 'epic', 17: 'gog', 18: 'discord', 19: 'bluesky', 22: 'xbox', 23: 'playstation', 24: 'nintendo', 25: 'meta' };

const log = (...a) => console.log('[igdb]', ...a);

async function collectIds() {
  const ids = new Set();
  const add = (rows, label) => {
    const before = ids.size;
    rows.forEach((r) => ids.add(r.game_id ?? r.id));
    log(`${label}: ${rows.length} rows, +${ids.size - before} new`);
  };

  add(await igdbAll('games', 'id', `first_release_date > ${NOW} & game_type = ${GAME_TYPES} & hypes >= 1`, 'hypes desc', 2500), 'upcoming (dated)');
  add(await igdbAll('games', 'id', `first_release_date = null & hypes >= 2 & game_type = ${GAME_TYPES} & game_status != (6,8)`, 'hypes desc', 500), 'upcoming (TBA)');
  add(await igdbAll('games', 'id', `first_release_date >= ${NOW - 365 * DAY} & first_release_date <= ${NOW} & game_type = ${GAME_TYPES} & cover != null & (hypes >= 2 | total_rating_count >= 3)`, 'hypes desc', 2000), 'released last 12 months');

  // Popularity charts. 1 visits, 2 want-to-play, 3 playing, 5 steam 24h peak, 9 top sellers, 10 most wishlisted, 34 twitch hours watched
  for (const type of [1, 2, 3, 5, 9, 10, 34]) {
    add(await igdb('popularity_primitives', `fields game_id; where popularity_type = ${type}; sort value desc; limit 250;`), `popularity type ${type}`);
  }

  // Legacy slugs from the previous site + Search Console, so no URL with impressions disappears.
  const aliases = JSON.parse(fs.readFileSync(path.join(OUT, 'slug-aliases.json'), 'utf8'));
  const legacy = [...JSON.parse(fs.readFileSync(path.join(OUT, 'legacy-slugs.json'), 'utf8')), ...Object.values(aliases)];
  for (let i = 0; i < legacy.length; i += 200) {
    const part = legacy.slice(i, i + 200).map((s) => `"${s}"`).join(',');
    add(await igdb('games', `fields id; where slug = (${part}); limit 200;`), `legacy slugs ${i}`);
  }
  return ids;
}

async function fetchPopularity(ids) {
  // Per-game signals for ranking + "trending" surfaces. Values are normalised shares, so we rank within type.
  const signals = {};
  for (const [type, key] of [[1, 'visits'], [2, 'wantToPlay'], [3, 'playing'], [5, 'steamPeak'], [10, 'wishlisted'], [34, 'twitchHours']]) {
    const rows = await igdbAll('popularity_primitives', 'game_id,value', `popularity_type = ${type}`, 'value desc', 1500);
    rows.forEach((r, rank) => {
      if (!ids.has(r.game_id)) return;
      (signals[r.game_id] ||= {})[key] = rank + 1;
    });
  }
  return signals;
}

function img(id) {
  return id?.image_id || null;
}

function normalise(g) {
  const releases = [];
  const seen = new Set();
  for (const r of g.release_dates || []) {
    const platform = PLATFORMS[r.platform];
    if (!platform) continue;
    const region = r.release_region?.region || 'worldwide';
    const key = `${platform}:${region}`;
    if (seen.has(key)) continue;
    seen.add(key);
    releases.push({ platform, date: r.date || null, precision: DATE_PRECISION[r.date_format] ?? 'day', region, early: r.status === 3 || r.status === 34 || undefined });
  }
  // Prefer worldwide/NA entries for the per-platform headline date.
  const regionRank = { worldwide: 0, north_america: 1, europe: 2 };
  releases.sort((a, b) => (regionRank[a.region] ?? 9) - (regionRank[b.region] ?? 9));

  const firstRelease = releases.find((r) => r.date && r.date === g.first_release_date) || null;
  const precision = g.first_release_date ? firstRelease?.precision || 'day' : 'tbd';

  const companies = g.involved_companies || [];
  const company = (c) => ({ name: c.company.name, slug: c.company.slug });
  const websites = {};
  for (const w of g.websites || []) {
    const t = WEBSITE[w.type];
    if (t && !websites[t]) websites[t] = w.url;
  }
  const steamAppId = (g.external_games || []).find((e) => e.external_game_source === 1)?.uid || websites.steam?.match(/app\/(\d+)/)?.[1] || null;

  const ageRatings = {};
  for (const a of g.age_ratings || []) {
    const org = a.organization?.name;
    if (['ESRB', 'PEGI'].includes(org) && a.rating_category?.rating) ageRatings[org] = a.rating_category.rating;
  }

  return {
    id: g.id,
    slug: g.slug,
    name: g.name,
    aka: (g.alternative_names || []).map((a) => a.name).filter((n) => /^[\x20-\x7E]+$/.test(n)).slice(0, 4),
    summary: g.summary || '',
    storyline: g.storyline || '',
    type: GAME_TYPE[g.game_type] || 'main',
    status: GAME_STATUS[g.game_status] || null,
    date: g.first_release_date || null,
    precision,
    releases,
    platforms: [...new Set(releases.map((r) => r.platform).concat((g.platforms || []).map((p) => PLATFORMS[p]).filter(Boolean)))],
    cover: img(g.cover),
    artworks: (g.artworks || []).map(img).slice(0, 4),
    screenshots: (g.screenshots || []).map(img).slice(0, 8),
    videos: (g.videos || []).slice(0, 4).map((v) => ({ id: v.video_id, name: v.name })),
    genres: (g.genres || []).map((x) => ({ name: x.name, slug: x.slug })),
    themes: (g.themes || []).map((x) => ({ name: x.name, slug: x.slug })),
    modes: (g.game_modes || []).map((x) => x.name),
    perspectives: (g.player_perspectives || []).map((x) => x.name),
    engines: (g.game_engines || []).map((x) => x.name),
    franchise: g.franchises?.[0] ? { name: g.franchises[0].name, slug: g.franchises[0].slug } : null,
    series: (g.collections || []).map((c) => ({ name: c.name, slug: c.slug, id: c.id })),
    developers: companies.filter((c) => c.developer && c.company).map(company),
    publishers: companies.filter((c) => c.publisher && c.company).map(company),
    websites,
    steamAppId,
    ageRatings,
    parent: g.parent_game ? { name: g.parent_game.name, slug: g.parent_game.slug } : null,
    similar: g.similar_games || [],
  };
}

function volatile(g, pop) {
  return {
    hypes: g.hypes || 0,
    rating: g.rating ? Math.round(g.rating) : null,
    ratingCount: g.rating_count || 0,
    critic: g.aggregated_rating ? Math.round(g.aggregated_rating) : null,
    criticCount: g.aggregated_rating_count || 0,
    votes: g.total_rating_count || 0,
    ...(pop || {}),
  };
}

async function main() {
  const started = Date.now();
  const ids = await collectIds();
  log(`core ids: ${ids.size}`);

  let raw = await igdbByIds('games', FIELDS, [...ids]);
  log(`fetched core: ${raw.length}`);

  // Expansion: similar games + series siblings for the most popular core games.
  const byInterest = [...raw].sort((a, b) => (b.hypes || 0) + (b.total_rating_count || 0) - ((a.hypes || 0) + (a.total_rating_count || 0)));
  const extra = new Set();
  byInterest.slice(0, 900).forEach((g) => (g.similar_games || []).slice(0, 8).forEach((id) => !ids.has(id) && extra.add(id)));

  const collectionIds = new Set();
  byInterest.slice(0, 600).forEach((g) => (g.collections || []).forEach((c) => collectionIds.add(c.id)));
  const collections = await igdbByIds('collections', 'name,slug,games', [...collectionIds], 200);
  const seriesMembers = await igdbByIds('games', 'id,game_type,cover', collections.flatMap((c) => c.games || []), 400);
  seriesMembers.filter((m) => m.cover && [0, 8, 9, 4].includes(m.game_type) && !ids.has(m.id)).forEach((m) => extra.add(m.id));
  log(`expansion ids: ${extra.size} from ${collections.length} series`);

  raw = raw.concat(await igdbByIds('games', FIELDS, [...extra]));
  raw = raw.filter((g) => g.cover && g.slug && g.name);
  log(`total games: ${raw.length}`);

  const allIds = new Set(raw.map((g) => g.id));
  const pop = await fetchPopularity(allIds);

  const games = raw.map(normalise).map((g) => ({ ...g, similar: g.similar.filter((id) => allIds.has(id)) }));
  games.sort((a, b) => a.id - b.id);

  const signals = {};
  raw.forEach((g) => (signals[g.id] = volatile(g, pop[g.id])));

  const series = collections
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, games: (c.games || []).filter((id) => allIds.has(id)) }))
    .filter((c) => c.games.length >= 3)
    .sort((a, b) => a.id - b.id);

  // One record per line keeps git diffs (and repo growth) small on daily refreshes.
  const lines = (arr) => '[\n' + arr.map((x) => JSON.stringify(x)).join(',\n') + '\n]\n';
  fs.writeFileSync(path.join(OUT, 'games.json'), lines(games));
  fs.writeFileSync(path.join(OUT, 'series.json'), lines(series));
  fs.writeFileSync(path.join(OUT, 'signals.json'), JSON.stringify(signals));
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), games: games.length, series: series.length }, null, 2) + '\n');
  log(`done: ${games.length} games, ${series.length} series in ${Math.round((Date.now() - started) / 1000)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
