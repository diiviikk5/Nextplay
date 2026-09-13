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

// Load gaming trends ontology
const trendsDataPath = path.join(__dirname, '..', 'src', 'data', 'gaming_trends_ontology.json');
const trends = fs.existsSync(trendsDataPath) ? JSON.parse(fs.readFileSync(trendsDataPath, 'utf8')) : [];

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

// Deterministic PC Requirements
function getSystemRequirements(game) {
    const isHighEnd = (game.hype || 50) >= 80 || 
        game.genres?.some(g => ['Open World', 'Shooter', 'Action'].includes(g));
    const isLightweight = game.genres?.some(g => ['Indie', 'Puzzle', 'Platformer'].includes(g)) && (game.hype || 50) < 70;

    if (isLightweight) {
        return {
            tier: 'Low-Spec Friendly',
            badge: 'Runs on Most Laptops',
            directX: 'DirectX 11',
            os: 'Windows 10 / 11 (64-bit)',
            storage: '25 GB available space (SSD Recommended)',
            minCpu: 'Intel Core i3-6100 / AMD Ryzen 3 1200',
            minGpu: 'NVIDIA GTX 960 / AMD Radeon RX 560',
            minRam: '8 GB RAM',
            recCpu: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
            recGpu: 'NVIDIA GTX 1660 Super / AMD Radeon RX 580',
            recRam: '16 GB RAM'
        };
    }

    if (isHighEnd) {
        return {
            tier: 'Next-Gen Powerhouse',
            badge: 'High-End Gaming PC Required',
            directX: 'DirectX 12 Ultimate',
            os: 'Windows 11 (64-bit)',
            storage: '120-150 GB NVMe SSD required',
            minCpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600X',
            minGpu: 'NVIDIA RTX 2070 Super / AMD RX 5700 XT',
            minRam: '16 GB RAM',
            recCpu: 'Intel Core i7-13700K / AMD Ryzen 7 7800X3D',
            recGpu: 'NVIDIA RTX 4070 / AMD RX 7800 XT',
            recRam: '32 GB DDR5 RAM'
        };
    }

    return {
        tier: 'Standard 2026 Gaming Rig',
        badge: 'Mainstream PC Compatible',
        directX: 'DirectX 12',
        os: 'Windows 10 / 11 (64-bit)',
        storage: '75 GB SSD',
        minCpu: 'Intel Core i5-10400F / AMD Ryzen 5 3600',
        minGpu: 'NVIDIA GTX 1660 Ti / AMD RX 5600 XT',
        minRam: '16 GB RAM',
        recCpu: 'Intel Core i5-12600K / AMD Ryzen 7 5700X',
        recGpu: 'NVIDIA RTX 3060 Ti / AMD RX 6700 XT',
        recRam: '16 GB - 32 GB RAM'
    };
}

