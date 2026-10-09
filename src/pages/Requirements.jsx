import { ExternalLink } from 'lucide-react';
import { Link, Cover, Faq, PageHead } from '../components/ui.jsx';

function Specs({ title, rows }) {
  if (!rows) return null;
  return (
    <section className="panel">
      <h2>{title}</h2>
      <table className="table">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k + i}>
              <th scope="row" style={{ width: '32%', color: 'var(--text-3)', fontWeight: 500 }}>
                {k}
              </th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Requirements({ data }) {
  const { game, pc, mac, linux, faq, seo } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Official specs from Steam" title={`${game.name} system requirements`} lede={`Minimum and recommended PC specs as listed by the developer on Steam. ${mac ? 'Native macOS version available.' : ''} ${linux ? 'Native Linux build available.' : ''}`}>
        <div className="row wrap" style={{ marginTop: 20 }}>
          <Link to={`/game/${game.slug}`} className="btn">
            <span style={{ width: 22 }}>
              <Cover id={game.cover} alt="" sizes="22px" className="mini-cover" />
            </span>
            {game.name} release info
          </Link>
          {game.steamUrl ? (
            <a className="btn" href={game.steamUrl} target="_blank" rel="noopener nofollow">
              Steam page <ExternalLink size={15} aria-hidden="true" />
            </a>
          ) : null}
          <Link to="/can-i-run-it" className="btn">
            Check other games
          </Link>
        </div>
      </PageHead>
      <div className="container split">
        <Specs title="Minimum" rows={pc.min} />
        <Specs title="Recommended" rows={pc.rec} />
      </div>
      {mac?.min ? (
        <div className="container split" style={{ marginTop: 32 }}>
          <Specs title="macOS minimum" rows={mac.min} />
          <Specs title="macOS recommended" rows={mac.rec} />
        </div>
      ) : null}
      <div className="container">
        <Faq items={faq} />
      </div>
    </>
  );
}
