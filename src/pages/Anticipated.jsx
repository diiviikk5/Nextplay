import { Link, Cover, PageHead, PlatformChips, When, WatchButton } from '../components/ui.jsx';

export default function Anticipated({ data }) {
  const { items, seo, builtAt } = data;
  const year = new Date(builtAt * 1000).getUTCFullYear();
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Ranked by follower hype" title={data.year ? `The ${items.length} most anticipated games of ${data.year}` : `The 100 most anticipated games of ${year}–${year + 1}`} lede={`Ranked by how many players follow each unreleased game on IGDB, not by our opinion. Updated ${data.updated}.`} />
      {data.years?.length ? (
        <nav className="container row" aria-label="By year" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <Link to="/most-anticipated" className="btn btn-sm" aria-current={!data.year ? 'page' : undefined}>
            All upcoming
          </Link>
          {data.years.map((y) => (
            <Link key={y} to={`/most-anticipated/${y}`} className="btn btn-sm" aria-current={data.year === y ? 'page' : undefined}>
              {y}
            </Link>
          ))}
        </nav>
      ) : null}
      <section className="container" aria-label="Ranking">
        <ol className="rank-list" role="list">
          {items.map((g) => (
            <li key={g.id} className="rank-row">
              <span className="n">{g.rank}</span>
              <Cover id={g.cover} alt="" sizes="64px" eager={g.rank <= 4} />
              <div style={{ minWidth: 0 }}>
                <h2 className="title" style={{ fontSize: '1.05rem' }}>
                  <Link to={`/game/${g.slug}`}>{g.name}</Link>
                </h2>
                <p className="sub">{[g.developer, g.summary].filter(Boolean).join(' — ')}</p>
                <div style={{ marginTop: 8 }}>
                  <PlatformChips platforms={g.platforms} />
                </div>
              </div>
              <span className="side" style={{ display: 'grid', gap: 8, justifyItems: 'end', position: 'relative', zIndex: 2 }}>
                <When game={g} relative={false} />
                <WatchButton game={g} inline />
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
