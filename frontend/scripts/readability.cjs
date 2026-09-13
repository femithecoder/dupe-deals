// Measures how hard a post is to read, and flags the habits that make it
// harder. Added 2026-09-13 when the brief became: simplified English, short
// sentences, one idea per sentence, no filler, no AI tells.
//
//   npm run readability            all posts, summary table
//   npm run readability -- <slug>  one post, every offending sentence
const fs = require("fs")
const path = require("path")

const DIR = path.join(__dirname, "../content/blog")

// Strip everything that is not prose: frontmatter, images, tables, headings,
// code, and link URLs (the anchor text stays, because a reader reads it).
function prose(src) {
  return src
    .split("---").slice(2).join("---")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/^\|.*$/gm, " ")
    .replace(/^#{1,6} .*$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|\*|`/g, "")
    // Keep line breaks as sentence boundaries. A bullet list is not one long
    // sentence, and collapsing newlines first made a Pros/Cons block read as a
    // single 78-word monster.
    .split("\n")
    .map((l) => l.replace(/^\s*[-*+]\s+/, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((l) => (/[.!?:]$/.test(l) ? l : l + "."))
    .join(" ")
}

const sentences = (t) =>
  // A sentence can begin with a digit ("1080p ...") or a symbol, so the
  // lookahead cannot require a capital. Without this, two sentences merged
  // and were reported as one long one.
  t.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(£€$])/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 1)

const words = (s) => s.split(/\s+/).filter(Boolean)

// Rough syllable count. Good enough for a grade level, which is itself rough.
function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "")
  if (w.length <= 3) return 1
  const v = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g)
  return v ? v.length : 1
}

// Flesch-Kincaid grade level. UK guidance for public-facing writing is
// broadly "aim for grade 9 or below".
function grade(text) {
  const ss = sentences(text)
  const ws = words(text)
  if (!ss.length || !ws.length) return 0
  const syl = ws.reduce((n, w) => n + syllables(w), 0)
  return 0.39 * (ws.length / ss.length) + 11.8 * (syl / ws.length) - 15.59
}

// Phrases that pad without adding meaning, and the constructions that read as
// machine-written. Each is a regex so word boundaries behave.
const FILLER = [
  /\bit is worth (noting|saying|knowing)\b/gi,
  /\bworth (noting|saying) that\b/gi,
  /\bit is important to\b/gi,
  /\bthe fact that\b/gi,
  /\bin order to\b/gi,
  /\bwhen it comes to\b/gi,
  /\bat the end of the day\b/gi,
  /\bthat said\b/gi,
  /\b(moreover|furthermore|additionally)\b/gi,
  /\ba wide range of\b/gi,
  /\bplays? a (crucial|key|vital) role\b/gi,
  /\bneedless to say\b/gi,
  /\bin terms of\b/gi,
  /\bthere (is|are) (a|no) (number|variety) of\b/gi,
  /\bwhat this means is\b/gi,
  /\bthe reality is\b/gi,
  /\bsuffice (it )?to say\b/gi,
]

const SLOP = [
  /\bnot just [^.,;]{1,40}, but\b/gi,
  /\b(isn't|is not) just about\b/gi,
  /\bdelve\b/gi,
  /\b(landscape|ecosystem) of\b/gi,
  /\ba testament to\b/gi,
  /\bnavigat(e|ing) the\b/gi,
  // "harness" only as the verb. A five-point harness is the real name of
  // the part on a car seat, and flagging it was a false positive.
  /\b(robust|seamless|leverage|elevate|unlock)\b/gi,
  /\bharness(es|ing|ed)?\s+(the|its|their)\b/gi,
  /\bgame[- ]chang(er|ing)\b/gi,
  /\bin today's\b/gi,
  // Only the opener. "Whether you're a beginner or a pro, this product..."
  // is slop; "Decide first whether you are gate-checking or carrying on"
  // is a useful sentence and was being flagged for the same shape.
  /(^|[.!?]\s+)Whether you('re| are) [^.,;]{1,40} or\b/g,
  /\bthe honest (answer|truth) is\b/gi,
  /\bmore than just\b/gi,
]

function scan(text, patterns) {
  const hits = []
  for (const re of patterns) for (const m of text.matchAll(re)) hits.push(m[0].toLowerCase())
  return hits
}

function report(file, src, verbose) {
  const t = prose(src)
  const ss = sentences(t)
  const ws = words(t)
  const long = ss.filter((s) => words(s).length > 25)
  const veryLong = ss.filter((s) => words(s).length > 35)
  const filler = scan(t, FILLER)
  const slop = scan(t, SLOP)
  const r = {
    file,
    words: ws.length,
    sentences: ss.length,
    avg: ws.length / ss.length,
    longPct: (long.length / ss.length) * 100,
    veryLong: veryLong.length,
    grade: grade(t),
    filler: filler.length,
    slop: slop.length,
  }
  if (verbose) {
    console.log(`\n${file}`)
    console.log(`  ${r.words} words, ${r.sentences} sentences, avg ${r.avg.toFixed(1)}, grade ${r.grade.toFixed(1)}`)
    if (long.length) {
      console.log(`\n  ${long.length} sentence(s) over 25 words:`)
      for (const s of long.sort((a, b) => words(b).length - words(a).length)) {
        console.log(`\n   [${words(s).length}w] ${s}`)
      }
    }
    if (filler.length) console.log(`\n  filler: ${[...new Set(filler)].join(", ")}`)
    if (slop.length) console.log(`  slop:   ${[...new Set(slop)].join(", ")}`)
  }
  return r
}

const arg = process.argv[2]
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"))

if (arg) {
  const f = files.find((x) => x.includes(arg))
  if (!f) { console.error(`no post matching "${arg}"`); process.exit(1) }
  report(f.replace(".md", ""), fs.readFileSync(path.join(DIR, f), "utf8"), true)
  process.exit(0)
}

const rows = files.map((f) => report(f.replace(".md", ""), fs.readFileSync(path.join(DIR, f), "utf8"), false))
rows.sort((a, b) => b.grade - a.grade)

console.log("post".padEnd(46) + "avg  >25w   >35w  grade  fill  slop")
for (const r of rows) {
  console.log(
    r.file.slice(0, 44).padEnd(46) +
      r.avg.toFixed(1).padStart(4) +
      `${r.longPct.toFixed(0)}%`.padStart(6) +
      String(r.veryLong).padStart(7) +
      r.grade.toFixed(1).padStart(7) +
      String(r.filler).padStart(6) +
      String(r.slop).padStart(6)
  )
}
const t = rows.reduce((a, r) => ({ w: a.w + r.words, s: a.s + r.sentences, g: a.g + r.grade, f: a.f + r.filler, sl: a.sl + r.slop }), { w: 0, s: 0, g: 0, f: 0, sl: 0 })
console.log("\n" + `${rows.length} posts, ${t.w} words`.padEnd(46) + (t.w / t.s).toFixed(1).padStart(4) + "".padStart(13) + (t.g / rows.length).toFixed(1).padStart(7) + String(t.f).padStart(6) + String(t.sl).padStart(6))
