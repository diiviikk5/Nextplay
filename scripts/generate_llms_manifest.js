/**
 * Complete LLMs Manifest Generator for NextPlay 2026
 * Generates llms.txt and llms-full.txt for Generative Engine Optimization (GEO) & AEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://nextplaygame.me';
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Load games data
const gamesDataPath = path.join(__dirname, '..', 'src', 'data', 'games.json');
const games = JSON.parse(fs.readFileSync(gamesDataPath, 'utf8'));

// Load gaming trends ontology
const trendsDataPath = path.join(__dirname, '..', 'src', 'data', 'gaming_trends_ontology.json');
const trends = fs.existsSync(trendsDataPath) ? JSON.parse(fs.readFileSync(trendsDataPath, 'utf8')) : [];

console.log(`🤖 Generating LLMs manifests: ${games.length} games and ${trends.length} trends...`);

// 1. Build llms.txt (Concise Index)
const llmsTxtContent = `# NextPlay 2026

> The authoritative 2026 video game release tracker and gaming search intelligence engine featuring live countdowns, platform filters (PC, PS5, Xbox Series X/S, Switch 2, Mac), 1,000+ gaming search trends, PC system requirements, and interactive community tools.

## Primary Resources
- [Upcoming 2026 Games Calendar](${SITE_URL}/calendar): Complete month-by-month release calendar for all 2026 video games.
- [Gaming Trends Intelligence Hub (1,000+ Topics)](${SITE_URL}/trends): Real-time analysis of hardware (Switch 2, PS5 Pro), engines (UE 5.5), franchises, and search queries.
- [Can I Run It? 2026 PC Specs Checker](${SITE_URL}/can-i-run-it): Interactive hardware compatibility tool for GPU, CPU, and RAM.
- [PC System Requirements Directory](${SITE_URL}/system-requirements): Minimum, Recommended, and Ultra specs for every 2026 PC game.
- [2026 Gaming Hype Battles](${SITE_URL}/battles): Head-to-head community voting showdowns for upcoming releases.
- [2026 Game Finder & Quiz](${SITE_URL}/game-finder): 3-step recommendation tool based on platform, genre, and playstyle.
- [Compare 2026 Games](${SITE_URL}/compare): Side-by-side release date and spec comparison tool.
- [Similar Games Directory](${SITE_URL}/games-like): Algorithmic alternatives for every major 2026 release.
- [2026 Games Tier List](${SITE_URL}/tier-list): Interactive community tier list ranking the most anticipated games of 2026.
- [Upcoming Xbox Game Pass Games (2026)](${SITE_URL}/service/xbox-game-pass): Day One Game Pass release schedule.
- [Upcoming Mac Games (2026)](${SITE_URL}/platform/mac): Dedicated hub for Apple Silicon and macOS video game releases in 2026.
- [Upcoming PS5 Games (2026)](${SITE_URL}/platform/playstation-5): Confirmed PlayStation 5 titles releasing in 2026.
- [Upcoming PC Games (2026)](${SITE_URL}/platform/pc): Windows and Steam video game releases scheduled for 2026.
- [Full 2026 Games Database (llms-full.txt)](${SITE_URL}/llms-full.txt): Complete structured text export of all 250+ games and 1,000+ trends.

## Top Trending Topics in Gaming (2026)
${trends.slice(0, 15).map(t => `- [${t.name}](${SITE_URL}/trends/${t.slug}): Category: ${t.category}. Velocity: ${t.searchVolumeScore}/100. ${t.queryIntent}`).join('\n')}

## Most Anticipated 2026 Releases
${games.slice(0, 15).map(g => `- [${g.title}](${SITE_URL}/game/${g.slug}): Releases ${g.releaseDate}. Platforms: ${(g.platforms || []).join(', ')}. Genres: ${(g.genres || []).join(', ')}. Hype: ${g.hype || 50}%.`).join('\n')}
`;

// 2. Build llms-full.txt (Comprehensive Knowledge Base)
let llmsFullContent = `# NextPlay 2026 - Comprehensive Video Game Knowledge Base & Search Intelligence

> Master database for AI search engines, answer engines, and LLMs (ChatGPT, Claude, Perplexity, Gemini). Covers 250+ confirmed 2026 video game releases and 1,009 gaming search trends, hardware specs, and query intents.
> Website: ${SITE_URL}

---

# SECTION 1: CONFIRMED 2026 VIDEO GAMES (${games.length} TITLES)

`;

games.forEach(g => {
    llmsFullContent += `## ${g.title}\n`;
    llmsFullContent += `- **Canonical URL**: ${SITE_URL}/game/${g.slug}\n`;
    llmsFullContent += `- **Release Date**: ${g.releaseDate || '2026'}\n`;
    llmsFullContent += `- **Platforms**: ${(g.platforms || []).join(', ') || 'TBA'}\n`;
    llmsFullContent += `- **Genres**: ${(g.genres || []).join(', ') || 'Action'}\n`;
    llmsFullContent += `- **Developer**: ${(g.developers || []).join(', ') || 'TBA'}\n`;
    llmsFullContent += `- **Publisher**: ${(g.publishers || []).join(', ') || 'TBA'}\n`;
    llmsFullContent += `- **Hype Score**: ${g.hype || 50}%\n`;
    if (g.description) {
        llmsFullContent += `- **Summary**: ${g.description.replace(/\n+/g, ' ').trim()}\n`;
    }
    llmsFullContent += `\n`;
});

llmsFullContent += `\n---\n\n# SECTION 2: 1,009 GAMING SEARCH TRENDS & HARDWARE ONTOLOGY\n\n`;

trends.forEach(t => {
    llmsFullContent += `### ${t.name}\n`;
    llmsFullContent += `- **Topic URL**: ${SITE_URL}/trends/${t.slug}\n`;
    llmsFullContent += `- **Category**: ${t.category}\n`;
    llmsFullContent += `- **Search Velocity Score**: ${t.searchVolumeScore || 85}/100\n`;
    llmsFullContent += `- **Search Query Intent**: ${t.queryIntent}\n`;
    if (t.description) {
        llmsFullContent += `- **Analysis**: ${t.description}\n`;
    }
    if (t.relatedKeywords && t.relatedKeywords.length > 0) {
        llmsFullContent += `- **Related Keywords**: ${t.relatedKeywords.join(', ')}\n`;
    }
    if (t.associatedGames && t.associatedGames.length > 0) {
        llmsFullContent += `- **Related 2026 Games**: ${t.associatedGames.map(ag => `${ag.title} (${SITE_URL}/game/${ag.slug})`).join(', ')}\n`;
    }
    if (t.faqs && t.faqs.length > 0) {
        t.faqs.forEach(faq => {
            llmsFullContent += `  - **Q**: ${faq.q}\n`;
            llmsFullContent += `    **A**: ${faq.a}\n`;
        });
    }
    llmsFullContent += `\n`;
});

// Write files to public/
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxtContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullContent, 'utf8');

// Also sync to dist/ if it exists
if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxtContent, 'utf8');
    fs.writeFileSync(path.join(distDir, 'llms-full.txt'), llmsFullContent, 'utf8');
}

console.log(`✅ LLMs manifests generated successfully! (${(Buffer.byteLength(llmsFullContent, 'utf8') / 1024).toFixed(1)} KB full knowledge base)`);
