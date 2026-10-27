// Markdown building blocks shared by every renderer in server/md/registry.js.
import { SITE } from '../../src/lib/site.js';
import { releaseLabel } from '../../src/lib/format.js';
import { platformName } from '../../src/lib/platforms.js';

// Internal links always point at the canonical HTML page, never the .md alternate.
export const abs = (path) => (/^https?:/.test(path) ? path : `${SITE}${path === '/' ? '/' : path}`);
export const mdPath = (path) => (path === '/' ? '/index.md' : `${path}.md`);

const escText = (s = '') => String(s).replace(/([\\[\]])/g, '\\$1').replace(/\s+/g, ' ').trim();
const escCell = (s = '') => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

export const link = (text, path) => `[${escText(text)}](${abs(path)})`;
export const h2 = (s) => `## ${s}`;
export const h3 = (s) => `### ${s}`;
export const list = (items) => items.filter(Boolean).map((x) => `- ${x}`).join('\n');
export const table = (head, rows) =>
  rows.length ? [`| ${head.map(escCell).join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(escCell).join(' | ')} |`)].join('\n') : '';
export const faq = (items = []) => items.map(({ q, a }) => `${h3(q)}\n\n${a}`).join('\n\n');
export const platforms = (codes = []) => codes.map(platformName).join(', ') || 'Platforms TBA';
export const isoDay = (ts) => new Date(ts * 1000).toISOString().slice(0, 10);

// One line per game, used by every listing: "- [Name](url) - Oct 21, 2026 · PC, PS5".
export function gameLine(g, extra = '') {
  const when = g.precision === 'tbd' || !g.date ? 'TBA' : releaseLabel(g.date, g.precision);
  const bits = [when, platforms(g.platforms), g.rating ? `rated ${g.rating}/100` : '', extra].filter(Boolean);
  return `${link(g.name, `/game/${g.slug}`)} - ${bits.join(' · ')}`;
}
export const gameList = (games = []) => list(games.map((g) => gameLine(g)));

// Wraps a page body in the shared document shape (title, summary, canonical, date, related links).
export function doc({ title, summary, path, updated, sections, related = [] }) {
  const parts = [`# ${title}`, `> ${summary}`, `Canonical: ${abs(path)}\nLast updated: ${updated}`, ...sections.filter(Boolean)];
  const rel = related.filter((r) => r && r.path);
  if (rel.length) parts.push(`${h2('Related')}\n${list(rel.map((r) => link(r.name, r.path)))}`);
  return `${parts.join('\n\n')}\n`;
}
