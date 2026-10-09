import { Component, Suspense, lazy, useEffect, useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { ROUTES } from './routes.js';
import { useRouteData, NowProvider, useStore } from './lib/data.jsx';
import { applyHead } from './lib/head.js';
import { Header, Footer } from './components/Layout.jsx';

export const PAGE_MODULES = {
  home: () => import('./pages/Home.jsx'),
  game: () => import('./pages/Game.jsx'),
  gamesLike: () => import('./pages/GamesLike.jsx'),
  requirements: () => import('./pages/Requirements.jsx'),
  canIRunIt: () => import('./pages/CanIRunIt.jsx'),
  upcoming: () => import('./pages/Upcoming.jsx'),
  newReleases: () => import('./pages/NewReleases.jsx'),
  anticipated: () => import('./pages/Anticipated.jsx'),
  trending: () => import('./pages/Trending.jsx'),
  releasesIndex: () => import('./pages/ReleasesYear.jsx'),
  releasesYear: () => import('./pages/ReleasesYear.jsx'),
  releasesMonth: () => import('./pages/ReleasesMonth.jsx'),
  bestOf: () => import('./pages/BestOf.jsx'),
  platformIndex: () => import('./pages/Directory.jsx'),
  genreIndex: () => import('./pages/Directory.jsx'),
  companyIndex: () => import('./pages/Directory.jsx'),
  seriesIndex: () => import('./pages/Directory.jsx'),
  platform: () => import('./pages/Hub.jsx'),
  genre: () => import('./pages/Hub.jsx'),
  matrix: () => import('./pages/Hub.jsx'),
  company: () => import('./pages/Company.jsx'),
  series: () => import('./pages/Series.jsx'),
  tierList: () => import('./pages/TierList.jsx'),
  watchlist: () => import('./pages/Watchlist.jsx'),
  search: () => import('./pages/SearchPage.jsx'),
  articles: () => import('./pages/Articles.jsx'),
  article: () => import('./pages/Article.jsx'),
  about: () => import('./pages/Static.jsx'),
  contact: () => import('./pages/Static.jsx'),
  legal: () => import('./pages/Static.jsx'),
};

const PAGES = Object.fromEntries(Object.entries(PAGE_MODULES).map(([k, load]) => [k, lazy(load)]));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function RouteView({ route }) {
  const data = useRouteData();
  useEffect(() => {
    if (data?.seo) applyHead(data.seo);
  }, [data]);
  if (data?.redirect) return <Navigate to={data.redirect} replace />;
  if (!data || data.status === 404) return <NotFound />;
  const Page = PAGES[route.page];
  return <Page data={data} route={route} />;
}

function PageFallback() {
  return (
    <div className="container" style={{ paddingTop: 48 }} aria-busy="true" aria-label="Loading">
      <div className="skeleton" style={{ height: 14, width: 120 }} />
      <div className="skeleton" style={{ height: 52, width: 'min(560px, 90%)', marginTop: 18 }} />
      <div className="grid" style={{ marginTop: 40 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="skeleton" style={{ aspectRatio: '3/4' }} />
        ))}
      </div>
    </div>
  );
}

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container section">
        <div className="empty">
          <h2>This page didn’t load</h2>
          <p>Check your connection and try again.</p>
          <button type="button" className="btn btn-accent" onClick={() => this.setState({ error: null })}>
            Retry
          </button>
        </div>
      </div>
    );
  }
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
  useIso(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const store = useStore();
  const { pathname } = useLocation();
  return (
    <NowProvider initial={store.builtAt}>
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1}>
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {ROUTES.map((r) => (
                <Route key={r.path} path={r.path} element={<RouteView route={r} />} />
              ))}
              <Route path="*" element={<RouteView route={{ page: 'notFound' }} />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </NowProvider>
  );
}