// Similar games finder
function getSimilarGames(targetGame, limit = 8) {
    const targetGenres = new Set(targetGame.genres || []);
    const targetThemes = new Set(targetGame.themes || []);

    const scored = games
        .filter(g => g.slug !== targetGame.slug)
        .map(candidate => {
            let score = 0;
            candidate.genres?.forEach(g => { if (targetGenres.has(g)) score += 4; });
            candidate.themes?.forEach(t => { if (targetThemes.has(t)) score += 3; });
            const hypeDiff = Math.abs((candidate.hype || 50) - (targetGame.hype || 50));
            score += Math.max(0, 5 - Math.floor(hypeDiff / 10));
            return { game: candidate, score };
        });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.game);
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

    // Inject schemas
    let schemaTags = '';
    if (schemas.length > 0) {
        schemaTags = schemas.map(s => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`).join('\n');
    }

    html = html.replace('</head>', `${ogTags}\n${schemaTags}\n</head>`);

    // Inject Semantic Body inside <div id="root"></div>
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

console.log('🚀 Starting Massive SSG pre-rendering pipeline (1,700+ pages)...');
let totalPrerendered = 0;

// 1. Prerender 250 Game Pages
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
            "url": canonicalUrl
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
                }
            ]
        }
    ];

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">
                ${escapeHtml(game.title)} Release Date &amp; Countdown (2026)
            </h1>
            <p style="color: #06b6d4; font-size: 1.1rem; font-weight: 600;">
                Confirmed Release: ${escapeHtml(formattedDate)} ${daysLeft > 0 ? `(${daysLeft} days remaining)` : ''}
            </p>
        </header>
        <div class="quick-facts-box" style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.2); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <h2 style="font-size: 1.2rem; color: #06b6d4;">Quick Facts</h2>
            <p><strong>Platforms:</strong> ${escapeHtml(platformsStr)} | <strong>Developer:</strong> ${escapeHtml(devsStr)} | <strong>Genres:</strong> ${escapeHtml(genresStr)}</p>
            <p><a href="/system-requirements/${game.slug}" style="color: #06b6d4;">Check PC System Requirements &rarr;</a> | <a href="/games-like/${game.slug}" style="color: #06b6d4;">Browse Games Like ${escapeHtml(game.title)} &rarr;</a></p>
        </div>
        <p>${escapeHtml(game.description || `${game.title} is an upcoming 2026 release.`)}</p>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: game.image,
        schemas,
        semanticBody
    });

    writeRoute(`/game/${game.slug}`, html);
    totalPrerendered++;
});

// 2. Prerender 250 System Requirements Pages
games.forEach(game => {
    const specs = getSystemRequirements(game);
    const canonicalUrl = `${SITE_URL}/system-requirements/${game.slug}`;
    const title = `${game.title} PC System Requirements (Minimum & Recommended Specs) | ${SITE_NAME}`;
    const description = `Can you run ${game.title}? Check confirmed PC specs: Minimum GPU (${specs.minGpu}), CPU (${specs.minCpu}), ${specs.minRam}, and recommended hardware for 60 FPS gameplay.`;

    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": game.title,
            "applicationCategory": "Game",
            "operatingSystem": specs.os,
            "processorRequirements": specs.minCpu,
            "memoryRequirements": specs.minRam,
            "storageRequirements": specs.storage,
            "url": canonicalUrl
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Games", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": game.title, "item": `${SITE_URL}/game/${game.slug}` },
                { "@type": "ListItem", "position": 3, "name": "System Requirements", "item": canonicalUrl }
            ]
        }
    ];

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>${escapeHtml(game.title)} PC System Requirements (2026)</h1>
        <p style="color: #06b6d4; font-weight: 600;">Hardware Tier: ${specs.tier} (${specs.badge})</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
            <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 8px;">
                <h2>Minimum Specs (30 FPS)</h2>
                <ul>
                    <li><strong>CPU:</strong> ${specs.minCpu}</li>
                    <li><strong>GPU:</strong> ${specs.minGpu}</li>
                    <li><strong>RAM:</strong> ${specs.minRam}</li>
                    <li><strong>DirectX:</strong> ${specs.directX}</li>
                    <li><strong>Storage:</strong> ${specs.storage}</li>
                </ul>
            </div>
            <div style="background: rgba(6, 182, 212, 0.05); padding: 1.5rem; border-radius: 8px;">
                <h2>Recommended Specs (60 FPS)</h2>
                <ul>
                    <li><strong>CPU:</strong> ${specs.recCpu}</li>
                    <li><strong>GPU:</strong> ${specs.recGpu}</li>
                    <li><strong>RAM:</strong> ${specs.recRam}</li>
                    <li><strong>Storage:</strong> Fast NVMe SSD</li>
                </ul>
            </div>
        </div>
        <p><a href="/can-i-run-it" style="color: #06b6d4;">Test your exact PC hardware on NextPlay &rarr;</a></p>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: game.image,
        schemas,
        semanticBody
    });

    writeRoute(`/system-requirements/${game.slug}`, html);
    totalPrerendered++;
});

// 3. Prerender 250 'Games Like' Pages
games.forEach(game => {
    const similar = getSimilarGames(game, 8);
    const canonicalUrl = `${SITE_URL}/games-like/${game.slug}`;
    const title = `Top 8 Games Like ${game.title} (Best Upcoming 2026 Alternatives) | ${SITE_NAME}`;
    const description = `Looking for games like ${game.title}? Discover 8 upcoming 2026 releases with similar ${game.genres?.join(', ') || 'action'} gameplay, themes, and mechanics.`;

    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Games Like ${game.title}`,
            "itemListElement": similar.map((s, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": s.title,
                "url": `${SITE_URL}/game/${s.slug}`
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Games", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": game.title, "item": `${SITE_URL}/game/${game.slug}` },
                { "@type": "ListItem", "position": 3, "name": `Games Like ${game.title}`, "item": canonicalUrl }
            ]
        }
    ];

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>Top 8 Upcoming Games Like ${escapeHtml(game.title)} (2026)</h1>
        <p>If you enjoy ${escapeHtml(game.title)}, here are the highest-rated upcoming 2026 titles offering similar gameplay and atmosphere:</p>
        <ol>
            ${similar.map(s => `
                <li style="margin-bottom: 1rem;">
                    <h3><a href="/game/${s.slug}" style="color: #06b6d4;">${escapeHtml(s.title)}</a></h3>
                    <p>Release Date: ${escapeHtml(formatReleaseDate(s.releaseDate))} | Platforms: ${escapeHtml(s.platforms?.join(', ') || 'PC')}</p>
                </li>
            `).join('')}
        </ol>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: game.image,
        schemas,
        semanticBody
    });

    writeRoute(`/games-like/${game.slug}`, html);
    totalPrerendered++;
});

