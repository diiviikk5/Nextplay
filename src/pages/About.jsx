import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Heart, Zap, Calendar, Star, Trophy, Scale } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

const About = () => {
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' }
    ];

    const features = [
        { icon: <Calendar size={24} />, title: 'Release Calendar', desc: 'Track every 2026 game release with precise dates and countdowns.' },
        { icon: <Star size={24} />, title: 'Personal Watchlist', desc: 'Save games you\'re excited about and never miss a launch.' },
        { icon: <Trophy size={24} />, title: 'Tier Lists & Rankings', desc: 'Create and share your own tier lists for upcoming games.' },
        { icon: <Scale size={24} />, title: 'Game Comparison', desc: 'Compare games side-by-side to decide what to play.' }
    ];

    return (
        <>
            <SEO
                title="About NextPlay 2026 - The Ultimate Game Release Tracker"
                description="Learn about NextPlay 2026, the #1 tracker for upcoming video game releases. Our mission is to help gamers never miss a launch. Free, community-driven, and constantly updated."
                url={getCanonicalUrl('/about')}
                breadcrumbs={breadcrumbs}
                keywords="about nextplay, game release tracker, upcoming games 2026, video game calendar"
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>/</span>
                    <span>About</span>
                </nav>

                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)'
                    }}>
                        <Target color="#0a0e17" size={40} strokeWidth={2.5} />
                    </div>
                    <h1 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>
                        About <span style={{ color: '#06b6d4' }}>NextPlay</span> 2026
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
                        Your ultimate destination for tracking every video game releasing in 2026.
                        Never miss a launch again.
                    </p>
                </div>

                {/* Mission Section */}
                <section style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Heart size={24} color="#f97316" />
                        <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Our Mission</h2>
                    </div>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        We created NextPlay because we were tired of missing game launches. With hundreds of games
                        releasing every year across multiple platforms, it's nearly impossible to keep track of
                        everything manually.
                    </p>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        Our mission is simple: <strong style={{ color: '#06b6d4' }}>help every gamer discover, track, and never miss
                            the games they're excited about</strong>. We aggregate release dates from official sources,
                        provide live countdowns, and let you build your personal watchlist — all for free.
                    </p>
                </section>

                {/* Features Grid */}
                <section style={{ marginBottom: '3rem' }}>
                    <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Zap size={24} color="#eab308" />
                        What We Offer
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        {features.map((feature, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(30, 41, 59, 0.3)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'transform 0.2s, border-color 0.2s'
                            }}>
                                <div style={{ color: '#06b6d4', marginBottom: '0.75rem' }}>{feature.icon}</div>
                                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data Sources */}
                <section style={{
                    background: 'rgba(6, 182, 212, 0.05)',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    border: '1px solid rgba(6, 182, 212, 0.1)'
                }}>
                    <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>
                        📊 Our Data Sources
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        We aggregate information from trusted sources to ensure accuracy:
                    </p>
                    <ul style={{ color: '#94a3b8', lineHeight: 2, paddingLeft: '1.5rem' }}>
                        <li><strong style={{ color: '#06b6d4' }}>IGDB</strong> - Internet Games Database (primary source)</li>
                        <li>Official publisher announcements and press releases</li>
                        <li>Steam, PlayStation Store, Xbox Marketplace listings</li>
                        <li>Developer social media and community updates</li>
                    </ul>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Release dates are updated regularly. Some dates may change based on developer announcements.
                    </p>
                </section>

                {/* Team Section */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Users size={24} color="#22c55e" />
                        <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>The Team</h2>
                    </div>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        NextPlay is built and maintained by passionate gamers who wanted a better way to track
                        upcoming releases. We're a small, independent team dedicated to creating the best
                        game tracking experience possible.
                    </p>
                    <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
                        Have suggestions or found an issue? We'd love to hear from you!
                        <Link to="/contact" style={{ color: '#06b6d4', marginLeft: '0.5rem' }}>Contact us →</Link>
                    </p>
                </section>

                {/* CTA Section */}
                <section style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>
                        Ready to Start Tracking?
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Browse our complete catalog and build your 2026 gaming wishlist.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                            Browse Games
                        </Link>
                        <Link to="/calendar" style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            View Calendar
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
};

export default About;
