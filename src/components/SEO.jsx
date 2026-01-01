import { useEffect } from 'react';

/**
 * SEO Component - Updates document head for dynamic page SEO
 * Works with React 19 without external dependencies
 */
const SEO = ({
    title,
    description,
    image,
    url,
    type = 'website',
    gameData = null
}) => {
    useEffect(() => {
        // Update title
        if (title) {
            document.title = title;
        }

        // Helper to update or create meta tags
        const updateMeta = (property, content, isProperty = false) => {
            if (!content) return;

            const attribute = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${property}"]`);

            if (element) {
                element.setAttribute('content', content);
            } else {
                element = document.createElement('meta');
                element.setAttribute(attribute, property);
                element.setAttribute('content', content);
                document.head.appendChild(element);
            }
        };

        // Update meta tags
        updateMeta('description', description);

        // Open Graph
        updateMeta('og:title', title, true);
        updateMeta('og:description', description, true);
        updateMeta('og:type', type, true);
        if (url) updateMeta('og:url', url, true);
        if (image) updateMeta('og:image', image, true);

        // Twitter
        updateMeta('twitter:title', title);
        updateMeta('twitter:description', description);
        if (image) updateMeta('twitter:image', image);

        // Add game-specific structured data
        if (gameData) {
            const existingScript = document.querySelector('script[data-seo="game"]');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo', 'game');
            script.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "VideoGame",
                "name": gameData.title,
                "description": gameData.description || `${gameData.title} is an upcoming video game releasing in 2026.`,
                "gamePlatform": gameData.platforms || [],
                "genre": gameData.genres || [],
                "datePublished": gameData.releaseDate,
                "image": gameData.image,
                "url": url,
                "publisher": {
                    "@type": "Organization",
                    "name": gameData.publishers?.[0] || "TBA"
                },
                "developer": {
                    "@type": "Organization",
                    "name": gameData.developers?.[0] || "TBA"
                }
            });
            document.head.appendChild(script);
        }

        // Cleanup on unmount - restore defaults
        return () => {
            document.title = 'NextPlay 2026 | GTA 6 Release Date Countdown & All 2026 Game Releases Calendar';

            // Remove game-specific structured data
            const gameScript = document.querySelector('script[data-seo="game"]');
            if (gameScript) {
                gameScript.remove();
            }
        };
    }, [title, description, image, url, type, gameData]);

    return null; // This component doesn't render anything
};

export default SEO;
