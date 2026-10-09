// Date + number formatting. All dates are unix seconds (IGDB) and formatted in UTC so build-time
// HTML and the hydrated client agree.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MON = MONTHS.map((m) => m.slice(0, 3));
export const MONTH_SLUGS = MONTHS.map((m) => m.toLowerCase());
export { MONTHS };

const DAY = 86400;

export function parts(ts) {
  const d = new Date(ts * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), wd: d.getUTCDay() };
}

// Precision-aware release label: "Nov 19, 2026" | "November 2026" | "Q2 2027" | "2027" | "TBA"
export function releaseLabel(ts, precision = 'day', { long = false } = {}) {
  if (!ts || precision === 'tbd') return 'TBA';
  const { y, m, d } = parts(ts);
  switch (precision) {
    case 'day':
      return long ? `${MONTHS[m]} ${d}, ${y}` : `${MON[m]} ${d}, ${y}`;
    case 'month':
      return `${long ? MONTHS[m] : MON[m]} ${y}`;
    case 'q1':
    case 'q2':
    case 'q3':
    case 'q4':
      return `${precision.toUpperCase()} ${y}`;
    case 'year':
      return `${y}`;
    default:
      return `${MON[m]} ${d}, ${y}`;
  }
}

export function shortDate(ts) {
  const { m, d } = parts(ts);
  return `${MON[m]} ${d}`;
}

export function isoDate(ts) {
  return ts ? new Date(ts * 1000).toISOString().slice(0, 10) : null;
}

export function monthKey(ts) {
  const { y, m } = parts(ts);
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

export function monthPath(y, m) {
  return `/releases/${y}/${MONTH_SLUGS[m]}`;
}

// Whole days between now and a release (ceil), negative once released.
export function daysUntil(ts, now) {
  return Math.ceil((ts - now) / DAY);
}

export function isReleased(game, now) {
  return !!game.date && game.precision === 'day' ? game.date <= now : false;
}

// Human relative phrase used in cards: "Today", "Tomorrow", "in 12 days", "3 days ago"
export function relativeDay(ts, now) {
  const startOfToday = Math.floor(now / DAY) * DAY;
  const diff = Math.round((Math.floor(ts / DAY) * DAY - startOfToday) / DAY);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff < 60) return `in ${diff} days`;
  if (diff < -1 && diff > -60) return `${-diff} days ago`;
  return null;
}

export function compact(n) {
  if (n == null) return '';
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K`;
  return String(n);
}

export function plural(n, word, pluralWord = `${word}s`) {
  return `${n.toLocaleString('en-US')} ${n === 1 ? word : pluralWord}`;
}

export function listJoin(items, conj = 'and') {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} ${conj} ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, ${conj} ${items[items.length - 1]}`;
}

export function truncate(text = '', max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '') + '…';
}
