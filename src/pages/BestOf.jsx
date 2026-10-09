import { Link, Cover, PageHead, PlatformChips, RatingBadge } from '../components/ui.jsx';

export default function BestOf({ data }) {
  const { year, items, seo } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow="Ranked by review scores"
        title={`The best games of ${year}`}
        lede="Ranked by critic scores where available, otherwise player ratings — weighted so a handful of perfect scores can't beat hundreds of great ones."
      />
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
                <p className="sub">{g.summary}</p>
                <div style={{ marginTop: 8 }}>
                  <PlatformChips platforms={g.platforms} />
                </div>
              </div>
              <span className="side" style={{ display: 'grid', gap: 6, justifyItems: 'end' }}>
                <RatingBadge value={g.ratingInfo.value} />
                <span className="faint">
                  {g.ratingInfo.label} · {g.ratingInfo.count}
                </span>
                {g.steamReviews ? <span className="faint">{g.steamReviews.label}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
