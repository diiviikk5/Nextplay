// Markdown endpoint for AI agents. Static .md files are served straight from the CDN; this function only runs for
//   /api/md/<path>      -> markdown of /<path> (rewrite in vercel.json)
//   /<missing>.md       -> markdown 404 (rewrite applies only when no static file matches)
const HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'X-Robots-Tag': 'noindex, follow',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
};

const notFound = (path) =>
  `# Not found\n\n> There is no page at /${path}.\n\nSee the site map: [llms.txt](https://nextplaygame.me/llms.txt), or the catalog of every page: https://nextplaygame.me/api/md/_catalog\n`;

function respond(request, status, body, extra = {}) {
  const headers = { ...HEADERS, 'X-Markdown-Tokens': String(Math.ceil(body.length / 4)), 'Cache-Control': status === 200 ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'public, s-maxage=300', ...extra };
  return new Response(request.method === 'HEAD' ? null : body, { status, headers });
}

async function handle(request) {
  const url = new URL(request.url);
  const path = (url.searchParams.get('path') || '').replace(/^\/+|\/+$/g, '').replace(/\.md$/, '');
  if (url.searchParams.get('miss') || path.includes('..')) return respond(request, 404, notFound(path));
  const file = path ? `/${path}.md` : '/index.md';
  const res = await fetch(new URL(file, url.origin));
  if (!res.ok) return respond(request, 404, notFound(path));
  const canonical = `https://nextplaygame.me/${path}`;
  return respond(request, 200, await res.text(), { 'Content-Location': canonical, Link: `<${canonical}>; rel="canonical"` });
}

export const GET = handle;
export const HEAD = handle;
export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...HEADERS, 'Access-Control-Max-Age': '86400' } });
}
