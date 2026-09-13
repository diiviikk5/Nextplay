import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://nextplaygame.me';
const SITE_NAME = 'NextPlay 2026';
const DEFAULT_IMAGE = 'https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg';

// Load games data
const gamesDataPath = path.join(__dirname, '..', 'src', 'data', 'games.json');
const games = JSON.parse(fs.readFileSync(gamesDataPath, 'utf8'));

const distPath = path.join(__dirname, '..', 'dist');
const templatePath = path.join(distPath, 'index.html');

if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found! Run "vite build" first.');
    process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function formatReleaseDate(dateStr) {
    if (!dateStr) return '2026';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function getDaysLeft(dateStr) {
    try {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        return diff;
    } catch {
        return 0;
    }
}

function buildHtml({ title, description, canonicalUrl, ogImage, ogType = 'website', schemas = [], semanticBody = '' }) {
    let html = template;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(title)}</title>`);

    // Replace Meta Description
    if (html.includes('name="description"')) {
        html = html.replace(/<meta[^>]+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
    } else {
        html = html.replace('</head>', `  <meta name="description" content="${escapeHtml(description)}" />\n</head>`);
    }

    // Replace or inject Canonical Link
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    if (html.includes('rel="canonical"')) {
        html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, canonicalTag);
    } else {
        html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
    }

    // Open Graph Tags
    const ogTags = `
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${ogImage || DEFAULT_IMAGE}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage || DEFAULT_IMAGE}" />`;

    // Clean old og/twitter tags
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+property=["']og:type["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+property=["']og:site_name["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, '');

    // Inject schemas
    let schemaTags = '';
    if (schemas.length > 0) {
        schemaTags = schemas.map(s => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`).join('\n');
    }

    html = html.replace('</head>', `${ogTags}\n${schemaTags}\n</head>`);

    // Inject Semantic Body inside <div id="root"></div> for crawlers and JS-disabled clients
    if (semanticBody) {
        html = html.replace('<div id="root"></div>', `<div id="root"><div class="prerender-content">${semanticBody}</div></div>`);
    }

    return html;
}

function writeRoute(routePath, htmlContent) {
    const cleanPath = routePath.replace(/^\//, '').replace(/\/$/, '');
    const outDir = cleanPath ? path.join(distPath, cleanPath) : distPath;
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent, 'utf8');
}

console.log('🚀 Starting SSG pre-rendering pipeline...');
let totalPrerendered = 0;

// 1. Prerender All 250 Game Pages
games.forEach(game => {
    const formattedDate = formatReleaseDate(game.releaseDate);
    const daysLeft = getDaysLeft(game.releaseDate);
    const platformsStr = game.platforms?.join(', ') || 'PC, PS5, Xbox';
    const genresStr = game.genres?.join(', ') || 'Action';
    const devsStr = game.developers?.join(', ') || 'TBA';
    const pubsStr = game.publishers?.join(', ') || 'TBA';
    const canonicalUrl = `${SITE_URL}/game/${game.slug}`;

    const title = `${game.title} Release Date (${formattedDate}), Platforms & Countdown | ${SITE_NAME}`;
    const description = `${game.title} confirmed 2026 release date: ${formattedDate}. Platforms: ${platformsStr}. Real-time countdown timer, gameplay details, and release updates on NextPlay.`;

    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "@id": canonicalUrl,
            "name": game.title,
            "description": game.description || `${game.title} is an upcoming video game scheduled for release in 2026 on ${platformsStr}.`,
            "gamePlatform": game.platforms || ["PC", "PlayStation 5", "Xbox Series X/S"],
            "applicationCategory": "Game",
            "genre": game.genres || ["Action"],
            "datePublished": game.releaseDate,
            "image": game.image || DEFAULT_IMAGE,
            "url": canonicalUrl,
            "releasedEvent": {
                "@type": "PublicationEvent",
                "startDate": game.releaseDate,
                "location": { "@type": "Place", "name": "Worldwide" }
            },
            "publisher": game.publishers?.length ? { "@type": "Organization", "name": game.publishers[0] } : undefined,
            "developer": game.developers?.length ? { "@type": "Organization", "name": game.developers[0] } : undefined,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": Math.min(100, Math.max(75, game.hype || 85)),
                "bestRating": 100,
                "worstRating": 0,
                "ratingCount": Math.max(25, (game.hype || 10) * 4)
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Games", "item": SITE_URL },
                ...(game.genres?.[0] ? [{ "@type": "ListItem", "position": 2, "name": game.genres[0], "item": `${SITE_URL}/genre/${slugify(game.genres[0])}` }] : []),
                { "@type": "ListItem", "position": game.genres?.[0] ? 3 : 2, "name": game.title, "item": canonicalUrl }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `When does ${game.title} release in 2026?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${game.title} is scheduled to launch on ${formattedDate}. You can track the real-time live countdown timer on NextPlay.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `What platforms is ${game.title} coming to?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${game.title} is confirmed for ${platformsStr}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Who is making ${game.title}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${game.title} is developed by ${devsStr}${game.publishers?.length ? ` and published by ${pubsStr}` : ''}.`
                    }
                }
            ]
        }
    ];

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <nav aria-label="Breadcrumb" style="margin-bottom: 1rem; color: #94a3b8; font-size: 0.85rem;">
            <a href="/" style="color: #06b6d4; text-decoration: none;">Home</a> &gt;
            ${game.genres?.[0] ? `<a href="/genre/${slugify(game.genres[0])}" style="color: #06b6d4; text-decoration: none;">${escapeHtml(game.genres[0])}</a> &gt;` : ''}
            <span>${escapeHtml(game.title)}</span>
        </nav>
        <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">
                ${escapeHtml(game.title)} Release Date &amp; Countdown (2026)
            </h1>
            <p style="color: #06b6d4; font-size: 1.1rem; font-weight: 600;">
                Confirmed Release: ${escapeHtml(formattedDate)} ${daysLeft > 0 ? `(${daysLeft} days remaining)` : ''}
            </p>
        </header>

        <div class="quick-facts-box" style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.2); border-left: 4px solid #06b6d4; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <h2 style="font-size: 1.2rem; color: #06b6d4; margin-top: 0; margin-bottom: 1rem;">Quick Facts &amp; Release Summary</h2>
            <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; color: #cbd5e1;">
                <li><strong>Release Date:</strong> ${escapeHtml(formattedDate)}</li>
                <li><strong>Platforms:</strong> ${escapeHtml(platformsStr)}</li>
                <li><strong>Developer:</strong> ${escapeHtml(devsStr)}</li>
                <li><strong>Publisher:</strong> ${escapeHtml(pubsStr)}</li>
                <li><strong>Genres:</strong> ${escapeHtml(genresStr)}</li>
                <li><strong>Hype Rating:</strong> ${game.hype || 80}% Anticipation</li>
            </ul>
        </div>

        <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">About ${escapeHtml(game.title)}</h2>
            <p style="line-height: 1.8; color: #cbd5e1; font-size: 1.05rem;">${escapeHtml(game.description || `${game.title} is an upcoming 2026 release.`)}</p>
            ${game.storyline ? `<h3 style="font-size: 1.2rem; color: #94a3b8; margin-top: 1.5rem;">Storyline</h3><p style="color: #94a3b8; line-height: 1.7;">${escapeHtml(game.storyline)}</p>` : ''}
        </section>

        <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <h3 style="font-size: 1.1rem; color: #fff; margin: 0 0 0.5rem;">When does ${escapeHtml(game.title)} release in 2026?</h3>
                    <p style="color: #94a3b8; margin: 0;">${escapeHtml(game.title)} is scheduled for release on ${escapeHtml(formattedDate)}.</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <h3 style="font-size: 1.1rem; color: #fff; margin: 0 0 0.5rem;">What platforms will ${escapeHtml(game.title)} be available on?</h3>
                    <p style="color: #94a3b8; margin: 0;">${escapeHtml(game.title)} is confirmed for ${escapeHtml(platformsStr)}.</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <h3 style="font-size: 1.1rem; color: #fff; margin: 0 0 0.5rem;">Who is developing ${escapeHtml(game.title)}?</h3>
                    <p style="color: #94a3b8; margin: 0;">${escapeHtml(game.title)} is being developed by ${escapeHtml(devsStr)}.</p>
                </div>
            </div>
        </section>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: game.image,
        ogType: 'article',
        schemas,
        semanticBody
    });

    writeRoute(`/game/${game.slug}`, html);
    totalPrerendered++;
});

