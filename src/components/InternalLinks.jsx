import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Monitor, Gamepad2 } from 'lucide-react';
import { slugify } from '../utils/seoHelpers';
import { GENRE_COLORS, PLATFORM_CONFIG } from '../utils/constants';

/**
 * RelatedLinks Component - Displays internal links for SEO
 * Shows related genres, platforms, and similar games
 */
export const RelatedLinks = ({ game, allGames = [] }) => {
    if (!game) return null;

    // Get similar games
    const getSimilarGames = () => {
        if (game.similarGames?.length > 0) {
            return game.similarGames.slice(0, 4).map(sg => {
                const found = allGames.find(g => g.slug === sg.slug);
                return found || sg;
            }).filter(Boolean);
        }

        // Fallback to same genre
        return allGames
            .filter(g => g.id !== game.id && g.genres?.some(genre => game.genres?.includes(genre)))
            .slice(0, 4);
    };

    const similarGames = getSimilarGames();

    return (
        <aside className="related-links" style={{ marginTop: '2rem' }}>
            {/* Related Genres */}
            {game.genres?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4
                        style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginBottom: '0.75rem',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Tag size={12} /> EXPLORE GENRES
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {game.genres.map(genre => {
                            const color = GENRE_COLORS[genre] || GENRE_COLORS.default;
                            return (
                                <Link
                                    key={genre}
                                    to={`/genre/${slugify(genre)}`}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: `${color}22`,
                                        border: `1px solid ${color}44`,
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: color,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {genre}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Related Platforms */}
            {game.platforms?.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4
                        style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginBottom: '0.75rem',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Monitor size={12} /> MORE ON THESE PLATFORMS
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {game.platforms.slice(0, 4).map(platform => {
                            const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;
                            return (
                                <Link
                                    key={platform}
                                    to={`/platform/${slugify(platform)}`}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: `${config.color}22`,
                                        border: `1px solid ${config.color}44`,
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: config.color,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {config.icon} {config.shortName || platform}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Similar Games */}
            {similarGames.length > 0 && (
                <div>
                    <h4
                        style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginBottom: '0.75rem',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Gamepad2 size={12} /> YOU MIGHT ALSO LIKE
                    </h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                        gap: '0.75rem'
                    }}>
                        {similarGames.map(sg => (
                            <Link
                                key={sg.id || sg.slug}
                                to={`/game/${sg.slug}`}
                                className="glass glass-hover"
                                style={{
                                    padding: '0.75rem',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    gap: '0.75rem',
                                    alignItems: 'center'
                                }}
                            >
                                <div
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        background: '#1e293b'
                                    }}
                                >
                                    {(sg.image || sg.cover) ? (
                                        <img
                                            src={sg.image || sg.cover}
                                            alt={sg.title || sg.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#475569',
                                            fontWeight: 700
                                        }}>
                                            {(sg.title || sg.name || '?')[0]}
                                        </div>
                                    )}
                                </div>
                                <div style={{ overflow: 'hidden', flex: 1 }}>
                                    <h5
                                        className="font-heading"
                                        style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            marginBottom: '0.25rem',
                                            color: '#fff'
                                        }}
                                    >
                                        {(sg.title || sg.name || 'Unknown').toUpperCase()}
                                    </h5>
                                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                        {sg.genres?.[0] || 'Game'}
                                    </p>
                                    {sg.hype && (
                                        <p style={{ fontSize: '0.7rem', color: '#f97316', fontWeight: 600 }}>
                                            {sg.hype}% Hype
                                        </p>
                                    )}
                                </div>
                                <ArrowRight size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

/**
 * QuickLinks Component - Shows quick navigation links
 */
export const QuickLinks = ({ currentPage }) => {
    const links = [
        { name: 'All Games', path: '/', icon: '🎮' },
        { name: 'Tier List', path: '/tier-list', icon: '👑' },
        { name: 'Calendar', path: '/calendar', icon: '📅' },
        { name: 'Genres', path: '/genre', icon: '🏷️' },
        { name: 'Platforms', path: '/platform', icon: '💻' },
        { name: 'Compare', path: '/compare', icon: '⚖️' },
        { name: 'My Top 5', path: '/my-top-5', icon: '🏆' },
        { name: 'Watchlist', path: '/watchlist', icon: '⭐' }
    ].filter(link => link.path !== currentPage);

    return (
        <nav aria-label="Quick links" style={{ marginTop: '2rem' }}>
            <h4
                style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.1em'
                }}
            >
                EXPLORE MORE
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {links.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#94a3b8',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{link.icon}</span>
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default RelatedLinks;
