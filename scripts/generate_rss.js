/**
 * RSS 2.0 & Atom Feed Generator for NextPlay 2026
 * Generates public/rss.xml and public/feed.xml for rapid search indexation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://nextplaygame.me';
const SITE_NAME = 'NextPlay 2026';
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

const gamesDataPath = path.join(__dirname, '..', 'src', 'data', 'games.json');
const games = JSON.parse(fs.readFileSync(gamesDataPath, 'utf8'));

const trendsDataPath = path.join(__dirname, '..', 'src', 'data', 'gaming_trends_ontology.json');
const trends = fs.existsSync(trendsDataPath) ? JSON.parse(fs.readFileSync(trendsDataPath, 'utf8')) : [];

function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

const pubDate = new Date().toUTCString();

let itemsXml = '';

// 1. Add High-Priority Game Releases
games.slice(0, 50).forEach(g => {
    itemsXml += `
    <item>
      <title>${escapeXml(g.title)} - 2026 Release Date &amp; Platforms</title>
      <link>${SITE_URL}/game/${g.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/game/${g.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(g.description || `${g.title} scheduled release date: ${g.releaseDate}. Platforms: ${(g.platforms || []).join(', ')}.`)}</description>
      <category>${escapeXml((g.genres || ['Gaming'])[0])}</category>
    </item>`;
});

// 2. Add Top Gaming Trends
trends.slice(0, 50).forEach(t => {
    itemsXml += `
    <item>
      <title>${escapeXml(t.name)}: 2026 Gaming Trends &amp; Intel</title>
      <link>${SITE_URL}/trends/${t.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/trends/${t.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(t.description || t.queryIntent)}</description>
      <category>${escapeXml(t.category)}</category>
    </item>`;
});

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} - 2026 Game Releases &amp; Search Trends</title>
    <link>${SITE_URL}</link>
    <description>Authoritative live countdown, release dates, hardware intelligence, and search trends for 2026 video games.</description>
    <language>en-US</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>NextPlay RSS Engine</generator>
${itemsXml}
  </channel>
</rss>`;

fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf8');

if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'feed.xml'), rssXml, 'utf8');
}

console.log('✅ RSS feeds generated successfully at public/rss.xml and public/feed.xml');
