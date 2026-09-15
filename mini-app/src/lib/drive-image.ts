const DRIVE_UC_PATTERN = /^https?:\/\/drive\.google\.com\/uc\?(?:export=view&)?id=([^&]+)/

// Self-contained fallback for a missing/broken thumbnail (no network request, so it
// can't itself 404) — use as both the initial src when there's no thumbnail at all
// and the onError target when a real thumbnail URL fails to load.
export const DEFAULT_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none'%3E%3Crect width='48' height='48' rx='8' fill='%23F0F0F0'/%3E%3Cpath d='M14 16h20v18a2 2 0 01-2 2H16a2 2 0 01-2-2V16z' stroke='%23B5B5B5' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M14 16l2-4h16l2 4' stroke='%23B5B5B5' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M20 22h8' stroke='%23B5B5B5' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E";

// drive.google.com/uc?id= is built for downloads and doesn't reliably render in <img>;
// the thumbnail endpoint is the format Google serves images through for embedding.
export function toEmbeddableImageUrl(url: string): string
export function toEmbeddableImageUrl(url: string | null | undefined): string | null | undefined
export function toEmbeddableImageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url
  const match = url.match(DRIVE_UC_PATTERN)
  if (!match) return url
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
}
