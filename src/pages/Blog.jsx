import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Tag, Share2, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { getCanonicalUrl } from '../utils/seoHelpers';

// Static blog articles data - in production, this could come from a CMS or MDX files
const articles = [
    {
        slug: 'gta-6-release-date-everything-we-know',
        title: 'GTA 6 Release Date 2026: Everything We Know So Far',
        excerpt: 'A comprehensive breakdown of Grand Theft Auto VI including confirmed release window, platforms, new features, Vice City setting, and what to expect from Rockstar\'s most anticipated game.',
        author: 'Divik',
        publishedDate: '2026-01-10',
        modifiedDate: '2026-01-11',
        readTime: '8 min read',
        category: 'Feature',
        tags: ['GTA 6', 'Rockstar Games', 'Open World', 'PS5', 'Xbox'],
        image: 'https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg',
        content: `
## The Wait is Almost Over

Grand Theft Auto VI is officially coming in Fall 2026, and it's shaping up to be the biggest game release in history. After years of speculation, leaks, and anticipation, Rockstar Games has finally confirmed what millions of gamers have been waiting for.

## Confirmed Release Window

Rockstar has officially announced **Fall 2026** as the release window for GTA VI. This means we can expect the game to launch sometime between September and November 2026. The company has been characteristically tight-lipped about specific dates, but industry analysts suggest a late October or early November release to maximize holiday sales.

### Platforms at Launch
- PlayStation 5
- Xbox Series X|S

**Note:** A PC version is expected but hasn't been officially announced. Based on Rockstar's history with GTA V, the PC version typically follows 6-12 months after the console release.

## Return to Vice City

GTA VI brings us back to Vice City (Miami in the real world), but this time it's bigger than ever. The game features:

- **State of Leonida** - An expanded Florida-inspired region
- **Vice City** - A neon-soaked metropolis with modern updates
- **Rural areas** - Swamps, suburbs, and countryside
- **Dynamic weather** - Including hurricanes and tropical storms

## Dual Protagonists: Lucia and Jason

For the first time in GTA history, you'll play as a female protagonist. The game follows:

- **Lucia** - A Latina woman recently released from prison
- **Jason** - Her partner, forming a Bonnie and Clyde-style duo

The story appears to be inspired by true crime cases from Florida, with a focus on the relationship between the two characters.

## What Makes GTA VI Special

### Technical Achievements
- Most realistic graphics ever seen in an open-world game
- Advanced NPC AI with believable daily routines
- Dynamic events that make the world feel alive
- Seamless interiors with no loading screens

### Gameplay Features
- Evolved wanted system
- More realistic physics and driving
- Enhanced stealth mechanics
- Deeper character customization

## Why This Matters

GTA V has sold over 200 million copies, making it one of the best-selling games of all time. The anticipation for its successor is unprecedented, with the reveal trailer becoming the most viewed gaming trailer in YouTube history.

## Add to Your Watchlist

Don't miss the launch! Add GTA VI to your [NextPlay watchlist](/game/grand-theft-auto-vi) to get countdown updates and be ready for day one.

---

*Last updated: January 11, 2026*
        `
    },
    {
        slug: 'most-anticipated-games-2026',
        title: 'The 15 Most Anticipated Games of 2026',
        excerpt: 'From GTA 6 to Resident Evil 9, these are the games that will define 2026. Complete with release dates, platforms, and why each game deserves your attention.',
        author: 'Divik',
        publishedDate: '2026-01-08',
        modifiedDate: '2026-01-11',
        readTime: '12 min read',
        category: 'List',
        tags: ['2026 Games', 'Upcoming Games', 'PS5', 'Xbox', 'PC'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coaqai.jpg',
        content: `
## 2026: A Landmark Year for Gaming

2026 is shaping up to be one of the biggest years in gaming history. From long-awaited sequels to exciting new IPs, here's our definitive list of games you need to watch.

## 1. Grand Theft Auto VI
**Release:** Fall 2026 | **Platforms:** PS5, Xbox Series X|S

The most anticipated game of the decade returns us to Vice City with dual protagonists and Rockstar's most ambitious world yet. [View details →](/game/grand-theft-auto-vi)

## 2. Resident Evil 9: Requiem
**Release:** February 27, 2026 | **Platforms:** PS5, Xbox Series X|S, PC

The next chapter in Capcom's legendary survival horror franchise. [View details →](/game/resident-evil-9-requiem)

## 3. Crimson Desert
**Release:** 2026 | **Platforms:** PS5, Xbox Series X|S, PC

An action-adventure RPG from Pearl Abyss featuring breathtaking visuals and intense combat. [View details →](/game/crimson-desert)

## 4. Phantom Blade Zero
**Release:** 2026 | **Platforms:** PS5, PC

A stylish action game blending martial arts with supernatural powers in an ancient Chinese setting. [View details →](/game/phantom-blade-zero)

## 5. Prince of Persia: The Sands of Time Remake
**Release:** 2026 | **Platforms:** PS5, Xbox Series X|S, PC

The classic reimagined with modern graphics and gameplay while preserving the magic of the original. [View details →](/game/prince-of-persia-the-sands-of-time-remake)

## 6. Tomb Raider: Legacy of Atlantis
**Release:** 2026 | **Platforms:** TBA

A reimagining of Lara Croft's 1996 genre-defining adventure with modern visuals. [View details →](/game/tomb-raider-legacy-of-atlantis)

## 7. Diablo IV: Lord of Hatred
**Release:** 2026 | **Platforms:** PS5, Xbox, PC

The next major expansion for Diablo IV featuring Mephisto's dark crusade. [View details →](/game/diablo-iv-lord-of-hatred)

## 8. 007 First Light
**Release:** 2026 | **Platforms:** TBA

A new James Bond game exploring the origins of 007. [View details →](/game/007-first-light)

## 9. Pragmata
**Release:** 2026 | **Platforms:** PS5, Xbox Series X|S, PC

Capcom's mysterious sci-fi adventure set in a dystopian near-future. [View details →](/game/pragmata)

## 10. Ace Combat 8: Wings of Theve
**Release:** 2026 | **Platforms:** TBA

Soar through the skies in the latest installment of the legendary flight combat series. [View details →](/game/ace-combat-8-wings-of-theve)

## 11. Reanimal
**Release:** 2026 | **Platforms:** TBA

A unique platformer from the creators of Inside and Limbo. [View details →](/game/reanimal)

## 12. The Dark Pictures: Directive 8020
**Release:** March 27, 2026 | **Platforms:** PS5, Xbox, PC

The latest narrative horror experience from Supermassive Games, set in space. [View details →](/game/the-dark-pictures-directive-8020)

## 13. Replaced
**Release:** 2026 | **Platforms:** PC, Xbox

A stunning 2.5D action platformer with retro-futuristic pixel art. [View details →](/game/replaced)

## 14. Marvel Rivals Season Updates
**Release:** Throughout 2026 | **Platforms:** PS5, Xbox, PC

New seasons bringing more heroes, maps, and content to the hit team shooter. [View details →](/game/marvel-rivals-season-6-night-at-museum)

## 15. Dune: Awakening
**Release:** 2026 | **Platforms:** PS5, PC

An open-world survival MMO set in the Dune universe. [View details →](/game/dune-awakening-raiders-of-the-broken-lands)

---

## Track All These Games

Use NextPlay's [Calendar](/calendar) to see release dates at a glance, or browse by [Platform](/platform) or [Genre](/genre) to find more games you'll love.

*Last updated: January 11, 2026*
        `
    },
    {
        slug: 'february-2026-game-releases',
        title: 'Every Game Releasing in February 2026',
        excerpt: 'Every video game releasing in February 2026, including Resident Evil 9: Requiem. Complete list with dates, platforms, and links to detailed pages.',
        author: 'Divik',
        publishedDate: '2026-01-11',
        modifiedDate: '2026-01-11',
        readTime: '6 min read',
        category: 'Monthly Roundup',
        tags: ['February 2026', 'Game Releases', 'Resident Evil 9'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cob3bo.jpg',
        content: `
## February 2026 Game Releases

February 2026 is packed with exciting releases! Here's everything coming out this month.

## Major Releases

### Resident Evil 9: Requiem
**Release Date:** February 27, 2026
**Platforms:** PlayStation 5, Xbox Series X|S, PC

The next mainline entry in Capcom's iconic survival horror franchise. Following the events of Village, this installment promises to deliver an unforgettable horror experience.

[View full details →](/game/resident-evil-9-requiem)

---

## Full February 2026 Calendar

For the complete list of games releasing in February 2026, including exact dates and platforms, visit our [February 2026 Calendar page](/calendar/02).

### Quick Stats for February 2026:
- Total games releasing: 20+
- Notable genres: Horror, Action, Indie
- Key platforms: PS5, Xbox, PC, Switch

---

## Never Miss a Release

Add games to your [Watchlist](/watchlist) to get notified when they're about to launch. You can also export any game's release date directly to your Google Calendar or iCal.

*This article is updated regularly as new games are announced.*
        `
    },
    {
        slug: 'how-to-use-nextplay-features',
        title: 'NextPlay 2026 Guide: Tier Lists, Watchlists, and More',
        excerpt: 'Learn how to make the most of NextPlay 2026. Create tier lists, build your watchlist, compare games, and export release dates to your calendar.',
        author: 'Divik',
        publishedDate: '2026-01-05',
        modifiedDate: '2026-01-11',
        readTime: '5 min read',
        category: 'Guide',
        tags: ['Guide', 'Tutorial', 'Features'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coaob9.jpg',
        content: `
## Welcome to NextPlay 2026

NextPlay is the ultimate tracker for 2026 video game releases. Here's how to use all our features.

## 🌟 Watchlist

Your personal watchlist lets you save games you're interested in.

### How to Use:
1. Browse any game page
2. Click the "Add to Watchlist" button
3. Access your watchlist from the navigation bar
4. Your watchlist is saved locally in your browser

[Go to My Watchlist →](/watchlist)

## 👑 Tier List Creator

Create your own rankings of upcoming games!

### How to Use:
1. Visit the Tier List page
2. Drag games from the pool into tiers (S, A, B, C, D, F)
3. Share your tier list with friends via the share button
4. Take a screenshot to share on social media

[Create a Tier List →](/tier-list)

## ⚖️ Game Comparison

Compare two games side-by-side to help make decisions.

### How to Use:
1. Visit the Compare page
2. Select two games you want to compare
3. See platforms, release dates, genres, and more side by side

[Compare Games →](/compare)

## 📅 Release Calendar

View all games organized by month.

### How to Use:
1. Browse the calendar by month
2. Filter by platform if needed
3. Click any game to see its full details
4. Export individual releases to Google Calendar or iCal

[View Calendar →](/calendar)

## 🏆 My Top 5

Quickly select and share your top 5 most anticipated games.

[Create Your Top 5 →](/my-top-5)

---

## Tips & Tricks

- **Keyboard shortcuts**: Use arrow keys to navigate game cards
- **Quick search**: Start typing on the home page to filter games
- **Platform filter**: Quickly find games for your preferred platform
- **Share feature**: Most pages have share buttons for social media

If you have questions or suggestions, [contact us](/contact)!
        `
    },
    {
        slug: 'best-ps5-games-2026',
        title: 'Every PS5 Game Coming in 2026',
        excerpt: 'Every major PlayStation 5 game releasing in 2026. From GTA 6 to exclusives and third-party titles. The ultimate PS5 gaming guide for 2026.',
        author: 'Divik',
        publishedDate: '2026-01-09',
        modifiedDate: '2026-01-11',
        readTime: '10 min read',
        category: 'Platform Guide',
        tags: ['PS5', 'PlayStation', 'Sony', '2026 Games'],
        image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coaknx.jpg',
        content: `
## PlayStation 5 Games in 2026

2026 is set to be a massive year for PlayStation 5 owners. Here are all the major titles coming to Sony's console.

## Confirmed PS5 Games for 2026

### Grand Theft Auto VI
The biggest game of the generation. Confirmed for PS5 at launch.
[View details →](/game/grand-theft-auto-vi)

### Resident Evil 9: Requiem
February 27, 2026 - Capcom's next horror masterpiece.
[View details →](/game/resident-evil-9-requiem)

### Phantom Blade Zero
PlayStation console exclusive action game.
[View details →](/game/phantom-blade-zero)

### Crimson Desert
Epic action-adventure RPG from Pearl Abyss.
[View details →](/game/crimson-desert)

---

## Browse All PS5 Games

For the complete list of PlayStation 5 games releasing in 2026, visit our dedicated [PS5 Platform Page](/platform/playstation-5).

### Stats:
- 50+ confirmed PS5 titles for 2026
- Major AAA releases throughout the year
- Strong indie support

---

*Check back regularly as this list is updated when new games are announced!*
        `
    }
];

// Blog Landing Page Component
const BlogLanding = () => {
    const categories = [...new Set(articles.map(a => a.category))];

    return (
        <>
            <SEO
                title="Gaming News & Guides - NextPlay 2026 Blog"
                description="Stay updated with the latest video game news, release date updates, guides, and features. Expert coverage of GTA 6, PS5, Xbox, and all 2026 releases."
                url={getCanonicalUrl('/blog')}
                keywords="gaming news, game guides, 2026 game releases, GTA 6 news, PS5 games 2026"
            />

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <nav style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 0.5rem' }}>/</span>
                        <span>Blog</span>
                    </nav>
                    <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '0.75rem' }}>
                        NextPlay <span style={{ color: '#06b6d4' }}>Blog</span>
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px' }}>
                        News, guides, and features about upcoming video games. Stay informed about everything gaming in 2026.
                    </p>
                </div>

                {/* Featured Article */}
                {articles.length > 0 && (
                    <Link
                        to={`/blog/${articles[0].slug}`}
                        style={{
                            display: 'block',
                            textDecoration: 'none',
                            marginBottom: '3rem'
                        }}
                    >
                        <article style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.2s, border-color 0.2s'
                        }}>
                            <div style={{
                                height: '300px',
                                background: `linear-gradient(to bottom, rgba(10,14,23,0) 0%, rgba(10,14,23,0.9) 100%), url(${articles[0].image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '2rem'
                            }}>
                                <span style={{
                                    display: 'inline-block',
                                    background: '#06b6d4',
                                    color: '#0a0e17',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem',
                                    width: 'fit-content'
                                }}>
                                    FEATURED
                                </span>
                                <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>
                                    {articles[0].title}
                                </h2>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                    {articles[0].excerpt}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={14} /> {articles[0].publishedDate}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={14} /> {articles[0].readTime}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Link>
                )}

                {/* Articles Grid */}
                <h2 className="font-heading" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem' }}>
                    Latest Articles
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {articles.slice(1).map((article) => (
                        <Link
                            key={article.slug}
                            to={`/blog/${article.slug}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <article style={{
                                background: 'rgba(30, 41, 59, 0.3)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'transform 0.2s, border-color 0.2s',
                                height: '100%'
                            }}>
                                <div style={{
                                    height: '160px',
                                    background: `url(${article.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }} />
                                <div style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        background: 'rgba(6, 182, 212, 0.1)',
                                        color: '#06b6d4',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        marginBottom: '0.75rem'
                                    }}>
                                        {article.category}
                                    </span>
                                    <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                        {article.title}
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                                        {article.excerpt.substring(0, 100)}...
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                                        <span>{article.publishedDate}</span>
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

// Individual Article Page Component  
const BlogArticle = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const article = articles.find(a => a.slug === slug);

    if (!article) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Article Not Found</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The article you're looking for doesn't exist.</p>
                <Link to="/blog" className="btn-primary">Back to Blog</Link>
            </div>
        );
    }

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: article.title.substring(0, 30) + '...', path: `/blog/${slug}` }
    ];

    // Simple markdown-like content rendering
    const renderContent = (content) => {
        const lines = content.trim().split('\n');
        const elements = [];
        let currentList = [];

        lines.forEach((line, i) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('## ')) {
                if (currentList.length > 0) {
                    elements.push(<ul key={`list-${i}`} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{currentList}</ul>);
                    currentList = [];
                }
                elements.push(<h2 key={i} style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>{trimmed.slice(3)}</h2>);
            } else if (trimmed.startsWith('### ')) {
                if (currentList.length > 0) {
                    elements.push(<ul key={`list-${i}`} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{currentList}</ul>);
                    currentList = [];
                }
                elements.push(<h3 key={i} style={{ color: '#06b6d4', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{trimmed.slice(4)}</h3>);
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                currentList.push(<li key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>{trimmed.slice(2)}</li>);
            } else if (trimmed.startsWith('---')) {
                if (currentList.length > 0) {
                    elements.push(<ul key={`list-${i}`} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{currentList}</ul>);
                    currentList = [];
                }
                elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0' }} />);
            } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                elements.push(<p key={i} style={{ color: '#fff', fontWeight: 600, margin: '0.5rem 0' }}>{trimmed.slice(2, -2)}</p>);
            } else if (trimmed.length > 0) {
                if (currentList.length > 0) {
                    elements.push(<ul key={`list-${i}`} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{currentList}</ul>);
                    currentList = [];
                }
                // Handle inline links [text](/url)
                const withLinks = trimmed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#06b6d4">$1</a>');
                // Handle bold **text**
                const withBold = withLinks.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#fff">$1</strong>');
                elements.push(<p key={i} style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: withBold }} />);
            }
        });

        if (currentList.length > 0) {
            elements.push(<ul key="final-list" style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{currentList}</ul>);
        }

        return elements;
    };

    return (
        <>
            <SEO
                title={article.title}
                description={article.excerpt}
                url={getCanonicalUrl(`/blog/${slug}`)}
                image={article.image}
                type="article"
                breadcrumbs={breadcrumbs}
                keywords={article.tags.join(', ')}
                author={article.author}
                publishedTime={article.publishedDate}
                modifiedTime={article.modifiedDate}
            />

            <article className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#06b6d4', textDecoration: 'none' }}>Home</Link>
                    <ChevronRight size={14} style={{ margin: '0 0.5rem', verticalAlign: 'middle' }} />
                    <Link to="/blog" style={{ color: '#06b6d4', textDecoration: 'none' }}>Blog</Link>
                    <ChevronRight size={14} style={{ margin: '0 0.5rem', verticalAlign: 'middle' }} />
                    <span>{article.category}</span>
                </nav>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/blog')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Blog
                </button>

                {/* Article Header */}
                <header style={{ marginBottom: '2rem' }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(6, 182, 212, 0.1)',
                        color: '#06b6d4',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '1rem'
                    }}>
                        {article.category}
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        color: '#fff',
                        marginBottom: '1rem',
                        lineHeight: 1.2
                    }}>
                        {article.title}
                    </h1>

                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {article.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        fontSize: '0.875rem',
                        color: '#64748b',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={16} /> {article.author}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} /> {article.publishedDate}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} /> {article.readTime}
                        </span>
                    </div>
                </header>

                {/* Featured Image */}
                <div style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '2rem'
                }}>
                    <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>

                {/* Article Content */}
                <div style={{ marginBottom: '3rem' }}>
                    {renderContent(article.content)}
                </div>

                {/* Tags */}
                <div style={{
                    padding: '1.5rem',
                    background: 'rgba(30, 41, 59, 0.3)',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Tag size={16} color="#64748b" />
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Tags:</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {article.tags.map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: '#94a3b8',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Share & CTA */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Enjoy this article?</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                        Add games to your watchlist and never miss a release!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" className="btn-primary">Browse Games</Link>
                        <Link to="/watchlist" style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            My Watchlist
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};

// Export both components
export { articles };
export { BlogLanding, BlogArticle };
export default BlogLanding;
