/**
 * Sitemap Generator for NextPlay 2026
 * Generates a valid XML sitemap with proper encoding
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

/**
 * Escape special XML characters
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create a URL slug from text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate URL entry for sitemap
 */
function urlEntry(loc, priority, changefreq = 'weekly') {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Collect all URLs
const urls = [];

// 1. Homepage
urls.push(urlEntry(`${SITE_URL}/`, 1.0, 'daily'));

// 2. Core Feature Pages
const corePages = [
  { path: '/tier-list', priority: 0.9 },
  { path: '/calendar', priority: 0.9 },
  { path: '/compare', priority: 0.85 },
  { path: '/my-top-5', priority: 0.85 },
  { path: '/watchlist', priority: 0.8 },
  { path: '/bracket', priority: 0.8 },
  { path: '/genre', priority: 0.9 },
  { path: '/platform', priority: 0.9 },
  // New pages for AdSense
  { path: '/blog', priority: 0.9 },
  { path: '/about', priority: 0.7 },
  { path: '/contact', priority: 0.6 },
  { path: '/privacy', priority: 0.5 },
  { path: '/terms', priority: 0.5 },
  { path: '/disclaimer', priority: 0.5 },
];

corePages.forEach(p => {
  urls.push(urlEntry(`${SITE_URL}${p.path}`, p.priority));
});

// 3. Blog Articles - High priority for fresh content
const blogArticles = [
  'gta-6-release-date-everything-we-know',
  'most-anticipated-games-2026',
  'february-2026-game-releases',
  'how-to-use-nextplay-features',
  'best-ps5-games-2026'
];
blogArticles.forEach(slug => {
  urls.push(urlEntry(`${SITE_URL}/blog/${slug}`, 0.9, 'daily'));
});

// 3b. News Section - Highest priority for news
urls.push(urlEntry(`${SITE_URL}/news`, 1.0, 'hourly'));

// News Articles - High priority and frequent updates
const newsArticles = [
  'crimson-desert-release-date-everything-we-know',
  'fallout-new-vegas-remaster-rumors-what-we-know',
  'nintendo-switch-2-gamecube-games-fire-emblem',
  'gta-6-rockstar-games-latest-updates-january-2026',
  'marvel-rivals-season-2-whats-coming',
  'hollow-knight-silksong-release-date-update',
  'hades-2-early-access-review-supergiant',
  'clair-obscur-expedition-33-release-preview',
  'arena-breakout-infinite-everything-you-need',
  'cyberpunk-2077-state-of-game-2026'
];
newsArticles.forEach(slug => {
  urls.push(urlEntry(`${SITE_URL}/news/${slug}`, 0.95, 'daily'));
});

// 4. Genre Pages - Extract unique genres from games
const genres = new Set();
gamesData.forEach(game => {
  if (game.genres) {
    game.genres.forEach(g => genres.add(g));
  }
});
genres.forEach(genre => {
  urls.push(urlEntry(`${SITE_URL}/genre/${slugify(genre)}`, 0.75));
});

// 5. Platform Pages - Extract unique platforms from games
const platforms = new Set();
gamesData.forEach(game => {
  if (game.platforms) {
    game.platforms.forEach(p => platforms.add(p));
  }
});
platforms.forEach(platform => {
  urls.push(urlEntry(`${SITE_URL}/platform/${slugify(platform)}`, 0.75));
});

// 6. Calendar Month Pages (01-12)
for (let i = 1; i <= 12; i++) {
  const month = i.toString().padStart(2, '0');
  urls.push(urlEntry(`${SITE_URL}/calendar/${month}`, 0.75));
}

// 7. Game Detail Pages - All games
gamesData.forEach((game, index) => {
  // Higher priority for popular games (first 20)
  const priority = index < 10 ? 0.9 : (index < 30 ? 0.85 : 0.8);
  urls.push(urlEntry(`${SITE_URL}/game/${game.slug}`, priority));
});

// Generate final sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

// Write to public folder
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`✅ Sitemap generated successfully!`);
console.log(`📄 Total URLs: ${urls.length}`);
console.log(`📁 Output: ${outputPath}`);
console.log(`\nURL breakdown:`);
console.log(`  - Core pages: ${corePages.length}`);
console.log(`  - Blog articles: ${blogArticles.length}`);
console.log(`  - Genres: ${genres.size}`);
console.log(`  - Platforms: ${platforms.size}`);
console.log(`  - Calendar months: 12`);
console.log(`  - Games: ${gamesData.length}`);
