import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Building2, Gamepad2, ArrowLeft, Trophy, Calendar, Sparkles } from 'lucide-react';
import { slugify, unslugify } from '../utils/seoHelpers';
import { getCompanyEntities } from '../utils/specsAndSimilarity';

const CompanyPage = ({ type = 'developer' }) => {
    const { slug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    const isDeveloper = type === 'developer';
    const typeLabel = isDeveloper ? 'Developer' : 'Publisher';

    const entities = useMemo(() => {
        return getCompanyEntities();
    }, []);

    const companyData = useMemo(() => {
        const list = isDeveloper ? entities.developers : entities.publishers;
        return list.find(c => c.slug === slug);
    }, [slug, isDeveloper, entities]);

    if (!companyData) {
        // Directory of top companies
        const list = isDeveloper ? entities.developers.slice(0, 30) : entities.publishers.slice(0, 30);
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
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
                        <Building2 size={14} /> GAMING STUDIOS &amp; PUBLISHERS
                    </div>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                        2026 Game {typeLabel}s Directory
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
                        Browse upcoming 2026 video game releases by your favorite game development studios and publishers.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {list.map(c => (
                        <Link
                            key={c.slug}
                            to={`/${type}/${c.slug}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                textDecoration: 'none'
                            }}
                            className="glass hover-glow"
                        >
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
                                    {c.name}
                                </h3>
                                <div style={{ fontSize: '0.8rem', color: '#06b6d4' }}>
                                    {c.games.length} upcoming {c.games.length === 1 ? 'game' : 'games'} in 2026
                                </div>
                            </div>
                            <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', color: '#64748b' }} />
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    const avgHype = Math.round(
        companyData.games.reduce((acc, g) => acc + (g.hype || 50), 0) / (companyData.games.length || 1)
    );

    const pageTitle = `Upcoming 2026 ${companyData.name} Games (${typeLabel} Schedule) | NextPlay`;
    const pageDescription = `Discover all upcoming 2026 video games developed or published by ${companyData.name}. Release dates, platforms, countdown timers, and hype scores.`;
    const canonicalUrl = `https://nextplaygame.me/${type}/${companyData.slug}`;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={pageTitle}
                description={pageDescription}
                url={canonicalUrl}
            />

            <Breadcrumb
                items={[
                    { label: 'Home', path: '/' },
                    { label: `${typeLabel}s`, path: `/${type}` },
                    { label: companyData.name }
                ]}
            />

            {/* Header */}
            <div className="glass" style={{
                padding: '2.5rem',
                borderRadius: '16px',
                borderLeft: '4px solid #06b6d4',
                marginBottom: '3rem'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.8rem',
                    background: 'rgba(6, 182, 212, 0.15)',
                    borderRadius: '20px',
                    color: '#06b6d4',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '1rem'
                }}>
                    <Building2 size={14} /> {typeLabel.toUpperCase()} PROFILE
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    {companyData.name} (2026 Releases)
                </h1>
                <p style={{ color: '#cbd5e1', maxWidth: '750px', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                    Tracking every major 2026 video game title developed or published by {companyData.name}. Stay informed with confirmed release dates, real-time launch countdowns, and platform announcements.
                </p>

                {/* Studio Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>2026 Releases</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06b6d4', marginTop: '0.2rem' }}>
                            {companyData.games.length} Titles
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Average Hype</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f97316', marginTop: '0.2rem' }}>
                            {avgHype}% Anticipation
                        </div>
                    </div>
                </div>
            </div>

            {/* Releases Grid */}
            <h2 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
                Confirmed 2026 Game Lineup
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem'
            }}>
                {companyData.games.map(game => (
                    <GameCard
                        key={game.slug}
                        game={game}
                        isWatched={isWatched(game.id)}
                        onToggleWatch={() => toggleWatch(game.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CompanyPage;
