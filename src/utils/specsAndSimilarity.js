/**
 * Helper utilities for System Requirements, Similar Games Algorithm,
 * and Head-to-Head Comparison Generation
 */
import gamesData from '../data/games.json';
import { slugify } from './seoHelpers';

// Tier-based PC requirements generator
export function getSystemRequirements(game) {
    const isHighEnd = (game.hype || 50) >= 80 || 
        game.genres?.some(g => ['Open World', 'Shooter', 'Action'].includes(g)) ||
        game.platforms?.every(p => !['Nintendo Switch'].includes(p));

    const isLightweight = game.genres?.some(g => ['Indie', 'Puzzle', 'Platformer'].includes(g)) && (game.hype || 50) < 70;

    if (isLightweight) {
        return {
            tier: 'Low-Spec Friendly',
            badge: 'Runs on Most Laptops',
            directX: 'DirectX 11',
            os: 'Windows 10 / 11 (64-bit)',
            storage: '25 GB available space (SSD Recommended)',
            minimum: {
                cpu: 'Intel Core i3-6100 / AMD Ryzen 3 1200',
                gpu: 'NVIDIA GeForce GTX 960 (4 GB) / AMD Radeon RX 560',
                ram: '8 GB RAM',
                vram: '4 GB VRAM',
                target: '1080p @ 30-45 FPS (Low Settings)'
            },
            recommended: {
                cpu: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
                gpu: 'NVIDIA GeForce GTX 1660 Super (6 GB) / AMD Radeon RX 580',
                ram: '16 GB RAM',
                vram: '6 GB VRAM',
                target: '1080p @ 60 FPS (High Settings)'
            },
            ultra: {
                cpu: 'Intel Core i5-12400 / AMD Ryzen 5 5600',
                gpu: 'NVIDIA GeForce RTX 3060 (12 GB) / AMD Radeon RX 6700 XT',
                ram: '16 GB RAM',
                vram: '8 GB+ VRAM',
                target: '1440p / 4K @ 60+ FPS'
            }
        };
    }

    if (isHighEnd) {
        return {
            tier: 'Next-Gen Powerhouse',
            badge: 'High-End Gaming PC Required',
            directX: 'DirectX 12 Ultimate',
            os: 'Windows 11 (64-bit with latest updates)',
            storage: '120-150 GB NVMe SSD required',
            minimum: {
                cpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600X',
                gpu: 'NVIDIA GeForce RTX 2070 Super (8 GB) / AMD Radeon RX 5700 XT',
                ram: '16 GB Dual-Channel RAM',
                vram: '8 GB VRAM',
                target: '1080p @ 30 FPS (Medium Settings with DLSS/FSR)'
            },
            recommended: {
                cpu: 'Intel Core i7-13700K / AMD Ryzen 7 7800X3D',
                gpu: 'NVIDIA GeForce RTX 4070 (12 GB) / AMD Radeon RX 7800 XT',
                ram: '32 GB DDR5 RAM',
                vram: '12 GB VRAM',
                target: '1440p @ 60 FPS (Ultra Settings, Ray Tracing)'
            },
            ultra: {
                cpu: 'Intel Core i9-14900K / AMD Ryzen 9 7950X3D',
                gpu: 'NVIDIA GeForce RTX 4080 Super / RTX 4090 (24 GB)',
                ram: '32 GB / 64 GB DDR5 RAM',
                vram: '16 GB+ VRAM',
                target: '4K @ 60-120 FPS Max Ray Tracing / Path Tracing'
            }
        };
    }

    // Standard Mid-Tier specs
    return {
        tier: 'Standard 2026 Gaming Rig',
        badge: 'Mainstream PC Compatible',
        directX: 'DirectX 12',
        os: 'Windows 10 / 11 (64-bit)',
        storage: '70-85 GB high-speed SSD',
        minimum: {
            cpu: 'Intel Core i5-10400F / AMD Ryzen 5 3600',
            gpu: 'NVIDIA GeForce GTX 1660 Ti (6 GB) / AMD Radeon RX 5600 XT',
            ram: '16 GB RAM',
            vram: '6 GB VRAM',
            target: '1080p @ 30-60 FPS (Low-Medium Settings)'
        },
        recommended: {
            cpu: 'Intel Core i5-12600K / AMD Ryzen 7 5700X',
            gpu: 'NVIDIA GeForce RTX 3060 Ti (8 GB) / AMD Radeon RX 6700 XT',
            ram: '16 GB - 32 GB RAM',
            vram: '8 GB VRAM',
            target: '1080p / 1440p @ 60 FPS (High Settings)'
        },
        ultra: {
            cpu: 'Intel Core i7-14700 / AMD Ryzen 7 7700X',
            gpu: 'NVIDIA GeForce RTX 4070 Ti / AMD Radeon RX 7900 XT',
            ram: '32 GB RAM',
            vram: '12 GB+ VRAM',
            target: '1440p / 4K @ 60+ FPS (Ultra Settings)'
        }
    };
}

