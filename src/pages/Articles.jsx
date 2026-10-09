import { Link, PageHead } from '../components/ui.jsx';

export default function Articles({ data }) {
  const { section, items, seo } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow={section === 'news' ? 'News' : 'Blog'} title={section === 'news' ? 'Gaming news & features' : 'From the blog'} lede="Long reads and explainers. For current release dates, every game page is updated daily." />
      <section className="container">
        <div className="tiles" style={{ '--min': '300px' }}>
          {items.map((a) => (
            <article key={a.slug} className="tile" style={{ minHeight: 200 }}>
              <div>
                <p className="eyebrow">
                  {a.category} · {a.publishedDate}
                </p>
                <h2 className="h3" style={{ marginTop: 12 }}>
                  <Link to={`/${section}/${a.slug}`}>{a.title}</Link>
                </h2>
                <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
                  {a.excerpt}
                </p>
              </div>
              <span className="num">{a.readTime}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
