export const BASE_URL = import.meta.env.BASE_URL;

/** React Router basename — no trailing slash (e.g. `/MTweb`). */
export const ROUTER_BASENAME = BASE_URL.replace(/\/$/, '') || '/';

/** Public site URL without trailing slash. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://michaltkac.com/MTweb').replace(/\/$/, '');

/** Prefix a public asset path with the Vite base URL (e.g. `/MTweb/images/foo.png`). */
export function assetPath(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${BASE_URL}${normalized}`;
}

/** Build an absolute URL for SEO, Open Graph, and sitemap entries. */
export function absoluteUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${SITE_URL}/${normalized}`;
}
