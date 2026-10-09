// Build-time route loaders. resolve(pathname) -> { status, data } | { redirect }.
// allPaths() enumerates every page to prerender. Thin pages are never generated (thresholds below),
// which is the main defence against "scaled low-value content" signals.
import { matchPath } from 'react-router';
import { ROUTES } from '../src/routes.js';
import * as db from './db.js';
import { NOW, DAY, games, bySlug, byId, card, cards, ranked, upcoming, upcomingByHype, released, bestRating, sorters } from './db.js';
import { PLATFORMS, PLATFORM_BY_SLUG, PLATFORM_ORDER, MAJOR_PLATFORMS, platformName } from '../src/lib/platforms.js';
import { releaseLabel, MONTHS, MONTH_SLUGS, monthKey, monthPath, isoDate, plural, listJoin, truncate } from '../src/lib/format.js';
import { ogImage } from '../src/lib/images.js';
import { seo, fitTitle, gameTitle, gameDescription, gameFaq, gameJsonLd, platformAnswer, platformsPhrase, itemListLd, faqLd, websiteLd, orgLd, SITE } from './seo.js';

const YEAR = new Date(NOW * 1000).getUTCFullYear();
const NEXT = YEAR + 1;
const UPDATED = new Date(db.meta.fetchedAt || NOW * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const MIN = { hub: 6, matrix: 8, company: 4, companyScore: 40, gamesLike: 6, gamesLikeScore: 30, bestOf: 10 };

// Old slugs that changed meaning -> new location.
const GENRE_ALIASES = { rpg: 'role-playing-rpg', platformer: 'platform', sports: 'sport', simulation: 'simulator', 'card-game': 'card-board-game' };

const base = (extra = {}) => ({ builtAt: NOW, updated: UPDATED, ...extra });
const ok = (data) => ({ status: 200, data: base(data) });
const notFound = () => ({ status: 404 });
const redirect = (to) => ({ redirect: to });

const imageOf = (g) => ogImage(g?.artworks?.[0] || g?.screenshots?.[0]) || ogImage(g?.cover);
const coverPath = (g) => g?.cover;
const recent = (days) => released.filter((g) => g.date >= NOW - days * DAY);
const notCancelled = (g) => g.status !== 'cancelled';

// ---------- Game ----------

function loadGame({ slug }) {
  if (db.aliases[slug]) return redirect(`/game/${db.aliases[slug]}`);
  const g = bySlug.get(slug);
  if (!g) return notFound();
  const path = `/game/${slug}`;
  const faq = gameFaq(g, { updated: UPDATED });
  const similar = db.similarTo(g, 12);
  const devSlug = g.developers[0]?.slug;
  const moreFromDev = devSlug ? (db.byDeveloper.get(devSlug) || []).filter((x) => x.id !== g.id).sort(sorters.byScore).slice(0, 6) : [];
  const series = g.series[0] && db.seriesBySlug.get(g.series[0].slug);
  const seriesGames = series ? series.games.map((id) => byId.get(id)).filter(Boolean).sort(sorters.byDateAsc) : [];
  const anticipatedRank = g.upcoming ? upcomingByHype.findIndex((x) => x.id === g.id) + 1 : 0;
  const monthLink = g.date && ['day', 'month'].includes(g.precision) ? { path: monthPath(...ymOf(g.date)), label: `${MONTHS[ymOf(g.date)[1]]} ${ymOf(g.date)[0]}` } : null;

  const { similar: _s, signals, ...rest } = g;
  const genre = g.genres[0];
  return ok({
    game: { ...rest, signals, rating: bestRating(g) },
    availability: MAJOR_PLATFORMS.map((p) => ({ platform: p, ...platformAnswer(g, p) })),
    faq,
    similar: cards(similar, 12),
    moreFromDev: cards(moreFromDev),
    series: series ? { name: series.name, slug: series.slug, games: cards(seriesGames) } : null,
    anticipatedRank: anticipatedRank > 0 && anticipatedRank <= 100 ? anticipatedRank : null,
    monthLink,
    hasRequirements: !!g.steam?.pc?.min,
    hasGamesLike: similar.length >= MIN.gamesLike,
    seo: seo({
      path,
      title: gameTitle(g),
      description: gameDescription(g),
      image: imageOf(g),
      type: 'video.game',
      jsonLd: gameJsonLd(g, faq, path),
      breadcrumbs: [
        genre ? { name: genre.name, path: `/genre/${genre.slug}` } : { name: 'Games', path: '/upcoming' },
        { name: g.name, path },
      ],
    }),
  });
}

function ymOf(ts) {
  const d = new Date(ts * 1000);
  return [d.getUTCFullYear(), d.getUTCMonth()];
}

function loadGamesLike({ slug }) {
  if (db.aliases[slug]) return redirect(`/games-like/${db.aliases[slug]}`);
  const g = bySlug.get(slug);
  if (!g) return notFound();
  const list = db.similarTo(g, 20);
  if (list.length < MIN.gamesLike || g.score <= MIN.gamesLikeScore) return redirect(`/game/${slug}`);
  const path = `/games-like/${slug}`;
  const shared = (x) => [...x.genres.filter((a) => g.genres.some((b) => b.slug === a.slug)), ...x.themes.filter((a) => g.themes.some((b) => b.slug === a.slug))].map((t) => t.name).slice(0, 3);
  const items = list.map((x) => ({ ...card(x), summary: truncate(x.summary, 220), shared: shared(x) }));
  const top = list.slice(0, 3).map((x) => x.name);
  return ok({
    game: card(g),
    items,
    seo: seo({
      path,
      title: fitTitle([`${list.length} Best Games Like ${g.name} (${YEAR})`, `Games Like ${g.name}`]),
      description: `Loved ${g.name}? Try ${listJoin(top)} and ${list.length - 3} more games with the same ${g.genres[0]?.name.toLowerCase() || 'style'} DNA — with platforms and release dates.`,
      image: imageOf(g),
      jsonLd: [itemListLd(`Games like ${g.name}`, path, list)],
      breadcrumbs: [{ name: g.name, path: `/game/${slug}` }, { name: `Games like ${g.name}`, path }],
    }),
  });
}

function loadRequirements({ slug }) {
  if (db.aliases[slug]) return redirect(`/system-requirements/${db.aliases[slug]}`);
  const g = bySlug.get(slug);
  if (!g) return notFound();
  if (!g.steam?.pc?.min) return redirect(`/game/${slug}`);
  const path = `/system-requirements/${slug}`;
  const find = (rows, re) => rows?.find(([k]) => re.test(k))?.[1];
  const minGpu = find(g.steam.pc.min, /graphics|video/i);
  const minCpu = find(g.steam.pc.min, /processor|cpu/i);
  const minRam = find(g.steam.pc.min, /memory|ram/i);
  const faq = [
    minGpu && { q: `What graphics card do I need for ${g.name}?`, a: `Minimum: ${minGpu}.${find(g.steam.pc.rec, /graphics|video/i) ? ` Recommended: ${find(g.steam.pc.rec, /graphics|video/i)}.` : ''}` },
    minRam && { q: `How much RAM does ${g.name} need?`, a: `${g.name} needs ${minRam} at minimum${find(g.steam.pc.rec, /memory|ram/i) ? `, ${find(g.steam.pc.rec, /memory|ram/i)} recommended` : ''}.` },
    find(g.steam.pc.min, /storage|hard/i) && { q: `How big is ${g.name}?`, a: `${g.name} requires ${find(g.steam.pc.min, /storage|hard/i)}.` },
    { q: `Does ${g.name} run on Mac or Steam Deck/Linux?`, a: `${g.steam.mac ? 'Yes, there is a native macOS version.' : 'There is no native macOS version.'} ${g.steam.linux ? 'A native Linux build is available.' : 'There is no native Linux build (Proton compatibility may vary).'}` },
  ].filter(Boolean);
  return ok({
    game: { ...card(g), steamAppId: g.steamAppId, steamUrl: g.websites.steam, released: g.released },
    pc: g.steam.pc,
    mac: g.steam.mac,
    linux: g.steam.linux,
    faq,
    seo: seo({
      path,
      title: fitTitle([`${g.name} System Requirements: Minimum & Recommended PC Specs`, `${g.name} PC System Requirements`, `${g.name} System Requirements`]),
      description: `Official ${g.name} PC requirements from Steam. Minimum: ${[minCpu, minGpu, minRam].filter(Boolean).map((s) => truncate(s, 50)).join(', ')}. Recommended specs, storage and Mac/Linux support.`,
      image: imageOf(g),
      jsonLd: [faqLd(faq)],
      breadcrumbs: [{ name: g.name, path: `/game/${slug}` }, { name: 'System requirements', path }],
    }),
  });
}

function loadCanIRunIt() {
  const list = ranked.filter((g) => g.steam?.pc?.min).slice(0, 400);
  const gpu = (g) => g.steam.pc.min.find(([k]) => /graphics|video/i.test(k))?.[1] || '';
  return ok({
    items: list.map((g) => ({ ...card(g), minGpu: truncate(gpu(g), 90) })),
    seo: seo({
      path: '/can-i-run-it',
      title: fitTitle(['Can I Run It? Official PC Requirements for New Games', 'Can I Run It? PC Game Requirements']),
      description: `Check official minimum and recommended PC specs for ${list.length}+ new and upcoming games, sourced from Steam. Search any game and compare GPU, CPU and RAM.`,
      breadcrumbs: [{ name: 'Can I run it?', path: '/can-i-run-it' }],
    }),
  });
}

// ---------- Home + discovery hubs ----------

function weekRadar() {
  const start = Math.floor(NOW / DAY) * DAY;
  const days = [];
  for (let i = 0; i < 7; i++) {
    const from = start + i * DAY;
    const list = games
      .filter((g) => g.precision === 'day' && g.date >= from && g.date < from + DAY && notCancelled(g))
      .sort(sorters.byScore);
    days.push({ ts: from, total: list.length, games: cards(list, 6) });
  }
  return days;
}

function trendingList(n = 24) {
  // Blend of IGDB visits, Twitch hours watched and Steam peak players — what people are into right now.
  const s = (g) => {
    const r = (k) => (g.signals[k] ? Math.max(0, 600 - g.signals[k]) : 0);
    return r('visits') * 1.2 + r('twitchHours') + r('steamPeak') + r('playing') * 0.8 + (g.date > NOW - 60 * DAY ? 120 : 0);
  };
  return [...games].filter((g) => s(g) > 0).sort((a, b) => s(b) - s(a)).slice(0, n);
}

function loadHome() {
  const heroGame = upcomingByHype.find((g) => g.precision === 'day' && g.date - NOW < 400 * DAY && g.date > NOW) || upcomingByHype[0];
  const outNow = recent(30).filter((g) => g.score > 15).sort(sorters.byScore).slice(0, 12);
  const months = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(Date.UTC(YEAR, new Date(NOW * 1000).getUTCMonth() + i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const list = (db.byMonth.get(key) || []).filter((g) => g.date >= NOW - DAY && notCancelled(g)).sort(sorters.byScore);
    if (list.length) months.push({ label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`, path: monthPath(d.getUTCFullYear(), d.getUTCMonth()), total: list.length, games: cards(list, 6) });
  }
  const platformCounts = PLATFORM_ORDER.filter((p) => ['pc', 'ps5', 'xsx', 'switch-2', 'switch', 'mac'].includes(p)).map((p) => ({
    code: p,
    slug: PLATFORMS[p].slug,
    name: PLATFORMS[p].name,
    upcoming: (db.byPlatform.get(p) || []).filter((g) => g.upcoming).length,
  }));

  return ok({
    hero: { ...card(heroGame), artwork: heroGame.artworks[0] || heroGame.screenshots[0] || null, summary: truncate(heroGame.summary, 200), developer: heroGame.developers[0]?.name || null },
    radar: weekRadar(),
    trending: cards(trendingList(12)),
    outNow: cards(outNow),
    anticipated: cards(upcomingByHype.filter((g) => g.id !== heroGame.id).slice(0, 10)),
    months,
    platforms: platformCounts,
    stats: { games: games.length, upcoming: upcoming.length, thisYear: (db.byYear.get(YEAR) || []).length },
    seo: seo({
      path: '/',
      title: `NextPlay – Video Game Release Dates, Countdowns & Upcoming Games ${YEAR}–${NEXT}`,
      description: `Every upcoming game release date in one place: ${upcoming.length.toLocaleString('en-US')} games tracked across PS5, Xbox, Switch 2 and PC with live countdowns, release calendars and real Steam data. Updated ${UPDATED}.`,
      image: imageOf(heroGame),
      jsonLd: [websiteLd, orgLd],
    }),
  });
}

function loadUpcoming() {
  const sections = [];
  const start = new Date(NOW * 1000);
  for (let i = 0; i < 6; i++) {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    const list = (db.byMonth.get(key) || []).filter((g) => g.date >= NOW - DAY && notCancelled(g));
    if (!list.length) continue;
    const notable = [...list].sort(sorters.byScore).slice(0, 18).sort(sorters.byDateAsc);
    sections.push({ label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`, path: monthPath(d.getUTCFullYear(), d.getUTCMonth()), total: list.length, games: cards(notable) });
  }
  const tba = upcomingByHype.filter((g) => g.precision !== 'day' && g.precision !== 'month').slice(0, 24);
  const next = upcoming.filter((g) => g.precision === 'day' && g.date > NOW).sort(sorters.byDateAsc).filter((g) => g.score > 25).slice(0, 5);
  return ok({
    sections,
    tba: cards(tba),
    total: upcoming.length,
    seo: seo({
      path: '/upcoming',
      title: fitTitle([`Upcoming Video Games ${YEAR}–${NEXT}: Full Release Schedule`, `Upcoming Games ${YEAR}–${NEXT}`]),
      description: `${upcoming.length.toLocaleString('en-US')} upcoming games with release dates, month by month. Next up: ${listJoin(next.map((g) => `${g.name} (${releaseLabel(g.date, 'day')})`))}.`,
      jsonLd: [itemListLd('Upcoming video games', '/upcoming', sections.flatMap((s) => s.games))],
      breadcrumbs: [{ name: 'Upcoming games', path: '/upcoming' }],
    }),
  });
}

function loadNewReleases() {
  const list = recent(45).filter((g) => g.score > 6);
  const weeks = [];
  for (const g of list) {
    const wk = Math.floor((NOW - g.date) / (7 * DAY));
    (weeks[wk] ||= []).push(g);
  }
  const labels = ['This week', 'Last week', '2 weeks ago', '3 weeks ago', '4 weeks ago', '5 weeks ago', '6 weeks ago'];
  const top = [...list].sort(sorters.byScore).slice(0, 4);
  return ok({
    weeks: weeks.map((w, i) => (w ? { label: labels[i], games: cards(w.sort(sorters.byDateDesc)) } : null)).filter(Boolean),
    seo: seo({
      path: '/new-releases',
      title: fitTitle([`New Game Releases This Week & Month (${MONTHS[new Date(NOW * 1000).getUTCMonth()]} ${YEAR})`, `New Game Releases ${YEAR}`]),
      description: `Every new game out in the last 6 weeks on PS5, Xbox, Switch 2 and PC — including ${listJoin(top.map((g) => g.name))}. With Steam reviews and ratings.`,
      jsonLd: [itemListLd('New game releases', '/new-releases', list)],
      breadcrumbs: [{ name: 'New releases', path: '/new-releases' }],
    }),
  });
}

function loadAnticipated() {
  const list = upcomingByHype.filter(notCancelled).slice(0, 100);
  return ok({
    items: list.map((g, i) => ({ ...card(g), rank: i + 1, summary: truncate(g.summary, 180), developer: g.developers[0]?.name || null })),
    seo: seo({
      path: '/most-anticipated',
      title: fitTitle([`100 Most Anticipated Games of ${YEAR}–${NEXT} (Ranked)`, `Most Anticipated Games ${NEXT}`]),
      description: `The most anticipated upcoming games ranked by real follower hype: ${listJoin(list.slice(0, 4).map((g) => g.name))} and more — with release dates and platforms.`,
      image: imageOf(list[0]),
      jsonLd: [itemListLd('Most anticipated games', '/most-anticipated', list)],
      breadcrumbs: [{ name: 'Most anticipated', path: '/most-anticipated' }],
    }),
  });
}

function loadTrending() {
  const by = (key, n = 12, filter = () => true) =>
    games.filter((g) => g.signals[key] && filter(g)).sort((a, b) => a.signals[key] - b.signals[key]).slice(0, n);
  const players = games.filter((g) => g.steam?.players > 0).sort((a, b) => b.steam.players - a.steam.players).slice(0, 15);
  const wishlisted = by('wishlisted', 12, (g) => g.upcoming);
  const overall = trendingList(30);
  return ok({
    overall: cards(overall),
    steam: players.map((g) => ({ ...card(g), players: g.steam.players })),
    twitch: cards(by('twitchHours', 12)),
    wishlisted: cards(wishlisted),
    seo: seo({
      path: '/trending',
      title: fitTitle([`Trending Games Right Now: Most Played & Watched (${MONTHS[new Date(NOW * 1000).getUTCMonth()]} ${YEAR})`, `Trending Games Right Now`]),
      description: `What everyone is playing and watching right now: ${listJoin(overall.slice(0, 4).map((g) => g.name))}. Live Steam player counts, Twitch and wishlist charts. Updated ${UPDATED}.`,
      jsonLd: [itemListLd('Trending games', '/trending', overall)],
      breadcrumbs: [{ name: 'Trending', path: '/trending' }],
    }),
  });
}

// ---------- Release calendar ----------

const RELEASE_YEARS = () => [...db.byYear.keys()].filter((y) => y >= YEAR - 1 && y <= YEAR + 2 && db.byYear.get(y).length >= 20).sort();

function loadReleasesIndex() {
  return redirect(`/releases/${YEAR}`);
}

function loadReleasesYear({ year }) {
  const y = Number(year);
  if (!RELEASE_YEARS().includes(y)) return notFound();
  const months = MONTHS.map((name, m) => {
    const list = (db.byMonth.get(`${y}-${String(m + 1).padStart(2, '0')}`) || []).filter(notCancelled);
    return { name, path: monthPath(y, m), total: list.length, games: cards([...list].sort(sorters.byScore), 5) };
  });
  const yearList = (db.byYear.get(y) || []).filter(notCancelled);
  const fuzzy = yearList.filter((g) => !['day', 'month'].includes(g.precision)).sort(sorters.byScore);
  const biggest = [...yearList].sort(sorters.byScore).slice(0, 12);
  const past = y < YEAR || (y === YEAR);
  return ok({
    year: y,
    years: RELEASE_YEARS(),
    months,
    fuzzy: cards(fuzzy, 24),
    biggest: cards(biggest),
    total: yearList.length,
    seo: seo({
      path: `/releases/${y}`,
      title: fitTitle([`${y} Video Game Release Calendar: Every Game by Month`, `${y} Game Release Dates`]),
      description: `${yearList.length.toLocaleString('en-US')} games ${past && y < YEAR ? 'released' : 'releasing'} in ${y}, month by month, including ${listJoin(biggest.slice(0, 4).map((g) => g.name))}. Release dates for PS5, Xbox, Switch 2 and PC.`,
      jsonLd: [itemListLd(`${y} video game releases`, `/releases/${y}`, biggest)],
      breadcrumbs: [{ name: 'Release calendar', path: `/releases/${YEAR}` }, { name: String(y), path: `/releases/${y}` }],
    }),
  });
}

function loadReleasesMonth({ year, month }) {
  const y = Number(year);
  const m = MONTH_SLUGS.indexOf(month);
  if (m < 0 || !RELEASE_YEARS().includes(y)) return notFound();
  const list = (db.byMonth.get(`${y}-${String(m + 1).padStart(2, '0')}`) || []).filter(notCancelled).sort(sorters.byDateAsc);
  if (list.length < MIN.hub) return notFound();
  const dated = list.filter((g) => g.precision === 'day');
  const undated = list.filter((g) => g.precision !== 'day').sort(sorters.byScore);
  const top = [...list].sort(sorters.byScore).slice(0, 5);
  const label = `${MONTHS[m]} ${y}`;
  const prev = new Date(Date.UTC(y, m - 1, 1));
  const next = new Date(Date.UTC(y, m + 1, 1));
  const nav = (d) => (db.byMonth.get(monthKey(d.getTime() / 1000))?.length >= MIN.hub && RELEASE_YEARS().includes(d.getUTCFullYear()) ? { label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`, path: monthPath(d.getUTCFullYear(), d.getUTCMonth()) } : null);
  const isPast = Date.UTC(y, m + 1, 1) / 1000 < NOW;
  const counts = Object.fromEntries(MAJOR_PLATFORMS.concat(['switch', 'ps4', 'mac']).map((p) => [p, list.filter((g) => g.platforms.includes(p)).length]));
  return ok({
    label,
    year: y,
    month: m,
    dated: cards(dated),
    undated: cards(undated),
    counts,
    prev: nav(prev),
    next: nav(next),
    seo: seo({
      path: monthPath(y, m),
      title: fitTitle([`${label} Video Game Releases: All ${list.length} New Games`, `${label} Game Releases (PS5, Xbox, Switch, PC)`, `${label} Game Releases`]),
      description: `${isPast ? 'Every game released' : 'Every game coming out'} in ${label}: ${listJoin(top.slice(0, 4).map((g) => `${g.name}${g.precision === 'day' ? ` (${releaseLabel(g.date, 'day').replace(/, \d{4}$/, '')})` : ''}`))} and ${Math.max(0, list.length - 4)} more across PS5, Xbox, Switch 2 & PC.`,
      image: imageOf(top[0]),
      jsonLd: [itemListLd(`${label} video game releases`, monthPath(y, m), dated.concat(undated))],
      breadcrumbs: [{ name: `${y} releases`, path: `/releases/${y}` }, { name: label, path: monthPath(y, m) }],
    }),
  });
}

// Bayesian average so a 95 from 4 votes doesn't beat an 88 from 900.
function weightedRating(g) {
  const r = g.signals.critic && g.signals.criticCount >= 3 ? g.signals.critic : g.signals.rating;
  const n = g.signals.critic && g.signals.criticCount >= 3 ? g.signals.criticCount * 4 : g.signals.ratingCount;
  if (!r || !n) return 0;
  const C = 70, m = 20;
  return (n / (n + m)) * r + (m / (n + m)) * C;
}

function loadBestOf({ year }) {
  const y = Number(year);
  if (y > YEAR || y < YEAR - 2) return notFound();
  const list = (db.byYear.get(y) || []).filter((g) => g.released && g.type === 'main' && (g.signals.criticCount >= 4 || g.signals.ratingCount >= 25) && weightedRating(g) >= 72).sort((a, b) => weightedRating(b) - weightedRating(a)).slice(0, 50);
  if (list.length < MIN.bestOf) return notFound();
  return ok({
    year: y,
    items: list.map((g, i) => ({ ...card(g), rank: i + 1, ratingInfo: bestRating(g), steamReviews: g.steam?.reviews || null, summary: truncate(g.summary, 180) })),
    seo: seo({
      path: `/best-games/${y}`,
      title: fitTitle([`Best Games of ${y} So Far: ${list.length} Top-Rated Releases`, `Best Games of ${y} (Ranked)`]),
      description: `The highest-rated games of ${y}, ranked by critic and player scores: ${listJoin(list.slice(0, 4).map((g) => g.name))}. ${y === YEAR ? `Updated ${UPDATED}.` : ''}`,
      image: imageOf(list[0]),
      jsonLd: [itemListLd(`Best games of ${y}`, `/best-games/${y}`, list)],
      breadcrumbs: [{ name: `Best games of ${y}`, path: `/best-games/${y}` }],
    }),
  });
}

// ---------- Platform / genre hubs ----------

function hubData(list) {
  const up = list.filter((g) => g.upcoming && notCancelled(g));
  const dated = up.filter((g) => g.precision === 'day' && g.date > NOW).sort(sorters.byDateAsc);
  return {
    next: cards(dated.slice(0, 48)),
    anticipated: cards([...up].sort((a, b) => (b.signals.hypes || 0) - (a.signals.hypes || 0) || sorters.byScore(a, b)).slice(0, 12)),
    recent: cards(list.filter((g) => g.released && g.date > NOW - 90 * DAY).sort(sorters.byScore).slice(0, 12)),
    upcomingTotal: up.length,
    dated,
    up,
  };
}

function hubSeo({ path, name, list, h, breadcrumbs, image }) {
  const nextUp = h.dated.filter((g) => g.score > 15).slice(0, 3);
  return seo({
    path,
    title: fitTitle([`Upcoming ${name} Games ${YEAR}–${NEXT}: Release Dates & New Releases`, `Upcoming ${name} Games ${YEAR}–${NEXT}`, `Upcoming ${name} Games`]),
    description: `${h.upcomingTotal.toLocaleString('en-US')} upcoming ${name} games with release dates${nextUp.length ? `, next up: ${listJoin(nextUp.map((g) => `${g.name} (${releaseLabel(g.date, 'day').replace(/, \d{4}$/, '')})`))}` : ''}. Plus the newest ${name} releases and most anticipated.`,
    image,
    jsonLd: [itemListLd(`Upcoming ${name} games`, path, h.dated.length ? h.dated : list)],
    breadcrumbs,
  });
}

function loadPlatformIndex() {
  const items = PLATFORM_ORDER.map((p) => ({ code: p, slug: PLATFORMS[p].slug, name: PLATFORMS[p].name, upcoming: (db.byPlatform.get(p) || []).filter((g) => g.upcoming).length, total: (db.byPlatform.get(p) || []).length })).filter((p) => p.total >= MIN.hub);
  return ok({
    items,
    seo: seo({ path: '/platform', title: fitTitle(['Upcoming Games by Platform: PS5, Xbox, Switch 2, PC & More']), description: 'Browse upcoming and new games by platform — PS5, Xbox Series X|S, Nintendo Switch 2, PC, Mac, VR and mobile — with release dates.', breadcrumbs: [{ name: 'Platforms', path: '/platform' }] }),
  });
}

function loadPlatform({ slug }) {
  const code = PLATFORM_BY_SLUG[slug];
  if (!code) return notFound();
  const list = db.byPlatform.get(code) || [];
  if (list.length < MIN.hub) return notFound();
  const h = hubData(list);
  const name = PLATFORMS[code].name;
  const path = `/platform/${slug}`;
  const genres = topFacets(h.up.concat(list.filter((g) => g.released && g.date > NOW - 180 * DAY)), 'genres').filter((x) => matrixEligible(code, x.slug)).slice(0, 14);
  const { dated, up, ...rest } = h;
  return ok({
    kind: 'platform',
    code,
    name,
    ...rest,
    facets: genres.map((x) => ({ ...x, path: `/games/${slug}/${x.slug}` })),
    seo: hubSeo({ path, name: PLATFORMS[code].short === 'Xbox' ? 'Xbox Series X|S' : name, list, h, image: imageOf(h.dated.filter((g) => g.score > 20)[0]), breadcrumbs: [{ name: 'Platforms', path: '/platform' }, { name, path }] }),
  });
}

function topFacets(list, field) {
  const counts = new Map();
  list.forEach((g) => g[field].forEach((x) => counts.set(x.slug, { slug: x.slug, name: x.name, count: (counts.get(x.slug)?.count || 0) + 1 })));
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

function genreLookup(slug) {
  if (db.byGenre.has(slug)) return { list: db.byGenre.get(slug), name: db.genreNames.get(slug) };
  if (db.byTheme.has(slug)) return { list: db.byTheme.get(slug), name: db.themeNames.get(slug) };
  return null;
}

const shortGenre = (name) => name.replace(/\s*\(.*\)$/, '').replace("Hack and slash/Beat 'em up", "Hack & Slash");

function loadGenreIndex() {
  const mk = (map, names) => [...map.entries()].map(([slug, list]) => ({ slug, name: shortGenre(names.get(slug)), upcoming: list.filter((g) => g.upcoming).length, total: list.length })).filter((x) => x.total >= MIN.hub && x.slug !== 'erotic').sort((a, b) => b.upcoming - a.upcoming);
  return ok({
    genres: mk(db.byGenre, db.genreNames),
    themes: mk(db.byTheme, db.themeNames),
    seo: seo({ path: '/genre', title: fitTitle(['Upcoming Games by Genre: RPG, Shooter, Horror, Strategy & More']), description: 'Find upcoming and new games by genre and theme — RPGs, shooters, horror, open world, strategy, visual novels and more, with release dates.', breadcrumbs: [{ name: 'Genres', path: '/genre' }] }),
  });
}

function loadGenre({ slug }) {
  if (GENRE_ALIASES[slug]) return redirect(`/genre/${GENRE_ALIASES[slug]}`);
  if (slug === 'erotic') return notFound();
  const found = genreLookup(slug);
  if (!found || found.list.length < MIN.hub) return notFound();
  const h = hubData(found.list);
  const name = shortGenre(found.name);
  const path = `/genre/${slug}`;
  const platforms = MAJOR_PLATFORMS.concat(['switch', 'mac', 'ps4']).filter((p) => matrixEligible(p, slug)).map((p) => ({ slug: PLATFORMS[p].slug, name: PLATFORMS[p].name, path: `/games/${PLATFORMS[p].slug}/${slug}` }));
  const { dated, up, ...rest } = h;
  return ok({
    kind: 'genre',
    name,
    ...rest,
    facets: platforms,
    seo: hubSeo({ path, name, list: found.list, h, image: imageOf(h.dated.filter((g) => g.score > 20)[0]), breadcrumbs: [{ name: 'Genres', path: '/genre' }, { name, path }] }),
  });
}

function matrixList(code, genreSlug) {
  const found = genreLookup(genreSlug);
  if (!found) return [];
  return found.list.filter((g) => g.platforms.includes(code) && (g.upcoming || g.date > NOW - 180 * DAY));
}
const matrixEligible = (code, genreSlug) => matrixList(code, genreSlug).length >= MIN.matrix;

function loadMatrix({ platform, genre }) {
  const code = PLATFORM_BY_SLUG[platform];
  const g = GENRE_ALIASES[genre] || genre;
  if (!code) return notFound();
  if (g !== genre) return redirect(`/games/${platform}/${g}`);
  const list = matrixList(code, genre);
  if (list.length < MIN.matrix) return redirect(genreLookup(genre) ? `/genre/${genre}` : `/platform/${platform}`);
  const name = `${PLATFORMS[code].name} ${shortGenre(genreLookup(genre).name)}`;
  const path = `/games/${platform}/${genre}`;
  const h = hubData(list);
  const { dated, up, ...rest } = h;
  return ok({
    kind: 'matrix',
    name,
    ...rest,
    facets: [{ name: `All ${PLATFORMS[code].name} games`, path: `/platform/${platform}` }, { name: `All ${shortGenre(genreLookup(genre).name)} games`, path: `/genre/${genre}` }],
    seo: hubSeo({ path, name, list, h, breadcrumbs: [{ name: PLATFORMS[code].name, path: `/platform/${platform}` }, { name, path }] }),
  });
}

// ---------- Companies + series ----------

const companyEligible = (list) => list.length >= MIN.company && list.some((g) => g.score > MIN.companyScore);

function loadCompanyIndex(_, route) {
  const map = route.kind === 'developer' ? db.byDeveloper : db.byPublisher;
  const items = [...map.entries()].filter(([, l]) => companyEligible(l)).map(([slug, l]) => ({ slug, name: db.companyNames.get(slug), total: l.length, upcoming: l.filter((g) => g.upcoming).length, score: l.reduce((a, g) => a + g.score, 0) })).sort((a, b) => b.score - a.score).slice(0, 150);
  const label = route.kind === 'developer' ? 'Developers' : 'Publishers';
  return ok({
    kind: route.kind,
    items: items.map(({ score, ...x }) => x),
    seo: seo({ path: `/${route.kind}`, title: fitTitle([`Game ${label}: Upcoming & New Games by Studio`]), description: `Browse the biggest game ${label.toLowerCase()} and every upcoming and recent game they are working on, with release dates.`, breadcrumbs: [{ name: label, path: `/${route.kind}` }] }),
  });
}

function loadCompany({ slug }, route) {
  const map = route.kind === 'developer' ? db.byDeveloper : db.byPublisher;
  const list = map.get(slug);
  if (!list || !companyEligible(list)) return notFound();
  const name = db.companyNames.get(slug);
  const up = list.filter((g) => g.upcoming && notCancelled(g)).sort(sorters.byDateAsc);
  const rel = list.filter((g) => g.released).sort(sorters.byDateDesc);
  const path = `/${route.kind}/${slug}`;
  return ok({
    kind: route.kind,
    name,
    upcoming: cards(up),
    released: cards(rel, 36),
    total: list.length,
    seo: seo({
      path,
      title: fitTitle([`${name} Games: Upcoming Releases & Full List (${YEAR})`, `${name} Upcoming Games`, `${name} Games`]),
      description: `${up.length ? `${name} has ${plural(up.length, 'upcoming game')}${up[0]?.precision === 'day' ? `, next: ${up[0].name} (${releaseLabel(up[0].date, 'day')})` : ''}.` : `${name}'s games.`} See ${rel.length ? `${plural(rel.length, 'recent release')} and ` : ''}release dates for every platform.`,
      image: imageOf(up[0] || rel[0]),
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'Organization', name, url: `${SITE}${path}` }, itemListLd(`${name} games`, path, up.concat(rel))],
      breadcrumbs: [{ name: route.kind === 'developer' ? 'Developers' : 'Publishers', path: `/${route.kind}` }, { name, path }],
    }),
  });
}

function loadSeriesIndex() {
  const items = db.seriesList.map((s) => {
    const list = s.games.map((id) => byId.get(id)).filter(Boolean);
    const latest = [...list].sort(sorters.byDateDesc)[0];
    return { slug: s.slug, name: s.name, total: list.length, cover: latest?.cover, upcoming: list.filter((g) => g.upcoming).length, score: list.reduce((a, g) => a + g.score, 0) };
  }).sort((a, b) => b.score - a.score).map(({ score, ...x }) => x);
  return ok({ items, seo: seo({ path: '/series', title: fitTitle(['Game Series in Release Order: Every Franchise Timeline']), description: `${items.length} game series with every entry in release order — from ${listJoin(items.slice(0, 4).map((s) => s.name))} to indie favourites.`, breadcrumbs: [{ name: 'Series', path: '/series' }] }) });
}

function loadSeries({ slug }) {
  const s = db.seriesBySlug.get(slug);
  if (!s) return notFound();
  const list = s.games.map((id) => byId.get(id)).filter((g) => g && g.type !== 'port').sort(sorters.byDateAsc);
  if (list.length < 3) return notFound();
  const dated = list.filter((g) => g.date);
  const next = list.find((g) => g.upcoming);
  const path = `/series/${slug}`;
  const first = dated[0];
  return ok({
    name: s.name,
    items: list.map((g) => ({ ...card(g), summary: truncate(g.summary, 160), developer: g.developers[0]?.name || null })),
    next: next ? card(next) : null,
    seo: seo({
      path,
      title: fitTitle([`All ${s.name} Games in Order (Release Order, ${list.length} Games)`, `${s.name} Games in Order`]),
      description: `Every ${s.name} game in release order${first ? `, from ${first.name} (${new Date(first.date * 1000).getUTCFullYear()})` : ''}${next ? ` to the upcoming ${next.name} (${releaseLabel(next.date, next.precision)})` : ''}. ${list.length} games with platforms.`,
      image: imageOf(next || dated[dated.length - 1]),
      jsonLd: [itemListLd(`${s.name} games in order`, path, list)],
      breadcrumbs: [{ name: 'Series', path: '/series' }, { name: s.name, path }],
    }),
  });
}

// ---------- Tier list ----------

const TIER_TEMPLATES = {
  default: { year: YEAR, title: `${YEAR} Games Tier List`, pick: () => (db.byYear.get(YEAR) || []).filter((g) => g.released).sort(sorters.byScore).slice(0, 60) },
  [NEXT]: { year: NEXT, title: `Most Anticipated ${NEXT} Games Tier List`, pick: () => upcomingByHype.filter((g) => g.date && new Date(g.date * 1000).getUTCFullYear() === NEXT).slice(0, 50) },
  [YEAR - 1]: { year: YEAR - 1, title: `${YEAR - 1} Games Tier List`, pick: () => (db.byYear.get(YEAR - 1) || []).filter((g) => g.released).sort(sorters.byScore).slice(0, 60) },
};

function loadTierList({ template }) {
  const key = template ? String(template) : 'default';
  if (template && String(template) === String(YEAR)) return redirect('/tier-list');
  const t = TIER_TEMPLATES[key];
  if (!t) return notFound();
  const list = t.pick();
  const path = template ? `/tier-list/${template}` : '/tier-list';
  return ok({
    title: t.title,
    key,
    pool: list.map((g) => ({ id: g.id, slug: g.slug, name: g.name, cover: g.cover })),
    templates: Object.entries(TIER_TEMPLATES).map(([k, v]) => ({ path: k === 'default' ? '/tier-list' : `/tier-list/${k}`, title: v.title })),
    seo: seo({
      path,
      title: fitTitle([`${t.title} Maker – Rank ${list.length} Games (S to F)`, `${t.title} Maker`]),
      description: `Make your ${t.title.toLowerCase()}: drag ${list.length} games including ${listJoin(list.slice(0, 3).map((g) => g.name))} into S–F tiers, then download or share it as an image. Free, no sign-up.`,
      image: imageOf(list[0]),
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: `${t.title} Maker`, url: `${SITE}${path}`, applicationCategory: 'GameApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' } }],
      breadcrumbs: [{ name: 'Tier list maker', path }],
    }),
  });
}

// ---------- Articles + static ----------

function articleList(section) {
  return section === 'news' ? db.news : db.blog;
}

function loadArticles(_, route) {
  const list = articleList(route.section);
  const label = route.section === 'news' ? 'News' : 'Blog';
  return ok({
    section: route.section,
    items: list.map(({ content, ...a }) => a),
    seo: seo({ path: `/${route.section}`, title: fitTitle([`Gaming ${label} & Features`]), description: `NextPlay ${label.toLowerCase()}: release breakdowns, features and opinion on the biggest games.`, breadcrumbs: [{ name: label, path: `/${route.section}` }] }),
  });
}

function loadArticle({ slug }, route) {
  const a = articleList(route.section).find((x) => x.slug === slug);
  if (!a) return notFound();
  const path = `/${route.section}/${slug}`;
  // Link the article to the live game pages it covers so readers get current dates.
  const mentioned = ranked.filter((g) => g.score > 30 && (a.tags || []).concat(a.title).some((t) => t.toLowerCase().includes(g.name.toLowerCase()) || g.name.toLowerCase() === t.toLowerCase())).slice(0, 4);
  return ok({
    section: route.section,
    article: a,
    related: cards(mentioned),
    seo: seo({
      path,
      title: fitTitle([a.title]),
      description: a.excerpt,
      type: 'article',
      jsonLd: [{ '@context': 'https://schema.org', '@type': route.section === 'news' ? 'NewsArticle' : 'BlogPosting', headline: a.title, description: a.excerpt, datePublished: a.publishedDate, dateModified: a.modifiedDate || a.publishedDate, author: { '@type': 'Person', name: a.author || 'Divik', url: `${SITE}/about` }, publisher: { '@id': `${SITE}/#org` }, image: a.image, mainEntityOfPage: `${SITE}${path}` }],
      breadcrumbs: [{ name: route.section === 'news' ? 'News' : 'Blog', path: `/${route.section}` }, { name: a.title, path }],
    }),
  });
}

