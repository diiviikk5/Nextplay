// Markdown versions of every public page, rendered from the same loader data as the HTML (server/loaders.js).
// Adding a page type = adding one entry to RENDERERS (or SKIP, with a reason). The build fails otherwise.
import { matchPath } from 'react-router';
import { ROUTES } from '../../src/routes.js';
import { BRAND, CONTACT, FOUNDED, SOURCES } from '../../src/lib/site.js';
import { LEGAL } from '../../src/lib/legal.js';
import { releaseLabel, plural } from '../../src/lib/format.js';
import { platformName } from '../../src/lib/platforms.js';
import { resolve, allPaths } from '../loaders.js';
import { link, h2, h3, list, table, faq, platforms, gameLine, gameList, isoDay, doc } from './format.js';

// Routes that never get a markdown version.
export const SKIP = {
  releasesIndex: 'Always redirects to the current year calendar.',
  watchlist: 'Personal list stored in the visitor’s browser; noindex.',
  search: 'Query results page; noindex.',
};

// Same store list and labels as src/pages/Game.jsx.
const STORES = { steam: 'Steam', playstation: 'PlayStation Store', xbox: 'Xbox Store', nintendo: 'Nintendo eShop', epic: 'Epic Games Store', gog: 'GOG', itch: 'itch.io', meta: 'Meta Quest Store', official: 'Official website' };

const section = (title, body) => (body ? `${h2(title)}\n\n${body}` : '');
const when = (g) => (g.status === 'cancelled' ? 'Cancelled' : releaseLabel(g.date, g.precision, { long: true }));
const reqTable = (rows) => table(['Component', 'Requirement'], rows || []);

