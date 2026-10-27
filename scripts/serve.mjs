// Local static server that mimics Vercel: clean URLs (/x -> x/index.html | x.html), real 404s, and the
// markdown routes from vercel.json (/x.md, /api/md/<path>, /api/md/_catalog, markdown 404s).
// Usage: OUT_DIR=E:/nextplay-build/dist node scripts/serve.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.env.OUT_DIR || 'dist');
const PORT = Number(process.argv[2] || 4173);
const SITE = 'https://nextplaygame.me';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.webmanifest': 'application/manifest+json', '.jpg': 'image/jpeg' };
const DESCRIBED_BY = `<${SITE}/llms.txt>; rel="describedby"; type="text/plain", <${SITE}/llms-full.txt>; rel="describedby"; type="text/plain", <${SITE}/ai.txt>; rel="describedby"; type="text/plain"`;

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const base = path.join(ROOT, clean);
  for (const candidate of [base, path.join(base, 'index.html'), `${base}.html`]) {
    if (candidate.startsWith(ROOT) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const mdHeaders = (page, body) => ({
  'Content-Type': TYPES['.md'],
  'X-Robots-Tag': 'noindex, follow',
  'X-Markdown-Tokens': String(Math.ceil(body.length / 4)),
  'Content-Location': `${SITE}${page}`,
  Link: `<${SITE}${page}>; rel="canonical"`,
  'Access-Control-Allow-Origin': '*',
});
const mdNotFound = (p) => `# Not found\n\n> There is no page at ${p}.\n\nSee the site map: [llms.txt](${SITE}/llms.txt), or the catalog of every page: ${SITE}/api/md/_catalog\n`;

function sendMarkdown(req, res, page) {
  const file = path.join(ROOT, page === '/' ? 'index.md' : `${page.slice(1)}.md`);
  const ok = file.startsWith(ROOT) && fs.existsSync(file);
  const body = ok ? fs.readFileSync(file, 'utf8') : mdNotFound(page);
  res.writeHead(ok ? 200 : 404, ok ? mdHeaders(page, body) : { 'Content-Type': TYPES['.md'], 'X-Robots-Tag': 'noindex, follow' });
  res.end(req.method === 'HEAD' ? undefined : body);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const p = url.pathname;
    if (p.length > 1 && p.endsWith('/')) {
      res.writeHead(308, { Location: p.replace(/\/+$/, '') + url.search });
      return res.end();
    }
    if (p === '/api/md/_catalog') {
      res.writeHead(200, { 'Content-Type': TYPES['.json'], 'Access-Control-Allow-Origin': '*' });
      return fs.createReadStream(path.join(ROOT, 'md-catalog.json')).pipe(res);
    }
    if (p.startsWith('/api/md')) return sendMarkdown(req, res, p.slice('/api/md'.length).replace(/\.md$/, '') || '/');
    if (p.endsWith('.md')) return sendMarkdown(req, res, p === '/index.md' ? '/' : p.slice(0, -3));
    const file = resolveFile(p);
    const target = file || path.join(ROOT, '404.html');
    res.writeHead(file ? 200 : 404, { 'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream', Link: DESCRIBED_BY });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(target).pipe(res);
  })
  .listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
