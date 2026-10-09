import { useMemo, useState } from 'react';
import { Link, Grid, PageHead, SectionHead, Empty } from '../components/ui.jsx';
import { MONTHS } from '../lib/format.js';

// Platform, genre and platform×genre hubs share one layout.
export default function Hub({ data }) {
  const { name, kind, next, anticipated, recent, upcomingTotal, facets, seo, builtAt } = data;
  const year = new Date(builtAt * 1000).getUTCFullYear();
  const months = useMemo(() => {
    const keys = [...new Set(next.map((g) => new Date(g.date * 1000).getUTCMonth() + 12 * new Date(g.date * 1000).getUTCFullYear()))];
    return keys.map((k) => ({ key: k, label: `${MONTHS[k % 12].slice(0, 3)} ${Math.floor(k / 12)}` }));
  }, [next]);
  const [month, setMonth] = useState('all');
  const shown = month === 'all' ? next : next.filter((g) => new Date(g.date * 1000).getUTCMonth() + 12 * new Date(g.date * 1000).getUTCFullYear() === month);

  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow={kind === 'platform' ? 'Platform' : kind === 'genre' ? 'Genre' : 'Platform × genre'}
        title={`Upcoming ${name} games ${year}–${year + 1}`}
        lede={
          <>
            <b className="mono" style={{ color: 'var(--text)' }}>
              {upcomingTotal.toLocaleString('en-US')}
            </b>{' '}
            upcoming {name} games tracked, with release dates for every platform. Updated {data.updated}.
          </>
        }
      >
        {facets?.length ? (
          <nav aria-label="Related" className="chips" style={{ marginTop: 20 }}>
            {facets.map((f) => (
              <Link key={f.path} to={f.path} className="chip">
                {f.name}
                {f.count ? <span className="faint">{f.count}</span> : null}
              </Link>
            ))}
          </nav>
        ) : null}
      </PageHead>

      {anticipated.length ? (
        <section className="container section" aria-labelledby="anticipated" style={{ paddingTop: 8 }}>
          <SectionHead id="anticipated" title={`Most anticipated ${name} games`} />
          <Grid games={anticipated} eager={6} ranked />
        </section>
      ) : null}

      <section className="container section" aria-labelledby="next">
        <SectionHead id="next" title="Release schedule" sub="Confirmed dates, soonest first" />
        {months.length > 1 ? (
          <div className="filter-bar" role="group" aria-label="Filter by month">
            <button type="button" aria-pressed={month === 'all'} onClick={() => setMonth('all')}>
              All
            </button>
            {months.map((m) => (
              <button type="button" key={m.key} aria-pressed={month === m.key} onClick={() => setMonth(m.key)}>
                {m.label}
              </button>
            ))}
          </div>
        ) : null}
        {shown.length ? <Grid games={shown} /> : <Empty title="No confirmed dates yet">Check the most anticipated list above — dates land here as soon as they are announced.</Empty>}
      </section>

      {recent.length ? (
        <section className="container section" aria-labelledby="recent">
          <SectionHead id="recent" title={`New ${name} releases`} sub="Out in the last 90 days" to="/new-releases" />
          <Grid games={recent} />
        </section>
      ) : null}
    </>
  );
}
