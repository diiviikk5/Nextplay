import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'nextplay_community_hype';

/**
 * Community Hype System
 * - Stores upvotes, downvotes, and user's own vote for each game
 * - Calculates dynamic hype percentage based on votes
 * - Persisted in localStorage (can be synced to backend later)
 */

// Get initial hype data
const getStoredHype = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

// Save hype data
const saveHype = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Context for global hype state
const HypeContext = createContext(null);

export const HypeProvider = ({ children }) => {
    const [hypeData, setHypeData] = useState(getStoredHype);

    // Save to localStorage whenever hypeData changes
    useEffect(() => {
        saveHype(hypeData);
    }, [hypeData]);

    /**
     * Get hype stats for a game
     */
    const getHype = useCallback((gameId) => {
        const data = hypeData[gameId] || { upvotes: 0, downvotes: 0, userVote: 0 };
        const totalVotes = data.upvotes + data.downvotes;

        // Calculate percentage: (upvotes / total) * 100, default to 50 if no votes
        let percentage = 50;
        if (totalVotes > 0) {
            percentage = Math.round((data.upvotes / totalVotes) * 100);
        }

        return {
            upvotes: data.upvotes,
            downvotes: data.downvotes,
            userVote: data.userVote, // 1 = upvoted, -1 = downvoted, 0 = no vote
            totalVotes,
            percentage
        };
    }, [hypeData]);

    /**
     * Vote on a game
     * @param gameId - Game ID
     * @param direction - 1 for upvote, -1 for downvote
     */
    const vote = useCallback((gameId, direction) => {
        setHypeData(prev => {
            const current = prev[gameId] || { upvotes: 0, downvotes: 0, userVote: 0 };
            const oldVote = current.userVote;

            // If clicking same direction, remove vote
            if (oldVote === direction) {
                return {
                    ...prev,
                    [gameId]: {
                        upvotes: current.upvotes - (direction === 1 ? 1 : 0),
                        downvotes: current.downvotes - (direction === -1 ? 1 : 0),
                        userVote: 0
                    }
                };
            }

            // New vote or changing vote
            let newUpvotes = current.upvotes;
            let newDownvotes = current.downvotes;

            // Remove old vote first
            if (oldVote === 1) newUpvotes--;
            if (oldVote === -1) newDownvotes--;

            // Add new vote
            if (direction === 1) newUpvotes++;
            if (direction === -1) newDownvotes++;

            return {
                ...prev,
                [gameId]: {
                    upvotes: Math.max(0, newUpvotes),
                    downvotes: Math.max(0, newDownvotes),
                    userVote: direction
                }
            };
        });
    }, []);

    /**
     * Get trending games (most upvotes)
     */
    const getTrending = useCallback((limit = 10) => {
        const entries = Object.entries(hypeData);
        return entries
            .filter(([_, data]) => data.upvotes > 0)
            .sort((a, b) => b[1].upvotes - a[1].upvotes)
            .slice(0, limit)
            .map(([gameId, data]) => ({
                gameId,
                ...data,
                percentage: data.upvotes + data.downvotes > 0
                    ? Math.round((data.upvotes / (data.upvotes + data.downvotes)) * 100)
                    : 50
            }));
    }, [hypeData]);

    return (
        <HypeContext.Provider value={{ getHype, vote, getTrending, hypeData }}>
            {children}
        </HypeContext.Provider>
    );
};

export const useHype = () => {
    const context = useContext(HypeContext);
    if (!context) {
        throw new Error('useHype must be used within HypeProvider');
    }
    return context;
};

export default HypeContext;
