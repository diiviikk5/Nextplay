import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'www.nextplaygame.me';
const KEY = 'c0a87f2e1b4d9e3f8a5c2d6e7f1a0b3c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Collect top URLs to ping
const gamesPath = path.join(__dirname, '..', 'src', 'data', 'games.json');
const trendsPath = path.join(__dirname, '..', 'src', 'data', 'gaming_trends_ontology.json');

const games = fs.existsSync(gamesPath) ? JSON.parse(fs.readFileSync(gamesPath, 'utf8')) : [];
const trends = fs.existsSync(trendsPath) ? JSON.parse(fs.readFileSync(trendsPath, 'utf8')) : [];

const urlList = [
    `https://${HOST}/`,
    `https://${HOST}/trends`,
    `https://${HOST}/calendar`,
    `https://${HOST}/can-i-run-it`,
    `https://${HOST}/battles`,
    `https://${HOST}/tier-list`,
    `https://${HOST}/compare`,
    `https://${HOST}/system-requirements`,
    `https://${HOST}/games-like`,
    ...trends.slice(0, 100).map(t => `https://${HOST}/trends/${t.slug}`),
    ...games.slice(0, 50).map(g => `https://${HOST}/game/${g.slug}`)
];

const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
});

console.log(`📡 Pinging Bing IndexNow with ${urlList.length} high-velocity URLs...`);

const options = {
    hostname: 'www.bing.com',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
    }
};

const req = https.request(options, (res) => {
    console.log(`Bing IndexNow Response: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode === 200 || res.statusCode === 202) {
        console.log(`✅ Bing & partner engines accepted ${urlList.length} URLs for immediate crawl!`);
    }
});

req.on('error', (e) => {
    console.warn(`IndexNow notice: ${e.message}`);
});

req.write(payload);
req.end();
