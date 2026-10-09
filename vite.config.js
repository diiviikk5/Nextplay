import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev only: serve /data/*.json by running the build-time loaders on demand, so `npm run dev`
// behaves like the prerendered site without a full build.
function devData() {
  return {
    name: 'nextplay-dev-data',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/data/')) return next();
        try {
          const loaders = await server.ssrLoadModule('/server/loaders.js');
          const url = decodeURIComponent(req.url.split('?')[0]);
          let body;
          if (url === '/data/search-index.json') body = loaders.searchIndex();
          else {
            const path = url.replace(/^\/data/, '').replace(/\.json$/, '').replace(/^\/index$/, '/');
            const r = loaders.resolve(path);
            if (r.status === 404) {
              res.statusCode = 404;
              return res.end('{}');
            }
            body = r.redirect ? { redirect: r.redirect } : r.data;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        } catch (e) {
          server.ssrFixStacktrace?.(e);
          next(e);
        }
      });
    },
  };
}

// OUT_DIR lets local builds write outside the repo drive (e.g. OUT_DIR=E:/nextplay-build/dist).
const OUT = process.env.OUT_DIR || 'dist';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), devData()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    outDir: isSsrBuild ? 'dist-ssr' : OUT, // SSR bundle stays in-repo so it can resolve node_modules
    emptyOutDir: true,
  },
  ssr: {
    noExternal: ['lucide-react'],
  },
}));
