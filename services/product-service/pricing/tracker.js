const db = require("../db")
const { getProvider } = require("./providers")

const DROP_THRESHOLD = 0.01 // ignore sub-1% noise, only report genuine drops

async function runPriceCheck({ provider = getProvider() } = {}) {
  const { rows: products } = await db.query("SELECT * FROM products")
  const drops = []
  const failures = []
  let changed = 0

  for (const product of products) {
    let newPrice
    try {
      ;({ price: newPrice } = await provider.fetchPrice(product))
    } catch (err) {
      // a real feed/network call can fail on any single product, don't let it
      // abort the check for the rest
      failures.push({ id: product.id, name: product.name, error: err.message })
      continue
    }

    const oldPrice = product.sale_price

    await db.query("INSERT INTO price_history (product_id, price) VALUES ($1, $2)", [product.id, newPrice])

    const percentChange = (oldPrice - newPrice) / oldPrice
    if (Math.abs(percentChange) >= DROP_THRESHOLD) {
      changed++
      const discountPercent = Math.round(((product.original_price - newPrice) / product.original_price) * 100)
      await db.query(
        "UPDATE products SET sale_price = $1, discount_percent = $2, updated_at = now() WHERE id = $3",
        [newPrice, Math.max(0, discountPercent), product.id]
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
