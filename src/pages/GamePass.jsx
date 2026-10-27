import { Grid, PageHead, SectionHead, Faq } from '../components/ui.jsx';

function Section({ title, sub, games, eager = 0 }) {
  if (!games.length) return null;
  return (
    <section className="container section" aria-label={title}>
      <SectionHead title={title} sub={sub} />
      <Grid games={games} eager={eager} />
    </section>
  );
}

export default function GamePass({ data }) {
  const { seo, counts, checked, coming, leaving, recentlyAdded, newest, popular, faq } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow="Xbox Game Pass"
        title="Xbox Game Pass games"
        lede={`What's coming, leaving and new on Game Pass, from the official US catalog (${counts.console} console games, ${counts.pc} PC games). Checked ${checked}.`}
      />
      <Section title="Coming to Game Pass" sub={`${coming.length} announced`} games={coming} eager={6} />
      <Section title="Leaving soon" sub="Play them before they go" games={leaving} />
      <Section title="Recently added" games={recentlyAdded} />
      <Section title="New releases on Game Pass" sub="Released in the last year" games={newest} />
      <Section title="Most popular on Game Pass" games={popular} />
      <div className="container section">
        <Faq items={faq} />
      </div>
    </>
  );
}
