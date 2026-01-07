import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Search, Filter, Clock, TrendingUp, Calendar, ChevronRight, Zap, Crown, Tag, Monitor, Scale, ArrowRight, Swords, Code } from 'lucide-react';
import { getCanonicalUrl, slugify } from '../utils/seoHelpers';
import { PLATFORM_FILTERS } from '../utils/constants';

const Home = () => {
    const { isWatched, toggleWatch } = useWatchlist();
    const [search, setSearch] = useState('');
    const [activePlatform, setActivePlatform] = useState('All');

    const platforms = PLATFORM_FILTERS;

    const filteredGames = useMemo(() => {
        return gamesData
            .filter(game => {
                const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
                const matchesPlatform = activePlatform === 'All' || game.platforms.some(p => p.includes(activePlatform.replace(' Series X/S', '')));
                return matchesSearch && matchesPlatform;
            });
    }, [search, activePlatform]);

    // Featured game
    const featuredGame = useMemo(() =>
        gamesData.find(g => g.title.toLowerCase().includes('grand theft auto')) || gamesData[0]
        , []);

    // Calculate countdown
    const today = new Date();
    const featuredDate = new Date(featuredGame.releaseDate);
    const daysLeft = Math.ceil((featuredDate - today) / (1000 * 60 * 60 * 24));

    // FAQ data for SEO
    const faqData = useMemo(() => [
        {
            question: 'When is GTA 6 coming out?',
            answer: `Grand Theft Auto VI (GTA 6) is scheduled to release on ${featuredDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} for PlayStation 5 and Xbox Series X/S. Track the countdown at NextPlay 2026.`
        },
        {
            question: 'What are the most anticipated games of 2026?',
            answer: `The most anticipated games of 2026 include: ${gamesData.slice(0, 8).map(g => g.title).join(', ')}. Track all ${gamesData.length}+ games at NextPlay.`
        },
        {
            question: 'What PS5 games are coming in 2026?',
            answer: `Major PS5 games releasing in 2026 include ${gamesData.filter(g => g.platforms?.includes('PlayStation 5')).slice(0, 5).map(g => g.title).join(', ')} and more. Use NextPlay 2026 to track all upcoming PS5 releases.`
        },
        {
            question: 'How many games are releasing in 2026?',
            answer: `NextPlay tracks ${gamesData.length}+ video games releasing in 2026 across PlayStation 5, Xbox Series X/S, PC, and Nintendo Switch.`
        }
    ], [featuredDate]);

    // Coming soon sections
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const comingThisMonth = useMemo(() => {
        return gamesData
            .filter(g => {
                const rd = new Date(g.releaseDate);
                return rd >= now && rd <= thirtyDaysFromNow;
            })
            .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
            .slice(0, 6);
    }, []);

    const comingThisQuarter = useMemo(() => {
        return gamesData
            .filter(g => {
                const rd = new Date(g.releaseDate);
                return rd > thirtyDaysFromNow && rd <= ninetyDaysFromNow;
            })
            .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
            .slice(0, 6);
    }, []);

    // Get top genres
    const topGenres = useMemo(() => {
        const counts = {};
        gamesData.forEach(g => g.genres?.forEach(genre => {
            counts[genre] = (counts[genre] || 0) + 1;
        }));
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count]) => ({ name, count }));
    }, []);

    return (
        <div>
            <SEO
                title="NextPlay 2026 | GTA 6 Release Date Countdown & All 2026 Game Releases Calendar"
                description={`The #1 tracker for 2026 video game releases. Live countdown to GTA VI, ${gamesData.length}+ games tracked. Create tier lists, compare games, and build your watchlist.`}
                url={getCanonicalUrl('/')}
                keywords="GTA 6 release date 2026, GTA VI countdown timer, upcoming games 2026 list, 2026 game release calendar, PS5 games 2026, Xbox games 2026"
                faqData={faqData}
                gameList={{
                    name: 'Most Anticipated 2026 Video Games',
                    description: 'The top upcoming video games releasing in 2026',
                    games: gamesData.slice(0, 10)
                }}
            />
            {/* HERO SECTION */}
            <section style={{ position: 'relative', minHeight: '60vh', overflow: 'hidden' }} className="hero-section">
                {/* Background Image */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${featuredGame.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.4)'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(10, 14, 23, 0.5) 0%, rgba(10, 14, 23, 0.9) 70%, #0a0e17 100%)'
                    }}
                />

                <div className="container" style={{ position: 'relative', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '65vh' }}>
                    {/* Badge */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignSelf: 'flex-start',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(249, 115, 22, 0.2)',
                            border: '1px solid rgba(249, 115, 22, 0.4)',
                            borderRadius: '4px',
                            color: '#f97316',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            marginBottom: '1rem'
                        }}
                    >
                        <Zap size={14} /> MOST ANTICIPATED 2026
                    </div>

                    {/* Title */}
                    <h1
                        className="font-heading"
                        style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            lineHeight: 1,
                            letterSpacing: '0.02em'
                        }}
                    >
                        {featuredGame.title.toUpperCase()}
                    </h1>

                    {/* Platforms */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {featuredGame.platforms.map(p => (
                            <span
                                key={p}
                                style={{
                                    padding: '0.4rem 0.75rem',
                                    background: 'rgba(6, 182, 212, 0.15)',
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#06b6d4'
                                }}
                            >
                                {p}
                            </span>
                        ))}
                    </div>

                    {/* Countdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.1em' }}>RELEASE DATE</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                                {featuredDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.1em' }}>COUNTDOWN</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f97316' }}>
                                <Clock size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                {daysLeft} DAYS
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.1em' }}>TOTAL GAMES</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#06b6d4' }}>
                                {gamesData.length}+
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            to={`/game/${featuredGame.slug}`}
                            className="btn-primary"
                            style={{ textDecoration: 'none', flex: '1 1 auto', minWidth: '140px', maxWidth: '200px' }}
                        >
                            View Details
                        </Link>
                        <button
                            onClick={() => toggleWatch(featuredGame.id)}
                            className="btn-secondary"
                            style={{
                                background: isWatched(featuredGame.id) ? 'rgba(6, 182, 212, 0.2)' : undefined,
                                borderColor: isWatched(featuredGame.id) ? '#06b6d4' : undefined,
                                color: isWatched(featuredGame.id) ? '#06b6d4' : undefined,
                                flex: '1 1 auto',
                                minWidth: '140px',
                                maxWidth: '200px'
                            }}
                        >
                            {isWatched(featuredGame.id) ? '★ Watching' : '☆ Add to Watchlist'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Feature Links */}
            <section className="container" style={{ padding: '2rem 1rem 0' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
                    gap: '0.75rem'
                }}>
                    <Link to="/tier-list" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Crown size={20} color="#f97316" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Tier List</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Rank games</div>
                        </div>
                    </Link>
                    <Link to="/calendar" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Calendar size={20} color="#06b6d4" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Calendar</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>By month</div>
                        </div>
                    </Link>
                    <Link to="/genre" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Tag size={20} color="#8b5cf6" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Genres</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>By type</div>
                        </div>
                    </Link>
                    <Link to="/platform" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Monitor size={20} color="#22c55e" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Platforms</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>PS5, Xbox, PC</div>
                        </div>
                    </Link>
                    <Link to="/compare" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Scale size={20} color="#facc15" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Compare</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Side by side</div>
                        </div>
                    </Link>
                    <Link to="/my-top-5" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <TrendingUp size={20} color="#ef4444" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>My Top 5</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Share list</div>
                        </div>
                    </Link>
                    <Link to="/bracket" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Swords size={20} color="#ec4899" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Bracket</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Tournament</div>
                        </div>
                    </Link>
                    <Link to="/embed" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Code size={20} color="#a855f7" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Embed</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Widget</div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Coming This Month */}
            {comingThisMonth.length > 0 && (
                <section className="container" style={{ padding: '2rem 1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={18} /> COMING THIS MONTH
                        </h2>
                        <Link to="/calendar" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View all <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {comingThisMonth.map(game => (
                            <Link
                                key={game.id}
                                to={`/game/${game.slug}`}
                                className="glass glass-hover"
                                style={{
                                    flexShrink: 0,
                                    width: '180px',
                                    padding: '0.75rem',
                                    textDecoration: 'none'
                                }}
                            >
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }}
                                />
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {game.title}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#f97316', marginTop: '0.25rem' }}>
                                    {new Date(game.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Coming This Quarter */}
            {comingThisQuarter.length > 0 && (
                <section className="container" style={{ padding: '2rem 1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} /> COMING SOON
                        </h2>
                        <Link to="/calendar" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View all <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {comingThisQuarter.map(game => (
                            <Link
                                key={game.id}
                                to={`/game/${game.slug}`}
                                className="glass glass-hover"
                                style={{
                                    flexShrink: 0,
                                    width: '180px',
                                    padding: '0.75rem',
                                    textDecoration: 'none'
                                }}
                            >
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }}
                                />
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {game.title}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#06b6d4', marginTop: '0.25rem' }}>
                                    {new Date(game.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Genres */}
            <section className="container" style={{ padding: '2rem 1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={18} /> BROWSE BY GENRE
                    </h2>
                    <Link to="/genre" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        All genres <ChevronRight size={14} />
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {topGenres.map(({ name, count }) => (
                        <Link
                            key={name}
                            to={`/genre/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            className="glass glass-hover"
                            style={{
                                padding: '0.625rem 1rem',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{name}</span>
                            <span style={{ color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 600 }}>({count})</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SEARCH & FILTER */}
            <section className="container" style={{ padding: '2rem 1.5rem' }}>
                <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#64748b', letterSpacing: '0.1em' }}>
                    ALL {gamesData.length} GAMES
                </h2>
                <div
                    className="glass"
                    style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search 2026 games..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '0.875rem 1rem 0.875rem 2.75rem',
                                color: '#fff',
                                fontSize: '0.95rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Platform Filter - Horizontally scrollable on mobile */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: '0.5rem',
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            paddingBottom: '0.25rem',
                            margin: '0 -0.5rem',
                            padding: '0 0.5rem'
                        }}
                        className="hide-scrollbar"
                    >
                        {platforms.map(p => (
                            <button
                                key={p}
                                onClick={() => setActivePlatform(p)}
                                style={{
                                    padding: '0.625rem 1rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: activePlatform === p ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255,255,255,0.05)',
                                    color: activePlatform === p ? '#0a0e17' : '#94a3b8',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    minHeight: '44px'
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Showing <strong style={{ color: '#06b6d4' }}>{filteredGames.length}</strong> upcoming 2026 releases
                    </div>
                </div>
            </section>

            {/* GAMES GRID - Improved mobile breakpoints */}
            <section className="container" style={{ padding: '1rem 1rem 4rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1rem'
                }}>
                    {filteredGames.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            isWatched={isWatched(game.id)}
                            onToggleWatch={toggleWatch}
                        />
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8' }}>No games found matching your search.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
