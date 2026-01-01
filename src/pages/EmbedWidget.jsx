import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Code, Copy, Check, Clock, Zap, ExternalLink } from 'lucide-react';
import { formatCardDate, isPlaceholderDate } from '../utils/dateHelpers';
import { parseISO } from 'date-fns';

const EmbedWidget = () => {
    const [selectedGame, setSelectedGame] = useState(gamesData[0]);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [size, setSize] = useState('medium');

    // Calculate countdown
    const today = new Date();
    const releaseDate = parseISO(selectedGame.releaseDate);
    const daysLeft = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));

    // Generate embed code
    const embedCode = useMemo(() => {
        const width = size === 'small' ? '280' : size === 'medium' ? '350' : '450';
        const height = size === 'small' ? '120' : size === 'medium' ? '150' : '180';
        const bgColor = theme === 'dark' ? '#0a0e17' : '#ffffff';
        const textColor = theme === 'dark' ? '#ffffff' : '#0a0e17';
        const accentColor = '#06b6d4';

        return `<!-- NextPlay 2026 Countdown Widget -->
<div id="np-widget-${selectedGame.slug}" style="
    width: ${width}px;
    padding: 16px;
    background: ${bgColor};
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    box-sizing: border-box;
">
    <div style="display: flex; gap: 12px; align-items: center;">
        <img src="${selectedGame.image}" alt="${selectedGame.title}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" />
        <div style="flex: 1; min-width: 0;">
            <div style="font-size: 14px; font-weight: 700; color: ${textColor}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${selectedGame.title}
            </div>
            <div style="font-size: 12px; color: ${accentColor}; margin-top: 4px;">
                ${formatCardDate(selectedGame.releaseDate)}
            </div>
            <div style="font-size: 18px; font-weight: 800; color: #f97316; margin-top: 4px;">
                ${daysLeft > 0 ? `${daysLeft} DAYS` : 'OUT NOW!'}
            </div>
        </div>
    </div>
    <a href="https://nextplaygame.me/game/${selectedGame.slug}" target="_blank" rel="noopener" style="
        display: block;
        margin-top: 12px;
        padding: 8px;
        background: ${accentColor};
        color: #0a0e17;
        text-align: center;
        border-radius: 6px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
    ">
        View on NextPlay →
    </a>
</div>`;
    }, [selectedGame, theme, size, daysLeft]);

    const copyCode = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="Embed Game Countdown Widget | Add to Your Site | NextPlay"
                description="Add a game countdown widget to your website, blog, or Discord! Embed live countdowns for GTA 6 and other 2026 games."
                url="https://nextplaygame.me/embed"
            />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <Code size={14} /> EMBED WIDGET
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    COUNTDOWN WIDGET
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                    Add a game countdown to your website, blog, or Discord server!
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2rem' }}>
                {/* Configuration */}
                <div>
                    <h2 className="font-heading" style={{ fontSize: '1rem', marginBottom: '1rem', color: '#64748b', letterSpacing: '0.1em' }}>
                        CONFIGURE
                    </h2>

                    {/* Game Select */}
                    <div className="glass" style={{ padding: '1rem', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                            SELECT GAME
                        </label>
                        <select
                            value={selectedGame.slug}
                            onChange={(e) => setSelectedGame(gamesData.find(g => g.slug === e.target.value) || gamesData[0])}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '0.9rem'
                            }}
                        >
                            {gamesData.slice(0, 50).map(g => (
                                <option key={g.slug} value={g.slug}>{g.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Theme Select */}
                    <div className="glass" style={{ padding: '1rem', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                            THEME
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['dark', 'light'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: theme === t ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                                        border: theme === t ? '2px solid #06b6d4' : '2px solid transparent',
                                        borderRadius: '6px',
                                        color: theme === t ? '#06b6d4' : '#94a3b8',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        fontWeight: 600
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Select */}
                    <div className="glass" style={{ padding: '1rem', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                            SIZE
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['small', 'medium', 'large'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: size === s ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                                        border: size === s ? '2px solid #06b6d4' : '2px solid transparent',
                                        borderRadius: '6px',
                                        color: size === s ? '#06b6d4' : '#94a3b8',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        fontWeight: 600
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Copy Code */}
                    <button
                        onClick={copyCode}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'Copied!' : 'Copy Embed Code'}
                    </button>
                </div>

                {/* Preview */}
                <div>
                    <h2 className="font-heading" style={{ fontSize: '1rem', marginBottom: '1rem', color: '#64748b', letterSpacing: '0.1em' }}>
                        PREVIEW
                    </h2>

                    <div
                        className="glass"
                        style={{
                            padding: '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                            minHeight: '250px'
                        }}
                    >
                        {/* Widget Preview */}
                        <div style={{
                            width: size === 'small' ? '280px' : size === 'medium' ? '350px' : '450px',
                            padding: '16px',
                            background: theme === 'dark' ? '#0a0e17' : '#ffffff',
                            borderRadius: '12px',
                            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <img
                                    src={selectedGame.image}
                                    alt={selectedGame.title}
                                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: theme === 'dark' ? '#fff' : '#0a0e17',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {selectedGame.title}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#06b6d4', marginTop: '4px' }}>
                                        {formatCardDate(selectedGame.releaseDate)}
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#f97316', marginTop: '4px' }}>
                                        {daysLeft > 0 ? `${daysLeft} DAYS` : 'OUT NOW!'}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                marginTop: '12px',
                                padding: '8px',
                                background: '#06b6d4',
                                color: '#0a0e17',
                                textAlign: 'center',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600
                            }}>
                                View on NextPlay →
                            </div>
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="glass" style={{ marginTop: '1rem', padding: '1rem', overflow: 'auto', maxHeight: '200px' }}>
                        <pre style={{
                            fontSize: '0.7rem',
                            color: '#94a3b8',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            margin: 0
                        }}>
                            {embedCode}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmbedWidget;
