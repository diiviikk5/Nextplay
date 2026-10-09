// Static site generation: renders every route with React on the server and writes
//   dist/<route>/index.html     full HTML (what Google/AI crawlers read)
//   dist/data/<route>.json      route data for client-side navigation
// plus sitemaps, robots.txt, llms.txt, rss.xml and the search index.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.resolve(ROOT, process.env.OUT_DIR || 'dist');
const started = Date.now();

const { render, headHtml } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href);
const loaders = await import(pathToFileURL(path.join(ROOT, 'server/loaders.js')).href);
const db = await import(pathToFileURL(path.join(ROOT, 'server/db.js')).href);
const { SITE } = await import(pathToFileURL(path.join(ROOT, 'server/seo.js')).href);
const { releaseLabel, isoDate } = await import(pathToFileURL(path.join(ROOT, 'src/lib/format.js')).href);
const { platformName } = await import(pathToFileURL(path.join(ROOT, 'src/lib/platforms.js')).href);

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const htmlFile = (p) => (p === '/' ? path.join(DIST, 'index.html') : path.join(DIST, p.slice(1), 'index.html'));
const dataFile = (p) => path.join(DIST, 'data', `${p === '/' ? 'index' : p.slice(1)}.json`);

async function page(p, data) {
  const app = await render(p, data);
  return template
    .replace('<!--head-->', data.seo ? headHtml(data.seo) : '')
    .replace('<!--app-->', app)
    .replace('<!--data-->', `<script id="__NP_DATA__" type="application/json" data-path="${p}">${safeJson(data)}</script>`);
}

// lastmod only moves when a page's content actually changes (volatile fields excluded).
const LASTMOD_FILE = path.join(ROOT, 'data/db/lastmod.json');
const lastmod = fs.existsSync(LASTMOD_FILE) ? JSON.parse(fs.readFileSync(LASTMOD_FILE, 'utf8')) : {};
const today = new Date(db.NOW * 1000).toISOString().slice(0, 10);
function touch(p, data) {
  const { builtAt, updated, ...stable } = data;
  const hash = crypto.createHash('sha1').update(JSON.stringify(stable)).digest('base64url').slice(0, 12);
  if (lastmod[p]?.h !== hash) lastmod[p] = { h: hash, d: today };
  return lastmod[p].d;
}

const paths = loaders.allPaths();
const sitemap = new Map(); // group -> [{loc, lastmod}]
const addToSitemap = (p, date) => {
  const seg = p.split('/')[1] || 'pages';
  const group = { game: 'games', 'games-like': 'games-like', 'system-requirements': 'requirements', developer: 'studios', publisher: 'studios', series: 'series' }[seg] || 'hubs';
  if (!sitemap.has(group)) sitemap.set(group, []);
  sitemap.get(group).push({ loc: `${SITE}${p}`, lastmod: date });
};

let ok = 0, redirects = 0, missing = 0;
const errors = [];
const BATCH = 24;
for (let i = 0; i < paths.length; i += BATCH) {
  await Promise.all(
    paths.slice(i, i + BATCH).map(async (p) => {
      try {
        const r = loaders.resolve(p);
        if (r.redirect) {
          write(dataFile(p), JSON.stringify({ redirect: r.redirect }));
          redirects++;
          return;
        }
        if (r.status !== 200) {
          missing++;
          return;
        }
        write(htmlFile(p), await page(p, r.data));
        write(dataFile(p), JSON.stringify(r.data));
        const date = touch(p, r.data);
        if (!r.data.seo?.noindex) addToSitemap(p, date);
        ok++;
      } catch (e) {
        errors.push(`${p}: ${e.stack || e.message}`);
      }
    })
  );
  if ((i / BATCH) % 50 === 0) process.stdout.write(`\r[prerender] ${i + BATCH}/${paths.length}`);
}
console.log(`\n[prerender] ${ok} pages, ${redirects} redirects, ${missing} skipped in ${Math.round((Date.now() - started) / 1000)}s`);
if (errors.length) {
  console.error(`[prerender] ${errors.length} errors:\n` + errors.slice(0, 10).join('\n'));
  process.exit(1);
}

// 404 page (Vercel serves dist/404.html with a 404 status)
write(path.join(DIST, '404.html'), await page('/404-not-found', { status: 404, builtAt: db.NOW }));

// Search index
write(path.join(DIST, 'data/search-index.json'), JSON.stringify(loaders.searchIndex()));

