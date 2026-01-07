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
 * Generate VideoGame structured data
 */
export const generateGameSchema = (game, url) => {
    return {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "@id": url,
        "name": game.title,
        "description": game.description || `${game.title} is an upcoming video game releasing in 2026.`,
        "gamePlatform": game.platforms || [],
        "genre": game.genres || [],
        "datePublished": game.releaseDate,
        "image": game.image || DEFAULT_IMAGE,
        "url": url,
        "publisher": game.publishers?.length > 0 ? {
            "@type": "Organization",
            "name": game.publishers[0]
        } : undefined,
        "developer": game.developers?.length > 0 ? {
            "@type": "Organization",
            "name": game.developers[0]
        } : undefined,
        "aggregateRating": game.totalRating ? {
            "@type": "AggregateRating",
            "ratingValue": Math.round(game.totalRating),
            "bestRating": 100,
            "worstRating": 0,
            "ratingCount": game.hype || 1
        } : undefined
    };
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
        "itemListElement": games.slice(0, 10).map((game, index) => ({
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
 * Generate game-specific SEO title
 */
export const generateGameSEOTitle = (game, formattedDate) => {
    return `${game.title} Release Date ${formattedDate} | Countdown & Info | ${SITE_NAME}`;
};

/**
 * Generate game-specific SEO description
 */
export const generateGameSEODescription = (game, formattedDate, daysLeft) => {
    if (game.description) {
        return truncateDescription(`${game.description.slice(0, 100)}... Track release countdown, platforms & more.`);
    }
    return truncateDescription(
        `${game.title} releases ${formattedDate} on ${game.platforms?.slice(0, 2).join(', ') || 'multiple platforms'}. ${daysLeft > 0 ? `${daysLeft} days countdown.` : 'Available now!'} Add to your watchlist!`
    );
};

/**
 * Generate platform page SEO data
 */
export const generatePlatformSEO = (platform, games) => {
    const topGames = games.slice(0, 3).map(g => g.title).join(', ');
    return {
        title: `${platform} Games 2026 | ${games.length} Upcoming Releases | ${SITE_NAME}`,
        description: truncateDescription(
            `All ${platform} games releasing in 2026. Browse ${games.length} upcoming titles including ${topGames} and more.`
        )
    };
};

/**
 * Generate genre page SEO data
 */
export const generateGenreSEO = (genre, games) => {
    const topGames = games.slice(0, 3).map(g => g.title).join(', ');
    return {
        title: `${genre} Games 2026 | ${games.length} Upcoming Releases | ${SITE_NAME}`,
        description: truncateDescription(
            `All ${genre} games releasing in 2026. Browse ${games.length} upcoming ${genre.toLowerCase()} titles including ${topGames} and more.`
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