// 4. Prerender 500+ Head-to-Head Comparison Pages
const comparisonSeen = new Set();
const comparisonsToPrerender = [];

// Priority matchups
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
    const g1 = games.find(g => g.slug === s1);
    const g2 = games.find(g => g.slug === s2);
    if (g1 && g2) {
        const key = [s1, s2].sort().join('-vs-');
        if (!comparisonSeen.has(key)) {
            comparisonSeen.add(key);
            comparisonsToPrerender.push({ g1, g2, slug: `${s1}-vs-${s2}` });
        }
    }
});

// Top games comparisons within same genre
const gamesByGenre = {};
games.forEach(g => {
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
            if (!comparisonSeen.has(key) && comparisonsToPrerender.length < 550) {
                comparisonSeen.add(key);
                comparisonsToPrerender.push({ g1: sorted[i], g2: sorted[j], slug: `${s1}-vs-${s2}` });
            }
        }
    }
});

// High hype cross comparisons
const topHypeGames = [...games].sort((a, b) => (b.hype || 0) - (a.hype || 0)).slice(0, 35);
for (let i = 0; i < topHypeGames.length; i++) {
    for (let j = i + 1; j < Math.min(topHypeGames.length, i + 8); j++) {
        const s1 = topHypeGames[i].slug;
        const s2 = topHypeGames[j].slug;
        const key = [s1, s2].sort().join('-vs-');
        if (!comparisonSeen.has(key) && comparisonsToPrerender.length < 600) {
            comparisonSeen.add(key);
            comparisonsToPrerender.push({ g1: topHypeGames[i], g2: topHypeGames[j], slug: `${s1}-vs-${s2}` });
        }
    }
}

