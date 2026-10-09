import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarPlus } from 'lucide-react';
import { Link, Grid, PageHead, SectionHead, Empty } from '../components/ui.jsx';
import { useNow } from '../lib/data.jsx';
import { platformShort } from '../lib/platforms.js';
import { downloadIcs } from '../lib/watchlist.js';

const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const FILTERS = ['ps5', 'xsx', 'switch-2', 'pc', 'switch', 'ps4', 'mac'];

export default function ReleasesMonth({ data }) {
  const { label, dated, undated, counts, prev, next, seo } = data;
  const now = useNow();
  const [platform, setPlatform] = useState('all');
  const match = (g) => platform === 'all' || g.platforms.includes(platform);

  const days = useMemo(() => {
    const map = new Map();
    dated.filter(match).forEach((g) => {
      const day = Math.floor(g.date / 86400) * 86400;
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(g);
    });
    return [...map.entries()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dated, platform]);
  const today = Math.floor(now / 86400) * 86400;
  const undatedShown = undated.filter(match);

  return (
    <>
      <PageHead crumbs={seo.crumbs} eyebrow="Release calendar" title={`${label} game releases`} lede={`All ${dated.length + undated.length} games releasing in ${label} on PS5, Xbox Series X|S, Switch 2, PC and more — day by day.`}>
        <div className="row wrap" style={{ marginTop: 20 }}>
          <button type="button" className="btn btn-sm" onClick={() => downloadIcs(dated.filter(match), `releases-${label.toLowerCase().replace(' ', '-')}.ics`)}>
            <CalendarPlus size={15} aria-hidden="true" /> Add {platform === 'all' ? 'all' : platformShort(platform)} dates to calendar
          </button>
        </div>
      </PageHead>

      <section className="container" aria-label="Releases by day">
        <div className="filter-bar" role="group" aria-label="Filter by platform">
          <button type="button" aria-pressed={platform === 'all'} onClick={() => setPlatform('all')}>
            All <span className="n">{dated.length + undated.length}</span>
          </button>
          {FILTERS.filter((p) => counts[p]).map((p) => (
            <button type="button" key={p} aria-pressed={platform === p} onClick={() => setPlatform(p)}>
              {platformShort(p)} <span className="n">{counts[p]}</span>
            </button>
          ))}
        </div>

        {days.length ? (
          days.map(([day, list]) => {
            const d = new Date(day * 1000);
            return (
              <div key={day} className="day-group" data-today={day === today}>
                <div className="date">
                  <div className="d">{d.getUTCDate()}</div>
                  <div className="w">{day === today ? 'Today' : DOW[d.getUTCDay()]}</div>
                </div>
                <Grid games={list} />
              </div>
            );
          })
        ) : (
          <Empty title={`No ${platformShort(platform)} games with exact dates`} action={<button type="button" className="btn" onClick={() => setPlatform('all')}>Show all platforms</button>} />
        )}
      </section>

      {undatedShown.length ? (
        <section className="container section" aria-labelledby="undated">
          <SectionHead id="undated" title={`Also due in ${label}`} sub="Announced for this month without an exact day" />
          <Grid games={undatedShown} />
        </section>
      ) : null}

      <nav className="container pager" aria-label="Other months">
        {prev ? (
          <Link to={prev.path} className="btn">
            <ChevronLeft size={16} aria-hidden="true" /> {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={next.path} className="btn">
            {next.label} <ChevronRight size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </nav>
    </>
  );
}
