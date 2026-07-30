const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "product-service" })
})

// GET /products — list with optional filters
app.get("/products", (req, res) => {
  const { category, sort = "discount", limit = "20", offset = "0" } = req.query

  const sortMap = {
    discount: "discount_percent DESC",
    price_asc: "sale_price ASC",
    price_desc: "sale_price DESC",
    rating: "rating DESC",
  }
  const orderBy = sortMap[sort] || sortMap.discount

  let query = "SELECT * FROM products"
  const params = []

  if (category) {
    query += " WHERE category_slug = ?"
    params.push(category)
  }

  query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`
  params.push(parseInt(limit), parseInt(offset))

  const products = db.prepare(query).all(...params)
  const total = db
    .prepare(
      category
        ? "SELECT COUNT(*) as count FROM products WHERE category_slug = ?"
        : "SELECT COUNT(*) as count FROM products"
    )
    .get(...(category ? [category] : []))

  res.json({ products: products.map(toClient), total: total.count })
})

// GET /products/featured — highest discount products
app.get("/products/featured", (req, res) => {
  const { limit = "8" } = req.query
  const products = db
    .prepare("SELECT * FROM products ORDER BY discount_percent DESC LIMIT ?")
    .all(parseInt(limit))
  res.json({ products: products.map(toClient) })
})

// GET /products/search — full-text search
app.get("/products/search", (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) return res.json({ products: [] })

  const term = `%${q.toLowerCase()}%`
  const products = db
    .prepare(
      `SELECT * FROM products
       WHERE lower(name) LIKE ?
          OR lower(brand) LIKE ?
          OR lower(description) LIKE ?
          OR lower(dupe_for) LIKE ?
       ORDER BY discount_percent DESC`
    )
    .all(term, term, term, term)

  res.json({ products: products.map(toClient) })
})

// GET /products/:id
app.get("/products/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id)
  if (!product) return res.status(404).json({ error: "Product not found" })
  res.json(toClient(product))
})

// GET /categories — distinct categories with counts
app.get("/categories", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT category as name, category_slug as slug, COUNT(*) as product_count
       FROM products GROUP BY category_slug ORDER BY name`
    )
    .all()
  res.json({ categories: rows })
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

app.listen(PORT, () => {
  console.log(`Product service running on http://localhost:${PORT}`)
})
