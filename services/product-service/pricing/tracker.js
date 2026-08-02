const db = require("../db")
const simulatedProvider = require("./providers/simulated")

const DROP_THRESHOLD = 0.01 // ignore sub-1% noise, only report genuine drops

const getAllProducts = db.prepare("SELECT * FROM products")
const updateProduct = db.prepare(
  "UPDATE products SET sale_price = ?, discount_percent = ?, updated_at = datetime('now') WHERE id = ?"
)
const insertHistory = db.prepare(
  "INSERT INTO price_history (product_id, price) VALUES (?, ?)"
)

async function runPriceCheck({ provider = simulatedProvider } = {}) {
  const products = getAllProducts.all()
  const drops = []
  let changed = 0

  for (const product of products) {
    const { price: newPrice } = await provider.fetchPrice(product)
    const oldPrice = product.sale_price

    insertHistory.run(product.id, newPrice)

    const percentChange = (oldPrice - newPrice) / oldPrice
    if (Math.abs(percentChange) >= DROP_THRESHOLD) {
      changed++
      const discountPercent = Math.round(((product.original_price - newPrice) / product.original_price) * 100)
      updateProduct.run(newPrice, Math.max(0, discountPercent), product.id)

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

  return { checked: products.length, changed, drops }
}

module.exports = { runPriceCheck }