// 2. Prerender Tier List (/tier-list)
{
    const title = `2026 Video Game Tier List: Rank Upcoming 2026 Titles | ${SITE_NAME}`;
    const description = `Interactive 2026 video game tier list creator. Rank GTA 6, Crimson Desert, Resident Evil 9 and 250+ upcoming games in S/A/B/C/D/F tiers. Export shareable image rankings.`;
    const canonicalUrl = `${SITE_URL}/tier-list`;

    const topGames = games.slice(0, 15);
    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "2026 Video Game Anticipation Tier List",
            "description": description,
            "numberOfItems": games.length,
            "itemListElement": topGames.map((g, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": g.title,
                "url": `${SITE_URL}/game/${g.slug}`
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is the 2026 Game Tier List?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The NextPlay 2026 Game Tier List is an interactive ranking tool allowing gamers to rank all 250+ upcoming 2026 video game releases into S, A, B, C, D, and F tiers."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I export and share my tier list?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Click the Export Image button to download a high-resolution PNG image with your customized rankings to share directly on Twitter/X, Discord, and Reddit."
                    }
                }
            ]
        }
    ];

    const semanticBody = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header style="text-align: center; margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">2026 Video Game Tier List Creator</h1>
            <p style="color: #94a3b8; font-size: 1.1rem; max-width: 600px; margin: 0 auto;">Rank the most anticipated video games releasing in 2026. Drag, drop, rate, and export your custom tier list.</p>
        </header>
        <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem;">Ranked Games Directory</h2>
            <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; color: #cbd5e1;">
                ${games.slice(0, 30).map(g => `<li><a href="/game/${g.slug}" style="color: #06b6d4; text-decoration: none;">${escapeHtml(g.title)}</a></li>`).join('')}
            </ul>
        </section>
    </div>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: DEFAULT_IMAGE,
        schemas,
        semanticBody
    });

    writeRoute('/tier-list', html);
    totalPrerendered++;
}

