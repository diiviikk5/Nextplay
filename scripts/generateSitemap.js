/**
 * Modular Multi-Sitemap Generator for NextPlay 2026
 * Generates 11 specialized sub-sitemaps and a Master Sitemap Index
 * Covering 1,700+ to 2,000+ indexable static URLs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://nextplaygame.me';
const TODAY = new Date().toISOString().split('T')[0];

const gamesDataPath = path.join(__dirname, '..', 'src', 'data', 'games.json');
const gamesData = JSON.parse(fs.readFileSync(gamesDataPath, 'utf8'));

const trendsDataPath = path.join(__dirname, '..', 'src', 'data', 'gaming_trends_ontology.json');
const trendsData = fs.existsSync(trendsDataPath) ? JSON.parse(fs.readFileSync(trendsDataPath, 'utf8')) : [];

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function urlEntry(loc, priority, changefreq = 'weekly') {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function writeSitemapFile(filename, xmlContent) {
  fs.writeFileSync(path.join(publicDir, filename), xmlContent, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, filename), xmlContent, 'utf8');
  }
}

let totalSitemapUrls = 0;

// 1. Core Pages & Hubs Sitemap
const corePages = [
  { path: '/', priority: 1.0, freq: 'daily' },
  { path: '/can-i-run-it', priority: 0.95, freq: 'daily' },
  { path: '/battles', priority: 0.95, freq: 'daily' },
  { path: '/game-finder', priority: 0.95, freq: 'daily' },
  { path: '/tier-list', priority: 0.95, freq: 'daily' },
  { path: '/calendar', priority: 0.9, freq: 'daily' },
  { path: '/compare', priority: 0.9, freq: 'weekly' },
  { path: '/games-like', priority: 0.9, freq: 'weekly' },
  { path: '/system-requirements', priority: 0.9, freq: 'weekly' },
  { path: '/developer', priority: 0.85, freq: 'weekly' },
  { path: '/publisher', priority: 0.85, freq: 'weekly' },
  { path: '/my-top-5', priority: 0.85, freq: 'weekly' },
  { path: '/watchlist', priority: 0.8, freq: 'weekly' },
  { path: '/bracket', priority: 0.8, freq: 'weekly' },
  { path: '/genre', priority: 0.9, freq: 'weekly' },
  { path: '/platform', priority: 0.9, freq: 'weekly' },
  { path: '/news', priority: 0.9, freq: 'daily' },
  { path: '/blog', priority: 0.85, freq: 'weekly' },
  { path: '/about', priority: 0.7, freq: 'monthly' },
  { path: '/contact', priority: 0.6, freq: 'monthly' },
  { path: '/privacy', priority: 0.5, freq: 'monthly' },
  { path: '/terms', priority: 0.5, freq: 'monthly' },
  { path: '/disclaimer', priority: 0.5, freq: 'monthly' },
];

const blogArticles = [
  'gta-6-release-date-everything-we-know',
  'most-anticipated-games-2026',
  'february-2026-game-releases',
  'how-to-use-nextplay-features',
  'best-ps5-games-2026'
];

const pageUrls = [];
corePages.forEach(p => pageUrls.push(urlEntry(`${SITE_URL}${p.path}`, p.priority, p.freq)));
blogArticles.forEach(slug => pageUrls.push(urlEntry(`${SITE_URL}/blog/${slug}`, 0.85, 'weekly')));

writeSitemapFile('sitemap-pages.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.join('\n')}
</urlset>`);
totalSitemapUrls += pageUrls.length;

// 2. Games Sitemap (250 URLs)
const gameUrls = gamesData.map((game, index) => {
  const priority = index < 25 ? 0.95 : (index < 75 ? 0.85 : 0.8);
  return urlEntry(`${SITE_URL}/game/${game.slug}`, priority, 'daily');
});
writeSitemapFile('sitemap-games.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${gameUrls.join('\n')}
</urlset>`);
totalSitemapUrls += gameUrls.length;

// 3. System Requirements Sitemap (250 URLs)
const reqUrls = gamesData.map(game => urlEntry(`${SITE_URL}/system-requirements/${game.slug}`, 0.85, 'weekly'));
writeSitemapFile('sitemap-requirements.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${reqUrls.join('\n')}
</urlset>`);
totalSitemapUrls += reqUrls.length;

// 4. 'Games Like' Sitemap (250 URLs)
const similarUrls = gamesData.map(game => urlEntry(`${SITE_URL}/games-like/${game.slug}`, 0.85, 'weekly'));
writeSitemapFile('sitemap-similar.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${similarUrls.join('\n')}
</urlset>`);
totalSitemapUrls += similarUrls.length;

// 5. Head-to-Head Comparisons Sitemap (500+ URLs)
const comparisonSeen = new Set();
const comparisonUrls = [];

const priorityPairs = [
  ['grand-theft-auto-vi', 'crimson-desert'],
  ['hollow-knight-silksong', 'hades-ii'],
  ['death-stranding-2-on-the-beach', 'grand-theft-auto-vi'],
  ['marvels-wolverine', 'marvels-blade'],
  ['metroid-prime-4-beyond', 'doom-the-dark-ages'],
  ['resident-evil-9', 'silent-hill-f'],
  ['monster-hunter-wilds', 'crimson-desert'],
  ['fable', 'avowed'],
  ['judas', 'bioshock-4'],
  ['phantom-blade-zero', 'black-myth-wukong-dlc'],
  ['control-2', 'alan-wake-2-dlc'],
  ['prince-of-persia-the-sands-of-time-remake', 'assassins-creed-shadows'],
  ['bruisers-2d-boxing', 'undisputed'],
  ['megastore-simulator', 'supermarket-together']
];

priorityPairs.forEach(([s1, s2]) => {
  const key = [s1, s2].sort().join('-vs-');
  if (!comparisonSeen.has(key)) {
    comparisonSeen.add(key);
    comparisonUrls.push(urlEntry(`${SITE_URL}/compare/${s1}-vs-${s2}`, 0.9, 'weekly'));
  }
});

const gamesByGenre = {};
gamesData.forEach(g => {
  g.genres?.forEach(gen => {
    if (!gamesByGenre[gen]) gamesByGenre[gen] = [];
    gamesByGenre[gen].push(g);
  });
});

Object.values(gamesByGenre).forEach(gList => {
  const sorted = [...gList].sort((a, b) => (b.hype || 0) - (a.hype || 0)).slice(0, 10);
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const s1 = sorted[i].slug;
      const s2 = sorted[j].slug;
      const key = [s1, s2].sort().join('-vs-');
      if (!comparisonSeen.has(key) && comparisonUrls.length < 550) {
        comparisonSeen.add(key);
        comparisonUrls.push(urlEntry(`${SITE_URL}/compare/${s1}-vs-${s2}`, 0.8, 'weekly'));
      }
    }
  }
});

const topHypeGames = [...gamesData].sort((a, b) => (b.hype || 0) - (a.hype || 0)).slice(0, 35);
for (let i = 0; i < topHypeGames.length; i++) {
  for (let j = i + 1; j < Math.min(topHypeGames.length, i + 8); j++) {
    const s1 = topHypeGames[i].slug;
    const s2 = topHypeGames[j].slug;
    const key = [s1, s2].sort().join('-vs-');
    if (!comparisonSeen.has(key) && comparisonUrls.length < 600) {
      comparisonSeen.add(key);
      comparisonUrls.push(urlEntry(`${SITE_URL}/compare/${s1}-vs-${s2}`, 0.8, 'weekly'));
    }
  }
}

writeSitemapFile('sitemap-comparisons.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${comparisonUrls.join('\n')}
</urlset>`);
totalSitemapUrls += comparisonUrls.length;

// 6. Platform x Genre Matrix Sitemap (300+ URLs)
const priorityPlatforms = ['pc', 'ps5', 'xbox', 'switch', 'mac'];
const allGenres = Array.from(new Set(gamesData.flatMap(g => g.genres || [])));
const matrixUrls = [];

priorityPlatforms.forEach(pSlug => {
  allGenres.forEach(genre => {
    const gSlug = slugify(genre);
    const count = gamesData.filter(g => {
      const matchesP = g.platforms?.some(p => {
        const s = slugify(p);
        return s === pSlug || (pSlug === 'ps5' && p.includes('PlayStation 5')) || (pSlug === 'xbox' && p.includes('Xbox Series')) || (pSlug === 'switch' && p.includes('Switch'));
      });
      const matchesG = g.genres?.some(gen => slugify(gen) === gSlug);
      return matchesP && matchesG;
    }).length;

    if (count > 0) {
      matrixUrls.push(urlEntry(`${SITE_URL}/games/${pSlug}/${gSlug}`, 0.85, 'weekly'));
    }
  });
});

writeSitemapFile('sitemap-matrix.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${matrixUrls.join('\n')}
</urlset>`);
totalSitemapUrls += matrixUrls.length;

// 7. Developer & Publisher Company Sitemap (60+ URLs)
const devMap = new Set();
const pubMap = new Set();
const companyUrls = [];

gamesData.forEach(g => {
  g.developers?.forEach(d => {
    if (d && d !== 'TBA') devMap.add(slugify(d));
  });
  g.publishers?.forEach(p => {
    if (p && p !== 'TBA') pubMap.add(slugify(p));
  });
});

devMap.forEach(d => companyUrls.push(urlEntry(`${SITE_URL}/developer/${d}`, 0.8, 'weekly')));
pubMap.forEach(p => companyUrls.push(urlEntry(`${SITE_URL}/publisher/${p}`, 0.8, 'weekly')));

writeSitemapFile('sitemap-companies.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${companyUrls.join('\n')}
</urlset>`);
totalSitemapUrls += companyUrls.length;

// 8. Genres Sitemap (24 URLs)
const genreUrls = allGenres.map(g => urlEntry(`${SITE_URL}/genre/${slugify(g)}`, 0.85, 'weekly'));
writeSitemapFile('sitemap-genres.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${genreUrls.join('\n')}
</urlset>`);
totalSitemapUrls += genreUrls.length;

// 9. Platforms Sitemap (16 URLs)
const allPlatforms = Array.from(new Set(gamesData.flatMap(g => g.platforms || [])));
const platformUrls = allPlatforms.map(p => urlEntry(`${SITE_URL}/platform/${slugify(p)}`, 0.85, 'weekly'));
writeSitemapFile('sitemap-platforms.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${platformUrls.join('\n')}
</urlset>`);
totalSitemapUrls += platformUrls.length;

// 10. Calendar Sitemap (16 URLs)
const calendarMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const calendarUrls = [
  ...calendarMonths.map(m => urlEntry(`${SITE_URL}/calendar/2026-${m}`, 0.85, 'weekly')),
  urlEntry(`${SITE_URL}/calendar/q1-2026`, 0.85, 'weekly'),
  urlEntry(`${SITE_URL}/calendar/q2-2026`, 0.85, 'weekly'),
  urlEntry(`${SITE_URL}/calendar/q3-2026`, 0.85, 'weekly'),
  urlEntry(`${SITE_URL}/calendar/q4-2026`, 0.85, 'weekly')
];
writeSitemapFile('sitemap-calendar.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${calendarUrls.join('\n')}
</urlset>`);
totalSitemapUrls += calendarUrls.length;

// 11. Subscription Services Sitemap (3 URLs)
const serviceUrls = [
  urlEntry(`${SITE_URL}/service/xbox-game-pass`, 0.9, 'weekly'),
  urlEntry(`${SITE_URL}/service/playstation-plus`, 0.85, 'weekly'),
  urlEntry(`${SITE_URL}/service/geforce-now`, 0.85, 'weekly')
];
writeSitemapFile('sitemap-services.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${serviceUrls.join('\n')}
</urlset>`);
totalSitemapUrls += serviceUrls.length;

// 12. Gaming Trends & Search Topics Sitemap (1,000+ URLs)
const trendsUrls = [
  urlEntry(`${SITE_URL}/trends`, 0.95, 'daily')
];

trendsData.forEach(t => {
  trendsUrls.push(urlEntry(`${SITE_URL}/trends/${t.slug}`, 0.88, 'daily'));
});

writeSitemapFile('sitemap-trends.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${trendsUrls.join('\n')}
</urlset>`);
totalSitemapUrls += trendsUrls.length;

// Master Sitemap Index
const subSitemaps = [
  'sitemap-pages.xml',
  'sitemap-games.xml',
  'sitemap-trends.xml',
  'sitemap-requirements.xml',
  'sitemap-similar.xml',
  'sitemap-comparisons.xml',
  'sitemap-matrix.xml',
  'sitemap-companies.xml',
  'sitemap-genres.xml',
  'sitemap-platforms.xml',
  'sitemap-calendar.xml',
  'sitemap-services.xml'
];

const masterIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${subSitemaps.map(s => `  <sitemap>
    <loc>${SITE_URL}/${s}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

writeSitemapFile('sitemap.xml', masterIndexXml);

console.log(`✅ Multi-Sitemap architecture successfully generated!`);
console.log(`📊 Total sub-sitemaps: ${subSitemaps.length}`);
console.log(`🔗 Total URLs across all sitemaps: ${totalSitemapUrls}`);
