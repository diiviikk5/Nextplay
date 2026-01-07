import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb Component - Enhances navigation and SEO
 * 
 * Features:
 * - Semantic HTML (nav + ol structure)
 * - Accessible with aria labels
 * - Responsive design
 * - Internal linking for SEO juice
 */
const Breadcrumb = ({ items = [], showHome = true }) => {
    if (items.length === 0 && !showHome) return null;

    const allItems = showHome
        ? [{ name: 'Home', path: '/' }, ...items]
        : items;

    return (
        <nav
            aria-label="Breadcrumb"
            className="breadcrumb"
            style={{
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
            }}
        >
            <ol
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.5rem',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                }}
                itemScope
                itemType="https://schema.org/BreadcrumbList"
            >
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li
                            key={item.path || index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {index > 0 && (
                                <ChevronRight
                                    size={14}
                                    style={{ color: '#475569', flexShrink: 0 }}
                                    aria-hidden="true"
                                />
                            )}

                            {isLast ? (
                                <span
                                    style={{
                                        color: '#94a3b8',
                                        fontWeight: 500
                                    }}
                                    itemProp="name"
                                    aria-current="page"
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    to={item.path}
                                    style={{
                                        color: '#64748b',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        transition: 'color 0.2s'
                                    }}
                                    itemProp="item"
                                    onMouseOver={(e) => e.target.style.color = '#06b6d4'}
                                    onMouseOut={(e) => e.target.style.color = '#64748b'}
                                >
                                    {isFirst && <Home size={14} aria-hidden="true" />}
                                    <span itemProp="name">{item.name}</span>
                                </Link>
                            )}

                            <meta itemProp="position" content={index + 1} />
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
