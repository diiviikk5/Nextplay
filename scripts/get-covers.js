// Uses native fetch (Node 18+)

const TWITCH_CLIENT_ID = 'j9wxy74o5ugm7x8jaxdzyu29kasejf';
const TWITCH_CLIENT_SECRET = 'hhs3j6u71u2mpwknbfks87yqk22zzf';

async function getTwitchToken() {
    const response = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
        { method: 'POST' }
    );
    const data = await response.json();
    return data.access_token;
}

async function getGameCover(token, gameName) {
    const query = `
        fields name, cover.url;
        search "${gameName}";
        limit 1;
    `;

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
    if (data[0]?.cover?.url) {
        const coverUrl = data[0].cover.url
            .replace('t_thumb', 't_cover_big')
            .replace('//', 'https://');
        return { name: data[0].name, cover: coverUrl };
    }
    return { name: gameName, cover: null };
}

async function main() {
    const token = await getTwitchToken();

    const games = [
        'Crimson Desert',
        'Fallout New Vegas',
        'Fire Emblem Path of Radiance',
        'Marvel Rivals',
        'Hollow Knight Silksong',
        'Hades II',
        'Clair Obscur Expedition 33',
        'Arena Breakout Infinite',
        'Cyberpunk 2077',
        'Resident Evil 9'
    ];

    console.log('Fetching cover images from IGDB...\n');

    for (const game of games) {
        const result = await getGameCover(token, game);
        console.log(`${result.name}:`);
        console.log(`  ${result.cover || 'NOT FOUND'}\n`);
        await new Promise(r => setTimeout(r, 250));
    }
}

main();
