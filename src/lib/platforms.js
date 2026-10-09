// Canonical platform table. `slug` values are the public URL slugs (kept from the original site so ranked URLs survive).
export const PLATFORMS = {
  pc: { name: 'PC', long: 'PC (Windows)', short: 'PC', slug: 'pc', family: 'pc' },
  ps5: { name: 'PlayStation 5', long: 'PlayStation 5', short: 'PS5', slug: 'playstation-5', family: 'playstation' },
  xsx: { name: 'Xbox Series X|S', long: 'Xbox Series X|S', short: 'Xbox', slug: 'xbox-series-x-s', family: 'xbox' },
  'switch-2': { name: 'Nintendo Switch 2', long: 'Nintendo Switch 2', short: 'Switch 2', slug: 'nintendo-switch-2', family: 'nintendo' },
  switch: { name: 'Nintendo Switch', long: 'Nintendo Switch', short: 'Switch', slug: 'nintendo-switch', family: 'nintendo' },
  ps4: { name: 'PlayStation 4', long: 'PlayStation 4', short: 'PS4', slug: 'playstation-4', family: 'playstation' },
  xone: { name: 'Xbox One', long: 'Xbox One', short: 'XB1', slug: 'xbox-one', family: 'xbox' },
  mac: { name: 'Mac', long: 'macOS', short: 'Mac', slug: 'mac', family: 'pc' },
  linux: { name: 'Linux', long: 'Linux / Steam Deck', short: 'Linux', slug: 'linux', family: 'pc' },
  ios: { name: 'iOS', long: 'iPhone & iPad', short: 'iOS', slug: 'ios', family: 'mobile' },
  android: { name: 'Android', long: 'Android', short: 'Android', slug: 'android', family: 'mobile' },
  browser: { name: 'Web Browser', long: 'Web Browser', short: 'Web', slug: 'web-browser', family: 'pc' },
  steamvr: { name: 'SteamVR', long: 'SteamVR', short: 'SteamVR', slug: 'steamvr', family: 'vr' },
  'quest-3': { name: 'Meta Quest 3', long: 'Meta Quest 3', short: 'Quest 3', slug: 'meta-quest-3', family: 'vr' },
  'quest-2': { name: 'Meta Quest 2', long: 'Meta Quest 2', short: 'Quest 2', slug: 'meta-quest-2', family: 'vr' },
  psvr2: { name: 'PlayStation VR2', long: 'PlayStation VR2', short: 'PSVR2', slug: 'playstation-vr2', family: 'vr' },
};

// Display order for platform chips and hub navigation.
export const PLATFORM_ORDER = ['pc', 'ps5', 'xsx', 'switch-2', 'switch', 'ps4', 'xone', 'mac', 'linux', 'ios', 'android', 'quest-3', 'psvr2', 'steamvr', 'quest-2', 'browser'];

// The headline "big" platforms people ask about ("is X on PS5?").
export const MAJOR_PLATFORMS = ['pc', 'ps5', 'xsx', 'switch-2'];

export const PLATFORM_BY_SLUG = Object.fromEntries(Object.entries(PLATFORMS).map(([code, p]) => [p.slug, code]));

export function sortPlatforms(codes = []) {
  return [...codes].sort((a, b) => PLATFORM_ORDER.indexOf(a) - PLATFORM_ORDER.indexOf(b));
}

export const platformName = (code) => PLATFORMS[code]?.name || code;
export const platformShort = (code) => PLATFORMS[code]?.short || code;
