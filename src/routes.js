// Single route table shared by the client router and the build-time loaders (server/loaders.js).
export const ROUTES = [
  { path: '/', page: 'home' },
  { path: '/game/:slug', page: 'game' },
  { path: '/games-like/:slug', page: 'gamesLike' },
  { path: '/system-requirements/:slug', page: 'requirements' },
  { path: '/can-i-run-it', page: 'canIRunIt' },
  { path: '/upcoming', page: 'upcoming' },
  { path: '/new-releases', page: 'newReleases' },
  { path: '/most-anticipated', page: 'anticipated' },
  { path: '/trending', page: 'trending' },
  { path: '/releases', page: 'releasesIndex' },
  { path: '/releases/:year', page: 'releasesYear' },
  { path: '/releases/:year/:month', page: 'releasesMonth' },
  { path: '/best-games/:year', page: 'bestOf' },
  { path: '/platform', page: 'platformIndex' },
  { path: '/platform/:slug', page: 'platform' },
  { path: '/genre', page: 'genreIndex' },
  { path: '/genre/:slug', page: 'genre' },
  { path: '/games/:platform/:genre', page: 'matrix' },
  { path: '/developer', page: 'companyIndex', kind: 'developer' },
  { path: '/developer/:slug', page: 'company', kind: 'developer' },
  { path: '/publisher', page: 'companyIndex', kind: 'publisher' },
  { path: '/publisher/:slug', page: 'company', kind: 'publisher' },
  { path: '/series', page: 'seriesIndex' },
  { path: '/series/:slug', page: 'series' },
  { path: '/tier-list', page: 'tierList' },
  { path: '/tier-list/:template', page: 'tierList' },
  { path: '/watchlist', page: 'watchlist' },
  { path: '/search', page: 'search' },
  { path: '/news', page: 'articles', section: 'news' },
  { path: '/news/:slug', page: 'article', section: 'news' },
  { path: '/blog', page: 'articles', section: 'blog' },
  { path: '/blog/:slug', page: 'article', section: 'blog' },
  { path: '/about', page: 'about' },
  { path: '/contact', page: 'contact' },
  { path: '/privacy', page: 'legal', doc: 'privacy' },
  { path: '/terms', page: 'legal', doc: 'terms' },
  { path: '/disclaimer', page: 'legal', doc: 'disclaimer' },
];

// "/" -> "/data/index.json", "/game/x" -> "/data/game/x.json"
export function dataUrl(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return `/data${clean === '/' ? '/index' : clean}.json`;
}
