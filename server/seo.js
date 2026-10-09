// SEO builders: titles, descriptions, JSON-LD. Titles are written to match how people actually search
// (Search Console: "<game> release date", "<game> ps5", "is <game> on xbox", "upcoming mac games").
import { releaseLabel, isoDate, truncate, listJoin } from '../src/lib/format.js';
import { PLATFORMS, MAJOR_PLATFORMS, platformName, platformShort } from '../src/lib/platforms.js';
import { cover, ogImage } from '../src/lib/images.js';
import { NOW } from './db.js';

export const SITE = 'https://nextplaygame.me';
export const BRAND = 'NextPlay';
const ORG_ID = `${SITE}/#org`;

// Pick the longest candidate that fits; append brand only when there is room.
export function fitTitle(candidates, max = 62) {
  const fit = candidates.find((c) => c.length <= max) || candidates[candidates.length - 1];
  return fit.length + BRAND.length + 3 <= max ? `${fit} | ${BRAND}` : fit;
}

export function seo({ path, title, description, image, type = 'website', noindex = false, jsonLd = [], breadcrumbs }) {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const ld = [...jsonLd];
  if (breadcrumbs?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', path: '/' }, ...breadcrumbs].map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: `${SITE}${b.path}` })),
    });
  }
  return { title, description: truncate(description, 160), url, image: image || `${SITE}/og-default.png`, type, noindex, jsonLd: ld, crumbs: breadcrumbs || [] };
}

export const platformsPhrase = (codes, long = true) => listJoin(codes.map((c) => (long ? platformName(c) : platformShort(c))));

function headlineDate(g, long = false) {
  return releaseLabel(g.date, g.precision, { long });
}

// ---------- Game pages ----------

export function gameTitle(g) {
  const date = headlineDate(g);
  const majors = g.platforms.filter((p) => MAJOR_PLATFORMS.includes(p) || p === 'switch' || p === 'mac');
  const shorts = (majors.length ? majors : g.platforms).slice(0, 4).map(platformShort).join(', ');
  if (g.released) {
    const year = new Date(g.date * 1000).getUTCFullYear();
    return fitTitle([
      `${g.name} (${year}): Platforms, Release Date & Reviews`,
      `${g.name} (${year}): Platforms & Reviews`,
      `${g.name} (${year})`,
      g.name,
    ]);
  }
  if (date === 'TBA') {
    return fitTitle([`${g.name} Release Date: Platforms & Everything We Know`, `${g.name} Release Date & Platforms`, `${g.name} Release Date`, g.name]);
  }
  return fitTitle([
    `${g.name} ${g.early ? 'Early Access' : 'Release'} Date: ${date} (${shorts}) & Countdown`,
    `${g.name} Release Date: ${date} (${shorts}) & Countdown`,
    `${g.name} Release Date: ${date} (${shorts})`,
    `${g.name} Release Date: ${date}`,
    `${g.name} Release Date`,
    g.name,
  ]);
}

// Per-platform availability answer, e.g. "not announced for PS5" — exactly what "<game> ps5" searchers want.
export function platformAnswer(g, code) {
  const rel = g.releases.find((r) => r.platform === code);
  const name = platformName(code);
  if (!g.platforms.includes(code)) {
    const on = g.platforms.length ? platformsPhrase(g.platforms) : 'unannounced platforms';
    return { yes: false, text: `No. ${g.name} has not been announced for ${name}. It is ${g.released ? 'available' : 'coming'} on ${on}.` };
  }
  if (!rel || !rel.date || rel.precision === 'tbd') return { yes: true, text: `Yes. ${g.name} is confirmed for ${name}; a release date for that version has not been announced yet.` };
  const when = releaseLabel(rel.date, rel.precision, { long: true });
  const past = rel.precision === 'day' && rel.date <= NOW;
  return { yes: true, text: past ? `Yes. ${g.name} launched on ${name} on ${when}.` : `Yes. ${g.name} is coming to ${name} on ${when}.` };
}

