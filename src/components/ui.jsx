import { Link as RRLink, NavLink as RRNavLink } from 'react-router';
import { Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react';
import { usePrefetch, useNow, useTicker } from '../lib/data.jsx';
import { useWatchlist } from '../lib/watchlist.js';
import { cover as coverUrl, coverSrcSet } from '../lib/images.js';
import { releaseLabel, relativeDay, shortDate } from '../lib/format.js';
import { PLATFORMS, platformShort, sortPlatforms } from '../lib/platforms.js';

// Links prefetch their route JSON on hover/focus/touch.
export function Link({ to, onMouseEnter, onFocus, onTouchStart, ...rest }) {
  const prefetch = usePrefetch();
  return (
    <RRLink
      to={to}
      onMouseEnter={(e) => (prefetch(to), onMouseEnter?.(e))}
      onFocus={(e) => (prefetch(to), onFocus?.(e))}
      onTouchStart={(e) => (prefetch(to), onTouchStart?.(e))}
      {...rest}
    />
  );
}

export function NavLink({ to, ...rest }) {
  const prefetch = usePrefetch();
  return <RRNavLink to={to} onMouseEnter={() => prefetch(to)} onFocus={() => prefetch(to)} {...rest} />;
}

export function Cover({ id, alt, eager = false, sizes = '(max-width: 640px) 45vw, 200px', className }) {
  if (!id) return <div className={`card-cover-empty ${className || ''}`} aria-hidden="true" />;
  return (
    <img
      src={coverUrl(id)}
      srcSet={coverSrcSet(id)}
      sizes={sizes}
      alt={alt}
      width="264"
      height="352"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={className}
    />
  );
}

export function PlatformChips({ platforms = [], max = 4, link = false }) {
  const list = sortPlatforms(platforms);
  const shown = list.slice(0, max);
  return (
    <ul className="chips" role="list" aria-label="Platforms">
      {shown.map((p) => (
        <li key={p}>
          {link && PLATFORMS[p]?.slug ? (
            <Link className="chip" data-p data-f={PLATFORMS[p]?.family} to={`/platform/${PLATFORMS[p].slug}`}>
              {platformShort(p)}
            </Link>
          ) : (
            <span className="chip" data-p data-f={PLATFORMS[p]?.family}>
              {platformShort(p)}
            </span>
          )}
        </li>
      ))}
      {list.length > max && (
        <li>
          <span className="chip chip-outline" title={list.slice(max).map(platformShort).join(', ')}>
            +{list.length - max}
          </span>
        </li>
      )}
    </ul>
  );
}

export function RatingBadge({ value }) {
  if (!value) return null;
  const tier = value >= 80 ? 'high' : value >= 65 ? 'mid' : 'low';
  return (
    <span className="rating" data-tier={tier} title={`Average rating ${value}/100`}>
      {value}
    </span>
  );
}

// "Oct 21" / "Today" / "Q2 2027" — precision-aware, relative when close.
export function When({ game, relative = true }) {
  const now = useNow();
  if (!game.date || game.precision === 'tbd') return <span className="when">TBA</span>;
  if (game.precision !== 'day') return <span className="when">{releaseLabel(game.date, game.precision)}</span>;
  const rel = relative ? relativeDay(game.date, now) : null;
  const thisYear = new Date(now * 1000).getUTCFullYear() === new Date(game.date * 1000).getUTCFullYear();
  return (
    <time className="when" dateTime={new Date(game.date * 1000).toISOString().slice(0, 10)} title={releaseLabel(game.date, 'day', { long: true })}>
      {rel && Math.abs(Math.round((game.date - now) / 86400)) <= 14 ? rel : thisYear ? shortDate(game.date) : releaseLabel(game.date, 'day')}
    </time>
  );
}

export function WatchButton({ game, variant = 'icon', inline = false }) {
  const { has, toggle } = useWatchlist();
  const on = has(game.slug);
  const label = on ? `Remove ${game.name} from watchlist` : `Add ${game.name} to watchlist`;
  if (variant === 'icon') {
    return (
      <button type="button" className={`watch${inline ? ' watch-inline' : ''}`} aria-pressed={on} aria-label={label} title={label} onClick={() => toggle(game)}>
        {on ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
      </button>
    );
  }
  return (
    <button type="button" className="btn" aria-pressed={on} onClick={() => toggle(game)}>
      {on ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
      {on ? 'On your watchlist' : 'Add to watchlist'}
    </button>
  );
}

export function GameCard({ game, eager = false, showRating = true, rank }) {
  const now = useNow();
  const isToday = game.precision === 'day' && relativeDay(game.date, now) === 'Today';
  const justOut = game.precision === 'day' && game.date <= now && now - game.date < 7 * 86400;
  return (
    <article className="card">
      <div className="card-cover">
        <Cover id={game.cover} alt="" eager={eager} />
        <div className="card-badges">
          <span>
            {rank ? <span className="chip chip-accent">#{rank}</span> : null}
            {!rank && isToday ? <span className="chip chip-hot">Out today</span> : null}
            {!rank && !isToday && justOut ? <span className="chip chip-accent">New</span> : null}
          </span>
          {showRating && game.rating ? <RatingBadge value={game.rating} /> : null}
        </div>
      </div>
      <WatchButton game={game} />
      <h3 className="card-title">
        <Link to={`/game/${game.slug}`}>{game.name}</Link>
      </h3>
      <div className="card-meta">
        <When game={game} />
        <span aria-hidden="true">·</span>
        <span>{sortPlatforms(game.platforms).slice(0, 3).map(platformShort).join(' ') || '—'}</span>
      </div>
    </article>
  );
}

export function Grid({ games, eager = 0, large = false, ranked = false }) {
  return (
    <div className={`grid ${large ? 'grid-lg' : ''}`}>
      {games.map((g, i) => (
        <GameCard key={g.id} game={g} eager={i < eager} rank={ranked ? i + 1 : undefined} />
      ))}
    </div>
  );
}

export function Rail({ games, label }) {
  return (
    <div className="rail" role="list" aria-label={label}>
      {games.map((g) => (
        <div role="listitem" key={g.id}>
          <GameCard game={g} />
        </div>
      ))}
    </div>
  );
}

export function SectionHead({ title, sub, to, more = 'See all', as: H = 'h2', id }) {
  return (
    <div className="section-head">
      <div>
        <H className="h2" id={id}>
          {title}
        </H>
        {sub ? <p>{sub}</p> : null}
      </div>
      {to ? (
        <Link to={to} className="see-all">
          {more} <ChevronRight size={16} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

export function Crumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((c, i) => (
          <li key={c.path}>{i === items.length - 1 ? <span aria-current="page">{c.name}</span> : <Link to={c.path}>{c.name}</Link>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function Faq({ items, title = 'FAQ' }) {
  if (!items?.length) return null;
  return (
    <section className="section" aria-labelledby="faq">
      <h2 className="h2" id="faq" style={{ marginBottom: 12 }}>
        {title}
      </h2>
      <div className="faq">
        {items.map((f, i) => (
          <details key={f.q} open={i === 0}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Countdown({ to, builtAt, small = false }) {
  const now = useTicker(builtAt, 1000);
  let s = Math.max(0, Math.floor(to - now));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const units = [
    [d, d === 1 ? 'day' : 'days'],
    [h, 'hrs'],
    [m, 'min'],
    [s, 'sec'],
  ];
  return (
    <div className={`countdown ${small ? 'countdown-sm' : ''}`} role="timer" aria-label={`${d} days ${h} hours ${m} minutes until release`}>
      {units.map(([v, l]) => (
        <div className="unit" key={l}>
          <span className="v mono">{String(v).padStart(2, '0')}</span>
          <span className="l">{l}</span>
        </div>
      ))}
    </div>
  );
}

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  );
}

export function PageHead({ crumbs, eyebrow, title, lede, children }) {
  return (
    <header className="container page-head">
      {crumbs ? <Crumbs items={crumbs} /> : null}
      {eyebrow ? (
        <p className="eyebrow" style={{ marginTop: crumbs ? 22 : 0 }}>
          {eyebrow}
        </p>
      ) : null}
      <h1 style={{ marginTop: crumbs && !eyebrow ? 18 : 10 }}>{title}</h1>
      {lede ? <p className="lede">{lede}</p> : null}
      {children}
    </header>
  );
}
