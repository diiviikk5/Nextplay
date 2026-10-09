import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Link, PageHead, Empty } from '../components/ui.jsx';
import { loadSearchIndex, searchGames } from '../components/SearchDialog.jsx';
import { cover } from '../lib/images.js';

export default function SearchPage({ data }) {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadSearchIndex().then(setIndex, (e) => setError(e.message));
  }, []);
  const results = index && q ? searchGames(index, q, 60) : [];

  return (
    <>
      <PageHead crumbs={data.seo.crumbs} title={q ? `Results for “${q}”` : 'Search games'}>
        <form role="search" onSubmit={(e) => e.preventDefault()} style={{ marginTop: 20 }}>
          <label htmlFor="q" className="sr-only">
            Search games
          </label>
          <input id="q" type="search" className="search-trigger" style={{ display: 'flex', width: 'min(520px, 100%)', height: 48, color: 'var(--text)', fontSize: '1rem' }} value={q} placeholder="Search any game…" autoFocus onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} />
        </form>
      </PageHead>
      <section className="container">
        {error ? (
          <Empty title="Search is unavailable" action={<button type="button" className="btn" onClick={() => location.reload()}>Retry</button>}>
            {error}
          </Empty>
        ) : !index ? (
          <div className="grid">{Array.from({ length: 12 }, (_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '3/4' }} />)}</div>
        ) : q && !results.length ? (
          <Empty title="No matches" action={<Link to="/upcoming" className="btn">Browse upcoming games</Link>}>
            Nothing matches “{q}”. Check the spelling or try fewer words.
          </Empty>
        ) : (
          <div className="grid">
            {results.map((g) => (
              <article className="card" key={g.slug}>
                <div className="card-cover">{g.img ? <img src={cover(g.img)} alt="" loading="lazy" /> : null}</div>
                <h2 className="card-title">
                  <Link to={`/game/${g.slug}`}>{g.name}</Link>
                </h2>
                <p className="card-meta">{g.year || 'TBA'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
