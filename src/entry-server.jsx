import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { DataProvider, createDataStore } from './lib/data.jsx';

export { headHtml } from './lib/head.js';

// Renders one route to static HTML. Waits for lazy page chunks (Suspense) to resolve.
export async function render(url, data) {
  const store = createDataStore({ path: url, data });
  const { prelude } = await prerender(
    <StrictMode>
      <DataProvider store={store}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </DataProvider>
    </StrictMode>
  );
  return new Response(prelude).text();
}
