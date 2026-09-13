import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import { Cpu, HardDrive, Monitor, CheckCircle, AlertTriangle, XCircle, Share2, Twitter, Link2, Sparkles } from 'lucide-react';
import { getSystemRequirements } from '../utils/specsAndSimilarity';

const GPU_TIERS = {
    'rtx4090': { name: 'NVIDIA GeForce RTX 4090 (24 GB)', power: 100 },
    'rtx4080': { name: 'NVIDIA GeForce RTX 4080 Super (16 GB)', power: 90 },
    'rtx4070': { name: 'NVIDIA GeForce RTX 4070 / Super (12 GB)', power: 80 },
    'rtx4060': { name: 'NVIDIA GeForce RTX 4060 / Ti (8-16 GB)', power: 65 },
    'rtx3080': { name: 'NVIDIA GeForce RTX 3080 / 3080 Ti (10-12 GB)', power: 75 },
    'rtx3070': { name: 'NVIDIA GeForce RTX 3070 (8 GB)', power: 68 },
    'rtx3060': { name: 'NVIDIA GeForce RTX 3060 / Ti (8-12 GB)', power: 60 },
    'rtx2060': { name: 'NVIDIA GeForce RTX 2060 (6 GB)', power: 45 },
    'gtx1660': { name: 'NVIDIA GeForce GTX 1660 Super / Ti (6 GB)', power: 35 },
    'gtx1060': { name: 'NVIDIA GeForce GTX 1060 (6 GB)', power: 25 },
    'rx7900': { name: 'AMD Radeon RX 7900 XTX / XT (20-24 GB)', power: 92 },
    'rx7800': { name: 'AMD Radeon RX 7800 XT (16 GB)', power: 78 },
    'rx6700': { name: 'AMD Radeon RX 6700 XT (12 GB)', power: 63 },
    'rx580': { name: 'AMD Radeon RX 580 (8 GB)', power: 25 },
    'igpu': { name: 'Integrated Graphics (Intel Iris / AMD Vega)', power: 10 }
};

const CPU_TIERS = {
    'i9_recent': { name: 'Intel Core i9 13th / 14th Gen', power: 100 },
    'i7_recent': { name: 'Intel Core i7 12th - 14th Gen', power: 90 },
    'i5_recent': { name: 'Intel Core i5 12th - 14th Gen', power: 75 },
    'ryzen_x3d': { name: 'AMD Ryzen 7 7800X3D / 5800X3D', power: 95 },
    'ryzen_7': { name: 'AMD Ryzen 7 (5000 / 7000 / 9000 series)', power: 85 },
    'ryzen_5': { name: 'AMD Ryzen 5 (3600 / 5600 / 7600)', power: 70 },
    'older_quad': { name: 'Older 4-Core / 6-Core CPU (Pre-2020)', power: 35 }
};