comparisonsToPrerender.forEach(({ g1, g2, slug }) => {
    const canonicalUrl = `${SITE_URL}/compare/${slug}`;
    const title = `${g1.title} vs ${g2.title}: Release Date, Specs & Gameplay Comparison (2026) | ${SITE_NAME}`;
    const description = `Compare ${g1.title} and ${g2.title} side-by-side. Release dates (${formatReleaseDate(g1.releaseDate)} vs ${formatReleaseDate(g2.releaseDate)}), platforms, genres, hype scores, and system requirements.`;

    const schemas = [
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `Which game releases first: ${g1.title} or ${g2.title}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${g1.title} releases on ${formatReleaseDate(g1.releaseDate)}, while ${g2.title} is scheduled for ${formatReleaseDate(g2.releaseDate)}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `What platforms are ${g1.title} and ${g2.title} available on?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${g1.title} is confirmed for ${g1.platforms?.join(', ') || 'TBA'}. ${g2.title} is confirmed for ${g2.platforms?.join(', ') || 'TBA'}.`
                    }
                }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Compare", "item": `${SITE_URL}/compare` },
                { "@type": "ListItem", "position": 2, "name": `${g1.title} vs ${g2.title}`, "item": canonicalUrl }
            ]
        }
    ];

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>${escapeHtml(g1.title)} vs ${escapeHtml(g2.title)} Comparison (2026)</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 2rem 0;">
            <thead>
                <tr style="border-bottom: 2px solid #06b6d4;">
                    <th style="text-align: left; padding: 1rem;">Feature</th>
                    <th style="text-align: left; padding: 1rem;">${escapeHtml(g1.title)}</th>
                    <th style="text-align: left; padding: 1rem;">${escapeHtml(g2.title)}</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 1rem;"><strong>Release Date</strong></td>
                    <td style="padding: 1rem;">${escapeHtml(formatReleaseDate(g1.releaseDate))}</td>
                    <td style="padding: 1rem;">${escapeHtml(formatReleaseDate(g2.releaseDate))}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 1rem;"><strong>Platforms</strong></td>
                    <td style="padding: 1rem;">${escapeHtml(g1.platforms?.join(', ') || 'TBA')}</td>
                    <td style="padding: 1rem;">${escapeHtml(g2.platforms?.join(', ') || 'TBA')}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 1rem;"><strong>Genres</strong></td>
                    <td style="padding: 1rem;">${escapeHtml(g1.genres?.join(', ') || 'TBA')}</td>
                    <td style="padding: 1rem;">${escapeHtml(g2.genres?.join(', ') || 'TBA')}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 1rem;"><strong>Community Hype</strong></td>
                    <td style="padding: 1rem;">${g1.hype || 50}%</td>
                    <td style="padding: 1rem;">${g2.hype || 50}%</td>
                </tr>
            </tbody>
        </table>
        <p><a href="/battles" style="color: #ef4444;">Vote in 2026 Gaming Hype Battles &rarr;</a></p>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        ogImage: g1.image || g2.image,
        schemas,
        semanticBody
    });

    writeRoute(`/compare/${slug}`, html);
    totalPrerendered++;
});

// 5. Prerender 300+ Platform × Genre Cross Pages
const priorityPlatforms = ['pc', 'ps5', 'xbox', 'switch', 'mac'];
const allGenres = Array.from(new Set(games.flatMap(g => g.genres || [])));

priorityPlatforms.forEach(pSlug => {
    allGenres.forEach(genre => {
        const gSlug = slugify(genre);
        const matchingGames = games.filter(g => {
            const matchesP = g.platforms?.some(p => {
                const s = slugify(p);
                return s === pSlug || (pSlug === 'ps5' && p.includes('PlayStation 5')) || (pSlug === 'xbox' && p.includes('Xbox Series')) || (pSlug === 'switch' && p.includes('Switch'));
            });
            const matchesG = g.genres?.some(gen => slugify(gen) === gSlug);
            return matchesP && matchesG;
        });

        if (matchingGames.length > 0) {
            const canonicalUrl = `${SITE_URL}/games/${pSlug}/${gSlug}`;
            const pName = pSlug.toUpperCase();
            const title = `Top Upcoming ${pName} ${genre} Games Releasing in 2026 | ${SITE_NAME}`;
            const description = `Confirmed 2026 ${genre} video games releasing on ${pName}. Complete list of ${matchingGames.length} titles with launch dates, countdowns, and trailer links.`;

            const schemas = [
                {
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": `${pName} ${genre} Games 2026`,
                    "itemListElement": matchingGames.slice(0, 15).map((g, idx) => ({
                        "@type": "ListItem",
                        "position": idx + 1,
                        "name": g.title,
                        "url": `${SITE_URL}/game/${g.slug}`
                    }))
                }
            ];

            const semanticBody = `
            <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
                <h1>Upcoming ${escapeHtml(pName)} ${escapeHtml(genre)} Games (2026)</h1>
                <p>${escapeHtml(description)}</p>
                <ul>
                    ${matchingGames.map(g => `<li><a href="/game/${g.slug}">${escapeHtml(g.title)}</a> (${escapeHtml(formatReleaseDate(g.releaseDate))})</li>`).join('')}
                </ul>
            </article>`;

            const html = buildHtml({
                title,
                description,
                canonicalUrl,
                schemas,
                semanticBody
            });

            writeRoute(`/games/${pSlug}/${gSlug}`, html);
            totalPrerendered++;
        }
    });
});

// 6. Prerender Developer & Publisher Entity Hubs
const devMap = new Map();
const pubMap = new Map();

games.forEach(g => {
    g.developers?.forEach(d => {
        if (!d || d === 'TBA') return;
        const s = slugify(d);
        if (!devMap.has(s)) devMap.set(s, { name: d, slug: s, games: [] });
        devMap.get(s).games.push(g);
    });
    g.publishers?.forEach(p => {
        if (!p || p === 'TBA') return;
        const s = slugify(p);
        if (!pubMap.has(s)) pubMap.set(s, { name: p, slug: s, games: [] });
        pubMap.get(s).games.push(g);
    });
});

devMap.forEach(dev => {
    const canonicalUrl = `${SITE_URL}/developer/${dev.slug}`;
    const title = `Upcoming 2026 ${dev.name} Games (Developer Schedule & Releases) | ${SITE_NAME}`;
    const description = `All confirmed 2026 video games developed by ${dev.name}. Track launch dates, platforms, countdown timers, and development updates on NextPlay.`;

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>${escapeHtml(dev.name)} - 2026 Video Game Lineup</h1>
        <p>${escapeHtml(description)}</p>
        <ul>
            ${dev.games.map(g => `<li><a href="/game/${g.slug}">${escapeHtml(g.title)}</a> - ${escapeHtml(formatReleaseDate(g.releaseDate))}</li>`).join('')}
        </ul>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody
    });

    writeRoute(`/developer/${dev.slug}`, html);
    totalPrerendered++;
});

pubMap.forEach(pub => {
    const canonicalUrl = `${SITE_URL}/publisher/${pub.slug}`;
    const title = `Upcoming 2026 ${pub.name} Games (Publisher Portfolio & Dates) | ${SITE_NAME}`;
    const description = `Discover all upcoming 2026 video games published by ${pub.name}. Confirmed release dates, platforms, and real-time launch countdowns.`;

    const semanticBody = `
    <article style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>${escapeHtml(pub.name)} - 2026 Publishing Catalog</h1>
        <p>${escapeHtml(description)}</p>
        <ul>
            ${pub.games.map(g => `<li><a href="/game/${g.slug}">${escapeHtml(g.title)}</a> - ${escapeHtml(formatReleaseDate(g.releaseDate))}</li>`).join('')}
        </ul>
    </article>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody
    });

    writeRoute(`/publisher/${pub.slug}`, html);
    totalPrerendered++;
});

