import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation } from 'react-router';
import { Search, Bookmark, Menu, X } from 'lucide-react';
import { Link, NavLink } from './ui.jsx';
import { useWatchlist } from '../lib/watchlist.js';
import { useStore } from '../lib/data.jsx';

const yearOf = (ts) => new Date(ts * 1000).getUTCFullYear();

const SearchDialog = lazy(() => import('./SearchDialog.jsx'));

const nav = (y) => [
  ['/upcoming', 'Upcoming'],
  ['/new-releases', 'Out now'],
  ['/trending', 'Trending'],
  [`/releases/${y}`, 'Calendar'],
  ['/most-anticipated', 'Most anticipated'],
  ['/tier-list', 'Tier list'],
];

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="NextPlay home">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 10 12">
          <path d="M0 0l10 6-10 6z" />
        </svg>
      </span>
      nextplay
    </Link>
  );
}

export function Header() {
  // Menu is open only for the path it was opened on, so navigating closes it without an effect.
  const [openFor, setOpenFor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { list } = useWatchlist();
  const { pathname } = useLocation();
  const NAV = nav(yearOf(useStore().builtAt));

  const open = openFor === pathname;

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName))) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="container">
        <Logo />
        <nav className="nav" aria-label="Main">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search games">
            <Search size={16} aria-hidden="true" />
            Search 7,000+ games
            <kbd>/</kbd>
          </button>
          <button type="button" className="icon-btn menu-btn" onClick={() => setSearchOpen(true)} aria-label="Search games">
            <Search size={20} aria-hidden="true" />
          </button>
          <Link to="/watchlist" className="icon-btn" aria-label={`Watchlist (${list.length} games)`}>
            <Bookmark size={20} aria-hidden="true" />
            {list.length ? <span className="count">{list.length}</span> : null}
          </Link>
          <button type="button" className="icon-btn menu-btn" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpenFor(open ? null : pathname)}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Mobile">
        {NAV.concat([
          ['/platform', 'Platforms'],
          ['/genre', 'Genres'],
          ['/series', 'Game series'],
          ['/can-i-run-it', 'Can I run it?'],
        ]).map(([to, label]) => (
          <Link key={to} to={to}>
            {label}
          </Link>
        ))}
      </nav>
      {searchOpen ? (
        <Suspense fallback={null}>
          <SearchDialog onClose={() => setSearchOpen(false)} />
        </Suspense>
      ) : null}
    </header>
  );
}

const footer = (y) => [
  ['Release dates', [['/upcoming', 'Upcoming games'], ['/new-releases', 'New releases'], [`/releases/${y}`, `${y} calendar`], [`/releases/${y + 1}`, `${y + 1} calendar`], ['/most-anticipated', 'Most anticipated'], [`/best-games/${y}`, `Best of ${y}`]]],
  ['Platforms', [['/platform/playstation-5', 'PS5'], ['/platform/xbox-series-x-s', 'Xbox Series X|S'], ['/platform/nintendo-switch-2', 'Switch 2'], ['/platform/pc', 'PC'], ['/platform/mac', 'Mac'], ['/platform', 'All platforms']]],
  ['Explore', [['/trending', 'Trending now'], ['/genre', 'Genres'], ['/series', 'Game series'], ['/developer', 'Studios'], ['/can-i-run-it', 'Can I run it?'], ['/tier-list', 'Tier list maker']]],
  ['NextPlay', [['/about', 'About'], ['/news', 'News'], ['/blog', 'Blog'], ['/contact', 'Contact'], ['/privacy', 'Privacy'], ['/terms', 'Terms']]],
];

export function Footer({ updated }) {
  const FOOTER = footer(yearOf(useStore().builtAt));
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p style={{ marginTop: 14, maxWidth: '36ch' }}>Release dates, countdowns and what to play next — for every platform. Built by a gamer, refreshed daily.</p>
            {updated ? <p className="mono" style={{ marginTop: 14, fontSize: 12 }}>Data updated {updated}</p> : null}
          </div>
          {FOOTER.map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2>{title}</h2>
              <ul role="list">
                {links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} NextPlay · nextplaygame.me</span>
          <span>
            Game data from <a href="https://www.igdb.com" rel="noopener">IGDB</a> and Steam. Artwork © respective owners.
          </span>
        </div>
      </div>
    </footer>
  );
}
