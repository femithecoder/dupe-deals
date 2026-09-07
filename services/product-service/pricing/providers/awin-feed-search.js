// Product discovery against an Awin datafeed. Answers "what does this merchant
// actually sell that we could list?", which is a different job from
// awin-datafeed.js: that one re-prices products we already have, this one finds
// products we don't.
//
// Written for the same constraint that shaped awin-datafeed.js, and for the
// same reason (it OOM-crashed product-service twice in production): a merchant
// feed can be enormous, Amazon's especially, so nothing here holds more than
// one CSV line at a time. Matches accumulate up to `limit` and then the read
// stops early. Peak memory is set by how many results were asked for, not by
// how big the feed is.
//
// Lives on the server rather than in a local script because AWIN_API_KEY is
// only configured on Render, and downloading a feed needs it.

const zlib = require("zlib")
const readline = require("readline")
const { Readable } = require("stream")

// Overridable so tests can point at a local fixture server instead of Awin.
const FEED_BASE_URL = process.env.AWIN_FEED_BASE_URL || "https://productdata.awin.com"

// More columns than the price scan asks for, because judging whether a product
// is worth listing needs the name, image and price together. Every one is
// resolved by header name below, so Awin reordering or dropping a column
// degrades the result rather than corrupting it.
const COLUMNS = [
  "aw_product_id",
  "product_name",
  "description",
  "merchant_category",
  "search_price",
  "rrp_price",
  "merchant_image_url",
  "aw_deep_link",
  "brand_name",
  "in_stock",
]

function parseCsvLine(line) {
  const fields = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ",") {
      fields.push(field)
      field = ""
    } else {
      field += char
    }
  }
  fields.push(field)
  return fields
}

/**
 * Streams one feed and returns rows matching every term in `allOf` and at least
 * one term in `anyOf`, case-insensitively.
 *
 * The cheap test runs against the raw line before any CSV parsing, because
 * parsing every row of a large feed is the expensive part and almost every row
 * is a miss. Only a line that already looks promising gets parsed properly.
 */
async function searchFeed({
  feedId,
  anyOf = [],
  allOf = [],
  limit = 25,
  minPrice = 0,
  maxPrice = Infinity,
  inStockOnly = true,
}) {
  const apiKey = process.env.AWIN_API_KEY
  if (!apiKey) throw new Error("AWIN_API_KEY is not configured")
  if (!feedId) throw new Error("feedId is required")
  if (anyOf.length === 0 && allOf.length === 0) throw new Error("at least one search term is required")

  const anyLower = anyOf.map((t) => t.toLowerCase())
  const allLower = allOf.map((t) => t.toLowerCase())

  const url =
    `${FEED_BASE_URL}/datafeed/download/apikey/${apiKey}/language/en/fid/${feedId}` +
    `/rid/0/hasEnhancedFeeds/0/columns/${COLUMNS.join(",")}` +
    `/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Awin datafeed download failed for feed ${feedId}: ${res.status}`)
  if (!res.body) throw new Error(`Awin datafeed for feed ${feedId} returned no body`)

  const gunzip = zlib.createGunzip()
  Readable.fromWeb(res.body).pipe(gunzip)
  const rl = readline.createInterface({ input: gunzip, crlfDelay: Infinity })

  const results = []
  let headers = null
  let col = {}
  let scanned = 0

  try {
    for await (const line of rl) {
      if (!line.trim()) continue

      if (!headers) {
        headers = parseCsvLine(line)
        for (const name of COLUMNS) col[name] = headers.indexOf(name)
        continue
      }

      scanned++
      const lower = line.toLowerCase()
      if (allLower.length && !allLower.every((t) => lower.includes(t))) continue
      if (anyLower.length && !anyLower.some((t) => lower.includes(t))) continue

      const values = parseCsvLine(line)
      const get = (name) => (col[name] >= 0 ? values[col[name]] : undefined)

      // The cheap test matches anywhere in the row, including the deep link,
      // so re-check against the fields a human would actually read. Without
      // this, searching "baby" matches any URL with "baby" in the slug.
      const haystack = `${get("product_name") ?? ""} ${get("description") ?? ""} ${get("merchant_category") ?? ""} ${get("brand_name") ?? ""}`.toLowerCase()
      if (allLower.length && !allLower.every((t) => haystack.includes(t))) continue
      if (anyLower.length && !anyLower.some((t) => haystack.includes(t))) continue

      const price = parseFloat(get("search_price"))
      if (!Number.isFinite(price) || price < minPrice || price > maxPrice) continue

      const stock = get("in_stock")
      if (inStockOnly && stock !== undefined && stock !== "" && stock !== "1") continue

      const rrp = parseFloat(get("rrp_price"))
      results.push({
        awProductId: get("aw_product_id"),
        name: get("product_name"),
        brand: get("brand_name") || undefined,
        category: get("merchant_category") || undefined,
        price,
        rrp: Number.isFinite(rrp) && rrp > price ? rrp : undefined,
        imageUrl: get("merchant_image_url") || undefined,
        deepLink: get("aw_deep_link") || undefined,
        description: (get("description") || "").slice(0, 300),
      })

      if (results.length >= limit) break // stop reading, don't drain the whole feed
    }
  } finally {
    rl.close()
    gunzip.destroy()
  }

  return { feedId, scanned, matched: results.length, results }
}

module.exports = { searchFeed }