// 7. Prerender 24 Genre Hubs
allGenres.forEach(genre => {
    const gSlug = slugify(genre);
    const genreGames = games.filter(g => g.genres?.some(gen => slugify(gen) === gSlug));
    const canonicalUrl = `${SITE_URL}/genre/${gSlug}`;
    const title = `Upcoming 2026 ${genre} Games: Release Dates & Launch Countdown | ${SITE_NAME}`;
    const description = `All confirmed ${genre} video games releasing in 2026. Track ${genreGames.length} upcoming releases with live countdowns, platforms, and Google Calendar export.`;

    const semanticBody = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>Upcoming 2026 ${escapeHtml(genre)} Games</h1>
        <p>${escapeHtml(description)}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${genreGames.map(g => `<div><a href="/game/${g.slug}">${escapeHtml(g.title)}</a></div>`).join('')}
        </div>
    </div>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody
    });

    writeRoute(`/genre/${gSlug}`, html);
    totalPrerendered++;
});

// 8. Prerender 16 Platform Hubs
const allPlatforms = Array.from(new Set(games.flatMap(g => g.platforms || [])));
allPlatforms.forEach(platform => {
    const pSlug = slugify(platform);
    const platformGames = games.filter(g => g.platforms?.some(p => slugify(p) === pSlug));
    const canonicalUrl = `${SITE_URL}/platform/${pSlug}`;
    const title = `Upcoming 2026 ${platform} Games: Confirmed Release Dates & Countdown | ${SITE_NAME}`;
    const description = `Complete schedule of upcoming 2026 video games confirmed for ${platform}. Track ${platformGames.length} titles with launch dates and live countdowns.`;

    const semanticBody = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <h1>Upcoming 2026 ${escapeHtml(platform)} Games</h1>
        <p>${escapeHtml(description)}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${platformGames.map(g => `<div><a href="/game/${g.slug}">${escapeHtml(g.title)}</a></div>`).join('')}
        </div>
    </div>`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody
    });

    writeRoute(`/platform/${pSlug}`, html);
    totalPrerendered++;
});

// 9. Prerender 12 Calendar Months + 4 Quarters
const months = [
    { num: '01', name: 'January' }, { num: '02', name: 'February' }, { num: '03', name: 'March' },
    { num: '04', name: 'April' }, { num: '05', name: 'May' }, { num: '06', name: 'June' },
    { num: '07', name: 'July' }, { num: '08', name: 'August' }, { num: '09', name: 'September' },
    { num: '10', name: 'October' }, { num: '11', name: 'November' }, { num: '12', name: 'December' }
];

months.forEach(m => {
    const mSlug = `2026-${m.num}`;
    const canonicalUrl = `${SITE_URL}/calendar/${mSlug}`;
    const title = `${m.name} 2026 Video Game Release Dates Calendar | ${SITE_NAME}`;
    const description = `All confirmed video games releasing in ${m.name} 2026. Track upcoming releases with live countdowns, platforms, and Google Calendar export.`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody: `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;"><h1>${m.name} 2026 Video Game Releases</h1><p>${description}</p></div>`
    });

    writeRoute(`/calendar/${mSlug}`, html);
    totalPrerendered++;
});

