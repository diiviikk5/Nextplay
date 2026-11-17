import { ArrowRight, Play } from 'lucide-react';
import { Link, Cover, Countdown, Faq, PageHead, SectionHead, WatchButton } from '../components/ui.jsx';
import { Markdown } from '../components/Markdown.jsx';
import { youtubeThumb } from '../lib/images.js';

function Trailers({ items }) {
  return (
    <div className="tiles" style={{ '--min': '220px' }}>
      {items.map((t) => (
        <a key={t.id} className="tile gta-video" href={`https://www.youtube.com/watch?v=${t.id}`} target="_blank" rel="noopener nofollow">
          <span className="gta-thumb">
            <img src={youtubeThumb(t.id)} alt="" loading="lazy" />
            <Play size={26} aria-hidden="true" />
          </span>
          <span className="name">{t.name}</span>
          {t.when ? <span className="faint mono" style={{ fontSize: 12 }}>{t.when}</span> : null}
        </a>
      ))}
    </div>
  );
}

function Sources({ items }) {
  return (
    <section className="section" aria-labelledby="sources" style={{ paddingBottom: 0 }}>
      <h2 className="h3" id="sources" style={{ marginBottom: 10 }}>
        Sources
      </h2>
      <ul className="gta-sources">
        {items.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener nofollow">
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Nav({ items, current }) {
  return (
    <nav className="panel" aria-label="GTA 6 guide">
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        GTA 6 guide
      </p>
      <ul className="gta-nav" role="list">
        <li>
          <Link to="/gta-6" aria-current={current === '/gta-6' ? 'page' : undefined}>
            Everything we know
          </Link>
        </li>
        {items.map((n) => (
          <li key={n.path}>
            <Link to={n.path} aria-current={current === n.path ? 'page' : undefined}>
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hub({ data }) {
  const { seo, game, nav, characters, trailers, regions, comingAfterLaunch, out, faq, builtAt } = data;
  return (
    <>
      <PageHead
        crumbs={seo.crumbs}
        eyebrow="Grand Theft Auto VI"
        title="GTA 6: everything we know"
        lede={`${out ? 'Out now' : 'Out November 19, 2026'} on PS5 and Xbox Series X|S. Release date, price, map, characters, trailers and music, all from official sources and kept up to date.`}
      >
        {!out ? <Countdown to={game.date} builtAt={builtAt} /> : null}
        <div className="hero-actions" style={{ marginTop: 18 }}>
          <Link to="/game/grand-theft-auto-vi" className="btn btn-accent">
            Game page <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <WatchButton game={game} variant="button" />
        </div>
      </PageHead>

      <section className="container section" aria-labelledby="facts" style={{ paddingTop: 8 }}>
        <SectionHead id="facts" title="Quick facts" />
        <dl className="gta-facts">
          <div>
            <dt>Release date</dt>
            <dd>
              <Link to="/gta-6/release-date">November 19, 2026</Link>
            </dd>
          </div>
          <div>
            <dt>Platforms</dt>
            <dd>
              PS5, Xbox Series X|S (<Link to="/gta-6/pc">no PC yet</Link>)
            </dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>
              <Link to="/gta-6/price">$79.99 / $99.99 Ultimate</Link>
            </dd>
          </div>
          <div>
            <dt>Setting</dt>
            <dd>
              <Link to="/gta-6/map">Leonida &amp; Vice City</Link>
            </dd>
          </div>
          <div>
            <dt>Protagonists</dt>
            <dd>
              <Link to="/gta-6/characters/jason-duval">Jason</Link> &amp; <Link to="/gta-6/characters/lucia-caminos">Lucia</Link>
            </dd>
          </div>
          <div>
            <dt>Pre-load</dt>
            <dd>
              <Link to="/gta-6/pre-load">Open since Nov 10</Link>
            </dd>
          </div>
        </dl>
      </section>

      <section className="container section" aria-labelledby="guide">
        <SectionHead id="guide" title="The GTA 6 guide" sub="Every page, each answering one question properly" />
        <div className="tiles" style={{ '--min': '220px' }}>
          {nav.map((n) => (
            <Link key={n.path} to={n.path} className="tile">
              <span className="name">{n.label}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="cast">
        <SectionHead id="cast" title="Characters" to="/gta-6/characters" more="Full cast" />
        <div className="tiles" style={{ '--min': '180px' }}>
          {characters.map((c) => (
            <Link key={c.slug} to={`/gta-6/characters/${c.slug}`} className="tile">
              <span className="name">{c.name}</span>
              <span className="faint" style={{ fontSize: 13 }}>
                {c.role}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="trailers">
        <SectionHead id="trailers" title="Trailers" to="/gta-6/trailers" more="All trailers" />
        <Trailers items={trailers} />
      </section>

      <section className="container section" aria-labelledby="leonida">
        <SectionHead id="leonida" title="The map: Leonida" to="/gta-6/map" more="Map guide" />
        <p className="muted">{regions.join(' · ')}</p>
      </section>

      <section className="container section" aria-labelledby="after">
        <SectionHead id="after" title={out ? 'Guides on the way' : 'Coming after launch'} sub="Added once real, verified information is out. No made-up lists." />
        <p className="muted">{comingAfterLaunch.join(' · ')}</p>
      </section>

      <div className="container section">
        <Faq items={faq} />
      </div>
    </>
  );
}

function Topic({ data }) {
  const { seo, page, nav, game } = data;
  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow={page.eyebrow} title={page.h1} lede={page.description} />
      <div className="container game-layout" style={{ paddingTop: 8 }}>
        <div>
          <Markdown source={page.body} />
          {page.videos ? (
            <div className="section" style={{ paddingBottom: 0 }}>
              <Trailers items={page.videos} />
            </div>
          ) : null}
          <div className="section" style={{ paddingBottom: 0 }}>
            <Faq items={page.faq} />
          </div>
          <Sources items={page.sources} />
          {page.related.length ? (
            <section className="section" aria-labelledby="more" style={{ paddingBottom: 0 }}>
              <h2 className="h3" id="more" style={{ marginBottom: 10 }}>
                Keep reading
              </h2>
              <div className="tiles" style={{ '--min': '200px' }}>
                {page.related.map((r) => (
                  <Link key={r.path} to={r.path} className="tile">
                    <span className="name">{r.label}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <aside aria-label="GTA 6">
          <Link to="/game/grand-theft-auto-vi" className="panel row" style={{ gap: 14 }}>
            <Cover id={game.cover} alt="" sizes="64px" className="mini-cover" />
            <span>
              <strong>Grand Theft Auto VI</strong>
              <br />
              <span className="faint" style={{ fontSize: 13 }}>
                Release date, platforms &amp; FAQ
              </span>
            </span>
          </Link>
          <Nav items={nav} current={seo.url.replace(/^https:\/\/[^/]+/, '')} />
        </aside>
      </div>
    </>
  );
}

export default function Gta6({ data }) {
  return data.kind === 'hub' ? <Hub data={data} /> : <Topic data={data} />;
}
