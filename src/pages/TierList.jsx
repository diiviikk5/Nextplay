import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { Crown, Share2, Twitter, Link2, X, Plus, GripVertical, Download, Trash2, RotateCcw } from 'lucide-react';
import { getCanonicalUrl } from '../utils/seoHelpers';

const TIER_CONFIG = [
    { tier: 'S', label: 'S Tier', color: '#ff7f7f', bg: 'rgba(255, 127, 127, 0.15)', border: 'rgba(255, 127, 127, 0.4)' },
    { tier: 'A', label: 'A Tier', color: '#ffbf7f', bg: 'rgba(255, 191, 127, 0.15)', border: 'rgba(255, 191, 127, 0.4)' },
    { tier: 'B', label: 'B Tier', color: '#ffff7f', bg: 'rgba(255, 255, 127, 0.15)', border: 'rgba(255, 255, 127, 0.4)' },
    { tier: 'C', label: 'C Tier', color: '#7fff7f', bg: 'rgba(127, 255, 127, 0.15)', border: 'rgba(127, 255, 127, 0.4)' },
    { tier: 'D', label: 'D Tier', color: '#7fbfff', bg: 'rgba(127, 191, 255, 0.15)', border: 'rgba(127, 191, 255, 0.4)' },
    { tier: 'F', label: 'F Tier', color: '#ff7fbf', bg: 'rgba(255, 127, 191, 0.15)', border: 'rgba(255, 127, 191, 0.4)' },
];

