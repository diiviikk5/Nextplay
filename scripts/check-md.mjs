// Fails if any page type in src/routes.js has no markdown renderer (server/md/registry.js), or if one
// real page of each type fails to render. Also runs inside the build. Usage: npm run check:md
import { ROUTES } from '../src/routes.js';
import { checkCoverage, renderMarkdown, listMarkdownRoutes, SKIP } from '../server/md/registry.js';
import { matchPath } from 'react-router';

checkCoverage();
const seen = new Map();
for (const p of listMarkdownRoutes()) {
  const route = ROUTES.find((r) => matchPath({ path: r.path, end: true }, p));
  if (route && !seen.has(route.path)) seen.set(route.path, p);
}
let failed = 0;
for (const route of ROUTES) {
  if (SKIP[route.page]) {
    console.log(`skip  ${route.path.padEnd(28)} ${SKIP[route.page]}`);
    continue;
  }
  const sample = seen.get(route.path);
  if (!sample) {
    console.log(`none  ${route.path.padEnd(28)} (no pages of this type in the current data)`);
    continue;
  }
  const r = renderMarkdown(sample);
  const good = r.status === 200 && r.body.startsWith('# ') && r.body.includes('Canonical: https://');
  if (!good) failed++;
  console.log(`${good ? 'ok   ' : 'FAIL '} ${route.path.padEnd(28)} ${sample} (${r.body.length} chars)`);
}
if (failed) {
  console.error(`[check:md] ${failed} route type(s) failed`);
  process.exit(1);
}
