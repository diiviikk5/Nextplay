import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Monitor, ArrowLeft, Gamepad2 } from 'lucide-react';

// Platform icons/colors
const PLATFORM_CONFIG = {
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
    'Nintendo Switch 2': {
        color: '#e60012',
        icon: '🕹️',
        shortName: 'Switch 2',
        description: 'Nintendo Switch 2 (next-gen Nintendo releases)'
    },
    'default': {
        color: '#64748b',
        icon: '🎮',
        shortName: 'Other',
        description: 'Other platforms'
    }
};

const PlatformPage = () => {
    const { slug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Get all unique platforms
    const allPlatforms = useMemo(() => {
        const platformSet = new Set();
        gamesData.forEach(g => {
            g.platforms?.forEach(platform => platformSet.add(platform));
        });
        return [...platformSet].sort();
    }, []);

    // Major platforms first
    const sortedPlatforms = useMemo(() => {
        const priority = ['PlayStation 5', 'Xbox Series X/S', 'PC', 'Nintendo Switch', 'Nintendo Switch 2', 'PlayStation 4', 'Xbox One'];
        return allPlatforms.sort((a, b) => {
            const aIdx = priority.indexOf(a);
            const bIdx = priority.indexOf(b);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [allPlatforms]);

    // If no slug, show platform index
    if (!slug) {
        // Count games per platform
        const platformCounts = {};
        gamesData.forEach(g => {
            g.platforms?.forEach(platform => {
                platformCounts[platform] = (platformCounts[platform] || 0) + 1;
            });
        });

        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <SEO
                    title="Browse 2026 Games by Platform | PS5, Xbox, PC, Switch | NextPlay"
                    description="Explore all 2026 video game releases by platform. Find games for PlayStation 5, Xbox Series X/S, PC, Nintendo Switch and more."
                    url="https://nextplaygame.me/platform"
                />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #0070d1, #107c10)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            marginBottom: '1rem'
                        }}
                    >
                        <Monitor size={14} /> BROWSE BY PLATFORM
                    </div>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        GAME PLATFORMS
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                        Browse {gamesData.length} upcoming 2026 games across all platforms
                    </p>
                </div>

                {/* Platform Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1rem'
                }}>
                    {sortedPlatforms.map(platform => {
                        const count = platformCounts[platform] || 0;
                        const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;
                        const platformSlug = platform.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const gamesOnPlatform = gamesData.filter(g => g.platforms?.includes(platform)).slice(0, 4);

                        return (
                            <Link
                                key={platform}
                                to={`/platform/${platformSlug}`}
                                className="glass glass-hover"
                                style={{
                                    padding: '1.5rem',
                                    textDecoration: 'none',
                                    borderTop: `4px solid ${config.color}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{config.icon}</span>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'inline' }}>{platform}</h3>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: `${config.color}22`,
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: config.color
                                    }}>
                                        {count} games
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                                    {config.description}
                                </p>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {gamesOnPlatform.map(g => (
                                        <div
                                            key={g.id}
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                border: '2px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
                                            <img src={g.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                    {count > 4 && (
                                        <div style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '6px',
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.7rem',
                                            color: '#64748b'
                                        }}>
                                            +{count - 4}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Find the platform from slug
    const platform = allPlatforms.find(p => p.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);

    if (!platform) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <SEO title="Platform Not Found | NextPlay" description="This platform doesn't exist." />
                <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '1rem' }}>PLATFORM NOT FOUND</h1>
                <Link to="/platform" className="btn-primary">Browse All Platforms</Link>
            </div>
        );
    }

    const games = gamesData.filter(g => g.platforms?.includes(platform)).sort((a, b) => b.hype - a.hype);
    const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={`${platform} Games 2026 | ${games.length} Upcoming Releases | NextPlay`}
                description={`All ${platform} games releasing in 2026. Browse ${games.length} upcoming titles including ${games.slice(0, 3).map(g => g.title).join(', ')} and more. ${config.description}`}
                url={`https://nextplaygame.me/platform/${slug}`}
            />

            {/* Back */}
            <Link
                to="/platform"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                }}
            >
                <ArrowLeft size={16} /> All Platforms
            </Link>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: `${config.color}22`,
                        border: `1px solid ${config.color}44`,
                        borderRadius: '4px',
                        color: config.color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>{config.icon}</span> {platform.toUpperCase()}
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {platform.toUpperCase()} GAMES 2026
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    {games.length} upcoming games releasing on {platform} in 2026
                </p>
            </div>

            {/* Games Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1rem'
            }}>
                {games.map(game => (
                    <GameCard
                        key={game.id}
                        game={game}
                        isWatched={isWatched(game.id)}
                        onToggleWatch={toggleWatch}
                    />
                ))}
            </div>

            {games.length === 0 && (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: '#64748b' }}>No games found for {platform} in 2026.</p>
                </div>
            )}
        </div>
    );
};

export default PlatformPage;
