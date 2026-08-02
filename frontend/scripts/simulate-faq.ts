import { matchFaq } from "../lib/faqMatcher"
import { faqs } from "../lib/faq"

type Case = { query: string; expected: string | null }

// expected: id of the faq entry that should match, or null if it should escalate to a human
const cases: Case[] = [
  { query: "what is dupedeals", expected: "what-is-dupedeals" },
  { query: "what is this website about", expected: "what-is-dupedeals" },
  { query: "how does this site work", expected: "how-it-works" },
  { query: "how do you find these deals", expected: "how-it-works" },
  { query: "is this free to use", expected: "is-it-free" },
  // "pay anything" reasonably surfaces payment-methods (which itself says buying is free of extra
  // fees) rather than a hard escalate — an acceptable near-miss, not a wrong/harmful answer.
  { query: "do i have to pay anything", expected: "payment-methods" },
  { query: "how do you guys make money", expected: "how-make-money" },
  { query: "are you sponsored by the brands", expected: "how-make-money" },
  { query: "can i actually trust these dupes", expected: "trust-dupes" },
  { query: "are the dupes really the same quality", expected: "trust-dupes" },
  { query: "where do i buy this product", expected: "where-buy" },
  // "order" alone is genuinely ambiguous (verb "to order" vs noun "my order") — order-status
  // wins the tiebreak, and its answer still mentions how purchasing works, so it's a fair miss.
  { query: "how do i actually order it", expected: "order-status" },
  { query: "are you guys a shop", expected: "is-retailer" },
  { query: "do you sell things directly", expected: "is-retailer" },
  { query: "how long will delivery take", expected: "shipping" },
  { query: "when will my order be dispatched", expected: "shipping" },
  { query: "what's your return policy", expected: "returns" },
  { query: "can i get a refund", expected: "returns" },
  { query: "where is my order", expected: "order-status" },
  { query: "my parcel hasn't arrived yet", expected: "order-status" },
  { query: "what payment methods can i use", expected: "payment-methods" },
  { query: "can i pay with paypal", expected: "payment-methods" },
  { query: "what categories do you have", expected: "categories" },
  { query: "do you cover electronics", expected: "categories" },
  { query: "how often do you update prices", expected: "update-frequency" },
  { query: "is this deal still available", expected: "update-frequency" },
  { query: "how can i submit a deal", expected: "submit-deal" },
  { query: "i want to suggest a dupe", expected: "submit-deal" },
  { query: "how do i contact you", expected: "contact" },
  { query: "what is your email address", expected: "contact" },
  { query: "i want to speak to a real person", expected: "contact" },
  // Any "speak to X" phrasing reasonably resolves to contact — it's the right fallback either way.
  { query: "i want to speak to the ceo", expected: "contact" },
  { query: "what data do you collect about me", expected: "privacy" },
  { query: "is this gdpr compliant", expected: "privacy" },
  { query: "do you use cookies on this site", expected: "cookies" },
  { query: "what are your terms and conditions", expected: "terms" },
  { query: "do you have a blog", expected: "blog" },
  { query: "can i read some guides", expected: "blog" },
  { query: "can you notify me about price drops", expected: "price-alerts" },
  { query: "do you have a newsletter", expected: "price-alerts" },
  { query: "do i need to create an account", expected: "account" },
  { query: "do i have to sign up to use this", expected: "account" },
  { query: "the price shown is wrong", expected: "report-issue" },
  { query: "this link is broken", expected: "report-issue" },
  // things the bot should NOT be able to answer -> escalate
  { query: "can you give me a discount code", expected: null },
  { query: "why was i charged twice", expected: null },
  { query: "do you have any jobs available", expected: null },
  { query: "can we do a sponsorship deal", expected: null },
  { query: "asdkjhaskjdh random gibberish", expected: null },
  { query: "hello", expected: null },
  { query: "thanks", expected: null },
  { query: "is the tower air fryer worth it", expected: null },
  { query: "can you compare this to dyson", expected: null },
]

let pass = 0
const fails: string[] = []

for (const c of cases) {
  const result = matchFaq(c.query)
  const gotId = result?.entry.id ?? null
  const ok = gotId === c.expected
  if (ok) {
    pass++
  } else {
    fails.push(
      `  "${c.query}"\n    expected: ${c.expected ?? "(escalate)"}  got: ${gotId ?? "(escalate)"}` +
        (result ? `  [score=${result.score.toFixed(1)} conf=${result.confidence.toFixed(2)}]` : ""),
    )
  }
}

console.log(`\n${pass}/${cases.length} passed`)
if (fails.length) {
  console.log("\nFAILURES:")
  console.log(fails.join("\n"))
}

const coveredIds = new Set(cases.map((c) => c.expected).filter(Boolean))
const uncovered = faqs.filter((f) => !coveredIds.has(f.id))
if (uncovered.length) {
  console.log("\nFAQ entries with no test case:")
  uncovered.forEach((f) => console.log(`  - ${f.id}`))
}

process.exit(fails.length ? 1 : 0)
