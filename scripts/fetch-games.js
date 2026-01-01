import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IGDB/Twitch credentials
const TWITCH_CLIENT_ID = 'j9wxy74o5ugm7x8jaxdzyu29kasejf';
const TWITCH_CLIENT_SECRET = 'hhs3j6u71u2mpwknbfks87yqk22zzf';

// RAWG API
const RAWG_API_KEY = 'c542e67aec3a4340908f9de9e86038af';

// GTA VI - Manually curated since it's the most anticipated game
const GTA6 = {
    id: 'curated-gta6',
    title: 'Grand Theft Auto VI',
    releaseDate: '2026-11-19',
    genres: ['Action', 'Adventure', 'Open World'],
    platforms: ['PlayStation 5', 'Xbox Series X/S'],
    developers: ['Rockstar North', 'Rockstar Games'],
    publishers: ['Rockstar Games', 'Take-Two Interactive'],
    image: 'https://media.rawg.io/media/games/734/7342a1cd82c8997ec620084ae4c2e7e4.jpg',
    description: 'Grand Theft Auto VI takes players to the state of Leonida, home to the neon-soaked streets of Vice City. The game features dual protagonists Lucia and her partner, marking the first female lead in the mainline series. Set in a modern-day Vice City inspired by Miami, GTA VI promises to deliver the most immersive and ambitious open world Rockstar has ever created.',
    storyline: 'Return to Vice City in an all-new adventure featuring Lucia and her partner as they navigate the criminal underworld of Leonida.',
    slug: 'grand-theft-auto-vi',
    hype: 100,
    source: 'curated',
    screenshots: [
        'https://media.rawg.io/media/screenshots/962/962a06e1c66c3f3c14e8f7b2de292ee8.jpg',
        'https://media.rawg.io/media/screenshots/be8/be859bcf8ebb85c4cc6a7a68d2f8f6d7.jpg'
    ],
    videos: [],
    ageRatings: ['ESRB: Mature 17+', 'PEGI: 18'],
    gameModes: ['Single Player'],
    themes: ['Action', 'Open World', 'Crime'],
    similarGames: []
};

async function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function getTwitchToken() {
    console.log('🔑 Getting Twitch access token...');
    const response = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
        { method: 'POST' }
    );
    const data = await response.json();
    console.log('✅ Token acquired!\n');
    return data.access_token;
}