export function gameDescription(g) {
  const date = headlineDate(g, true);
  const on = g.platforms.length ? platformsPhrase(g.platforms) : null;
  const notOn = MAJOR_PLATFORMS.filter((p) => !g.platforms.includes(p)).map(platformName);
  let lead;
  const ea = g.early ? ' in Early Access' : '';
  if (g.released) lead = `${g.name} released${ea} ${g.precision === 'day' ? 'on ' : 'in '}${date}${on ? ` on ${on}` : ''}.`;
  else if (date === 'TBA') lead = `${g.name} has no release date yet${on ? `; it is confirmed for ${on}` : ''}.`;
  else lead = `${g.name} launches${ea} ${g.precision === 'day' ? 'on ' : 'in '}${date}${on ? ` on ${on}` : ''}.`;
  const gap = notOn.length && notOn.length < 4 && g.platforms.length ? ` Not announced for ${listJoin(notOn, 'or')}.` : '';
  const dev = g.developers[0] ? ` From ${g.developers[0].name}.` : '';
  const extras = g.released ? ' Reviews, trailer, PC specs & similar games.' : ' Live countdown, trailer & every platform date.';
  return lead + gap + dev + extras;
}

export function gameFaq(g, ctx) {
  const faq = [];
  const date = headlineDate(g, true);
  const differing = new Set(g.releases.filter((r) => r.date).map((r) => r.date)).size > 1;

  if (g.released) {
    faq.push({ q: `When did ${g.name} come out?`, a: `${g.name} was released${g.early ? ' in Early Access' : ''} ${g.precision === 'day' ? 'on ' : 'in '}${date}${g.platforms.length ? ` for ${platformsPhrase(g.platforms)}` : ''}.` });
  } else if (date === 'TBA') {
    faq.push({ q: `When does ${g.name} come out?`, a: `${g.name} does not have an announced release date yet. We update this page as soon as one is confirmed.` });
  } else {
    let a = `${g.name} is scheduled to release${g.early ? ' in Early Access' : ''} ${g.precision === 'day' ? 'on ' : 'in '}${date}.`;
    if (differing) {
      const per = g.releases.filter((r) => r.date && r.region === g.releases[0].region).slice(0, 6).map((r) => `${platformName(r.platform)}: ${releaseLabel(r.date, r.precision, { long: true })}`);
      a += ` Dates by platform — ${per.join('; ')}.`;
    }
    faq.push({ q: `When does ${g.name} come out?`, a });
  }

  for (const code of ['ps5', 'xsx', 'switch-2', 'pc']) {
    if (code === 'pc' && g.platforms.includes('pc')) continue;
    faq.push({ q: `Is ${g.name} on ${platformName(code)}?`, a: platformAnswer(g, code).text });
  }
  if (g.developers.length) {
    const pub = g.publishers.filter((p) => !g.developers.some((d) => d.slug === p.slug));
    faq.push({ q: `Who is making ${g.name}?`, a: `${g.name} is developed by ${listJoin(g.developers.map((d) => d.name))}${pub.length ? ` and published by ${listJoin(pub.map((p) => p.name))}` : ''}.` });
  }
  if (g.modes.length) {
    const multi = g.modes.some((m) => /multiplayer|co-operative|mmo|battle royale/i.test(m));
    faq.push({ q: `Is ${g.name} multiplayer?`, a: multi ? `Yes. ${g.name} supports ${listJoin(g.modes.map((m) => m.toLowerCase()))}.` : `No. ${g.name} is ${listJoin(g.modes.map((m) => m.toLowerCase()))} only.` });
  }
  const st = g.steam;
  if (st?.free) faq.push({ q: `Is ${g.name} free to play?`, a: `Yes, ${g.name} is free to play on Steam.` });
  else if (st?.price) faq.push({ q: `How much does ${g.name} cost?`, a: `${g.name} costs $${st.price.final.toFixed(2)} on Steam${st.price.discount ? ` (${st.price.discount}% off, normally $${st.price.initial.toFixed(2)})` : ''}. Prices checked ${ctx.updated}.` });
  if (st?.reviews?.total >= 50) {
    const pct = Math.round((st.reviews.positive / st.reviews.total) * 100);
    faq.push({ q: `Is ${g.name} good?`, a: `Steam players rate it "${st.reviews.label}" — ${pct}% of ${st.reviews.total.toLocaleString('en-US')} reviews are positive.${g.signals.critic && g.signals.criticCount >= 3 ? ` Critics average ${g.signals.critic}/100.` : ''}` });
  } else if (g.signals.critic && g.signals.criticCount >= 3) {
    faq.push({ q: `Is ${g.name} good?`, a: `Critics give ${g.name} an average score of ${g.signals.critic}/100 across ${g.signals.criticCount} reviews.` });
  }
  if (st?.pc?.min) {
    const gpu = st.pc.min.find(([k]) => /graphics|video/i.test(k))?.[1];
    if (gpu) faq.push({ q: `What are the minimum PC requirements for ${g.name}?`, a: `The minimum GPU is ${truncate(gpu, 120)}. See the full minimum and recommended specs on our ${g.name} system requirements page.` });
  }
  return faq;
}

