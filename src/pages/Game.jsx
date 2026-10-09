import { useState } from 'react';
import { CalendarPlus, Share2, Play, ExternalLink, Check, X as XIcon } from 'lucide-react';
import { Link, Cover, Countdown, Crumbs, Faq, Grid, SectionHead, PlatformChips, WatchButton, RatingBadge } from '../components/ui.jsx';
import { useNow } from '../lib/data.jsx';
import { shot, shotSrcSet, youtubeThumb } from '../lib/images.js';
import { releaseLabel, listJoin, compact } from '../lib/format.js';
import { PLATFORMS, PLATFORM_ORDER, platformName, sortPlatforms } from '../lib/platforms.js';
import { downloadIcs } from '../lib/watchlist.js';

const REGION = { worldwide: '', north_america: 'NA', europe: 'EU', japan: 'JP', asia: 'Asia', china: 'CN', korea: 'KR', australia: 'AU', new_zealand: 'NZ', brazil: 'BR' };
const TYPE_LABEL = { remake: 'Remake', remaster: 'Remaster', expanded: 'Expanded edition', port: 'Port', standalone: 'Standalone expansion' };
const STORES = [
  ['steam', 'Steam'],
  ['playstation', 'PlayStation Store'],
  ['xbox', 'Xbox Store'],
  ['nintendo', 'Nintendo eShop'],
  ['epic', 'Epic Games Store'],
  ['gog', 'GOG'],
  ['itch', 'itch.io'],
  ['meta', 'Meta Quest Store'],
  ['official', 'Official website'],
];

function headline(g, now) {
  const date = releaseLabel(g.date, g.precision, { long: true });
  const ea = g.early ? ' in Early Access' : '';
  const on = g.platforms.length ? ` on ${listJoin(sortPlatforms(g.platforms).map(platformName))}` : '';
  if (!g.date || g.precision === 'tbd') return <>No release date yet{on ? <>. Confirmed{on}</> : null}.</>;
  if (g.precision === 'day' && g.date <= now) return <>Released{ea} <strong>{date}</strong>{on}.</>;
  return <>Releases{ea} <strong>{g.precision === 'day' ? date : `in ${date}`}</strong>{on}.</>;
}

