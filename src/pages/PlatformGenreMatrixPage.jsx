import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Gamepad2, Monitor, ArrowLeft, Layers, Filter } from 'lucide-react';
import { slugify, unslugify } from '../utils/seoHelpers';
import { PLATFORM_CONFIG } from '../utils/constants';

const PlatformGenreMatrixPage = () => {
    const { platform: platformSlug, genre: genreSlug } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();

    // Map slugs back to names
    const platformName = useMemo(() => {
        if (!platformSlug) return 'All Platforms';
        const pLower = platformSlug.toLowerCase();
        if (pLower === 'ps5' || pLower === 'playstation-5') return 'PlayStation 5';
        if (pLower === 'ps4' || pLower === 'playstation-4') return 'PlayStation 4';
        if (pLower === 'pc') return 'PC';
        if (pLower === 'xbox' || pLower === 'xbox-series-x-s' || pLower === 'xbox-series-x') return 'Xbox Series X/S';
        if (pLower === 'switch' || pLower === 'nintendo-switch') return 'Nintendo Switch';
        if (pLower === 'switch-2' || pLower === 'nintendo-switch-2') return 'Nintendo Switch 2';
        if (pLower === 'mac' || pLower === 'macos') return 'Mac';
        return unslugify(platformSlug);
    }, [platformSlug]);

    const genreName = useMemo(() => {
        if (!genreSlug) return 'All Genres';
        const gLower = genreSlug.toLowerCase();
        if (gLower === 'rpg') return 'Role-playing (RPG)';
        if (gLower === 'fps' || gLower === 'shooter') return 'Shooter';
        return unslugify(genreSlug);
    }, [genreSlug]);

    const filteredGames = useMemo(() => {
        return gamesData.filter(game => {
            const matchesPlatform = !platformSlug || game.platforms?.some(p => {
                const pSlug = slugify(p);
                return pSlug === platformSlug || 
                    (platformSlug === 'ps5' && p.includes('PlayStation 5')) ||
                    (platformSlug === 'xbox' && p.includes('Xbox Series')) ||
                    (platformSlug === 'switch' && p.includes('Switch'));
            });

            const matchesGenre = !genreSlug || game.genres?.some(g => {
                const gSlug = slugify(g);
                return gSlug === genreSlug ||
                    (genreSlug === 'rpg' && (g.includes('RPG') || g.includes('Role-playing'))) ||
                    (genreSlug === 'fps' && g.includes('Shooter'));
            });

            return matchesPlatform && matchesGenre;
        });
    }, [platformSlug, genreSlug]);

    const pageTitle = `Top Upcoming ${platformName} ${genreName} Games Releasing in 2026 | NextPlay`;
    const pageDescription = `Browse every confirmed ${genreName} game launching on ${platformName} in 2026. Complete release schedule, live countdowns, trailers, and hype ratings.`;
    const canonicalUrl = `https://nextplaygame.me/games/${platformSlug}/${genreSlug}`;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={pageTitle}
                description={pageDescription}
                url={canonicalUrl}
            />

            <Breadcrumb
                items={[
                    { label: 'Home', path: '/' },
                    { label: platformName, path: `/platform/${platformSlug}` },
                    { label: genreName }
                ]}
            />

            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.8rem',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '20px',
                    color: '#06b6d4',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: '1rem'
                }}>
                    <Layers size={14} /> 2026 RELEASE MATRIX
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                    Upcoming {platformName} {genreName} Games (2026)
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '700px', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Found {filteredGames.length} confirmed 2026 {genreName.toLowerCase()} video games for {platformName}. Track release countdowns, system specs, and community hype.
                </p>
            </div>

            {/* Game Grid */}
            {filteredGames.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '4rem'
                }}>
                    {filteredGames.map(game => (
                        <GameCard
                            key={game.slug}
                            game={game}
                            isWatched={isWatched(game.id)}
                            onToggleWatch={() => toggleWatch(game.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px', marginBottom: '4rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No {genreName} games currently listed for {platformName} in 2026.</p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                        Browse All 2026 Games
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PlatformGenreMatrixPage;
