import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { Cpu, HardDrive, Monitor, Zap, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Scale, Sparkles } from 'lucide-react';
import { getSystemRequirements } from '../utils/specsAndSimilarity';
import { formatCardDate } from '../utils/dateHelpers';

const SystemRequirementsPage = () => {
    const { slug } = useParams();
    const [userGpu, setUserGpu] = useState('');
    const [userRam, setUserRam] = useState('16');

    const targetGame = useMemo(() => {
        return gamesData.find(g => g.slug === slug);
    }, [slug]);

    const specs = useMemo(() => {
        if (!targetGame) return null;
        return getSystemRequirements(targetGame);
    }, [targetGame]);

    if (!targetGame || !specs) {
        const pcGames = gamesData.filter(g => g.platforms?.includes('PC')).slice(0, 30);
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.9rem',
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        borderRadius: '20px',
                        color: '#f97316',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        marginBottom: '1rem'
                    }}>
                        <Cpu size={14} /> PC BENCHMARKS &amp; HARDWARE SPECS
                    </div>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                        2026 PC System Requirements Directory
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
                        Check minimum, recommended, and ultra PC hardware specifications for upcoming 2026 PC releases.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {pcGames.map(game => (
                        <Link
                            key={game.slug}
                            to={`/system-requirements/${game.slug}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                textDecoration: 'none'
                            }}
                            className="glass hover-glow"
                        >
                            <img
                                src={game.image}
                                alt={game.title}
                                style={{ width: '55px', height: '55px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
                                    {game.title}
                                </h3>
                                <div style={{ fontSize: '0.75rem', color: '#f97316' }}>View PC Specs &rarr;</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    const pageTitle = `${targetGame.title} PC System Requirements (Minimum & Recommended Specs) | NextPlay`;
    const pageDescription = `Can you run ${targetGame.title}? Check confirmed and estimated PC system requirements: Minimum, Recommended, and Ultra hardware specs, GPU, CPU, RAM, and SSD storage.`;
    const canonicalUrl = `https://nextplaygame.me/system-requirements/${targetGame.slug}`;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={pageTitle}
                description={pageDescription}
                url={canonicalUrl}
                image={targetGame.image}
            />

            <Breadcrumb
                items={[
                    { label: 'Games', path: '/' },
                    { label: targetGame.title, path: `/game/${targetGame.slug}` },
                    { label: 'System Requirements' }
                ]}
            />

            {/* Header Banner */}
            <div style={{
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                marginBottom: '3rem',
                background: `linear-gradient(180deg, rgba(10, 14, 23, 0.85) 0%, rgba(10, 14, 23, 0.98) 100%), url(${targetGame.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.8rem',
                    background: 'rgba(249, 115, 22, 0.2)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    borderRadius: '20px',
                    color: '#f97316',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '1rem'
                }}>
                    <Cpu size={14} /> CAN I RUN IT?
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                    {targetGame.title} PC System Requirements
                </h1>
                <p style={{ color: '#cbd5e1', maxWidth: '750px', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Everything you need to know before launching {targetGame.title} on PC. Check CPU, GPU, RAM, VRAM, and storage specifications to verify if your gaming rig is ready.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid #06b6d4',
                        borderRadius: '8px',
                        color: '#06b6d4',
                        fontSize: '0.85rem',
                        fontWeight: 700
                    }}>
                        Hardware Tier: {specs.tier}
                    </div>
                    <div style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid #22c55e',
                        borderRadius: '8px',
                        color: '#22c55e',
                        fontSize: '0.85rem',
                        fontWeight: 700
                    }}>
                        {specs.badge}
                    </div>
                </div>
            </div>

            {/* Quick Specs Overview Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {/* Minimum Specs */}
                <div className="glass" style={{
                    padding: '1.75rem',
                    borderRadius: '12px',
                    borderTop: '4px solid #eab308'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#eab308', margin: 0 }}>
                            Minimum Specs
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Low / 30 FPS</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                        <li><strong>OS:</strong> {specs.os}</li>
                        <li><strong>Processor (CPU):</strong> {specs.minimum.cpu}</li>
                        <li><strong>Graphics (GPU):</strong> {specs.minimum.gpu}</li>
                        <li><strong>Memory (RAM):</strong> {specs.minimum.ram}</li>
                        <li><strong>VRAM:</strong> {specs.minimum.vram}</li>
                        <li><strong>Storage:</strong> {specs.storage}</li>
                        <li><strong>DirectX:</strong> {specs.directX}</li>
                        <li style={{ color: '#eab308', fontWeight: 600 }}><strong>Target:</strong> {specs.minimum.target}</li>
                    </ul>
                </div>

                {/* Recommended Specs */}
                <div className="glass" style={{
                    padding: '1.75rem',
                    borderRadius: '12px',
                    borderTop: '4px solid #06b6d4',
                    background: 'rgba(6, 182, 212, 0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#06b6d4', margin: 0 }}>
                            Recommended Specs
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700 }}>High / 60 FPS</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                        <li><strong>OS:</strong> {specs.os}</li>
                        <li><strong>Processor (CPU):</strong> {specs.recommended.cpu}</li>
                        <li><strong>Graphics (GPU):</strong> {specs.recommended.gpu}</li>
                        <li><strong>Memory (RAM):</strong> {specs.recommended.ram}</li>
                        <li><strong>VRAM:</strong> {specs.recommended.vram}</li>
                        <li><strong>Storage:</strong> {specs.storage}</li>
                        <li><strong>DirectX:</strong> {specs.directX}</li>
                        <li style={{ color: '#06b6d4', fontWeight: 600 }}><strong>Target:</strong> {specs.recommended.target}</li>
                    </ul>
                </div>

                {/* Ultra / 4K Specs */}
                <div className="glass" style={{
                    padding: '1.75rem',
                    borderRadius: '12px',
                    borderTop: '4px solid #a855f7'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#a855f7', margin: 0 }}>
                            Ultra / 4K Specs
                        </h2>
                        <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 700 }}>Max Ray Tracing</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                        <li><strong>OS:</strong> Windows 11 (64-bit)</li>
                        <li><strong>Processor (CPU):</strong> {specs.ultra.cpu}</li>
                        <li><strong>Graphics (GPU):</strong> {specs.ultra.gpu}</li>
                        <li><strong>Memory (RAM):</strong> {specs.ultra.ram}</li>
                        <li><strong>VRAM:</strong> {specs.ultra.vram}</li>
                        <li><strong>Storage:</strong> Fast NVMe SSD (M.2)</li>
                        <li><strong>DirectX:</strong> DirectX 12 Ultimate</li>
                        <li style={{ color: '#a855f7', fontWeight: 600 }}><strong>Target:</strong> {specs.ultra.target}</li>
                    </ul>
                </div>
            </div>

            {/* Quick links to comparison & similar */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <Link to={`/game/${targetGame.slug}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                    View Game Details &amp; Countdown
                </Link>
                <Link to={`/games-like/${targetGame.slug}`} className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} /> Games Like {targetGame.title}
                </Link>
                <Link to={`/can-i-run-it`} className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={16} /> Full PC Hardware Checker
                </Link>
            </div>
        </div>
    );
};

export default SystemRequirementsPage;
