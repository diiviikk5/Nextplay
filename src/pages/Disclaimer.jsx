import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

const Disclaimer = () => {
    const lastUpdated = 'January 11, 2026';

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Disclaimer', path: '/disclaimer' }
    ];

    return (
        <>
            <SEO
                title="Disclaimer - NextPlay 2026"
                description="Important disclaimers for NextPlay 2026. Information about data accuracy, affiliate relationships, and content ownership."
                url={getCanonicalUrl('/disclaimer')}
                breadcrumbs={breadcrumbs}
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>/</span>
                    <span>Disclaimer</span>
                </nav>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <AlertTriangle size={32} color="#f97316" />
                        <h1 className="font-heading" style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Disclaimer</h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Last updated: {lastUpdated}</p>
                </div>

                {/* Content */}
                <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                    <section style={{
                        padding: '1.5rem',
                        background: 'rgba(249, 115, 22, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '0.75rem' }}>⚠️ Important Notice</h2>
                        <p style={{ margin: 0 }}>
                            Release dates displayed on NextPlay 2026 are subject to change at the discretion of
                            game developers and publishers. We strive for accuracy but cannot guarantee all
                            information is current at all times.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>1. Information Accuracy</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            The information provided on NextPlay 2026 is for general informational purposes only.
                            While we make every effort to ensure the accuracy of release dates, game information,
                            and other content, we cannot guarantee that all information is complete, accurate,
                            or up-to-date.
                        </p>
                        <p>
                            Game release dates are frequently changed or delayed by developers. We update our
                            database regularly, but there may be a delay between official announcements and
                            updates on our site.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>2. Not Affiliated with Game Publishers</h2>
                        <p>
                            NextPlay 2026 is an <strong style={{ color: '#06b6d4' }}>independent, fan-made project</strong>.
                            We are not affiliated with, endorsed by, or connected to any game developer,
                            publisher, or platform holder including but not limited to:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                            <li>Sony Interactive Entertainment (PlayStation)</li>
                            <li>Microsoft Corporation (Xbox)</li>
                            <li>Nintendo</li>
                            <li>Valve Corporation (Steam)</li>
                            <li>Rockstar Games</li>
                            <li>Electronic Arts</li>
                            <li>Ubisoft</li>
                            <li>Any other game developer or publisher</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>3. Third-Party Content & Trademarks</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            All game titles, artwork, screenshots, logos, and related materials are the
                            property of their respective owners. These materials are displayed on NextPlay 2026
                            under fair use for informational and educational purposes.
                        </p>
                        <p>
                            If you believe any content on our site infringes on your intellectual property
                            rights, please <Link to="/contact" style={{ color: '#06b6d4' }}>contact us</Link> immediately.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>4. Data Sources</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Game information on NextPlay 2026 is primarily sourced from:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>
                                <strong>IGDB (Internet Games Database)</strong> -{' '}
                                <a href="https://www.igdb.com" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                    igdb.com <ExternalLink size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                                </a>
                            </li>
                            <li>Official publisher press releases</li>
                            <li>Platform storefronts (Steam, PlayStation Store, Xbox Marketplace)</li>
                            <li>Verified news sources</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>5. Advertising Disclosure</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            NextPlay 2026 displays advertisements through Google AdSense to support the
                            operation of this free service. These advertisements:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>May be personalized based on your browsing activity</li>
                            <li>Are clearly distinguishable from editorial content</li>
                            <li>Do not influence our editorial decisions or game information</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>
                            For more information about how advertising works on our site, please see our{' '}
                            <Link to="/privacy" style={{ color: '#06b6d4' }}>Privacy Policy</Link>.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>6. External Links</h2>
                        <p>
                            Our website may contain links to external websites. We are not responsible for
                            the content, accuracy, or practices of any third-party sites. Following links
                            to external sites is at your own risk.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>7. User Responsibility</h2>
                        <p>
                            You are responsible for verifying release dates and game information before
                            making any purchasing decisions. We recommend checking official sources
                            (developer websites, official storefronts) for the most current information.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>8. No Professional Advice</h2>
                        <p>
                            The content on NextPlay 2026 does not constitute professional advice of any kind.
                            We provide information about video games for entertainment and informational
                            purposes only.
                        </p>
                    </section>

                    <section style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'rgba(6, 182, 212, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>Questions?</h2>
                        <p>
                            If you have any questions about this disclaimer, please{' '}
                            <Link to="/contact" style={{ color: '#06b6d4' }}>contact us</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Disclaimer;
