# DupeDeals blog playbook

How we write posts that rank and stay honest. Follow this for every new or edited post.
Last reviewed 2026-09-03.

## The 2026 reality (why these rules exist)

Google ran an April 2026 update that hit "best of" listicles and comparison content hard.
Thin, self-promotional, or aggregator-style lists lost large chunks of visibility. What
survives is honest, methodology-driven content that shows real evaluation. We can't out-test
a lab site like RTINGS or Vacuum Wars, so our defensible edge is **price methodology, honesty
about what's a dupe vs the real thing on sale, and genuine UK availability**, not pretending
to bench-test hardware.

## Rules to follow

1. **Never rank a product #1 without justifying it.** Say plainly whether each pick is a dupe
   or the real brand on a discount, and why. This honesty is now a ranking asset.
2. **Show your methodology.** Keep a "How we priced this" or "How we chose" section in every
   post. State that prices are checked against live retailer data, not RRPs on a box.
3. **Name the premium originals honestly** (Dyson, Ninja, Elvie, Bose, etc.) and cite their
   real current UK street price, not just RRP. Admitting competitors exist builds trust.
4. **No fake freshness.** Never year-swap a title with no real update. Use live-price tokens
   (below) so the prices are genuinely current, which is real freshness competitors fake.
5. **Depth and assets.** Aim for 1,000+ words, a comparison table, an FAQ section, and product
   imagery.
6. **Internal linking (SEO).** Every post needs at least 4-5 internal links: the product
   page(s) it covers, its category page, and 2+ genuinely related posts (link posts to each
   other, especially within the same category). Use descriptive anchor text, not "click here".
   Spread contextual links through the body, not only the closing paragraph. Add a link back
   from older related posts to each new one so linking stays two-way.
7. **Disclosure.** Keep the affiliate relationship clear (site-wide disclosure already exists).

## Live prices: never hardcode our own product prices

Posts are plain markdown resolved server-side (see `frontend/lib/live-price.ts`). Use tokens so
a price never goes stale:

- `{{price:ID}}` live sale price, `{{rrp:ID}}` was/RRP, `{{save:ID}}` saving, `{{discount:ID}}` percent off.
- External competitor prices (Dyson, Apple, etc.) stay as plain text, they aren't our products.
- Cross-product comparisons ("£65 more than X", "18% cheaper") have no token, so phrase them
  softly ("close to double", "undercuts that") or they go stale.
- Do NOT put prices in the frontmatter excerpt, it is not token-resolved.

## Keyword patterns that rank

Match the word to the category. "dupe" ranks for fashion, beauty, and fragrance. Tech and home
rank on "alternative", "best budget", and "vs".

| Format | Template | Examples from our catalog |
|--------|----------|---------------------------|
| Comparison | `[premium] vs [budget] UK` / `[premium] alternative UK` | Cosori vs Ninja Air Fryer UK; Hoover HF1 Max vs Dyson; MOMMED vs Elvie |
| "Best" | `best budget [category] UK 2026` / `best cheap [category] with [feature]` | Best budget cordless vacuum UK; best cheap wearable breast pump UK; best budget baby monitor UK |
| Listicle | `[N] [category] dupes/alternatives that beat [big brand]` | 9 Baby & Kids dupes that beat the big brands; Home & Kitchen version of the tech roundup |
| Beauty (dupe works) | `[brand] dupe UK` | SkinCeuticals C E Ferulic dupe UK; Drunk Elephant Protini dupe UK |

Validate volumes in Google Keyword Planner (free) or Ahrefs/SEMrush before committing effort.
The templates above reflect what is currently ranking, not guaranteed volume.

## Post structure (the template our posts already use)

1. Frontmatter: `title`, `excerpt` (no exact prices), `date`, `author`, `category`, `coverImage`.
2. Intro that names the real price to beat, not the RRP.
3. "Why people look for an alternative" framing section.
4. Each pick as an H3 with `[Name](/product/ID): {{price:ID}} (was {{rrp:ID}})`, specs, honest
   pros/cons, and a one-line verdict.
5. A quick-comparison table (use tokens for our prices).
6. An FAQ section (targets "people also ask").
7. "How we priced this / chose" methodology section.
8. A bottom-line summary and internal links to related posts plus the category page.
