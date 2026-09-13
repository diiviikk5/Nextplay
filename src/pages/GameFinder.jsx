import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { useWatchlist } from '../hooks/useWatchlist';
import { Sparkles, Gamepad2, Compass, Check, ArrowRight, RotateCcw, Star, Trophy, Share2, Twitter } from 'lucide-react';
import { formatCardDate } from '../utils/dateHelpers';

const GameFinder = () => {
    const { isWatched, toggleWatch } = useWatchlist();

    const [step, setStep] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedVibe, setSelectedVibe] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');

    const platforms = [
        { id: 'PC', label: 'PC / Steam', icon: '💻' },
        { id: 'PlayStation 5', label: 'PlayStation 5', icon: '🎮' },
        { id: 'Xbox Series X/S', label: 'Xbox Series X|S', icon: '🟢' },
        { id: 'Nintendo Switch', label: 'Nintendo Switch', icon: '🕹️' }
    ];

    const vibes = [
        { id: 'open-world', label: 'Massive Open Worlds', desc: 'Exploration, freedom, epic scale', genres: ['Open World', 'Adventure'] },
        { id: 'action-combat', label: 'High-Octane Action', desc: 'Fast reflexes, combat, shooters', genres: ['Action', 'Shooter', 'Fighting'] },
        { id: 'story-rpg', label: 'Deep Story RPGs', desc: 'Rich lore, character choices, progression', genres: ['RPG', 'Role-playing (RPG)'] },
        { id: 'horror', label: 'Psychological Horror & Dark', desc: 'Tension, scares, survival', genres: ['Horror', 'Survival'] },
        { id: 'indie-gem', label: 'Artistic Indie Masterpieces', desc: 'Unique mechanics, stunning style', genres: ['Indie', 'Platformer', 'Puzzle'] }
    ];

    const styles = [
        { id: 'aaa', label: 'Blockbuster AAA Flagship', desc: 'Cutting-edge visuals, huge budgets' },
        { id: 'coop', label: 'Co-op & Multiplayer', desc: 'Play with friends or online squads' },
        { id: 'solo', label: 'Solo Immersive Journey', desc: 'Pure single-player campaigns' }
    ];

    const recommendations = useMemo(() => {
        if (step !== 4) return [];

        let pool = gamesData.filter(game => {
            // Platform filter
            if (selectedPlatform && !game.platforms?.some(p => p.toLowerCase().includes(selectedPlatform.toLowerCase()))) {
                return false;
            }
            return true;
        });

        // Score based on vibe and style
        const targetVibeObj = vibes.find(v => v.id === selectedVibe);
        const scored = pool.map(game => {
            let score = (game.hype || 50);

            if (targetVibeObj) {
                targetVibeObj.genres.forEach(g => {
                    if (game.genres?.includes(g)) score += 30;
                });
            }

            if (selectedStyle === 'aaa' && (game.hype || 50) >= 80) score += 25;
            if (selectedStyle === 'coop' && (game.gameModes?.some(m => m.toLowerCase().includes('multi') || m.toLowerCase().includes('co-op')))) score += 35;
            if (selectedStyle === 'solo' && (game.gameModes?.some(m => m.toLowerCase().includes('single')))) score += 20;

            return { game, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 3).map(s => s.game);
    }, [step, selectedPlatform, selectedVibe, selectedStyle]);

    const resetQuiz = () => {
        setSelectedPlatform('');
        setSelectedVibe('');
        setSelectedStyle('');
        setStep(1);
    };

    const shareUrl = 'https://nextplaygame.me/game-finder';
    const shareText = 'I just discovered my top anticipated 2026 games with NextPlay Game Finder! Find yours here: 🎮';

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="2026 Game Finder & Matchmaker Quiz | NextPlay"
                description="Find your next favorite 2026 video game release in 3 simple steps. Personalized recommendations based on platform, genre, and playstyle."
                url={shareUrl}
            />

            {/* Header */}
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
                    <Compass size={14} /> 2026 GAME MATCHMAKER
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    Find Your Next 2026 Obsession
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Over 250 video games are confirmed for 2026. Take our 30-second quiz to discover the top titles built for your taste.
                </p>
            </div>

            {/* Quiz Container */}
            <div className="glass" style={{
                maxWidth: '750px',
                margin: '0 auto 4rem',
                padding: '2.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Progress Indicators */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                height: '6px',
                                borderRadius: '3px',
                                background: step >= i ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                                transition: 'background 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Step 1: Platform */}
                {step === 1 && (
                    <div>
                        <h2 className="font-heading" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
                            Step 1: What do you play on?
                        </h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                            Select your primary gaming platform for 2026 releases:
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                            {platforms.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPlatform(p.id)}
                                    style={{
                                        padding: '1.5rem 1rem',
                                        background: selectedPlatform === p.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `2px solid ${selectedPlatform === p.id ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        color: '#fff',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{p.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{p.label}</div>
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={!selectedPlatform}
                            onClick={() => setStep(2)}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: selectedPlatform ? 1 : 0.4
                            }}
                        >
                            Continue to Step 2 <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Step 2: Vibe / Genre */}
                {step === 2 && (
                    <div>
                        <h2 className="font-heading" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
                            Step 2: What vibe are you craving?
                        </h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                            Choose the core gameplay style and world atmosphere:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                            {vibes.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVibe(v.id)}
                                    style={{
                                        padding: '1.25rem',
                                        background: selectedVibe === v.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `2px solid ${selectedVibe === v.id ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: '#fff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{v.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>{v.desc}</div>
                                    </div>
                                    {selectedVibe === v.id && <Check size={20} color="#06b6d4" />}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(1)} className="btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
                                Back
                            </button>
                            <button
                                disabled={!selectedVibe}
                                onClick={() => setStep(3)}
                                className="btn-primary"
                                style={{ flex: 1, padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: selectedVibe ? 1 : 0.4 }}
                            >
                                Continue to Step 3 <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Playstyle */}
                {step === 3 && (
                    <div>
                        <h2 className="font-heading" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
                            Step 3: What playstyle fits you?
                        </h2>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                            Pick your preferred release scale:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                            {styles.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStyle(s.id)}
                                    style={{
                                        padding: '1.25rem',
                                        background: selectedStyle === s.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `2px solid ${selectedStyle === s.id ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: '#fff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{s.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>{s.desc}</div>
                                    </div>
                                    {selectedStyle === s.id && <Check size={20} color="#06b6d4" />}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(2)} className="btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
                                Back
                            </button>
                            <button
                                disabled={!selectedStyle}
                                onClick={() => setStep(4)}
                                className="btn-primary"
                                style={{ flex: 1, padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: selectedStyle ? 1 : 0.4 }}
                            >
                                <Sparkles size={18} /> Reveal My 2026 Matches
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Recommendations */}
                {step === 4 && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'rgba(6, 182, 212, 0.2)',
                                border: '1px solid #06b6d4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Trophy size={28} color="#06b6d4" />
                            </div>
                            <h2 className="font-heading" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
                                Your Top 2026 Matches
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                Curated for {selectedPlatform} • {vibes.find(v => v.id === selectedVibe)?.label}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                            {recommendations.map((game, idx) => (
                                <div
                                    key={game.slug}
                                    style={{
                                        display: 'flex',
                                        gap: '1.25rem',
                                        padding: '1.25rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '12px',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : '#f97316',
                                        color: '#0a0e17',
                                        fontWeight: 900,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem'
                                    }}>
                                        #{idx + 1}
                                    </div>
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
                                            {game.title}
                                        </h3>
                                        <div style={{ fontSize: '0.8rem', color: '#06b6d4', marginBottom: '0.25rem' }}>
                                            Release: {formatCardDate(game.releaseDate)}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {game.genres?.join(', ')} • {game.platforms?.join(', ')}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => toggleWatch(game.id)}
                                            style={{
                                                padding: '0.5rem 0.8rem',
                                                background: isWatched(game.id) ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${isWatched(game.id) ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '6px',
                                                color: isWatched(game.id) ? '#06b6d4' : '#fff',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <Star size={14} fill={isWatched(game.id) ? 'currentColor' : 'none'} />
                                            {isWatched(game.id) ? 'Watched' : 'Watchlist'}
                                        </button>
                                        <Link to={`/game/${game.slug}`} className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                                            Countdown
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reset & Share */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <button
                                onClick={resetQuiz}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <RotateCcw size={16} /> Retake Quiz
                            </button>

                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                            >
                                <Twitter size={15} /> Share Quiz
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameFinder;
