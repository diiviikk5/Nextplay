import { Component, Suspense, createContext, lazy, useContext, useEffect, useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { ROUTES } from './routes.js';
import { useRouteData, NowProvider, useStore } from './lib/data.jsx';
import { applyHead } from './lib/head.js';
import { Header, Footer } from './components/Layout.jsx';

// page key -> file in ./pages. Client loads them lazily; the server renders them eagerly (entry-server).
export const PAGE_FILES = {
  home: 'Home',
  game: 'Game',
  gamesLike: 'GamesLike',
  requirements: 'Requirements',
  canIRunIt: 'CanIRunIt',
  upcoming: 'Upcoming',
  newReleases: 'NewReleases',
  anticipated: 'Anticipated',
  trending: 'Trending',
  releasesIndex: 'ReleasesYear',
  releasesYear: 'ReleasesYear',
  releasesMonth: 'ReleasesMonth',
  bestOf: 'BestOf',
  platformIndex: 'Directory',
  genreIndex: 'Directory',
  companyIndex: 'Directory',
  seriesIndex: 'Directory',
  platform: 'Hub',
  genre: 'Hub',
  matrix: 'Hub',
  company: 'Company',
  series: 'Series',
  tierList: 'TierList',
  watchlist: 'Watchlist',
  search: 'SearchPage',
  articles: 'Articles',
  article: 'Article',
  about: 'Static',
  contact: 'Static',
  legal: 'Static',
  notFound: 'NotFound'
};

const pageImports = import.meta.glob('./pages/*.jsx');
export const PAGE_MODULES = Object.fromEntries(Object.entries(PAGE_FILES).map(([k, f]) => [k, pageImports[`./pages/${f}.jsx`]]));

const LAZY_PAGES = Object.fromEntries(Object.entries(PAGE_MODULES).map(([k, load]) => [k, lazy(load)]));
const PagesContext = createContext(LAZY_PAGES);
export const PagesProvider = PagesContext.Provider;

function RouteView({ route }) {
  const data = useRouteData();
  const PAGES = useContext(PagesContext);
  const NotFound = PAGES.notFound;
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
