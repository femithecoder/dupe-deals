# DupeDeals

_Last updated: 2026-08-19_

A UK deals and recommendations site. Two-part pitch to visitors, per product pair:

1. If the premium original currently has a genuine discount, buy the real thing while it's cheaper.
2. If it doesn't, here's a cheaper alternative ("dupe") that does the same job instead.

Monetized primarily via affiliate commission on the dupe/alternative side (the "catch": naming a premium brand as the comparison point doesn't require an affiliate relationship with it, that's just copy). Mode 1 (discount alerts on the premium original itself) is an optional extra for specific pairs where you also have an affiliate link on the premium side, not a requirement for every listing.

## Structure

- `frontend/` — Next.js app (pages, chat bot, SEO)
- `services/product-service/` — Express + Postgres backend serving product data, includes the price-tracking pipeline
- `gateway/` — thin Express proxy in front of product-service, adds the `/api` prefix the frontend expects (`frontend/lib/api.ts` calls `/api/products/...`, gateway strips `/api` and forwards to product-service's `/products/...`)
- `gateway/` — (not yet reviewed in these sessions)

## Built so far

- Info/legal pages: About, How It Works, Privacy, Terms, Affiliate Disclosure, Submit a Deal
- Dede, the free rule-based FAQ chatbot with human-escalation via email
- SEO: sitemap.xml, robots.txt, per-page metadata/canonical URLs, JSON-LD structured data
- Default branded OG/Twitter share image (generated via `next/og`)
- Price-tracking pipeline (`services/product-service/pricing/`): runs once a day automatically (`PRICE_CHECK_CRON`, default `0 6 * * *`), pluggable data-source interface. Two providers: `simulated` (random, dev default) and `awin-datafeed` (real, set `PRICE_PROVIDER=awin` + `AWIN_API_KEY`), which pulls the actual Quzo UK Awin datafeed (feed 42863) and matches products by the `p=` product ID already embedded in their stored affiliate links. Products from merchants with no feed wired up (Nourish London, the 9 mock `#` products) are left unchanged rather than guessed. A failure on one product (bad feed row, network blip) no longer aborts the whole run, it's logged and skipped. Logs price history, detects drops.
- **First real live product**: Nourish London Protect Skincare Essentials Starter Kit (£32, dupe for SkinCeuticals C E Ferulic), real Awin affiliate link, real Trustpilot rating (4.4, 16 reviews). Added to both the backend seed data and the frontend mock-data fallback. Image is a generic stock photo, not their real product photo, their site T&Cs require written permission for content reproduction that the Awin partnership doesn't automatically grant.
- Vercel Analytics wired up (`@vercel/analytics`), plus custom click-tracking on every "View deal" affiliate button (`ViewDealButton.tsx`) so pageviews vs. actual affiliate clicks can be compared. Only activates once deployed on Vercel.
- Branded favicon and Apple touch icon (`app/icon.tsx`, `app/apple-icon.tsx`), replacing the default create-next-app placeholder.
- **11 real products added to Electronics & Tech**, sourced from a curated 20-item shortlist pulled from Quzo UK's Awin datafeed. 9 of the 20 were out of stock, verified against both the raw feed's `is_for_sale` field and the live Quzo site before excluding them. Real Awin affiliate links, real product images (via Awin's own datafeed image CDN, licensed for affiliate use, not scraped). No fabricated ratings, since the feed has none, `reviewCount: 0` and the rating UI now hides itself gracefully when there's no review data (`ProductCard.tsx`, product detail page). Mix of genuine dupes (Soundcore/Eufy/TP-Link/Logitech vs. AirPods/Ring/Roomba/SteelSeries) and mode-1 discount picks (Bose QuietComfort Earbuds, both TVs, no forced "dupe for" label where none applies). Two are clearly labelled premium refurbished laptops (ThinkPad E14, EliteBook 840 G6), not new. Speakers category from the original shortlist was a total loss, all 3 picks out of stock, still needs fresh picks.
- **Removed the 3 original mock Electronics & Tech products** (Soundcore Q30, Nothing Ear (2), Xiaomi Redmi Note 13, all placeholder `#` affiliate links) now that real products exist for the category. Catalog is 21 products total: 9 mock (Beauty, Baby & Kids, Home & Kitchen, not yet replaced with real products/affiliates), 1 real Nourish London, 11 real Quzo UK.
- Blog post covering the 11 real Quzo products (`content/blog/tech-dupes-and-deals-2026.md`), every comparison backed by a researched, current UK price for the premium original, not just the pitch from the original shortlist. Corrected course where research didn't hold up (e.g. AirPods Pro 2 is discontinued and heavily discounted now, so Liberty 5 Pro's fairer comparison is Bose, not AirPods). Real internal product links, external citation links (nofollow, new tab) for every factual claim, and real product photos with descriptive alt text.
- **Removed the original 2 blog posts** (La Mer dupes, Pampers vs own-brand nappies), neither tied to any real product on the site. Most of the specific SKUs they named (Neutrogena Hydro Boost, Olay Regenerist, Simple Kind to Skin, Lidl Toujours, Asda Little Angels) don't exist in the catalog at all, and the ones that do (CeraVe, Aldi Mamia) are still unmonetized mock data with zero internal links. Below the bar the tech post now sets. The blog currently has just the one real post.
- **Seller trust badge** (`lib/merchant-trust.ts`): Quzo UK has a real Trustpilot rating (4.0, 740 reviews), but that's seller/checkout reputation, not a product rating, so it's shown as a separate "Sold by Quzo UK ★4.0 (740 seller reviews on Trustpilot)" line rather than reused as the product's own star rating.
- **Manual affiliate linking, not waiting on more Awin approvals**: applied the same approach used for Nourish London's one product to two more accepted-but-feedless merchants. Discovered Awin's `cread.php` deep-link format (`awinmid` + shared `awinaffid=3013053` + `ued=<url-encoded destination>`) works for any merchant regardless of whether they publish a structured datafeed — traced it from the existing Nourish London `tidd.ly` link's redirect chain, which also revealed their real domain (`nourishskinrange.com`) and Awin merchant ID (81819). BrickZoneHub's merchant ID (121692) came from the user's own Awin dashboard. Every new link built this way and spot-checked end-to-end (curl through the redirect to the final product page) before use.
- **BrickZoneHub (LEGO display frames) evaluated and rejected this round**: checked 5 of their listed bestsellers/new-arrivals directly on their live site, all 5 were sold out. Adding "Buy now" links for products that can't actually be bought would hurt trust more than leaving the slot unfilled, so 0 products added. Also: their Trustpilot rating is too thin/inconsistent across sources (3.2/5 reviews vs 3.5/2 reviews) to cite as a verified merchant trust badge.
- **Aeternum (longevity supplements) skipped this round** at the user's call: doesn't fit any existing category (ingestible supplements aren't skincare/makeup), their Awin datafeed prices in USD not GBP, and the one product manually spot-checked in GBP was backordered.
- **15 real products added**: 5 Nourish London (Beauty & Skincare, real prices/stock verified live, generic stock photos per their content-reuse restriction) + 10 Quzo UK (Electronics & Tech: speakers, smartwatch/fitness tracker, mechanical keyboard, 4K monitor, webcam, power bank, earbuds — real Quzo CDN images pulled directly from live product pages since no datafeed access for these specific SKUs). 3 honestly-researched dupe comparisons using real current UK prices (Samsung Galaxy Fit3 vs Fitbit Charge 6, Logitech G413 vs Razer BlackWidow V4 X at Quzo's own £136.89, Nothing Ear (a) vs AirPods 4), rest left `dupeFor: undefined` rather than forcing a weak comparison. Several Nourish products show 0% discount (`originalPrice === salePrice`) because no "was" price was found live — left honest rather than fabricated.
- **Fixed a real image bug found while adding the above**: the 10 new Quzo images use `assets.media-quzo.co.uk` directly (their live-site CDN, not the `images2.productserve.com` Awin feed-proxy the original 11 products use), which wasn't in `next.config.ts`'s image `remotePatterns` allowlist — would have 404'd on every one of the new product images. Added the domain to the allowlist.
- **Removed the 3 remaining mock Beauty & Skincare products** (CeraVe, The Ordinary, Garnier — all placeholder `#` links) now that the category has 6 real products. Catalog is 33 products total: 6 mock (Baby & Kids ×3, Home & Kitchen ×3 — no accepted affiliate program fits either yet), 6 real Nourish London, 21 real Quzo UK.
- **4 new blog posts, restructured around real search topics rather than our own product groupings** (course-corrected mid-write at the user's direction): keyword-checked each topic first (`fitbit-charge-6-alternative-uk-2026.md`, `best-budget-mechanical-keyboard-uk-2026.md`, `niacinamide-moisturiser-oily-skin-uk-2026.md`, `cheap-airpods-alternative-anc-uk-2026.md`) against real competing search results before writing, rather than inventing our own thematic angle and hoping it matches what people search. Confirmed real demand for all four (e.g. the Logitech G413 is already named in independent "best budget mechanical keyboard" roundups). Targeted 1,000+ words per post to match researched SEO norms for comparison/review content (product reviews cluster around 1,000–1,800 words; our new posts land ~750–950 excluding frontmatter) — added FAQ sections and spec-comparison tables as genuine substance, not padding. Every external citation and internal product link spot-checked to actually resolve (one broken cover-image Unsplash ID caught and swapped). Blog is now 5 posts total.
- **Replaced all 6 Nourish London product images with their real logo** (`frontend/public/images/nourish-london-logo.png`), not generic Unsplash stock photos. Nourish London isn't responding and the user wanted the stock photos gone ASAP without waiting on a new merchant relationship — their affiliate terms permit logo use even though product-photo reproduction isn't granted. Pulled the real logo asset from their own Shopify CDN, trimmed and re-composited it onto a true square canvas locally (their source logo is a wide ~2.7:1 wordmark; the product grid/detail views use a hard `aspect-square` container with `object-cover`, so dropping the wide logo in directly would have cropped it). Hosted as a local project asset under `public/`, not a remote URL, so it doesn't depend on Nourish's or any third party's CDN staying up, and needs no `next.config.ts` allowlist entry. Also swapped the one blog post that had a product-captioned stock photo of a Nourish item to the same logo, for the same reason.

## Known architecture gap (next big build)

The product data model only tracks the cheap "dupe" side. The premium original (`dupe_for` field) is just a text label, no tracked price or affiliate link of its own. Need: a second tracked product per pair (own price history + affiliate link) plus logic to decide which of the two pitches to show.

## Affiliate program hunting

Going category by category. Priority is the dupe/alternative side (needs a real affiliate link), premium originals are just named in copy unless a specific pair also needs discount-alert monetization.

### Beauty & Skincare (in progress)

- Already applied: Boots, Superdrug, LookFantastic, ASOS
- **Approved & live**: Nourish London (6 real products now, see above)
- Recommended to join: Latest in Beauty (strong fit), FUL (haircare, fills a gap), Scar Erase (scar treatment, frame as "before you pay for a clinic" not a medical-equivalence claim)
- Optional: Scottish Fine Soaps
- Ruled out (wrong category): Let's Swim, Heist, ZipVit, Britt's Superfoods, Intelligent Labs, Curo Skin (it's actually a filtered-showerhead brand, maybe fits Home & Kitchen instead)
- Premium "catch" brands identified so far (no affiliate link needed): SkinCeuticals C E Ferulic (used for both Garnier and now Nourish London), Susanne Kaufmann, Sarah Chapman, Drunk Elephant (now actually used, see Argan Skin Renew Moisturiser)

### Home & Kitchen, Baby & Kids

- **Approved, evaluated, not used**: BrickZoneHub (LEGO display frames/cases) — natural fit is Home & Kitchen (decor), not Baby & Kids (adult collector product, not a kids' toy), but entire checked catalog was sold out. Re-check periodically in case stock returns.
- Nothing fits Baby & Kids yet from any accepted program.

### Electronics & Tech

21 real products now (11 Quzo from the original push + 10 more). Speakers gap from the original shortlist filled (Creative Pebble X, Creative Stage Air V2, Genius SW-2.1 1850BT).

### Other accepted programs, not yet evaluated

- **Aeternum** (longevity supplements) — has an Awin datafeed (merchant ID 82371) but prices in USD, no category fit yet, skipped this round (see above).
- **Golden Maple** and **EverLeakProof US** — accepted, not yet researched. EverLeakProof's "US" naming may mean the same USD-pricing problem as Aeternum; check before assuming a GBP feed.

## Not started at all

- Deploying `gateway` + `product-service` to Render (`render.yaml` at repo root is ready, includes a free Postgres database) and pointing `NEXT_PUBLIC_GATEWAY_URL` at the **gateway's** URL on Vercel. Right now the live frontend reads only from the static `frontend/lib/mock-data.ts`, confirmed by checking the live site's network requests, so the price tracker (however good the data) doesn't reach a single visitor yet.
- `AWIN_API_KEY` / `PRICE_PROVIDER=awin` aren't set anywhere yet, so the real provider is wired but unused until credentials exist.
- Database switched from SQLite to Postgres (`services/product-service/db.js` uses `pg`) since Render's free tier doesn't support persistent disks, only paid plans do. Migration tested locally against a throwaway Docker Postgres: seed, every route, and a real price-check run all verified working.
- Nourish London and BrickZoneHub have no datafeed wired up — manual `cread.php` deep links work, but the price-tracking pipeline can't auto-update them like it does Quzo (which uses the real Awin datafeed). Manual re-checks needed periodically.
- Frontend UI to show price history / "price dropped" indicators
- Real affiliate URLs for the remaining 6 mock products (Baby & Kids ×3, Home & Kitchen ×3, all placeholder `#` in seed data — no accepted affiliate program fits either category yet)
- Email price-alert signups/accounts.
