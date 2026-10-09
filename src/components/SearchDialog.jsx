import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { cover } from '../lib/images.js';

let indexPromise = null;
export function loadSearchIndex() {
  indexPromise ||= fetch('/data/search-index.json')
    .then((r) => {
      if (!r.ok) throw new Error('Search is unavailable right now.');
      return r.json();
    })
    .then((rows) => rows.map(([slug, name, img, year, platforms]) => ({ slug, name, img, year, platforms, key: fold(name) })))
    .catch((e) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}

const fold = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// Index is pre-sorted by popularity, so a stable filter + prefix boost gives good ranking cheaply.
export function searchGames(index, q, limit = 12) {
  const query = fold(q);
  if (!query) return [];
  const terms = query.split(' ');
  const starts = [];
  const contains = [];
  for (const g of index) {
    if (!terms.every((t) => g.key.includes(t))) continue;
    (g.key.startsWith(query) || g.key.split(' ').some((w) => w.startsWith(terms[0])) ? starts : contains).push(g);
    if (starts.length >= limit) break;
  }
  return starts.concat(contains).slice(0, limit);
}

export default function SearchDialog({ onClose }) {
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const returnFocus = useRef(typeof document !== 'undefined' ? document.activeElement : null);

  useEffect(() => {
    loadSearchIndex().then(setIndex, (e) => setError(e.message));
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const restore = returnFocus.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      restore?.focus?.();
    };
  }, []);

  const results = useMemo(() => (index ? searchGames(index, q) : []), [index, q]);

  const go = (g) => {
    onClose();
    navigate(`/game/${g.slug}`);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[active]) go(results[active]);
      else if (q.trim()) {
        onClose();
        navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      }
    } else if (e.key === 'Tab') e.preventDefault(); // keep focus in the dialog; arrows move through results
  };

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label="Search games" onKeyDown={onKeyDown}>
        <div className="dialog-input">
          <Search size={18} aria-hidden="true" color="var(--text-3)" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="Search any game…"
            aria-label="Search games"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].slug}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <button type="button" className="btn btn-sm" onClick={onClose}>
            Esc
          </button>
        </div>
        <div className="dialog-results" id="search-results" role="listbox" aria-label="Results">
          {error ? (
            <p className="dialog-empty">{error}</p>
          ) : !index ? (
            <div style={{ display: 'grid', gap: 6, padding: 6 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 48 }} />
              ))}
            </div>
          ) : !q ? (
            <p className="dialog-empty">Type a game, e.g. “GTA VI”, “Hollow Knight” or “Resident Evil”.</p>
          ) : results.length === 0 ? (
            <p className="dialog-empty">No games match “{q}”. Try a shorter name.</p>
          ) : (
            results.map((g, i) => (
              <a
                key={g.slug}
                id={`sr-${g.slug}`}
                href={`/game/${g.slug}`}
                className="result"
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(g);
                }}
              >
                {g.img ? <img src={cover(g.img, 'cover_small')} alt="" width="36" height="48" loading="lazy" /> : <span />}
                <span className="t">{g.name}</span>
                <span className="y">{[g.year, g.platforms?.toUpperCase().replace('XSX', 'XBOX').replace('SWITCH-2', 'SW2')].filter(Boolean).join(' · ')}</span>
              </a>
            ))
          )}
        </div>
        <div className="dialog-foot" aria-hidden="true">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