// 3. Prerender Platforms
const platformMap = new Map();
games.forEach(g => {
    g.platforms?.forEach(p => {
        if (!platformMap.has(p)) platformMap.set(p, []);
        platformMap.get(p).push(g);
    });
});

for (const [platform, pGames] of platformMap.entries()) {
    const pSlug = slugify(platform);
    const isMac = platform.toLowerCase() === 'mac';
    const canonicalUrl = `${SITE_URL}/platform/${pSlug}`;
    const topGameTitles = pGames.slice(0, 4).map(g => g.title).join(', ');

    const title = isMac
        ? `Upcoming Mac Games (2026): Confirmed Release Dates & macOS Hub | ${SITE_NAME}`
        : `Upcoming ${platform} Games (2026): Confirmed Releases & Calendar | ${SITE_NAME}`;
    const description = isMac
        ? `Complete guide to upcoming Mac games in 2026. Track ${pGames.length} confirmed macOS and Apple Silicon releases including ${topGameTitles} with live countdown timers.`
        : `All confirmed ${platform} games releasing in 2026. Track ${pGames.length} upcoming releases including ${topGameTitles}, release countdowns, and launch windows on NextPlay.`;

    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `${platform} Games 2026`,
            "description": description,
            "numberOfItems": pGames.length,
            "itemListElement": pGames.slice(0, 20).map((g, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": g.title,
                "url": `${SITE_URL}/game/${g.slug}`
            }))
        }
    ];

    const semanticBody = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">Upcoming ${escapeHtml(platform)} Games in 2026</h1>
            <p style="color: #94a3b8; font-size: 1.1rem;">${escapeHtml(description)}</p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${pGames.map(g => `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 1.25rem; border-radius: 8px;">
                    <h2 style="font-size: 1.2rem; margin: 0 0 0.5rem;"><a href="/game/${g.slug}" style="color: #fff; text-decoration: none;">${escapeHtml(g.title)}</a></h2>
                    <p style="color: #06b6d4; font-size: 0.9rem; margin: 0 0 0.5rem;">Release: ${escapeHtml(formatReleaseDate(g.releaseDate))}</p>
                    <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.5; margin: 0;">${escapeHtml((g.description || '').slice(0, 120))}...</p>
                </div>
            `).join('')}
        </div>
    </div>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: pGames[0]?.image || DEFAULT_IMAGE,
        schemas,
        semanticBody
    });

    writeRoute(`/platform/${pSlug}`, html);
    totalPrerendered++;
}

