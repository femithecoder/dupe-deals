// Prepares a post's prose for a human grammar check.
//
//   npm run proofread -- cheap-i-size-car-seat-uk-2026
//
// Grammarly Desktop cannot be driven from a script: no CLI, no AppleScript
// dictionary, and its URL schemes are for its own auth. It works by injecting
// into text fields, so a person has to paste and read. What a script CAN do is
// remove the friction, which is stripping the markdown that would otherwise
// fill the report with false positives about link syntax and price tokens.
//
// Puts clean prose on the clipboard and writes a .txt beside it. Paste into
// Grammarly, TextEdit, or anything Grammarly watches.

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const DIR = path.join(__dirname, "../content/blog")
const slug = process.argv[2]

if (!slug) {
  const posts = fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(".md", ""))
  console.log("usage: npm run proofread -- <slug>\n\nposts:")
  posts.forEach((p) => console.log("  " + p))
  process.exit(1)
}

const file = path.join(DIR, `${slug}.md`)
if (!fs.existsSync(file)) {
  console.error(`no such post: ${slug}`)
  process.exit(1)
}

const src = fs.readFileSync(file, "utf8")
const fm = src.split("---")[1] || ""
const body = src.split("---").slice(2).join("---")

// Frontmatter prose is published too: the excerpt is the meta description, so
// it gets checked alongside the body rather than skipped.
const title = (fm.match(/title: "(.*)"/) || [])[1] || ""
const excerpt = (fm.match(/excerpt: "(.*)"/) || [])[1] || ""

const prose = body
  .replace(/!\[[^\]]*\]\([^)]*\)/g, "")            // images
  .replace(/^\|.*\|$/gm, "")                        // tables: not prose, and they wreck sentence parsing
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")          // links keep their text, lose the URL
  .replace(/\{\{\w+:\d+\}\}/g, "£99")               // price tokens become a plausible price
  // Headings keep their words but gain a full stop, so they do not run into
  // the paragraph below them. Grammarly parses sentences better for it, and
  // the stats below stop reporting a heading plus a paragraph as one sentence.
  .replace(/^#{1,6}\s+(.*?)[.:]?\s*$/gm, "$1.")
  .replace(/\*\*/g, "")                             // bold markers
  // Bullets become sentences ending in a full stop. Without this a list runs
  // into the next paragraph as one 75-word "sentence", which wrecks the stats
  // and gives Grammarly worse sentence boundaries too.
  .replace(/^\s*[-*]\s+(.*)$/gm, (_, t) => (/[.!?]$/.test(t.trim()) ? t.trim() : t.trim() + "."))
  .replace(/\n{3,}/g, "\n\n")
  .trim()

const out = [`TITLE: ${title}`, `EXCERPT: ${excerpt}`, "", prose].join("\n")
const dest = path.join(require("os").tmpdir(), `${slug}.proofread.txt`)
fs.writeFileSync(dest, out)

try {
  execSync("pbcopy", { input: out })
  console.log("Copied to clipboard.")
} catch {
  console.log("(clipboard unavailable)")
}

const words = prose.split(/\s+/).length
const sentences = prose.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length > 2)
const longest = sentences.reduce((a, b) => (b.split(/\s+/).length > a.split(/\s+/).length ? b : a), "")

console.log(`Saved to ${dest}`)
console.log(`\n${words} words, ${sentences.length} sentences, longest ${longest.split(/\s+/).length} words:`)
console.log(`  "${longest.slice(0, 110)}..."`)
console.log("\nPaste into Grammarly Desktop, or: open -e " + dest)
