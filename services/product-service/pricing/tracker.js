const db = require("../db")
const { getProvider } = require("./providers")

const DROP_THRESHOLD = 0.01 // ignore sub-1% noise, only report genuine drops

async function runPriceCheck({ provider = getProvider(), merchant } = {}) {
  // Optional merchant filter, e.g. so Amazon (whose prices change several
  // times a day per Amazon's own dynamic pricing, confirmed by comparing our
  // tracked price against the live buy-box price and finding real drift on
  // 2 of 5 spot-checked products) can be checked more often than merchants
  // like Quzo, without re-running the whole catalog on that tighter schedule.
  const { rows: products } = merchant
    ? await db.query("SELECT * FROM products WHERE merchant = $1", [merchant])
    : await db.query("SELECT * FROM products")
  const drops = []
  const failures = []
  let changed = 0

  // One batch call, not one per product, so a feed-backed provider can
  // download and stream each merchant's feed exactly once per run instead of
  // once per product.
  const prices = await provider.fetchPrices(products)

  for (const product of products) {
    const result = prices.get(product.id)
    if (!result || result.error) {
      // a real feed/network call can fail for a whole merchant, don't let it
      // abort the check for products from other merchants
      failures.push({ id: product.id, name: product.name, error: result?.error || "no result returned" })
      continue
    }
    const newPrice = result.price

    const oldPrice = product.sale_price

    await db.query("INSERT INTO price_history (product_id, price) VALUES ($1, $2)", [product.id, newPrice])

    const percentChange = (oldPrice - newPrice) / oldPrice
    if (Math.abs(percentChange) >= DROP_THRESHOLD) {
      changed++
      // A retailer can push a price above whatever we recorded as the "was"
      // figure. Left alone, original_price then claims a reference price lower
      // than what the thing currently sells for, which is meaningless, and it
      // happened to 9 of 55 products within weeks. Raising it keeps the
      // invariant original_price >= sale_price, so the product simply shows no
      // discount, which is the truth.
      //
      // Raising rather than pinning also means a later drop is measured
      // against a price the product genuinely sold at, and price_history can
      // evidence it, which matters for "was" pricing claims.
      const reference = Math.max(product.original_price, newPrice)
      const discountPercent = Math.round(((reference - newPrice) / reference) * 100)
      await db.query(
        "UPDATE products SET sale_price = $1, original_price = $2, discount_percent = $3, updated_at = now() WHERE id = $4",
        [newPrice, reference, Math.max(0, discountPercent), product.id]
      )

      if (percentChange >= DROP_THRESHOLD) {
        drops.push({
          id: product.id,
          name: product.name,
          oldPrice,
          newPrice,
          percentOff: Math.round(percentChange * 100),
        })
      }
    }
  }

  if (changed > 0) await notifyFrontend()

  return { checked: products.length, changed, drops, failures }
}

// Pokes the frontend to drop its cached product data immediately instead of
// waiting on ISR's lazy background regeneration, which is what let stale
// mock-data prices sit on the live site unnoticed after a real price change.
// Both env vars are optional, local/dev runs without them just skip this.
async function notifyFrontend() {
  const url = process.env.FRONTEND_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!url || !secret) return

  try {
    const res = await fetch(url, { method: "POST", headers: { "x-revalidate-secret": secret } })
    if (!res.ok) console.error(`[price-check] frontend revalidate failed: ${res.status}`)
  } catch (err) {
    console.error("[price-check] frontend revalidate failed:", err.message)
  }
}

module.exports = { runPriceCheck }
