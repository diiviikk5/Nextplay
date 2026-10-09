// <head> rendering. Server: headHtml() string injected by the prerenderer. Client: applyHead() on navigation.

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON-LD inside <script>: only "<" needs neutralising.
const ldJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

function tags(seo) {
  const robots = seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  return [
    ['meta', { name: 'description', content: seo.description }],
    ['meta', { name: 'robots', content: robots }],
    ['link', { rel: 'canonical', href: seo.url }],
    ['meta', { property: 'og:type', content: seo.type === 'video.game' ? 'website' : seo.type }],
    ['meta', { property: 'og:site_name', content: 'NextPlay' }],
    ['meta', { property: 'og:title', content: seo.title }],
    ['meta', { property: 'og:description', content: seo.description }],
    ['meta', { property: 'og:url', content: seo.url }],
    ['meta', { property: 'og:image', content: seo.image }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: seo.title }],
    ['meta', { name: 'twitter:description', content: seo.description }],
    ['meta', { name: 'twitter:image', content: seo.image }],
  ];
}

export function headHtml(seo) {
  const out = [`<title>${esc(seo.title)}</title>`];
  for (const [tag, attrs] of tags(seo)) {
    out.push(`<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} data-np>`);
  }
  for (const ld of seo.jsonLd || []) out.push(`<script type="application/ld+json" data-np>${ldJson(ld)}</script>`);
  return out.join('\n    ');
}

export function applyHead(seo) {
  if (!seo || typeof document === 'undefined') return;
  document.title = seo.title;
  document.head.querySelectorAll('[data-np]').forEach((el) => el.remove());
  const frag = document.createDocumentFragment();
  for (const [tag, attrs] of tags(seo)) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v ?? ''));
    el.setAttribute('data-np', '');
    frag.appendChild(el);
  }
  for (const ld of seo.jsonLd || []) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    s.setAttribute('data-np', '');
    frag.appendChild(s);
  }
  document.head.appendChild(frag);
}