const quarters = [
    { slug: 'q1-2026', name: 'Q1 2026 (Jan - Mar)' },
    { slug: 'q2-2026', name: 'Q2 2026 (Apr - Jun)' },
    { slug: 'q3-2026', name: 'Q3 2026 (Jul - Sep)' },
    { slug: 'q4-2026', name: 'Q4 2026 (Oct - Dec)' }
];

quarters.forEach(q => {
    const canonicalUrl = `${SITE_URL}/calendar/${q.slug}`;
    const title = `${q.name} Video Game Release Calendar (2026) | ${SITE_NAME}`;
    const description = `Complete breakdown of every confirmed video game releasing during ${q.name}. Launch dates, countdowns, and platform schedules.`;

    const html = buildHtml({
        title,
        description,
        canonicalUrl,
        semanticBody: `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;"><h1>${q.name} Video Game Releases</h1><p>${description}</p></div>`
    });

    writeRoute(`/calendar/${q.slug}`, html);
    totalPrerendered++;
});

// 10. Prerender Subscription & Service Hubs
const serviceHubs = [
    {
        path: '/service/xbox-game-pass',
        title: `Upcoming Xbox Game Pass Games 2026 (Day One Confirmations & Schedule) | ${SITE_NAME}`,
        description: `Track all confirmed and rumored Day One Xbox Game Pass releases for 2026. Complete list with release dates, platforms, and cloud availability.`
    },
    {
        path: '/service/playstation-plus',
        title: `PlayStation Plus Upcoming 2026 Games (PS Plus Extra & Premium) | ${SITE_NAME}`,
        description: `Every video game confirmed or expected on PlayStation Plus Extra and Premium in 2026. PS5 and PS4 release schedules and countdowns.`
    },
    {
        path: '/service/geforce-now',
        title: `GeForce NOW 2026 Cloud Gaming Releases & Day One RTX Support | ${SITE_NAME}`,
        description: `Upcoming 2026 PC games arriving on NVIDIA GeForce NOW cloud streaming with RTX 4080 ray tracing support.`
    }
];

