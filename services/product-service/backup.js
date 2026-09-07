// Snapshots everything reachable through the public gateway to a local JSON
// file. Deliberately uses the public API rather than DATABASE_URL, so it runs
// anywhere without credentials and keeps working if the database is replaced.
//
// price_history is the reason this exists: products re-seed from seed.js and
// prices refresh on the next check, but a lost history cannot be rebuilt.
//
//   node backup.js [outputDir]

const fs = require("fs")
const path = require("path")

const GATEWAY = process.env.GATEWAY_URL || "https://dupedeals-gateway.onrender.com"

async function get(p) {
  const res = await fetch(`${GATEWAY}${p}`)
  if (!res.ok) throw new Error(`${res.status} on ${p}`)
  return res.json()
}

async function main() {
  const outDir = process.argv[2] || path.join(__dirname, "../../backups")
  fs.mkdirSync(outDir, { recursive: true })

  const out = { takenAt: new Date().toISOString(), gateway: GATEWAY, products: [], priceHistory: {}, clicks: null }

  const { products } = await get("/api/products?limit=500")
  out.products = products
  console.log(`products: ${products.length}`)

  let rows = 0
  for (const p of products) {
    // limit is deliberately huge: the route defaults to 30, which would
    // silently truncate a backup to the most recent month.
    const { history } = await get(`/api/products/${p.id}/price-history?limit=100000`)
    out.priceHistory[p.id] = history
    rows += history.length
  }
  console.log(`price history: ${rows} rows`)

  out.clicks = await get("/api/clicks/summary?days=3650")
  console.log(`clicks: ${out.clicks.total}`)

  const file = path.join(outDir, `dupedeals-backup-${new Date().toISOString().slice(0, 10)}.json`)
  fs.writeFileSync(file, JSON.stringify(out, null, 2))
  console.log(`\nwrote ${file} (${(fs.statSync(file).size / 1024).toFixed(0)} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
