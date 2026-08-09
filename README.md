# DupeDeals

_Last updated: 2026-08-02_

A UK deals and recommendations site. Two-part pitch to visitors, per product pair:

1. If the premium original currently has a genuine discount, buy the real thing while it's cheaper.
2. If it doesn't, here's a cheaper alternative ("dupe") that does the same job instead.

Monetized primarily via affiliate commission on the dupe/alternative side (the "catch": naming a premium brand as the comparison point doesn't require an affiliate relationship with it, that's just copy). Mode 1 (discount alerts on the premium original itself) is an optional extra for specific pairs where you also have an affiliate link on the premium side, not a requirement for every listing.

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
- **First real live product**: Nourish London Protect Skincare Essentials Starter Kit (£32, dupe for SkinCeuticals C E Ferulic), real Awin affiliate link, real Trustpilot rating (4.4, 16 reviews). Added to both the backend seed data and the frontend mock-data fallback. Image is a generic stock photo, not their real product photo, their site T&Cs require written permission for content reproduction that the Awin partnership doesn't automatically grant.
- Vercel Analytics wired up (`@vercel/analytics`), plus custom click-tracking on every "View deal" affiliate button (`ViewDealButton.tsx`) so pageviews vs. actual affiliate clicks can be compared. Only activates once deployed on Vercel.
- Branded favicon and Apple touch icon (`app/icon.tsx`, `app/apple-icon.tsx`), replacing the default create-next-app placeholder.
- **11 real products added to Electronics & Tech** (catalog now 24 products total), sourced from a curated 20-item shortlist pulled from Quzo UK's Awin datafeed. 9 of the 20 were out of stock, verified against both the raw feed's `is_for_sale` field and the live Quzo site before excluding them. Real Awin affiliate links, real product images (via Awin's own datafeed image CDN, licensed for affiliate use, not scraped). No fabricated ratings, since the feed has none, `reviewCount: 0` and the rating UI now hides itself gracefully when there's no review data (`ProductCard.tsx`, product detail page). Mix of genuine dupes (Soundcore/Eufy/TP-Link/Logitech vs. AirPods/Ring/Roomba/SteelSeries) and mode-1 discount picks (Bose QuietComfort Earbuds, both TVs, no forced "dupe for" label where none applies). Two are clearly labelled premium refurbished laptops (ThinkPad E14, EliteBook 840 G6), not new. Speakers category from the original shortlist was a total loss, all 3 picks out of stock, still needs fresh picks.
- **Seller trust badge** (`lib/merchant-trust.ts`): Quzo UK has a real Trustpilot rating (4.0, 740 reviews), but that's seller/checkout reputation, not a product rating, so it's shown as a separate "Sold by Quzo UK ★4.0 (740 seller reviews on Trustpilot)" line rather than reused as the product's own star rating.

## Known architecture gap (next big build)

The product data model only tracks the cheap "dupe" side. The premium original (`dupe_for` field) is just a text label, no tracked price or affiliate link of its own. Need: a second tracked product per pair (own price history + affiliate link) plus logic to decide which of the two pitches to show.

## Affiliate program hunting

Going category by category. Priority is the dupe/alternative side (needs a real affiliate link), premium originals are just named in copy unless a specific pair also needs discount-alert monetization.

### Beauty & Skincare (in progress)

- Already applied: Boots, Superdrug, LookFantastic, ASOS
- **Approved & live**: Nourish London (first real product added, see above)
- Recommended to join: Latest in Beauty (strong fit), FUL (haircare, fills a gap), Scar Erase (scar treatment, frame as "before you pay for a clinic" not a medical-equivalence claim)
- Optional: Scottish Fine Soaps
- Ruled out (wrong category): Let's Swim, Heist, ZipVit, Britt's Superfoods, Intelligent Labs, Curo Skin (it's actually a filtered-showerhead brand, maybe fits Home & Kitchen instead)
- Premium "catch" brands identified so far (no affiliate link needed): SkinCeuticals C E Ferulic (used for both Garnier and now Nourish London), Susanne Kaufmann, Sarah Chapman, Drunk Elephant

### Home & Kitchen, Baby & Kids, Electronics & Tech

Not started yet.

## Not started at all

- Wiring a real price-feed provider (blocked on affiliate network approval, likely Awin)
- Frontend UI to show price history / "price dropped" indicators
- Real affiliate URLs for the remaining 12 mock products (all placeholder `#` in seed data, only Nourish London is real so far)
- Email price-alert signups/accounts.
