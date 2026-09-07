// Searches an Awin merchant feed for products we could list, via the service's
// /admin/feed-search route (the API key lives there, not here).
//
//   CRON_SECRET=... node feed-search.js --feed 110672 --any "moisturiser,serum" --max 40
//
// Flags:
//   --feed <id>     Awin feed id, required. Amazon 110672, Quzo UK 42863.
//   --any  a,b,c    match rows containing ANY of these terms
//   --all  a,b      match only rows containing ALL of these terms
//   --min / --max   price bounds in GBP
//   --limit <n>     how many matches to return (default 25, max 100)
//   --json          print raw JSON instead of the readable table

const SERVICE = process.env.SERVICE_URL || "https://dupedeals-product-service.onrender.com"
const SECRET = process.env.CRON_SECRET

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const list = (v) => (v ? String(v).split(",").map((s) => s.trim()).filter(Boolean) : [])

async function main() {
  if (!SECRET) throw new Error("CRON_SECRET must be set")
  const feedId = arg("feed")
  if (!feedId) throw new Error("--feed <id> is required (Amazon 110672, Quzo UK 42863)")

  const body = {
    feedId,
    anyOf: list(arg("any")),
    allOf: list(arg("all")),
    limit: parseInt(arg("limit", "25")),
    minPrice: arg("min") ? Number(arg("min")) : undefined,
    maxPrice: arg("max") ? Number(arg("max")) : undefined,
  }

  console.error(`searching feed ${feedId} for ${JSON.stringify(body.anyOf.concat(body.allOf))} ...`)
  const res = await fetch(`${SERVICE}/admin/feed-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-cron-secret": SECRET },
    body: JSON.stringify(body),
  })
  const out = await res.json()
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(out)}`)

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(out, null, 2))
    return
  }

  console.log(`\nscanned ${out.scanned} rows, ${out.matched} match\n`)
  for (const p of out.results) {
    const rrp = p.rrp ? `  (rrp £${p.rrp})` : ""
    console.log(`${p.alreadyListed ? "[listed] " : ""}£${p.price}${rrp}  ${p.name}`)
    console.log(`   id ${p.awProductId}${p.brand ? "  brand " + p.brand : ""}${p.category ? "  cat " + p.category : ""}`)
    console.log(`   ${p.deepLink}\n`)
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
