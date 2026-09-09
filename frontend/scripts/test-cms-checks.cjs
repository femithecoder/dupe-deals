// Runs the CMS editor's house rules over the real posts. The point is not that
// they find something, but that they stay quiet on content that already passes
// audit:blog. A panel that cries wolf on every post gets ignored.
const fs = require("fs")
const path = require("path")
const { rules, setOwnPrices } = require("../public/admin/checks.js")

const DIR = path.join(__dirname, "../content/blog")
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://dupedeals-gateway.onrender.com"

;(async () => {
  const prices = new Map()
  try {
    const { products = [] } = await (await fetch(`${GATEWAY}/api/products?limit=500`)).json()
    for (const p of products) {
      for (const v of [p.salePrice, p.originalPrice]) {
        if (typeof v !== "number") continue
        const forms = Number.isInteger(v) ? [`£${v}`, `£${v.toFixed(2)}`] : [`£${v.toFixed(2)}`]
        for (const f of forms) prices.set(f, p)
      }
    }
    console.log(`Loaded ${prices.size} price spellings from ${products.length} products\n`)
  } catch (err) {
    console.log(`Could not reach the gateway (${err.message}), skipping the price rule\n`)
  }
  setOwnPrices(prices)

  const totals = {}
  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
    const body = fs.readFileSync(path.join(DIR, file), "utf8").split("---").slice(2).join("---")
    const found = []
    for (const rule of rules) for (const hit of rule.find(body)) found.push({ rule: rule.label, ...hit })
    if (!found.length) continue
    console.log(file.replace(".md", ""))
    for (const f of found) {
      totals[f.rule] = (totals[f.rule] || 0) + 1
      console.log(`  [${f.rule}] ${f.text}`)
      console.log(`      ${f.note}`)
    }
    console.log()
  }
  console.log("Totals across 15 posts that all pass audit:blog:")
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1])
  if (!entries.length) console.log("  nothing flagged")
  for (const [rule, n] of entries) console.log(`  ${String(n).padStart(3)}  ${rule}`)
})()
