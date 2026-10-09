import { Grid, PageHead, SectionHead } from '../components/ui.jsx';

export default function Company({ data }) {
  const { name, kind, upcoming, released, total, seo } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow={kind === 'developer' ? 'Developer' : 'Publisher'}
        title={`${name} games`}
        lede={`${upcoming.length ? `${upcoming.length} upcoming and ` : ''}${total} games ${kind === 'developer' ? 'developed' : 'published'} by ${name} that we track, with release dates and platforms.`}
      />
      {upcoming.length ? (
        <section className="container section" style={{ paddingTop: 8 }} aria-labelledby="up">
          <SectionHead id="up" title="Upcoming" />
          <Grid games={upcoming} eager={6} />
        </section>
      ) : null}
      {released.length ? (
        <section className="container section" aria-labelledby="rel">
          <SectionHead id="rel" title="Released" sub="Newest first" />
          <Grid games={released} />
        </section>
      ) : null}
    </>
  );
}
