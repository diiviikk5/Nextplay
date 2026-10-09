import { useState } from 'react';
import { Link, Cover, PageHead } from '../components/ui.jsx';

export default function CanIRunIt({ data }) {
  const { items, seo } = data;
  const [q, setQ] = useState('');
  const shown = q ? items.filter((g) => g.name.toLowerCase().includes(q.toLowerCase())) : items.slice(0, 120);
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="PC requirements" title="Can I run it?" lede="Official minimum specs for the biggest new and upcoming PC games, straight from Steam. Find a game, compare the GPU to yours, open the full spec sheet." />
      <section className="container" aria-label="Games">
        <label htmlFor="ciri" className="sr-only">
          Find a game
        </label>
        <input id="ciri" type="search" className="search-trigger" style={{ display: 'flex', width: 'min(420px, 100%)', marginBottom: 20, color: 'var(--text)' }} placeholder={`Find a game (${items.length} with official specs)…`} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        {shown.length ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Game</th>
                <th scope="col">Minimum GPU</th>
                <th scope="col">
                  <span className="sr-only">Specs</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((g) => (
                <tr key={g.id}>
                  <td>
                    <span className="row" style={{ gap: 12 }}>
                      <Cover id={g.cover} alt="" sizes="36px" className="mini-cover" />
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                    </span>
                  </td>
                  <td className="muted" style={{ fontSize: 13.5 }}>
                    {g.minGpu || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/system-requirements/${g.slug}`} className="btn btn-sm" aria-label={`${g.name} system requirements`}>
                      Specs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="faint">No official specs for “{q}” yet. Try the search in the header — the game page shows specs as soon as Steam lists them.</p>
        )}
      </section>
    </>
  );
}
