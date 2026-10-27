// Countdown widget URL + embed snippet, shared by the game page (client) and the generator (server/widgets.js).
import { SITE, BRAND } from './site.js';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const widgetPath = (slug) => `/widget/countdown/${slug}`;

// Branded credit link only (Google treats keyword-rich widget links as link spam).
export const embedCode = (slug, name) =>
  `<iframe src="${SITE}${widgetPath(slug)}" title="${esc(name)} countdown" width="360" height="110" style="border:0;max-width:100%" loading="lazy"></iframe>\n<p style="font-size:12px;margin:4px 0 0"><a href="${SITE}/game/${slug}">Countdown by ${BRAND}</a></p>`;
