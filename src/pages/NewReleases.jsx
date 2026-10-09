import { Grid, PageHead, SectionHead, Empty, Link } from '../components/ui.jsx';

export default function NewReleases({ data }) {
  const { weeks, seo } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Out now" title="New game releases" lede="Every notable game released in the last six weeks, newest first. Ratings appear once enough reviews are in." />
      {weeks.length ? (
        weeks.map((w, i) => (
          <section key={w.label} className="container section" aria-label={w.label} style={i === 0 ? { paddingTop: 8 } : undefined}>
            <SectionHead title={w.label} sub={`${w.games.length} releases`} />
            <Grid games={w.games} eager={i === 0 ? 6 : 0} />
          </section>
        ))
      ) : (
        <div className="container">
          <Empty title="Nothing new this week" action={<Link to="/upcoming" className="btn">See what's coming</Link>} />
        </div>
      )}
    </>
  );
}
