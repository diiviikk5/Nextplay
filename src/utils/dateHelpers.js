import { format, parseISO } from 'date-fns';

/**
 * Check if a date is a placeholder (Dec 31 of any year - used when exact date unknown)
 */
export const isPlaceholderDate = (dateString) => {
    const date = parseISO(dateString);
    return date.getMonth() === 11 && date.getDate() === 31; // Month is 0-indexed
};

/**
 * Format release date - shows just year if placeholder, full date otherwise
 */
export const formatReleaseDate = (dateString, shortFormat = false) => {
    if (isPlaceholderDate(dateString)) {
        return format(parseISO(dateString), 'yyyy'); // Just "2026"
    }
    return shortFormat
        ? format(parseISO(dateString), 'MMM d')  // "Mar 15"
        : format(parseISO(dateString), 'MMMM dd, yyyy'); // "March 15, 2026"
};

/**
 * Format for card display
 */
export const formatCardDate = (dateString) => {
    if (isPlaceholderDate(dateString)) {
        return '2026';
    }
    return format(parseISO(dateString), 'MMM dd, yyyy');
};

/**
 * Get short date for carousels
 */
export const formatShortDate = (dateString) => {
    if (isPlaceholderDate(dateString)) {
        return '2026';
    }
    return format(parseISO(dateString), 'MMM d');
};
