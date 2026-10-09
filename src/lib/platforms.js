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
  // Legacy systems: shown on game pages and series timelines, never get hub pages.
  ps3: { name: 'PlayStation 3', long: 'PlayStation 3', short: 'PS3', family: 'playstation', legacy: true },
  ps2: { name: 'PlayStation 2', long: 'PlayStation 2', short: 'PS2', family: 'playstation', legacy: true },
  ps1: { name: 'PlayStation', long: 'PlayStation', short: 'PS1', family: 'playstation', legacy: true },
  psp: { name: 'PSP', long: 'PlayStation Portable', short: 'PSP', family: 'playstation', legacy: true },
  vita: { name: 'PS Vita', long: 'PlayStation Vita', short: 'Vita', family: 'playstation', legacy: true },
  x360: { name: 'Xbox 360', long: 'Xbox 360', short: 'X360', family: 'xbox', legacy: true },
  xbox: { name: 'Xbox', long: 'Xbox (2001)', short: 'Xbox', family: 'xbox', legacy: true },
  wiiu: { name: 'Wii U', long: 'Wii U', short: 'Wii U', family: 'nintendo', legacy: true },
  wii: { name: 'Wii', long: 'Wii', short: 'Wii', family: 'nintendo', legacy: true },
  '3ds': { name: 'Nintendo 3DS', long: 'Nintendo 3DS', short: '3DS', family: 'nintendo', legacy: true },
  ds: { name: 'Nintendo DS', long: 'Nintendo DS', short: 'DS', family: 'nintendo', legacy: true },
  gc: { name: 'GameCube', long: 'Nintendo GameCube', short: 'GC', family: 'nintendo', legacy: true },
  n64: { name: 'Nintendo 64', long: 'Nintendo 64', short: 'N64', family: 'nintendo', legacy: true },
  gba: { name: 'Game Boy Advance', long: 'Game Boy Advance', short: 'GBA', family: 'nintendo', legacy: true },
  snes: { name: 'SNES', long: 'Super Nintendo', short: 'SNES', family: 'nintendo', legacy: true },
  nes: { name: 'NES', long: 'Nintendo Entertainment System', short: 'NES', family: 'nintendo', legacy: true },
  dc: { name: 'Dreamcast', long: 'Sega Dreamcast', short: 'DC', family: 'pc', legacy: true },
};

// Display order for platform chips and hub navigation.
export const PLATFORM_ORDER = ['pc', 'ps5', 'xsx', 'switch-2', 'switch', 'ps4', 'xone', 'mac', 'linux', 'ios', 'android', 'quest-3', 'psvr2', 'steamvr', 'quest-2', 'browser'];

const LEGACY_ORDER = ['ps3', 'x360', 'wiiu', '3ds', 'vita', 'ps2', 'xbox', 'wii', 'ds', 'psp', 'gc', 'ps1', 'n64', 'dc', 'gba', 'snes', 'nes'];
const DISPLAY_ORDER = [...PLATFORM_ORDER, ...LEGACY_ORDER];

// The headline "big" platforms people ask about ("is X on PS5?").
export const MAJOR_PLATFORMS = ['pc', 'ps5', 'xsx', 'switch-2'];

export const PLATFORM_BY_SLUG = Object.fromEntries(Object.entries(PLATFORMS).filter(([, p]) => p.slug).map(([code, p]) => [p.slug, code]));

export function sortPlatforms(codes = []) {
  return [...codes].sort((a, b) => DISPLAY_ORDER.indexOf(a) - DISPLAY_ORDER.indexOf(b));
}

export const platformName = (code) => PLATFORMS[code]?.name || code;
export const platformShort = (code) => PLATFORMS[code]?.short || code;
