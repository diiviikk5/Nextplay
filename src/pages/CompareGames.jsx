import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { useWatchlist } from '../hooks/useWatchlist';
import { Scale, Plus, X, Share2, Twitter, Link2, Search, Check, Clock, Calendar, Gamepad2 } from 'lucide-react';

const CompareGames = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Get game slugs from URL
    const initialSlugs = searchParams.get('games')?.split(',').filter(Boolean) || [];
    const [selectedSlugs, setSelectedSlugs] = useState(initialSlugs);
    const [showPicker, setShowPicker] = useState(false);
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);

    const selectedGames = useMemo(() => {
        return selectedSlugs.map(slug => gamesData.find(g => g.slug === slug)).filter(Boolean);
    }, [selectedSlugs]);

    const updateURL = (slugs) => {
        if (slugs.length > 0) {
            setSearchParams({ games: slugs.join(',') });
        } else {
            setSearchParams({});
        }
    };

    const addGame = (game) => {
        if (selectedSlugs.length < 4 && !selectedSlugs.includes(game.slug)) {
            const newSlugs = [...selectedSlugs, game.slug];
            setSelectedSlugs(newSlugs);
            updateURL(newSlugs);
        }
        setShowPicker(false);
        setSearch('');
    };

    const removeGame = (slug) => {
        const newSlugs = selectedSlugs.filter(s => s !== slug);
        setSelectedSlugs(newSlugs);
        updateURL(newSlugs);
    };

    const shareUrl = `https://nextplaygame.me/compare?games=${selectedSlugs.join(',')}`;
    const shareText = selectedGames.length > 0
        ? `Comparing ${selectedGames.map(g => g.title).join(' vs ')} - Which 2026 game are you most hyped for? 🎮`
        : 'Compare 2026 video games side-by-side!';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredGames = gamesData.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) &&
        !selectedSlugs.includes(g.slug)
    );

    // Comparison fields
    const fields = [
        { key: 'releaseDate', label: 'Release Date', format: (v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
        { key: 'hype', label: 'Hype Score', format: (v) => `${v}%` },
        { key: 'platforms', label: 'Platforms', format: (v) => v?.join(', ') || 'TBA' },
        { key: 'genres', label: 'Genres', format: (v) => v?.join(', ') || 'TBA' },
        { key: 'developers', label: 'Developer', format: (v) => v?.join(', ') || 'TBA' },
        { key: 'publishers', label: 'Publisher', format: (v) => v?.join(', ') || 'TBA' },
        { key: 'gameModes', label: 'Game Modes', format: (v) => v?.length ? v.join(', ') : 'TBA' },
        { key: 'themes', label: 'Themes', format: (v) => v?.slice(0, 3).join(', ') || 'TBA' },
    ];

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={selectedGames.length > 1
                    ? `${selectedGames.map(g => g.title).join(' vs ')} | Game Comparison | NextPlay`
                    : "Compare 2026 Games Side-by-Side | NextPlay"
                }
                description={selectedGames.length > 1
                    ? `Compare ${selectedGames.map(g => g.title).join(', ')} - release dates, platforms, genres and more side-by-side.`
                    : "Compare upcoming 2026 video games side-by-side. See release dates, platforms, genres, and hype scores for up to 4 games."
                }
                url={shareUrl}
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
                    <Scale size={14} /> COMPARE GAMES
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {selectedGames.length > 1
                        ? selectedGames.map(g => g.title).join(' VS ')
                        : 'COMPARE 2026 GAMES'
                    }
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                    Select up to 4 games to compare side-by-side
                </p>
            </div>

            {/* Share buttons */}
            {selectedGames.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Twitter size={16} /> Share
                    </a>
                    <button onClick={copyToClipboard} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link2 size={16} /> {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            )}

            {/* Game Selection Bar */}
            <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {selectedGames.map(game => (
                    <div
                        key={game.slug}
                        className="glass"
                        style={{
                            padding: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            minWidth: '180px',
                            maxWidth: '220px'
                        }}
                    >
                        <img
                            src={game.image}
                            alt={game.title}
                            style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {game.title}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#f97316' }}>{game.hype}% Hype</div>
                        </div>
                        <button
                            onClick={() => removeGame(game.slug)}
                            style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#ef4444',
                                flexShrink: 0
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {/* Add button */}
                {selectedSlugs.length < 4 && (
                    <button
                        onClick={() => setShowPicker(true)}
                        className="glass glass-hover"
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: '2px dashed rgba(255,255,255,0.2)',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#94a3b8',
                            minWidth: '150px',
                            justifyContent: 'center'
                        }}
                    >
                        <Plus size={18} /> Add Game
                    </button>
                )}
            </div>

            {/* Comparison Table */}
            {selectedGames.length > 1 && (
                <div className="glass" style={{ overflow: 'auto', marginBottom: '2rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                                    ATTRIBUTE
                                </th>
                                {selectedGames.map(game => (
                                    <th key={game.slug} style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Link to={`/game/${game.slug}`} style={{ textDecoration: 'none' }}>
                                            <img
                                                src={game.image}
                                                alt={game.title}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
                                            />
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{game.title}</div>
                                        </Link>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map(field => {
                                // Find the "best" value for highlighting
                                const values = selectedGames.map(g => g[field.key]);
                                let bestIndex = -1;
                                if (field.key === 'hype') {
                                    const max = Math.max(...values.filter(v => typeof v === 'number'));
                                    bestIndex = values.indexOf(max);
                                } else if (field.key === 'releaseDate') {
                                    // Earliest release wins
                                    const dates = values.map(v => new Date(v).getTime());
                                    const min = Math.min(...dates);
                                    bestIndex = dates.indexOf(min);
                                }

                                return (
                                    <tr key={field.key}>
                                        <td style={{
                                            padding: '1rem',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            color: '#94a3b8',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                        }}>
                                            {field.label}
                                        </td>
                                        {selectedGames.map((game, idx) => (
                                            <td
                                                key={game.slug}
                                                style={{
                                                    padding: '1rem',
                                                    textAlign: 'center',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    fontSize: '0.85rem',
                                                    color: idx === bestIndex ? '#06b6d4' : '#e2e8f0',
                                                    fontWeight: idx === bestIndex ? 600 : 400
                                                }}
                                            >
                                                {field.format(game[field.key])}
                                                {idx === bestIndex && field.key === 'hype' && (
                                                    <span style={{ marginLeft: '0.25rem', color: '#22c55e' }}>★</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            {/* Watchlist row */}
                            <tr>
                                <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                                    In Your Watchlist
                                </td>
                                {selectedGames.map(game => (
                                    <td key={game.slug} style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <button
                                            onClick={() => toggleWatch(game.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: isWatched(game.id) ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: isWatched(game.id) ? '#06b6d4' : '#94a3b8',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            {isWatched(game.id) ? '★ Watching' : '☆ Add'}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty State */}
            {selectedGames.length < 2 && (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Gamepad2 size={48} style={{ color: '#475569', marginBottom: '1rem' }} />
                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                        Select at least 2 games to compare them side-by-side
                    </p>
                    <button
                        onClick={() => setShowPicker(true)}
                        className="btn-primary"
                    >
                        <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Games
                    </button>
                </div>
            )}

            {/* Game Picker Modal */}
            {showPicker && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                    }}
                    onClick={() => setShowPicker(false)}
                >
                    <div
                        className="glass"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '85vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '20px 20px 0 0'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700 }}>SELECT A GAME</h2>
                                <button
                                    onClick={() => setShowPicker(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        minWidth: '44px',
                                        minHeight: '44px'
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="text"
                                    placeholder="Search games..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 2.75rem',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        color: '#fff',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0.5rem' }}>
                            {filteredGames.slice(0, 30).map(game => (
                                <button
                                    key={game.id}
                                    onClick={() => addGame(game)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.875rem',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: '#fff'
                                    }}
                                >
                                    <img
                                        src={game.image}
                                        alt=""
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{game.title}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                            {game.platforms?.slice(0, 2).join(' • ')} • {game.hype}% Hype
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompareGames;