function Media({ game }) {
  const [active, setActive] = useState(game.videos.length ? { kind: 'video', id: game.videos[0].id } : game.screenshots[0] ? { kind: 'shot', id: game.screenshots[0] } : null);
  const [playing, setPlaying] = useState(false);
  if (!active) return null;
  const items = [...game.videos.slice(0, 2).map((v) => ({ kind: 'video', id: v.id, name: v.name })), ...game.screenshots.map((s) => ({ kind: 'shot', id: s }))];
  const video = game.videos.find((v) => v.id === active.id);
  return (
    <section aria-label="Trailer and screenshots">
      <div className="media-main">
        {active.kind === 'video' ? (
          playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
              title={`${game.name} – ${video?.name || 'Trailer'}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              <img src={youtubeThumb(active.id)} alt={`${game.name} ${video?.name || 'trailer'} thumbnail`} loading="lazy" />
              <button type="button" className="play" onClick={() => setPlaying(true)} aria-label={`Play ${game.name} ${video?.name || 'trailer'}`}>
                <span>
                  <Play size={28} fill="currentColor" aria-hidden="true" />
                </span>
                <em>{video?.name || 'Trailer'}</em>
              </button>
            </>
          )
        ) : (
          <img src={shot(active.id)} srcSet={shotSrcSet(active.id)} sizes="(max-width: 1000px) 100vw, 860px" alt={`${game.name} screenshot`} loading="lazy" />
        )}
      </div>
      {items.length > 1 ? (
        <div className="thumbs">
          {items.map((it) => (
            <button
              type="button"
              key={it.kind + it.id}
              aria-current={active.id === it.id}
              aria-label={it.kind === 'video' ? `Show ${it.name || 'trailer'}` : 'Show screenshot'}
              onClick={() => {
                setActive(it);
                setPlaying(false);
              }}
            >
              <img src={it.kind === 'video' ? youtubeThumb(it.id) : shot(it.id, 'screenshot_med')} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ReleaseTable({ game, now }) {
  const rows = game.releases.filter((r) => r.region === 'worldwide' || !game.releases.some((x) => x.platform === r.platform && x.region === 'worldwide'));
  if (!rows.length) return null;
  const sorted = [...rows].sort((a, b) => (a.date || Infinity) - (b.date || Infinity) || PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform));
  return (
    <section className="section" aria-labelledby="dates" style={{ paddingBottom: 0 }}>
      <h2 className="h2" id="dates" style={{ marginBottom: 14 }}>
        Release dates by platform
      </h2>
      <div className="avail">
        {sorted.map((r) => (
          <div className="avail-row" key={r.platform + r.region}>
            <span className="p">
              <span className="dot" data-f={PLATFORMS[r.platform].family} />
              {platformName(r.platform)}
              {REGION[r.region] ? <span className="chip chip-outline">{REGION[r.region]}</span> : null}
              {r.early ? <span className="chip chip-outline">Early access</span> : null}
            </span>
            <span className="d">
              {releaseLabel(r.date, r.precision, { long: true })}
              {r.date && r.precision === 'day' && r.date <= now ? ' · Out now' : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews({ game }) {
  const st = game.steam;
  const items = [];
  if (game.signals.critic && game.signals.criticCount >= 3) items.push({ label: 'Critic score', value: <RatingBadge value={game.signals.critic} />, sub: `${game.signals.criticCount} reviews` });
  if (st?.reviews?.total >= 10) items.push({ label: 'Steam reviews', value: <b>{st.reviews.label}</b>, sub: `${Math.round((st.reviews.positive / st.reviews.total) * 100)}% of ${compact(st.reviews.total)} positive` });
  if (game.signals.rating && game.signals.ratingCount >= 8) items.push({ label: 'Player score', value: <RatingBadge value={game.signals.rating} />, sub: `${game.signals.ratingCount} ratings on IGDB` });
  if (st?.players) items.push({ label: 'Playing now', value: <b className="mono">{st.players.toLocaleString('en-US')}</b>, sub: 'on Steam at last update' });
  if (!items.length) return null;
  return (
    <section className="section" aria-labelledby="reviews" style={{ paddingBottom: 0 }}>
      <h2 className="h2" id="reviews" style={{ marginBottom: 14 }}>
        Reviews & players
      </h2>
      <div className="tiles" style={{ '--min': '170px' }}>
        {items.map((it) => (
          <div className="tile" key={it.label}>
            <span className="eyebrow">{it.label}</span>
            <span style={{ fontSize: '1.1rem' }}>{it.value}</span>
            <span className="num">{it.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReqTable({ title, rows }) {
  if (!rows) return null;
  return (
    <div>
      <h3 className="eyebrow" style={{ marginBottom: 8 }}>
        {title}
      </h3>
      <table>
        <tbody>
          {rows
            .filter(([k]) => !/additional|note|sound/i.test(k))
            .slice(0, 6)
            .map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function ShareButton({ game }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = `https://nextplaygame.me/game/${game.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: game.name, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button type="button" className="btn" onClick={share}>
      {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}

export default function Game({ data }) {
  const { game, availability, faq, similar, moreFromDev, series, anticipatedRank, monthLink, hasRequirements, hasGamesLike, seo, builtAt } = data;
  const now = useNow();
  const upcoming = game.precision === 'day' && game.date > now;
  const backdrop = game.artworks[0] || game.screenshots[0];
  const st = game.steam;
  const stores = STORES.filter(([k]) => game.websites[k]);
  const dev = game.developers[0];
  const pubs = game.publishers.filter((p) => !game.developers.some((d) => d.slug === p.slug));

  return (
    <article>
      <header className="game-hero">
        <div className="backdrop" aria-hidden="true">
          {backdrop ? <img src={shot(backdrop, '1080p')} alt="" fetchPriority="high" /> : null}
        </div>
        <div className="container">
          <div style={{ paddingTop: 20 }}>
            <Crumbs items={seo.crumbs} />
          </div>
          <div className="game-hero-inner">
            <Cover id={game.cover} alt={`${game.name} cover art`} eager className="cover" sizes="(max-width: 760px) 112px, 240px" />
            <div className="gh-head">
              <div className="chips" style={{ marginBottom: 12 }}>
                {anticipatedRank ? (
                  <Link to="/most-anticipated" className="chip chip-accent">
                    #{anticipatedRank} most anticipated
                  </Link>
                ) : null}
                {TYPE_LABEL[game.type] ? <span className="chip">{TYPE_LABEL[game.type]}</span> : null}
                {game.early ? <span className="chip">Early access</span> : null}
                {game.status === 'cancelled' ? <span className="chip chip-hot">Cancelled</span> : null}
              </div>
              <h1>{game.name}</h1>
              {dev ? (
                <p className="by">
                  by <Link to={`/developer/${dev.slug}`}>{dev.name}</Link>
                  {pubs[0] ? (
                    <>
                      {' '}
                      · published by <Link to={`/publisher/${pubs[0].slug}`}>{pubs[0].name}</Link>
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>
            <div className="gh-body">
              <div className="answer">
                <p>{headline(game, now)}</p>
              </div>
              {upcoming ? <Countdown to={game.date} builtAt={builtAt} /> : null}
              <div className="hero-actions">
                <WatchButton game={game} variant="button" />
                {upcoming ? (
                  <button type="button" className="btn" onClick={() => downloadIcs([game], `${game.slug}.ics`)}>
                    <CalendarPlus size={17} aria-hidden="true" /> Add to calendar
                  </button>
                ) : null}
                <ShareButton game={game} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container game-layout">
        <div>
          <Media game={game} />

          {game.summary ? (
            <section className="section" aria-labelledby="about" style={{ paddingBottom: 0 }}>
              <h2 className="h2" id="about" style={{ marginBottom: 12 }}>
                About {game.name}
              </h2>
              <div className="prose">
                <p>{game.summary}</p>
                {game.storyline && game.storyline !== game.summary ? <p>{game.storyline}</p> : null}
              </div>
            </section>
          ) : null}

          <ReleaseTable game={game} now={now} />
          <Reviews game={game} />

          {st?.pc?.min ? (
            <section className="section" aria-labelledby="specs" style={{ paddingBottom: 0 }}>
              <SectionHead id="specs" title="PC system requirements" sub="Official specs from Steam" to={`/system-requirements/${game.slug}`} more="Full specs" />
              <div className="reqs">
                <ReqTable title="Minimum" rows={st.pc.min} />
                <ReqTable title="Recommended" rows={st.pc.rec} />
              </div>
            </section>
          ) : null}

          <Faq items={faq} title={`${game.name} FAQ`} />

          {series && series.games.length > 1 ? (
            <section className="section" aria-labelledby="series" style={{ paddingTop: 0 }}>
              <SectionHead id="series" title={`${series.name} series`} sub={`${series.games.length} games in release order`} to={`/series/${series.slug}`} more="Full timeline" />
              <ol className="rail" role="list">
                {series.games.map((g) => (
                  <li key={g.id} style={{ opacity: g.id === game.id ? 1 : 0.85 }}>
                    <Link to={`/game/${g.slug}`} className="card" aria-current={g.id === game.id ? 'page' : undefined}>
                      <div className="card-cover" style={g.id === game.id ? { outline: '2px solid var(--accent)', outlineOffset: 2 } : undefined}>
                        <Cover id={g.cover} alt="" />
                      </div>
                      <span className="card-title">{g.name}</span>
                      <span className="card-meta">{g.date && g.precision !== 'tbd' ? new Date(g.date * 1000).getUTCFullYear() : 'TBA'}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <aside aria-label="Game details">
          <section className="panel">
            <h2>Is it on…</h2>
            <div className="avail">
              {availability.map((a) => (
                <div className="avail-row" key={a.platform} data-on={a.yes}>
                  <span className="p">
                    <span className="dot" data-f={PLATFORMS[a.platform].family} data-off={!a.yes} />
                    {platformName(a.platform)}
                  </span>
                  <span className="d">{a.yes ? <Check size={16} aria-label="Yes" color="var(--accent)" /> : <XIcon size={16} aria-label="No" />}</span>
                </div>
              ))}
            </div>
            {game.platforms.filter((p) => !availability.some((a) => a.platform === p)).length ? (
              <p className="faint" style={{ fontSize: 13, marginTop: 10 }}>
                Also on {listJoin(game.platforms.filter((p) => !availability.some((a) => a.platform === p)).map(platformName))}.
              </p>
            ) : null}
          </section>

          {stores.length ? (
            <section className="panel">
              <h2>Where to get it</h2>
              <div className="stores">
                {stores.map(([k, label]) => (
                  <a key={k} href={game.websites[k]} target="_blank" rel="noopener nofollow">
                    {label}
                    {k === 'steam' && st?.free ? (
                      <span className="price">Free</span>
                    ) : k === 'steam' && st?.price ? (
                      <span className="price">
                        {st.price.discount ? <s>${st.price.initial.toFixed(2)}</s> : null}${st.price.final.toFixed(2)}
                      </span>
                    ) : (
                      <ExternalLink size={15} aria-hidden="true" color="var(--text-3)" />
                    )}
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <section className="panel">
            <h2>Details</h2>
            <dl className="kv">
              <dt>Release</dt>
              <dd>{monthLink ? <Link to={monthLink.path}>{releaseLabel(game.date, game.precision, { long: true })}</Link> : releaseLabel(game.date, game.precision, { long: true })}</dd>
              {game.genres.length ? (
                <>
                  <dt>Genre</dt>
                  <dd>
                    {game.genres.slice(0, 3).map((x, i) => (
                      <span key={x.slug}>
                        {i ? ', ' : ''}
                        <Link to={`/genre/${x.slug}`}>{x.name.replace(/\s*\(.*\)/, '')}</Link>
                      </span>
                    ))}
                  </dd>
                </>
              ) : null}
              {game.modes.length ? (
                <>
                  <dt>Modes</dt>
                  <dd>{game.modes.join(', ')}</dd>
                </>
              ) : null}
              {game.perspectives.length ? (
                <>
                  <dt>View</dt>
                  <dd>{game.perspectives.join(', ')}</dd>
                </>
              ) : null}
              {game.engines.length ? (
                <>
                  <dt>Engine</dt>
                  <dd>{game.engines[0]}</dd>
                </>
              ) : null}
              {game.ageRatings.ESRB || game.ageRatings.PEGI ? (
                <>
                  <dt>Rating</dt>
                  <dd>{[game.ageRatings.ESRB && `ESRB ${game.ageRatings.ESRB}`, game.ageRatings.PEGI && `PEGI ${game.ageRatings.PEGI}`].filter(Boolean).join(' · ')}</dd>
                </>
              ) : null}
              {st?.languages?.length ? (
                <>
                  <dt>Languages</dt>
                  <dd>{st.languages.length}</dd>
                </>
              ) : null}
            </dl>
            <div style={{ marginTop: 14 }}>
              <PlatformChips platforms={game.platforms} max={10} link />
            </div>
          </section>

          <nav className="panel" aria-label="More about this game">
            <h2>Explore</h2>
            <div className="stores">
              {hasGamesLike ? <Link to={`/games-like/${game.slug}`}>Games like {game.name}</Link> : null}
              {hasRequirements ? <Link to={`/system-requirements/${game.slug}`}>PC system requirements</Link> : null}
              {monthLink ? <Link to={monthLink.path}>All {monthLink.label} releases</Link> : null}
              {series ? <Link to={`/series/${series.slug}`}>{series.name} games in order</Link> : null}
            </div>
          </nav>
        </aside>
      </div>

      {similar.length ? (
        <section className="container section" aria-labelledby="similar">
          <SectionHead id="similar" title={`Games like ${game.name}`} to={hasGamesLike ? `/games-like/${game.slug}` : undefined} />
          <Grid games={similar.slice(0, 12)} />
        </section>
      ) : null}

      {moreFromDev.length && dev ? (
        <section className="container section" aria-labelledby="dev">
          <SectionHead id="dev" title={`More from ${dev.name}`} to={`/developer/${dev.slug}`} />
          <Grid games={moreFromDev} />
        </section>
      ) : null}
    </article>
  );
}
