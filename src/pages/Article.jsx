import { Crumbs, Grid, SectionHead } from '../components/ui.jsx';
import { Markdown } from '../components/Markdown.jsx';


export default function Article({ data }) {
  const { article: a, related, seo, builtAt } = data;
  const ageDays = (builtAt * 1000 - new Date(a.modifiedDate || a.publishedDate).getTime()) / 86400000;
  return (
    <article>
      <header className="container page-head" style={{ maxWidth: 860 }}>
        <Crumbs items={seo.crumbs} />
        <p className="eyebrow" style={{ marginTop: 22 }}>
          {a.category} · {a.readTime}
        </p>
        <h1 style={{ marginTop: 10, maxWidth: '24ch' }}>{a.title}</h1>
        <p className="lede" style={{ marginTop: 14 }}>
          {a.excerpt}
        </p>
        <p className="mono faint" style={{ marginTop: 16, fontSize: 12.5 }}>
          By {a.author || 'Divik'} · Published <time dateTime={a.publishedDate}>{a.publishedDate}</time>
          {a.modifiedDate && a.modifiedDate !== a.publishedDate ? ` · Updated ${a.modifiedDate}` : ''}
        </p>
      </header>
      <div className="container" style={{ maxWidth: 860 }}>
        {ageDays > 90 ? (
          <div className="notice" style={{ marginBottom: 28 }}>
            <span>
              <strong>Heads up:</strong> this article is from {a.publishedDate} and details may have changed. {related.length ? 'The game pages below always show the latest release dates.' : ''}
            </span>
          </div>
        ) : null}
        <Markdown source={a.content} />
      </div>
      {related.length ? (
        <section className="container section" aria-labelledby="related">
          <SectionHead id="related" title="Latest on these games" />
          <Grid games={related} />
        </section>
      ) : null}
    </article>
  );
}
