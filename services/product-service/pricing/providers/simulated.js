// Stand-in for a real price feed (e.g. an affiliate network's product API) so the
// tracking pipeline, price history, and drop detection all work end to end today.
// Swap this out for a real provider by implementing the same fetchPrices(products)
// shape: takes the full batch, returns a Map<product.id, { price } | { error }>.

const FLOOR_RATIO = 0.4 // simulated price never drops below 40% of the original RRP

function round2(n) {
  return Math.round(n * 100) / 100
}

function simulateOne(product) {
  const roll = Math.random()

  let nextPrice = product.sale_price

  if (roll < 0.15) {
    // a fresh discount, or a deeper one on top of the current sale
    const cutPercent = 0.05 + Math.random() * 0.25 // 5-30% off the current price
    nextPrice = product.sale_price * (1 - cutPercent)
  } else if (roll < 0.22) {
    // sale ends, price recovers toward (or to) the original RRP
    nextPrice = Math.random() < 0.5 ? product.original_price : product.sale_price * (1 + Math.random() * 0.15)
  }
  // otherwise (78% of checks) the price is unchanged, same as most real price checks

  const floor = product.original_price * FLOOR_RATIO
  nextPrice = Math.min(product.original_price, Math.max(floor, nextPrice))

  return { price: round2(nextPrice) }
}

async function fetchPrices(products) {
  const results = new Map()
  for (const product of products) results.set(product.id, simulateOne(product))
  return results
}

module.exports = { fetchPrices }