export function gameJsonLd(g, faq, path) {
  const url = `${SITE}${path}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    '@id': `${url}#game`,
    name: g.name,
    url,
    description: truncate(g.summary || gameDescription(g), 500),
    image: g.cover ? cover(g.cover, '1080p') : undefined,
    gamePlatform: g.platforms.map((p) => PLATFORMS[p].long),
    genre: g.genres.map((x) => x.name),
    applicationCategory: 'Game',
    playMode: g.modes.map((m) => (/multi|co-op|mmo/i.test(m) ? 'MultiPlayer' : 'SinglePlayer')).filter((v, i, a) => a.indexOf(v) === i),
    author: g.developers.map((d) => ({ '@type': 'Organization', name: d.name, url: `${SITE}/developer/${d.slug}` })),
    publisher: g.publishers.map((p) => ({ '@type': 'Organization', name: p.name, url: `${SITE}/publisher/${p.slug}` })),
    datePublished: g.date && g.precision === 'day' ? isoDate(g.date) : undefined,
    gameSeries: g.series[0] ? { '@type': 'VideoGameSeries', name: g.series[0].name, url: `${SITE}/series/${g.series[0].slug}` } : undefined,
    gameEdition: g.type !== 'main' ? g.type : undefined,
    alternateName: g.aka.length ? g.aka : undefined,
    contentRating: g.ageRatings.ESRB ? `ESRB ${g.ageRatings.ESRB}` : g.ageRatings.PEGI ? `PEGI ${g.ageRatings.PEGI}` : undefined,
    sameAs: [g.websites.official, g.websites.steam, g.websites.wikipedia].filter(Boolean),
    trailer: g.videos[0]
      ? { '@type': 'VideoObject', name: `${g.name} – ${g.videos[0].name || 'Trailer'}`, embedUrl: `https://www.youtube.com/embed/${g.videos[0].id}`, thumbnailUrl: `https://i.ytimg.com/vi/${g.videos[0].id}/hqdefault.jpg` }
      : undefined,
    offers: g.steam?.price || g.steam?.free
      ? { '@type': 'Offer', url: g.websites.steam, price: g.steam.free ? 0 : g.steam.price.final, priceCurrency: 'USD', availability: g.released ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' }
      : undefined,
  };
  const out = [ld];
  if (faq.length) out.push(faqLd(faq));
  return out;
}

export function faqLd(faq) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}

export function itemListLd(name, path, list) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: `${SITE}${path}`,
    numberOfItems: list.length,
    itemListElement: list.slice(0, 50).map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/game/${g.slug}`, name: g.name })),
  };
}

export const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRAND,
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  sameAs: ['https://github.com/diiviikk5/Nextplay'],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: BRAND,
  alternateName: ['NextPlay Game', 'nextplaygame.me'],
  url: SITE,
  publisher: { '@id': ORG_ID },
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` }, 'query-input': 'required name=search_term_string' },
};

export { ogImage };
