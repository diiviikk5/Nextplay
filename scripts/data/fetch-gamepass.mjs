// Xbox Game Pass catalog (US): what's in it on console and PC, coming soon, leaving soon, recently added.
// Public endpoints used by xbox.com. Writes data/db/gamepass.json keyed by Microsoft Store product ID; server/db.js
// matches products to games by the Xbox store URL from IGDB, falling back to the normalised title.
// Daily runs keep `since` (first day seen in the catalog) so pages can say "added on <date>".
// Usage: node scripts/data/fetch-gamepass.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'data/db/gamepass.json');

const LISTS = {
  console: 'f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e',
  pc: '609d944c-d395-4c0a-9ea4-e9f39b52c1ad',
  coming: '095bda36-f5cd-43f2-9ee1-0a72f371fb96',
  leaving: '393f05bf-e596-4ef6-9487-6d4fa0eab987',
  recent: 'f13cf6b4-57e6-4459-89df-6aec18cf0538',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (attempt >= 3) throw new Error(`${res.status} ${url}`);
    await sleep(1500 * attempt);
  }
}

const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { items: {} };
const today = new Date().toISOString().slice(0, 10);

const membership = new Map(); // productId -> Set(list)
for (const [list, id] of Object.entries(LISTS)) {
  const rows = await getJson(`https://catalog.gamepass.com/sigls/v2?id=${id}&language=en-us&market=US`);
  const ids = rows.filter((r) => r.id).map((r) => r.id);
  ids.forEach((pid) => (membership.has(pid) ? membership : membership.set(pid, new Set())).get(pid).add(list));
  console.log(`[gamepass] ${list}: ${ids.length}`);
}

const ids = [...membership.keys()];
const items = {};
for (let i = 0; i < ids.length; i += 20) {
  const batch = ids.slice(i, i + 20);
  const { Products = [] } = await getJson(`https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${batch.join(',')}&market=US&languages=en-us`);
  for (const p of Products) {
    const lists = [...membership.get(p.ProductId)];
    items[p.ProductId] = {
      title: p.LocalizedProperties?.[0]?.ProductTitle?.trim(),
      lists,
      since: prev.items[p.ProductId]?.since || (lists.includes('coming') ? null : today),
    };
  }
  await sleep(200);
}

// A sanity floor: a broken endpoint must not wipe the catalog.
const live = Object.values(items).filter((x) => x.lists.includes('console') || x.lists.includes('pc')).length;
if (live < 200) throw new Error(`[gamepass] only ${live} catalog games, refusing to overwrite`);

fs.writeFileSync(OUT, JSON.stringify({ fetchedAt: Date.now(), market: 'US', items }, null, 0) + '\n');
console.log(`[gamepass] ${Object.keys(items).length} products (${live} in the catalog) -> data/db/gamepass.json`);
