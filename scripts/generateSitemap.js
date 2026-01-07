/**
 * Dynamic Sitemap Generator
 * Run this script to generate a complete sitemap.xml with all game pages
 * 
 * Usage: node scripts/generateSitemap.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load games data
const gamesDataPath = join(__dirname, '../src/data/games.json');
const gamesData = JSON.parse(readFileSync(gamesDataPath, 'utf8'));

const SITE_URL = 'https://nextplaygame.me';
const TODAY = new Date().toISOString().split('T')[0];

// Helper to create URL-safe slugs
const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

// Get all unique values from games
const getUniqueGenres = () => {
  const genres = new Set();
  gamesData.forEach(g => g.genres?.forEach(genre => genres.add(genre)));
  return [...genres];
};

const getUniquePlatforms = () => {
  const platforms = new Set();
  gamesData.forEach(g => g.platforms?.forEach(platform => platforms.add(platform)));
  return [...platforms];
};

// Escape special XML characters
const escapeXml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Generate sitemap XML
const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Generated on ${TODAY} -->
  
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Core Feature Pages -->
  <url>
    <loc>${SITE_URL}/tier-list</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/calendar</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/compare</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${SITE_URL}/my-top-5</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${SITE_URL}/watchlist</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/bracket</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/embed</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Hub Pages: Genres & Platforms -->
  <url>
    <loc>${SITE_URL}/genre</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/platform</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Add Genre Pages
  const genres = getUniqueGenres();
  xml += '\n  <!-- Genre Pages -->\n';
  genres.forEach(genre => {
    const slug = slugify(genre);
    const gamesInGenre = gamesData.filter(g => g.genres?.includes(genre)).length;
    const priority = gamesInGenre > 10 ? '0.8' : gamesInGenre > 5 ? '0.75' : '0.7';
    xml += `  <url>
    <loc>${SITE_URL}/genre/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
  });

  // Add Platform Pages
  const platforms = getUniquePlatforms();
  xml += '\n  <!-- Platform Pages -->\n';

  // Sort platforms by priority
  const priorityPlatforms = ['PlayStation 5', 'Xbox Series X/S', 'PC', 'Nintendo Switch', 'Nintendo Switch 2'];
  const sortedPlatforms = platforms.sort((a, b) => {
    const aIdx = priorityPlatforms.indexOf(a);
    const bIdx = priorityPlatforms.indexOf(b);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.localeCompare(b);
  });

  sortedPlatforms.forEach(platform => {
    const slug = slugify(platform);
    const isPriority = priorityPlatforms.includes(platform);
    xml += `  <url>
    <loc>${SITE_URL}/platform/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${isPriority ? '0.85' : '0.75'}</priority>
  </url>\n`;
  });

  // Add Calendar Month Pages
  xml += '\n  <!-- Calendar Month Pages -->\n';
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  months.forEach(month => {
    xml += `  <url>
    <loc>${SITE_URL}/calendar/${month}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>\n`;
  });

  // Add Game Pages (sorted by hype)
  xml += '\n  <!-- Game Detail Pages -->\n';
  const sortedGames = [...gamesData].sort((a, b) => (b.hype || 0) - (a.hype || 0));

  sortedGames.forEach((game, index) => {
    // Higher priority for top games
    let priority = '0.7';
    if (index < 5) priority = '0.95';
    else if (index < 10) priority = '0.9';
    else if (index < 20) priority = '0.85';
    else if (index < 50) priority = '0.8';
    else if (game.hype && game.hype > 50) priority = '0.75';

    xml += `  <url>
    <loc>${SITE_URL}/game/${game.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>`;

    // Add image data for games with images
    if (game.image) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(game.image)}</image:loc>
      <image:title>${escapeXml(game.title)}</image:title>
      <image:caption>${escapeXml(game.description?.substring(0, 100) || `${game.title} game cover`)}</image:caption>
    </image:image>`;
    }

    xml += `
  </url>\n`;
  });

  xml += '</urlset>';

  return xml;
};

// Write sitemap to file
const writeSitemap = () => {
  const sitemap = generateSitemap();
  const outputPath = join(__dirname, '../public/sitemap.xml');

  writeFileSync(outputPath, sitemap, 'utf8');

  const gamesCount = gamesData.length;
  const genresCount = getUniqueGenres().length;
  const platformsCount = getUniquePlatforms().length;
  const totalUrls = 10 + genresCount + platformsCount + 12 + gamesCount; // core + genres + platforms + months + games

  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${outputPath}`);
  console.log(`📊 Statistics:`);
  console.log(`   - Total URLs: ${totalUrls}`);
  console.log(`   - Game Pages: ${gamesCount}`);
  console.log(`   - Genre Pages: ${genresCount}`);
  console.log(`   - Platform Pages: ${platformsCount}`);
  console.log(`   - Calendar Pages: 12`);
  console.log(`   - Core Feature Pages: 10`);
};

// Run the generator
writeSitemap();
