// Product images are served through the Awin / productserve proxy, which the feed
// stores at a small w=200&h=200. Rendered on the product page (shown up to ~600px
// wide) that looks soft/blurry. The proxy's `k` signature only covers the source
// `url` param, not `w`/`h`, so we can safely ask the proxy for a larger render at
// read time without touching the stored value or the signature.
//
// Non-productserve URLs (Unsplash, etc.) are returned unchanged.
export function highResImage(url: string, size = 600): string {
  if (!url || !url.includes("images2.productserve.com")) return url
  let out = url
  out = /[?&]w=\d+/.test(out) ? out.replace(/([?&])w=\d+/, `$1w=${size}`) : `${out}&w=${size}`
  out = /[?&]h=\d+/.test(out) ? out.replace(/([?&])h=\d+/, `$1h=${size}`) : `${out}&h=${size}`
  return out
}
