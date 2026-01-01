import React from 'react';
import { ThumbsUp, ThumbsDown, TrendingUp, Flame } from 'lucide-react';
import { useHype } from '../context/HypeContext';

/**
 * HypeVoting Component - Community-driven hype voting
 * Uses global HypeContext for persistent voting across the app
 */
const HypeVoting = ({ game, compact = false }) => {
    const { getHype, vote } = useHype();
    const hype = getHype(game.id);

    const handleVote = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        vote(game.id, direction);
    };

    // Determine color based on percentage
    const getColor = () => {
        if (hype.percentage >= 70) return '#22c55e'; // Green - hot
        if (hype.percentage >= 50) return '#06b6d4'; // Cyan - normal
        if (hype.percentage >= 30) return '#f97316'; // Orange - lukewarm
        return '#ef4444'; // Red - cold
    };

    const color = getColor();

    if (compact) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    onClick={(e) => handleVote(e, 1)}
                    style={{
                        padding: '0.4rem',
                        background: hype.userVote === 1 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.05)',
                        border: hype.userVote === 1 ? '1px solid #22c55e' : '1px solid transparent',
                        borderRadius: '4px',
                        color: hype.userVote === 1 ? '#22c55e' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    title="Hype it!"
                >
                    <ThumbsUp size={14} fill={hype.userVote === 1 ? 'currentColor' : 'none'} />
                </button>
                <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color,
                    minWidth: '35px',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                }}>
                    {hype.percentage}%
                </span>
                <button
                    onClick={(e) => handleVote(e, -1)}
                    style={{
                        padding: '0.4rem',
                        background: hype.userVote === -1 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)',
                        border: hype.userVote === -1 ? '1px solid #ef4444' : '1px solid transparent',
                        borderRadius: '4px',
                        color: hype.userVote === -1 ? '#ef4444' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    title="Not hyped"
                >
                    <ThumbsDown size={14} fill={hype.userVote === -1 ? 'currentColor' : 'none'} />
                </button>
            </div>
        );
    }

    return (
        <div
            className="glass"
            style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Circular Progress */}
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: `conic-gradient(${color} ${hype.percentage}%, rgba(255,255,255,0.1) 0)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.5s ease'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#0a0e17',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {hype.percentage >= 70 ? (
                            <Flame size={18} color={color} />
                        ) : (
                            <TrendingUp size={18} color={color} />
                        )}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                        COMMUNITY HYPE
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color }}>
                            {hype.percentage}%
                        </span>
                        {hype.totalVotes > 0 && (
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                ({hype.totalVotes} vote{hype.totalVotes !== 1 ? 's' : ''})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={(e) => handleVote(e, 1)}
                    style={{
                        padding: '0.75rem 1.25rem',
                        background: hype.userVote === 1 ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(34, 197, 94, 0.15)',
                        border: `2px solid ${hype.userVote === 1 ? '#22c55e' : 'rgba(34, 197, 94, 0.3)'}`,
                        borderRadius: '8px',
                        color: hype.userVote === 1 ? '#fff' : '#22c55e',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                        minWidth: '44px',
                        minHeight: '44px'
                    }}
                >
                    <ThumbsUp size={18} fill={hype.userVote === 1 ? 'white' : 'none'} />
                    <span className="hidden md:inline">Hyped!</span>
                    {hype.upvotes > 0 && <span style={{ opacity: 0.8 }}>{hype.upvotes}</span>}
                </button>
                <button
                    onClick={(e) => handleVote(e, -1)}
                    style={{
                        padding: '0.75rem 1.25rem',
                        background: hype.userVote === -1 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(239, 68, 68, 0.15)',
                        border: `2px solid ${hype.userVote === -1 ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: '8px',
                        color: hype.userVote === -1 ? '#fff' : '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                        minWidth: '44px',
                        minHeight: '44px'
                    }}
                >
                    <ThumbsDown size={18} fill={hype.userVote === -1 ? 'white' : 'none'} />
                    <span className="hidden md:inline">Meh</span>
                    {hype.downvotes > 0 && <span style={{ opacity: 0.8 }}>{hype.downvotes}</span>}
                </button>
            </div>
        </div>
    );
};

export default HypeVoting;
