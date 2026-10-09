import { Grid, PageHead, SectionHead } from '../components/ui.jsx';

export default function Upcoming({ data }) {
  const { sections, tba, total, seo, builtAt } = data;
  const year = new Date(builtAt * 1000).getUTCFullYear();
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow={`${total.toLocaleString('en-US')} games tracked`} title={`Upcoming games ${year}–${year + 1}`} lede="The notable releases for the next six months, soonest first. Each month links to its complete day-by-day calendar." />
      {sections.map((s, i) => (
        <section key={s.path} className="container section" aria-label={s.label} style={i === 0 ? { paddingTop: 8 } : undefined}>
          <SectionHead title={s.label} sub={`${s.total} releases`} to={s.path} more={`All ${s.total}`} />
          <Grid games={s.games} eager={i === 0 ? 6 : 0} />
        </section>
      ))}
      {tba.length ? (
        <section className="container section" aria-labelledby="tba">
          <SectionHead id="tba" title="Announced, date TBA" sub="Big games without a confirmed day yet" to="/most-anticipated" />
          <Grid games={tba} />
        </section>
      ) : null}
    </>
  );
}
