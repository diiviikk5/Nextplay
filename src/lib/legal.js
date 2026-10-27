// Legal page text, shared by the HTML page (src/pages/Static.jsx) and its markdown version (server/md).
import { CONTACT } from './site.js';

export const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      ['What we collect', 'NextPlay does not have accounts and does not ask for personal information. Your watchlist and tier lists are stored only in your own browser (localStorage) and never sent to us.'],
      ['Analytics', 'We use Vercel Web Analytics to count page views. It is cookieless and does not track you across sites.'],
      ['Embedded content', 'Trailers load from youtube-nocookie.com only after you press play. Images load from the IGDB image CDN.'],
      ['Contact', `Questions about privacy: ${CONTACT}.`],
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      ['Use of the site', 'NextPlay is a free information service. You may use it for personal, non-commercial purposes.'],
      ['Accuracy', 'Release dates come from IGDB and Steam and change often. We refresh daily but cannot guarantee every date is correct — always confirm with the publisher before buying.'],
      ['Content ownership', 'Game names, artwork and trailers belong to their respective owners and are shown for identification and commentary.'],
      ['Changes', 'We may update these terms; the current version is always on this page.'],
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    body: [
      ['Data sources', 'Game data is provided by IGDB.com and the Steam store. NextPlay is not affiliated with IGDB, Twitch, Valve, Sony, Microsoft, Nintendo or any publisher.'],
      ['No guarantees', 'Dates, prices and specifications can change without notice. Store links go to third-party sites.'],
    ],
  },
};
