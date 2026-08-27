const express = require("express")
const cors = require("cors")
const db = require("./db")
const { runPriceCheck } = require("./pricing/tracker")
const { startPriceCheckScheduler } = require("./pricing/scheduler")
const { seedProducts } = require("./seed")

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "product-service" })
})

// GET /products — list with optional filters
app.get("/products", async (req, res) => {
  const { category, sort = "discount", limit = "20", offset = "0" } = req.query

  const sortMap = {
    discount: "discount_percent DESC",
    price_asc: "sale_price ASC",
    price_desc: "sale_price DESC",
    rating: "rating DESC",
  }
  const orderBy = sortMap[sort] || sortMap.discount

  let sql = "SELECT * FROM products"
  const params = []

  if (category) {
    params.push(category)
    sql += ` WHERE category_slug = $${params.length}`
  }

  params.push(parseInt(limit), parseInt(offset))
  sql += ` ORDER BY ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`

  const { rows: products } = await db.query(sql, params)
  const { rows: totalRows } = await db.query(
    category ? "SELECT COUNT(*) as count FROM products WHERE category_slug = $1" : "SELECT COUNT(*) as count FROM products",
    category ? [category] : []
  )

  res.json({ products: products.map(toClient), total: parseInt(totalRows[0].count, 10) })
})

// GET /products/featured — highest discount products
app.get("/products/featured", async (req, res) => {
  const { limit = "8" } = req.query
  const { rows: products } = await db.query(
    "SELECT * FROM products ORDER BY discount_percent DESC LIMIT $1",
    [parseInt(limit)]
  )
  res.json({ products: products.map(toClient) })
})

// GET /products/search — full-text search
app.get("/products/search", async (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) return res.json({ products: [] })

  const term = `%${q.toLowerCase()}%`
  const { rows: products } = await db.query(
    `SELECT * FROM products
     WHERE lower(name) LIKE $1
        OR lower(brand) LIKE $1
        OR lower(description) LIKE $1
        OR lower(dupe_for) LIKE $1
     ORDER BY discount_percent DESC`,
    [term]
  )
  res.json({ products: products.map(toClient) })
})

// GET /products/:id
app.get("/products/:id", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM products WHERE id = $1", [req.params.id])
  const product = rows[0]
  if (!product) return res.status(404).json({ error: "Product not found" })
  res.json(toClient(product))
})

// GET /products/:id/price-history — recent tracked prices, oldest first
app.get("/products/:id/price-history", async (req, res) => {
  const { limit = "30" } = req.query
  const { rows } = await db.query(
    // unquoted aliases fold to lowercase in Postgres, quote to keep camelCase for clients
    `SELECT price, checked_at as "checkedAt" FROM price_history
     WHERE product_id = $1 ORDER BY checked_at DESC LIMIT $2`,
    [req.params.id, parseInt(limit)]
  )
  res.json({ history: rows.reverse() })
})

// POST /admin/price-check — run the price tracker on demand (for an external
// scheduler like Vercel Cron / GitHub Actions, or manual triggering)
app.post("/admin/price-check", async (req, res) => {
  if (!process.env.CRON_SECRET) {
    return res.status(503).json({ error: "CRON_SECRET is not configured on this server" })
  }
  if (req.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // ?merchant=Amazon scopes the check to one merchant, so a merchant whose
  // prices drift faster (Amazon) can be checked more often on a separate
  // schedule without re-running the whole catalog, see tracker.js
  const result = await runPriceCheck({ merchant: req.query.merchant })
  res.json(result)
})

// POST /admin/seed — (re)populate the product catalog. Exists because free-tier
// hosting (e.g. Render's free plan) doesn't include Shell access to run `npm run seed`
app.post("/admin/seed", async (req, res) => {
  if (!process.env.CRON_SECRET) {
    return res.status(503).json({ error: "CRON_SECRET is not configured on this server" })
  }
  if (req.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const result = await seedProducts()
  res.json(result)
})

// GET /categories — distinct categories with counts
app.get("/categories", async (_req, res) => {
  const { rows } = await db.query(
    `SELECT category as name, category_slug as slug, COUNT(*) as product_count
     FROM products GROUP BY category, category_slug ORDER BY category`
  )
  res.json({ categories: rows.map((r) => ({ ...r, product_count: parseInt(r.product_count, 10) })) })
})

// snake_case DB columns → camelCase for clients
function toClient(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    categorySlug: row.category_slug,
    description: row.description,
    originalPrice: row.original_price,
    salePrice: row.sale_price,
    discountPercent: row.discount_percent,
    imageUrl: row.image_url,
    affiliateUrl: row.affiliate_url,
    merchant: row.merchant,
    rating: row.rating,
    reviewCount: row.review_count,
    dupeFor: row.dupe_for ?? undefined,
  }
}

// Without this, any unhandled error (e.g. a DB constraint violation) falls
// through to Express's default handler, which returns a bare "Internal
// Server Error" HTML page with no detail — genuinely hard to debug from
// the client side, as happened tracking down the price_history foreign-key
// issue in seed.js. Must be registered after all routes.
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`Product service running on http://localhost:${PORT}`)
  startPriceCheckScheduler()
})
