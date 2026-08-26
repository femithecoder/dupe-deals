// Real price provider backed by Awin's product datafeed. Only covers merchants
// with a feed wired up below (Quzo UK feedId 42863, Amazon feedId 110672, both
// inferred from the productserve.com image CDN URLs already stored on those
// products, same method, confirmed correct for Quzo against its live site).
// Any product from an unwired merchant (currently just Nourish London, no
// feed ID known yet), or a mock "#" affiliate link, is left unchanged rather
// than guessed, same contract shape as providers/simulated.js: fetchPrice(product).
//
// Two affiliate link shapes exist among our Quzo products: pclick.php?p=<id>
// links carry Awin's aw_product_id directly, matched below by ID. Older
// cread.php?...&ued=<url> deep links don't (there's no p= param), those are
// matched by comparing the destination URL against the feed's own
// merchant_deep_link column instead, see matchFeedRow().

const zlib = require("zlib")

const FEED_CACHE_MS = 60 * 60 * 1000 // re-download at most once an hour, not once per product

const FEEDS = {
  "Quzo UK": process.env.AWIN_QUZO_FEED_ID || "42863",
  Amazon: process.env.AWIN_AMAZON_FEED_ID || "110672",
}

const cache = new Map() // feedId -> { feed: { byAwinProductId, byMerchantUrl }, fetchedAt }

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

function parseCsv(text) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []

  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const row = {}
    headers.forEach((header, i) => (row[header] = values[i]))
    return row
  })
}

// Strip scheme, trailing slash, and query string so the same product URL
// matches whether it came from our stored affiliate link's `ued` param or
// from the feed's merchant_deep_link, even if one has a tracking query string
// the other doesn't.
function normalizeUrl(url) {
  try {
    const u = new URL(url)
    return (u.hostname + u.pathname).toLowerCase().replace(/\/$/, "")
  } catch {
    return null
  }
}

async function downloadFeed(feedId) {
  const apiKey = process.env.AWIN_API_KEY
  if (!apiKey) throw new Error("AWIN_API_KEY is not configured")

  // rid, hasEnhancedFeeds, columns, and delimiter are required by Awin's endpoint,
  // it 404s without them despite not being documented as mandatory. Confirmed
  // against the live feed: only requesting the columns actually used here.
  const url = `https://productdata.awin.com/datafeed/download/apikey/${apiKey}/language/en/fid/${feedId}/rid/0/hasEnhancedFeeds/0/columns/aw_product_id,search_price,merchant_deep_link/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Awin datafeed download failed for feed ${feedId}: ${res.status}`)

  const gzipped = Buffer.from(await res.arrayBuffer())
  const csv = zlib.gunzipSync(gzipped).toString("utf-8")
  const rows = parseCsv(csv)

  const byAwinProductId = new Map()
  const byMerchantUrl = new Map()
  for (const row of rows) {
    if (row.aw_product_id) byAwinProductId.set(row.aw_product_id, row)
    const normalized = row.merchant_deep_link && normalizeUrl(row.merchant_deep_link)
    if (normalized) byMerchantUrl.set(normalized, row)
  }
  return { byAwinProductId, byMerchantUrl }
}

async function getFeed(feedId) {
  const cached = cache.get(feedId)
  if (cached && Date.now() - cached.fetchedAt < FEED_CACHE_MS) return cached.feed

  const feed = await downloadFeed(feedId)
  cache.set(feedId, { feed, fetchedAt: Date.now() })
  return feed
}

// Our stored affiliate links are pclick.php?p=<aw_product_id>&a=<affiliate_id>&m=<merchant_id>,
// the same aw_product_id the datafeed rows are keyed on.
function extractAwinProductId(affiliateUrl) {
  try {
    return new URL(affiliateUrl).searchParams.get("p")
  } catch {
    return null
  }
}

// Older links use Awin's cread.php?...&ued=<destination> deep-link format
// instead, no aw_product_id to extract, but the destination URL itself is
// right there in the ued param.
function extractDestinationUrl(affiliateUrl) {
  try {
    return new URL(affiliateUrl).searchParams.get("ued")
  } catch {
    return null
  }
}

function matchFeedRow(feed, product) {
  const awProductId = extractAwinProductId(product.affiliate_url)
  if (awProductId && feed.byAwinProductId.has(awProductId)) {
    return feed.byAwinProductId.get(awProductId)
  }

  const destinationUrl = extractDestinationUrl(product.affiliate_url)
  const normalized = destinationUrl && normalizeUrl(destinationUrl)
  return normalized ? feed.byMerchantUrl.get(normalized) : undefined
}

async function fetchPrice(product) {
  const feedId = FEEDS[product.merchant]
  if (!feedId) {
    // no feed wired up for this merchant
    return { price: product.sale_price }
  }

  const feed = await getFeed(feedId)
  const row = matchFeedRow(feed, product)

  if (!row || !row.search_price) {
    // not found by either ID or URL, dropped from the feed, or missing a
    // price, leave it unchanged rather than guess
    return { price: product.sale_price }
  }

  return { price: Math.round(parseFloat(row.search_price) * 100) / 100 }
}

module.exports = { fetchPrice }
