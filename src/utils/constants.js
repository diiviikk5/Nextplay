/**
 * Application Constants
 * Centralized configuration for better maintainability
 */

// Site Information
export const SITE_CONFIG = {
    name: 'NextPlay 2026',
    tagline: '2026 TRACKER',
    domain: 'nextplaygame.me',
    url: 'https://nextplaygame.me',
    twitterHandle: '@nextplaygame',
    defaultImage: 'https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg'
};

// Theme Colors
export const COLORS = {
    primary: '#06b6d4',
    primaryDark: '#0891b2',
    accent: '#f97316',
    accentLight: '#facc15',
    background: '#0a0e17',
    backgroundAlt: '#1e293b',
    textPrimary: '#fff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#eab308'
};

// Platform Configuration
export const PLATFORM_CONFIG = {
    'PlayStation 5': {
        color: '#0070d1',
        icon: '🎮',
        shortName: 'PS5',
        description: 'Sony PlayStation 5 exclusive and cross-platform releases'
    },
    'Xbox Series X/S': {
        color: '#107c10',
        icon: '🎮',
        shortName: 'Xbox',
        description: 'Microsoft Xbox Series X|S exclusive and cross-platform releases'
    },
    'PC': {
        color: '#ff6b35',
        icon: '💻',
        shortName: 'PC',
        description: 'Windows PC releases including Steam, Epic, and other platforms'
    },
    'Nintendo Switch': {
        color: '#e60012',
        icon: '🕹️',
        shortName: 'Switch',
        description: 'Nintendo Switch exclusive and multi-platform releases'
    },
    'Nintendo Switch 2': {
        color: '#e60012',
        icon: '🕹️',
        shortName: 'Switch 2',
        description: 'Nintendo Switch 2 (next-gen Nintendo releases)'
    },
    'PlayStation 4': {
        color: '#003791',
        icon: '🎮',
        shortName: 'PS4',
        description: 'PlayStation 4 releases (cross-gen titles)'
    },
    'Xbox One': {
        color: '#177d17',
        icon: '🎮',
        shortName: 'Xbox One',
        description: 'Xbox One releases (cross-gen titles)'
    },
    default: {
        color: '#64748b',
        icon: '🎮',
        shortName: 'Other',
        description: 'Other platforms'
    }
};

// Genre Configuration
export const GENRE_COLORS = {
    'Action': '#ef4444',
    'Adventure': '#22c55e',
    'RPG': '#8b5cf6',
    'Role-playing (RPG)': '#8b5cf6',
    'Shooter': '#f97316',
    'Strategy': '#3b82f6',
    'Puzzle': '#eab308',
    'Racing': '#06b6d4',
    'Sports': '#10b981',
    'Sport': '#10b981',
    'Fighting': '#dc2626',
    'Simulation': '#6366f1',
    'Simulator': '#6366f1',
    'Horror': '#991b1b',
    'Indie': '#a855f7',
    'Platformer': '#f59e0b',
    'Platform': '#f59e0b',
    'Open World': '#14b8a6',
    'Arcade': '#ec4899',
    'Card & Board Game': '#84cc16',
    'Tactical': '#64748b',
    'Visual Novel': '#f472b6',
    default: '#64748b'
};

// Priority Platforms (for sorting)
export const PRIORITY_PLATFORMS = [
    'PlayStation 5',
    'Xbox Series X/S',
    'PC',
    'Nintendo Switch',
    'Nintendo Switch 2',
    'PlayStation 4',
    'Xbox One'
];

// Filter Options
export const PLATFORM_FILTERS = ['All', 'PlayStation 5', 'Xbox Series X/S', 'PC', 'Nintendo Switch'];

// Month Configuration
export const MONTHS = [
    { name: 'January', short: 'Jan', num: '01' },
    { name: 'February', short: 'Feb', num: '02' },
    { name: 'March', short: 'Mar', num: '03' },
    { name: 'April', short: 'Apr', num: '04' },
    { name: 'May', short: 'May', num: '05' },
    { name: 'June', short: 'Jun', num: '06' },
    { name: 'July', short: 'Jul', num: '07' },
    { name: 'August', short: 'Aug', num: '08' },
    { name: 'September', short: 'Sep', num: '09' },
    { name: 'October', short: 'Oct', num: '10' },
    { name: 'November', short: 'Nov', num: '11' },
    { name: 'December', short: 'Dec', num: '12' }
];

// Local Storage Keys
export const STORAGE_KEYS = {
    watchlist: 'nextplay_watchlist',
    top5: 'nextplay_top5',
    hypeVotes: 'nextplay_hype_votes',
    theme: 'nextplay_theme'
};

// Animation durations (ms)
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500
};

// Breakpoints (matching CSS)
export const BREAKPOINTS = {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280
};

// Image sizes for lazy loading
export const IMAGE_SIZES = {
    thumbnail: { width: 100, height: 100 },
    card: { width: 400, height: 225 },
    hero: { width: 1920, height: 1080 }
};

// SEO Constants
export const SEO_DEFAULTS = {
    titleTemplate: '%s | NextPlay 2026',
    defaultTitle: 'NextPlay 2026 | GTA 6 Release Date Countdown & All 2026 Game Releases Calendar',
    defaultDescription: 'The #1 tracker for 2026 video game releases. Live countdown to GTA VI, 50+ games tracked. Create tier lists, compare games, and build your watchlist.',
    keywords: 'GTA 6 release date 2026, GTA VI countdown timer, upcoming games 2026 list, 2026 game release calendar',
    maxDescriptionLength: 155,
    maxTitleLength: 60
};
