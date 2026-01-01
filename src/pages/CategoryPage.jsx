import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import gamesData from '../data/games.json';
import GameCard from '../components/GameCard';
import { ArrowLeft, Gamepad2, Cpu, Globe, Info } from 'lucide-react';

const CategoryPage = () => {
    const { category } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Mapping slugs to labels and filter logic
    const categoryMap = {
        'ps5': { label: 'PlayStation 5', filter: (g) => g.platforms.some(p => p.toLowerCase().includes('playstation 5')), icon: <Gamepad2 size={32} /> },
        'pc': { label: 'PC', filter: (g) => g.platforms.some(p => p.toLowerCase() === 'pc'), icon: <Cpu size={32} /> },
        'xbox': { label: 'Xbox Series X/S', filter: (g) => g.platforms.some(p => p.toLowerCase().includes('xbox')), icon: <Gamepad2 size={32} /> },
        'switch': { label: 'Nintendo Switch', filter: (g) => g.platforms.some(p => p.toLowerCase().includes('switch')), icon: <Gamepad2 size={32} /> },
        'open-world': { label: 'Open World', filter: (g) => g.genres.some(gen => gen.toLowerCase().includes('open world')), icon: <Globe size={32} /> },
        'coop': { label: 'Co-op', filter: (g) => g.genres.some(gen => gen.toLowerCase().includes('cooperative') || gen.toLowerCase().includes('multiplayer')), icon: <Info size={32} /> },
    };

    const currentCategory = categoryMap[category] || { label: category, filter: () => true, icon: <Info size={32} /> };

    const filteredGames = useMemo(() => {
        return gamesData.filter(currentCategory.filter);
    }, [category]);

    const seoDescription = `The ultimate list of every ${currentCategory.label} game confirmed to release in 2026. Updated daily from verified sources.`;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <Link
                to="/"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#64748b',
                    textDecoration: 'none',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0',
                    minHeight: '44px'
                }}
            >
                <ArrowLeft size={18} />
                Back home
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <div
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'rgba(147, 51, 234, 0.2)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#c084fc'
                    }}
                >
                    {currentCategory.icon}
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.1 }}>
                        Upcoming <span className="gradient-text">{currentCategory.label} Games</span> 2026
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '700px' }}>
                        {seoDescription} Discover release dates, trailers, and platform details for all upcoming releases.
                    </p>
                </div>
            </div>

            <div
                className="glass"
                style={{
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(88, 28, 135, 0.1)',
                    borderColor: 'rgba(168, 85, 247, 0.2)'
                }}
            >
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)' }}>
                    <Info size={18} color="#c084fc" />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
                    Tracking <strong style={{ color: '#fff' }}>{filteredGames.length}</strong> {currentCategory.label} titles for 2026.
                </p>
            </div>

            {filteredGames.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
                    {filteredGames.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                            isWatched={isWatched(game.id)}
                            onToggleWatch={toggleWatch}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="glass"
                    style={{ padding: '5rem 2rem', textAlign: 'center' }}
                >
                    <p style={{ color: '#94a3b8' }}>No games found for this category in 2026 yet.</p>
                </div>
            )}

            {/* Internal Linking for SEO */}
            <section style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Explore Other 2026 Categories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: '0.75rem' }}>
                    {Object.entries(categoryMap).filter(([k]) => k !== category).map(([slug, data]) => (
                        <Link
                            key={slug}
                            to={`/upcoming-${slug}-games-2026`}
                            className="glass glass-hover"
                            style={{
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                textDecoration: 'none'
                            }}
                        >
                            <span style={{ color: '#c084fc' }}>{React.cloneElement(data.icon, { size: 20 })}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1' }}>{data.label}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CategoryPage;
