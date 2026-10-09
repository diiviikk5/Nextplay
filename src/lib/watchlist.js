import { useSyncExternalStore } from 'react';

const KEY = 'np_watchlist_v2';
const listeners = new Set();
let cache = null;

function read() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    cache = [];
  }
  return cache;
}

function write(list) {
  cache = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — keep in-memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

const EMPTY = [];

export function useWatchlist() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    list,
    has: (slug) => list.some((g) => g.slug === slug),
    toggle: (game) => {
      const cur = read();
      const exists = cur.some((g) => g.slug === game.slug);
      const { slug, name, cover, date, precision, platforms } = game;
      write(exists ? cur.filter((g) => g.slug !== slug) : [{ slug, name, cover, date, precision, platforms, addedAt: Date.now() }, ...cur]);
      return !exists;
    },
    remove: (slug) => write(read().filter((g) => g.slug !== slug)),
  };
}

// One-file calendar export so people get reminded on release day.
export function toIcs(games) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ymd = (ts) => new Date(ts * 1000).toISOString().slice(0, 10).replace(/-/g, '');
  const next = (ts) => ymd(ts + 86400);
  const events = games
    .filter((g) => g.date && g.precision === 'day')
    .map((g) => [
      'BEGIN:VEVENT',
      `UID:${g.slug}@nextplaygame.me`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(g.date)}`,
      `DTEND;VALUE=DATE:${next(g.date)}`,
      `SUMMARY:${g.name.replace(/[,;]/g, '\\$&')} releases`,
      `URL:https://nextplaygame.me/game/${g.slug}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT12H',
      'ACTION:DISPLAY',
      `DESCRIPTION:${g.name.replace(/[,;]/g, '\\$&')} is out tomorrow`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NextPlay//Release Calendar//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
}

export function downloadIcs(games, filename = 'nextplay-releases.ics') {
  const blob = new Blob([toIcs(games)], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
