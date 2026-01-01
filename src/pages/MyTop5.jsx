import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Trophy, Share2, Twitter, Link2, X, Plus, ArrowUp, ArrowDown, Download, Sparkles } from 'lucide-react';

const MyTop5 = () => {
    const [top5, setTop5] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('nextplay_top5');
        if (saved) {
            try {
                const ids = JSON.parse(saved);
                const games = ids.map(id => gamesData.find(g => g.id === id)).filter(Boolean);
                setTop5(games);
            } catch { }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('nextplay_top5', JSON.stringify(top5.map(g => g.id)));
    }, [top5]);

    const addGame = (game) => {
        if (top5.length < 5 && !top5.find(g => g.id === game.id)) {
            setTop5([...top5, game]);
        }
        setShowPicker(false);
        setSearch('');
    };

    const removeGame = (id) => {
        setTop5(top5.filter(g => g.id !== id));
    };

    const moveUp = (index) => {
        if (index === 0) return;
        const newList = [...top5];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        setTop5(newList);
    };

    const moveDown = (index) => {
        if (index === top5.length - 1) return;
        const newList = [...top5];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
        setTop5(newList);
    };

    // Generate shareable text with URL
    const generateShareText = () => {
        if (top5.length === 0) return '';
        let text = '🎮 My Top 5 Most Anticipated 2026 Games:\n\n';
        top5.forEach((g, i) => {
            text += `${i + 1}. ${g.title}\n`;
        });
        text += '\n🎯 Create your list: nextplaygame.me/my-top-5';
        return text;
    };

    const shareUrl = 'https://nextplaygame.me/my-top-5';
    const shareText = generateShareText();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredGames = gamesData.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) &&
        !top5.find(t => t.id === g.id)
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="My Top 5 Anticipated 2026 Games | Create & Share | NextPlay"
                description="Pick your top 5 most anticipated 2026 video games and share your ranking with friends! GTA 6, Crimson Desert, RE9 & more."
                url="https://nextplaygame.me/my-top-5"
            />
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                    <Trophy size={14} /> CREATE & SHARE
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.02em' }}>
                    MY TOP 5 ANTICIPATED
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                    Pick your 5 most anticipated 2026 games and share your list with friends!
                </p>
            </div>

            {/* Top 5 List */}
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {[0, 1, 2, 3, 4].map((slot) => {
                    const game = top5[slot];
                    return (
                        <div
                            key={slot}
                            className="glass"
                            style={{
                                marginBottom: '0.75rem',
                                padding: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                border: game ? '1px solid rgba(6, 182, 212, 0.2)' : '2px dashed rgba(255,255,255,0.1)',
                                flexWrap: 'nowrap'
                            }}
                        >
                            {/* Rank */}
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    background: slot === 0 ? 'linear-gradient(135deg, #f97316, #facc15)' :
                                        slot === 1 ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)' :
                                            slot === 2 ? 'linear-gradient(135deg, #b45309, #d97706)' : 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: 800,
                                    color: slot < 3 ? '#0a0e17' : '#64748b',
                                    flexShrink: 0
                                }}
                            >
                                #{slot + 1}
                            </div>

                            {game ? (
                                <>
                                    {/* Game Image */}
                                    <div
                                        style={{
                                            width: '60px',
                                            height: '36px',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src={game.image}
                                            alt={game.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Game Info */}
                                    <div style={{ flexGrow: 1, overflow: 'hidden', minWidth: 0 }}>
                                        <h3 className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {game.title.toUpperCase()}
                                        </h3>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.platforms.slice(0, 2).join(' • ')}</p>
                                    </div>

                                    {/* Controls */}
                                    <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                                        <button
                                            onClick={() => moveUp(slot)}
                                            disabled={slot === 0}
                                            aria-label="Move up"
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                color: slot === 0 ? '#334155' : '#94a3b8',
                                                minWidth: '40px',
                                                minHeight: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveDown(slot)}
                                            disabled={slot === top5.length - 1}
                                            aria-label="Move down"
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                color: slot === top5.length - 1 ? '#334155' : '#94a3b8',
                                                minWidth: '40px',
                                                minHeight: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                        <button
                                            onClick={() => removeGame(game.id)}
                                            aria-label="Remove game"
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                color: '#ef4444',
                                                minWidth: '40px',
                                                minHeight: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowPicker(true)}
                                    style={{
                                        flexGrow: 1,
                                        padding: '0.875rem',
                                        background: 'none',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        minHeight: '44px'
                                    }}
                                >
                                    <Plus size={18} /> Add a game
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Share Section */}
            {top5.length > 0 && (
                <div style={{ maxWidth: '700px', margin: '2rem auto 0', textAlign: 'center' }}>
                    <h3 className="font-heading" style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.1em' }}>SHARE YOUR LIST</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Twitter size={18} /> Share on X
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Link2 size={18} /> {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    </div>

                    {/* Preview */}
                    <div
                        className="glass"
                        style={{ marginTop: '2rem', padding: '1.5rem', textAlign: 'left', whiteSpace: 'pre-line', fontSize: '0.9rem', color: '#cbd5e1' }}
                    >
                        {shareText}
                    </div>
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
                        justifyContent: 'center',
                        padding: '0'
                    }}
                    onClick={() => setShowPicker(false)}
                >
                    <div
                        className="glass modal-scroll"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '85vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '20px 20px 0 0',
                            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700 }}>SELECT A GAME</h2>
                                <button
                                    onClick={() => setShowPicker(false)}
                                    aria-label="Close"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        minWidth: '44px',
                                        minHeight: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ flexGrow: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0.5rem' }}>
                            {filteredGames.slice(0, 20).map(game => (
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
                                        color: '#fff',
                                        minHeight: '60px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <img
                                        src={game.image}
                                        alt=""
                                        style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                                    />
                                    <div style={{ overflow: 'hidden', minWidth: 0 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.title}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.platforms.slice(0, 2).join(' • ')}</div>
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

export default MyTop5;
