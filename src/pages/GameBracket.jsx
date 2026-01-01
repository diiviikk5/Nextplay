import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Trophy, Swords, RefreshCw, Share2, Twitter, Link2, ChevronRight, Crown, Zap } from 'lucide-react';

const STORAGE_KEY = 'nextplay_bracket_votes';
const ROUND_NAMES = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final', 'Champion'];

/**
 * Generate seeded bracket from top games by hype
 */
const generateBracket = (games, size = 16) => {
    const sorted = [...games].sort((a, b) => b.hype - a.hype).slice(0, size);
    // Seed matchups: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
    const seeds = [0, 15, 7, 8, 4, 11, 3, 12, 5, 10, 2, 13, 6, 9, 1, 14];
    return seeds.map(i => sorted[i]).filter(Boolean);
};

const GameBracket = () => {
    const [votes, setVotes] = useState({});
    const [copied, setCopied] = useState(false);

    // Load votes from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setVotes(JSON.parse(saved));
        } catch { }
    }, []);

    // Save votes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    }, [votes]);

    // Initial bracket of 16 games
    const initialBracket = useMemo(() => generateBracket(gamesData, 16), []);

    // Calculate rounds based on votes
    const rounds = useMemo(() => {
        const result = [initialBracket];
        let currentRound = initialBracket;
        let roundIdx = 0;

        while (currentRound.length > 1) {
            const nextRound = [];
            for (let i = 0; i < currentRound.length; i += 2) {
                const game1 = currentRound[i];
                const game2 = currentRound[i + 1];

                if (!game1 || !game2) {
                    nextRound.push(game1 || game2);
                    continue;
                }

                const matchKey = `${roundIdx}-${i / 2}`;
                const winner = votes[matchKey];

                if (winner === game1?.id) {
                    nextRound.push(game1);
                } else if (winner === game2?.id) {
                    nextRound.push(game2);
                } else {
                    nextRound.push(null); // No winner yet
                }
            }
            result.push(nextRound);
            currentRound = nextRound;
            roundIdx++;
        }

        return result;
    }, [initialBracket, votes]);

    const vote = (roundIdx, matchIdx, gameId) => {
        const matchKey = `${roundIdx}-${matchIdx}`;
        setVotes(prev => {
            // If clicking same game, remove vote
            if (prev[matchKey] === gameId) {
                const { [matchKey]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [matchKey]: gameId };
        });
    };

    const resetBracket = () => {
        setVotes({});
    };

    const champion = rounds[rounds.length - 1]?.[0];
    const isComplete = champion !== null && champion !== undefined;

    // Share functionality
    const getShareText = () => {
        if (!isComplete) return "I'm filling out my 2026 Game Bracket! 🎮";
        return `My champion for 2026: ${champion.title}! 🏆 Create your bracket:`;
    };

    const shareUrl = 'https://nextplaygame.me/bracket';

    const copyLink = () => {
        navigator.clipboard.writeText(`${getShareText()} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="2026 Game Bracket Tournament | Vote Your Champion | NextPlay"
                description="Vote head-to-head on the most anticipated 2026 games! Pick your champion in our March Madness style bracket tournament. GTA 6 vs Crimson Desert and more!"
                url="https://nextplaygame.me/bracket"
            />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #f97316, #facc15)',
                        borderRadius: '4px',
                        color: '#0a0e17',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <Trophy size={14} /> GAME BRACKET
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    2026 GAME TOURNAMENT
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                    Vote on each matchup to crown your 2026 champion! Top 16 games by hype.
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={resetBracket} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={16} /> Reset
                </button>
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Twitter size={16} /> Share
                </a>
                <button onClick={copyLink} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link2 size={16} /> {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            {/* Champion display */}
            {isComplete && (
                <div
                    className="glass"
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(250, 204, 21, 0.1))',
                        border: '2px solid rgba(249, 115, 22, 0.3)'
                    }}
                >
                    <Crown size={40} color="#facc15" style={{ marginBottom: '1rem' }} />
                    <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#facc15', marginBottom: '0.5rem' }}>
                        YOUR 2026 CHAMPION
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <img
                            src={champion.image}
                            alt={champion.title}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '3px solid #facc15' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                            <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{champion.title}</h3>
                            <p style={{ color: '#f97316', fontSize: '0.85rem' }}>{champion.hype}% Hype</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bracket Display - Horizontal Scroll on Mobile */}
            <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    minWidth: 'max-content',
                    alignItems: 'flex-start'
                }}>
                    {rounds.map((round, roundIdx) => (
                        <div key={roundIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {/* Round header */}
                            <div style={{
                                textAlign: 'center',
                                padding: '0.5rem',
                                background: roundIdx === rounds.length - 1 ? 'linear-gradient(135deg, #f97316, #facc15)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                color: roundIdx === rounds.length - 1 ? '#0a0e17' : '#64748b',
                                marginBottom: '0.5rem'
                            }}>
                                {ROUND_NAMES[roundIdx] || `Round ${roundIdx + 1}`}
                            </div>

                            {/* Matchups */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                justifyContent: 'space-around',
                                minHeight: roundIdx === 0 ? 'auto' : `${(rounds[0].length / 2) * (80 + 16)}px`
                            }}>
                                {Array.from({ length: round.length / 2 }).map((_, matchIdx) => {
                                    const game1 = round[matchIdx * 2];
                                    const game2 = round[matchIdx * 2 + 1];
                                    const matchKey = `${roundIdx}-${matchIdx}`;
                                    const currentVote = votes[matchKey];

                                    // For single game (champion) display
                                    if (round.length === 1) {
                                        const game = round[0];
                                        return game ? (
                                            <div
                                                key="champion"
                                                className="glass"
                                                style={{
                                                    padding: '0.75rem',
                                                    width: '150px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(249, 115, 22, 0.2))',
                                                    border: '2px solid #facc15'
                                                }}
                                            >
                                                <img src={game.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {game.title}
                                                    </div>
                                                    <Trophy size={12} color="#facc15" />
                                                </div>
                                            </div>
                                        ) : null;
                                    }

                                    return (
                                        <div
                                            key={matchIdx}
                                            className="glass"
                                            style={{
                                                padding: '0.5rem',
                                                width: '160px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            {[game1, game2].map((game, idx) => {
                                                if (!game) {
                                                    return (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                padding: '0.5rem',
                                                                background: 'rgba(255,255,255,0.02)',
                                                                borderRadius: '4px',
                                                                height: '50px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#475569',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            TBD
                                                        </div>
                                                    );
                                                }

                                                const isSelected = currentVote === game.id;
                                                const otherSelected = currentVote && currentVote !== game.id;

                                                return (
                                                    <button
                                                        key={game.id}
                                                        onClick={() => vote(roundIdx, matchIdx, game.id)}
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: isSelected
                                                                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(6, 182, 212, 0.1))'
                                                                : 'rgba(255,255,255,0.02)',
                                                            border: isSelected ? '2px solid #06b6d4' : '2px solid transparent',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            opacity: otherSelected ? 0.5 : 1,
                                                            transition: 'all 0.2s',
                                                            textAlign: 'left',
                                                            color: '#fff'
                                                        }}
                                                    >
                                                        <img
                                                            src={game.image}
                                                            alt=""
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                borderRadius: '4px',
                                                                objectFit: 'cover',
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                        <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                                                            <div style={{
                                                                fontSize: '0.7rem',
                                                                fontWeight: 600,
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}>
                                                                {game.title}
                                                            </div>
                                                            <div style={{ fontSize: '0.6rem', color: '#f97316' }}>
                                                                {game.hype}%
                                                            </div>
                                                        </div>
                                                        {isSelected && <Zap size={12} color="#06b6d4" />}
                                                    </button>
                                                );
                                            })}

                                            {/* VS indicator */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                background: '#0a0e17',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'none', // Hidden for cleaner look
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.5rem',
                                                color: '#64748b',
                                                fontWeight: 700
                                            }}>
                                                VS
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="glass" style={{ padding: '1.5rem', marginTop: '2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
                    How It Works
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Click games to vote in each matchup. Winners advance to the next round.
                    Complete all rounds to crown your 2026 champion!
                </p>
            </div>
        </div>
    );
};

export default GameBracket;
