import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link, Empty } from '../components/ui.jsx';
import { loadSearchIndex, searchGames } from '../components/SearchDialog.jsx';
import { applyHead } from '../lib/head.js';

export default function NotFound() {
  const { pathname } = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    applyHead({ title: 'Page not found | NextPlay', description: 'This page does not exist.', noindex: true, url: `https://nextplaygame.me${pathname}`, image: '', type: 'website', jsonLd: [] });
    const guess = pathname.split('/').pop()?.replace(/--\d+$/, '').replace(/-/g, ' ');
    if (guess) loadSearchIndex().then((idx) => setSuggestions(searchGames(idx, guess, 6)), () => {});
  }, [pathname]);
  return (
    <div className="container section">
      <Empty
        title="We couldn't find that page"
        action={
          <Link to="/" className="btn btn-accent">
            Go to the homepage
          </Link>
        }
      >
        It may have moved, or the game was renamed.{suggestions.length ? ' Did you mean:' : ''}
      </Empty>
      {suggestions.length ? (
        <ul className="chips" role="list" style={{ justifyContent: 'center', marginTop: 16 }}>
          {suggestions.map((g) => (
            <li key={g.slug}>
              <Link to={`/game/${g.slug}`} className="chip">
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