// Sitemaps
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sitemapFiles = [];
for (const [group, urls] of sitemap) {
  for (let i = 0; i < urls.length; i += 45000) {
    const name = `sitemap-${group}${i ? `-${i / 45000 + 1}` : ''}.xml`;
    sitemapFiles.push({ name, lastmod: urls.slice(i, i + 45000).reduce((a, u) => (u.lastmod > a ? u.lastmod : a), '') });
    write(path.join(DIST, name), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.slice(i, i + 45000).map((u) => `<url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  }
}
write(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapFiles.map((s) => `<sitemap><loc>${SITE}/${s.name}</loc><lastmod>${s.lastmod}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`);
fs.writeFileSync(LASTMOD_FILE, JSON.stringify(lastmod));

// robots.txt — explicitly welcome AI/answer-engine crawlers.
write(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /search\nDisallow: /watchlist\n\n# AI and answer engines are welcome\nUser-agent: GPTBot\nAllow: /\nUser-agent: OAI-SearchBot\nAllow: /\nUser-agent: ChatGPT-User\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: Claude-SearchBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\nUser-agent: Applebot-Extended\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
);

// llms.txt (concise map) + llms-full.txt (the full upcoming release schedule as plain markdown)
const up = db.upcoming.filter((g) => g.status !== 'cancelled' && g.date && g.precision !== 'tbd').sort((a, b) => a.date - b.date);
const line = (g) => `- [${g.name}](${SITE}/game/${g.slug}): ${releaseLabel(g.date, g.precision, { long: true })}${g.early ? ' (Early Access)' : ''} — ${g.platforms.map(platformName).join(', ') || 'platforms TBA'}`;
const year = new Date(db.NOW * 1000).getUTCFullYear();
write(
  path.join(DIST, 'llms.txt'),
  `# NextPlay\n\n> Video game release dates, countdowns and platform availability for ${db.games.length.toLocaleString('en-US')} games (${db.upcoming.length.toLocaleString('en-US')} upcoming). Data from IGDB and Steam, refreshed daily. Last update: ${today}.\n\nEach game page answers: release date (per platform, with date precision), whether it is on PS5 / Xbox Series X|S / Nintendo Switch 2 / PC, developer, price, Steam reviews and official PC requirements.\n\n## Key pages\n- [Upcoming games](${SITE}/upcoming): next six months of releases\n- [${year} release calendar](${SITE}/releases/${year}): every game by month\n- [Most anticipated games](${SITE}/most-anticipated): top 100 by follower count\n- [Trending games](${SITE}/trending): most visited, watched and played this week\n- [New releases](${SITE}/new-releases): last six weeks\n- [Best games of ${year}](${SITE}/best-games/${year}): ranked by review scores\n- [Game series in order](${SITE}/series)\n- [Full release schedule (plain text)](${SITE}/llms-full.txt)\n\n## Most anticipated right now\n${db.upcomingByHype.slice(0, 40).map(line).join('\n')}\n`
);
write(path.join(DIST, 'llms-full.txt'), `# NextPlay upcoming video game release schedule\n\nGenerated ${today}. ${up.length} upcoming games with announced dates, soonest first. Source: ${SITE}\n\n${up.map(line).join('\n')}\n`);

// RSS: notable releases from the last 14 days + next 14 days.
const feedItems = db.games
  .filter((g) => g.precision === 'day' && g.date > db.NOW - 14 * 86400 && g.date < db.NOW + 14 * 86400 && g.score > 30)
  .sort((a, b) => b.date - a.date)
  .slice(0, 60);
write(
  path.join(DIST, 'rss.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n<title>NextPlay – new &amp; upcoming game releases</title>\n<link>${SITE}/</link>\n<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>\n<description>Notable video game releases this week and next.</description>\n<lastBuildDate>${new Date(db.NOW * 1000).toUTCString()}</lastBuildDate>\n${feedItems
    .map((g) => `<item><title>${esc(g.name)} – ${g.date <= db.NOW ? 'out now' : 'releases'} ${releaseLabel(g.date, 'day')}</title><link>${SITE}/game/${g.slug}</link><guid>${SITE}/game/${g.slug}#${isoDate(g.date)}</guid><pubDate>${new Date(Math.min(g.date, db.NOW) * 1000).toUTCString()}</pubDate><description>${esc(`${g.name} on ${g.platforms.map(platformName).join(', ')}. ${g.summary.slice(0, 280)}`)}</description></item>`)
    .join('\n')}\n</channel>\n</rss>\n`
);

const total = [...sitemap.values()].reduce((a, l) => a + l.length, 0);
console.log(`[prerender] sitemap: ${total} URLs in ${sitemapFiles.length} files · done in ${Math.round((Date.now() - started) / 1000)}s`);
