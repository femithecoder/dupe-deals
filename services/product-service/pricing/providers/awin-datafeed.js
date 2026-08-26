// Real price provider backed by Awin's product datafeed. Only covers merchants
// with a feed wired up below. Any product from an unwired merchant, or a mock
// "#" affiliate link, is left unchanged rather than guessed, same contract
// shape as providers/simulated.js: fetchPrices(products) -> Map<product.id,
// { price } | { error }>, one call for the whole batch, not one per product.
//
// Memory note (learned the hard way, twice OOM-crashed product-service in
// production): earlier versions of this file downloaded a merchant's whole
// feed and parsed it into one or two Maps up front, one entry per row, held
// for the life of the process. Fine for a small feed, but a large merchant's
// feed can be huge (Amazon's especially), and even just materializing the
// full decompressed CSV as one string plus an array of every line blew past
// Render's free-tier heap limit, confirmed with a 500k-row synthetic feed
// under a constrained heap. This version streams the gzip response straight
// through decompression into line-by-line reads (see scanFeed), never
// holding more than one CSV line at a time, and stops early the moment every
// product in the batch has been found. Memory is bounded by how many
// products we're looking for, not by how large the merchant's feed is.
//
// Two affiliate link shapes exist among our products: pclick.php?p=<id>
// links carry Awin's aw_product_id directly. Older cread.php?...&ued=<url>
// deep links don't (there's no p= param), those are matched by comparing the
// destination URL against the feed's own merchant_deep_link column instead.

const zlib = require("zlib")
const readline = require("readline")
const { Readable } = require("stream")

const FEEDS = {
  "Quzo UK": process.env.AWIN_QUZO_FEED_ID || "42863",
  Amazon: process.env.AWIN_AMAZON_FEED_ID || "110672",
}

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

// The last path segment (e.g. "g413-tkl-se-...-pid333985.html") is specific
// enough to use as a cheap substring pre-check before fully parsing a line,
// same purpose as the aw_product_id regex below, just for the URL-matched
// (cread.php) products.
function lastPathSegment(url) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean)
    return parts.length ? parts[parts.length - 1] : null
  } catch {
    return null
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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

// cread.php?...&ued=<destination> deep links carry the raw destination URL
// instead of an aw_product_id.
function extractDestinationUrl(affiliateUrl) {
  try {
    return new URL(affiliateUrl).searchParams.get("ued")
  } catch {
    return null
  }
}

// Streams one feed and matches it against `products` in a single pass.
// Returns Map<product.id, rawPriceString>, only for the ones actually found.
async function scanFeed(feedId, products) {
  const apiKey = process.env.AWIN_API_KEY
  if (!apiKey) throw new Error("AWIN_API_KEY is not configured")

  const wantedIds = new Map() // awProductId -> product.id
  const wantedUrls = new Map() // normalizedUrl -> product.id
  const urlNeedles = [] // last-path-segments, for the cheap pre-check
  for (const product of products) {
    const awProductId = extractAwinProductId(product.affiliate_url)
    if (awProductId) {
      wantedIds.set(awProductId, product.id)
      continue
    }
    const destinationUrl = extractDestinationUrl(product.affiliate_url)
    const normalized = destinationUrl && normalizeUrl(destinationUrl)
    const needle = destinationUrl && lastPathSegment(destinationUrl)
    if (normalized && needle) {
      wantedUrls.set(normalized, product.id)
      urlNeedles.push(needle)
    }
  }

  const found = new Map()
  if (wantedIds.size === 0 && wantedUrls.size === 0) return found

  const idPattern = wantedIds.size ? new RegExp(Array.from(wantedIds.keys()).map(escapeRegex).join("|")) : null
  const urlPattern = urlNeedles.length ? new RegExp(urlNeedles.map(escapeRegex).join("|")) : null

  // rid, hasEnhancedFeeds, columns, and delimiter are required by Awin's endpoint,
  // it 404s without them despite not being documented as mandatory. Confirmed
  // against the live feed: only requesting the columns actually used here.
  const url = `https://productdata.awin.com/datafeed/download/apikey/${apiKey}/language/en/fid/${feedId}/rid/0/hasEnhancedFeeds/0/columns/aw_product_id,search_price,merchant_deep_link/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Awin datafeed download failed for feed ${feedId}: ${res.status}`)
  if (!res.body) throw new Error(`Awin datafeed for feed ${feedId} returned no body`)

  const gunzip = zlib.createGunzip()
  Readable.fromWeb(res.body).pipe(gunzip)
  const rl = readline.createInterface({ input: gunzip, crlfDelay: Infinity })

  let headers = null
  let idColumn = -1
  let priceColumn = -1
  let urlColumn = -1

  try {
    for await (const line of rl) {
      if (!line.trim()) continue

      if (!headers) {
        headers = parseCsvLine(line)
        idColumn = headers.indexOf("aw_product_id")
        priceColumn = headers.indexOf("search_price")
        urlColumn = headers.indexOf("merchant_deep_link")
        continue
      }

      if (wantedIds.size === 0 && wantedUrls.size === 0) break // found everything, stop reading

      if (idPattern && wantedIds.size > 0 && idColumn !== -1 && idPattern.test(line)) {
        const values = parseCsvLine(line)
        const id = values[idColumn]
        if (wantedIds.has(id)) {
          found.set(wantedIds.get(id), values[priceColumn])
          wantedIds.delete(id)
          continue
        }
      }

      if (urlPattern && wantedUrls.size > 0 && urlColumn !== -1 && urlPattern.test(line)) {
        const values = parseCsvLine(line)
        const rowUrl = values[urlColumn] && normalizeUrl(values[urlColumn])
        if (rowUrl && wantedUrls.has(rowUrl)) {
          found.set(wantedUrls.get(rowUrl), values[priceColumn])
          wantedUrls.delete(rowUrl)
        }
      }
    }
  } finally {
    rl.close()
    gunzip.destroy()
  }

  return found
}

async function fetchPrices(products) {
  const results = new Map()

  const byFeed = new Map() // feedId -> [products]
  for (const product of products) {
    const feedId = FEEDS[product.merchant]
    if (!feedId) {
      // no feed wired up for this merchant, leave unchanged rather than guess
      results.set(product.id, { price: product.sale_price })
      continue
    }
    if (!byFeed.has(feedId)) byFeed.set(feedId, [])
    byFeed.get(feedId).push(product)
  }

  for (const [feedId, feedProducts] of byFeed) {
    let found
    try {
      found = await scanFeed(feedId, feedProducts)
    } catch (err) {
      for (const product of feedProducts) results.set(product.id, { error: err.message })
      continue
    }
    for (const product of feedProducts) {
      const rawPrice = found.get(product.id)
      // not found (dropped from the feed) or missing a price, leave unchanged
      results.set(product.id, {
        price: rawPrice ? Math.round(parseFloat(rawPrice) * 100) / 100 : product.sale_price,
      })
    }
  }

  return results
}

module.exports = { fetchPrices }
