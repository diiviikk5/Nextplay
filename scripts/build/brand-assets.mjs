// Generates public/ brand assets (no image deps): favicon.svg, icon-192/512.png, og-default.png, manifest.
// Run once after changing brand colors: node scripts/build/brand-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const PUB = path.resolve(import.meta.dirname, '../../public');
const BG = [11, 11, 13];
const LIME = [200, 255, 46];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function png(w, h, pixel) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const [r, g, b] = pixel(x, y);
      const o = y * (w * 3 + 1) + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// Anti-aliased coverage via 4x4 supersampling.
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function sample(fn, x, y) {
  let hit = 0;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) hit += fn(x + (i + 0.5) / 4, y + (j + 0.5) / 4) ? 1 : 0;
  return hit / 16;
}
const inRounded = (x, y, x0, y0, s, r) => {
  if (x < x0 || y < y0 || x > x0 + s || y > y0 + s) return false;
  const cx = Math.min(Math.max(x, x0 + r), x0 + s - r), cy = Math.min(Math.max(y, y0 + r), y0 + s - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
// Play triangle pointing right, centered in a square of size s at (x0, y0).
const inTriangle = (x, y, x0, y0, s) => {
  const ax = x0 + s * 0.38, ay = y0 + s * 0.29, by = y0 + s * 0.71, cx = x0 + s * 0.72, cy = y0 + s * 0.5;
  if (x < ax || x > cx) return false;
  const t = (x - ax) / (cx - ax);
  return y >= ay + (cy - ay) * t && y <= by + (cy - by) * t;
};

function mark(size, { bg = BG, pad = 0 } = {}) {
  const s = size - pad * 2, r = s * 0.22;
  return png(size, size, (x, y) => {
    const sq = sample((px, py) => inRounded(px, py, pad, pad, s, r), x, y);
    const tri = sample((px, py) => inTriangle(px, py, pad, pad, s), x, y);
    return mix(mix(bg, LIME, sq), BG, tri);
  });
}

fs.writeFileSync(path.join(PUB, 'icon-192.png'), mark(192));
fs.writeFileSync(path.join(PUB, 'icon-512.png'), mark(512));
fs.writeFileSync(path.join(PUB, 'icon-maskable-512.png'), mark(512, { bg: LIME, pad: 0 }));

// 1200x630 social card: dark field, lime mark left-of-center, subtle lime baseline.
const W = 1200, H = 630, S = 220, X0 = (W - S) / 2, Y0 = (H - S) / 2 - 20;
fs.writeFileSync(
  path.join(PUB, 'og-default.png'),
  png(W, H, (x, y) => {
    if (y >= H - 10) return LIME;
    const sq = sample((px, py) => inRounded(px, py, X0, Y0, S, S * 0.22), x, y);
    if (!sq) return BG;
    const tri = sample((px, py) => inTriangle(px, py, X0, Y0, S), x, y);
    return mix(mix(BG, LIME, sq), BG, tri);
  })
);

fs.writeFileSync(
  path.join(PUB, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#c8ff2e"/><path d="M24.3 18.6 46.1 32 24.3 45.4z" fill="#0b0b0d"/></svg>\n`
);

fs.writeFileSync(
  path.join(PUB, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: 'NextPlay – Game Release Dates',
      short_name: 'NextPlay',
      description: 'Video game release dates, countdowns and what to play next.',
      start_url: '/',
      display: 'standalone',
      background_color: '#0b0b0d',
      theme_color: '#0b0b0d',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  ) + '\n'
);
console.log('brand assets written to public/');
