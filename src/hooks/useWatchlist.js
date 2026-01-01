
import { useState, useEffect } from 'react';

export const useWatchlist = () => {
    const [watchlist, setWatchlist] = useState(() => {
        const saved = localStorage.getItem('nextplay_watchlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('nextplay_watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const toggleWatch = (gameId) => {
        setWatchlist(prev =>
            prev.includes(gameId)
                ? prev.filter(id => id !== gameId)
                : [...prev, gameId]
        );
    };

    const isWatched = (gameId) => watchlist.includes(gameId);

    return { watchlist, toggleWatch, isWatched };
};
