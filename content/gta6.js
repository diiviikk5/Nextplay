// GTA VI hub content. Written in our own words from official Rockstar material (rockstargames.com/VI, Newswire),
// the PlayStation Store listing, and attributed press reports. Never copy text from other sites, and never state
// unconfirmed details (unlock time, file size, cheats, map size) as fact. Re-verify after launch.
// ctx: { out: boolean (game is released), checked: 'Month D, YYYY' }

const SRC = {
  rockstar: { name: 'Rockstar Games: Grand Theft Auto VI', url: 'https://www.rockstargames.com/VI' },
  leonida: { name: 'Rockstar Games: Only in Leonida (characters and places)', url: 'https://www.rockstargames.com/VI/only-in-leonida' },
  music: { name: 'Rockstar Games: The Music of Grand Theft Auto VI', url: 'https://www.rockstargames.com/VI/music' },
  preload: { name: 'Rockstar Newswire: Pre-Load Grand Theft Auto VI Now (Nov 10, 2026)', url: 'https://www.rockstargames.com/newswire/article/89834o94713o21' },
  preloadDate: { name: 'Rockstar Newswire: Pre-Load Begins on November 10 (Nov 3, 2026)', url: 'https://www.rockstargames.com/newswire/article/k4ak9okk485712' },
  gallery: { name: 'Rockstar Newswire: Explore the Launch Gallery (Nov 5, 2026)', url: 'https://www.rockstargames.com/newswire/article/39ak81277255o9' },
  psstore: { name: 'PlayStation Store: Grand Theft Auto VI', url: 'https://store.playstation.com/en-us/concept/10000730' },
  store: { name: 'Rockstar Store: Grand Theft Auto VI Collection', url: 'https://store.rockstargames.com/grand-theft-auto-vi-collection' },
  forbes: { name: 'Forbes: GTA VI release date and pre-order info (Oct 28, 2026)', url: 'https://www.forbes.com/sites/brianmazique/2026/10/28/gta-vis-physical-copy-has-a-twist---what-you-actually-get-at-launch/' },
  dotesports: { name: 'Dot Esports: GTA 6 release date, price, map, characters', url: 'https://dotesports.com/gta/news/gta-6' },
};

export const GTA_SLUG = 'grand-theft-auto-vi';

export const TRAILERS = [
  { id: 'QdBZY2fkU-0', name: 'Trailer 1', when: 'December 5, 2023', note: 'The reveal of Vice City and Lucia. Rockstar released it a day early after it leaked online.' },
  { id: 'VQRLujxTm3c', name: 'Trailer 2', when: 'May 6, 2025', note: 'Introduced Jason and more of Leonida, and came days after the first delay.' },
  { id: 'tJbzMqJGH4k', name: 'Gameplay video', when: null, note: 'Official footage listed on IGDB as a gameplay video.' },
  { id: 'rz1B4B2yBZY', name: 'Launch Trailer', when: null, note: 'The final trailer before release, linked from the official site.' },
];

