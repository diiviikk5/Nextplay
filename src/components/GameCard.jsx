import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, ArrowRight, Clock, Zap } from 'lucide-react';
import { parseISO } from 'date-fns';
import { formatCardDate, isPlaceholderDate } from '../utils/dateHelpers';

const GameCard = ({ game, isWatched, onToggleWatch, rank }) => {
    const [imageError, setImageError] = useState(false);
    const date = parseISO(game.releaseDate);
    const formattedDate = formatCardDate(game.releaseDate);
    const isPlaceholder = isPlaceholderDate(game.releaseDate);

    // Calculate days until release from Dec 29, 2025
    const today = new Date('2025-12-29');
    const daysLeft = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="glass glass-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Image Area */}
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                {!imageError && game.image ? (
                    <img
                        src={game.image}
                        alt={game.title}
                        onError={() => setImageError(true)}
                        loading="lazy"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ fontSize: '3rem', fontWeight: 700, color: '#475569' }}>
                            {game.title.charAt(0)}
                        </span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(10, 14, 23, 0.95) 0%, rgba(10, 14, 23, 0.3) 50%, transparent 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Rank Badge (if provided) */}
                {rank && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: rank === 1 ? 'linear-gradient(135deg, #f97316, #facc15)' : 'rgba(0,0,0,0.7)',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: rank === 1 ? '#0a0e17' : '#fff'
                        }}
                    >
                        #{rank}
                    </div>
                )}

                {/* Watch Button - 44px minimum touch target */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleWatch(game.id);
                    }}
                    aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '10px',
                        borderRadius: '8px',
                        background: isWatched ? '#06b6d4' : 'rgba(0,0,0,0.6)',
                        color: isWatched ? '#0a0e17' : '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        WebkitTapHighlightColor: 'transparent'
                    }}
                >
                    <Star size={18} fill={isWatched ? "currentColor" : "none"} />
                </button>

                {/* Days countdown */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.8)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#f97316'
                    }}
                >
                    <Clock size={12} /> {daysLeft}d
                </div>

                {/* Genre */}
                {game.genres && game.genres[0] && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            background: 'rgba(6, 182, 212, 0.2)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            color: '#06b6d4',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {game.genres[0]}
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                    className="font-heading"
                    style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginBottom: '0.75rem',
                        lineHeight: 1.3,
                        letterSpacing: '0.02em'
                    }}
                >
                    {game.title.toUpperCase()}
                </h3>

                {/* Platforms */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {game.platforms.slice(0, 3).map(p => (
                        <span
                            key={p}
                            style={{
                                fontSize: '0.65rem',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#94a3b8',
                                fontWeight: 500
                            }}
                        >
                            {p}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div
                    style={{
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                    </div>
                    <Link
                        to={`/game/${game.slug}`}
                        style={{
                            color: '#06b6d4',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '0.5rem 0',
                            minHeight: '44px',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        Details <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
