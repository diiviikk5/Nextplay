// Minimal IGDB v4 client with token caching and polite rate limiting (IGDB allows 4 req/s).

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

let token = null;
let lastCall = 0;

export function assertCredentials() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing IGDB_CLIENT_ID / IGDB_CLIENT_SECRET. Copy .env.example to .env and fill them in.');
  }
}

async function getToken() {
  if (token) return token;
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error(`Twitch token request failed: ${res.status}`);
  token = (await res.json()).access_token;
  return token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function igdb(endpoint, body, attempt = 0) {
  const wait = 280 - (Date.now() - lastCall);
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();

  const res = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${await getToken()}`,
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (res.status === 429 && attempt < 5) {
    await sleep(1000 * (attempt + 1));
    return igdb(endpoint, body, attempt + 1);
  }
  if (!res.ok) throw new Error(`IGDB ${endpoint} ${res.status}: ${await res.text()}`);
  return res.json();
}

// Page through a query until `max` rows or the result set ends.
export async function igdbAll(endpoint, fields, where, sort, max = 500) {
  const out = [];
  for (let offset = 0; offset < max; offset += 500) {
    const limit = Math.min(500, max - offset);
    const rows = await igdb(endpoint, `fields ${fields}; where ${where}; ${sort ? `sort ${sort};` : ''} limit ${limit}; offset ${offset};`);
    out.push(...rows);
    if (rows.length < limit) break;
  }
  return out;
}

export async function igdbByIds(endpoint, fields, ids, chunk = 250) {
  const out = [];
  const list = [...new Set(ids)];
  for (let i = 0; i < list.length; i += chunk) {
    const part = list.slice(i, i + chunk);
    out.push(...(await igdb(endpoint, `fields ${fields}; where id = (${part.join(',')}); limit ${part.length};`)));
  }
  return out;
}