async function fetchIGDB(token) {
    console.log('🎮 Fetching from IGDB (enhanced data - 2026 releases)...');
    const start2026 = Math.floor(new Date('2026-01-01').getTime() / 1000);
    const end2026 = Math.floor(new Date('2026-12-31').getTime() / 1000);

    const games = [];
    let offset = 0;

    // Fetch up to 500 games for maximum coverage
    while (offset < 1000) {
        const query = `
            fields name, slug, summary, storyline, cover.url, 
                   first_release_date, 
                   platforms.name, genres.name, themes.name,
                   involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
                   game_modes.name, age_ratings.category, age_ratings.rating,
                   screenshots.url, videos.video_id, artworks.url,
                   similar_games.name, similar_games.slug, similar_games.cover.url,
                   total_rating, follows, hypes;
            where first_release_date >= ${start2026} & first_release_date <= ${end2026} & cover != null;
            sort follows desc;
            limit 50;
            offset ${offset};
        `;

        try {
            const res = await fetch('https://api.igdb.com/v4/games', {
                method: 'POST',
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/plain'
                },
                body: query
            });

            const data = await res.json();
            if (!data.length) break;

            for (const g of data) {
                if (!g.cover?.url) continue;
                if (!g.first_release_date) continue;

                const releaseDate = new Date(g.first_release_date * 1000).toISOString().split('T')[0];
                if (!releaseDate.startsWith('2026')) continue;

                // Skip DLC, editions, packs - only base games
                const titleLower = g.name.toLowerCase();
                if (titleLower.includes('edition') || titleLower.includes('pack') ||
                    titleLower.includes('dlc') || titleLower.includes('bundle') ||
                    titleLower.includes('kit') || titleLower.includes('expansion') ||
                    titleLower.includes('season pass') || titleLower.includes('upgrade') ||
                    titleLower.includes('deluxe') || titleLower.includes('ultimate')) continue;

                // Parse age ratings
                const ageRatings = [];
                if (g.age_ratings) {
                    for (const ar of g.age_ratings) {
                        // Category: 1=ESRB, 2=PEGI
                        const category = ar.category === 1 ? 'ESRB' : ar.category === 2 ? 'PEGI' : 'Other';
                        const ratingMap = {
                            1: 'RP', 2: 'EC', 3: 'E', 4: 'E10+', 5: 'T', 6: 'M', 7: 'AO',
                            8: '3', 9: '7', 10: '12', 11: '16', 12: '18'
                        };
                        const rating = ratingMap[ar.rating] || 'Unknown';
                        ageRatings.push(`${category}: ${rating}`);
                    }
                }

                // Parse screenshots
                const screenshots = g.screenshots?.slice(0, 6).map(s =>
                    s.url.replace('t_thumb', 't_screenshot_big').replace('//', 'https://')
                ) || [];

                // Parse videos (YouTube IDs)
                const videos = g.videos?.slice(0, 3).map(v => v.video_id) || [];

                // Parse similar games
                const similarGames = g.similar_games?.slice(0, 4).map(sg => ({
                    name: sg.name,
                    slug: sg.slug,
                    cover: sg.cover?.url?.replace('t_thumb', 't_cover_small').replace('//', 'https://') || null
                })) || [];

                games.push({
                    id: `igdb-${g.id}`,
                    title: g.name,
                    releaseDate,
                    genres: g.genres?.map(x => x.name) || [],
                    platforms: g.platforms?.map(x =>
                        x.name.replace('PC (Microsoft Windows)', 'PC')
                            .replace('Xbox Series X|S', 'Xbox Series X/S')
                    ) || [],
                    developers: g.involved_companies?.filter(c => c.developer).map(c => c.company?.name).filter(Boolean) || [],
                    publishers: g.involved_companies?.filter(c => c.publisher).map(c => c.company?.name).filter(Boolean) || [],
                    image: g.cover.url.replace('t_thumb', 't_cover_big').replace('//', 'https://'),
                    description: g.summary?.slice(0, 500) || '',
                    storyline: g.storyline?.slice(0, 500) || '',
                    slug: g.slug,
                    hype: 50 + (g.follows || 0) / 10 + (g.total_rating || 0) / 10,
                    source: 'igdb',
                    screenshots,
                    videos,
                    ageRatings,
                    gameModes: g.game_modes?.map(gm => gm.name) || [],
                    themes: g.themes?.map(t => t.name) || [],
                    similarGames,
                    totalRating: g.total_rating || null
                });
            }

            console.log(`   IGDB offset ${offset}: ${games.length} valid games`);
            offset += 50;
            await delay(250);
        } catch (e) {
            console.error(`   Error: ${e.message}`);
            break;
        }
    }
    return games;
}

async function fetchRAWG() {
    console.log('\n🎮 Fetching from RAWG (2026 releases)...');
    const games = [];

    const platformMap = {
        4: 'PC',
        187: 'PlayStation 5',
        186: 'Xbox Series X/S',
        7: 'Nintendo Switch',
        18: 'PlayStation 4',
        1: 'Xbox One'
    };

    let page = 1;
    while (page <= 10) { // Increased from 5 to 10 pages
        try {
            const res = await fetch(
                `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&dates=2026-01-01,2026-12-31&ordering=-added&page_size=40&page=${page}`
            );
            const data = await res.json();

            if (!data.results?.length) break;

            for (const g of data.results) {
                if (!g.background_image) continue;
                if (!g.released) continue;
                if (!g.released.startsWith('2026')) continue;

                const platforms = g.platforms?.map(p => platformMap[p.platform.id]).filter(Boolean) || [];

                // Get additional screenshots from RAWG
                const screenshots = g.short_screenshots?.slice(0, 4).map(s => s.image) || [];

                games.push({
                    id: `rawg-${g.id}`,
                    title: g.name,
                    releaseDate: g.released,
                    genres: g.genres?.map(x => x.name) || [],
                    platforms,
                    developers: [],
                    publishers: [],
                    image: g.background_image,
                    description: g.description_raw?.slice(0, 500) || '',
                    storyline: '',
                    slug: g.slug,
                    hype: 50 + (g.added || 0) / 150 + (g.rating || 0) * 10,
                    source: 'rawg',
                    screenshots,
                    videos: [],
                    ageRatings: g.esrb_rating ? [`ESRB: ${g.esrb_rating.name}`] : [],
                    gameModes: [],
                    themes: g.tags?.slice(0, 5).map(t => t.name) || [],
                    similarGames: [],
                    totalRating: g.metacritic || null
                });
            }

            console.log(`   RAWG page ${page}: ${games.length} valid games`);
            if (!data.next) break;
            page++;
            await delay(300);
        } catch (e) {
            console.error(`   RAWG Error: ${e.message}`);
            break;
        }
    }

    return games;
}

