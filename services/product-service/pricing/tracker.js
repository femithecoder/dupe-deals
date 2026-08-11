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

  return { checked: products.length, changed, drops, failures }
}

module.exports = { runPriceCheck }
