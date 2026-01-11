import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

const Terms = () => {
    const lastUpdated = 'January 11, 2026';

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' }
    ];

    return (
        <>
            <SEO
                title="Terms of Service - NextPlay 2026"
                description="Read the Terms of Service for NextPlay 2026. By using our website, you agree to these terms. Learn about acceptable use, intellectual property, and more."
                url={getCanonicalUrl('/terms')}
                breadcrumbs={breadcrumbs}
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>/</span>
                    <span>Terms of Service</span>
                </nav>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <FileText size={32} color="#06b6d4" />
                        <h1 className="font-heading" style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Terms of Service</h1>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Last updated: {lastUpdated}</p>
                </div>

                {/* Content */}
                <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using NextPlay 2026 ("the Service"), you accept and agree to be bound by
                            these Terms of Service. If you do not agree to these terms, please do not use our website.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>2. Description of Service</h2>
                        <p>
                            NextPlay 2026 is a free video game release tracking platform that allows users to:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Browse upcoming video game releases for 2026</li>
                            <li>Create personal watchlists</li>
                            <li>Build tier lists and rankings</li>
                            <li>Compare games</li>
                            <li>Export release dates to calendars</li>
                            <li>Access game information including release dates, platforms, and descriptions</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>3. User Responsibilities</h2>
                        <p style={{ marginBottom: '1rem' }}>When using our Service, you agree to:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not attempt to interfere with or disrupt the Service</li>
                            <li>Not attempt to access areas or features not intended for you</li>
                            <li>Not use automated tools to scrape or collect data without permission</li>
                            <li>Not impersonate others or misrepresent your identity</li>
                            <li>Comply with all applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>4. Intellectual Property</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: '#06b6d4' }}>Our Content:</strong> The NextPlay 2026 website design, logo,
                            and original content are owned by us and protected by copyright and trademark laws.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: '#06b6d4' }}>Third-Party Content:</strong> Game titles, artwork,
                            screenshots, and related materials belong to their respective publishers and developers.
                            We display this content under fair use for informational purposes.
                        </p>
                        <p>
                            <strong style={{ color: '#06b6d4' }}>Data Attribution:</strong> Game data is sourced primarily
                            from IGDB (Internet Games Database). We acknowledge and respect their intellectual property rights.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>5. Disclaimer of Warranties</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                            EITHER EXPRESS OR IMPLIED.
                        </p>
                        <p style={{ marginBottom: '1rem' }}>We do not guarantee:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>Accuracy of release dates (dates may change based on developer decisions)</li>
                            <li>Completeness of game information</li>
                            <li>Uninterrupted or error-free service</li>
                            <li>That the Service will meet your specific requirements</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>6. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXTPLAY 2026 SHALL NOT BE LIABLE FOR ANY
                            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
                            LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>7. User-Generated Content</h2>
                        <p>
                            When you create tier lists, watchlists, or other content using our Service, you retain
                            ownership of your selections. However, by sharing such content (e.g., via share links),
                            you grant us a non-exclusive license to display and distribute that content.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>8. Third-Party Links and Advertising</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Our Service may contain links to third-party websites and display advertisements. We are
                            not responsible for the content, privacy practices, or accuracy of external sites.
                        </p>
                        <p>
                            We use Google AdSense for advertising. By using our Service, you acknowledge that
                            third-party advertising partners may collect data as described in our{' '}
                            <Link to="/privacy" style={{ color: '#06b6d4' }}>Privacy Policy</Link>.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>9. Modifications to Service</h2>
                        <p>
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any
                            time without notice. We may also update these Terms of Service periodically. Continued
                            use of the Service after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>10. Termination</h2>
                        <p>
                            We may terminate or restrict your access to the Service immediately, without prior notice,
                            for any violation of these Terms or for any other reason at our sole discretion.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>11. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with applicable laws,
                            without regard to principles of conflict of laws.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>12. Severability</h2>
                        <p>
                            If any provision of these Terms is found to be unenforceable or invalid, that provision
                            shall be limited or eliminated to the minimum extent necessary, and the remaining
                            provisions shall remain in full force and effect.
                        </p>
                    </section>

                    <section style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'rgba(6, 182, 212, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                        <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>13. Contact</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Email: legal@nextplaygame.me</li>
                            <li>Contact Form: <Link to="/contact" style={{ color: '#06b6d4' }}>nextplaygame.me/contact</Link></li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Terms;