// 4. Prerender Genres
const genreMap = new Map();
games.forEach(g => {
    g.genres?.forEach(genre => {
        if (!genreMap.has(genre)) genreMap.set(genre, []);
        genreMap.get(genre).push(g);
    });
});

for (const [genre, gGames] of genreMap.entries()) {
    const gSlug = slugify(genre);
    const canonicalUrl = `${SITE_URL}/genre/${gSlug}`;
    const topGameTitles = gGames.slice(0, 4).map(g => g.title).join(', ');

    const title = `Upcoming 2026 ${genre} Games: Release Dates & Trackers | ${SITE_NAME}`;
    const description = `Browse all ${gGames.length} upcoming ${genre.toLowerCase()} games releasing in 2026 including ${topGameTitles}. Live countdowns, release windows, and watchlists on NextPlay.`;

    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `2026 ${genre} Games`,
            "description": description,
            "numberOfItems": gGames.length,
            "itemListElement": gGames.slice(0, 20).map((g, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": g.title,
                "url": `${SITE_URL}/game/${g.slug}`
            }))
        }
    ];

    const semanticBody = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">Upcoming 2026 ${escapeHtml(genre)} Games</h1>
            <p style="color: #94a3b8; font-size: 1.1rem;">${escapeHtml(description)}</p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${gGames.map(g => `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 1.25rem; border-radius: 8px;">
                    <h2 style="font-size: 1.2rem; margin: 0 0 0.5rem;"><a href="/game/${g.slug}" style="color: #fff; text-decoration: none;">${escapeHtml(g.title)}</a></h2>
                    <p style="color: #06b6d4; font-size: 0.9rem; margin: 0 0 0.5rem;">Release: ${escapeHtml(formatReleaseDate(g.releaseDate))}</p>
                    <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.5; margin: 0;">${escapeHtml((g.description || '').slice(0, 120))}...</p>
                </div>
            `).join('')}
        </div>
    </div>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: gGames[0]?.image || DEFAULT_IMAGE,
        schemas,
        semanticBody
    });

    writeRoute(`/genre/${gSlug}`, html);
    totalPrerendered++;
}

// 5. Prerender Calendar Months
const months = [
    { num: '01', name: 'January' }, { num: '02', name: 'February' }, { num: '03', name: 'March' },
    { num: '04', name: 'April' }, { num: '05', name: 'May' }, { num: '06', name: 'June' },
    { num: '07', name: 'July' }, { num: '08', name: 'August' }, { num: '09', name: 'September' },
    { num: '10', name: 'October' }, { num: '11', name: 'November' }, { num: '12', name: 'December' }
];

months.forEach(m => {
    const mSlug = `2026-${m.num}`;
    const monthGames = games.filter(g => (g.releaseDate || '').startsWith(mSlug));
    const canonicalUrl = `${SITE_URL}/calendar/${mSlug}`;
    const title = `${m.name} 2026 Video Game Releases | Full Calendar & Dates | ${SITE_NAME}`;
    const description = `All confirmed video games releasing in ${m.name} 2026. Track ${monthGames.length} upcoming releases with live countdowns, platforms, and Google Calendar export.`;

    const semanticBody = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">${m.name} 2026 Video Game Releases</h1>
            <p style="color: #94a3b8; font-size: 1.1rem;">${escapeHtml(description)}</p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${monthGames.length > 0 ? monthGames.map(g => `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 1.25rem; border-radius: 8px;">
                    <h2 style="font-size: 1.2rem; margin: 0 0 0.5rem;"><a href="/game/${g.slug}" style="color: #fff; text-decoration: none;">${escapeHtml(g.title)}</a></h2>
                    <p style="color: #06b6d4; font-size: 0.9rem; margin: 0 0 0.5rem;">${escapeHtml(formatReleaseDate(g.releaseDate))}</p>
                </div>
            `).join('') : '<p style="color: #94a3b8;">Releases for this month will be announced soon. Track all 2026 games on NextPlay.</p>'}
        </div>
    </div>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody
    });

    writeRoute(`/calendar/${mSlug}`, html);
    totalPrerendered++;
});

