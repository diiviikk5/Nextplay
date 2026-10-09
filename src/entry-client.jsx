import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, matchPath } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import App, { PAGE_MODULES } from './App.jsx';
import { ROUTES } from './routes.js';
import { DataProvider, createDataStore } from './lib/data.jsx';
import './styles/app.css';

const root = document.getElementById('root');
const inline = document.getElementById('__NP_DATA__');
const initial = inline ? { path: window.location.pathname, data: JSON.parse(inline.textContent) } : null;
// A retired URL can be served another page's HTML via a host rewrite (e.g. /games-like/x -> /game/x).
// Align the address bar with the page that was actually rendered so the router hydrates the right route.
const renderedPath = inline?.dataset.path;
if (initial && renderedPath && initial.data.status !== 404 && renderedPath !== (initial.path.replace(/\/+$/, '') || '/')) {
  history.replaceState(null, '', renderedPath + window.location.search + window.location.hash);
  initial.path = renderedPath;
}
const store = createDataStore(initial);

const tree = (
  <StrictMode>
    <DataProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Analytics />
    </DataProvider>
  </StrictMode>
);

// Load the current page's chunk before hydrating so the server HTML is reused without a flash.
const route = ROUTES.find((r) => matchPath({ path: r.path, end: true }, window.location.pathname.replace(/\/+$/, '') || '/'));
const ready = route && PAGE_MODULES[route.page] ? PAGE_MODULES[route.page]() : Promise.resolve();

ready.finally(() => {
  if (root.hasChildNodes() && initial) hydrateRoot(root, tree);
  else createRoot(root).render(tree);
});
