// Real price provider backed by Awin's product datafeed. Only covers merchants
// with a feed wired up below (currently Quzo UK, feedId 42863, inferred from the
// productserve.com image CDN URLs already stored on those products). Any product
// from an unwired merchant, or a mock "#" affiliate link, is left unchanged rather
// than guessed, same contract shape as providers/simulated.js: fetchPrice(product).

const zlib = require("zlib")

const FEED_CACHE_MS = 60 * 60 * 1000 // re-download at most once an hour, not once per product

const FEEDS = {
  "Quzo UK": process.env.AWIN_QUZO_FEED_ID || "42863",
}

const cache = new Map() // feedId -> { rows: Map<awProductId, row>, fetchedAt }

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

async function downloadFeed(feedId) {
  const apiKey = process.env.AWIN_API_KEY
  if (!apiKey) throw new Error("AWIN_API_KEY is not configured")

  // rid, hasEnhancedFeeds, columns, and delimiter are required by Awin's endpoint,
  // it 404s without them despite not being documented as mandatory. Confirmed
  // against the live feed: only requesting the two columns actually used here.
  const url = `https://productdata.awin.com/datafeed/download/apikey/${apiKey}/language/en/fid/${feedId}/rid/0/hasEnhancedFeeds/0/columns/aw_product_id,search_price/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Awin datafeed download failed for feed ${feedId}: ${res.status}`)

  const gzipped = Buffer.from(await res.arrayBuffer())
  const csv = zlib.gunzipSync(gzipped).toString("utf-8")
  const rows = parseCsv(csv)

  const byAwinProductId = new Map()
  for (const row of rows) {
    if (row.aw_product_id) byAwinProductId.set(row.aw_product_id, row)
  }
  return byAwinProductId
}

async function getFeed(feedId) {
  const cached = cache.get(feedId)
  if (cached && Date.now() - cached.fetchedAt < FEED_CACHE_MS) return cached.rows

  const rows = await downloadFeed(feedId)
  cache.set(feedId, { rows, fetchedAt: Date.now() })
  return rows
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

async function fetchPrice(product) {
  const feedId = FEEDS[product.merchant]
  const awProductId = feedId ? extractAwinProductId(product.affiliate_url) : null

  if (!feedId || !awProductId) {
    // no feed wired up for this merchant, or not a real Awin link
    return { price: product.sale_price }
  }

  const rows = await getFeed(feedId)
  const row = rows.get(awProductId)

  if (!row || !row.search_price) {
    // dropped from the feed or missing a price, leave it unchanged rather than guess
    return { price: product.sale_price }
  }

  return { price: Math.round(parseFloat(row.search_price) * 100) / 100 }
}

module.exports = { fetchPrice }
