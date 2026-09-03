import { fetchProductById } from "./api"

// Dynamic prices for blog posts. Posts are plain markdown rendered by
// react-markdown, so we can't embed a React component in the prose. Instead an
// author writes a token and we resolve it server-side to the live price before
// rendering, so a post never carries a hardcoded sale price that goes stale the
// next time the tracker moves it.
//
// Tokens (ID is a product id):
//   {{price:ID}}    -> live sale price, e.g. "£80.59"
//   {{rrp:ID}}      -> recommended retail / "was" price
//   {{save:ID}}     -> rrp minus sale price
//   {{discount:ID}} -> percent off, e.g. "38%"
//
// The fetch runs through the same tagged fetchProductById the product page
// uses, so blog pages sit under the same ISR revalidation (including the
// tracker's on-price-change webhook that busts the "products" cache tag), and
// the live database is the single source of truth, not the static mock data.

const TOKEN = /\{\{(price|rrp|save|discount):(\d+)\}\}/g

// "£26" reads better than "£26.00" in prose; keep the pennies only when there
// actually are any.
function formatPrice(n: number): string {
  return Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`
}

export async function resolveLivePriceTokens(content: string): Promise<string> {
  const ids = new Set<string>()
  for (const match of content.matchAll(TOKEN)) ids.add(match[2])
  if (ids.size === 0) return content

  const byId = new Map<string, Awaited<ReturnType<typeof fetchProductById>>>()
  await Promise.all(
    Array.from(ids).map(async (id) => {
      byId.set(id, await fetchProductById(id))
    })
  )

  return content.replace(TOKEN, (whole, kind: string, id: string) => {
    const product = byId.get(id)
    if (!product) {
      // Only happens for an id that exists in neither the live catalog nor the
      // mock fallback, i.e. an authoring mistake. Leave the token visible so it
      // is caught in review rather than silently dropping a price.
      console.warn(`[live-price] no product found for token {{${kind}:${id}}}`)
      return whole
    }
    if (kind === "rrp") return formatPrice(product.originalPrice)
    if (kind === "save") return formatPrice(product.originalPrice - product.salePrice)
    if (kind === "discount") return `${product.discountPercent}%`
    return formatPrice(product.salePrice)
  })
}
