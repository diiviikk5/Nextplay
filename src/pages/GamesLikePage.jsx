import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Sparkles, ArrowLeft, Gamepad2, Flame, Scale, Cpu, CheckCircle } from 'lucide-react';
import { getSimilarGames } from '../utils/specsAndSimilarity';
import { formatCardDate } from '../utils/dateHelpers';

const GamesLikePage = () => {
    const { slug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    const targetGame = useMemo(() => {
        return gamesData.find(g => g.slug === slug);
    }, [slug]);

    const similarGames = useMemo(() => {
        if (!targetGame) return [];
        return getSimilarGames(targetGame, 8);
    }, [targetGame]);

    if (!targetGame) {
        // Directory of top games to explore alternatives for
        const topGames = [...gamesData].sort((a, b) => (b.hype || 0) - (a.hype || 0)).slice(0, 30);
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.9rem',
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '20px',
                        color: '#06b6d4',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        marginBottom: '1rem'
                    }}>
                        <Sparkles size={14} /> GAME RECOMMENDATION HUBS
                    </div>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                        Find Games Like Your Favorites (2026)
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Explore hand-picked recommendations and algorithmic alternatives for every major 2026 video game release.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {topGames.map(game => (
                        <Link
                            key={game.slug}
                            to={`/games-like/${game.slug}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                            className="game-like-hub-card glass hover-glow"
                        >
                            <img
                                src={game.image}
                                alt={game.title}
                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
                                    Games Like {game.title}
                                </h3>
                                <div style={{ fontSize: '0.75rem', color: '#06b6d4' }}>
                                    {game.genres?.slice(0, 2).join(' • ')}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    const pageTitle = `Top 8 Games Like ${targetGame.title} (Upcoming 2026 Alternatives) | NextPlay`;
    const pageDescription = `Looking for games like ${targetGame.title}? Here are the 8 best upcoming 2026 video games featuring similar gameplay, themes, and release dates.`;
    const canonicalUrl = `https://nextplaygame.me/games-like/${targetGame.slug}`;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={pageTitle}
                description={pageDescription}
                url={canonicalUrl}
                image={targetGame.image}
            />

            <Breadcrumb
                items={[
                    { label: 'Games', path: '/' },
                    { label: targetGame.title, path: `/game/${targetGame.slug}` },
                    { label: `Games Like ${targetGame.title}` }
                ]}
            />

            {/* Hero Header */}
            <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                padding: '2.5rem 2rem',
                marginBottom: '3rem',
                background: `linear-gradient(180deg, rgba(10, 14, 23, 0.7) 0%, rgba(10, 14, 23, 0.95) 100%), url(${targetGame.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '20px',
                    color: '#06b6d4',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '1rem'
                }}>
                    <Sparkles size={14} /> SIMILAR GAMES &amp; ALTERNATIVES
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    Top 8 Games Like {targetGame.title} (2026)
                </h1>
                <p style={{ color: '#cbd5e1', maxWidth: '750px', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Love {targetGame.title}? If you're counting down the days until its release ({formatCardDate(targetGame.releaseDate)}), check out these 8 upcoming 2026 releases that share its signature {targetGame.genres?.join(', ')} gameplay, themes, and aesthetic.
                </p>

                {/* Quick action buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to={`/game/${targetGame.slug}`} className="btn-primary" style={{ padding: '0.6rem 1.2rem', textDecoration: 'none' }}>
                        View {targetGame.title} Details
                    </Link>
                    <Link to={`/system-requirements/${targetGame.slug}`} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Cpu size={15} /> PC Specs
                    </Link>
                    <Link to={`/compare?games=${targetGame.slug}`} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Scale size={15} /> Compare Side-by-Side
                    </Link>
                </div>
            </div>

            {/* Target Game Summary Card */}
            <div className="glass" style={{
                padding: '1.5rem',
                borderRadius: '12px',
                borderLeft: '4px solid #06b6d4',
                marginBottom: '3rem',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <img
                    src={targetGame.image}
                    alt={targetGame.title}
                    style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 600, textTransform: 'uppercase' }}>Reference Title</div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0' }}>{targetGame.title}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                        {targetGame.genres?.join(' • ')} | Platforms: {targetGame.platforms?.join(', ')} | Releases: {formatCardDate(targetGame.releaseDate)}
                    </p>
                </div>
            </div>

            {/* Recommended Similar Games Grid */}
            <h2 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
                Handpicked Alternatives for {targetGame.title} Fans
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem'
            }}>
                {similarGames.map((game, idx) => (
                    <div key={game.slug} style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-10px',
                            left: '12px',
                            zIndex: 10,
                            background: '#06b6d4',
                            color: '#0a0e17',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 800
                        }}>
                            #{idx + 1} MATCH
                        </div>
                        <GameCard
                            game={game}
                            isWatched={isWatched(game.id)}
                            onToggleWatch={() => toggleWatch(game.id)}
                        />
                    </div>
                ))}
            </div>

            {/* FAQ Section for Rich Snippets */}
            <section style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '3rem'
            }}>
                <h3 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem' }}>
                    Frequently Asked Questions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <h4 style={{ color: '#06b6d4', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                            What is the most anticipated game similar to {targetGame.title}?
                        </h4>
                        <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                            Based on community hype and gameplay mechanics, {similarGames[0]?.title || 'upcoming 2026 titles'} is currently the highest-rated alternative to {targetGame.title}.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: '#06b6d4', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                            When will these games be released?
                        </h4>
                        <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                            All recommended alternatives are confirmed or scheduled to launch throughout 2026 across PC, PlayStation 5, Xbox Series X/S, and Nintendo Switch.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GamesLikePage;
