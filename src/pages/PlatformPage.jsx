import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Monitor, ArrowLeft, TrendingUp, Calendar, Gamepad2 } from 'lucide-react';
import { PLATFORM_CONFIG, PRIORITY_PLATFORMS } from '../utils/constants';
import { slugify, getCanonicalUrl, generatePlatformSEO } from '../utils/seoHelpers';

/**
 * PlatformPage - Programmatic SEO page for gaming platforms
 * Creates scalable, dynamic pages for each platform with proper metadata
 */
const PlatformPage = () => {
    const { slug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Get all unique platforms with counts and games
    const platformData = useMemo(() => {
        const platformMap = new Map();

        gamesData.forEach(g => {
            g.platforms?.forEach(platform => {
                if (!platformMap.has(platform)) {
                    const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;
                    platformMap.set(platform, {
                        name: platform,
                        slug: slugify(platform),
                        count: 0,
                        games: [],
                        ...config
                    });
                }
                const data = platformMap.get(platform);
                data.count++;
                data.games.push(g);
            });
        });

        // Sort by priority, then by count
        const sorted = [...platformMap.values()].sort((a, b) => {
            const aIdx = PRIORITY_PLATFORMS.indexOf(a.name);
            const bIdx = PRIORITY_PLATFORMS.indexOf(b.name);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return b.count - a.count;
        });

        return {
            all: sorted,
            bySlug: Object.fromEntries([...platformMap.entries()].map(([name, data]) => [data.slug, data]))
        };
    }, []);

    // If no slug, show platform index page
    if (!slug) {
        // Calculate total unique games (some games appear on multiple platforms)
        const uniqueGames = new Set(gamesData.map(g => g.id)).size;

        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <SEO
                    title="Browse 2026 Games by Platform | PS5, Xbox, PC, Switch"
                    description={`Explore all ${uniqueGames} upcoming 2026 video game releases by platform. Find games for PlayStation 5, Xbox Series X/S, PC, Nintendo Switch and more.`}
                    url={getCanonicalUrl('/platform')}
                    gameList={{
                        name: 'Games by Platform',
                        description: 'Browse 2026 game releases by gaming platform',
                        games: gamesData.slice(0, 10)
                    }}
                />

                {/* Breadcrumb */}
                <Breadcrumb items={[{ name: 'Platforms', path: '/platform' }]} />

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
                </header>

                {/* Platform Summary Stats */}
                <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        {platformData.all.slice(0, 4).map(platform => (
                            <Link
                                key={platform.slug}
                                to={`/platform/${platform.slug}`}
                                style={{
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{platform.icon}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: platform.color }}>{platform.count}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.05em' }}>{platform.shortName}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Platform Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1rem'
                }}>
                    {platformData.all.map(platform => {
                        const topGames = platform.games.slice(0, 4);

                        return (
                            <Link
                                key={platform.slug}
                                to={`/platform/${platform.slug}`}
                                className="glass glass-hover"
                                style={{
                                    padding: '1.5rem',
                                    textDecoration: 'none',
                                    borderTop: `4px solid ${platform.color}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{platform.icon}</span>
                                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'inline' }}>
                                            {platform.name}
                                        </h2>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: `${platform.color}22`,
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: platform.color
                                    }}>
                                        {platform.count} games
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                                    {platform.description}
                                </p>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {topGames.map(g => (
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
                                            <img
                                                src={g.image}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                    {platform.count > 4 && (
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
                                            +{platform.count - 4}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* SEO Internal Links */}
                <nav style={{ marginTop: '3rem' }}>
                    <h2 style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.1em' }}>
                        ALSO EXPLORE
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <Link to="/genre" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                            🏷️ Browse by Genre
                        </Link>
                        <Link to="/calendar" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                            📅 Release Calendar
                        </Link>
                        <Link to="/compare" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                            ⚖️ Compare Games
                        </Link>
                    </div>
                </nav>
            </div>
        );
    }

    // Find the platform from slug
    const platformInfo = platformData.bySlug[slug];

    if (!platformInfo) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <SEO
                    title="Platform Not Found"
                    description="This platform doesn't exist in our database."
                    noIndex={true}
                />
                <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '1rem' }}>PLATFORM NOT FOUND</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    The platform you're looking for doesn't exist.
                </p>
                <Link to="/platform" className="btn-primary">Browse All Platforms</Link>
            </div>
        );
    }

    const games = platformInfo.games.sort((a, b) => (b.hype || 0) - (a.hype || 0));
    const seoData = generatePlatformSEO(platformInfo.name, games);

    // Other platforms (for cross-linking)
    const otherPlatforms = useMemo(() => {
        return platformData.all
            .filter(p => p.slug !== slug)
            .slice(0, 4);
    }, [platformData.all, slug]);

    // Games releasing soon on this platform
    const upcomingGames = useMemo(() => {
        const now = new Date();
        return games
            .filter(g => new Date(g.releaseDate) > now)
            .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
            .slice(0, 3);
    }, [games]);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={seoData.title}
                description={seoData.description}
                url={getCanonicalUrl(`/platform/${slug}`)}
                breadcrumbs={[
                    { name: 'Platforms', path: '/platform' },
                    { name: platformInfo.name, path: `/platform/${slug}` }
                ]}
                gameList={{
                    name: `${platformInfo.name} Games 2026`,
                    description: `Upcoming ${platformInfo.name} games releasing in 2026`,
                    games: games.slice(0, 10)
                }}
            />

            {/* Breadcrumb */}
            <Breadcrumb items={[
                { name: 'Platforms', path: '/platform' },
                { name: platformInfo.name, path: `/platform/${slug}` }
            ]} />

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
            <header style={{ marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: `${platformInfo.color}22`,
                        border: `1px solid ${platformInfo.color}44`,
                        borderRadius: '4px',
                        color: platformInfo.color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>{platformInfo.icon}</span> {platformInfo.name.toUpperCase()}
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {platformInfo.name.toUpperCase()} GAMES 2026
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    {games.length} upcoming games releasing on {platformInfo.name} in 2026
                </p>
            </header>

            {/* Stats & Quick Info */}
            <div className="glass" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={16} color="#f97316" />
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        Most Anticipated: <strong style={{ color: '#fff' }}>{games[0]?.title}</strong>
                    </span>
                </div>
                {upcomingGames.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} color="#06b6d4" />
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            Next Release: <strong style={{ color: '#fff' }}>{upcomingGames[0]?.title}</strong>
                        </span>
                    </div>
                )}
            </div>

            {/* Other Platforms */}
            {otherPlatforms.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                        OTHER PLATFORMS
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {otherPlatforms.map(p => (
                            <Link
                                key={p.slug}
                                to={`/platform/${p.slug}`}
                                style={{
                                    padding: '0.4rem 0.75rem',
                                    background: `${p.color}15`,
                                    border: `1px solid ${p.color}33`,
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: p.color,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                }}
                            >
                                {p.icon} {p.shortName}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

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
                    <p style={{ color: '#64748b' }}>No games found for {platformInfo.name} in 2026.</p>
                </div>
            )}

            {/* More Internal Links */}
            <nav style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                    EXPLORE MORE
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <Link to="/platform" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                        💻 All Platforms
                    </Link>
                    <Link to="/genre" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                        🏷️ Genres
                    </Link>
                    <Link to="/calendar" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                        📅 Calendar
                    </Link>
                    <Link to="/" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                        🎮 All Games
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default PlatformPage;
