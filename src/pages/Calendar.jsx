import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import gamesData from '../data/games.json';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import GameCard from '../components/GameCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { MONTHS, PLATFORM_FILTERS } from '../utils/constants';
import { getCanonicalUrl, generateCalendarSEO } from '../utils/seoHelpers';

const Calendar = () => {
    const { month: urlMonth } = useParams();
    const { isWatched, toggleWatch } = useWatchlist();
    const [selectedMonth, setSelectedMonth] = useState(urlMonth || null);
    const [platformFilter, setPlatformFilter] = useState('All');

    const platforms = PLATFORM_FILTERS;

    // Group games by month
    const gamesByMonth = useMemo(() => {
        const grouped = {};
        MONTHS.forEach(m => { grouped[m.num] = []; });

        gamesData.forEach(game => {
            const month = game.releaseDate.substring(5, 7);
            if (grouped[month]) {
                if (platformFilter === 'All' || game.platforms.some(p => p.includes(platformFilter.replace(' Series X/S', '')))) {
                    grouped[month].push(game);
                }
            }
        });

        // Sort each month by release date
        Object.keys(grouped).forEach(m => {
            grouped[m].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        });

        return grouped;
    }, [platformFilter]);

    const selectedMonthData = selectedMonth ? MONTHS.find(m => m.num === selectedMonth) : null;
    const selectedGames = selectedMonth ? gamesByMonth[selectedMonth] : [];

    // Generate iCal for a game
    const generateICS = (game) => {
        const date = new Date(game.releaseDate);
        const dateStr = date.toISOString().replace(/[-:]/g, '').split('T')[0];

        const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NextPlay 2026//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:${dateStr}
DTEND;VALUE=DATE:${dateStr}
SUMMARY:${game.title} Release
DESCRIPTION:${game.title} releases today! Platforms: ${game.platforms.join(', ')}
URL:https://nextplaygame.me/game/${game.slug}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${game.slug}-release.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Generate Google Calendar link
    const getGoogleCalendarLink = (game) => {
        const date = new Date(game.releaseDate);
        const dateStr = date.toISOString().replace(/[-:]/g, '').split('T')[0];
        const title = encodeURIComponent(`${game.title} Release`);
        const details = encodeURIComponent(`${game.title} releases today!\n\nPlatforms: ${game.platforms.join(', ')}\n\nMore info: https://nextplaygame.me/game/${game.slug}`);
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}`;
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <SEO
                title={selectedMonthData
                    ? `${selectedMonthData.name} 2026 Game Releases | Release Calendar | NextPlay`
                    : "2026 Video Game Release Calendar | All Months | NextPlay"
                }
                description={selectedMonthData
                    ? `All video games releasing in ${selectedMonthData.name} 2026. ${selectedGames.length} games including major titles. Add to your calendar!`
                    : "Complete 2026 video game release calendar. Browse all months, filter by platform, and add releases to Google Calendar or iCal."
                }
                url={getCanonicalUrl(`/calendar${selectedMonth ? `/${selectedMonth}` : ''}`)}
                breadcrumbs={selectedMonthData ? [
                    { name: 'Calendar', path: '/calendar' },
                    { name: `${selectedMonthData.name} 2026`, path: `/calendar/${selectedMonth}` }
                ] : [
                    { name: 'Calendar', path: '/calendar' }
                ]}
                gameList={selectedGames.length > 0 ? {
                    name: selectedMonthData ? `${selectedMonthData.name} 2026 Releases` : '2026 Game Releases',
                    description: `Video games releasing ${selectedMonthData ? `in ${selectedMonthData.name}` : 'throughout'} 2026`,
                    games: selectedGames.slice(0, 10)
                } : null}
            />

            {/* Breadcrumb */}
            <Breadcrumb items={selectedMonthData ? [
                { name: 'Calendar', path: '/calendar' },
                { name: `${selectedMonthData.name} 2026`, path: `/calendar/${selectedMonth}` }
            ] : [
                { name: 'Calendar', path: '/calendar' }
            ]} />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                        borderRadius: '4px',
                        color: '#0a0e17',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: '1rem'
                    }}
                >
                    <CalendarIcon size={14} /> RELEASE CALENDAR
                </div>
                <h1 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {selectedMonthData ? `${selectedMonthData.name.toUpperCase()} 2026` : '2026 RELEASE CALENDAR'}
                </h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                    {selectedMonthData
                        ? `${selectedGames.length} games releasing this month`
                        : 'Browse all 2026 game releases by month. Add to your calendar!'
                    }
                </p>
            </div>

            {/* Back button when viewing a month */}
            {selectedMonth && (
                <button
                    onClick={() => setSelectedMonth(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#94a3b8',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '1.5rem'
                    }}
                >
                    <ChevronLeft size={18} /> All Months
                </button>
            )}

            {/* Platform Filter */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
            }}>
                {platforms.map(p => (
                    <button
                        key={p}
                        onClick={() => setPlatformFilter(p)}
                        style={{
                            padding: '0.625rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            background: platformFilter === p ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255,255,255,0.05)',
                            color: platformFilter === p ? '#0a0e17' : '#94a3b8',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Month Grid or Game List */}
            {!selectedMonth ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1rem'
                }}>
                    {MONTHS.map(month => {
                        const games = gamesByMonth[month.num];
                        const topGames = games.slice(0, 3);
                        return (
                            <button
                                key={month.num}
                                onClick={() => setSelectedMonth(month.num)}
                                className="glass glass-hover"
                                style={{
                                    padding: '1.25rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    background: 'rgba(255,255,255,0.03)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                                        {month.name.toUpperCase()}
                                    </h3>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: games.length > 0 ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: games.length > 0 ? '#06b6d4' : '#64748b'
                                    }}>
                                        {games.length} games
                                    </span>
                                </div>

                                {/* Preview of top games */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {topGames.map(game => (
                                        <div
                                            key={game.id}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                border: '2px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
                                            <img
                                                src={game.image}
                                                alt={game.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                    {games.length > 3 && (
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '6px',
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            color: '#64748b'
                                        }}>
                                            +{games.length - 3}
                                        </div>
                                    )}
                                    {games.length === 0 && (
                                        <span style={{ color: '#475569', fontSize: '0.8rem' }}>No releases yet</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                /* Games for selected month */
                <div>
                    {selectedGames.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {selectedGames.map(game => {
                                const date = new Date(game.releaseDate);
                                const dayNum = date.getDate();
                                return (
                                    <div
                                        key={game.id}
                                        className="glass"
                                        style={{
                                            padding: '1rem',
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'center',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        {/* Day */}
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a0e17' }}>{dayNum}</span>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#0a0e17', opacity: 0.7 }}>{selectedMonthData?.short}</span>
                                        </div>

                                        {/* Game Image */}
                                        <Link to={`/game/${game.slug}`} style={{ flexShrink: 0 }}>
                                            <img
                                                src={game.image}
                                                alt={game.title}
                                                style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                        </Link>

                                        {/* Game Info */}
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <Link to={`/game/${game.slug}`} style={{ textDecoration: 'none' }}>
                                                <h3 className="font-heading" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                                                    {game.title}
                                                </h3>
                                            </Link>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                {game.platforms.slice(0, 3).join(' • ')}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <a
                                                href={getGoogleCalendarLink(game)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Add to Google Calendar"
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    borderRadius: '6px',
                                                    color: '#94a3b8',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <CalendarIcon size={16} />
                                            </a>
                                            <button
                                                onClick={() => generateICS(game)}
                                                title="Download .ics"
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: '#94a3b8',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={() => toggleWatch(game.id)}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    background: isWatched(game.id) ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: isWatched(game.id) ? '#06b6d4' : '#94a3b8',
                                                    cursor: 'pointer',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {isWatched(game.id) ? '★ Watching' : '☆ Watch'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: '#64748b' }}>No games releasing this month{platformFilter !== 'All' ? ` for ${platformFilter}` : ''}.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Calendar;
