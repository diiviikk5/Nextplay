import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Search, Filter, Clock, TrendingUp, Calendar, ChevronRight, Zap, Crown, Tag, Monitor, Scale, ArrowRight, Swords, Code, Gamepad2, Flame, Star, Sparkles } from 'lucide-react';
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
            {/* HERO SECTION - PREMIUM REVAMP */}
            <section style={{ position: 'relative', minHeight: '85vh', overflow: 'hidden' }} className="hero-section">
                {/* Animated Background Layers */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${featuredGame.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        filter: 'brightness(0.35) saturate(1.2)',
                        transform: 'scale(1.05)',
                        animation: 'heroZoom 20s ease-in-out infinite alternate'
                    }}
                />

                {/* Animated Gradient Mesh Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `
                            radial-gradient(ellipse at 20% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                            radial-gradient(ellipse at 80% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)
                        `,
                        animation: 'meshMove 8s ease-in-out infinite'
                    }}
                />

                {/* Main Gradient Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(10, 14, 23, 0.4) 0%, rgba(10, 14, 23, 0.7) 40%, rgba(10, 14, 23, 0.95) 80%, #0a0e17 100%)'
                    }}
                />

                {/* Floating Particles */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: `${Math.random() * 4 + 2}px`,
                                height: `${Math.random() * 4 + 2}px`,
                                background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#f97316' : '#8b5cf6',
                                borderRadius: '50%',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.5 + 0.2,
                                animation: `floatParticle ${Math.random() * 10 + 15}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`,
                                boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
                            }}
                        />
                    ))}
                </div>

                {/* Animated Grid Lines */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        opacity: 0.5,
                        maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)'
                    }}
                />

                <div className="container" style={{ position: 'relative', padding: '6rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '85vh' }}>

                    {/* Premium Badge with Glow */}
                    <div
                        className="hero-badge"
                        style={{
                            display: 'inline-flex',
                            alignSelf: 'flex-start',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.6rem 1.25rem',
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.1))',
                            border: '1px solid rgba(249, 115, 22, 0.5)',
                            borderRadius: '100px',
                            color: '#f97316',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            marginBottom: '1.5rem',
                            boxShadow: '0 0 30px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                            animation: 'badgePulse 3s ease-in-out infinite'
                        }}
                    >
                        <Flame size={16} style={{ animation: 'flameFlicker 1.5s ease-in-out infinite' }} />
                        <span>MOST ANTICIPATED 2026</span>
                        <Sparkles size={14} />
                    </div>

                    {/* Animated Title with Shimmer */}
                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <h1
                            className="font-heading hero-title"
                            style={{
                                fontSize: 'clamp(3rem, 10vw, 6rem)',
                                fontWeight: 700,
                                lineHeight: 0.95,
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #ffffff 100%)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 3s ease-in-out infinite',
                                textShadow: 'none',
                                position: 'relative'
                            }}
                        >
                            {featuredGame.title.toUpperCase()}
                        </h1>
                        {/* Glow effect behind title */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '0',
                                transform: 'translateY(-50%)',
                                width: '60%',
                                height: '100%',
                                background: 'radial-gradient(ellipse at left, rgba(6, 182, 212, 0.15), transparent 70%)',
                                filter: 'blur(40px)',
                                pointerEvents: 'none',
                                zIndex: -1
                            }}
                        />
                    </div>

                    {/* Platform Tags with Icons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        {featuredGame.platforms.map((p, idx) => (
                            <span
                                key={p}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(6, 182, 212, 0.1)',
                                    border: '1px solid rgba(6, 182, 212, 0.25)',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: '#06b6d4',
                                    backdropFilter: 'blur(10px)',
                                    animation: `fadeSlideIn 0.5s ease-out ${idx * 0.1}s both`
                                }}
                            >
                                <Gamepad2 size={14} />
                                {p}
                            </span>
                        ))}
                    </div>

                    {/* Premium Countdown Boxes */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2.5rem',
                        maxWidth: '600px'
                    }}>
                        {/* Days Box */}
                        <div className="countdown-box" style={{
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))',
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, #f97316, transparent)'
                            }} />
                            <div style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 700, color: '#f97316', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                                {daysLeft}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.15em', marginTop: '0.5rem' }}>
                                DAYS
                            </div>
                        </div>

                        {/* Release Date Box */}
                        <div className="countdown-box" style={{
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.05))',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)'
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Calendar size={20} color="#06b6d4" />
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem', lineHeight: 1.2 }}>
                                {featuredDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em', marginTop: '0.25rem' }}>
                                {featuredDate.getFullYear()}
                            </div>
                        </div>

                        {/* Total Games Box */}
                        <div className="countdown-box" style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)'
                            }} />
                            <div style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 700, color: '#8b5cf6', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                                {gamesData.length}+
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.15em', marginTop: '0.5rem' }}>
                                GAMES
                            </div>
                        </div>
                    </div>

                    {/* Premium CTA Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link
                            to={`/game/${featuredGame.slug}`}
                            className="hero-btn-primary"
                            style={{
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                color: '#0a0e17',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.95rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <span style={{ position: 'relative', zIndex: 1 }}>View Details</span>
                            <ArrowRight size={18} style={{ position: 'relative', zIndex: 1 }} />
                        </Link>
                        <button
                            onClick={() => toggleWatch(featuredGame.id)}
                            className="hero-btn-secondary"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 2rem',
                                background: isWatched(featuredGame.id)
                                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1))'
                                    : 'rgba(255,255,255,0.05)',
                                border: isWatched(featuredGame.id)
                                    ? '1px solid rgba(6, 182, 212, 0.5)'
                                    : '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                color: isWatched(featuredGame.id) ? '#06b6d4' : '#fff',
                                fontWeight: 700,
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.95rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <Star size={18} fill={isWatched(featuredGame.id) ? '#06b6d4' : 'none'} />
                            {isWatched(featuredGame.id) ? 'Watching' : 'Add to Watchlist'}
                        </button>
                    </div>

                    {/* Scroll Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: 0.6,
                        animation: 'bounce 2s infinite'
                    }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.15em', fontWeight: 600 }}>SCROLL</span>
                        <div style={{
                            width: '24px',
                            height: '40px',
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '8px'
                        }}>
                            <div style={{
                                width: '4px',
                                height: '8px',
                                background: '#06b6d4',
                                borderRadius: '2px',
                                animation: 'scrollDot 1.5s infinite'
                            }} />
                        </div>
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
                    <Link to="/trends" className="glass glass-hover" style={{ padding: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        <Flame size={20} color="#f59e0b" />
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>Trends Hub</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>1,000+ Topics</div>
                        </div>
                    </Link>
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

            {/* GAMING SEARCH TRENDS & HARDWARE SECTION */}
            <section className="container" style={{ padding: '2.5rem 1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h2 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Flame size={20} fill="#f59e0b" /> 2026 GAMING TRENDS &amp; HARDWARE INTELLIGENCE
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.825rem', marginTop: '0.25rem', margin: 0 }}>
                            Live tracking 1,000+ high-velocity gaming search topics, next-gen hardware, game engines, and franchises
                        </p>
                    </div>
                    <Link to="/trends" style={{ fontSize: '0.85rem', color: '#f59e0b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
                        Explore All 1,000+ Trends <ChevronRight size={14} />
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1rem'
                }}>
                    {[
                        { name: 'Nintendo Switch 2', slug: 'nintendo-switch-2', cat: 'Hardware', score: 98, desc: 'Next-gen portable console specs, launch window & backward compatibility.' },
                        { name: 'PlayStation 5 Pro', slug: 'playstation-5-pro', cat: 'Hardware', score: 96, desc: 'PSSR AI upscaling benchmarks and 60+ FPS fidelity enhancements.' },
                        { name: 'Steam Deck OLED', slug: 'steam-deck-oled', cat: 'Hardware', score: 94, desc: 'Valve handheld optimization and 2026 verified game support.' },
                        { name: 'Unreal Engine 5.5', slug: 'unreal-engine-5-5', cat: 'Engine', score: 93, desc: 'Next-gen Lumen, Nanite rendering & physics in 2026 AAA releases.' },
                        { name: 'NVIDIA RTX 5090', slug: 'nvidia-geforce-rtx-5090', cat: 'Hardware', score: 95, desc: 'Blackwell architecture, DLSS 4 frame generation & 4K ray tracing specs.' },
                        { name: 'Grand Theft Auto VI', slug: 'grand-theft-auto-vi-trends', cat: 'Franchise', score: 99, desc: 'Global launch forecasts, Vice City map size & pre-order velocity.' },
                        { name: 'Xbox Game Pass Ultimate', slug: 'xbox-game-pass-ultimate', cat: 'Subscription', score: 92, desc: 'Day-one confirmed 2026 launch catalog and cloud streaming upgrades.' },
                        { name: 'Summer Game Fest 2026', slug: 'summer-game-fest-2026', cat: 'Event', score: 91, desc: 'World premiere showcases, developer live streams & trailer reveals.' }
                    ].map(item => (
                        <Link
                            key={item.slug}
                            to={`/trends/${item.slug}`}
                            className="glass glass-hover"
                            style={{
                                padding: '1.25rem',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                        {item.cat}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4' }}>
                                        🔥 {item.score}% Velocity
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{item.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#06b6d4' }}>
                                Read Search Intel <ArrowRight size={12} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* LATEST NEWS - Prominent section for original content */}
            <section className="container" style={{ padding: '2rem 1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={18} /> LATEST NEWS
                    </h2>
                    <Link to="/news" style={{ fontSize: '0.8rem', color: '#f97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        All News <ChevronRight size={14} />
                    </Link>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem'
                }}>
                    <Link to="/news/hollow-knight-silksong-release-date-update" className="glass glass-hover" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                        <div style={{ height: '120px', background: 'url(https://images.igdb.com/igdb/image/upload/t_cover_big/coaob9.jpg) center/cover' }} />
                        <div style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#f97316', fontWeight: 600 }}>Feature</span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '0.35rem', lineHeight: 1.3 }}>Hollow Knight Silksong: Where Is It and When Can We Play</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>5 min read</div>
                        </div>
                    </Link>
                    <Link to="/news/hades-2-early-access-review-supergiant" className="glass glass-hover" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                        <div style={{ height: '120px', background: 'url(https://images.igdb.com/igdb/image/upload/t_cover_big/coaknx.jpg) center/cover' }} />
                        <div style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#f97316', fontWeight: 600 }}>Review</span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '0.35rem', lineHeight: 1.3 }}>Hades II Early Access: Is It Worth Playing Now</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>6 min read</div>
                        </div>
                    </Link>
                    <Link to="/news/clair-obscur-expedition-33-release-preview" className="glass glass-hover" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                        <div style={{ height: '120px', background: 'url(https://images.igdb.com/igdb/image/upload/t_cover_big/co9gam.jpg) center/cover' }} />
                        <div style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#f97316', fontWeight: 600 }}>Preview</span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '0.35rem', lineHeight: 1.3 }}>Clair Obscur Expedition 33: Why This RPG Has Everyone Talking</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>5 min read</div>
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