const CanIRunIt = () => {
    const [selectedGpu, setSelectedGpu] = useState('rtx3060');
    const [selectedCpu, setSelectedCpu] = useState('i5_recent');
    const [selectedRam, setSelectedRam] = useState(16);
    const [filterCategory, setFilterCategory] = useState('all');
    const [copied, setCopied] = useState(false);

    const pcGames = useMemo(() => {
        return gamesData.filter(g => g.platforms?.includes('PC'));
    }, []);

    const compatibilityAnalysis = useMemo(() => {
        const gpuPower = GPU_TIERS[selectedGpu]?.power || 50;
        const cpuPower = CPU_TIERS[selectedCpu]?.power || 50;
        const totalPower = (gpuPower * 0.6) + (cpuPower * 0.3) + (selectedRam >= 32 ? 10 : selectedRam >= 16 ? 5 : 0);

        let ultraCount = 0;
        let recommendedCount = 0;
        let struggleCount = 0;

        const evaluatedGames = pcGames.map(game => {
            const req = getSystemRequirements(game);
            let rating = 'recommended'; // 'ultra', 'recommended', 'minimum', 'struggle'

            const gameDemand = (game.hype || 50) >= 80 ? 75 : (game.hype || 50) >= 60 ? 55 : 35;

            if (totalPower >= gameDemand + 20 && selectedRam >= 16) {
                rating = 'ultra';
                ultraCount++;
            } else if (totalPower >= gameDemand && selectedRam >= 8) {
                rating = 'recommended';
                recommendedCount++;
            } else {
                rating = 'struggle';
                struggleCount++;
            }

            return { game, req, rating };
        });

        const overallPercent = Math.round(((ultraCount + recommendedCount) / (pcGames.length || 1)) * 100);

        return {
            overallPercent,
            ultraCount,
            recommendedCount,
            struggleCount,
            evaluatedGames
        };
    }, [selectedGpu, selectedCpu, selectedRam, pcGames]);

    const filteredGames = useMemo(() => {
        if (filterCategory === 'all') return compatibilityAnalysis.evaluatedGames;
        return compatibilityAnalysis.evaluatedGames.filter(g => g.rating === filterCategory);
    }, [compatibilityAnalysis, filterCategory]);

    const shareUrl = 'https://nextplaygame.me/can-i-run-it';
    const shareText = `My PC scored ${compatibilityAnalysis.overallPercent}% on NextPlay 2026 Rig Readiness! Can your gaming rig run 2026 PC games? 💻🎮`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="Can I Run It? 2026 PC Gaming Hardware Checker & Benchmarks | NextPlay"
                description="Test your PC graphics card, processor, and RAM against all 2026 PC game releases. Instant compatibility audit for GTA 6, Crimson Desert, and upcoming games."
                url={shareUrl}
            />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.9rem',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '20px',
                    color: '#06b6d4',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '1rem'
                }}>
                    <Cpu size={14} /> INTERACTIVE PC HARDWARE CHECKER
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    Can My PC Run 2026 Games?
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Select your graphics card, processor, and RAM to instantly test your gaming rig against {pcGames.length} upcoming 2026 PC releases.
                </p>
            </div>

            {/* Hardware Selection Tool */}
            <div className="glass" style={{
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                marginBottom: '3rem',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.05)'
            }}>
                <h2 className="font-heading" style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Monitor size={20} color="#06b6d4" /> Configure Your Rig
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {/* GPU Selector */}
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Graphics Card (GPU)
                        </label>
                        <select
                            value={selectedGpu}
                            onChange={(e) => setSelectedGpu(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: 'rgba(10, 14, 23, 0.8)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            {Object.entries(GPU_TIERS).map(([key, data]) => (
                                <option key={key} value={key}>{data.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* CPU Selector */}
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            Processor (CPU)
                        </label>
                        <select
                            value={selectedCpu}
                            onChange={(e) => setSelectedCpu(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: 'rgba(10, 14, 23, 0.8)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            {Object.entries(CPU_TIERS).map(([key, data]) => (
                                <option key={key} value={key}>{data.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* RAM Selector */}
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            System RAM
                        </label>
                        <select
                            value={selectedRam}
                            onChange={(e) => setSelectedRam(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: 'rgba(10, 14, 23, 0.8)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            <option value={8}>8 GB RAM (Entry Level)</option>
                            <option value={16}>16 GB RAM (Standard Gaming)</option>
                            <option value={32}>32 GB RAM (High-End / Ultra)</option>
                            <option value={64}>64 GB RAM (Enthusiast)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Live Result Score Card */}
            <div className="glass" style={{
                padding: '2.5rem 2rem',
                borderRadius: '16px',
                marginBottom: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(10, 14, 23, 0.9) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.4)'
            }}>
                <div style={{ fontSize: '0.9rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    2026 PC Readiness Score
                </div>
                <div style={{
                    fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                    fontWeight: 900,
                    color: compatibilityAnalysis.overallPercent >= 75 ? '#22c55e' : compatibilityAnalysis.overallPercent >= 45 ? '#eab308' : '#ef4444',
                    margin: '0.5rem 0'
                }}>
                    {compatibilityAnalysis.overallPercent}%
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                    Your setup can smoothly play <strong>{compatibilityAnalysis.ultraCount + compatibilityAnalysis.recommendedCount} of {pcGames.length}</strong> upcoming 2026 PC titles!
                </p>

                {/* Score breakdown pills */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#22c55e', fontWeight: 700 }}>
                        🟢 Ultra 60+ FPS: {compatibilityAnalysis.ultraCount} Games
                    </div>
                    <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06b6d4', borderRadius: '8px', color: '#06b6d4', fontWeight: 700 }}>
                        🔵 High 60 FPS: {compatibilityAnalysis.recommendedCount} Games
                    </div>
                    <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontWeight: 700 }}>
                        🔴 May Struggle: {compatibilityAnalysis.struggleCount} Games
                    </div>
                </div>

                {/* Viral Share buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Twitter size={16} /> Share Result
                    </a>
                    <button onClick={copyToClipboard} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link2 size={16} /> {copied ? 'Copied Link!' : 'Copy Result Link'}
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Game List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    Compatibility Breakdown ({filteredGames.length})
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setFilterCategory('all')}
                        className={filterCategory === 'all' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        All ({pcGames.length})
                    </button>
                    <button
                        onClick={() => setFilterCategory('ultra')}
                        className={filterCategory === 'ultra' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        Ultra
                    </button>
                    <button
                        onClick={() => setFilterCategory('recommended')}
                        className={filterCategory === 'recommended' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        High
                    </button>
                    <button
                        onClick={() => setFilterCategory('struggle')}
                        className={filterCategory === 'struggle' ? 'btn-primary' : 'btn-secondary'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        Struggles
                    </button>
                </div>
            </div>

            {/* Games Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '4rem'
            }}>
                {filteredGames.map(({ game, rating }) => (
                    <div
                        key={game.slug}
                        className="glass"
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            borderLeft: `4px solid ${rating === 'ultra' ? '#22c55e' : rating === 'recommended' ? '#06b6d4' : '#ef4444'}`
                        }}
                    >
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <img
                                src={game.image}
                                alt={game.title}
                                style={{ width: '55px', height: '55px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {game.title}
                                </h4>
                                <div style={{ fontSize: '0.75rem', color: rating === 'ultra' ? '#22c55e' : rating === 'recommended' ? '#06b6d4' : '#ef4444', fontWeight: 600 }}>
                                    {rating === 'ultra' ? '🟢 Ultra Settings Ready' : rating === 'recommended' ? '🔵 Smooth 60 FPS' : '🔴 Upgrade Recommended'}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <Link to={`/system-requirements/${game.slug}`} style={{ fontSize: '0.75rem', color: '#06b6d4', textDecoration: 'none' }}>
                                Full Specs &rarr;
                            </Link>
                            <Link to={`/game/${game.slug}`} style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none' }}>
                                Countdown &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CanIRunIt;
