import React, { useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Tag, ArrowLeft, Gamepad2, TrendingUp, Calendar } from 'lucide-react';
import { GENRE_COLORS } from '../utils/constants';
import { slugify, getCanonicalUrl, generateGenreSEO } from '../utils/seoHelpers';

/**
 * GenrePage - Programmatic SEO page for game genres
 * Creates scalable, dynamic pages for each genre with proper metadata
 */
const GenrePage = () => {
    const { slug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Get all unique genres with counts
    const genreData = useMemo(() => {
        const genreMap = new Map();

        gamesData.forEach(g => {
            g.genres?.forEach(genre => {
                if (!genreMap.has(genre)) {
                    genreMap.set(genre, {
                        name: genre,
                        slug: slugify(genre),
                        count: 0,
                        games: [],
                        color: GENRE_COLORS[genre] || GENRE_COLORS.default
                    });
                }
                const data = genreMap.get(genre);
                data.count++;
                data.games.push(g);
            });
        });

        // Sort by count
        return {
            all: [...genreMap.values()].sort((a, b) => b.count - a.count),
            bySlug: Object.fromEntries([...genreMap.entries()].map(([name, data]) => [data.slug, data]))
        };
    }, []);

    // If no slug, show genre index page
    if (!slug) {
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <SEO
                    title="Browse 2026 Games by Genre | Action, RPG, Adventure & More"
                    description={`Explore all ${gamesData.length} upcoming 2026 video game releases across ${genreData.all.length} genres. Find Action, RPG, Adventure, Shooter, Strategy games and more.`}
                    url={getCanonicalUrl('/genre')}
                    gameList={{
                        name: 'Games by Genre',
                        description: 'Browse 2026 game releases by genre',
                        games: gamesData.slice(0, 10)
                    }}
                />

                {/* Breadcrumb */}
                <Breadcrumb items={[{ name: 'Genres', path: '/genre' }]} />

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            marginBottom: '1rem'
                        }}
                    >
                        <Tag size={14} /> BROWSE BY GENRE
                    </div>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        GAME GENRES
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                        Explore {gamesData.length} upcoming 2026 games across {genreData.all.length} genres
                    </p>
                </header>

                {/* Stats Overview */}
                <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6' }}>{genreData.all.length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.1em' }}>GENRES</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#06b6d4' }}>{gamesData.length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.1em' }}>GAMES</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316' }}>{genreData.all[0]?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.1em' }}>TOP GENRE</div>
                    </div>
                </div>

                {/* Genre Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                    gap: '1rem'
                }}>
                    {genreData.all.map(genre => {
                        const topGames = genre.games.slice(0, 3);

                        return (
                            <Link
                                key={genre.slug}
                                to={`/genre/${genre.slug}`}
                                className="glass glass-hover"
                                style={{
                                    padding: '1.25rem',
                                    textDecoration: 'none',
                                    borderLeft: `4px solid ${genre.color}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{genre.name}</h2>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        background: `${genre.color}22`,
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        color: genre.color
                                    }}>
                                        {genre.count}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    {topGames.map(g => (
                                        <div
                                            key={g.id}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
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
                        <Link to="/platform" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                            💻 Browse by Platform
                        </Link>
                        <Link to="/calendar" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                            📅 Release Calendar
                        </Link>
                        <Link to="/tier-list" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                            👑 Tier List Creator
                        </Link>
                    </div>
                </nav>
            </div>
        );
    }

    // Find the genre from slug
    const genreInfo = genreData.bySlug[slug];

    if (!genreInfo) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <SEO
                    title="Genre Not Found"
                    description="This genre doesn't exist in our database."
                    noIndex={true}
                />
                <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '1rem' }}>GENRE NOT FOUND</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    The genre you're looking for doesn't exist.
                </p>
                <Link to="/genre" className="btn-primary">Browse All Genres</Link>
            </div>
        );
    }

    const games = genreInfo.games.sort((a, b) => (b.hype || 0) - (a.hype || 0));
    const seoData = generateGenreSEO(genreInfo.name, games);

    // Related genres (share games)
    const relatedGenres = useMemo(() => {
        const related = new Map();
        games.forEach(game => {
            game.genres?.forEach(g => {
                if (g !== genreInfo.name) {
                    related.set(g, (related.get(g) || 0) + 1);
                }
            });
        });
        return [...related.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => ({ name, slug: slugify(name), color: GENRE_COLORS[name] || GENRE_COLORS.default }));
    }, [games, genreInfo.name]);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={seoData.title}
                description={seoData.description}
                url={getCanonicalUrl(`/genre/${slug}`)}
                breadcrumbs={[
                    { name: 'Genres', path: '/genre' },
                    { name: genreInfo.name, path: `/genre/${slug}` }
                ]}
                gameList={{
                    name: `${genreInfo.name} Games 2026`,
                    description: `Upcoming ${genreInfo.name.toLowerCase()} games releasing in 2026`,
                    games: games.slice(0, 10)
                }}
            />

            {/* Breadcrumb */}
            <Breadcrumb items={[
                { name: 'Genres', path: '/genre' },
                { name: genreInfo.name, path: `/genre/${slug}` }
            ]} />

            {/* Back */}
            <Link
                to="/genre"
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
                <ArrowLeft size={16} /> All Genres
            </Link>

            {/* Header */}
            <header style={{ marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: `${genreInfo.color}22`,
                        border: `1px solid ${genreInfo.color}44`,
                        borderRadius: '4px',
                        color: genreInfo.color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <Gamepad2 size={14} /> {genreInfo.name.toUpperCase()}
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {genreInfo.name.toUpperCase()} GAMES 2026
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    {games.length} upcoming {genreInfo.name.toLowerCase()} games releasing in 2026
                </p>
            </header>

            {/* Stats */}
            <div className="glass" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={16} color="#f97316" />
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        Top Hype: <strong style={{ color: '#fff' }}>{games[0]?.title}</strong>
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="#06b6d4" />
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        Next Release: <strong style={{ color: '#fff' }}>
                            {games.filter(g => new Date(g.releaseDate) > new Date())[0]?.title || 'TBA'}
                        </strong>
                    </span>
                </div>
            </div>

            {/* Related Genres */}
            {relatedGenres.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                        RELATED GENRES
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {relatedGenres.map(g => (
                            <Link
                                key={g.slug}
                                to={`/genre/${g.slug}`}
                                style={{
                                    padding: '0.4rem 0.75rem',
                                    background: `${g.color}15`,
                                    border: `1px solid ${g.color}33`,
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: g.color,
                                    textDecoration: 'none'
                                }}
                            >
                                {g.name}
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
                    <p style={{ color: '#64748b' }}>No {genreInfo.name} games found for 2026.</p>
                </div>
            )}

            {/* More Internal Links */}
            <nav style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                    EXPLORE MORE
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <Link to="/genre" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                        🏷️ All Genres
                    </Link>
                    <Link to="/platform" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>
                        💻 Platforms
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

export default GenrePage;
