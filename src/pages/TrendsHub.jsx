import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import trendsData from '../data/gaming_trends_ontology.json';
import SEO from '../components/SEO';
import { Flame, Search, TrendingUp, Cpu, Globe, Gamepad2, Layers, Sparkles, Building2, Calendar, Filter } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All 1,000+ Topics', icon: <Flame size={15} /> },
    { id: 'hardware', label: 'Hardware & Consoles', icon: <Cpu size={15} /> },
    { id: 'services', label: 'Subscriptions & Cloud', icon: <Globe size={15} /> },
    { id: 'engines-tech', label: 'Engines & Tech', icon: <Layers size={15} /> },
    { id: 'subgenres-tropes', label: 'Genres & Tropes', icon: <Gamepad2 size={15} /> },
    { id: 'franchises', label: 'Franchises & Universes', icon: <Sparkles size={15} /> },
    { id: 'studios', label: 'Studios & Developers', icon: <Building2 size={15} /> },
    { id: 'events', label: 'Events & Showcases', icon: <Calendar size={15} /> },
    { id: 'intent-features', label: 'Search Modifiers', icon: <Filter size={15} /> }
];

const TrendsHub = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTrends = useMemo(() => {
        return trendsData.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = !searchQuery || 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.queryIntent.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const topTrending = useMemo(() => {
        return [...trendsData].sort((a, b) => b.searchVolumeScore - a.searchVolumeScore).slice(0, 10);
    }, []);

    const canonicalUrl = 'https://nextplaygame.me/trends';

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="Gaming Search Trends & Industry Intelligence (1,000+ Topics) | NextPlay 2026"
                description="Explore real-time search trends across the entire gaming industry: consoles, PC hardware, subscription services, game engines, genres, franchises, and studios."
                url={canonicalUrl}
            />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.9rem',
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    borderRadius: '20px',
                    color: '#f97316',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '1rem'
                }}>
                    <Flame size={14} /> LIVE SEARCH INTELLIGENCE
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    1,000+ Gaming Search Trends Hub
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Tracking daily search velocity, hardware demand, engine benchmarks, and franchise momentum across Google, Bing, and AI search engines.
                </p>

                {/* Search Bar */}
                <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                        type="text"
                        placeholder="Search 1,000 topics (e.g. Switch 2, UE5.5, Soulslike, Game Pass, RTX 5090)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3.25rem',
                            background: 'rgba(10, 14, 23, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 0 25px rgba(6, 182, 212, 0.1)'
                        }}
                    />
                </div>
            </div>

            {/* Top 10 High-Velocity Leaderboard */}
            {!searchQuery && selectedCategory === 'all' && (
                <div className="glass" style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '3.5rem',
                    border: '1px solid rgba(249, 115, 22, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Flame size={20} color="#f97316" />
                        <h2 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                            Highest-Velocity Gaming Searches
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {topTrending.map((item, idx) => (
                            <Link
                                key={item.slug}
                                to={`/trends/${item.slug}`}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.85rem 1rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                className="glass hover-glow"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: idx < 3 ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        color: idx < 3 ? '#f97316' : '#94a3b8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 800
                                    }}>
                                        #{idx + 1}
                                    </span>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.category}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 800 }}>
                                        {item.searchVolumeScore}%
                                    </span>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Search Velocity</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Filter Pills */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                marginBottom: '2rem'
            }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.55rem 1rem',
                            background: selectedCategory === cat.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${selectedCategory === cat.id ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: '20px',
                            color: selectedCategory === cat.id ? '#06b6d4' : '#cbd5e1',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {cat.icon}
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Results Counter */}
            <div style={{ marginBottom: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                Showing <strong>{filteredTrends.length}</strong> trending gaming entities
            </div>

            {/* Trends Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '4rem'
            }}>
                {filteredTrends.map(item => (
                    <Link
                        key={item.slug}
                        to={`/trends/${item.slug}`}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1.25rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        className="glass hover-glow"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <span style={{
                                fontSize: '0.7rem',
                                color: '#06b6d4',
                                background: 'rgba(6, 182, 212, 0.1)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                            }}>
                                {item.category}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 800 }}>
                                {item.searchVolumeScore}% Velocity
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                            {item.name}
                        </h3>

                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1rem', flex: 1 }}>
                            {item.description.slice(0, 100)}...
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {item.associatedGames?.length || 0} associated games
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 600 }}>
                                View Analysis &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TrendsHub;
