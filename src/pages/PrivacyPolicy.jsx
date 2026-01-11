import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

const PrivacyPolicy = () => {
    const lastUpdated = 'January 11, 2026';

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' }
    ];

    return (
        <>
            <SEO
                title="Privacy Policy - NextPlay 2026"
                description="Read NextPlay 2026's privacy policy. Learn how we collect, use, and protect your data. We respect your privacy and are committed to transparency."
                url={getCanonicalUrl('/privacy')}
                breadcrumbs={breadcrumbs}
                noIndex={false}
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>/</span>
                    <span>Privacy Policy</span>
                </nav>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Shield size={32} color="#06b6d4" />
                        <h1 className="font-heading" style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Privacy Policy</h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Last updated: {lastUpdated}</p>
                </div>

                {/* Content */}
                <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>1. Introduction</h2>
                        <p>
                            Welcome to NextPlay 2026 ("we," "our," or "us"). We are committed to protecting your privacy
                            and being transparent about how we handle your information. This Privacy Policy explains
                            what information we collect, how we use it, and your rights regarding that information.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>2. Information We Collect</h2>

                        <h3 style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '0.5rem' }}>2.1 Information You Provide</h3>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li><strong>Watchlist Data:</strong> Games you add to your watchlist are stored locally in your browser (localStorage)</li>
                            <li><strong>Tier List Data:</strong> Your tier list rankings are stored locally in your browser</li>
                            <li><strong>Contact Information:</strong> If you contact us, we may collect your email address and message content</li>
                        </ul>

                        <h3 style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '0.5rem' }}>2.2 Automatically Collected Information</h3>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li><strong>Usage Data:</strong> Pages visited, time spent, interactions (via analytics)</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
                            <li><strong>IP Address:</strong> Used for analytics and security purposes</li>
                            <li><strong>Cookies:</strong> See our Cookie section below</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>3. How We Use Your Information</h2>
                        <p>We use collected information to:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>Provide and maintain our service</li>
                            <li>Improve user experience and site functionality</li>
                            <li>Analyze site usage and trends</li>
                            <li>Respond to your inquiries</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Display relevant advertisements (see Advertising section)</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>4. Cookies and Tracking Technologies</h2>
                        <p style={{ marginBottom: '1rem' }}>We use cookies and similar technologies for:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics)</li>
                            <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads (Google AdSense)</li>
                        </ul>
                        <p>
                            You can control cookies through your browser settings. Note that disabling cookies may
                            affect site functionality.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>5. Third-Party Services</h2>
                        <p style={{ marginBottom: '1rem' }}>We use the following third-party services:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li><strong>Google Analytics:</strong> Website analytics -{' '}
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                    Google Privacy Policy
                                </a>
                            </li>
                            <li><strong>Google AdSense:</strong> Advertising -{' '}
                                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                    How Google uses data
                                </a>
                            </li>
                            <li><strong>Vercel:</strong> Hosting provider -{' '}
                                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                    Vercel Privacy Policy
                                </a>
                            </li>
                            <li><strong>IGDB:</strong> Game data provider -{' '}
                                <a href="https://www.igdb.com/privacy_policy" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                    IGDB Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>6. Advertising</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We may display advertisements through Google AdSense. These ads may use cookies to serve
                            ads based on your visits to this and other websites. You can opt out of personalized
                            advertising by visiting{' '}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                Google Ads Settings
                            </a>.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>7. Data Storage and Security</h2>
                        <p>
                            Most user data (watchlists, tier lists) is stored locally in your browser and never leaves
                            your device. We do not have access to this data. For data we do collect (analytics, contact
                            forms), we implement appropriate security measures to protect against unauthorized access.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>8. Your Rights (GDPR/CCPA)</h2>
                        <p style={{ marginBottom: '1rem' }}>Depending on your location, you may have the right to:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing of your data</li>
                            <li>Request data portability</li>
                            <li>Opt-out of sale of personal information (California residents)</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>
                            To exercise these rights, please <Link to="/contact" style={{ color: '#06b6d4' }}>contact us</Link>.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>9. Children's Privacy</h2>
                        <p>
                            Our service is not directed at children under 13. We do not knowingly collect personal
                            information from children. If you believe we have collected data from a child, please
                            contact us immediately.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>10. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by
                            posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'rgba(6, 182, 212, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>11. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Email: privacy@nextplaygame.me</li>
                            <li>Contact Form: <Link to="/contact" style={{ color: '#06b6d4' }}>nextplaygame.me/contact</Link></li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
