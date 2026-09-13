import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import trendsData from '../data/gaming_trends_ontology.json';
import { Flame, TrendingUp, Sparkles } from 'lucide-react';

const TrendingTicker = () => {
    // Select top 15 highest search volume items across categories
    const hotTopics = useMemo(() => {
        return trendsData
            .filter(t => t.searchVolumeScore >= 95)
            .slice(0, 15);
    }, []);

    return (
        <div
            style={{
                background: 'rgba(10, 14, 23, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '0.4rem 1rem',
                fontSize: '0.75rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                position: 'relative',
                zIndex: 40
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#f97316',
                fontWeight: 800,
                letterSpacing: '0.08em',
                flexShrink: 0
            }}>
                <Flame size={14} fill="#f97316" />
                <span className="hidden sm:inline">TRENDING:</span>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
                className="no-scrollbar"
            >
                {hotTopics.map(topic => (
                    <Link
                        key={topic.slug}
                        to={`/trends/${topic.slug}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            color: '#cbd5e1',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span>{topic.name}</span>
                        <span style={{ color: '#06b6d4', fontSize: '0.65rem' }}>{topic.searchVolumeScore}%</span>
                    </Link>
                ))}

                <Link
                    to="/trends"
                    style={{
                        color: '#06b6d4',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                    }}
                >
                    View All 1,000 Trends &rarr;
                </Link>
            </div>
        </div>
    );
};

export default TrendingTicker;
