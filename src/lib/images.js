// IGDB image CDN helpers. https://api-docs.igdb.com/#images
const BASE = 'https://images.igdb.com/igdb/image/upload';

export const cover = (id, size = 'cover_big') => (id ? `${BASE}/t_${size}/${id}.webp` : null);
export const coverSrcSet = (id) => (id ? `${BASE}/t_cover_small/${id}.webp 90w, ${BASE}/t_cover_big/${id}.webp 264w, ${BASE}/t_cover_big_2x/${id}.webp 528w` : undefined);
export const shot = (id, size = 'screenshot_big') => (id ? `${BASE}/t_${size}/${id}.webp` : null);
export const shotSrcSet = (id) => (id ? `${BASE}/t_screenshot_med/${id}.webp 569w, ${BASE}/t_screenshot_big/${id}.webp 889w, ${BASE}/t_1080p/${id}.webp 1920w` : undefined);
// JPEG variant for og:image (some social scrapers still reject webp).
export const ogImage = (id) => (id ? `${BASE}/t_1080p/${id}.jpg` : null);
export const youtubeThumb = (vid) => `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
