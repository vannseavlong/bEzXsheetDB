const DRIVE_UC_PATTERN = /^https?:\/\/drive\.google\.com\/uc\?(?:export=view&)?id=([^&]+)/

// drive.google.com/uc?id= is built for downloads and doesn't reliably render in <img>;
// the thumbnail endpoint is the format Google serves images through for embedding.
export function toEmbeddableImageUrl(url: string): string {
  const match = url.match(DRIVE_UC_PATTERN)
  if (!match) return url
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
}
