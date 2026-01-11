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
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scfhn6.jpg',
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
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc6pxo.jpg',
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
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scf6v1.jpg',
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
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc92mx.jpg',
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
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scprg7.jpg',
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
    },
    {
        slug: 'hollow-knight-silksong-release-date-update',
        title: 'Hollow Knight Silksong: Where Is It and When Can We Play',
        excerpt: 'Team Cherry has been quiet, but fans remain hopeful. Here is everything we know about the long-awaited sequel.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        readTime: '5 min read',
        category: 'Feature',
        tags: ['Hollow Knight', 'Silksong', 'Team Cherry', 'Indie', 'Metroidvania'],
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc8hnh.jpg',
        trending: true,
        content: `
Hollow Knight: Silksong has become one of gaming's most anticipated releases, and also one of its biggest mysteries. Team Cherry, the small Australian studio behind the original, has been notoriously quiet about development progress. Here is what we actually know.

## The Last Official Update

Team Cherry's most recent substantial update came months ago. They confirmed the game is still in active development and that they're focused on making it right rather than rushing to meet a deadline. Beyond that, specifics have been scarce.

This silence has led to endless speculation, but the studio has asked fans for patience multiple times. They're a small team working on something ambitious.

## What Is Silksong

For those unfamiliar, Silksong started as DLC for the original Hollow Knight. It grew in scope until Team Cherry decided it deserved to be a full standalone game.

You play as Hornet, the mysterious warrior from the first game. She's faster and more agile than the Knight, with a combat style focused on mobility and silk-based abilities.

The game takes place in a new kingdom called Pharloom. Early footage showed varied environments, from overgrown ruins to bustling towns. The world looks significantly larger and more diverse than Hallownest.

## Gameplay Changes

Based on trailers and demos from years past, Silksong makes notable changes to the formula:

**Speed and Mobility** - Hornet moves faster than the Knight. Combat is quicker and more aerial. The platforming looks more demanding.

**Tools and Abilities** - Instead of the Knight's spells, Hornet uses tools she crafts from materials found in the world. This adds a resource management element.

**Quest System** - NPCs can give Hornet quests. The original had some of this, but Silksong appears to expand it significantly.

**Boss Fights** - What we have seen of boss encounters looks intense. Expect challenging fights that test your mastery of Hornet's moveset.

## Why the Wait

The original Hollow Knight was made by three people. It was massively successful, selling millions of copies and winning critical acclaim. That success meant higher expectations for the sequel.

Team Cherry has expanded slightly but remains small. They're perfectionists who spent years adding free content to the original game. That same dedication to quality is presumably why Silksong is taking so long.

The gaming industry has also seen several high-profile releases that suffered from being rushed. Team Cherry seems determined to avoid that fate.

## Release Window

There is no confirmed release date. Team Cherry has not announced platforms beyond PC and Nintendo Switch, though Xbox was mentioned at one point.

When it does release, expect it to dominate conversation among indie game fans. The first game developed a devoted community, and anticipation for Silksong has only grown during the wait.

## Should You Play the Original

If you haven't played Hollow Knight, now is a good time. It regularly goes on sale for a few dollars and offers dozens of hours of content. Understanding the original will make Silksong more meaningful when it finally arrives.

The game is challenging but fair. It rewards exploration and persistence. If you enjoy Metroidvania games, it is one of the best in the genre.

## Our Take

The wait for Silksong has been long, sometimes frustrating. But the original Hollow Knight was worth the patience Team Cherry put into it. There is no reason to think the sequel will be different.

When it releases, we will cover it extensively. Until then, the best approach is to keep it on your radar without driving yourself crazy checking for news daily.
        `
    },
    {
        slug: 'hades-2-early-access-review-supergiant',
        title: 'Hades II Early Access: Is It Worth Playing Now',
        excerpt: 'Supergiant Games released the sequel in early access. Here is how it compares to the original and whether you should jump in.',
        author: 'Divik',
        publishedDate: '2026-01-10',
        readTime: '6 min read',
        category: 'Review',
        tags: ['Hades II', 'Supergiant Games', 'Roguelike', 'Early Access', 'Indie'],
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scptcd.jpg',
        trending: true,
        content: `
Hades II arrived in early access last year, and Supergiant Games has been steadily adding content since. The question many players are asking: should you play it now or wait for the full release?

## What Is Different

Hades II puts you in the role of Melinoe, sister to the original game's Zagreus. The story involves rescuing Hades himself from the Titan of Time. The tone is darker, though Supergiant's signature humor and heart remain.

Combat feels familiar but distinct. Melinoe uses different weapons and has access to magic in ways Zagreus did not. The new Arcana system replaces the Mirror of Night, offering different progression choices.

The structure is similar: fight through chambers, collect boons from gods, die, repeat. But the details have changed enough to feel fresh rather than recycled.

## New Gods and Boons

The Olympian gods return, but you also get help from new faces. Apollo joins the roster, and there are interactions between gods that feel different from the first game.

Boon synergies remain the core of build variety. Finding combinations that work together is still satisfying. Some new effects play with time and lunar magic, fitting the game's themes.

## The Crossroads Hub

Instead of the House of Hades, Melinoe operates from a camp called the Crossroads. You interact with allies, unlock upgrades, and prepare for runs. The vibe is different from the underworld palace but serves the same function.

Characters are memorable. Writing quality matches Supergiant's standards. Relationships develop over many runs, encouraging you to keep playing even after tough losses.

## Early Access State

This is genuinely early access. Content is not complete. Story threads are unfinished. Balance is still being adjusted. Supergiant is transparent about this.

What exists is polished and fun. You can sink many hours into the current build. But if you want the complete experience, waiting is reasonable.

The studio has a good track record with early access. Hades 1 spent two years in early access and emerged as one of the best games of its decade. Expect similar patience and iteration here.

## Performance and Polish

Even in early access, the game runs well. Art direction is gorgeous, building on the first game's distinct style. Music is excellent, though the full soundtrack is not complete.

Bugs are rare. When they occur, Supergiant patches quickly. This does not feel like a broken early access release.

## Should You Buy Now

If you loved Hades and want more, yes. What exists is substantial and satisfying. You can always replay once the full version releases.

If you bounced off the first game, waiting makes sense. Hades II shares its predecessor's DNA. The changes are iterations, not reinventions.

If you have never played a Supergiant game, consider starting with the finished Hades. It represents the complete vision and often goes on sale.

## Looking Ahead

Supergiant has not announced a full release date. Based on their history, the early access period could last another year or more. They prioritize quality over speed.

Regular updates add content and address feedback. The community is active and mostly patient. This feels like a healthy development cycle.

## Our Take

Hades II in early access is already better than many finished games. If you can accept incomplete content, it is worth your time. If not, waiting guarantees an excellent experience eventually.

Supergiant has not missed yet. There is no reason to think they will start now.
        `
    },
    {
        slug: 'clair-obscur-expedition-33-release-preview',
        title: 'Clair Obscur Expedition 33: Why This RPG Has Everyone Talking',
        excerpt: 'A new studio is making waves with an ambitious turn-based RPG. Here is what makes Expedition 33 stand out.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        readTime: '5 min read',
        category: 'Preview',
        tags: ['Clair Obscur', 'Expedition 33', 'Sandfall Interactive', 'RPG', 'Turn-Based'],
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scmm2f.jpg',
        trending: true,
        content: `
Clair Obscur: Expedition 33 appeared at major gaming events and immediately captured attention. Developed by Sandfall Interactive, a new French studio, this turn-based RPG looks like something special.

## The Premise

Every year, a mysterious entity called the Paintress marks a number. Everyone above that age dies. When the game begins, she has reached 33. Your party of survivors sets out to stop her before the next counting.

It is a striking premise that creates immediate stakes. The threat is existential but also personal. Characters you meet know their time might end at any moment.

## Visual Style

The game looks stunning. Art direction blends realistic character models with painterly, almost impressionist environments. It is visually distinct from typical RPG aesthetics.

Unreal Engine 5 powers the graphics. Lighting and environmental detail rival anything in the genre. This is a game that will look great in screenshots and better in motion.

## Combat System

Expedition 33 uses turn-based combat with active elements. You pick actions from menus but execute them through timing-based inputs. Think of it as blending classic JRPG structure with action game responsiveness.

Dodging and countering enemy attacks requires skill. Positioning matters. The system rewards both strategic planning and mechanical execution.

Early footage shows boss fights that look challenging and dynamic. This is not passive menu-selecting combat.

## The Party

Your group includes distinct characters with their own reasons for joining the expedition. Voice acting sounds strong in footage shown so far. Sandfall Interactive has emphasized narrative and character development.

Relationships develop through story and optional interactions. The studio cites classic RPGs as inspiration but wants to bring modern storytelling techniques.

## Why The Hype

Several factors have driven interest:

First, the game looks incredible. In an era of indie pixel art and AA reused assets, seeing a new studio swing for AAA visuals is refreshing.

Second, the combat system promises something different. Turn-based RPGs can feel passive. Adding skill-based elements addresses that without abandoning the genre's strategic depth.

Third, the premise hooks people immediately. "Everyone over 33 dies" is a concept that sticks in your mind.

## Development Status

Sandfall Interactive has not announced a specific release date. The game is confirmed for PC, PlayStation 5, and Xbox Series X. It will launch day one on Game Pass.

Based on footage and developer comments, the game appears well into development. A 2026 release seems possible, but nothing is confirmed.

## Concerns

As always with new studios, there are questions. Can Sandfall deliver on their ambitions? Will the final product match the polished trailers?

The gaming industry has seen promising projects stumble at the finish line. Healthy skepticism is warranted until reviews arrive.

## Our Take

Clair Obscur: Expedition 33 is one of the most intriguing RPGs in development. The combination of visual ambition, interesting combat, and compelling premise makes it worth watching.

Whether it delivers on its promise remains to be seen. But the potential is clear. If you like turn-based RPGs, keep this on your radar.
        `
    },
    {
        slug: 'arena-breakout-infinite-everything-you-need',
        title: 'Arena Breakout Infinite: The Extraction Shooter Taking On Tarkov',
        excerpt: 'A new competitor enters the extraction shooter space. Here is what Arena Breakout Infinite offers and how it compares.',
        author: 'Divik',
        publishedDate: '2026-01-10',
        readTime: '5 min read',
        category: 'Preview',
        tags: ['Arena Breakout', 'Extraction Shooter', 'FPS', 'PC Gaming', 'Free to Play'],
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scnzqs.jpg',
        trending: false,
        content: `
Extraction shooters have grown from niche to mainstream. Escape from Tarkov pioneered the format. Now Arena Breakout Infinite wants a piece of that market. Here is what you need to know.

## What Is It

Arena Breakout started as a mobile game in China. Infinite is the PC version, rebuilt for the platform with upgraded graphics and expanded features. It is free to play, which immediately differentiates it from premium competitors.

The core loop is familiar: enter maps with your gear, fight AI and players, loot valuable items, extract safely. Death means losing what you brought. Success means profit and progression.

## How It Plays

Gunplay feels solid. Weapons have realistic handling, recoil patterns to learn, and meaningful customization. The shooting compares favorably to established games in the genre.

Movement is weighty but responsive. Sound design emphasizes spatial awareness. You hear footsteps, gunshots, and environmental cues that matter for survival.

Maps offer varied environments with multiple extraction points. Learning layouts, loot spawns, and dangerous areas takes time but rewards investment.

## Key Differences From Tarkov

Several things set Arena Breakout Infinite apart:

**Free to Play** - No upfront cost to try. Monetization focuses on cosmetics and convenience. Concerns exist about pay-to-win potential, but the studio claims competitive fairness.

**Accessibility** - Tutorials and onboarding are better. New players can learn without relying entirely on external guides. This lowers the notoriously steep genre learning curve.

**Performance** - The game runs well on mid-range hardware. Optimization has been a priority during development.

**Less Punishing** - While death still hurts, some systems soften the blow compared to Tarkov's hardcore approach. This trades authenticity for broader appeal.

## Concerns

The extraction shooter genre demands trust. Players invest many hours building inventories. If the game dies or pivots aggressively to monetization, that investment evaporates.

Tencent's involvement raises questions for some players. Data privacy concerns exist, as do worries about long-term support priorities.

Competition is fierce. Tarkov, The Cycle, and other games have established communities. Breaking into this space requires sustained effort.

## Current State

Arena Breakout Infinite is in various testing phases depending on region. PC players in some markets can already try it. Full global release details remain unclear.

What exists shows promise. Technical performance is good. Core gameplay is satisfying. Whether the free-to-play model works long-term is the main question.

## Should You Try It

If extraction shooters interest you but Tarkov feels too punishing or expensive, Arena Breakout Infinite is worth watching. Free-to-play removes the financial barrier to trying it.

If you already have a game in this genre you enjoy, switching requires compelling reasons. Infinite is good but not revolutionary.

## Our Take

Arena Breakout Infinite is a competent extraction shooter that trades some hardcore elements for accessibility. Whether that trade-off works depends on what you want from the genre.

It is not a Tarkov killer. It is an alternative for a different audience. That is a valid position to occupy.
        `
    },
    {
        slug: 'cyberpunk-2077-state-of-game-2026',
        title: 'Cyberpunk 2077 in 2026: Is It Finally the Game We Were Promised',
        excerpt: 'Years after its rocky launch, Cyberpunk has changed dramatically. Here is how the game stands today.',
        author: 'Divik',
        publishedDate: '2026-01-09',
        readTime: '6 min read',
        category: 'Feature',
        tags: ['Cyberpunk 2077', 'CD Projekt Red', 'RPG', 'Open World', 'PC'],
        image: 'https://images.igdb.com/igdb/image/upload/t_1080p/scn1ax.jpg',
        trending: false,
        content: `
Cyberpunk 2077's launch was a disaster. Performance issues, bugs, and missing features made headlines. Sony pulled it from the PlayStation Store. CD Projekt Red's reputation took a hit.

Years later, the situation has changed. Multiple major updates and the Phantom Liberty expansion have transformed the game. Is it now what players expected at launch?

## The Fixes

Update after update addressed problems:

**Performance** - The game runs reasonably on current hardware. Last-gen consoles are still rough, but PC, PS5, and Xbox Series X offer stable experiences.

**Bugs** - Most game-breaking issues are gone. You might still encounter weirdness, but nothing like launch. Playing through the story is now reliable.

**AI Improvements** - Police no longer spawn behind you instantly. NPCs behave more believably. Driving AI is better. These were major complaints that took time to address.

**Quality of Life** - New features like an improved transmog system, apartment customization, and vehicle combat make the moment-to-moment experience better.

## Phantom Liberty

The expansion added substantial content. A new district, new storyline with Idris Elba, and significant gameplay changes came together as a separate experience rivaling the quality of The Witcher 3's expansions.

If you buy Cyberpunk now, you get years of improvements plus an expansion that represents CD Projekt at their best. The total package is significantly more complete than what launched.

## What Works

Night City remains the star. The city design is exceptional. Exploring streets and alleys reveals detail and atmosphere unmatched in open-world games.

Story and characters hold up. The main narrative, particularly the relationship with Johnny Silverhand, lands emotionally. Side quests often surprise with depth and consequences.

Combat has more variety now. Builds feel distinct. Stealth, hacking, and gunplay all work as primary playstyles. The RPG systems that seemed shallow have more impact.

## What Still Falls Short

Cyberpunk is not a life simulator. Features like meaningful gang relationships, apartment variety, and dynamic world events remain limited compared to what was marketed.

The open world can feel static. Beyond scripted content, emergent gameplay is limited. Once you finish quests, the city becomes a backdrop rather than a living place.

Multiplayer never happened. CDPR abandoned those plans entirely. If you wanted an online Night City experience, it is not coming.

## Should You Play Now

If you wanted Cyberpunk at launch and held off, the answer is probably yes. The game available now is dramatically better. Combine it with Phantom Liberty for the best experience.

If you played at launch and bounced, returning is worthwhile. Changes are significant enough to warrant a fresh start.

If you want a GTA-style sandbox with deep systemic gameplay, adjust expectations. Cyberpunk is more of a narrative-driven RPG in an open world than a true sandbox.

## Looking Forward

CD Projekt is working on a sequel. They have also announced new Witcher projects. Cyberpunk 2077 received its final major update. What exists now is the finished version.

The redemption arc worked. Cyberpunk 2077 is now remembered as a good game with a terrible launch, rather than a failure. That is a significant achievement.

## Our Take

Cyberpunk 2077 in 2026 delivers on much of its original promise. Night City is worth exploring. The story is worth experiencing. Just understand it is an improved version of a flawed game, not a reinvention.

If you have Game Pass or find it on sale, absolutely try it. At this point, it is easy to recommend with appropriate caveats.
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