// 6. Prerender Core Pages
const corePages = [
    {
        path: '/calendar',
        title: `2026 Video Game Release Calendar: Complete Month-by-Month Schedule | ${SITE_NAME}`,
        description: `Complete 2026 video game release date calendar. Filter releases by PC, PlayStation 5, Xbox Series X/S, and Switch. Export dates to Google Calendar or iCal.`
    },
    {
        path: '/compare',
        title: `Compare 2026 Video Games Side-by-Side: Specs, Dates & Hype | ${SITE_NAME}`,
        description: `Compare upcoming 2026 games side-by-side. Compare release dates, platforms, developers, genres, and community hype ratings for up to 4 titles simultaneously.`
    },
    {
        path: '/my-top-5',
        title: `My Top 5 Most Anticipated 2026 Games: Custom Share Card | ${SITE_NAME}`,
        description: `Pick and rank your Top 5 most anticipated video games releasing in 2026. Download your custom rank card to share on social media.`
    },
    {
        path: '/bracket',
        title: `2026 Video Game Release Bracket Challenge | ${SITE_NAME}`,
        description: `Vote on head-to-head match-ups between the biggest 2026 game releases. Crown the most anticipated game of 2026!`
    },
    {
        path: '/about',
        title: `About NextPlay 2026: The Independent Video Game Release Tracker | ${SITE_NAME}`,
        description: `Learn about NextPlay 2026, our editorial standards, release date verification methodology, and mission to track upcoming video game releases accurately.`
    },
    {
        path: '/privacy',
        title: `Privacy Policy | ${SITE_NAME}`,
        description: `NextPlay 2026 privacy policy, data practices, and terms of service.`
    },
    {
        path: '/terms',
        title: `Terms of Service | ${SITE_NAME}`,
        description: `Terms and conditions for using the NextPlay 2026 video game release tracker platform.`
    },
    {
        path: '/contact',
        title: `Contact Us & Game Submissions | ${SITE_NAME}`,
        description: `Submit upcoming 2026 game release dates, corrections, press releases, or contact the NextPlay editorial team.`
    },
    {
        path: '/disclaimer',
        title: `Disclaimer | ${SITE_NAME}`,
        description: `NextPlay 2026 disclaimer regarding video game release dates, trademarks, and copyright notices.`
    },
    {
        path: '/genre',
        title: `Browse 2026 Video Games by Genre: RPG, Action, Indie & More | ${SITE_NAME}`,
        description: `Explore all 2026 video games categorized across 24 distinct genres. Find release dates for RPGs, shooters, visual novels, simulators, and strategy games.`
    },
    {
        path: '/platform',
        title: `Browse 2026 Video Games by Platform: PS5, Xbox, PC, Mac, Switch | ${SITE_NAME}`,
        description: `Browse 2026 games by platform. Confirmed launch dates and countdowns for PC, PlayStation 5, Xbox Series X/S, macOS, and Nintendo Switch.`
    }
];

corePages.forEach(p => {
    const canonicalUrl = `${SITE_URL}${p.path}`;
    const html = buildHtml({
        title: p.title,
        description: p.description,
        canonicalUrl,
        semanticBody: `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;"><h1>${escapeHtml(p.title)}</h1><p>${escapeHtml(p.description)}</p></div>`
    });
    writeRoute(p.path, html);
    totalPrerendered++;
});

// Update root index.html with canonical for Homepage
const homepageTitle = `NextPlay 2026 | GTA 6 Release Date Countdown & 2026 Game Releases Calendar`;
const homepageDesc = `The authoritative 2026 video game release tracker. Real-time countdown to GTA 6, Crimson Desert, Resident Evil 9, and 250+ titles. Filter by Mac, PS5, PC, Xbox, create watchlists & calendar exports.`;
const homepageCanonical = `${SITE_URL}/`;
const homepageHtml = buildHtml({
    title: homepageTitle,
    description: homepageDesc,
    canonicalUrl: homepageCanonical,
    schemas: [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": SITE_URL,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL}/?search={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": `${SITE_NAME} Game Tracker`,
            "url": SITE_URL,
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web Browser"
        }
    ]
});
fs.writeFileSync(path.join(distPath, 'index.html'), homepageHtml, 'utf8');

console.log(`✅ SSG pre-rendering completed! Successfully generated ${totalPrerendered} static HTML pages in dist/!`);
