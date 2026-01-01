import React, { useMemo } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import gamesData from '../data/games.json';
import GameCard from '../components/GameCard';
import SEO from '../components/SEO';
import { Download, Calendar, Archive, Trash2 } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

const Watchlist = () => {
    const { watchlist, toggleWatch, isWatched } = useWatchlist();

    const watchedGames = useMemo(() => {
        return gamesData.filter(g => watchlist.includes(g.id))
            .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    }, [watchlist]);

    const groupedByMonth = useMemo(() => {
        const groups = {};
        watchedGames.forEach(game => {
            const date = parseISO(game.releaseDate);
            const monthYear = isValid(date) ? format(date, 'MMMM yyyy') : 'TBA 2026';
            if (!groups[monthYear]) groups[monthYear] = [];
            groups[monthYear].push(game);
        });
        return groups;
    }, [watchedGames]);

    const exportCSV = () => {
        const headers = ['Title', 'Release Date', 'Platforms', 'Genres', 'Developers'];
        const rows = watchedGames.map(g => [
            `"${g.title}"`,
            g.releaseDate,
            `"${g.platforms.join('; ')}"`,
            `"${g.genres.join('; ')}"`,
            `"${g.developers.join('; ')}"`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "stellar-watchlist-2026.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportICS = () => {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Stellar Upcoming//EN\n";

        watchedGames.forEach(game => {
            const date = parseISO(game.releaseDate);
            if (isValid(date)) {
                const dateStr = format(date, "yyyyMMdd");
                icsContent += "BEGIN:VEVENT\n";
                icsContent += `SUMMARY:Release: ${game.title}\n`;
                icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
                icsContent += `DESCRIPTION:Launch on ${game.platforms.join(', ')}\n`;
                icsContent += "END:VEVENT\n";
            }
        });

        icsContent += "END:VCALENDAR";
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "stellar-games-2026.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title="My 2026 Game Watchlist | NextPlay - Track Upcoming Releases"
                description="Track your personal watchlist of upcoming 2026 video games. Get countdowns, export to calendar, and never miss a release date."
                url="https://nextplaygame.me/watchlist"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                <div>
                    <h1 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>
                        Your <span className="gradient-text">Watchlist</span>
                    </h1>
                    <p style={{ color: '#94a3b8' }}>
                        {watchedGames.length === 0
                            ? "You haven't added any games to your watchlist yet."
                            : `You are tracking ${watchedGames.length} upcoming games for 2026.`}
                    </p>
                </div>

                {watchedGames.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <button
                            onClick={exportCSV}
                            className="btn-secondary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                flex: '1 1 auto',
                                justifyContent: 'center',
                                minHeight: '44px'
                            }}
                        >
                            <Download size={18} />
                            CSV
                        </button>
                        <button
                            onClick={exportICS}
                            className="btn-secondary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                flex: '1 1 auto',
                                justifyContent: 'center',
                                minHeight: '44px'
                            }}
                        >
                            <Calendar size={18} />
                            Calendar
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to clear your watchlist?')) {
                                    localStorage.removeItem('stellar_watchlist');
                                    window.location.reload();
                                }
                            }}
                            className="btn-secondary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#f87171',
                                borderColor: 'rgba(239, 68, 68, 0.2)',
                                flex: '1 1 auto',
                                justifyContent: 'center',
                                minHeight: '44px'
                            }}
                        >
                            <Trash2 size={18} />
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {watchedGames.length === 0 ? (
                <div
                    className="glass"
                    style={{
                        padding: '5rem 2rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '2px dashed rgba(255,255,255,0.1)'
                    }}
                >
                    <Archive size={64} style={{ color: '#334155', marginBottom: '1.5rem' }} />
                    <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>The Archive is Empty</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '400px' }}>
                        Start browsing the 2026 release schedule and hit the star icon on titles you want to track.
                    </p>
                    <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Games</a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    {Object.entries(groupedByMonth).map(([month, games]) => (
                        <div key={month}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(168, 85, 247, 0.1)',
                                        border: '1px solid rgba(168, 85, 247, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Calendar size={20} color="#c084fc" />
                                </div>
                                <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{month}</h2>
                                <div style={{ flexGrow: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{games.length} Games</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
                                {games.map(game => (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        isWatched={true}
                                        onToggleWatch={toggleWatch}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
