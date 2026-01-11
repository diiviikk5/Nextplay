import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, HelpCircle, Bug, Lightbulb } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' }
    ];

    const subjectOptions = [
        { value: 'general', label: 'General Inquiry', icon: <HelpCircle size={16} /> },
        { value: 'bug', label: 'Report a Bug', icon: <Bug size={16} /> },
        { value: 'suggestion', label: 'Feature Suggestion', icon: <Lightbulb size={16} /> },
        { value: 'data', label: 'Data Correction', icon: <AlertCircle size={16} /> },
        { value: 'business', label: 'Business/Partnership', icon: <Mail size={16} /> }
    ];

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission (replace with actual form handler like Formspree, Netlify Forms, etc.)
        try {
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStatus({
                type: 'success',
                message: 'Thank you for your message! We\'ll get back to you within 24-48 hours.'
            });
            setFormData({ name: '', email: '', subject: 'general', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Something went wrong. Please try again or email us directly.'
            });
        }

        setIsSubmitting(false);
    };

    const inputStyles = {
        width: '100%',
        padding: '0.875rem 1rem',
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    return (
        <>
            <SEO
                title="Contact Us - NextPlay 2026"
                description="Get in touch with the NextPlay 2026 team. Report bugs, suggest features, request data corrections, or just say hello. We typically respond within 24-48 hours."
                url={getCanonicalUrl('/contact')}
                breadcrumbs={breadcrumbs}
                keywords="contact nextplay, game tracker support, report bug, suggest feature"
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>/</span>
                    <span>Contact</span>
                </nav>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                    }}>
                        <MessageSquare color="#0a0e17" size={32} />
                    </div>
                    <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.75rem' }}>
                        Get in Touch
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                        Have a question, found a bug, or want to suggest a feature? We'd love to hear from you!
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Contact Form */}
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.3)',
                        borderRadius: '16px',
                        padding: '2rem',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <h2 className="font-heading" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem' }}>
                            Send us a Message
                        </h2>

                        {status.message && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${status.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                            }}>
                                {status.type === 'success' ?
                                    <CheckCircle size={20} color="#22c55e" /> :
                                    <AlertCircle size={20} color="#ef4444" />
                                }
                                <span style={{ color: status.type === 'success' ? '#22c55e' : '#ef4444' }}>
                                    {status.message}
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    style={inputStyles}
                                />
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    style={inputStyles}
                                />
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                                    Subject
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    style={{ ...inputStyles, cursor: 'pointer' }}
                                >
                                    {subjectOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tell us what's on your mind..."
                                    rows={5}
                                    style={{ ...inputStyles, resize: 'vertical', minHeight: '120px' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                {isSubmitting ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & FAQ */}
                    <div>
                        {/* Direct Contact */}
                        <div style={{
                            background: 'rgba(6, 182, 212, 0.05)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(6, 182, 212, 0.1)'
                        }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={20} color="#06b6d4" />
                                Email Us Directly
                            </h3>
                            <a href="mailto:hello@nextplaygame.me" style={{
                                color: '#06b6d4',
                                textDecoration: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600
                            }}>
                                hello@nextplaygame.me
                            </a>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                We typically respond within 24-48 hours.
                            </p>
                        </div>

                        {/* Quick Help */}
                        <div style={{
                            background: 'rgba(30, 41, 59, 0.3)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Common Questions</h3>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <h4 style={{ color: '#06b6d4', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    A release date is wrong, can you fix it?
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                    Yes! Use the "Data Correction" subject and provide the correct date with a source.
                                </p>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <h4 style={{ color: '#06b6d4', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    Can you add a specific game?
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                    We pull data from IGDB. If a game is listed there, we can add it.
                                </p>
                            </div>

                            <div>
                                <h4 style={{ color: '#06b6d4', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    Is NextPlay free to use?
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                    Yes, 100% free! We're ad-supported to keep the service running.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
