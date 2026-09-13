/**
 * SEO Utilities - Centralized SEO helper functions
 * Enables programmatic SEO with dynamic metadata generation
 */

// Base URL for the site
export const SITE_URL = 'https://nextplaygame.me';
export const SITE_NAME = 'NextPlay 2026';
export const DEFAULT_IMAGE = 'https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg';

/**
 * Generate a URL-safe slug from a string
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Convert slug back to human readable title case string
 */
export const unslugify = (text) => {
    if (!text) return '';
    return text
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Generate canonical URL
 */
export const getCanonicalUrl = (path = '') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${cleanPath}`;
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": getCanonicalUrl(crumb.path)
        }))
    };
};

/**
 * Generate VideoGame structured data with rich attributes for Google Rich Results
 */
export const generateGameSchema = (game, url) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "@id": url,
        "name": game.title,
        "description": game.description || `${game.title} is an upcoming 2026 video game releasing on ${game.platforms?.join(', ') || 'multiple platforms'}. Track release date and live countdown on NextPlay.`,
        "gamePlatform": game.platforms || ["PC", "PlayStation 5", "Xbox Series X/S"],
        "applicationCategory": "Game",
        "genre": game.genres || ["Action"],
        "datePublished": game.releaseDate,
        "image": game.image || DEFAULT_IMAGE,
        "url": url,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/PreOrder"
        }
    };

    if (game.publishers?.length > 0) {
        schema.publisher = {
            "@type": "Organization",
            "name": game.publishers[0]
        };
    }

    if (game.developers?.length > 0) {
        schema.developer = {
            "@type": "Organization",
            "name": game.developers[0]
        };
    }

    if (game.releaseDate) {
        schema.releasedEvent = {
            "@type": "PublicationEvent",
            "startDate": game.releaseDate,
            "location": {
                "@type": "Place",
                "name": "Worldwide"
            }
        };
    }

    if (game.totalRating || game.hype) {
        const ratingVal = game.totalRating ? Math.round(game.totalRating) : Math.min(100, Math.max(70, game.hype || 85));
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": ratingVal,
            "bestRating": 100,
            "worstRating": 0,
            "ratingCount": Math.max(12, (game.hype || 10) * 3)
        };
    }

    return schema;
};

/**
 * Generate ItemList structured data for game collections
 */
export const generateGameListSchema = (games, listName, description) => {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": listName,
        "description": description,
        "numberOfItems": games.length,
        "itemListElement": games.slice(0, 15).map((game, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": game.title,
            "url": getCanonicalUrl(`/game/${game.slug}`)
        }))
    };
};

/**
 * Generate FAQ structured data
 */
export const generateFAQSchema = (faqs) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
};

/**
 * Generate standard FAQ items for any game
 */
export const generateGameFAQs = (game, formattedDate, daysLeft) => {
    const platforms = game.platforms?.join(', ') || 'PC, PlayStation 5, and Xbox Series X/S';
    const devs = game.developers?.join(', ') || game.publishers?.join(', ') || 'the studio';
    const genres = game.genres?.join(', ') || 'Action';
    
    return [
        {
            question: `When does ${game.title} release in 2026?`,
            answer: `${game.title} is scheduled to release on ${formattedDate}. You can track the real-time live countdown and release window on NextPlay.`
        },
        {
            question: `What platforms will ${game.title} be available on?`,
            answer: `${game.title} is confirmed for ${platforms}. Check our platform hubs for updates on additional console or PC ports.`
        },
        {
            question: `Who is developing and publishing ${game.title}?`,
            answer: `${game.title} is developed by ${devs}${game.publishers?.length ? ` and published by ${game.publishers.join(', ')}` : ''}. It is categorized as a ${genres} game.`
        },
        {
            question: `Will ${game.title} be on Xbox Game Pass or PlayStation Plus on launch?`,
            answer: `Day-one availability for ${game.title} on Xbox Game Pass or PlayStation Plus has not yet been officially announced by the publishers.`
        }
    ];
};

/**
 * Generate dynamic page title with template
 */
export const generatePageTitle = (pageTitle, includeTag = true) => {
    if (!includeTag) return pageTitle;
    return `${pageTitle} | ${SITE_NAME}`;
};

/**
 * Truncate description for meta tags (max 160 chars for optimal SEO)
 */
export const truncateDescription = (text, maxLength = 155) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3).trim() + '...';
};

/**
 * Generate game-specific high-CTR SEO title
 */
export const generateGameSEOTitle = (game, formattedDate) => {
    return `${game.title} Release Date (${formattedDate}), Platforms & Countdown | ${SITE_NAME}`;
};

/**
 * Generate game-specific high-CTR SEO description
 */
export const generateGameSEODescription = (game, formattedDate, daysLeft) => {
    const platforms = game.platforms?.slice(0, 3).join(', ') || 'PS5, Xbox, PC';
    const countdownText = daysLeft > 0 ? `${daysLeft} days until launch` : '2026 release window';
    return truncateDescription(
        `${game.title} release date: ${formattedDate}. Confirmed platforms: ${platforms}. Live countdown timer (${countdownText}), trailers, and release updates on NextPlay.`
    );
};

/**
 * Generate platform page SEO data
 */
export const generatePlatformSEO = (platform, games) => {
    const topGames = games.slice(0, 3).map(g => g.title).join(', ');
    const isMac = platform.toLowerCase() === 'mac';
    const title = isMac
        ? `Upcoming Mac Games (2026): Confirmed Release Dates & macOS Hub | ${SITE_NAME}`
        : `Upcoming ${platform} Games (2026): Confirmed Releases & Calendar | ${SITE_NAME}`;
    const description = isMac
        ? truncateDescription(`Complete guide to upcoming Mac games in 2026. Track ${games.length} confirmed macOS and Apple Silicon releases including ${topGames} with live countdown timers.`)
        : truncateDescription(`All confirmed ${platform} games releasing in 2026. Track ${games.length} upcoming releases including ${topGames}, release countdowns, and launch windows on NextPlay.`);
    return { title, description };
};

/**
 * Generate genre page SEO data
 */
export const generateGenreSEO = (genre, games) => {
    const topGames = games.slice(0, 3).map(g => g.title).join(', ');
    return {
        title: `Upcoming 2026 ${genre} Games: Release Dates & Trackers | ${SITE_NAME}`,
        description: truncateDescription(
            `Browse all ${games.length} upcoming ${genre.toLowerCase()} games releasing in 2026 including ${topGames}. Live countdowns, release windows, and watchlists on NextPlay.`
        )
    };
};

/**
 * Generate calendar page SEO data
 */
export const generateCalendarSEO = (month, games) => {
    if (month) {
        return {
            title: `${month} 2026 Game Releases | Release Calendar | ${SITE_NAME}`,
            description: truncateDescription(
                `All video games releasing in ${month} 2026. ${games.length} games including major titles. Add to your calendar!`
            )
        };
    }
    return {
        title: `2026 Video Game Release Calendar | All Months | ${SITE_NAME}`,
        description: truncateDescription(
            'Complete 2026 video game release calendar. Browse all months, filter by platform, and add releases to Google Calendar or iCal.'
        )
    };
};

/**
 * Get internal links for a game (related games, genre pages, platform pages)
 */
export const getInternalLinks = (game, allGames) => {
    const links = {
        genres: [],
        platforms: [],
        similarGames: [],
        sameGenreGames: []
    };

    // Genre links
    if (game.genres) {
        links.genres = game.genres.map(genre => ({
            name: genre,
            path: `/genre/${slugify(genre)}`
        }));
    }

    // Platform links
    if (game.platforms) {
        links.platforms = game.platforms.map(platform => ({
            name: platform,
            path: `/platform/${slugify(platform)}`
        }));
    }

    // Similar games from IGDB data
    if (game.similarGames?.length > 0) {
        links.similarGames = game.similarGames.slice(0, 4).map(sg => {
            const found = allGames.find(g => g.slug === sg.slug);
            return found || sg;
        }).filter(Boolean);
    }

    // Same genre games (fallback)
    if (links.similarGames.length === 0 && game.genres?.length > 0) {
        links.sameGenreGames = allGames
            .filter(g => g.id !== game.id && g.genres?.some(genre => game.genres.includes(genre)))
            .slice(0, 4);
    }

    return links;
};

/**
 * Calculate reading/browsing metrics for a page
 */
export const getPageMetrics = (games) => {
    return {
        totalGames: games.length,
        byPlatform: games.reduce((acc, game) => {
            game.platforms?.forEach(p => {
                acc[p] = (acc[p] || 0) + 1;
            });
            return acc;
        }, {}),
        byGenre: games.reduce((acc, game) => {
            game.genres?.forEach(g => {
                acc[g] = (acc[g] || 0) + 1;
            });
            return acc;
        }, {}),
        upcomingThisMonth: games.filter(g => {
            const rd = new Date(g.releaseDate);
            const now = new Date();
            const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            return rd >= now && rd <= thirtyDays;
        }).length
    };
};