const RENDERERS = {
  home(d) {
    const h = d.hero;
    return {
      sections: [
        section('Next big release', `${gameLine(h)}${h.developer ? ` · by ${h.developer}` : ''}\n\n${h.summary || ''}`),
        section(
          'Release radar: next 7 days',
          d.radar.map((day) => `${h3(`${isoDay(day.ts)} (${plural(day.total, 'release')})`)}\n\n${gameList(day.games) || 'No dated releases.'}`).join('\n\n')
        ),
        section('Trending now', gameList(d.trending)),
        section('Out now', gameList(d.outNow)),
        section('Most anticipated', gameList(d.anticipated)),
        ...d.months.map((m) => section(`${m.label} (${plural(m.total, 'game')})`, `${gameList(m.games)}\n\n${link(`All ${m.label} releases`, m.path)}`)),
        section('Upcoming games by platform', list(d.platforms.map((p) => `${link(p.name, `/platform/${p.slug}`)} - ${p.upcoming} upcoming`))),
        `${BRAND} tracks ${d.stats.games.toLocaleString('en-US')} games, ${d.stats.upcoming.toLocaleString('en-US')} of them upcoming. ${SOURCES} Refreshed daily.`,
      ],
      related: [
        { name: 'Upcoming games', path: '/upcoming' },
        { name: 'Most anticipated games', path: '/most-anticipated' },
        { name: 'New releases', path: '/new-releases' },
        { name: 'Trending games', path: '/trending' },
      ],
    };
  },

  game(d, _route, { compact } = {}) {
    const g = d.game;
    const steam = g.steam;
    const releases = (g.releases || []).map((r) => [platformName(r.platform), releaseLabel(r.date, r.precision, { long: true }), r.region || 'worldwide']);
    const details = [
      ['Developer', g.developers.map((x) => x.name).join(', ')],
      ['Publisher', g.publishers.map((x) => x.name).join(', ')],
      ['Platforms', platforms(g.platforms)],
      ['Genres', g.genres.map((x) => x.name).join(', ')],
      ['Themes', g.themes.map((x) => x.name).join(', ')],
      ['Game modes', g.modes.join(', ')],
      ['Perspective', g.perspectives.join(', ')],
      ['Engine', g.engines.join(', ')],
      ['Series', d.series?.name],
      ['Age rating', [g.ageRatings?.ESRB && `ESRB ${g.ageRatings.ESRB}`, g.ageRatings?.PEGI && `PEGI ${g.ageRatings.PEGI}`].filter(Boolean).join(', ')],
    ].filter(([, v]) => v);
    const scores = [
      g.rating && ['Rating', `${g.rating.value}/100 (${g.rating.label}, ${plural(g.rating.count, 'review')})`],
      steam?.reviews && ['Steam reviews', `${steam.reviews.label} (${Math.round((steam.reviews.positive / steam.reviews.total) * 100)}% of ${steam.reviews.total.toLocaleString('en-US')} positive)`],
      steam?.price && ['Steam price', steam.free ? 'Free to play' : `$${steam.price.final}${steam.price.discount ? ` (${steam.price.discount}% off)` : ''}`],
      steam?.players && ['Playing on Steam now', steam.players.toLocaleString('en-US')],
    ].filter(Boolean);
    const stores = Object.entries(STORES).filter(([k]) => g.websites[k]);
    return {
      sections: [
        section(
          'Release date',
          `**${when(g)}**${g.early ? ' (Early Access)' : ''}${d.anticipatedRank ? ` · #${d.anticipatedRank} most anticipated` : ''}\n\n${table(['Platform', 'Release date', 'Region'], releases)}`
        ),
        section('Platform availability', list(d.availability.map((a) => `**${platformName(a.platform)}:** ${a.text}`))),
        section('About', [g.summary, g.storyline].filter(Boolean).join('\n\n')),
        section('Details', table(['', ''], details)),
        section('Ratings and price', table(['', ''], scores)),
        section('Where to buy', list(stores.map(([k, name]) => `[${name}](${g.websites[k]})`))),
        section('FAQ', faq(d.faq)),
        !compact && section('Similar games', gameList(d.similar)),
        !compact && d.series && section(`${d.series.name} series`, gameList(d.series.games)),
        !compact && d.moreFromDev.length && section(`More from ${g.developers[0]?.name}`, gameList(d.moreFromDev)),
      ],
      related: [
        d.hasRequirements && { name: `${g.name} system requirements`, path: `/system-requirements/${g.slug}` },
        d.hasGamesLike && { name: `Games like ${g.name}`, path: `/games-like/${g.slug}` },
        d.series && { name: `${d.series.name} games in order`, path: `/series/${d.series.slug}` },
        d.monthLink && { name: `${d.monthLink.label} releases`, path: d.monthLink.path },
        g.developers[0] && { name: `${g.developers[0].name} games`, path: `/developer/${g.developers[0].slug}` },
        g.genres[0] && { name: `${g.genres[0].name} games`, path: `/genre/${g.genres[0].slug}` },
      ],
    };
  },

  gamesLike(d) {
    return {
      sections: [
        `Games with the same genres and themes as ${link(d.game.name, `/game/${d.game.slug}`)}, best matches first.`,
        d.items.map((x, i) => `${h3(`${i + 1}. ${x.name}`)}\n\n${gameLine(x)}${x.shared.length ? `\n\nShared: ${x.shared.join(', ')}` : ''}\n\n${x.summary}`).join('\n\n'),
      ],
      related: [{ name: d.game.name, path: `/game/${d.game.slug}` }],
    };
  },

  requirements(d) {
    const g = d.game;
    return {
      sections: [
        `Official requirements from Steam for ${link(g.name, `/game/${g.slug}`)}.`,
        section('Minimum PC requirements', reqTable(d.pc.min)),
        section('Recommended PC requirements', reqTable(d.pc.rec)),
        section('Mac and Linux', `${d.mac ? 'Native macOS version: yes.' : 'Native macOS version: no.'} ${d.linux ? 'Native Linux version: yes.' : 'Native Linux version: no.'}`),
        d.mac?.min && section('Minimum Mac requirements', reqTable(d.mac.min)),
        section('FAQ', faq(d.faq)),
      ],
      related: [{ name: g.name, path: `/game/${g.slug}` }, g.steamUrl && { name: `${g.name} on Steam`, path: g.steamUrl }, { name: 'Can I run it?', path: '/can-i-run-it' }],
    };
  },

  canIRunIt(d) {
    return {
      sections: [
        'Official minimum graphics cards for new and popular PC games, from Steam. Each game links to its full minimum and recommended specs.',
        list(d.items.map((x) => `${link(x.name, `/system-requirements/${x.slug}`)} - minimum GPU: ${x.minGpu || 'not listed'}`)),
      ],
    };
  },

  upcoming(d) {
    return {
      sections: [
        `${d.total.toLocaleString('en-US')} upcoming games tracked. The most notable releases for each of the next six months:`,
        ...d.sections.map((s) => section(`${s.label} (${plural(s.total, 'game')})`, `${gameList(s.games)}\n\n${link(`All ${s.label} releases`, s.path)}`)),
        section('Announced, no exact date yet', gameList(d.tba)),
      ],
      related: [{ name: 'Most anticipated games', path: '/most-anticipated' }, { name: 'New releases', path: '/new-releases' }],
    };
  },

  newReleases(d) {
    return { sections: d.weeks.map((w) => section(w.label, gameList(w.games))), related: [{ name: 'Upcoming games', path: '/upcoming' }] };
  },

  anticipated(d) {
    return {
      sections: ['Ranked by the number of people following each game on IGDB.', d.items.map((x) => `${h3(`${x.rank}. ${x.name}`)}\n\n${gameLine(x)}${x.developer ? ` · by ${x.developer}` : ''}\n\n${x.summary}`).join('\n\n')],
      related: [{ name: 'Upcoming games', path: '/upcoming' }],
    };
  },

  trending(d) {
    return {
      sections: [
        section('Trending overall', gameList(d.overall)),
        section('Most played on Steam right now', list(d.steam.map((x) => gameLine(x, `${x.players.toLocaleString('en-US')} playing`)))),
        section('Most watched on Twitch', gameList(d.twitch)),
        section('Most wishlisted upcoming games', gameList(d.wishlisted)),
      ],
    };
  },

  releasesYear(d) {
    return {
      sections: [
        `${d.total.toLocaleString('en-US')} games in ${d.year}.`,
        section(`Biggest games of ${d.year}`, gameList(d.biggest)),
        section('By month', d.months.map((m) => `${h3(`${link(m.name, m.path)} (${plural(m.total, 'game')})`)}\n\n${gameList(m.games) || 'No releases listed.'}`).join('\n\n')),
        section(`${d.year}, no exact date yet`, gameList(d.fuzzy)),
      ],
      related: d.years.filter((y) => y !== d.year).map((y) => ({ name: `${y} releases`, path: `/releases/${y}` })),
    };
  },

  releasesMonth(d) {
    const byDay = new Map();
    d.dated.forEach((g) => byDay.set(isoDay(g.date), [...(byDay.get(isoDay(g.date)) || []), g]));
    return {
      sections: [
        section('Release dates', [...byDay].map(([day, gs]) => `${h3(day)}\n\n${gameList(gs)}`).join('\n\n')),
        section(`${d.label}, no exact day yet`, gameList(d.undated)),
      ],
      related: [d.prev && { name: d.prev.label, path: d.prev.path }, d.next && { name: d.next.label, path: d.next.path }, { name: `${d.year} releases`, path: `/releases/${d.year}` }],
    };
  },

  bestOf(d) {
    return {
      sections: [
        'Ranked by critic average where there are enough reviews, otherwise by player score.',
        list(d.items.map((x) => `${x.rank}. ${gameLine(x)}${x.ratingInfo ? ` (${x.ratingInfo.label})` : ''}${x.steamReviews ? ` · Steam: ${x.steamReviews.label}` : ''}`)),
      ],
    };
  },

  platformIndex(d) {
    return { sections: [list(d.items.map((p) => `${link(p.name, `/platform/${p.slug}`)} - ${p.upcoming} upcoming, ${p.total} total`))] };
  },

  platform: hub,
  genre: hub,
  matrix: hub,

  genreIndex(d) {
    const row = (x) => `${link(x.name, `/genre/${x.slug}`)} - ${x.upcoming} upcoming, ${x.total} total`;
    return { sections: [section('Genres', list(d.genres.map(row))), section('Themes', list(d.themes.map(row)))] };
  },

  companyIndex(d) {
    return { sections: [list(d.items.map((x) => `${link(x.name, `/${d.kind}/${x.slug}`)} - ${x.upcoming} upcoming, ${x.total} total`))] };
  },

  company(d) {
    return { sections: [section('Upcoming games', gameList(d.upcoming)), section('Released games', gameList(d.released))] };
  },

  seriesIndex(d) {
    return { sections: [list(d.items.map((x) => `${link(x.name, `/series/${x.slug}`)} - ${plural(x.total, 'game')}${x.upcoming ? `, ${x.upcoming} upcoming` : ''}`))] };
  },

  series(d) {
    return {
      sections: [
        d.next && `Next in the series: ${gameLine(d.next)}`,
        section('All games in release order', list(d.items.map((x, i) => `${i + 1}. ${gameLine(x)}${x.developer ? ` · by ${x.developer}` : ''}`))),
      ],
      related: [{ name: 'All game series', path: '/series' }],
    };
  },

  tierList(d) {
    return {
      sections: [
        'A free tier list maker: drag each game into tiers S to F, then share a link or download an image. The games in this template:',
        list(d.pool.map((g) => link(g.name, `/game/${g.slug}`))),
      ],
      related: d.templates.map((t) => ({ name: t.title, path: t.path })),
    };
  },

  articles(d) {
    return { sections: [list(d.items.map((a) => `${link(a.title, `/${d.section}/${a.slug}`)} - ${a.publishedDate}: ${a.excerpt}`))] };
  },

  article(d) {
    const a = d.article;
    return {
      sections: [
        `By ${a.author} · Published ${a.publishedDate}`,
        `**Heads up:** this article is from ${a.publishedDate} and details may have changed.${d.related.length ? ' The game pages below always show the latest release dates.' : ''}`,
        a.content.trim(),
        d.related.length && section('Games in this article', gameList(d.related)),
      ],
      related: [{ name: d.section === 'news' ? 'All news' : 'All blog posts', path: `/${d.section}` }],
    };
  },

  // Mirrors src/pages/Static.jsx (about copy); site facts come from src/lib/site.js.
  about(d) {
    const s = d.stats;
    return {
      sections: [
        `${BRAND} started in ${FOUNDED} as a side project to answer one question fast: when does it come out, and is it on my platform? It now tracks ${s.games.toLocaleString('en-US')} games (${s.upcoming.toLocaleString('en-US')} upcoming) and ${s.series} game series.`,
        section('Where the data comes from', 'Release dates, platforms, studios and artwork come from IGDB (owned by Twitch). PC system requirements, prices, player counts and review summaries come from the Steam store. Everything is refreshed every day.'),
        section('How rankings work', '“Most anticipated” is ranked by real follower counts on IGDB. “Trending” blends IGDB page visits, Twitch watch time and Steam concurrent players. “Best of” uses critic averages when there are enough reviews, and player scores otherwise. We don’t sell placements.'),
        section('Who runs it', `${BRAND} is made by Divik, an indie developer. Contact: ${CONTACT}.`),
      ],
      related: [{ name: 'Contact', path: '/contact' }],
    };
  },

  contact() {
    return {
      sections: [
        `Email: ${CONTACT}`,
        'For date corrections, include the game name and a link to the official announcement. Game data comes from IGDB, so fixing it there updates NextPlay within a day.',
      ],
    };
  },

  legal(d) {
    return { sections: LEGAL[d.doc].body.map(([h, p]) => section(h, p)) };
  },
};