const TierList = () => {
    const [tiers, setTiers] = useState({
        S: [], A: [], B: [], C: [], D: [], F: []
    });
    const [showPicker, setShowPicker] = useState(false);
    const [activeTier, setActiveTier] = useState(null);
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(false);
    const [draggedGame, setDraggedGame] = useState(null);
    const [dragOverTier, setDragOverTier] = useState(null);
    const tierListRef = useRef(null);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('nextplay_tierlist');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Convert IDs back to game objects
                const restored = {};
                Object.keys(data).forEach(tier => {
                    restored[tier] = data[tier]
                        .map(id => gamesData.find(g => g.id === id))
                        .filter(Boolean);
                });
                setTiers(restored);
            } catch { }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        const toSave = {};
        Object.keys(tiers).forEach(tier => {
            toSave[tier] = tiers[tier].map(g => g.id);
        });
        localStorage.setItem('nextplay_tierlist', JSON.stringify(toSave));
    }, [tiers]);

    const usedGameIds = new Set(Object.values(tiers).flat().map(g => g.id));

    const addGameToTier = (game, tier) => {
        if (!usedGameIds.has(game.id)) {
            setTiers(prev => ({
                ...prev,
                [tier]: [...prev[tier], game]
            }));
        }
        setShowPicker(false);
        setSearch('');
        setActiveTier(null);
    };

    const removeGame = (gameId, tier) => {
        setTiers(prev => ({
            ...prev,
            [tier]: prev[tier].filter(g => g.id !== gameId)
        }));
    };

    const moveGame = (gameId, fromTier, toTier) => {
        if (fromTier === toTier) return;
        const game = tiers[fromTier].find(g => g.id === gameId);
        if (!game) return;

        setTiers(prev => ({
            ...prev,
            [fromTier]: prev[fromTier].filter(g => g.id !== gameId),
            [toTier]: [...prev[toTier], game]
        }));
    };

    const handleDragStart = (e, game, tier) => {
        setDraggedGame({ game, tier });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, tier) => {
        e.preventDefault();
        setDragOverTier(tier);
    };

    const handleDrop = (e, toTier) => {
        e.preventDefault();
        if (draggedGame) {
            moveGame(draggedGame.game.id, draggedGame.tier, toTier);
        }
        setDraggedGame(null);
        setDragOverTier(null);
    };

    const handleDragEnd = () => {
        setDraggedGame(null);
        setDragOverTier(null);
    };

    const clearAll = () => {
        setTiers({ S: [], A: [], B: [], C: [], D: [], F: [] });
    };

    const totalGames = Object.values(tiers).flat().length;

    const generateShareText = () => {
        if (totalGames === 0) return '';
        let text = '🎮 My 2026 Game Tier List:\n\n';
        TIER_CONFIG.forEach(({ tier, label }) => {
            if (tiers[tier].length > 0) {
                text += `${tier}: ${tiers[tier].map(g => g.title).join(', ')}\n`;
            }
        });
        text += '\n🎯 Create yours: nextplaygame.me/tier-list';
        return text;
    };

    const shareText = generateShareText();
    const shareUrl = 'https://nextplaygame.me/tier-list';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const exportAsImage = async () => {
        if (!tierListRef.current) return;
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(tierListRef.current, {
                backgroundColor: '#0a0e17',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = 'my-2026-tier-list.png';
            link.href = canvas.toDataURL();
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    const filteredGames = gamesData.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) &&
        !usedGameIds.has(g.id)
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="2026 Game Tier List Creator | Rank Your Most Anticipated Games | NextPlay"
                description="Create and share your ultimate 2026 video game tier list! Rank GTA 6, Crimson Desert, RE9 and more in S/A/B/C/D/F tiers. Export as image or share on Twitter."
                url={getCanonicalUrl('/tier-list')}
                breadcrumbs={[{ name: 'Tier List', path: '/tier-list' }]}
                faqData={[
                    {
                        question: 'How do I create a 2026 game tier list?',
                        answer: 'Use NextPlay Tier List Creator to drag and drop games into S, A, B, C, D, or F tiers. Export your tier list as an image to share on social media!'
                    },
                    {
                        question: 'What games can I rank in the tier list?',
                        answer: `You can rank any of the ${gamesData.length}+ upcoming 2026 games including GTA 6, Crimson Desert, Resident Evil 9, and more.`
                    }
                ]}
            />

            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Tier List', path: '/tier-list' }]} />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #ff7f7f, #ffbf7f)',
                        borderRadius: '4px',
                        color: '#0a0e17',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <Crown size={14} /> TIER LIST CREATOR
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    RANK YOUR 2026 GAMES
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                    Drag games between tiers or click the + button to add games. Export as image to share!
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <button onClick={exportAsImage} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={16} /> Export Image
                    </button>
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
                        <Link2 size={16} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                    {totalGames > 0 && (
                        <button onClick={clearAll} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                            <RotateCcw size={16} /> Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Tier List */}
            <div ref={tierListRef} style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', background: '#0a0e17', borderRadius: '12px' }}>
                {TIER_CONFIG.map(({ tier, label, color, bg, border }) => (
                    <div
                        key={tier}
                        onDragOver={(e) => handleDragOver(e, tier)}
                        onDrop={(e) => handleDrop(e, tier)}
                        onDragLeave={() => setDragOverTier(null)}
                        style={{
                            display: 'flex',
                            marginBottom: '0.5rem',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: `2px solid ${dragOverTier === tier ? color : border}`,
                            background: dragOverTier === tier ? bg : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {/* Tier Label */}
                        <div
                            style={{
                                width: '60px',
                                minHeight: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: bg,
                                borderRight: `2px solid ${border}`,
                                flexShrink: 0
                            }}
                        >
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{tier}</span>
                        </div>

                        {/* Games in Tier */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            minHeight: '70px',
                            alignItems: 'center'
                        }}>
                            {tiers[tier].map(game => (
                                <div
                                    key={game.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, game, tier)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        position: 'relative',
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        cursor: 'grab',
                                        border: '2px solid rgba(255,255,255,0.1)'
                                    }}
                                    title={game.title}
                                >
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button
                                        onClick={() => removeGame(game.id, tier)}
                                        style={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
                                            background: 'rgba(0,0,0,0.7)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: '#ef4444',
                                            padding: 0
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {/* Add Button */}
                            <button
                                onClick={() => { setActiveTier(tier); setShowPicker(true); }}
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '6px',
                                    border: `2px dashed ${border}`,
                                    background: 'transparent',
                                    color: color,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Branding for Export */}
                <div style={{ textAlign: 'center', padding: '0.75rem', color: '#64748b', fontSize: '0.75rem' }}>
                    Created with NextPlay 2026 • nextplaygame.me/tier-list
                </div>
            </div>

            {/* Stats */}
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                <strong style={{ color: '#06b6d4' }}>{totalGames}</strong> games ranked
            </div>

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
                    onClick={() => { setShowPicker(false); setActiveTier(null); }}
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
                                <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                    ADD TO {activeTier} TIER
                                </h2>
                                <button
                                    onClick={() => { setShowPicker(false); setActiveTier(null); }}
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
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0.5rem' }}>
                            {filteredGames.slice(0, 30).map(game => (
                                <button
                                    key={game.id}
                                    onClick={() => addGameToTier(game, activeTier)}
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
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{game.title}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                            {game.genres?.slice(0, 2).join(' • ')} • {game.hype}% Hype
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

export default TierList;
