import { useEffect, useMemo } from 'react';
import { SITE_CONFIG, SEO_DEFAULTS } from '../utils/constants';
import {
    getCanonicalUrl,
    generateBreadcrumbSchema,
    generateGameSchema,
    generateGameListSchema,
    generateFAQSchema,
    truncateDescription
} from '../utils/seoHelpers';

/**
 * Enhanced SEO Component - Dynamic meta tags, structured data, and programmatic SEO
 * 
 * Features:
 * - Dynamic title and meta tags
 * - Open Graph and Twitter Card support
 * - Canonical URLs
 * - Structured data (JSON-LD) for games, lists, breadcrumbs
 * - FAQ schema support
 * - No external dependencies (works with React 18/19)
 */
const SEO = ({
    title,
    description,
    image,
    url,
    type = 'website',
    gameData = null,
    gameList = null,
    breadcrumbs = null,
    faqData = null,
    noIndex = false,
    keywords = null,
    author = null,
    publishedTime = null,
    modifiedTime = null
}) => {
    // Memoize computed values
    const computedTitle = useMemo(() => {
        if (!title) return SEO_DEFAULTS.defaultTitle;
        if (title.includes(SITE_CONFIG.name)) return title;
        return `${title} | ${SITE_CONFIG.name}`;
    }, [title]);

    const computedDescription = useMemo(() => {
        return truncateDescription(description || SEO_DEFAULTS.defaultDescription);
    }, [description]);

    const canonicalUrl = useMemo(() => {
        return url || getCanonicalUrl('/');
    }, [url]);

    const computedImage = useMemo(() => {
        return image || SITE_CONFIG.defaultImage;
    }, [image]);

    useEffect(() => {
        // Update document title
        document.title = computedTitle;

        // Helper to update or create meta tags
        const updateMeta = (name, content, isProperty = false, isHttpEquiv = false) => {
            if (!content) return null;

            let attrName = 'name';
            if (isProperty) attrName = 'property';
            if (isHttpEquiv) attrName = 'http-equiv';

            let element = document.querySelector(`meta[${attrName}="${name}"]`);

            if (element) {
                element.setAttribute('content', content);
            } else {
                element = document.createElement('meta');
                element.setAttribute(attrName, name);
                element.setAttribute('content', content);
                document.head.appendChild(element);
            }
            return element;
        };

        // Helper to update or create link tags
        const updateLink = (rel, href, type = null) => {
            if (!href) return null;

            let selector = `link[rel="${rel}"]`;
            if (type) selector += `[type="${type}"]`;

            let element = document.querySelector(selector);

            if (element) {
                element.setAttribute('href', href);
            } else {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                element.setAttribute('href', href);
                if (type) element.setAttribute('type', type);
                document.head.appendChild(element);
            }
            return element;
        };

        // Basic meta tags
        updateMeta('description', computedDescription);
        if (keywords) updateMeta('keywords', keywords);
        if (author) updateMeta('author', author);
        updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

        // Canonical URL
        updateLink('canonical', canonicalUrl);

        // Open Graph tags
        updateMeta('og:title', computedTitle, true);
        updateMeta('og:description', computedDescription, true);
        updateMeta('og:type', type, true);
        updateMeta('og:url', canonicalUrl, true);
        updateMeta('og:image', computedImage, true);
        updateMeta('og:image:alt', computedTitle, true);
        updateMeta('og:site_name', SITE_CONFIG.name, true);
        updateMeta('og:locale', 'en_US', true);

        // Article-specific OG tags
        if (type === 'article') {
            if (publishedTime) updateMeta('article:published_time', publishedTime, true);
            if (modifiedTime) updateMeta('article:modified_time', modifiedTime, true);
        }

        // Twitter Card tags
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:site', SITE_CONFIG.twitterHandle);
        updateMeta('twitter:title', computedTitle);
        updateMeta('twitter:description', computedDescription);
        updateMeta('twitter:image', computedImage);
        updateMeta('twitter:image:alt', computedTitle);

        // Remove existing structured data scripts
        const existingScripts = document.querySelectorAll('script[data-seo]');
        existingScripts.forEach(script => script.remove());

        // Add game-specific structured data
        if (gameData) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo', 'game');
            script.textContent = JSON.stringify(generateGameSchema(gameData, canonicalUrl));
            document.head.appendChild(script);
        }

        // Add game list structured data
        if (gameList && gameList.games?.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo', 'list');
            script.textContent = JSON.stringify(
                generateGameListSchema(gameList.games, gameList.name, gameList.description)
            );
            document.head.appendChild(script);
        }

        // Add breadcrumb structured data
        if (breadcrumbs && breadcrumbs.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo', 'breadcrumb');
            script.textContent = JSON.stringify(generateBreadcrumbSchema(breadcrumbs));
            document.head.appendChild(script);
        }

        // Add FAQ structured data
        if (faqData && faqData.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo', 'faq');
            script.textContent = JSON.stringify(generateFAQSchema(faqData));
            document.head.appendChild(script);
        }

        // Cleanup on unmount - restore defaults
        return () => {
            document.title = SEO_DEFAULTS.defaultTitle;

            // Remove all SEO-added structured data
            const scripts = document.querySelectorAll('script[data-seo]');
            scripts.forEach(script => script.remove());
        };
    }, [
        computedTitle,
        computedDescription,
        canonicalUrl,
        computedImage,
        type,
        gameData,
        gameList,
        breadcrumbs,
        faqData,
        noIndex,
        keywords,
        author,
        publishedTime,
        modifiedTime
    ]);

    // This component doesn't render anything
    return null;
};

export default SEO;
