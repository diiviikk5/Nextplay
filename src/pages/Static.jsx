import { PageHead } from '../components/ui.jsx';

const CONTACT = 'hello@nextplaygame.me';

const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      ['What we collect', 'NextPlay does not have accounts and does not ask for personal information. Your watchlist and tier lists are stored only in your own browser (localStorage) and never sent to us.'],
      ['Analytics', 'We use Vercel Web Analytics to count page views. It is cookieless and does not track you across sites.'],
      ['Embedded content', 'Trailers load from youtube-nocookie.com only after you press play. Images load from the IGDB image CDN.'],
      ['Contact', `Questions about privacy: ${CONTACT}.`],
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      ['Use of the site', 'NextPlay is a free information service. You may use it for personal, non-commercial purposes.'],
      ['Accuracy', 'Release dates come from IGDB and Steam and change often. We refresh daily but cannot guarantee every date is correct — always confirm with the publisher before buying.'],
      ['Content ownership', 'Game names, artwork and trailers belong to their respective owners and are shown for identification and commentary.'],
      ['Changes', 'We may update these terms; the current version is always on this page.'],
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    body: [
      ['Data sources', 'Game data is provided by IGDB.com and the Steam store. NextPlay is not affiliated with IGDB, Twitch, Valve, Sony, Microsoft, Nintendo or any publisher.'],
      ['No guarantees', 'Dates, prices and specifications can change without notice. Store links go to third-party sites.'],
    ],
  },
};

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
