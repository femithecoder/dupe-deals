# DupeDeals

_Last updated: 2026-08-02_

A UK deals and recommendations site. Two-part pitch to visitors, per product pair:

1. If the premium original currently has a genuine discount, buy the real thing while it's cheaper.
2. If it doesn't, here's a cheaper alternative ("dupe") that does the same job instead.

Monetized via affiliate commission from **both sides** of every comparison, the premium original's retailer and the dupe's retailer, since either can convert.

## Structure

- `frontend/` — Next.js app (pages, chat bot, SEO)
- `services/product-service/` — Express + SQLite backend serving product data, includes the price-tracking pipeline
- `gateway/` — (not yet reviewed in these sessions)

## Built so far

- Info/legal pages: About, How It Works, Privacy, Terms, Affiliate Disclosure, Submit a Deal
- Dede, the free rule-based FAQ chatbot with human-escalation via email
- SEO: sitemap.xml, robots.txt, per-page metadata/canonical URLs, JSON-LD structured data
- Default branded OG/Twitter share image (generated via `next/og`)
- Real price-tracking pipeline (`services/product-service/pricing/`): runs every 30 min automatically, pluggable data-source interface, currently using a **simulated** provider (not real retailer data yet), logs price history, detects drops

## Known architecture gap (next big build)

The product data model only tracks the cheap "dupe" side. The premium original (`dupe_for` field) is just a text label, no tracked price or affiliate link of its own. Need: a second tracked product per pair (own price history + affiliate link) plus logic to decide which of the two pitches to show.

## Affiliate program hunting

Going category by category, applying to **both** the premium original's program and the dupe's program per pair.

### Beauty & Skincare (in progress)

- Already applied: Boots, Superdrug, LookFantastic, ASOS
- Recommended to join: Latest in Beauty (strong fit), Sarah Chapman, Susanne Kaufmann (premium originals)
- Optional: Scottish Fine Soaps
- Ruled out (wrong category): Let's Swim, Heist, ZipVit, Britt's Superfoods, Intelligent Labs, Curo Skin (it's actually a filtered-showerhead brand, maybe fits Home & Kitchen instead)
- Unclear, need more info: Tealerlab UK

### Home & Kitchen, Baby & Kids, Electronics & Tech

Not started yet.

## Not started at all

- Wiring a real price-feed provider (blocked on affiliate network approval, likely Awin)
- Frontend UI to show price history / "price dropped" indicators
- Real affiliate URLs (all placeholder `#` in seed data right now)
- Email price-alert signups/accounts
