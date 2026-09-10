// Searches an Awin datafeed CSV already on disk, with no API key and no
// CRON_SECRET. feed-search.js goes through the service on Render because the
// Awin key lives there; this one is for an export you have downloaded, which
// is faster and works offline.
//
//   node feed-search-local.js ~/Downloads/datafeed_3013053.csv --any "tamper,espresso" --max 60
//
// Flags mirror feed-search.js: --any, --all, --min, --max, --limit, --merchant.

const fs = require("fs")
const readline = require("readline")

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const list = (v) => (v ? String(v).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : [])

// Minimal CSV row splitter: handles quoted fields containing commas and ""
// escapes, which Awin descriptions are full of.
function splitCsv(line) {
  const out = []
  let cur = "", quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++ } else quoted = false
      } else cur += c
    } else if (c === '"') quoted = true
    else if (c === ",") { out.push(cur); cur = "" }
    else cur += c
  }
  out.push(cur)
  return out
}

async function main() {
  const file = process.argv[2]
  if (!file || file.startsWith("--")) throw new Error("usage: node feed-search-local.js <feed.csv> --any \"a,b\"")

  const anyOf = list(arg("any"))
  const allOf = list(arg("all"))
  const min = arg("min") ? Number(arg("min")) : null
  const max = arg("max") ? Number(arg("max")) : null
  const merchant = (arg("merchant") || "").toLowerCase()
  const limit = parseInt(arg("limit", "30"))

  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })
  let header = null, idx = {}, found = 0, scanned = 0

  for await (const line of rl) {
    if (!header) {
      header = splitCsv(line)
      header.forEach((h, i) => (idx[h.trim()] = i))
      continue
    }
    scanned++
    const f = splitCsv(line)
    const name = (f[idx.product_name] || "")
    const desc = (f[idx.product_short_description] || f[idx.description] || "")
    const cat = (f[idx.category_name] || "")
    const merch = (f[idx.merchant_name] || "")
    const price = parseFloat(f[idx.search_price] || "0")

    if (merchant && !merch.toLowerCase().includes(merchant)) continue
    if (min !== null && price < min) continue
    if (max !== null && price > max) continue

    const hay = `${name} ${desc} ${cat}`.toLowerCase()
    if (anyOf.length && !anyOf.some((t) => hay.includes(t))) continue
    if (allOf.length && !allOf.every((t) => hay.includes(t))) continue

    found++
    console.log(`£${String(price.toFixed(2)).padEnd(8)} ${merch.padEnd(12)} ${cat.slice(0, 18).padEnd(18)} ${name.slice(0, 78)}`)
    if (found >= limit) break
  }
  console.error(`\n${found} shown, ${scanned} rows scanned`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })
