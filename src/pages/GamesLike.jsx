import { Link, Cover, PageHead, PlatformChips, When } from '../components/ui.jsx';

export default function GamesLike({ data }) {
  const { game, items, seo } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Recommendations" title={`${items.length} games like ${game.name}`} lede={`Games that share ${game.name}'s genres, themes and feel — upcoming and already out.`}>
        <Link to={`/game/${game.slug}`} className="row" style={{ marginTop: 20, gap: 12, width: 'fit-content' }}>
          <span style={{ width: 40 }}>
            <Cover id={game.cover} alt="" sizes="40px" className="mini-cover" />
          </span>
          <span className="muted">
            Looking for <b style={{ color: 'var(--text)' }}>{game.name}</b> itself? Release date & details →
          </span>
        </Link>
      </PageHead>
      <section className="container" aria-label="Similar games">
        <ol className="rank-list" role="list">
          {items.map((g, i) => (
            <li key={g.id} className="rank-row">
              <span className="n">{i + 1}</span>
              <Cover id={g.cover} alt="" sizes="64px" eager={i < 4} />
              <div style={{ minWidth: 0 }}>
                <h2 className="title" style={{ fontSize: '1.05rem' }}>
                  <Link to={`/game/${g.slug}`}>{g.name}</Link>
                </h2>
                <p className="sub">{g.summary}</p>
                <div className="chips" style={{ marginTop: 8 }}>
                  {g.shared.map((s) => (
                    <span key={s} className="chip chip-outline">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span className="side" style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
                <When game={g} relative={false} />
                <PlatformChips platforms={g.platforms} max={3} />
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
