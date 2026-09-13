/**
 * Sitemap Generator for NextPlay 2026
 * Generates modular, valid XML sitemaps and a master Sitemap Index.
 * Run with: node scripts/generateSitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://nextplaygame.me';
const TODAY = new Date().toISOString().split('T')[0];

// Load games data
const gamesDataPath = path.join(__dirname, '..', 'src', 'data', 'games.json');
const gamesData = JSON.parse(fs.readFileSync(gamesDataPath, 'utf8'));

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

// 1. Core Pages & Hubs
const corePages = [
  { path: '/', priority: 1.0, freq: 'daily' },
  { path: '/tier-list', priority: 0.95, freq: 'daily' },
  { path: '/calendar', priority: 0.9, freq: 'daily' },
  { path: '/compare', priority: 0.85, freq: 'weekly' },
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

const sitemapPagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.join('\n')}
</urlset>`;
writeSitemapFile('sitemap-pages.xml', sitemapPagesXml);

// 2. Games Sitemap
const gameUrls = [];
gamesData.forEach((game, index) => {
  const priority = index < 20 ? 0.9 : (index < 60 ? 0.85 : 0.8);
  gameUrls.push(urlEntry(`${SITE_URL}/game/${game.slug}`, priority, 'daily'));
});
const sitemapGamesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${gameUrls.join('\n')}
</urlset>`;
writeSitemapFile('sitemap-games.xml', sitemapGamesXml);

// 3. Genres Sitemap
const genreSet = new Set();
gamesData.forEach(g => g.genres?.forEach(gen => genreSet.add(gen)));
const genreUrls = [];
genreSet.forEach(genre => {
  genreUrls.push(urlEntry(`${SITE_URL}/genre/${slugify(genre)}`, 0.85, 'daily'));
});
const sitemapGenresXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${genreUrls.join('\n')}
</urlset>`;
writeSitemapFile('sitemap-genres.xml', sitemapGenresXml);

// 4. Platforms Sitemap
const platformSet = new Set();
gamesData.forEach(g => g.platforms?.forEach(p => platformSet.add(p)));
const platformUrls = [];
platformSet.forEach(platform => {
  const priority = platform.toLowerCase() === 'mac' ? 0.95 : 0.85;
  platformUrls.push(urlEntry(`${SITE_URL}/platform/${slugify(platform)}`, priority, 'daily'));
});
const sitemapPlatformsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${platformUrls.join('\n')}
</urlset>`;
writeSitemapFile('sitemap-platforms.xml', sitemapPlatformsXml);

// 5. Calendar Months Sitemap
const calendarUrls = [];
for (let i = 1; i <= 12; i++) {
  const month = i.toString().padStart(2, '0');
  calendarUrls.push(urlEntry(`${SITE_URL}/calendar/2026-${month}`, 0.8, 'weekly'));
}
const sitemapCalendarXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${calendarUrls.join('\n')}
</urlset>`;
writeSitemapFile('sitemap-calendar.xml', sitemapCalendarXml);

// 6. Master Sitemap Index (sitemap.xml)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-games.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-platforms.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-genres.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-calendar.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;
writeSitemapFile('sitemap.xml', sitemapIndexXml);

const totalUrls = pageUrls.length + gameUrls.length + genreUrls.length + platformUrls.length + calendarUrls.length;
console.log('✅ Multi-Sitemap architecture generated successfully!');
console.log(`📄 Total Indexed URLs: ${totalUrls}`);
console.log(`  - Core & Blog Pages: ${pageUrls.length}`);
console.log(`  - Game Detail Pages: ${gameUrls.length}`);
console.log(`  - Genre Pages: ${genreUrls.length}`);
console.log(`  - Platform Hubs: ${platformUrls.length}`);
console.log(`  - Calendar Month Hubs: ${calendarUrls.length}`);
