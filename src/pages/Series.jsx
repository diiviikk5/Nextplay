import { Link, Cover, PageHead, PlatformChips } from '../components/ui.jsx';
import { releaseLabel } from '../lib/format.js';

export default function Series({ data }) {
  const { name, items, next, seo } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow="Release order"
        title={`Every ${name} game in order`}
        lede={`${items.length} games, from the first release to ${next ? `the upcoming ${next.name}` : 'the latest entry'}.`}
      />
      <section className="container" aria-label="Timeline">
        <ol className="rank-list" role="list">
          {items.map((g, i) => (
            <li key={g.id} className="rank-row" style={g.precision === 'tbd' || g.date > data.builtAt ? { background: 'var(--accent-soft)' } : undefined}>
              <span className="n">{i + 1}</span>
              <Cover id={g.cover} alt="" sizes="64px" eager={i < 4} />
              <div style={{ minWidth: 0 }}>
                <h2 className="title" style={{ fontSize: '1.05rem' }}>
                  <Link to={`/game/${g.slug}`}>{g.name}</Link>
                </h2>
                <p className="sub">{[g.developer, g.summary].filter(Boolean).join(' — ')}</p>
                <div style={{ marginTop: 8 }}>
                  <PlatformChips platforms={g.platforms} max={5} />
                </div>
              </div>
              <span className="side">{releaseLabel(g.date, g.precision)}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