function staticPage(path, title, description, extra = {}) {
  return () => ok({ ...extra, seo: seo({ path, title: fitTitle([title]), description, breadcrumbs: [{ name: title, path }], noindex: extra.noindex }) });
}

const LOADERS = {
  home: loadHome,
  game: loadGame,
  gamesLike: loadGamesLike,
  requirements: loadRequirements,
  canIRunIt: loadCanIRunIt,
  upcoming: loadUpcoming,
  newReleases: loadNewReleases,
  anticipated: loadAnticipated,
  trending: loadTrending,
  releasesIndex: loadReleasesIndex,
  releasesYear: loadReleasesYear,
  releasesMonth: loadReleasesMonth,
  bestOf: loadBestOf,
  platformIndex: loadPlatformIndex,
  platform: loadPlatform,
  genreIndex: loadGenreIndex,
  genre: loadGenre,
  matrix: loadMatrix,
  companyIndex: loadCompanyIndex,
  company: loadCompany,
  seriesIndex: loadSeriesIndex,
  series: loadSeries,
  tierList: loadTierList,
  articles: loadArticles,
  article: loadArticle,
  watchlist: staticPage('/watchlist', 'Your Watchlist', 'Games you are tracking on NextPlay.', { noindex: true }),
  search: staticPage('/search', 'Search Games', 'Search release dates for thousands of games.', { noindex: true }),
  about: staticPage('/about', 'About NextPlay', 'NextPlay is an independent video game release tracker built by a gamer, powered by IGDB and Steam data and refreshed daily.', { stats: () => null }),
  contact: staticPage('/contact', 'Contact', 'Get in touch with NextPlay — corrections, release date tips and partnerships.'),
  legal: null,
};

