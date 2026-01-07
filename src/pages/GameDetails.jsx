import React, { useState, useMemo, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { RelatedLinks } from '../components/InternalLinks';
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
import { getCanonicalUrl, generateGameSEOTitle, generateGameSEODescription, slugify } from '../utils/seoHelpers';
import { GENRE_COLORS, PLATFORM_CONFIG } from '../utils/constants';
import HypeVoting from '../components/HypeVoting';

// Memoized Screenshot Grid for performance
const ScreenshotGrid = memo(({ screenshots, gameTitle, onOpenLightbox }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
        gap: '0.75rem'
    }}>
        {screenshots.map((url, idx) => (
            <div
                key={idx}
                onClick={() => onOpenLightbox(idx)}
                style={{
                    aspectRatio: '16/9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid rgba(255,255,255,0.1)',
                    transition: 'transform 0.2s, border-color 0.2s'
                }}
                className="glass-hover"
                role="button"
                tabIndex={0}
                aria-label={`View ${gameTitle} screenshot ${idx + 1}`}
            >
                <img
                    src={url}
                    alt={`${gameTitle} screenshot ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                />
            </div>
        ))}
    </div>
));

// Memoized Video Grid for performance
const VideoGrid = memo(({ videos, gameTitle }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
        gap: '1rem'
    }}>
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
                    title={`${gameTitle} video ${idx + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ border: 'none' }}
                />
            </div>
        ))}
    </div>
));

const GameDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isWatched, toggleWatch } = useWatchlist();
    const [imageError, setImageError] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('screenshots');

    // Find game with memoization
    const game = useMemo(() => gamesData.find(g => g.slug === slug), [slug]);

    // Calculate derived values with memoization
    const gameData = useMemo(() => {
        if (!game) return null;

        const date = parseISO(game.releaseDate);
        const formattedDate = formatReleaseDate(game.releaseDate);
        const isPlaceholder = isPlaceholderDate(game.releaseDate);
        const today = new Date();
        const daysLeft = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
        const shareUrl = getCanonicalUrl(`/game/${game.slug}`);
        const shareText = `${game.title} releases ${formattedDate}! 🎮`;

        return {
            date,
            formattedDate,
            isPlaceholder,
            daysLeft,
            shareUrl,
            shareText,
            screenshots: game.screenshots || [],
            videos: game.videos || []
        };
    }, [game]);

    // SEO data
    const seoData = useMemo(() => {
        if (!game || !gameData) return null;

        return {
            title: generateGameSEOTitle(game, gameData.formattedDate),
            description: generateGameSEODescription(game, gameData.formattedDate, gameData.daysLeft),
            breadcrumbs: [
                { name: 'Games', path: '/' },
                ...(game.genres?.[0] ? [{ name: game.genres[0], path: `/genre/${slugify(game.genres[0])}` }] : []),
                { name: game.title, path: `/game/${game.slug}` }
            ],
            faqData: [
                {
                    question: `When does ${game.title} release?`,
                    answer: `${game.title} is scheduled to release on ${gameData.formattedDate} for ${game.platforms?.join(', ') || 'multiple platforms'}.`
                },
                {
                    question: `What platforms is ${game.title} available on?`,
                    answer: `${game.title} will be available on ${game.platforms?.join(', ') || 'TBA'}.`
                },
                ...(game.developers?.length > 0 ? [{
                    question: `Who is developing ${game.title}?`,
                    answer: `${game.title} is being developed by ${game.developers.join(', ')}.`
                }] : [])
            ]
        };
    }, [game, gameData]);

    // Callbacks
    const copyLink = useCallback(() => {
        if (gameData) {
            navigator.clipboard.writeText(gameData.shareUrl);
            alert('Link copied!');
        }
    }, [gameData]);

    const openLightbox = useCallback((index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

    const nextImage = useCallback(() => {
        if (gameData) {
            setLightboxIndex((prev) => (prev + 1) % gameData.screenshots.length);
        }
    }, [gameData]);

    const prevImage = useCallback(() => {
        if (gameData) {
            setLightboxIndex((prev) => (prev - 1 + gameData.screenshots.length) % gameData.screenshots.length);
        }
    }, [gameData]);

    // Not found state
    if (!game) {
        return (
            <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
                <SEO
                    title="Game Not Found | NextPlay 2026"
                    description="This game doesn't exist in our 2026 database."
                    noIndex={true}
                />
                <h1 className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                    GAME NOT FOUND
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    This game doesn't exist in our 2026 database.
                </p>
                <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    const watched = isWatched(game.id);

    return (
        <article itemScope itemType="https://schema.org/VideoGame">
            <SEO
                title={seoData.title}
                description={seoData.description}
                image={game.image}
                url={gameData.shareUrl}
                type="article"
                gameData={game}
                breadcrumbs={seoData.breadcrumbs}
                faqData={seoData.faqData}
                publishedTime={game.releaseDate}
            />

            {/* Hero Header */}
            <header style={{ position: 'relative', minHeight: '50vh', overflow: 'hidden' }} className="hero-section">
                {/* Background Image */}
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
                        aria-hidden="true"
                    />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, background: '#0f172a' }} aria-hidden="true" />
                )}

                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, #0a0e17 0%, rgba(10,14,23,0.8) 50%, rgba(10,14,23,0.5) 100%)'
                    }}
                    aria-hidden="true"
                />

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

                    <h1
                        className="font-heading"
                        itemProp="name"
                        style={{
                            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            lineHeight: 1.1,
                            letterSpacing: '0.02em'
                        }}
                    >
                        {game.title.toUpperCase()}
                    </h1>

                    {/* Platforms as internal links */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }} itemProp="gamePlatform">
                        {game.platforms.map(p => (
                            <Link
                                key={p}
                                to={`/platform/${slugify(p)}`}
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
                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                                RELEASE DATE
                            </div>
                            <time
                                dateTime={game.releaseDate}
                                itemProp="datePublished"
                                style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Calendar size={16} color="#06b6d4" /> {gameData.formattedDate}
                            </time>
                        </div>
                        <div style={{ width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
                        <div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                                COUNTDOWN
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: gameData.daysLeft > 0 ? '#f97316' : '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {gameData.daysLeft > 0 ? `${gameData.daysLeft} DAYS` : 'RELEASED!'}
                            </div>
                        </div>
                        {game.totalRating && (
                            <>
                                <div style={{ width: '1px', height: '35px', background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                                        RATING
                                    </div>
                                    <div
                                        itemProp="aggregateRating"
                                        itemScope
                                        itemType="https://schema.org/AggregateRating"
                                        style={{ fontSize: '1.1rem', fontWeight: 700, color: '#facc15', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Star size={16} fill="#facc15" />
                                        <span itemProp="ratingValue">{Math.round(game.totalRating)}</span>/
                                        <span itemProp="bestRating">100</span>
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

                        {/* Share buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(gameData.shareText)}&url=${encodeURIComponent(gameData.shareUrl)}`}
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
            </header>

            {/* Breadcrumb Navigation */}
            <section className="container" style={{ padding: '1.5rem 1rem 0' }}>
                <Breadcrumb items={[
                    ...(game.genres?.[0] ? [{ name: game.genres[0], path: `/genre/${slugify(game.genres[0])}` }] : []),
                    { name: game.title, path: `/game/${game.slug}` }
                ]} />
            </section>

            {/* Main Content */}
            <section className="container" style={{ padding: '1rem 1rem 2rem' }}>
                {/* Description & Storyline */}
                <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#64748b', letterSpacing: '0.1em' }}>
                        ABOUT
                    </h2>
                    <p itemProp="description" style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1rem', marginBottom: game.storyline ? '1.5rem' : 0 }}>
                        {game.description || `${game.title} is an upcoming ${game.genres?.[0] || 'action'} game releasing in 2026 on ${game.platforms?.slice(0, 2).join(' and ') || 'multiple platforms'}.`}
                    </p>
                    {game.storyline && (
                        <>
                            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: '#64748b', letterSpacing: '0.1em' }}>
                                STORYLINE
                            </h3>
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
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                            GENRES
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }} itemProp="genre">
                            {game.genres && game.genres.length > 0 ? game.genres.map(g => {
                                const color = GENRE_COLORS[g] || GENRE_COLORS.default;
                                return (
                                    <Link
                                        key={g}
                                        to={`/genre/${slugify(g)}`}
                                        style={{
                                            padding: '0.4rem 0.75rem',
                                            background: `${color}22`,
                                            border: `1px solid ${color}44`,
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            color: color,
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {g}
                                    </Link>
                                );
                            }) : <span style={{ color: '#64748b' }}>TBA</span>}
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                            DEVELOPER
                        </h3>
                        <p itemProp="author" style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>
                            {game.developers && game.developers.length > 0 ? game.developers.join(', ') : 'TBA'}
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                            PUBLISHER
                        </h3>
                        <p itemProp="publisher" style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>
                            {game.publishers && game.publishers.length > 0 ? game.publishers.join(', ') : 'TBA'}
                        </p>
                    </div>

                    {game.gameModes && game.gameModes.length > 0 && (
                        <div className="glass" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={12} /> GAME MODES
                            </h3>
                            <p itemProp="playMode" style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>
                                {game.gameModes.join(', ')}
                            </p>
                        </div>
                    )}

                    {game.ageRatings && game.ageRatings.length > 0 && (
                        <div className="glass" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={12} /> AGE RATING
                            </h3>
                            <p itemProp="contentRating" style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>
                                {game.ageRatings.join(' | ')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Themes/Tags */}
                {game.themes && game.themes.length > 0 && (
                    <div className="glass" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={12} /> THEMES & TAGS
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }} itemProp="keywords">
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

                {/* Media Section */}
                {(gameData.screenshots.length > 0 || gameData.videos.length > 0) && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            {gameData.screenshots.length > 0 && (
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
                                    <ImageIcon size={16} /> Screenshots ({gameData.screenshots.length})
                                </button>
                            )}
                            {gameData.videos.length > 0 && (
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
                                    <Play size={16} /> Videos ({gameData.videos.length})
                                </button>
                            )}
                        </div>

                        {activeTab === 'screenshots' && gameData.screenshots.length > 0 && (
                            <ScreenshotGrid
                                screenshots={gameData.screenshots}
                                gameTitle={game.title}
                                onOpenLightbox={openLightbox}
                            />
                        )}

                        {activeTab === 'videos' && gameData.videos.length > 0 && (
                            <VideoGrid videos={gameData.videos} gameTitle={game.title} />
                        )}
                    </div>
                )}

                {/* Related Links - Internal Linking for SEO */}
                <RelatedLinks game={game} allGames={gamesData} />
            </section>

            {/* Lightbox */}
            {lightboxOpen && gameData.screenshots.length > 0 && (
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
                    role="dialog"
                    aria-label="Image lightbox"
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close lightbox"
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

                    {gameData.screenshots.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                aria-label="Previous image"
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
                                aria-label="Next image"
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
                        src={gameData.screenshots[lightboxIndex]}
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
                        {lightboxIndex + 1} / {gameData.screenshots.length}
                    </div>
                </div>
            )}
        </article>
    );
};

export default GameDetails;
