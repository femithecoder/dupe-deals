// Pushes the price history from a backup.js snapshot back into the database
// via POST /admin/import-price-history.
//
//   CRON_SECRET=... node restore-price-history.js ../../backups/<file>.json
//
// Run /admin/seed first if the database is empty: price_history has a foreign
// key to products, so the import rejects an unseeded database outright.
//
// Sent in batches of products rather than one large body, because express.json
// caps a request at 100kb by default and a full history is comfortably past
// that. Raising the global cap to suit one restore path would loosen the limit
// on every other route too. The import is idempotent, so a batch that fails
// mid-run can be re-sent without creating duplicates.

const fs = require("fs")

const SERVICE = process.env.SERVICE_URL || "https://dupedeals-product-service.onrender.com"
const SECRET = process.env.CRON_SECRET
const BATCH_PRODUCTS = 10

async function main() {
  const file = process.argv[2]
  if (!file) throw new Error("usage: node restore-price-history.js <backup.json>")
  if (!SECRET) throw new Error("CRON_SECRET must be set")

  const backup = JSON.parse(fs.readFileSync(file, "utf8"))
  const entries = Object.entries(backup.priceHistory ?? {})
  if (!entries.length) throw new Error("backup contains no price history")

  const total = entries.reduce((n, [, h]) => n + h.length, 0)
  console.log(`restoring ${total} rows across ${entries.length} products to ${SERVICE}`)

  let inserted = 0
  let duplicates = 0
  const unknown = new Set()

  for (let i = 0; i < entries.length; i += BATCH_PRODUCTS) {
    const priceHistory = Object.fromEntries(entries.slice(i, i + BATCH_PRODUCTS))
    const res = await fetch(`${SERVICE}/admin/import-price-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-cron-secret": SECRET },
      body: JSON.stringify({ priceHistory }),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(body)}`)

    inserted += body.inserted
    duplicates += body.skippedDuplicates
    for (const id of body.skippedUnknownProducts ?? []) unknown.add(id)
    process.stdout.write(`\r  ${inserted} inserted, ${duplicates} already present`)
  }

  console.log(`\ndone: ${inserted} inserted, ${duplicates} already present`)
  if (unknown.size) {
    console.log(`skipped ${unknown.size} product(s) not in the database: ${[...unknown].join(", ")}`)
    console.log("run /admin/seed and re-run this script to pick them up")
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
