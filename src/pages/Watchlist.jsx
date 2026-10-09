import { CalendarPlus } from 'lucide-react';
import { Link, Grid, PageHead, Empty } from '../components/ui.jsx';
import { useWatchlist, downloadIcs } from '../lib/watchlist.js';
import { useNow } from '../lib/data.jsx';

export default function Watchlist({ data }) {
  const { list } = useWatchlist();
  const now = useNow();
  const toCard = (g) => ({ ...g, id: g.slug });
  const upcoming = list.filter((g) => !g.date || g.precision !== 'day' || g.date > now).sort((a, b) => (a.date || Infinity) - (b.date || Infinity));
  const out = list.filter((g) => g.precision === 'day' && g.date <= now);
  return (
    <>
      <PageHead crumbs={data.seo.crumbs} eyebrow={`${list.length} games`} title="Your watchlist" lede="Saved in this browser. Export the dates to your calendar to get a reminder the day before each launch.">
        {upcoming.some((g) => g.precision === 'day') ? (
          <button type="button" className="btn btn-accent" style={{ marginTop: 20 }} onClick={() => downloadIcs(upcoming)}>
            <CalendarPlus size={16} aria-hidden="true" /> Add all dates to calendar
          </button>
        ) : null}
      </PageHead>
      <section className="container">
        {!list.length ? (
          <Empty
            title="Nothing saved yet"
            action={
              <Link to="/most-anticipated" className="btn btn-accent">
                Browse the most anticipated games
              </Link>
            }
          >
            Tap the bookmark on any game to track its release date here.
          </Empty>
        ) : (
          <>
            {upcoming.length ? (
              <>
                <h2 className="h2" style={{ marginBottom: 16 }}>
                  Coming up
                </h2>
                <Grid games={upcoming.map(toCard)} />
              </>
            ) : null}
            {out.length ? (
              <>
                <h2 className="h2" style={{ margin: '40px 0 16px' }}>
                  Out now
                </h2>
                <Grid games={out.map(toCard)} />
              </>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
