// Checks every blog post against docs/blog-playbook.md, and against the rules
// that are easy to break silently: hardcoded prices for our own products, and
// phrasing repeated across posts.
//
//   npm run audit:blog
//
// The price check is the important one. A price typed into prose does not
// update when the tracker moves it, so it quietly turns into a lie. Competitor
// prices as plain text are fine and expected, which is why this compares
// against our own catalogue rather than flagging every "£".

const fs = require("fs")
const path = require("path")

const DIR = path.join(__dirname, "../content/blog")
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://dupedeals-gateway.onrender.com"

const strip = (body) =>
  body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\|[^\n]*\|/g, "")
    .replace(/^#{1,6} .*$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*/g, "")

function read() {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => {
    const src = fs.readFileSync(path.join(DIR, f), "utf8")
    return {
      file: f.replace(".md", ""),
      fm: src.split("---")[1] || "",
      body: src.split("---").slice(2).join("---"),
    }
  })
}

async function main() {
  const posts = read()
  let problems = 0
  const say = (post, msg) => { console.log(`  ${post}\n    - ${msg}`); problems++ }

  // Playbook structure
  for (const p of posts) {
    const title = (p.fm.match(/title: "(.*)"/) || [])[1] || ""
    const excerpt = (p.fm.match(/excerpt: "(.*)"/) || [])[1] || ""
    const words = p.body.trim().split(/\s+/).length
    const internal = [...new Set([...p.body.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]))].filter((u) => !u.startsWith("/images"))
    if (title.length > 60) say(p.file, `title ${title.length} chars, limit 60`)
    if (excerpt.length < 110 || excerpt.length > 155) say(p.file, `excerpt ${excerpt.length} chars, need 110-155`)
    if (words < 1000) say(p.file, `${words} words, target 1000+`)
    if (internal.length < 4) say(p.file, `${internal.length} internal links, need 4-5`)
    if (!/^\|/m.test(p.body)) say(p.file, "no comparison table")
    if (!/## (Frequently asked|FAQ)/i.test(p.body)) say(p.file, "no FAQ section")
    if (!/## How we (priced|chose|sourced)/i.test(p.body)) say(p.file, "no methodology section")
    if (/—/.test(p.body)) say(p.file, "contains an em dash")
  }

  // Our own prices must come from tokens, never typed in
  let products = []
  try {
    products = (await (await fetch(`${GATEWAY}/api/products?limit=500`)).json()).products
  } catch {
    console.log("\n  (skipped price check: gateway unreachable)")
  }
  const byId = Object.fromEntries(products.map((p) => [p.id, p]))
  for (const p of posts) {
    const linked = [...new Set([...p.body.matchAll(/\]\(\/product\/(\d+)\)/g)].map((m) => m[1]))]
    const plain = [...new Set([...strip(p.body).replace(/\{\{\w+:\d+\}\}/g, "").matchAll(/£([0-9][0-9.,]*)/g)].map((m) => m[1].replace(/[.,]$/, "")))]
    for (const id of linked) {
      const prod = byId[id]
      if (!prod) continue
      for (const v of plain) {
        if (Math.abs(parseFloat(v.replace(/,/g, "")) - prod.salePrice) < 0.01) {
          say(p.file, `£${v} is product ${id}'s live price typed as plain text, use {{price:${id}}}`)
        }
      }
    }
  }

  // Phrasing shared across posts reads as templated. Link text is excluded:
  // descriptive anchors pointing at the same post SHOULD match across posts,
  // and counting them as duplication would flag good internal linking.
  const grams = {}
  for (const p of posts) {
    const noAnchors = p.body.replace(/\[[^\]]+\]\([^)]*\)/g, " ")
    const w = strip(noAnchors).toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean)
    const seen = new Set()
    for (let i = 0; i + 8 <= w.length; i++) {
      const g = w.slice(i, i + 8).join(" ")
      if (seen.has(g)) continue
      seen.add(g)
      ;(grams[g] = grams[g] || new Set()).add(p.file)
    }
  }
  for (const [g, s] of Object.entries(grams)) {
    if (s.size >= 3) say([...s][0], `phrase repeated in ${s.size} posts: "${g}"`)
  }

  // Competitor prices cannot be tokenised, because we do not sell those
  // products and have no feed for them. They still go stale, and a wrong
  // premium price is worse than a wrong price of ours: the comparison is the
  // whole point of the post. Nothing checked these before, so they aged
  // silently. Warn rather than fail, since going stale is inevitable and the
  // useful thing is knowing which post is due a look.
  const STALE_DAYS = 90
  const warnings = []
  for (const p of posts) {
    const literals = [...new Set([...strip(p.body).replace(/\{\{\w+:\d+\}\}/g, "").matchAll(/£[0-9][0-9.,]*/g)].map((m) => m[0]))]
    if (!literals.length) continue
    const checked = (p.fm.match(/pricesCheckedAt: "(.*)"/) || [])[1]
    if (!checked) {
      warnings.push(`${p.file}: ${literals.length} competitor price(s), never verified. Add pricesCheckedAt to the frontmatter once checked.`)
      continue
    }
    const age = Math.round((Date.now() - new Date(checked)) / 864e5)
    if (age > STALE_DAYS) warnings.push(`${p.file}: ${literals.length} competitor price(s) last checked ${age} days ago`)
  }
  if (warnings.length) {
    console.log("\nCOMPETITOR PRICES TO RE-CHECK (warnings, not failures)")
    warnings.forEach((w) => console.log("  " + w))
  }

  console.log(problems ? `\n${problems} problem(s) found` : `\nall ${posts.length} posts pass`)
  process.exit(problems ? 1 : 0)
}
main()
