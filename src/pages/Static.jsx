import { PageHead } from '../components/ui.jsx';
import { CONTACT } from '../lib/site.js';
import { LEGAL } from '../lib/legal.js';

export default function Static({ data, route }) {
  const { seo } = data;
  if (route.page === 'legal') {
    const doc = LEGAL[route.doc];
    return (
      <>
        <PageHead crumbs={seo.crumbs} title={doc.title} lede={`Last updated ${data.updated}.`} />
        <div className="container prose">
          {doc.body.map(([h, p]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </section>
          ))}
        </div>
      </>
    );
  }
  if (route.page === 'contact') {
    return (
      <>
        <PageHead crumbs={seo.crumbs} title="Contact" lede="Spotted a wrong date, want your game listed, or have an idea? Email is fastest." />
        <div className="container prose">
          <p>
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>
          <p>For date corrections, include the game name and a link to the official announcement. Game data comes from IGDB, so fixing it there updates NextPlay within a day.</p>
        </div>
      </>
    );
  }
  const s = data.stats;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="About" title="Built by a gamer who kept missing release days" />
      <div className="container prose">
        <p>
          NextPlay started in December 2025 as a side project to answer one question fast: <strong>when does it come out, and is it on my platform?</strong> It now tracks {s.games.toLocaleString('en-US')} games — {s.upcoming.toLocaleString('en-US')} of them upcoming — and {s.series} game series.
        </p>
        <h2>Where the data comes from</h2>
        <p>Release dates, platforms, studios and artwork come from IGDB (owned by Twitch). PC system requirements, prices, player counts and review summaries come from the Steam store. Everything is refreshed every day, so dates you see here reflect the latest announcements.</p>
        <h2>How rankings work</h2>
        <p>“Most anticipated” is ranked by real follower counts on IGDB. “Trending” blends IGDB page visits, Twitch watch time and Steam concurrent players. “Best of” uses critic averages when there are enough reviews, and player scores otherwise. We don’t sell placements.</p>
        <h2>Who runs it</h2>
        <p>
          NextPlay is made by Divik, an indie developer. Reach me at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </div>
    </>
  );
}
