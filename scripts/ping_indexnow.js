// Submits pages whose content changed (data/db/changed.json, written by `prerender --lastmod-only`)
// to IndexNow (Bing, Yandex, Seznam, Naver…). Key file: public/<KEY>.txt
// Usage: node scripts/ping_indexnow.js [--all-hubs]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const HOST = 'nextplaygame.me';
const KEY = 'c0a87f2e1b4d9e3f8a5c2d6e7f1a0b3c';

const changedFile = path.join(ROOT, 'data/db/changed.json');
const changed = fs.existsSync(changedFile) ? JSON.parse(fs.readFileSync(changedFile, 'utf8')) : [];
const hubs = ['/', '/upcoming', '/new-releases', '/trending', '/most-anticipated'];
const urls = [...new Set([...hubs, ...changed])].map((p) => `https://${HOST}${p}`);

if (!urls.length) {
  console.log('[indexnow] nothing changed');
  process.exit(0);
}

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });
  console.log(`[indexnow] ${urlList.length} URLs -> ${res.status} ${res.statusText}`);
  if (res.status >= 400) process.exitCode = 1;
}
