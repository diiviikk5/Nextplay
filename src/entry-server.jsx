import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App, { PAGE_FILES, PagesProvider } from './App.jsx';
import { DataProvider, createDataStore } from './lib/data.jsx';

export { headHtml } from './lib/head.js';

// Server renders pages eagerly (no lazy/Suspense waits) so renderToString is synchronous and fast.
const modules = import.meta.glob('./pages/*.jsx', { eager: true });
const PAGES = Object.fromEntries(Object.entries(PAGE_FILES).map(([k, f]) => [k, modules[`./pages/${f}.jsx`].default]));

export function render(url, data) {
  const store = createDataStore({ path: url, data });
  return renderToString(
    <StrictMode>
      <DataProvider store={store}>
        <PagesProvider value={PAGES}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </PagesProvider>
      </DataProvider>
    </StrictMode>
  );
}
