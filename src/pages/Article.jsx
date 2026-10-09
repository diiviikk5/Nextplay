import { Fragment } from 'react';
import { Crumbs, Grid, SectionHead } from '../components/ui.jsx';

// Minimal, safe markdown: headings, lists, paragraphs, **bold**, *italic*. No raw HTML.
function inline(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') ? <strong key={`${key}-${i}`}>{p.slice(2, -2)}</strong> : p.startsWith('*') && p.length > 2 ? <em key={`${key}-${i}`}>{p.slice(1, -1)}</em> : <Fragment key={`${key}-${i}`}>{p}</Fragment>
  );
}

function Markdown({ source }) {
  const blocks = [];
  let list = null;
  source.trim().split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (/^[-*] /.test(line)) {
      (list ||= []).push(<li key={i}>{inline(line.slice(2), i)}</li>);
      return;
    }
    if (list) {
      blocks.push(<ul key={`ul-${i}`}>{list}</ul>);
      list = null;
    }
    if (!line) return;
    if (line.startsWith('### ')) blocks.push(<h3 key={i}>{inline(line.slice(4), i)}</h3>);
    else if (line.startsWith('## ')) blocks.push(<h2 key={i}>{inline(line.slice(3), i)}</h2>);
    else if (line.startsWith('# ')) blocks.push(<h2 key={i}>{inline(line.slice(2), i)}</h2>);
    else blocks.push(<p key={i}>{inline(line, i)}</p>);
  });
  if (list) blocks.push(<ul key="ul-end">{list}</ul>);
  return <div className="prose">{blocks}</div>;
}

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
