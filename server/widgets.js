// Embeddable countdown widgets: dist/widget/countdown/<slug>.html, a standalone ~3 KB page (no React) that
// blogs, Discord/stream overlays and fan sites can iframe. The credit link is branded ("Countdown by NextPlay"),
// never keyword-stuffed: Google treats keyword-rich widget links as link spam.
import { SITE, BRAND } from '../src/lib/site.js';
import { releaseLabel } from '../src/lib/format.js';
import { platformShort } from '../src/lib/platforms.js';
import { cover } from '../src/lib/images.js';
import { games, NOW } from './db.js';

export { widgetPath } from '../src/lib/widget.js';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Only games with an exact release day can count down.
export const widgetGames = () => games.filter((g) => g.precision === 'day' && g.date > NOW && g.status !== 'cancelled');

export function widgetHtml(g) {
  const page = `${SITE}/game/${g.slug}`;
  const img = cover(g.cover, 'cover_small');
  const plats = g.platforms.slice(0, 4).map(platformShort).join(' · ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${page}">
<title>${esc(g.name)} countdown | ${BRAND}</title>
<style>
*{box-sizing:border-box;margin:0}html,body{height:100%;background:transparent}
body{font:14px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#f4f4f5}
.w{display:flex;gap:12px;align-items:center;height:100%;padding:12px 14px;background:#0b0b0d;border:1px solid #26262b;border-radius:14px;overflow:hidden}
.c{width:54px;height:72px;border-radius:6px;object-fit:cover;flex:none;background:#18181b}
.b{min-width:0;flex:1}.n{font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m{color:#a1a1aa;font-size:12px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t{display:flex;gap:10px;margin-top:8px}.u{text-align:center}.v{font:700 20px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:#c8ff2e}
.l{font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.06em;margin-top:3px}
.o{font-weight:700;color:#c8ff2e;margin-top:8px}
a.cr{display:block;font-size:11px;color:#a1a1aa;margin-top:6px;text-decoration:none}a.cr:hover{color:#c8ff2e}
</style>
</head>
<body>
<div class="w">
${img ? `<img class="c" src="${img}" alt="" width="54" height="72">` : ''}
<div class="b">
<div class="n">${esc(g.name)}</div>
<div class="m">${esc(releaseLabel(g.date, 'day', { long: true }))}${plats ? ` · ${esc(plats)}` : ''}</div>
<div class="t" id="t" data-to="${g.date}" role="timer" aria-live="off"></div>
<a class="cr" href="${page}" target="_blank" rel="noopener">Countdown by ${BRAND}</a>
</div>
</div>
<script>
(function(){var el=document.getElementById('t'),to=+el.dataset.to;
function tick(){var s=Math.max(0,Math.floor(to-Date.now()/1000));if(!s){el.outerHTML='<div class="o">Out now</div>';return}
var d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60,p=function(n){return n<10?'0'+n:n};
el.innerHTML=[[d,d===1?'day':'days'],[p(h),'hrs'],[p(m),'min'],[p(x),'sec']].map(function(u){return '<div class="u"><div class="v">'+u[0]+'</div><div class="l">'+u[1]+'</div></div>'}).join('');setTimeout(tick,1000)}
tick()})();
</script>
</body>
</html>
`;
}
