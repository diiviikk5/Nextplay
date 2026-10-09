import { Link, Cover, Grid, PageHead, SectionHead } from '../components/ui.jsx';

export default function Trending({ data }) {
  const { overall, steam, twitch, wishlisted, seo } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow={`Updated ${data.updated}`} title="Trending games right now" lede="What people are visiting, watching and playing this week — blended from IGDB traffic, Twitch watch time and live Steam player counts." />

      <section className="container section" style={{ paddingTop: 8 }} aria-labelledby="overall">
        <SectionHead id="overall" title="Top 30 this week" />
        <Grid games={overall} eager={6} ranked />
      </section>

      {steam.length ? (
        <section className="container section" aria-labelledby="steam">
          <SectionHead id="steam" title="Most played on Steam" sub="Concurrent players at last update" />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Game</th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  Playing now
                </th>
              </tr>
            </thead>
            <tbody>
              {steam.map((g, i) => (
                <tr key={g.id}>
                  <td className="mono faint" style={{ width: 40 }}>
                    {i + 1}
                  </td>
                  <td>
                    <Link to={`/game/${g.slug}`} className="row" style={{ gap: 12 }}>
                      <Cover id={g.cover} alt="" sizes="36px" className="mini-cover" />
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                    </Link>
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {g.players.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {twitch.length ? (
        <section className="container section" aria-labelledby="twitch">
          <SectionHead id="twitch" title="Most watched on Twitch" />
          <Grid games={twitch} ranked />
        </section>
      ) : null}

      {wishlisted.length ? (
        <section className="container section" aria-labelledby="wish">
          <SectionHead id="wish" title="Most wishlisted upcoming games" sub="From Steam's wishlist charts" to="/most-anticipated" />
          <Grid games={wishlisted} ranked />
        </section>
      ) : null}
    </>
  );
}
