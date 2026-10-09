import { useState } from 'react';
import { Link, PageHead, Cover } from '../components/ui.jsx';
import { PLATFORMS } from '../lib/platforms.js';

function Tiles({ items, hrefOf, min = '200px' }) {
  return (
    <div className="tiles" style={{ '--min': min }}>
      {items.map((x) => (
        <Link key={x.slug} to={hrefOf(x)} className="tile" data-f={x.code ? PLATFORMS[x.code]?.family : undefined}>
          <span className="name">{x.name}</span>
          <span className="num">
            <b>{x.upcoming}</b> upcoming · {x.total} total
          </span>
        </Link>
      ))}
    </div>
  );
}

function Filterable({ items, render, label }) {
  const [q, setQ] = useState('');
  const shown = q ? items.filter((x) => x.name.toLowerCase().includes(q.toLowerCase())) : items;
  return (
    <>
      <label className="sr-only" htmlFor="dir-filter">
        Filter {label}
      </label>
      <input id="dir-filter" type="search" className="search-trigger" style={{ display: 'flex', width: 'min(360px, 100%)', marginBottom: 20, color: 'var(--text)' }} placeholder={`Filter ${label}…`} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      {shown.length ? render(shown) : <p className="faint">No {label} match “{q}”.</p>}
    </>
  );
}

// Index pages: /platform, /genre, /developer, /publisher, /series
export default function Directory({ data, route }) {
  const { seo } = data;
  if (route.page === 'platformIndex') {
    return (
      <>
        <PageHead crumbs={seo.crumbs} title="Games by platform" lede="Upcoming and new games for every console, PC, VR headset and phone." />
        <section className="container section" style={{ paddingTop: 0 }}>
          <Tiles items={data.items} hrefOf={(x) => `/platform/${x.slug}`} />
        </section>
      </>
    );
  }
  if (route.page === 'genreIndex') {
    return (
      <>
        <PageHead crumbs={seo.crumbs} title="Games by genre" lede="Every genre and theme we track, sorted by how many games are on the way." />
        <section className="container section" style={{ paddingTop: 0 }}>
          <h2 className="h2" style={{ marginBottom: 16 }}>
            Genres
          </h2>
          <Tiles items={data.genres} hrefOf={(x) => `/genre/${x.slug}`} />
        </section>
        <section className="container section">
          <h2 className="h2" style={{ marginBottom: 16 }}>
            Themes
          </h2>
          <Tiles items={data.themes} hrefOf={(x) => `/genre/${x.slug}`} />
        </section>
      </>
    );
  }
  if (route.page === 'companyIndex') {
    const label = data.kind === 'developer' ? 'studios' : 'publishers';
    return (
      <>
        <PageHead crumbs={seo.crumbs} title={data.kind === 'developer' ? 'Game studios' : 'Game publishers'} lede={`The ${label} behind the games people are waiting for.`} />
        <section className="container section" style={{ paddingTop: 0 }}>
          <Filterable items={data.items} label={label} render={(items) => <Tiles items={items} hrefOf={(x) => `/${data.kind}/${x.slug}`} min="220px" />} />
        </section>
      </>
    );
  }
  // series
  return (
    <>
      <PageHead crumbs={seo.crumbs} title="Game series in order" lede="Every entry of the biggest franchises in release order — including what's coming next." />
      <section className="container section" style={{ paddingTop: 0 }}>
        <Filterable
          items={data.items}
          label="series"
          render={(items) => (
            <div className="grid">
              {items.map((s) => (
                <article className="card" key={s.slug}>
                  <div className="card-cover">
                    <Cover id={s.cover} alt="" />
                  </div>
                  <h2 className="card-title">
                    <Link to={`/series/${s.slug}`}>{s.name}</Link>
                  </h2>
                  <p className="card-meta">
                    {s.total} games{s.upcoming ? <span className="accent"> · {s.upcoming} upcoming</span> : null}
                  </p>
                </article>
              ))}
            </div>
          )}
        />
      </section>
    </>
  );
}