export const CHARACTERS = [
  {
    slug: 'jason-duval',
    name: 'Jason Duval',
    role: 'Protagonist',
    bio: [
      'Jason is one of the two playable leads. He grew up surrounded by hustlers and small-time criminals, joined the Army to get away from that life, and ended up back in it anyway: running errands for drug smugglers in the Leonida Keys.',
      'He wants things to be simple and they never are. Rockstar frames his meeting with Lucia as the point where his life could go either way.',
      'He lives rent-free at a property owned by Brian Heder, paying his way by helping with local shakedowns.',
    ],
    links: ['lucia-caminos', 'brian-heder', 'cal-hampton'],
  },
  {
    slug: 'lucia-caminos',
    name: 'Lucia Caminos',
    role: 'Protagonist',
    bio: [
      'Lucia is the other playable lead, and the first woman to headline a mainline GTA in the 3D era. Her father taught her to fight young, and fighting for her family is what put her in Leonida Penitentiary.',
      'She got out by luck and is determined not to waste it. Her family came from Liberty City, and the life her mother always dreamed about is what drives her.',
      'Rockstar describes a future with Jason as her possible way out, and Lucia as someone who would rather take control than wait for things to change.',
    ],
    links: ['jason-duval', 'raul-bautista', 'boobie-ike'],
  },
  {
    slug: 'cal-hampton',
    name: 'Cal Hampton',
    role: 'Supporting',
    bio: [
      'Cal is Jason’s friend and, like Jason, works with Brian Heder. He is a homebody conspiracy theorist who would rather sit at home with a few beers listening in on Coast Guard radio traffic.',
      'Rockstar plays him as a comic counterweight: content at the bottom of the ladder while Jason aims higher.',
    ],
    links: ['jason-duval', 'brian-heder'],
  },
  {
    slug: 'boobie-ike',
    name: 'Boobie Ike',
    role: 'Supporting',
    bio: [
      'Boobie is a Vice City legend who turned street money into legitimate businesses: property, a strip club and a recording studio.',
      'He is friendly until money is on the table. His biggest bet is Only Raw Records, the label he runs with Dre’Quan Priest.',
    ],
    links: ['dre-quan-priest', 'real-dimez'],
  },
  {
    slug: 'dre-quan-priest',
    name: 'Dre’Quan Priest',
    role: 'Supporting',
    bio: [
      'Dre’Quan always cared more about music than the street, even while dealing to get by. He is Boobie Ike’s partner in Only Raw Records.',
      'With Real Dimez signed to the label, he is looking past booking acts into Boobie’s club and towards the wider Vice City music scene.',
    ],
    links: ['boobie-ike', 'real-dimez'],
  },
  {
    slug: 'real-dimez',
    name: 'Real Dimez',
    role: 'Supporting',
    bio: [
      'Real Dimez is a rap duo, Bae-Luxe and Roxy, friends since high school. They made their name with tracks and a huge social media presence funded partly by shaking down local dealers.',
      'An early hit with local rapper DWNPLY made them famous; five rough years later they are signed to Only Raw Records and chasing a second hit.',
    ],
    links: ['dre-quan-priest', 'boobie-ike'],
  },
  {
    slug: 'raul-bautista',
    name: 'Raul Bautista',
    role: 'Supporting',
    bio: [
      'Raul is a veteran bank robber: charming, confident and always recruiting people willing to take big risks for big payouts.',
      'Rockstar warns that his recklessness raises the stakes on every job, which suggests he will pull Jason and Lucia into larger heists.',
    ],
    links: ['lucia-caminos', 'jason-duval'],
  },
  {
    slug: 'brian-heder',
    name: 'Brian Heder',
    role: 'Supporting',
    bio: [
      'Brian is an old-school smuggler from the glory days of running drugs through the Keys. He still moves product through his boat yard with his third wife, Lori.',
      'He lets younger people do the dirty work, including Jason, who lives in one of Brian’s properties in exchange for help with shakedowns.',
    ],
    links: ['jason-duval', 'cal-hampton'],
  },
];

export const REGIONS = [
  { name: 'Vice City', text: 'The neon-lit city at the centre of the game: beaches, nightlife, clubs and the music scene around Only Raw Records. It returns from Vice City (2002), rebuilt for the modern day.' },
  { name: 'Leonida Keys', text: 'A chain of islands where Jason works for local smugglers and Brian Heder runs his boat yard.' },
  { name: 'Grassrivers', text: 'Wetlands featured in Rockstar’s tour of Leonida. Airboats and swamp country feature heavily in the trailers.' },
  { name: 'Port Gellhorn', text: 'A coastal town that Rockstar lists among Leonida’s must-see destinations.' },
  { name: 'Ambrosia', text: 'An inland area on Rockstar’s official tour of Leonida.' },
  { name: 'Mount Kalaga', text: 'The wilder, more rugged part of Leonida on Rockstar’s tour.' },
];

const releaseWord = (ctx) => (ctx.out ? 'came out' : 'comes out');

