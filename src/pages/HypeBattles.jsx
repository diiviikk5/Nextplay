import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Swords, Trophy, Flame, Share2, Twitter, Scale, ArrowRight, Check } from 'lucide-react';
import { getTopComparisons } from '../utils/specsAndSimilarity';

const HypeBattles = () => {
    const battles = useMemo(() => {
        return getTopComparisons(12);
    }, []);

    const [votes, setVotes] = useState(() => {
        try {
            const saved = localStorage.getItem('np_hype_battles_votes');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const handleVote = (battleSlug, chosenGameSlug) => {
        const updated = { ...votes, [battleSlug]: chosenGameSlug };
        setVotes(updated);
        try {
            localStorage.setItem('np_hype_battles_votes', JSON.stringify(updated));
        } catch (e) {
            console.error(e);
        }
    };

    const getBattlePercentages = (battle) => {
        const h1 = battle.game1.hype || 50;
        const h2 = battle.game2.hype || 50;
        const total = h1 + h2;
        let p1 = Math.round((h1 / total) * 100);
        let p2 = 100 - p1;

        // Bias slightly if user voted
        const userVote = votes[battle.slug];
        if (userVote === battle.game1.slug) {
            p1 = Math.min(95, p1 + 2);
            p2 = 100 - p1;
        } else if (userVote === battle.game2.slug) {
            p2 = Math.min(95, p2 + 2);
            p1 = 100 - p2;
        }

        return { p1, p2 };
    };

    const shareUrl = 'https://nextplaygame.me/battles';
    const shareText = 'Vote on the biggest 2026 gaming matchups! GTA 6 vs Crimson Desert, Silksong vs Hades 2, and more on NextPlay Hype Battles: ⚔️🎮';

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="2026 Gaming Hype Battles & Head-to-Head Community Polls | NextPlay"
                description="Vote in head-to-head showdowns for the most anticipated video games of 2026. Real-time community voting results, comparisons, and release countdowns."
                url={shareUrl}
            />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.9rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '20px',
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '1rem'
                }}>
                    <Swords size={14} /> COMMUNITY HYPE SHOWDOWN
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    2026 Gaming Hype Battles
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Which upcoming 2026 video games are you most hyped for? Cast your vote in the biggest head-to-head matchups and see live community consensus.
                </p>
            </div>

            {/* Battles List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px', margin: '0 auto 4rem' }}>
                {battles.map((battle, index) => {
                    const { p1, p2 } = getBattlePercentages(battle);
                    const userChoice = votes[battle.slug];
                    const hasVoted = Boolean(userChoice);

                    return (
                        <div
                            key={battle.slug}
                            className="glass"
                            style={{
                                padding: '1.75rem',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Matchup #{index + 1}
                                </span>
                                <Link
                                    to={`/compare/${battle.slug}`}
                                    style={{ fontSize: '0.8rem', color: '#06b6d4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                    <Scale size={14} /> Full Comparison &rarr;
                                </Link>
                            </div>

                            {/* Fighters Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                {/* Fighter 1 */}
                                <div style={{ textAlign: 'center' }}>
                                    <img
                                        src={battle.game1.image}
                                        alt={battle.game1.title}
                                        style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.75rem' }}
                                    />
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                                        {battle.game1.title}
                                    </h3>
                                    <button
                                        onClick={() => handleVote(battle.slug, battle.game1.slug)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: userChoice === battle.game1.slug ? '#06b6d4' : 'rgba(6, 182, 212, 0.15)',
                                            border: '1px solid #06b6d4',
                                            borderRadius: '8px',
                                            color: userChoice === battle.game1.slug ? '#0a0e17' : '#06b6d4',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            width: '100%',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {userChoice === battle.game1.slug ? '✓ Voted' : 'Vote'}
                                    </button>
                                </div>

                                {/* VS Emblem */}
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                    color: '#fff',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.85rem'
                                }}>
                                    VS
                                </div>

                                {/* Fighter 2 */}
                                <div style={{ textAlign: 'center' }}>
                                    <img
                                        src={battle.game2.image}
                                        alt={battle.game2.title}
                                        style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.75rem' }}
                                    />
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                                        {battle.game2.title}
                                    </h3>
                                    <button
                                        onClick={() => handleVote(battle.slug, battle.game2.slug)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: userChoice === battle.game2.slug ? '#f97316' : 'rgba(249, 115, 22, 0.15)',
                                            border: '1px solid #f97316',
                                            borderRadius: '8px',
                                            color: userChoice === battle.game2.slug ? '#0a0e17' : '#f97316',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            width: '100%',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {userChoice === battle.game2.slug ? '✓ Voted' : 'Vote'}
                                    </button>
                                </div>
                            </div>

                            {/* Live Percentage Bar */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                                    <span style={{ color: '#06b6d4' }}>{p1}% {battle.game1.title}</span>
                                    <span style={{ color: '#f97316' }}>{p2}% {battle.game2.title}</span>
                                </div>
                                <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', display: 'flex', overflow: 'hidden' }}>
                                    <div style={{ width: `${p1}%`, background: '#06b6d4', transition: 'width 0.5s ease' }} />
                                    <div style={{ width: `${p2}%`, background: '#f97316', transition: 'width 0.5s ease' }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HypeBattles;
