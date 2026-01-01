import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Tag, ArrowLeft, Gamepad2 } from 'lucide-react';

// Genre color mapping
const GENRE_COLORS = {
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
    'default': '#64748b'
};

const GenrePage = () => {
    const { slug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Get all unique genres
    const allGenres = useMemo(() => {
        const genreSet = new Set();
        gamesData.forEach(g => {
            g.genres?.forEach(genre => genreSet.add(genre));
        });
        return [...genreSet].sort();
    }, []);

    // If no slug, show genre index
    if (!slug) {
        // Count games per genre
        const genreCounts = {};
        gamesData.forEach(g => {
            g.genres?.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });

        const sortedGenres = allGenres.sort((a, b) => (genreCounts[b] || 0) - (genreCounts[a] || 0));

        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <SEO
                    title="Browse 2026 Games by Genre | Action, RPG, Adventure & More | NextPlay"
                    description="Explore all 2026 video game releases by genre. Find Action, RPG, Adventure, Shooter, Strategy games and more. Filter by your favorite game types."
                    url="https://nextplaygame.me/genre"
                />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
                        Explore {gamesData.length} upcoming 2026 games across {allGenres.length} genres
                    </p>
                </div>

                {/* Genre Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                    gap: '1rem'
                }}>
                    {sortedGenres.map(genre => {
                        const count = genreCounts[genre] || 0;
                        const color = GENRE_COLORS[genre] || GENRE_COLORS.default;
                        const genreSlug = genre.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const gamesInGenre = gamesData.filter(g => g.genres?.includes(genre)).slice(0, 3);

                        return (
                            <Link
                                key={genre}
                                to={`/genre/${genreSlug}`}
                                className="glass glass-hover"
                                style={{
                                    padding: '1.25rem',
                                    textDecoration: 'none',
                                    borderLeft: `4px solid ${color}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{genre}</h3>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        background: `${color}22`,
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        color
                                    }}>
                                        {count}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    {gamesInGenre.map(g => (
                                        <div
                                            key={g.id}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img src={g.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Find the genre from slug
    const genre = allGenres.find(g => g.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);

    if (!genre) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <SEO title="Genre Not Found | NextPlay" description="This genre doesn't exist." />
                <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '1rem' }}>GENRE NOT FOUND</h1>
                <Link to="/genre" className="btn-primary">Browse All Genres</Link>
            </div>
        );
    }

    const games = gamesData.filter(g => g.genres?.includes(genre)).sort((a, b) => b.hype - a.hype);
    const color = GENRE_COLORS[genre] || GENRE_COLORS.default;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={`${genre} Games 2026 | ${games.length} Upcoming Releases | NextPlay`}
                description={`All ${genre} games releasing in 2026. Browse ${games.length} upcoming ${genre.toLowerCase()} titles including ${games.slice(0, 3).map(g => g.title).join(', ')} and more.`}
                url={`https://nextplaygame.me/genre/${slug}`}
            />

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
            <div style={{ marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: `${color}22`,
                        border: `1px solid ${color}44`,
                        borderRadius: '4px',
                        color,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <Gamepad2 size={14} /> {genre.toUpperCase()}
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {genre.toUpperCase()} GAMES 2026
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    {games.length} upcoming {genre.toLowerCase()} games releasing in 2026
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
                    <p style={{ color: '#64748b' }}>No {genre} games found for 2026.</p>
                </div>
            )}
        </div>
    );
};

export default GenrePage;