// Find top similar games based on genre, themes, game modes, and hype
export function getSimilarGames(targetGame, limit = 8) {
    if (!targetGame) return [];

    const targetGenres = new Set(targetGame.genres || []);
    const targetPlatforms = new Set(targetGame.platforms || []);
    const targetThemes = new Set(targetGame.themes || []);

    const scored = gamesData
        .filter(g => g.slug !== targetGame.slug)
        .map(candidate => {
            let score = 0;

            // Genre matches (weight: 4 per match)
            candidate.genres?.forEach(g => {
                if (targetGenres.has(g)) score += 4;
            });

            // Theme matches (weight: 3 per match)
            candidate.themes?.forEach(t => {
                if (targetThemes.has(t)) score += 3;
            });

            // Platform overlap (weight: 1 per match)
            candidate.platforms?.forEach(p => {
                if (targetPlatforms.has(p)) score += 1;
            });

            // Developer / Publisher affinity
            if (candidate.developers?.some(d => targetGame.developers?.includes(d))) score += 5;
            if (candidate.publishers?.some(p => targetGame.publishers?.includes(p))) score += 3;

            // Hype similarity
            const hypeDiff = Math.abs((candidate.hype || 50) - (targetGame.hype || 50));
            score += Math.max(0, 5 - Math.floor(hypeDiff / 10));

            return { game: candidate, score };
        });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.game);
}

// Generate curated & algorithmic top head-to-head comparison pairings
export function getTopComparisons(limit = 600) {
    const pairings = [];
    const seen = new Set();

    // 1. Handcrafted high-intent comparisons
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
        const g1 = gamesData.find(g => g.slug === s1);
        const g2 = gamesData.find(g => g.slug === s2);
        if (g1 && g2) {
            const key = [s1, s2].sort().join('-vs-');
            if (!seen.has(key)) {
                seen.add(key);
                pairings.push({ game1: g1, game2: g2, slug: `${s1}-vs-${s2}` });
            }
        }
    });

    // 2. High-hype genre pairings (Compare games within top genres)
    const gamesByGenre = {};
    gamesData.forEach(g => {
        g.genres?.forEach(gen => {
            if (!gamesByGenre[gen]) gamesByGenre[gen] = [];
            gamesByGenre[gen].push(g);
        });
    });

    Object.entries(gamesByGenre).forEach(([genre, gList]) => {
        // Sort by hype descending
        const sorted = [...gList].sort((a, b) => (b.hype || 0) - (a.hype || 0));
        // Take top 10 in this genre and generate pairwise comparisons
        const topSlice = sorted.slice(0, 10);
        for (let i = 0; i < topSlice.length; i++) {
            for (let j = i + 1; j < topSlice.length; j++) {
                const s1 = topSlice[i].slug;
                const s2 = topSlice[j].slug;
                const key = [s1, s2].sort().join('-vs-');
                if (!seen.has(key)) {
                    seen.add(key);
                    pairings.push({ game1: topSlice[i], game2: topSlice[j], slug: `${s1}-vs-${s2}` });
                }
            }
        }
    });

    // 3. Platform exclusive & flagship comparisons
    const topGames = [...gamesData].sort((a, b) => (b.hype || 0) - (a.hype || 0)).slice(0, 35);
    for (let i = 0; i < topGames.length; i++) {
        for (let j = i + 1; j < Math.min(topGames.length, i + 8); j++) {
            const s1 = topGames[i].slug;
            const s2 = topGames[j].slug;
            const key = [s1, s2].sort().join('-vs-');
            if (!seen.has(key) && pairings.length < limit) {
                seen.add(key);
                pairings.push({ game1: topGames[i], game2: topGames[j], slug: `${s1}-vs-${s2}` });
            }
        }
    }

    return pairings.slice(0, limit);
}

// Extract unique developers and publishers
export function getCompanyEntities() {
    const devMap = new Map();
    const pubMap = new Map();

    gamesData.forEach(game => {
        game.developers?.forEach(dev => {
            if (!dev || dev === 'TBA') return;
            const s = slugify(dev);
            if (!devMap.has(s)) {
                devMap.set(s, { name: dev, slug: s, games: [] });
            }
            devMap.get(s).games.push(game);
        });

        game.publishers?.forEach(pub => {
            if (!pub || pub === 'TBA') return;
            const s = slugify(pub);
            if (!pubMap.has(s)) {
                pubMap.set(s, { name: pub, slug: s, games: [] });
            }
            pubMap.get(s).games.push(game);
        });
    });

    return {
        developers: Array.from(devMap.values()).sort((a, b) => b.games.length - a.games.length),
        publishers: Array.from(pubMap.values()).sort((a, b) => b.games.length - a.games.length)
    };
}
