import { ArrowRight } from 'lucide-react';
import { Link, Cover, Countdown, Grid, Rail, SectionHead, PlatformChips, WatchButton, When } from '../components/ui.jsx';
import { useNow } from '../lib/data.jsx';
import { shot } from '../lib/images.js';
import { releaseLabel } from '../lib/format.js';
import { platformShort } from '../lib/platforms.js';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Hero({ game, builtAt }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        {game.artwork ? <img src={shot(game.artwork, '1080p')} alt="" fetchPriority="high" /> : null}
      </div>
      <div className="container hero-inner">
        <div>
          <p className="eyebrow">
            <span className="accent">●</span> The biggest release on the calendar
          </p>
          <h2 id="hero-title" className="display">
            <Link to={`/game/${game.slug}`}>{game.name}</Link>
          </h2>
          <p className="lede">
            {releaseLabel(game.date, game.precision, { long: true })} · {game.platforms.map(platformShort).join(', ')}
            {game.developer ? ` · ${game.developer}` : ''}
          </p>
          {game.precision === 'day' ? <Countdown to={game.date} builtAt={builtAt} /> : null}
          <div className="hero-actions">
            <Link to={`/game/${game.slug}`} className="btn btn-accent">
              Release info <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <WatchButton game={game} variant="button" />
          </div>
        </div>
        <Link to={`/game/${game.slug}`} tabIndex={-1} aria-hidden="true">
          <Cover id={game.cover} alt="" eager className="hero-cover" sizes="220px" />
        </Link>
      </div>
    </section>
  );
}

function Radar({ days }) {
  const now = useNow();
  const today = Math.floor(now / 86400) * 86400;
  return (
    <div className="radar">
      {days.map((day) => {
        const d = new Date(day.ts * 1000);
        return (
          <section key={day.ts} className="radar-day" data-today={day.ts === today} aria-label={`${DOW[d.getUTCDay()]} ${d.getUTCDate()}`}>
            <header>
              <span className="dow">{day.ts === today ? 'Today' : DOW[d.getUTCDay()]}</span>
              <span className="dom">{d.getUTCDate()}</span>
            </header>
            {day.games.length ? (
              <ul role="list">
                {day.games.map((g) => (
                  <li key={g.id}>
                    <Link to={`/game/${g.slug}`}>
                      <Cover id={g.cover} alt="" sizes="30px" />
                      <span>{g.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="none">No major releases</p>
            )}
            {day.total > day.games.length ? <p className="more">+{day.total - day.games.length} more</p> : null}
          </section>
        );
      })}
    </div>
  );
}

export default function Home({ data }) {
  const { hero, radar, trending, outNow, anticipated, months, platforms, stats, builtAt } = data;
  const year = new Date(builtAt * 1000).getUTCFullYear();
  return (
    <>
      <h1 className="sr-only">Video game release dates, countdowns and upcoming games {year}–{year + 1}</h1>
      <Hero game={hero} builtAt={builtAt} />

      <section className="container section" aria-labelledby="radar">
        <SectionHead id="radar" title="Release radar" sub="Everything dropping in the next 7 days" to={`/releases/${year}`} more="Full calendar" />
        <Radar days={radar} />
      </section>

      <section className="container section" aria-labelledby="trending">
        <SectionHead id="trending" title="Trending right now" sub="Most visited, watched and played this week" to="/trending" />
        <Rail games={trending} label="Trending games" />
      </section>

      <section className="container section" aria-labelledby="outnow">
        <SectionHead id="outnow" title="Out now" sub="The best new releases from the last 30 days" to="/new-releases" />
        <Grid games={outNow} />
      </section>

      <section className="container section" aria-labelledby="anticipated">
        <SectionHead id="anticipated" title="Most anticipated" sub="Ranked by how many players are following them" to="/most-anticipated" more="Top 100" />
        <ol className="rank-list" role="list">
          {anticipated.map((g, i) => (
            <li key={g.id} className="rank-row">
              <span className="n">{i + 2}</span>
              <Cover id={g.cover} alt="" sizes="64px" />
              <div>
                <h3 className="title">
                  <Link to={`/game/${g.slug}`}>{g.name}</Link>
                </h3>
                <div style={{ marginTop: 6 }}>
                  <PlatformChips platforms={g.platforms} />
                </div>
              </div>
              <span className="side">
                <When game={g} relative={false} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      {months.map((m) => (
        <section key={m.path} className="container section" aria-label={`Coming in ${m.label}`}>
          <SectionHead title={`Coming in ${m.label}`} sub={`${m.total} games scheduled`} to={m.path} more={`All ${m.label.split(' ')[0]} releases`} />
          <Grid games={m.games} />
        </section>
      ))}

      <section className="container section" aria-labelledby="platforms">
        <SectionHead id="platforms" title="Browse by platform" to="/platform" more="All platforms" />
        <div className="tiles">
          {platforms.map((p) => (
            <Link key={p.code} to={`/platform/${p.slug}`} className="tile" data-f={p.code === 'ps5' ? 'playstation' : p.code === 'xsx' ? 'xbox' : p.code.startsWith('switch') ? 'nintendo' : 'pc'}>
              <span className="name">{p.name}</span>
              <span className="num">
                <b>{p.upcoming}</b> upcoming
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(20px, 4vw, 36px)' }}>
          <div>
            <p className="eyebrow">Tier list maker</p>
            <h2 className="h2" style={{ marginTop: 10 }}>
              Rank every {year} game. Share it in one tap.
            </h2>
            <p className="muted" style={{ marginTop: 8 }}>
              Drag covers into S–F, download a clean image, post it. No account needed.
            </p>
          </div>
          <Link to="/tier-list" className="btn btn-accent">
            Make your {year} tier list <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <p className="faint mono" style={{ marginTop: 24, fontSize: 12.5 }}>
          Tracking {stats.games.toLocaleString('en-US')} games · {stats.upcoming.toLocaleString('en-US')} upcoming · data updated {data.updated}
        </p>
      </section>
    </>
  );
}
