import { Link, Cover, Grid, PageHead, SectionHead } from '../components/ui.jsx';

export default function ReleasesYear({ data }) {
  const { year, years, months, fuzzy, biggest, total, seo } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Release calendar" title={`${year} video game release dates`} lede={`${total.toLocaleString('en-US')} games dated for ${year}, month by month. Pick a month for the full day-by-day list.`}>
        <nav aria-label="Years" className="filter-bar" style={{ marginTop: 22, marginBottom: 0 }}>
          {years.map((y) => (
            <Link key={y} to={`/releases/${y}`} className="chip" aria-current={y === year ? 'page' : undefined} style={y === year ? { background: 'var(--text)', color: 'var(--bg)' } : undefined}>
              {y}
            </Link>
          ))}
        </nav>
      </PageHead>

      <section className="container section" style={{ paddingTop: 8 }} aria-label="Months">
        <div className="tiles" style={{ '--min': '250px' }}>
          {months.map((m) =>
            m.total >= 6 ? (
              <Link key={m.name} to={m.path} className="tile" style={{ minHeight: 170 }}>
                <span className="row between">
                  <span className="name">{m.name}</span>
                  <span className="num">
                    <b>{m.total}</b> games
                  </span>
                </span>
                <span className="row" style={{ gap: 6 }} aria-hidden="true">
                  {m.games.map((g) => (
                    <span key={g.id} style={{ width: 44, flex: 'none' }}>
                      <Cover id={g.cover} alt="" sizes="44px" className="mini-cover" />
                    </span>
                  ))}
                </span>
                <span className="faint" style={{ fontSize: 13 }}>
                  {m.games.slice(0, 3).map((g) => g.name).join(' · ')}
                </span>
              </Link>
            ) : (
              <div key={m.name} className="tile" style={{ minHeight: 170, opacity: 0.55 }}>
                <span className="name">{m.name}</span>
                <span className="num">{m.total ? `${m.total} games` : 'Nothing dated yet'}</span>
              </div>
            )
          )}
        </div>
      </section>

      <section className="container section" aria-labelledby="biggest">
        <SectionHead id="biggest" title={`Biggest games of ${year}`} />
        <Grid games={biggest} />
      </section>

      {fuzzy.length ? (
        <section className="container section" aria-labelledby="fuzzy">
          <SectionHead id="fuzzy" title={`Coming in ${year}, no exact date`} sub="Announced for a quarter or just the year" />
          <Grid games={fuzzy} />
        </section>
      ) : null}
    </>
  );
}
