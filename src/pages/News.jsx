import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Tag, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

// News articles - gaming trends, announcements, updates
// Written in natural, editorial style - no AI slop
const newsArticles = [
    {
        slug: 'crimson-desert-release-date-everything-we-know',
        title: 'Crimson Desert Release Date: Everything We Know So Far',
        excerpt: 'Pearl Abyss\'s ambitious action RPG finally has a release window. Here\'s what we know about platforms, gameplay, and when you can play it.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        readTime: '6 min read',
        category: 'Release Info',
        tags: ['Crimson Desert', 'Pearl Abyss', 'Action RPG', 'PS5', 'Xbox', 'PC'],
        image: 'https://media.rawg.io/media/games/64c/64c9c6faa2c5745b0a4c16542cce3862.jpg',
        trending: true,
        content: `
After years of development and several delays, Crimson Desert is finally approaching release. Pearl Abyss, the studio behind Black Desert Online, has been working on this ambitious action RPG since 2018, and players are eager to get their hands on it.

## Release Window

Crimson Desert is confirmed for 2026, though Pearl Abyss hasn't locked down a specific date yet. Based on recent trailers and the state of development shown at gaming events, most industry analysts expect a late 2026 release, likely in the fall alongside other major titles.

The game was originally announced way back in 2019, and it's gone through significant changes since then. What started as a prequel to Black Desert Online has evolved into a standalone title with its own identity.

## Platforms

Crimson Desert will launch on:

- PlayStation 5
- Xbox Series X|S
- PC

There's no word on last-gen versions, which isn't surprising given the game's visual fidelity. The trailers have shown some genuinely impressive graphics, and Pearl Abyss seems committed to taking full advantage of current-gen hardware.

## What Kind of Game Is It?

This is where things get interesting. Crimson Desert blends several genres:

**Open World Exploration** - The game features a massive open world inspired by medieval fantasy settings. Unlike Black Desert Online's MMO structure, this is a primarily single-player experience.

**Action Combat** - Pearl Abyss knows combat. Black Desert Online has some of the best action combat in the MMO space, and they're bringing that expertise here. Expect fast-paced, skill-based fights.

**Narrative Focus** - The story follows Macduff, a mercenary leading a band of outcasts. Pearl Abyss has emphasized that story is a priority, which is a departure from their MMO roots.

## The Mercenary Squad

You won't be alone in Crimson Desert. Macduff leads a group of mercenaries, each with their own backstory and motivations. From what we've seen, these companions play significant roles in both story and gameplay.

The trailers have shown some genuinely emotional moments between characters, suggesting Pearl Abyss is serious about the narrative side of things.

## Combat and Gameplay

If you've played Black Desert Online, you know Pearl Abyss can deliver satisfying action combat. Crimson Desert takes that foundation and builds on it with:

- Multiple weapon types and fighting styles
- Boss battles that actually require strategy
- Environmental interactions during combat
- A physics system that affects how battles play out

One standout feature is the ability to switch between third-person and first-person perspectives during combat, giving players more control over how they experience fights.

## Multiplayer Elements

While primarily single-player, Crimson Desert will include some multiplayer elements. Pearl Abyss has been cagey about specifics, but they've confirmed:

- Co-op for certain content
- Some form of PvP
- Shared world elements (though not a full MMO structure)

## Why the Hype?

Crimson Desert has been generating serious buzz for a few reasons:

First, the visuals. Every trailer has looked stunning, with detailed environments and character models that rival anything else in the genre.

Second, Pearl Abyss's track record. Whatever you think of Black Desert Online as an MMO, there's no denying the studio knows how to make good-looking games with satisfying combat.

Third, the market timing. 2026 is shaping up to be huge for open-world RPGs, and Crimson Desert is positioned to be one of the major releases.

## Should You Be Excited?

If you're into action RPGs with a focus on combat and exploration, Crimson Desert should absolutely be on your radar. The combination of Pearl Abyss's technical expertise and their commitment to narrative makes this one of the more interesting projects in development.

That said, temper expectations until we see extended gameplay and get hands-on impressions. Trailers only tell part of the story.

We'll update this page as Pearl Abyss reveals more information. For now, add it to your watchlist and keep an eye out for a concrete release date announcement.
        `
    },
    {
        slug: 'fallout-new-vegas-remaster-rumors-what-we-know',
        title: 'Fallout New Vegas Remaster: Separating Fact from Rumor',
        excerpt: 'The internet is buzzing about a potential Fallout: New Vegas remaster. Here\'s what\'s actually confirmed and what\'s just speculation.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        readTime: '5 min read',
        category: 'Rumors',
        tags: ['Fallout', 'Bethesda', 'Obsidian', 'Remaster', 'New Vegas'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1u60.jpg',
        trending: true,
        content: `
Every few months, the gaming community gets itself worked up about a Fallout: New Vegas remaster. This week is no different, with search interest spiking after some cryptic social media posts and a supposed countdown on Bethesda's website.

Let's sort through the noise.

## What We Actually Know

Here's the uncomfortable truth: as of January 2026, there is no officially announced Fallout: New Vegas remaster.

Bethesda has not confirmed anything. Obsidian Entertainment (the original developers) has not confirmed anything. Microsoft, which now owns both companies, has stayed quiet.

That's it. That's what we actually know.

## So Why Is Everyone Talking About It?

A few things happened recently that got people excited:

**The Fallout TV show** - Amazon's Fallout series brought renewed interest to the franchise. When a property gets popular again, remasters often follow.

**Microsoft's acquisition strategy** - Microsoft has been pretty aggressive about leveraging its acquired studios' back catalogs. A New Vegas remaster would be an obvious win.

**Obsidian's hints** - Some Obsidian developers have made vague comments on social media that fans interpreted as teasing something Fallout-related. This could mean anything or nothing.

**A supposed countdown** - There were rumors of a countdown timer appearing on Bethesda's website, but these have been debunked as either misunderstandings or outright fakes.

## Why New Vegas Specifically?

For anyone who hasn't played it, Fallout: New Vegas is often considered the best game in the 3D Fallout era. Released in 2010 by Obsidian Entertainment using Bethesda's engine, it's beloved for:

- Deep role-playing mechanics with meaningful choices
- Excellent writing and memorable characters
- Multiple factions with their own ideologies
- A setting (post-apocalyptic Vegas) that's just plain fun

The game has aged, though. Running it on modern systems can be a hassle, and the graphics are definitely showing their years. A proper remaster would let new players experience it and give veterans a reason to return.

## What Would a Remaster Look Like?

If a New Vegas remaster were to happen, here's what fans would expect:

**Visual Overhaul** - Updated graphics, improved lighting, higher-resolution textures. The basics.

**Bug Fixes** - New Vegas was notoriously buggy at launch. There's an entire community of modders who've spent years fixing issues Obsidian never got to. A remaster would need to address this.

**Quality of Life Improvements** - Modern gameplay conveniences without changing the core experience.

**Current-Gen Optimization** - Proper PS5, Xbox Series X|S, and modern PC support.

The question is whether it would be a simple visual remaster or a more comprehensive remake. Given the game's cult status, fans would probably prefer the former to avoid changing what made it special.

## The Fallout 3 Connection

Some rumors also mention Fallout 3 being included in a potential remaster package. This would make sense from a business perspective, as both games use similar engines and could be updated together.

However, there's even less concrete evidence for this than for New Vegas.

## Should You Expect an Announcement Soon?

Honestly? Maybe. The conditions are right:

- Microsoft owns the IP and the original developers
- The franchise is popular again thanks to the TV show
- The original games are increasingly difficult to play on modern hardware
- There's clear demand

But "the conditions are right" isn't the same as "it's happening." Companies don't always make the obvious moves, and development resources are limited.

## What to Do in the Meantime

If you want to play New Vegas right now, the PC version is your best bet. The modding community has essentially created an unofficial remaster with:

- Texture packs
- Bug fixes
- Performance improvements
- Quality of life mods

It takes some setup, but it's worth it if you can't wait.

## Our Take

A Fallout: New Vegas remaster feels inevitable at this point. The question is when, not if. Microsoft would be leaving money on the table by not capitalizing on one of gaming's most beloved RPGs.

But until there's an official announcement, take any rumors with a grain of salt. We've been burned before.

We'll update this page if and when Bethesda or Microsoft makes an announcement. For now, keep your expectations in check and maybe do another playthrough of the original.
        `
    },
    {
        slug: 'nintendo-switch-2-gamecube-games-fire-emblem',
        title: 'Nintendo Switch Online Adds GameCube Games Including Fire Emblem',
        excerpt: 'Nintendo expands Switch Online with GameCube titles. Here\'s the full list of launch games and what to expect from the service.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        readTime: '4 min read',
        category: 'News',
        tags: ['Nintendo', 'Switch', 'GameCube', 'Fire Emblem', 'Nintendo Switch Online'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r5d.jpg',
        trending: true,
        content: `
Nintendo finally did it. After years of fan requests, GameCube games are coming to Nintendo Switch Online. The announcement confirms what many suspected: the Expansion Pack tier is about to get a lot more valuable.

## The Announcement

Nintendo revealed the GameCube addition during a recent Direct presentation, confirming that select titles will be available to Nintendo Switch Online + Expansion Pack subscribers. This follows the N64 and Sega Genesis games already available on the service.

## Launch Titles

The initial lineup includes:

**Fire Emblem: Path of Radiance** - This is the big one. Path of Radiance has been stuck on GameCube for over 20 years, with physical copies selling for hundreds of dollars. Finally, players can experience it without hunting down expensive discs.

**The Legend of Zelda: The Wind Waker** - Yes, there's a Wii U HD version, but not everyone owned a Wii U. This brings the GameCube original to a new audience.

**Super Mario Sunshine** - Mario's tropical adventure joins the service. While it was included in 3D All-Stars, that collection has been delisted, making this the only way to play it officially.

**Metroid Prime** - The first entry in Samus's 3D adventures. The remaster was already on Switch, but the original has its own charm.

More titles will be added over time, following Nintendo's pattern with N64 games.

## Why Fire Emblem Matters

Path of Radiance deserves special attention. This game has been essentially unplayable for most fans:

- Original GameCube copies sell for $200+
- No Virtual Console release ever happened
- Emulation requires a decent PC and setup knowledge
- The Wii sequel, Radiant Dawn, is similarly expensive

For Fire Emblem fans who got into the series through Awakening, Three Houses, or Engage, this is their first legitimate way to play what many consider one of the best entries in the franchise.

The game follows Ike, a mercenary caught up in a continental war. It introduced mechanics that would become series staples and has a story that still holds up today.

## How It Works

GameCube games on Switch Online work similarly to other legacy titles:

- Available to + Expansion Pack subscribers
- Accessible through the Nintendo Switch Online app
- Save states and suspend points included
- Online features where applicable

The big question is controller support. GameCube games relied on that unique controller layout, particularly the analog triggers. Nintendo hasn't confirmed whether full analog support will be available or if games will be adapted for Switch controls.

## Performance Expectations

N64 games on Switch Online have been... inconsistent. Some run great, others have input lag or visual issues. GameCube emulation is more demanding, so performance will be something to watch.

Nintendo likely won't release anything broken, but temper expectations until we see these games running on actual hardware.

## What About Switch 2?

With Nintendo's next console on the horizon, some are wondering if these GameCube games will also be available there. Nintendo hasn't said anything definitive, but given their account-based approach to Switch Online, continuity seems likely.

If anything, GameCube games might run even better on more powerful hardware.

## Pricing

No changes to Switch Online pricing have been announced. The Expansion Pack tier remains at $49.99/year for individual memberships. Given the addition of valuable games like Path of Radiance, that's looking like better value than before.

## Our Take

This is a win for preservation. Games like Fire Emblem: Path of Radiance were becoming genuinely inaccessible to most players. Whatever you think of Nintendo's pricing for Switch Online, making these games available at all is a good thing.

The counter-argument is that Nintendo could just sell these games individually on the eShop, and that's fair. But for Expansion Pack subscribers, this is pure upside.

We'll update with performance impressions once the games go live.
        `
    },
    {
        slug: 'gta-6-rockstar-games-latest-updates-january-2026',
        title: 'GTA 6 News: What Rockstar Has Revealed So Far',
        excerpt: 'With Fall 2026 approaching, here\'s everything Rockstar has officially confirmed about Grand Theft Auto VI.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        readTime: '7 min read',
        category: 'Feature',
        tags: ['GTA 6', 'GTA VI', 'Rockstar Games', 'PS5', 'Xbox Series X'],
        image: 'https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg',
        trending: true,
        content: `
Grand Theft Auto VI is coming this fall, and it's probably the most anticipated game in history. The reveal trailer broke YouTube records, and interest has only grown since. Here's everything Rockstar has officially told us.

## Release Window

Rockstar has confirmed Fall 2026 for GTA VI. That typically means September through November. Given the game's scale and Rockstar's history of delays, most expect a late October or early November launch to maximize holiday sales.

An exact date hasn't been announced, but Take-Two Interactive's earnings calls have consistently pointed to this window. Barring any last-minute issues, Fall 2026 looks solid.

## Platforms

At launch, GTA VI will be available on:

- PlayStation 5
- Xbox Series X|S

Notice what's missing: PC. Rockstar has not announced a PC version. This follows their pattern with GTA V, which launched on consoles first and came to PC about a year later.

Nobody is saying GTA VI won't come to PC. It almost certainly will. But console exclusivity at launch seems like a given at this point.

## Setting: The State of Leonida

GTA VI takes us to Leonida, Rockstar's take on Florida. The centerpiece is Vice City, a reimagined Miami that's been expanded significantly from its original appearance in 2002's Vice City.

The trailer showed:

- Neon-lit downtown areas
- Beachfront strips
- Swampy wetlands
- Suburban neighborhoods
- Rural areas with wildlife

It's not just Vice City proper. Leonida appears to be a full state, similar to how GTA V gave us Los Santos and the surrounding Blaine County.

## The Protagonists

For the first time in GTA history, you'll play as a female protagonist. Lucia is a Latina woman recently released from prison. She's partnered with Jason, and together they form a Bonnie and Clyde-style duo.

The trailer heavily emphasized their relationship, showing both professional crimes and personal moments. It looks like Rockstar is going for something more character-driven than previous entries.

The dual protagonist system appears similar to GTA V's three-character setup, though we don't know if you can switch between Lucia and Jason freely or if it's mission-dependent.

## Tone and Story

GTA VI seems to be going for a more grounded tone than GTA V's satirical chaos. Based on the trailer:

- The story appears inspired by true crime cases from Florida
- There's emphasis on the bond between Lucia and Jason
- Social media and influencer culture will be satirized
- The criminal underworld looks more organized than GTA V's heist crew

That doesn't mean it won't be funny. This is still GTA. But the dramatic beats in the trailer suggest Rockstar wants players to actually care about these characters.

## What We've Seen

The reveal trailer gave us about 90 seconds of in-game footage. Key observations:

**Graphics** - It looks incredible. Character models, lighting, and environmental detail are a generation beyond GTA V. This is what you'd expect from a game that's been in development for a decade on current-gen hardware.

**Animations** - NPC behavior looks more natural than ever. The trailer showed people on phones, exercising, arguing, and just existing in ways that felt organic.

**Wildlife** - Florida means alligators, and they're here. The wildlife system looks expanded from Red Dead Redemption 2.

**Environment** - Weather effects, detailed water, dense urban areas. Rockstar is flexing their technical muscles.

## Multiplayer

Rockstar has said almost nothing about GTA VI's multiplayer. GTA Online has been a massive money maker, so assume something similar is planned. But whether it's integrated from launch or added later, we don't know.

The focus of marketing so far has been entirely on the single-player experience.

## No More News Until When?

Rockstar is famously quiet. After the initial trailer, they've said almost nothing. Expect marketing to ramp up significantly as Fall 2026 approaches, likely with:

- A second trailer in Spring/Summer 2026
- Gameplay reveal a few months before launch
- Review embargo lifting close to release

For now, the trailer is all we have.

## Our Take

Everything about GTA VI suggests Rockstar is swinging for the fences. The budget is reportedly the highest in gaming history. The development time is extensive. The ambition is massive.

Whether it delivers is unknown, but if any studio can pull off the "biggest game ever" label, it's probably Rockstar. They've done it before.

We'll continue covering GTA VI as more information becomes available. In the meantime, you can add it to your watchlist and track the countdown to Fall 2026.
        `
    },
    {
        slug: 'marvel-rivals-season-2-whats-coming',
        title: 'Marvel Rivals Season 2: New Heroes, Maps, and Changes',
        excerpt: 'The hero shooter\'s second season brings new content and balance changes. Here\'s what\'s included.',
        author: 'Divik',
        publishedDate: '2026-01-10',
        readTime: '4 min read',
        category: 'Updates',
        tags: ['Marvel Rivals', 'Hero Shooter', 'Season 2', 'Updates'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cob0ge.jpg',
        trending: false,
        content: `
Marvel Rivals launched to strong player numbers, and Season 2 is keeping the momentum going. NetEase has outlined what's coming in the new season, and there's plenty for both new and returning players.

## New Heroes

Season 2 adds two new playable characters to the roster:

The first is a Strategist (support role), which the game needed. Launch had limited support options, and this addition should help queue times and team composition variety.

The second is a Duelist (DPS), because hero shooters always need more damage dealers. Details on abilities are still being revealed, but expect them to be viable options for competitive play.

## New Map

A new map set in a previously unexplored Marvel location joins the rotation. Without spoiling anything, it's based on a well-known comic book setting that fans have been requesting.

Map design in Marvel Rivals has been generally solid, with good sightlines and flanking routes. Early impressions suggest the new map follows that pattern.

## Balance Changes

Every competitive game needs regular balance updates, and Marvel Rivals is no exception. Season 2 brings:

- Adjustments to several underperforming heroes
- Nerfs to dominant picks from Season 1
- Changes to how certain abilities interact

The full patch notes are extensive. The short version: if your main was too strong, expect changes. If your main was struggling, there might be buffs.

## Battle Pass

A new season means a new battle pass. As always, it's split between free and premium tiers. Cosmetics include skins, sprays, emotes, and the usual array of customization options.

Whether the battle pass is worth it depends on how much you play. Heavy players will finish it easily. Casual players might not.

## Quality of Life Improvements

Beyond heroes and maps, Season 2 addresses some community feedback:

- UI improvements for team coordination
- Audio cues are clearer
- Some bug fixes for abilities that weren't working as intended

These aren't flashy, but they matter for the day-to-day experience.

## Is It Worth Playing?

Marvel Rivals occupies a weird space. It's a hero shooter competing against Overwatch 2 and other established games, but it's also a Marvel game with unique appeal.

If you're into hero shooters and like Marvel, it's worth trying. It's free-to-play, so the barrier is low.

Season 2 is adding enough content to bring lapsed players back and give current players reasons to keep going. Whether it has long-term staying power remains to be seen, but for now, it's in a healthy spot.
        `
    }
];

// News Landing Page
const NewsLanding = () => {
    const trendingArticles = newsArticles.filter(a => a.trending);
    const regularArticles = newsArticles.filter(a => !a.trending);

    return (
        <>
            <SEO
                title="Gaming News - Latest Updates, Releases & Rumors | NextPlay"
                description="Stay updated with the latest gaming news. Release dates, rumors, patch notes, and analysis from the NextPlay team."
                url={getCanonicalUrl('/news')}
                keywords="gaming news, game releases, game rumors, patch notes, gaming updates"
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <nav style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 0.5rem' }}>/</span>
                        <span>News</span>
                    </nav>
                    <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.5rem' }}>
                        Gaming News
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                        The latest on releases, updates, and what's coming next.
                    </p>
                </div>

                {/* Trending Section */}
                {trendingArticles.length > 0 && (
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{
                            fontSize: '0.875rem',
                            color: '#f97316',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <TrendingUp size={16} /> Trending Now
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {trendingArticles.map(article => (
                                <Link
                                    key={article.slug}
                                    to={`/news/${article.slug}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <article style={{
                                        background: 'rgba(30, 41, 59, 0.4)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(249, 115, 22, 0.2)',
                                        transition: 'transform 0.2s, border-color 0.2s',
                                        height: '100%'
                                    }}>
                                        <div style={{
                                            height: '140px',
                                            background: `linear-gradient(to bottom, transparent 60%, rgba(10,14,23,0.9)), url(${article.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }} />
                                        <div style={{ padding: '1rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(249, 115, 22, 0.15)',
                                                    color: '#f97316',
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600
                                                }}>
                                                    {article.category}
                                                </span>
                                                <Flame size={12} color="#f97316" />
                                            </div>
                                            <h3 style={{
                                                fontSize: '1rem',
                                                color: '#fff',
                                                marginBottom: '0.5rem',
                                                lineHeight: 1.3
                                            }}>
                                                {article.title}
                                            </h3>
                                            <p style={{
                                                color: '#94a3b8',
                                                fontSize: '0.8rem',
                                                lineHeight: 1.5,
                                                marginBottom: '0.75rem'
                                            }}>
                                                {article.excerpt.substring(0, 90)}...
                                            </p>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#64748b'
                                            }}>
                                                {article.publishedDate} · {article.readTime}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* All News */}
                <section>
                    <h2 style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '1rem'
                    }}>
                        Latest News
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {newsArticles.map(article => (
                            <Link
                                key={article.slug}
                                to={`/news/${article.slug}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <article style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    background: 'rgba(30, 41, 59, 0.3)',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'border-color 0.2s'
                                }}>
                                    <div style={{
                                        width: '120px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.35rem'
                                        }}>
                                            <span style={{
                                                color: '#06b6d4',
                                                fontSize: '0.7rem',
                                                fontWeight: 600
                                            }}>
                                                {article.category}
                                            </span>
                                            {article.trending && (
                                                <Flame size={11} color="#f97316" />
                                            )}
                                        </div>
                                        <h3 style={{
                                            fontSize: '0.95rem',
                                            color: '#fff',
                                            marginBottom: '0.35rem',
                                            lineHeight: 1.3
                                        }}>
                                            {article.title}
                                        </h3>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#64748b'
                                        }}>
                                            {article.publishedDate} · {article.readTime}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

// Individual News Article
const NewsArticle = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const article = newsArticles.find(a => a.slug === slug);

    if (!article) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Article Not Found</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    The article you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/news" className="btn-primary">Back to News</Link>
            </div>
        );
    }

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'News', path: '/news' },
        { name: article.category, path: '/news' }
    ];

    // Content rendering
    const renderContent = (content) => {
        const lines = content.trim().split('\n');
        const elements = [];
        let currentList = [];

        lines.forEach((line, i) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('## ')) {
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${i}`} style={{
                            paddingLeft: '1.5rem',
                            marginBottom: '1.5rem',
                            color: '#cbd5e1'
                        }}>
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                }
                elements.push(
                    <h2 key={i} style={{
                        color: '#fff',
                        fontSize: '1.4rem',
                        marginTop: '2.5rem',
                        marginBottom: '1rem',
                        fontWeight: 600
                    }}>
                        {trimmed.slice(3)}
                    </h2>
                );
            } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                elements.push(
                    <p key={i} style={{
                        color: '#06b6d4',
                        fontWeight: 600,
                        marginTop: '1.5rem',
                        marginBottom: '0.5rem'
                    }}>
                        {trimmed.slice(2, -2)}
                    </p>
                );
            } else if (trimmed.startsWith('- ')) {
                currentList.push(
                    <li key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
                        {trimmed.slice(2)}
                    </li>
                );
            } else if (trimmed.length > 0) {
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${i}`} style={{
                            paddingLeft: '1.5rem',
                            marginBottom: '1.5rem',
                            color: '#cbd5e1'
                        }}>
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                }
                elements.push(
                    <p key={i} style={{
                        color: '#b8c5d6',
                        lineHeight: 1.85,
                        marginBottom: '1.25rem',
                        fontSize: '1.05rem'
                    }}>
                        {trimmed}
                    </p>
                );
            }
        });

        if (currentList.length > 0) {
            elements.push(
                <ul key="final-list" style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1.5rem',
                    color: '#cbd5e1'
                }}>
                    {currentList}
                </ul>
            );
        }

        return elements;
    };

    return (
        <>
            <SEO
                title={`${article.title} | NextPlay`}
                description={article.excerpt}
                url={getCanonicalUrl(`/news/${slug}`)}
                image={article.image}
                type="article"
                breadcrumbs={breadcrumbs}
                keywords={article.tags.join(', ')}
                author={article.author}
                publishedTime={article.publishedDate}
            />

            <article className="container" style={{
                padding: '2rem 1rem',
                maxWidth: '760px',
                margin: '0 auto'
            }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
                    <ChevronRight size={14} style={{ margin: '0 0.4rem', verticalAlign: 'middle' }} />
                    <Link to="/news" style={{ color: '#64748b', textDecoration: 'none' }}>News</Link>
                    <ChevronRight size={14} style={{ margin: '0 0.4rem', verticalAlign: 'middle' }} />
                    <span style={{ color: '#94a3b8' }}>{article.category}</span>
                </nav>

                {/* Back Link */}
                <button
                    onClick={() => navigate('/news')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        padding: 0
                    }}
                >
                    <ArrowLeft size={15} />
                    All News
                </button>

                {/* Article Header */}
                <header style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <span style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            color: '#06b6d4',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            {article.category}
                        </span>
                        {article.trending && (
                            <span style={{
                                background: 'rgba(249, 115, 22, 0.1)',
                                color: '#f97316',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <Flame size={12} /> Trending
                            </span>
                        )}
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                        color: '#fff',
                        marginBottom: '1rem',
                        lineHeight: 1.25,
                        fontWeight: 700
                    }}>
                        {article.title}
                    </h1>

                    <p style={{
                        color: '#94a3b8',
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem'
                    }}>
                        {article.excerpt}
                    </p>

                    {/* Author/Date */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        fontSize: '0.85rem',
                        color: '#64748b',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={15} /> {article.author}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={15} /> {article.publishedDate}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Clock size={15} /> {article.readTime}
                        </span>
                    </div>
                </header>

                {/* Featured Image */}
                <div style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '2.5rem'
                }}>
                    <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>

                {/* Content */}
                <div style={{ marginBottom: '3rem' }}>
                    {renderContent(article.content)}
                </div>

                {/* Tags */}
                <div style={{
                    padding: '1.25rem',
                    background: 'rgba(30, 41, 59, 0.3)',
                    borderRadius: '10px',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginBottom: '0.75rem'
                    }}>
                        <Tag size={14} color="#64748b" />
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Related:</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {article.tags.map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: '#94a3b8',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '5px',
                                fontSize: '0.75rem'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* More News CTA */}
                <div style={{
                    padding: '1.75rem',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.95rem' }}>
                        Want more gaming news and updates?
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/news" style={{
                            padding: '0.65rem 1.25rem',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: '#06b6d4',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            More News
                        </Link>
                        <Link to="/" style={{
                            padding: '0.65rem 1.25rem',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            Browse Games
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};

export { newsArticles };
export { NewsLanding, NewsArticle };
export default NewsLanding;