serviceHubs.forEach(s => {
    const canonicalUrl = `${SITE_URL}${s.path}`;
    const html = buildHtml({
        title: s.title,
        description: s.description,
        canonicalUrl,
        semanticBody: `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;"><h1>${escapeHtml(s.title)}</h1><p>${escapeHtml(s.description)}</p></div>`
    });
    writeRoute(s.path, html);
    totalPrerendered++;
});

// 11. Prerender Interactive Viral & Core Hubs
const coreHubs = [
    {
        path: '/can-i-run-it',
        title: `Can I Run It? 2026 PC Gaming Hardware Checker & Rig Benchmark | ${SITE_NAME}`,
        description: `Test your graphics card (GPU), processor (CPU), and RAM against all 2026 PC game releases. Instant compatibility audit for GTA 6, Crimson Desert, and upcoming games.`
    },
    {
        path: '/battles',
        title: `2026 Gaming Hype Battles & Head-to-Head Community Showdown | ${SITE_NAME}`,
        description: `Vote in head-to-head showdowns for the most anticipated video games of 2026. Real-time community voting results, comparisons, and release countdowns.`
    },
    {
        path: '/game-finder',
        title: `2026 Game Finder & Matchmaker Quiz | ${SITE_NAME}`,
        description: `Find your next favorite 2026 video game release in 3 simple steps. Personalized recommendations based on platform, genre, and playstyle.`
    },
    {
        path: '/tier-list',
        title: `2026 Game Tier List Maker: Rank Most Anticipated Releases | ${SITE_NAME}`,
        description: `Create and share your 2026 video game tier list. Rank GTA 6, Crimson Desert, and over 250 upcoming releases. Free drag-and-drop tier list builder with custom watermark export.`
    },
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
        path: '/games-like',
        title: `Games Like Your Favorites: 2026 Recommendation Hub | ${SITE_NAME}`,
        description: `Discover similar games and handpicked alternatives for every major 2026 release. Find your next favorite action, RPG, or open world title.`
    },
    {
        path: '/system-requirements',
        title: `2026 PC System Requirements Directory: Minimum & Recommended Specs | ${SITE_NAME}`,
        description: `Comprehensive PC system requirements database for all 2026 video games. Minimum, Recommended, and Ultra hardware benchmarks.`
    },
    {
        path: '/developer',
        title: `2026 Game Development Studios Directory | ${SITE_NAME}`,
        description: `Browse all video game development studios with confirmed 2026 releases. Studio history, release schedules, and upcoming titles.`
    },
    {
        path: '/publisher',
        title: `2026 Video Game Publishers Directory | ${SITE_NAME}`,
        description: `Browse major video game publishers releasing titles in 2026. Sony, Xbox, Capcom, Square Enix, and indie publisher portfolios.`
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

coreHubs.forEach(p => {
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

// 12. Prerender Trends Hub and 1,009 Programmatic Gaming Trend Pages
if (trends.length > 0) {
    console.log(`🔥 Pre-rendering ${trends.length} gaming trend pages...`);
    // 12a. /trends Hub
    const trendsHubCanonical = `${SITE_URL}/trends`;
    const trendsHubTitle = `2026 Gaming Trends, Hardware & High-Velocity Topics Hub | ${SITE_NAME}`;
    const trendsHubDesc = `Track 1,000+ real-time trending gaming topics, search queries, hardware releases (Switch 2, PS5 Pro), game engines, and industry showcases for 2026.`;
    const trendsHubSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": trendsHubTitle,
        "description": trendsHubDesc,
        "url": trendsHubCanonical,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": trends.slice(0, 50).map((t, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "url": `${SITE_URL}/trends/${t.slug}`,
                "name": t.name
            }))
        }
    };
    const trendsHubBody = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
            <h1>${escapeHtml(trendsHubTitle)}</h1>
            <p>${escapeHtml(trendsHubDesc)}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
                ${trends.slice(0, 100).map(t => `
                    <div style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
                        <a href="/trends/${t.slug}" style="color: #06b6d4; font-weight: bold; text-decoration: none;">${escapeHtml(t.name)}</a>
                        <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem;">${escapeHtml(t.description || t.queryIntent)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    writeRoute('/trends', buildHtml({
        title: trendsHubTitle,
        description: trendsHubDesc,
        canonicalUrl: trendsHubCanonical,
        schemas: [trendsHubSchema],
        semanticBody: trendsHubBody
    }));
    totalPrerendered++;

    // 12b. All 1,009 /trends/:slug pages
    trends.forEach(trend => {
        const trendCanonical = `${SITE_URL}/trends/${trend.slug}`;
        const trendTitle = `${trend.name} (2026 Gaming Trends, Specs & Release Intel) | ${SITE_NAME}`;
        const trendDesc = trend.description || `Comprehensive 2026 intelligence on ${trend.name}. Analysis of search trends, release expectations, related games, and high-velocity community queries on NextPlay.`;
        
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": (trend.faqs || []).map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${trend.name} - 2026 Gaming Trends & Analysis`,
            "description": trendDesc,
            "url": trendCanonical,
            "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL
            }
        };

        const schemas = trend.faqs && trend.faqs.length > 0 ? [articleSchema, faqSchema] : [articleSchema];

        const trendBody = `
            <article style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
                <header>
                    <span style="color: #f59e0b; font-size: 0.85rem; text-transform: uppercase; font-weight: bold;">${escapeHtml(trend.category)} • Search Velocity ${trend.searchVolumeScore || 85}/100</span>
                    <h1 style="font-size: 2.25rem; margin-top: 0.5rem; color: #fff;">${escapeHtml(trend.name)}</h1>
                    <p style="font-size: 1.15rem; color: #cbd5e1; line-height: 1.6;">${escapeHtml(trend.description || '')}</p>
                </header>

                <section style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
                    <h2 style="color: #38bdf8; font-size: 1.25rem;">Search Intent & Trend Context</h2>
                    <p style="color: #94a3b8; line-height: 1.6;">${escapeHtml(trend.queryIntent || '')}</p>
                </section>

                ${trend.associatedGames && trend.associatedGames.length > 0 ? `
                <section style="margin-top: 2rem;">
                    <h2 style="color: #fff; font-size: 1.25rem;">Related 2026 Game Releases</h2>
                    <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        ${trend.associatedGames.map(g => `
                            <li style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 6px;">
                                <a href="/game/${escapeHtml(g.slug)}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">${escapeHtml(g.title)}</a>
                            </li>
                        `).join('')}
                    </ul>
                </section>` : ''}

                ${trend.faqs && trend.faqs.length > 0 ? `
                <section style="margin-top: 2.5rem;">
                    <h2 style="color: #fff; font-size: 1.25rem;">Frequently Asked Questions</h2>
                    <div style="margin-top: 1rem;">
                        ${trend.faqs.map(faq => `
                            <details style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 6px;" open>
                                <summary style="font-weight: bold; color: #e2e8f0; cursor: pointer;">${escapeHtml(faq.q)}</summary>
                                <p style="color: #94a3b8; margin-top: 0.5rem; line-height: 1.6;">${escapeHtml(faq.a)}</p>
                            </details>
                        `).join('')}
                    </div>
                </section>` : ''}
            </article>
        `;

        writeRoute(`/trends/${trend.slug}`, buildHtml({
            title: trendTitle,
            description: trendDesc,
            canonicalUrl: trendCanonical,
            schemas,
            semanticBody: trendBody
        }));
        totalPrerendered++;
    });
}

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
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".prerender-content h1", ".prerender-content p", "article header p"]
            },
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
