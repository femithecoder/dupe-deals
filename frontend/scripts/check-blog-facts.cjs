// The deterministic half of the blog fact audit: the checks that need no
// judgement and so can run unattended in CI.
//
//   node scripts/check-blog-facts.cjs
//
// What it cannot do, and why the LLM audit still matters: it cannot tell you
// whether £169 is still what Apple charges. It can only tell you that a link is
// dead, that a comparison contradicts our own live prices, or that a post
// points at something that no longer exists. Every one of those was a real
// defect found by hand on 2026-09-08.

const fs = require("fs")
const path = require("path")

const DIR = path.join(__dirname, "../content/blog")
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://dupedeals-gateway.onrender.com"
// Sites that refuse bots but are fine for humans. A 403 from these is not a
// dead link, and treating it as one would train everyone to ignore this check.
const BOT_HOSTILE = ["dyson.co.uk", "idealo.co.uk", "camelcamelcamel.com", "amazon.co.uk", "which.co.uk", "boots.com", "apple.com"]

/**
 * Read one frontmatter value, quoted or not.
 *
 * The CMS at /admin writes frontmatter unquoted, so every regex here that
 * hard-coded `key: "value"` silently read nothing on a post edited there.
 * That produced a title of 0 characters, an excerpt of 0 characters, and
 * seventeen competitor prices reported as never verified, none of which were
 * true. Parse tolerantly instead of assuming one writer's style.
 */
function fmValue(fm, key) {
  const line = fm.match(new RegExp(`^\\s*${key}:\\s*(.*)$`, "m"))
  if (!line) return ""
  return line[1].trim().replace(/^["'](.*)["']$/, "$1").trim()
}

const problems = []
const notes = []

function posts() {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => {
    const src = fs.readFileSync(path.join(DIR, f), "utf8")
    return { slug: f.replace(".md", ""), fm: src.split("---")[1] || "", body: src.split("---").slice(2).join("---") }
  })
}

async function main() {
  const all = posts()
  const slugs = new Set(all.map((p) => p.slug))

  let products = []
  try {
    products = (await (await fetch(`${GATEWAY}/api/products?limit=500`)).json()).products
  } catch (e) {
    notes.push(`could not reach the gateway, price checks skipped: ${e.message}`)
  }
  const byId = Object.fromEntries(products.map((p) => [p.id, p]))

  for (const p of all) {
    // 1. Links to products that no longer exist. A post keeps reading fine
    //    after a product is delisted, so nothing else catches this.
    for (const id of new Set([...p.body.matchAll(/\/product\/(\d+)/g)].map((m) => m[1]))) {
      if (products.length && !byId[id]) problems.push(`${p.slug}: links /product/${id}, which is not in the live catalogue`)
    }

    // 2. Internal links to blog posts that do not exist.
    for (const s of new Set([...p.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((m) => m[1]))) {
      if (!slugs.has(s)) problems.push(`${p.slug}: links /blog/${s}, which has no post`)
    }

    // 3. Our own live price written into prose as a literal, which stops
    //    updating the moment the retailer moves it.
    const linked = [...new Set([...p.body.matchAll(/\]\(\/product\/(\d+)\)/g)].map((m) => m[1]))]
    const literals = [...new Set([...p.body.replace(/\{\{\w+:\d+\}\}/g, "").matchAll(/£([0-9][0-9.,]*)/g)].map((m) => m[1].replace(/[.,]$/, "")))]
    for (const id of linked) {
      if (!byId[id]) continue
      for (const v of literals) {
        if (Math.abs(parseFloat(v.replace(/,/g, "")) - byId[id].salePrice) < 0.01) {
          problems.push(`${p.slug}: £${v} is product ${id}'s live price typed as text, use {{price:${id}}}`)
        }
      }
    }

    // 4. Damage from a botched edit. Twice now, a regex replacing a sentence
    //    has stopped at a full stop inside a URL and left a fragment like
    //    "depending on the retailer.elvie.com/products/elvie-pump)" in the
    //    published text. It reads as gibberish, it went live, and no other
    //    check would catch it.
    const dmg = [
      [/[a-z]\.(?:com|co\.uk|org|net)\/[^\s)]*\)/g, "URL fragment left in prose"],
      [/[a-z]\.[A-Z][a-z]/g, "missing space after a full stop"],
      [/\S\s\)/g, "stray closing bracket"],
    ]
    for (const [re, label] of dmg) {
      for (const m of p.body.matchAll(re)) {
        const ctx = p.body.slice(Math.max(0, m.index - 35), m.index + 35).replace(/\n/g, " ")
        if (label === "URL fragment left in prose" && /\]\(/.test(ctx)) continue
        problems.push(`${p.slug}: ${label} - "...${ctx}..."`)
      }
    }

    // 5. Competitor prices older than the review window.
    const checked = fmValue(p.fm, "pricesCheckedAt")
    if (literals.length) {
      if (!checked) notes.push(`${p.slug}: ${literals.length} competitor price(s) never verified`)
      else {
        const age = Math.round((Date.now() - new Date(checked)) / 864e5)
        if (age > 30) notes.push(`${p.slug}: competitor prices last checked ${age} days ago`)
      }
    }
  }

  // 5. Outbound links.
  const links = new Set()
  all.forEach((p) => [...p.body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].forEach((m) => {
    if (!m[1].includes("productserve")) links.add(m[1])
  }))
  for (const url of links) {
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0 Safari/537.36" }, signal: AbortSignal.timeout(25000) })
      if (res.ok) continue
      const hostile = BOT_HOSTILE.some((h) => url.includes(h))
      // 403 and 503 both show up as bot protection: Dyson and idealo return
      // 403, Apple's store returns 503. Neither is a broken link.
      if ((res.status === 403 || res.status === 503) && hostile) notes.push(`${url} returns ${res.status} to bots (expected for this host, not a dead link)`)
      else problems.push(`dead link (${res.status}): ${url}`)
    } catch (e) {
      problems.push(`unreachable: ${url} (${e.message})`)
    }
  }

  if (notes.length) {
    console.log("NOTES (worth a look, not failures)")
    notes.forEach((n) => console.log("  " + n))
    console.log()
  }
  if (problems.length) {
    console.log("PROBLEMS")
    problems.forEach((p) => console.log("  " + p))
    console.log(`\n${problems.length} problem(s)`)
    process.exit(1)
  }
  console.log(`No factual discrepancies across ${all.length} posts and ${links.size} outbound links.`)
}

main()