function hub(d) {
  return {
    sections: [
      section('Next releases', gameList(d.next)),
      section('Most anticipated', gameList(d.anticipated)),
      section('Recently released', gameList(d.recent)),
      d.facets?.length && section('Browse more', list(d.facets.map((f) => link(f.name, f.path || `/genre/${f.slug}`)))),
    ],
  };
}

const pageOf = (pathname) => ROUTES.find((r) => matchPath({ path: r.path, end: true }, pathname)) || null;

const notFoundMd = (pathname) => ({
  status: 404,
  body: `# Not found\n\n> There is no page at ${pathname}.\n\nSee the site map: ${link('llms.txt', '/llms.txt')}, or search: ${link('NextPlay search', '/search')}.\n`,
});

// pathname is the HTML path ("/", "/game/x"). lastmod: "YYYY-MM-DD" for the "Last updated" line.
// resolved: the loader result, when the caller already has it (the prerenderer does).
// compact: drop related-game lists (used by llms-full.txt to fit more pages).
export function renderMarkdown(pathname, { lastmod, resolved, compact = false } = {}) {
  const route = pageOf(pathname);
  if (!route || SKIP[route.page]) return notFoundMd(pathname);
  const r = resolved || resolve(pathname);
  if (r.status !== 200 || r.data.seo?.noindex) return notFoundMd(pathname);
  const { sections, related } = RENDERERS[route.page](r.data, route, { compact });
  const { seo } = r.data;
  return {
    status: 200,
    page: route.page,
    title: seo.title.replace(/ \| NextPlay$/, ''),
    body: doc({ title: seo.title.replace(/ \| NextPlay$/, ''), summary: seo.description, path: pathname, updated: lastmod || isoDay(r.data.builtAt), sections, related }),
  };
}

// Every addressable markdown route (HTML paths). Feeds the catalog, llms.txt and llms-full.txt.
export function listMarkdownRoutes() {
  return allPaths().filter((p) => {
    const route = pageOf(p);
    return route && !SKIP[route.page];
  });
}

// Fails loudly if a route was added without a renderer (or an explicit SKIP reason).
export function checkCoverage() {
  const missing = [...new Set(ROUTES.map((r) => r.page))].filter((p) => !RENDERERS[p] && !SKIP[p]);
  if (missing.length) throw new Error(`[md] no markdown renderer for page type(s): ${missing.join(', ')}. Add one to server/md/registry.js or list it in SKIP.`);
}