const LEGAL = { privacy: 'Privacy Policy', terms: 'Terms of Service', disclaimer: 'Disclaimer' };

// ---------- Public API ----------

export function resolve(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  for (const route of ROUTES) {
    const m = matchPath({ path: route.path, end: true }, clean);
    if (!m) continue;
    if (route.page === 'legal') return ok({ doc: route.doc, seo: seo({ path: clean, title: fitTitle([LEGAL[route.doc]]), description: `NextPlay ${LEGAL[route.doc].toLowerCase()}.`, breadcrumbs: [{ name: LEGAL[route.doc], path: clean }] }) });
    if (route.page === 'about') {
      const r = LOADERS.about();
      r.data.stats = { games: games.length, upcoming: upcoming.length, series: db.seriesList.length };
      return r;
    }
    return LOADERS[route.page](m.params, route);
  }
  return notFound();
}

export function allPaths() {
  const paths = new Set(['/', '/upcoming', '/new-releases', '/most-anticipated', '/trending', '/can-i-run-it', '/platform', '/genre', '/developer', '/publisher', '/series', '/tier-list', '/watchlist', '/search', '/news', '/blog', '/about', '/contact', '/privacy', '/terms', '/disclaimer']);
  games.forEach((g) => {
    paths.add(`/game/${g.slug}`);
    if (g.score > MIN.gamesLikeScore && db.similarTo(g, 20).length >= MIN.gamesLike) paths.add(`/games-like/${g.slug}`);
    if (g.steam?.pc?.min) paths.add(`/system-requirements/${g.slug}`);
  });
  RELEASE_YEARS().forEach((y) => {
    paths.add(`/releases/${y}`);
    MONTH_SLUGS.forEach((m, i) => (db.byMonth.get(`${y}-${String(i + 1).padStart(2, '0')}`) || []).length >= MIN.hub && paths.add(`/releases/${y}/${m}`));
  });
  [YEAR - 2, YEAR - 1, YEAR].forEach((y) => paths.add(`/best-games/${y}`));
  PLATFORM_ORDER.forEach((p) => paths.add(`/platform/${PLATFORMS[p].slug}`));
  [...db.byGenre.keys(), ...db.byTheme.keys()].forEach((s) => {
    paths.add(`/genre/${s}`);
    PLATFORM_ORDER.forEach((p) => matrixEligible(p, s) && paths.add(`/games/${PLATFORMS[p].slug}/${s}`));
  });
  for (const [kind, map] of [['developer', db.byDeveloper], ['publisher', db.byPublisher]]) map.forEach((l, s) => companyEligible(l) && paths.add(`/${kind}/${s}`));
  db.seriesList.forEach((s) => paths.add(`/series/${s.slug}`));
  Object.keys(TIER_TEMPLATES).filter((k) => k !== 'default').forEach((k) => paths.add(`/tier-list/${k}`));
  db.news.forEach((a) => paths.add(`/news/${a.slug}`));
  db.blog.forEach((a) => paths.add(`/blog/${a.slug}`));
  return [...paths];
}

// Lightweight search index (lazy-loaded by the search dialog).
export function searchIndex() {
  return ranked.map((g) => [g.slug, g.name, g.cover, g.date && g.precision !== 'tbd' ? new Date(g.date * 1000).getUTCFullYear() : null, g.platforms.filter((p) => MAJOR_PLATFORMS.includes(p) || p === 'switch').join(' ')]);
}

export { YEAR, NEXT, UPDATED };
