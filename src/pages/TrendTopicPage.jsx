import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import trendsData from '../data/gaming_trends_ontology.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { Flame, TrendingUp, Cpu, Sparkles, Scale, ArrowLeft, Layers, Globe, ExternalLink, Calendar } from 'lucide-react';
import { formatCardDate } from '../utils/dateHelpers';

const TrendTopicPage = () => {
    const { slug } = useParams();

    const topic = useMemo(() => {
        return trendsData.find(t => t.slug === slug);
    }, [slug]);

    const relatedTopics = useMemo(() => {
        if (!topic) return [];
        return trendsData
            .filter(t => t.category === topic.category && t.slug !== topic.slug)
            .slice(0, 6);
    }, [topic]);

    if (!topic) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
                    Trending Topic Not Found
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    Explore over 1,000 active gaming search trends in our live intelligence hub.
                </p>
                <Link to="/trends" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Browse Gaming Trends Hub &rarr;
                </Link>
            </div>
        );
    }

    const pageTitle = `${topic.name} Trends, Specs & 2026 Gaming Analysis | NextPlay`;
    const pageDescription = `${topic.name} search trends, release expectations, hardware compatibility, and confirmed 2026 video game releases on NextPlay.`;
    const canonicalUrl = `https://nextplaygame.me/trends/${topic.slug}`;

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
                    { label: 'Gaming Trends', path: '/trends' },
                    { label: topic.name }
                ]}
            />

            {/* Hero Section */}
            <div className="glass" style={{
                padding: '2.5rem 2rem',
                borderRadius: '16px',
                borderLeft: '4px solid #f97316',
                marginBottom: '3rem',
                background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, rgba(10, 14, 23, 0.95) 100%)'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.8rem',
                        background: 'rgba(249, 115, 22, 0.2)',
                        border: '1px solid rgba(249, 115, 22, 0.4)',
                        borderRadius: '20px',
                        color: '#f97316',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                    }}>
                        <Flame size={14} fill="#f97316" /> {topic.category}
                    </span>

                    <span style={{
                        padding: '0.35rem 0.8rem',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '20px',
                        color: '#06b6d4',
                        fontSize: '0.75rem',
                        fontWeight: 800
                    }}>
                        {topic.searchVolumeScore}% Search Velocity
                    </span>
                </div>

                <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    {topic.name}
                </h1>

                <p style={{ color: '#cbd5e1', maxWidth: '750px', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                    {topic.description}
                </p>

                {/* Direct-Answer Quick Facts Card */}
                <div style={{
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem'
                }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Query Intent</div>
                        <div style={{ color: '#fff', fontWeight: 700, marginTop: '0.25rem' }}>{topic.queryIntent}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Associated 2026 Releases</div>
                        <div style={{ color: '#06b6d4', fontWeight: 700, marginTop: '0.25rem' }}>{topic.associatedGames?.length || 0} Confirmed Games</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Market Status</div>
                        <div style={{ color: '#22c55e', fontWeight: 700, marginTop: '0.25rem' }}>High Industry Demand</div>
                    </div>
                </div>
            </div>

            {/* Related Queries / What Gamers Search */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
                <h2 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem' }}>
                    Trending Search Queries for {topic.name}
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {topic.relatedKeywords?.map((kw, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '0.6rem 1.1rem',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '8px',
                                color: '#cbd5e1',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <TrendingUp size={14} color="#f97316" />
                            <span>{kw}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Associated 2026 Video Games */}
            {topic.associatedGames && topic.associatedGames.length > 0 && (
                <div style={{ marginBottom: '3.5rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '1.5rem' }}>
                        Related 2026 Video Game Releases
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {topic.associatedGames.map(game => (
                            <Link
                                key={game.slug}
                                to={`/game/${game.slug}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                className="glass hover-glow"
                            >
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {game.title}
                                    </h3>
                                    <div style={{ fontSize: '0.75rem', color: '#06b6d4' }}>
                                        {formatCardDate(game.releaseDate)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Trends in Category */}
            {relatedTopics.length > 0 && (
                <div style={{ marginBottom: '4rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem' }}>
                        More Trending in {topic.category}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {relatedTopics.map(rel => (
                            <Link
                                key={rel.slug}
                                to={`/trends/${rel.slug}`}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                className="glass hover-glow"
                            >
                                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{rel.name}</span>
                                <span style={{ color: '#f97316', fontSize: '0.75rem', fontWeight: 700 }}>{rel.searchVolumeScore}%</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQ Section for Rich Snippets */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
                <h3 className="font-heading" style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.25rem' }}>
                    Frequently Asked Questions about {topic.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <h4 style={{ color: '#06b6d4', fontSize: '1rem', marginBottom: '0.4rem' }}>
                            Why is {topic.name} heavily searched in 2026?
                        </h4>
                        <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                            {topic.description} Gamers and enthusiasts actively track product availability, announcements, benchmarks, and supported releases.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: '#06b6d4', fontSize: '1rem', marginBottom: '0.4rem' }}>
                            Where can I track upcoming games related to {topic.name}?
                        </h4>
                        <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                            NextPlay 2026 indexes all confirmed upcoming titles, live release countdowns, system specs, and community hype ratings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendTopicPage;