async function main() {
    try {
        const token = await getTwitchToken();

        const [igdbGames, rawgGames] = await Promise.all([
            fetchIGDB(token),
            fetchRAWG()
        ]);

        // Start with curated GTA VI (full details)
        const allGames = [GTA6, ...igdbGames];
        const existingTitles = new Set(allGames.map(g => g.title.toLowerCase()));

        // Add RAWG games that aren't already in (skip GTA since we have curated version)
        for (const g of rawgGames) {
            if (!existingTitles.has(g.title.toLowerCase())) {
                allGames.push(g);
                existingTitles.add(g.title.toLowerCase());
            }
        }

        // Boost major titles
        allGames.forEach(g => {
            const t = g.title.toLowerCase();
            if (t.includes('grand theft auto') || t.includes('gta vi')) g.hype = 100;
            else if (t.includes('tomb raider')) g.hype = Math.max(g.hype, 92);
            else if (t.includes('prince of persia')) g.hype = Math.max(g.hype, 93);
            else if (t.includes('crimson desert')) g.hype = Math.max(g.hype, 88);
            else if (t.includes('ace combat')) g.hype = Math.max(g.hype, 85);
            else if (t.includes('resident evil')) g.hype = Math.max(g.hype, 84);
            else if (t.includes('replaced')) g.hype = Math.max(g.hype, 89);
            else if (t.includes('phantom blade')) g.hype = Math.max(g.hype, 82);
            else if (t.includes('diablo')) g.hype = Math.max(g.hype, 80);
            else if (t.includes('007') || t.includes('james bond')) g.hype = Math.max(g.hype, 78);
            else if (t.includes('pragmata')) g.hype = Math.max(g.hype, 75);
            else if (t.includes('genshin')) g.hype = Math.max(g.hype, 70);
            else if (t.includes('marvel')) g.hype = Math.max(g.hype, 72);
            g.hype = Math.min(100, Math.round(g.hype));
        });

        // Deduplicate and sort
        const seen = new Set();
        const unique = allGames.filter(g => {
            const k = g.title.toLowerCase();
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });

        unique.sort((a, b) => b.hype - a.hype);

        // Keep up to 250 games
        const final = unique.slice(0, 250);

        // Generate metadata for SEO
        const genres = [...new Set(final.flatMap(g => g.genres))].filter(Boolean).sort();
        const platforms = [...new Set(final.flatMap(g => g.platforms))].filter(Boolean).sort();
        const months = {};
        final.forEach(g => {
            const month = g.releaseDate.substring(0, 7);
            months[month] = (months[month] || 0) + 1;
        });

        // Save games
        const outDir = path.join(__dirname, '../src/data');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'games.json'), JSON.stringify(final, null, 2));

        // Save metadata for SEO pages
        const metadata = { genres, platforms, months, totalGames: final.length };
        fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

        console.log(`\n✅ Saved ${final.length} games with ENHANCED data!`);
        console.log(`\n📊 Top 20 Games:`);
        final.slice(0, 20).forEach((g, i) =>
            console.log(`   #${i + 1}. ${g.title} - ${g.releaseDate} (${g.hype}% hype) [${g.screenshots.length} screenshots, ${g.videos.length} videos]`)
        );

        console.log('\n📅 Release date distribution:');
        Object.entries(months).sort().forEach(([m, c]) => console.log(`   ${m}: ${c} games`));

        console.log('\n🎭 Genres found:', genres.length);
        console.log('🎮 Platforms found:', platforms.length);

    } catch (err) {
        console.error('Error:', err);
    }
}

main();
