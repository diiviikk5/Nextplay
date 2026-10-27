import { Link, Cover, PageHead, Faq } from '../components/ui.jsx';

const num = (n) => (n == null ? '—' : n.toLocaleString('en-US'));
function Change({ value }) {
  if (value == null) return <span className="faint">—</span>;
  const up = value >= 0;
  return (
    <span style={{ color: up ? 'var(--accent)' : 'var(--text-2)' }}>
      {up ? '+' : ''}
      {value}%
    </span>
  );
}

export default function MostPlayed({ data }) {
  const { items, seo, checked, faq } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow="Steam charts"
        title="Most played Steam games right now"
        lede={`The top 100 games on Steam by people playing, from the official Steam API. Read once a day so trends are comparable. Latest: ${checked}.`}
      />
      <section className="container" aria-label="Most played games">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Game</th>
                <th scope="col" style={{ textAlign: 'right' }}>Playing now</th>
                <th scope="col" style={{ textAlign: 'right' }}>7 days</th>
                <th scope="col" style={{ textAlign: 'right' }}>30 days</th>
                <th scope="col" style={{ textAlign: 'right' }}>30-day peak</th>
              </tr>
            </thead>
            <tbody>
              {items.map((g) => (
                <tr key={g.id}>
                  <td className="mono faint">{g.rank}</td>
                  <td>
                    <Link to={`/game/${g.slug}`} className="row" style={{ gap: 12 }}>
                      <Cover id={g.cover} alt="" sizes="36px" className="mini-cover" />
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                    </Link>
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>{num(g.players)}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    <Change value={g.change7} />
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    <Change value={g.change30} />
                  </td>
                  <td className="mono muted" style={{ textAlign: 'right' }}>{num(g.peak30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="container section">
        <Faq items={faq} />
      </div>
    </>
  );
}
