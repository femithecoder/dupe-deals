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

// Organisations a reader cannot be assumed to know. The value is what an
// acceptable introduction looks like in the run-up to the first mention.
const ORGS = {
  "Which?": /consumer group|consumers'? association|consumer champion/i,
  "ADAC": /German|Germany|motoring|automobile club/i,
  "Stiftung Warentest": /German|Germany|consumer|testing/i,
  "PriceRunner": /price compar|comparison site|shopping compar/i,
}

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

    // Every product given its own ### section needs a picture under it. The
    // Quooker post shipped with both picks named and priced but neither shown,
    // and nothing caught it, because word count and link count were fine.
    const sections = [...new Set([...p.body.matchAll(/^###\s+\[.*?\]\(\/product\/(\d+)\)/gm)].map((m) => m[1]))]
    const images = (p.body.match(/!\[/g) || []).length
    if (sections.length > images) {
      say(p.file, `${sections.length} product sections but only ${images} image${images === 1 ? "" : "s"}`)
    }
    // An empty alt is worse than no image for a screen reader on a page whose
    // whole job is showing you the product.
    for (const alt of [...p.body.matchAll(/!\[(.*?)\]\(/g)].map((m) => m[1])) {
      if (alt.trim().length < 15) say(p.file, `image alt text too thin: "${alt}"`)
    }

    // Third-party organisations need saying what they are on first mention. A
    // reader who does not already know the name gets nothing from it, and
    // "Which?" is the worst case: a question word ending in a question mark,
    // so dropped in cold it reads as a sentence fragment rather than a body
    // that tests things. It appeared five times across two posts without ever
    // being introduced.
    for (const [org, descriptor] of Object.entries(ORGS)) {
      const first = p.body.indexOf(org)
      if (first === -1) continue
      // Either side counts. "the consumer group Which?" introduces it up
      // front, "Which?, the UK consumer group," does it in apposition, and
      // both read fine.
      const around = p.body.slice(Math.max(0, first - 70), first + org.length + 70)
      if (!descriptor.test(around)) say(p.file, `first mention of ${org} does not say what it is`)
    }
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
    // Six words. Eight missed real templating ("Usually one of three reasons"
    // appeared verbatim in three posts). Five flagged ordinary idioms like
    // "for a fraction of the". Six catches the former without the latter.
    for (let i = 0; i + 6 <= w.length; i++) {
      const g = w.slice(i, i + 6).join(" ")
      if (seen.has(g)) continue
      seen.add(g)
      ;(grams[g] = grams[g] || new Set()).add(p.file)
    }
  }
  // Some repetition is house terminology rather than a tic. "At the best
  // current UK price" is the phrase the playbook asks for when quoting a
  // street price, so it should read the same everywhere.
  // Repetition that is deliberate rather than lazy: house terminology the
  // playbook asks for, ordinary English idioms, and the structural formulas
  // every post is supposed to share (a verdict line, a closing pointer).
  const DELIBERATE = [
    "at the best current uk",
    "the best current uk price",
    "for a fraction of the",
    "a fraction of the price",
    "verdict the pick if you",
    "verdict the better pick if",
    "the pick if you want",
    "the rest of what we",
    "rest of what we track",
  ]
  for (const [g, s] of Object.entries(grams)) {
    if (DELIBERATE.some((d) => g.includes(d))) continue
    if (s.size >= 3) say([...s][0], `phrase repeated in ${s.size} posts: "${g}"`)
  }

  // Competitor prices cannot be tokenised, because we do not sell those
  // products and have no feed for them. They still go stale, and a wrong
  // premium price is worse than a wrong price of ours: the comparison is the
  // whole point of the post. Nothing checked these before, so they aged
  // silently. Warn rather than fail, since going stale is inevitable and the
  // useful thing is knowing which post is due a look.
  // 30 rather than 90. When the sweep on 2026-09-08 re-checked every post,
  // precise competitor figures had gone stale in five of seven, several within
  // weeks of publishing: Apple's AirPods RRP was out by £40, a Dyson V8 by
  // more than £160. Ninety days would have caught none of them in time.
  const STALE_DAYS = 30
  const warnings = []
  for (const p of posts) {
    const literals = [...new Set([...strip(p.body).replace(/\{\{\w+:\d+\}\}/g, "").matchAll(/£[0-9][0-9.,]*/g)].map((m) => m[0]))]
    if (!literals.length) continue
    // Quotes optional: the CMS writes frontmatter unquoted, and requiring them
    // made this read nothing on a CMS-edited post and report every competitor
    // price as never verified. Same fault as in check-blog-facts.cjs.
    const checked = (p.fm.match(/pricesCheckedAt:\s*"?([\d-]+)"?/) || [])[1]
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