export function gta6Pages(ctx) {
  const rw = releaseWord(ctx);
  return [
    {
      slug: 'release-date',
      title: 'GTA 6 Release Date: November 19, 2026 (PS5, Xbox Series X|S)',
      h1: 'GTA 6 release date',
      eyebrow: ctx.out ? 'Out now' : 'November 19, 2026',
      description: `GTA 6 ${rw} on November 19, 2026 for PS5 and Xbox Series X|S. Pre-load opened November 10. Full delay history and what is confirmed about PC.`,
      aiSummary: 'Release date facts for Grand Theft Auto VI: November 19, 2026 on PS5 and Xbox Series X|S, pre-load from November 10, 2026, and the history of its two delays.',
      body: `
**Grand Theft Auto VI ${rw} on November 19, 2026** on PlayStation 5 and Xbox Series X|S. That date is printed on Rockstar’s official site, which also says the game "plays best on PlayStation 5".

## Can you pre-load it?
Yes. Rockstar opened pre-loading on **November 10, 2026** for everyone with a digital pre-order. If you bought the code-in-box version, you can redeem the code and start downloading as soon as you have it. See the [pre-load guide](/gta-6/pre-load).

## What time does it unlock?
Rockstar’s official posts we checked don’t give a single global unlock time. Your console’s store page shows the exact time for your region once it is set.

## Delay history
- **December 2023:** Trailer 1 announced a 2025 release.
- **May 2025:** Rockstar delayed it to May 26, 2026.
- **November 2025:** Rockstar delayed it again, to November 19, 2026.
- **June 2026:** Pre-orders opened (reported by press including [Dot Esports](https://dotesports.com/gta/news/gta-6)).
- **November 10, 2026:** Pre-load opened.

## Platforms
It launches on **PS5 and Xbox Series X|S only**. It is not coming to PS4 or Xbox One, and it has not been announced for PC or Nintendo Switch 2. More on the [PC version](/gta-6/pc).
`,
      faq: [
        { q: 'When does GTA 6 come out?', a: `GTA 6 ${rw} on November 19, 2026 on PS5 and Xbox Series X|S.` },
        { q: 'Was GTA 6 delayed?', a: 'Yes, twice: from 2025 to May 26, 2026 (announced May 2025), then to November 19, 2026 (announced November 2025).' },
        { q: 'When can I pre-load GTA 6?', a: 'Pre-loading opened on November 10, 2026 for digital pre-orders. Code-in-box buyers can pre-load once they redeem their code.' },
        { q: 'Is GTA 6 on PS4 or Xbox One?', a: 'No. It is only on PS5 and Xbox Series X|S.' },
      ],
      sources: [SRC.rockstar, SRC.preload, SRC.preloadDate, SRC.dotesports],
      related: ['price', 'pre-load', 'pc', 'trailers'],
    },
    {
      slug: 'price',
      title: 'GTA 6 Price: $79.99 Standard, $99.99 Ultimate Edition',
      h1: 'GTA 6 price and editions',
      eyebrow: 'Price & editions',
      description: 'GTA 6 costs $79.99 (Standard) and $99.99 (Ultimate Edition) on the US PlayStation Store. What the Ultimate Edition and Vintage Vice City pre-order pack include.',
      aiSummary: `Grand Theft Auto VI pricing on the US PlayStation Store (checked ${ctx.checked}): Standard $79.99, Ultimate Edition $99.99, plus the official Vintage Vice City pre-order bonus.`,
      body: `
## How much is GTA 6?
On the US PlayStation Store, GTA VI is listed at:
- **Standard Edition: $79.99**
- **Ultimate Edition: $99.99**

That makes the standard edition $10 more than the usual $69.99 for a new console game. Prices in other regions vary; Forbes reports €79.99 and €99.99 in France. *Prices checked ${ctx.checked}.*

## What’s in the Ultimate Edition?
Rockstar describes it as an exclusive set of items spread across every part of Jason and Lucia’s story. Press reports, including [Forbes](${SRC.forbes.url}), say it adds vehicles, weapons, outfits and businesses that unlock as the story progresses, and that it is digital-only.

## Pre-order bonus: Vintage Vice City Pack
Every pre-order gets the **Vintage Vice City Pack**, which Rockstar describes as bonuses that call back to the city’s neon-soaked past. Reports say eligible digital pre-orders also get a month of GTA+.

## Physical copies
Reports say the boxed PS5 and Xbox versions contain a download code rather than a disc. Check the listing before you buy if you need a disc.

## Collector’s items
Rockstar sells a separate **Goodtime State – Vice City Collection** box on the [Rockstar Store](${SRC.store.url}), along with vinyl, CDs and merch. Forbes reports the collector’s box does not include the game.
`,
      faq: [
        { q: 'How much does GTA 6 cost?', a: `$79.99 for the Standard Edition and $99.99 for the Ultimate Edition on the US PlayStation Store (checked ${ctx.checked}).` },
        { q: 'What is the GTA 6 pre-order bonus?', a: 'The Vintage Vice City Pack, included with every pre-order.' },
        { q: 'Is GTA 6 $100?', a: 'Only the Ultimate Edition, at $99.99. The Standard Edition is $79.99.' },
        { q: 'Is GTA 6 on Game Pass or PS Plus?', a: 'No. It is a paid release and is not part of Game Pass or PlayStation Plus.' },
      ],
      sources: [SRC.psstore, SRC.rockstar, SRC.store, SRC.forbes, SRC.dotesports],
      related: ['release-date', 'pre-load', 'music'],
    },
    {
      slug: 'pc',
      title: 'GTA 6 PC Release Date: Not Announced (What We Know)',
      h1: 'Is GTA 6 coming to PC?',
      eyebrow: 'PC version',
      description: 'GTA 6 has not been announced for PC. It launches on PS5 and Xbox Series X|S only. How long earlier Rockstar games took to reach PC.',
      aiSummary: 'Grand Theft Auto VI has no announced PC version. It launches on November 19, 2026 for PS5 and Xbox Series X|S only. Includes past Rockstar console-to-PC gaps for context.',
      body: `
**There is no PC version of GTA 6 announced.** At launch it is only on PS5 and Xbox Series X|S, and Rockstar has given no PC date.

## How long did past Rockstar games take?
These are history, not predictions:
- **GTA V:** consoles September 2013 → PC April 2015 (about 19 months)
- **Red Dead Redemption 2:** consoles October 2018 → PC November 2019 (about 12 months)
- **Red Dead Redemption:** consoles 2010 → PC October 2024 (14 years)

Rockstar usually launches on console first and brings PC later, but it hasn’t said whether that will happen with GTA VI.

## Can you play it on PC some other way?
Not officially. Ignore anything claiming to be a PC download today: no PC build has been released, so those files are scams or malware.
`,
      faq: [
        { q: 'Is GTA 6 on PC?', a: 'Not at launch. GTA 6 has only been announced for PS5 and Xbox Series X|S.' },
        { q: 'When will GTA 6 come to PC?', a: 'Rockstar has not announced a PC date. GTA V took about 19 months to reach PC; Red Dead Redemption 2 took about 12.' },
        { q: 'Is there a GTA 6 PC download?', a: 'No legitimate one. Any GTA 6 PC download you see is fake and may contain malware.' },
      ],
      sources: [SRC.rockstar, SRC.psstore],
      related: ['release-date', 'price'],
    },
    {
      slug: 'pre-load',
      title: 'GTA 6 Pre-Load: Open Now on PS5 and Xbox (How to Start It)',
      h1: 'How to pre-load GTA 6',
      eyebrow: 'Pre-load',
      description: 'GTA 6 pre-load opened November 10, 2026. How to start it on PS5 and Xbox Series X|S, and what code-in-box buyers need to do.',
      aiSummary: 'How and when to pre-load Grand Theft Auto VI: open since November 10, 2026 for digital pre-orders on PS5 and Xbox Series X|S; code-in-box buyers can start after redeeming their code.',
      body: `
Rockstar opened pre-loading on **November 10, 2026** for everyone who pre-ordered GTA VI digitally. Pre-load means downloading the game ahead of time so you can start playing the moment it unlocks.

## On PS5
- Pre-order (or check that your pre-order went through) on the PlayStation Store.
- Open the game from your library, or check the download queue. Pre-loads usually start automatically if your PS5 has enough free space.

## On Xbox Series X|S
- Pre-order on the Microsoft Store.
- Open **My games & apps → Queue** to check the download, or start it from the game’s store page.

## Bought a physical (code-in-box) copy?
Rockstar says code-in-box buyers can redeem their code and begin pre-loading as soon as they have it.

## How big is the download?
Rockstar hasn’t published an official file size in the posts we checked. Make sure you have plenty of space; the store page shows the exact size when the download starts.
`,
      faq: [
        { q: 'When does GTA 6 pre-load start?', a: 'It started on November 10, 2026 for digital pre-orders.' },
        { q: 'Can I pre-load a physical copy of GTA 6?', a: 'Yes. Redeem the code from the box and the download can begin straight away.' },
        { q: 'How big is GTA 6?', a: 'Rockstar has not published an official file size. Your console’s store page shows it when the download starts.' },
      ],
      sources: [SRC.preload, SRC.preloadDate],
      related: ['release-date', 'price'],
    },
    {
      slug: 'trailers',
      title: 'All GTA 6 Trailers: Trailer 1, Trailer 2 and Launch Trailer',
      h1: 'GTA 6 trailers',
      eyebrow: 'Official videos',
      description: 'Every official GTA 6 trailer in one place: Trailer 1 (Dec 2023), Trailer 2 (May 2025), the gameplay video and the launch trailer.',
      aiSummary: 'The official Grand Theft Auto VI trailers from Rockstar: Trailer 1 (December 5, 2023), Trailer 2 (May 6, 2025), a gameplay video and the launch trailer, with links to watch them.',
      body: `
Every official GTA VI video Rockstar has released, oldest first. They play from Rockstar’s YouTube channel.

${TRAILERS.map((t) => `## ${t.name}${t.when ? ` (${t.when})` : ''}\n${t.note} [Watch on YouTube](https://www.youtube.com/watch?v=${t.id})`).join('\n\n')}
`,
      faq: [
        { q: 'How many GTA 6 trailers are there?', a: `Rockstar has released ${TRAILERS.length} main videos: Trailer 1, Trailer 2, a gameplay video and the launch trailer.` },
        { q: 'When did the first GTA 6 trailer come out?', a: 'December 5, 2023. Rockstar released it a day early after it leaked.' },
      ],
      sources: [SRC.rockstar],
      related: ['characters', 'map', 'leaks'],
      videos: TRAILERS,
    },
    {
      slug: 'characters',
      title: 'GTA 6 Characters: Jason, Lucia and the Full Cast',
      h1: 'GTA 6 characters',
      eyebrow: 'Cast',
      description: 'Every confirmed GTA 6 character: protagonists Jason Duval and Lucia Caminos, plus Cal Hampton, Boobie Ike, Dre’Quan Priest, Real Dimez, Raul Bautista and Brian Heder.',
      aiSummary: 'The confirmed cast of Grand Theft Auto VI from Rockstar: playable leads Jason Duval and Lucia Caminos and six supporting characters, each with a short profile.',
      body: `
GTA VI has **two playable protagonists, Jason Duval and Lucia Caminos**, who are drawn into a criminal conspiracy across the state of Leonida after an easy job goes wrong. Rockstar has introduced eight characters so far.

${CHARACTERS.map((c) => `## [${c.name}](/gta-6/characters/${c.slug})\n*${c.role}.* ${c.bio[0]}`).join('\n\n')}
`,
      faq: [
        { q: 'Who are the main characters in GTA 6?', a: 'Jason Duval and Lucia Caminos, the two playable protagonists.' },
        { q: 'Is there a female protagonist in GTA 6?', a: 'Yes. Lucia Caminos is one of the two playable leads.' },
        { q: 'How many characters have been revealed for GTA 6?', a: `Rockstar has introduced ${CHARACTERS.length}: Jason, Lucia, Cal Hampton, Boobie Ike, Dre’Quan Priest, Real Dimez, Raul Bautista and Brian Heder.` },
      ],
      sources: [SRC.leonida],
      related: ['map', 'trailers', 'music'],
    },
    {
      slug: 'map',
      title: 'GTA 6 Map: Leonida, Vice City and Every Confirmed Region',
      h1: 'GTA 6 map: the state of Leonida',
      eyebrow: 'Map & locations',
      description: 'GTA 6 is set in Leonida, Rockstar’s take on Florida, with Vice City at its heart. Every region confirmed so far: Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga.',
      aiSummary: 'The confirmed areas of Grand Theft Auto VI’s map: the fictional state of Leonida, including Vice City, the Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga.',
      body: `
GTA VI takes place in **Leonida**, a fictional state widely seen as Rockstar’s take on Florida. Rockstar calls it the darkest side of the sunniest place in America. Its centrepiece is **Vice City**, back for the first time since 2002.

## Confirmed regions
${REGIONS.map((r) => `### ${r.name}\n${r.text}`).join('\n\n')}

## Other places mentioned
- **Leonida Penitentiary**, where Lucia was locked up.
- **Liberty City**, where Lucia’s family came from. It is mentioned, not confirmed as playable.

## How big is the map?
Rockstar hasn’t given an official size. We will update this page with official details only, not fan estimates.
`,
      faq: [
        { q: 'Where is GTA 6 set?', a: 'In Leonida, a fictional state based on Florida, centred on Vice City.' },
        { q: 'What are the regions in the GTA 6 map?', a: `Rockstar has shown ${REGIONS.map((r) => r.name).join(', ')}.` },
        { q: 'Is Liberty City in GTA 6?', a: 'It is mentioned in Lucia’s backstory, but Rockstar has not confirmed it as a playable area.' },
      ],
      sources: [SRC.leonida, SRC.rockstar, SRC.gallery],
      related: ['characters', 'trailers', 'music'],
    },
    {
      slug: 'music',
      title: 'GTA 6 Music: Radio Stations, Soundtrack and Justice Score',
      h1: 'GTA 6 music and radio stations',
      eyebrow: 'Music',
      description: 'GTA 6 music: in-game radio stations, the 34-track Grand Theft Auto VI: The Album (Nov 19) and the 30-track Original Score by Justice (Dec 11).',
      aiSummary: 'Official music details for Grand Theft Auto VI: previewed radio stations and hosts, the 34-track soundtrack album out November 19, 2026 and the Justice original score out December 11, 2026.',
      body: `
Rockstar says GTA VI has the biggest and most varied mix of in-game radio stations and podcasts in the series, from classic rock to talk radio.

## Radio stations previewed so far
- **Modern Latin** hosted by El Martillo and La Gata
- **Renegade country** hosted by MW and Delta Dawne
- **Amapiano and African classics** hosted by Burna and Palmsy
- **Metal** hosted by DJ Kerry and DJ Tom
- **Pop**, the Vice City institution hosted by Robyn and Alex
- **Southern rap and hip-hop** hosted by Trick and Trina

## Grand Theft Auto VI: The Album
A soundtrack album of **34 original tracks**, out **November 19, 2026**, alongside the game. Artists on the official music page include Travis Scott, Morgan Wallen, Yung Lean, Fuerza Regida, PinkPantheress and Fred again...

## Original Score by Justice
The French duo **Justice** (Gaspard Augé and Xavier de Rosnay) composed an adaptive score that changes with how you play. The album has **30 tracks** and arrives **December 11, 2026** on streaming, CD and vinyl. Singles include "Flower in a Hurricane" (featuring Tame Impala, SZA and King Gizzard & The Lizard Wizard) and "Pusher" (featuring Gesaffelstein).
`,
      faq: [
        { q: 'Who made the GTA 6 score?', a: 'Justice, the French electronic duo. The Original Score album comes out December 11, 2026.' },
        { q: 'When does the GTA 6 soundtrack come out?', a: 'Grand Theft Auto VI: The Album (34 tracks) comes out November 19, 2026, the same day as the game.' },
      ],
      sources: [SRC.music, SRC.store],
      related: ['characters', 'map', 'price'],
    },
    {
      slug: 'leaks',
      title: 'GTA 6 Leaks: What Happened and What Turned Out True',
      h1: 'GTA 6 leaks: what happened, what was confirmed',
      eyebrow: 'Leaks & rumors',
      description: 'The 2022 GTA 6 leak explained, the early trailer leak in 2023, and which leaked details Rockstar later confirmed. Facts only, no leaked footage.',
      aiSummary: 'A factual summary of Grand Theft Auto VI leaks: the September 2022 leak of early development footage, the December 2023 early trailer leak, and which details Rockstar later officially confirmed.',
      body: `
GTA VI went through one of the biggest leaks in gaming history. This page covers what happened and what turned out to be true. We don’t host or link to leaked material.

## The September 2022 leak
In September 2022, around 90 clips of early, unfinished GTA VI footage were posted online. Rockstar confirmed it had suffered a network intrusion and that the footage was real but very early. An 18-year-old member of the Lapsus$ hacking group was later found responsible by a UK court.

## The early trailer leak (December 2023)
Trailer 1 leaked online the day before its planned debut, so Rockstar released it early on December 5, 2023.

## What the leaks got right
Rockstar’s official reveals later confirmed:
- **A return to Vice City**, in the state of Leonida.
- **Two protagonists, including a woman**: Jason Duval and [Lucia Caminos](/gta-6/characters/lucia-caminos).

## Should you trust GTA 6 leaks now?
Treat anything unofficial as a rumor until Rockstar confirms it. Since launch is close, the official [characters](/gta-6/characters), [map](/gta-6/map) and [trailers](/gta-6/trailers) are better sources than old leaks.
`,
      faq: [
        { q: 'What was the GTA 6 leak?', a: 'In September 2022, about 90 clips of early GTA VI development footage were leaked online after a hack. Rockstar confirmed the footage was real but unfinished.' },
        { q: 'Did the GTA 6 trailer leak?', a: 'Yes. Trailer 1 leaked the day before its planned release, so Rockstar posted it early on December 5, 2023.' },
        { q: 'What did the GTA 6 leaks get right?', a: 'The Vice City setting and a pair of protagonists including a female lead, both later confirmed by Rockstar.' },
      ],
      sources: [SRC.rockstar, SRC.leonida],
      related: ['trailers', 'characters', 'release-date'],
    },
  ];
}

export function characterPage(c) {
  const others = c.links.map((s) => CHARACTERS.find((x) => x.slug === s)).filter(Boolean);
  return {
    slug: `characters/${c.slug}`,
    title: `${c.name} in GTA 6: Who ${c.name.split(' ')[0]} Is and What We Know`,
    h1: `${c.name} (GTA 6)`,
    eyebrow: c.role === 'Protagonist' ? 'Playable protagonist' : 'Character',
    description: `Who is ${c.name} in GTA 6? ${c.bio[0].slice(0, 110)}…`,
    aiSummary: `Profile of ${c.name}, a ${c.role.toLowerCase()} character in Grand Theft Auto VI, based on Rockstar’s official character introductions.`,
    body: `
${c.bio.join('\n\n')}

## Connected characters
${others.map((o) => `- [${o.name}](/gta-6/characters/${o.slug}): ${o.role.toLowerCase()}`).join('\n')}

See the [full GTA 6 cast](/gta-6/characters) and the [map of Leonida](/gta-6/map).
`,
    faq: [{ q: `Who is ${c.name} in GTA 6?`, a: c.bio[0] }, c.role === 'Protagonist' ? { q: `Can you play as ${c.name.split(' ')[0]} in GTA 6?`, a: `Yes. ${c.name.split(' ')[0]} is one of the two playable protagonists, alongside ${c.slug === 'jason-duval' ? 'Lucia Caminos' : 'Jason Duval'}.` } : null].filter(Boolean),
    sources: [SRC.leonida],
    related: ['characters', 'map'],
  };
}

export const COMING_AFTER_LAUNCH = ['Cheats', 'Weapons', 'Vehicles and cars', 'Missions walkthrough', 'Beginner tips', 'Money guide'];
