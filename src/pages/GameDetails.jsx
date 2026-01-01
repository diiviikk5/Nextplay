import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import {
    ArrowLeft,
    Calendar,
    Star,
    Clock,
    ExternalLink,
    Share2,
    Twitter,
    Link2,
    Zap,
    Play,
    Image as ImageIcon,
    Users,
    Shield,
    Tag,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { parseISO } from 'date-fns';
import { formatReleaseDate, isPlaceholderDate } from '../utils/dateHelpers';
import HypeVoting from '../components/HypeVoting';

const GameDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isWatched, toggleWatch } = useWatchlist();
    const [imageError, setImageError] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('screenshots'); // screenshots | videos

    const game = gamesData.find(g => g.slug === slug);

    if (!game) {
        return (
            <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
                <SEO
                    title="Game Not Found | NextPlay 2026"
                    description="This game doesn't exist in our 2026 database."
                />
                <h1 className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>GAME NOT FOUND</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>This game doesn't exist in our 2026 database.</p>
                <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>Back to Home</Link>
            </div>
        );
    }

    const date = parseISO(game.releaseDate);
    const formattedDate = formatReleaseDate(game.releaseDate);
    const isPlaceholder = isPlaceholderDate(game.releaseDate);
    const watched = isWatched(game.id);

    // Days until release
    const today = new Date();
    const daysLeft = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    // Similar games - prefer IGDB similar games, fallback to same genre
    const similarGames = game.similarGames?.length > 0
        ? game.similarGames.map(sg => {
            const found = gamesData.find(g => g.slug === sg.slug);
            return found || sg;
        }).filter(Boolean).slice(0, 4)
        : gamesData
            .filter(g => g.id !== game.id && g.genres?.some(genre => game.genres?.includes(genre)))
            .slice(0, 4);

    // Share
    const shareUrl = `https://nextplaygame.me/game/${game.slug}`;
    const shareText = `${game.title} releases ${formattedDate}! 🎮`;

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied!');
    };

    // Screenshots/Media
    const screenshots = game.screenshots || [];
    const videos = game.videos || [];

    // Lightbox navigation
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % screenshots.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    // SEO data
    const seoTitle = `${game.title} Release Date ${formattedDate} | Countdown & Info | NextPlay`;
    const seoDescription = game.description
        ? `${game.description.slice(0, 140)}... Track release countdown, platforms & more.`
        : `${game.title} releases ${formattedDate} on ${game.platforms?.slice(0, 2).join(', ') || 'multiple platforms'}. ${daysLeft} days countdown. Add to your watchlist!`;

    return (
        <div>
            <SEO
                title={seoTitle}
                description={seoDescription}
                image={game.image}
                url={shareUrl}
                type="article"
                gameData={game}
            />
            {/* Hero Header */}
            <section style={{ position: 'relative', minHeight: '50vh', overflow: 'hidden' }} className="hero-section">
                {/* Background - Real Image */}
                {!imageError && game.image ? (
                    <img
                        src={game.image}
                        alt=""
                        onError={() => setImageError(true)}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.3)'
                        }}
                    />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, background: '#0f172a' }} />
                )}

                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0e17 0%, rgba(10,14,23,0.8) 50%, rgba(10,14,23,0.5) 100%)' }} />

                {/* Content */}
                <div className="container" style={{ position: 'relative', padding: '2rem 1rem', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#94a3b8',
                            background: 'rgba(0,0,0,0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            minHeight: '44px',
                            minWidth: '44px',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        <ArrowLeft size={18} />
                        <span className="md:inline" style={{ display: 'none' }}>BACK</span>
                    </button>

                    {/* Hype Badge */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignSelf: 'flex-start',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #f97316, #facc15)',
                            borderRadius: '4px',
                            color: '#0a0e17',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            letterSpacing: '0.1em'
                        }}
                    >
                        <Zap size={14} /> {game.hype}% HYPE
                    </div>

                    <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '0.02em' }}>
                        {game.title.toUpperCase()}
                    </h1>

                    {/* Platforms */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {game.platforms.map(p => (
                            <Link
                                key={p}
                                to={`/platform/${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(6, 182, 212, 0.15)',
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: '#06b6d4',
                                    textDecoration: 'none'
                                }}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>

                    {/* Release Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>RELEASE DATE</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={16} color="#06b6d4" /> {formattedDate}
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>COUNTDOWN</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: daysLeft > 0 ? '#f97316' : '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {daysLeft > 0 ? `${daysLeft} DAYS` : 'RELEASED!'}
                            </div>
                        </div>
                        {game.totalRating && (
                            <>
                                <div style={{ width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' }} />
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>RATING</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#facc15', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Star size={16} fill="#facc15" /> {Math.round(game.totalRating)}/100
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={() => toggleWatch(game.id)}
                            className="btn-primary"
                            style={{
                                background: watched ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : undefined,
                                flex: '1 1 auto',
                                maxWidth: '220px'
                            }}
                        >
                            <Star size={18} fill={watched ? "currentColor" : "none"} style={{ marginRight: '0.5rem' }} />
                            {watched ? 'WATCHING' : 'ADD TO WATCHLIST'}
                        </button>

                        {/* Share */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Share on Twitter"
                                style={{
                                    padding: '0.875rem',
                                    background: 'rgba(29, 161, 242, 0.2)',
                                    borderRadius: '8px',
                                    color: '#1da1f2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '48px',
                                    minHeight: '48px'
                                }}
                            >
                                <Twitter size={20} />
                            </a>
                            <button
                                onClick={copyLink}
                                aria-label="Copy link"
                                style={{
                                    padding: '0.875rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#94a3b8',
                                    border: 'none',
                                    cursor: 'pointer',
                                    minWidth: '48px',
                                    minHeight: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Link2 size={20} />
                            </button>
                            <Link
                                to={`/compare?games=${game.slug}`}
                                style={{
                                    padding: '0.875rem',
                                    background: 'rgba(249, 115, 22, 0.2)',
                                    borderRadius: '8px',
                                    color: '#f97316',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '48px',
                                    minHeight: '48px',
                                    textDecoration: 'none'
                                }}
                                title="Compare with other games"
                            >
                                ⚖️
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container" style={{ padding: '2rem 1rem' }}>
                {/* Description & Storyline */}
                <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#64748b', letterSpacing: '0.1em' }}>ABOUT</h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1rem', marginBottom: game.storyline ? '1.5rem' : 0 }}>
                        {game.description || `${game.title} is an upcoming ${game.genres?.[0] || 'action'} game releasing in 2026 on ${game.platforms?.slice(0, 2).join(' and ') || 'multiple platforms'}.`}
                    </p>
                    {game.storyline && (
                        <>
                            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: '#64748b', letterSpacing: '0.1em' }}>STORYLINE</h3>
                            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem', fontStyle: 'italic' }}>
                                {game.storyline}
                            </p>
                        </>
                    )}
                </div>

                {/* Community Hype Voting */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <HypeVoting game={game} />
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div className="glass" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>GENRES</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {game.genres && game.genres.length > 0 ? game.genres.map(g => (
                                <Link
                                    key={g}
                                    to={`/genre/${g.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    style={{ padding: '0.4rem 0.75rem', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '4px', fontSize: '0.8rem', color: '#06b6d4', textDecoration: 'none' }}
                                >
                                    {g}
                                </Link>
                            )) : <span style={{ color: '#64748b' }}>TBA</span>}
                        </div>
                    </div>
                    <div className="glass" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>DEVELOPER</h3>
                        <p style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{game.developers && game.developers.length > 0 ? game.developers.join(', ') : 'TBA'}</p>
                    </div>
                    <div className="glass" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>PUBLISHER</h3>
                        <p style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{game.publishers && game.publishers.length > 0 ? game.publishers.join(', ') : 'TBA'}</p>
                    </div>
                    {game.gameModes && game.gameModes.length > 0 && (
                        <div className="glass" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={12} /> GAME MODES
                            </h3>
                            <p style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{game.gameModes.join(', ')}</p>
                        </div>
                    )}
                    {game.ageRatings && game.ageRatings.length > 0 && (
                        <div className="glass" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={12} /> AGE RATING
                            </h3>
                            <p style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{game.ageRatings.join(' | ')}</p>
                        </div>
                    )}
                </div>

                {/* Themes/Tags */}
                {game.themes && game.themes.length > 0 && (
                    <div className="glass" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={12} /> THEMES & TAGS
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {game.themes.map(theme => (
                                <span
                                    key={theme}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        background: 'rgba(249, 115, 22, 0.15)',
                                        border: '1px solid rgba(249, 115, 22, 0.3)',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: '#f97316'
                                    }}
                                >
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Media Section - Screenshots & Videos */}
                {(screenshots.length > 0 || videos.length > 0) && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            {screenshots.length > 0 && (
                                <button
                                    onClick={() => setActiveTab('screenshots')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: activeTab === 'screenshots' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: activeTab === 'screenshots' ? '#06b6d4' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <ImageIcon size={16} /> Screenshots ({screenshots.length})
                                </button>
                            )}
                            {videos.length > 0 && (
                                <button
                                    onClick={() => setActiveTab('videos')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: activeTab === 'videos' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: activeTab === 'videos' ? '#06b6d4' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Play size={16} /> Videos ({videos.length})
                                </button>
                            )}
                        </div>

                        {activeTab === 'screenshots' && screenshots.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: '0.75rem' }}>
                                {screenshots.map((url, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => openLightbox(idx)}
                                        style={{
                                            aspectRatio: '16/9',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: '2px solid rgba(255,255,255,0.1)',
                                            transition: 'transform 0.2s, border-color 0.2s'
                                        }}
                                        className="glass-hover"
                                    >
                                        <img
                                            src={url}
                                            alt={`${game.title} screenshot ${idx + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'videos' && videos.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))', gap: '1rem' }}>
                                {videos.map((videoId, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            aspectRatio: '16/9',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '2px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={`${game.title} video ${idx + 1}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ border: 'none' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Similar Games */}
                {similarGames.length > 0 && (
                    <div>
                        <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#64748b', letterSpacing: '0.1em' }}>YOU MIGHT ALSO LIKE</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: '0.75rem' }}>
                            {similarGames.map(sg => (
                                <Link
                                    key={sg.id || sg.slug}
                                    to={`/game/${sg.slug}`}
                                    className="glass glass-hover"
                                    style={{ padding: '0.75rem', textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'center' }}
                                >
                                    <div
                                        style={{
                                            width: '70px',
                                            height: '70px',
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
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700 }}>
                                                {(sg.title || sg.name || '?')[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h4 className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.02em' }}>
                                            {(sg.title || sg.name || 'Unknown').toUpperCase()}
                                        </h4>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>{sg.genres?.[0] || 'Game'}</p>
                                        {sg.hype && <p style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.25rem', fontWeight: 600 }}>{sg.hype}% Hype</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Lightbox */}
            {lightboxOpen && screenshots.length > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#fff'
                        }}
                    >
                        <X size={24} />
                    </button>

                    {screenshots.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff'
                                }}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff'
                                }}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    <img
                        src={screenshots[lightboxIndex]}
                        alt={`${game.title} screenshot ${lightboxIndex + 1}`}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            borderRadius: '8px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        color: '#94a3b8',
                        fontSize: '0.875rem'
                    }}>
                        {lightboxIndex + 1} / {screenshots.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameDetails;
