import { Grid, PageHead, SectionHead, Faq, Link } from '../components/ui.jsx';

export default function ThisWeek({ data }) {
  const { seo, range, days, total, nextWeek, faq } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow={range}
        title="Games coming out this week"
        lede={`${total} notable releases from Monday to Sunday on PS5, Xbox, Switch 2 and PC, day by day. Updated daily.`}
      />
      {days.map((d, i) => (
        <section key={d.ts} className="container section" aria-label={d.label} style={i === 0 ? { paddingTop: 8 } : undefined}>
          <SectionHead title={d.today ? `Today · ${d.label}` : d.label} sub={d.games.length ? `${d.games.length} ${d.past ? 'released' : 'releasing'}` : 'No notable releases'} />
          {d.games.length ? <Grid games={d.games} eager={i < 2 ? 6 : 0} /> : null}
        </section>
      ))}
      {nextWeek.length ? (
        <section className="container section" aria-label="Next week">
          <SectionHead title="Next week" sub="The biggest releases" to="/upcoming" more="Full schedule" />
          <Grid games={nextWeek} />
        </section>
      ) : null}
      <div className="container section">
        <Faq items={faq} />
        <p className="muted">
          Looking further ahead? See the <Link to="/upcoming">upcoming games</Link> schedule.
        </p>
      </div>
    </>
  );
}
