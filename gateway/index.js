const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3002

const SERVICES = {
  products: process.env.PRODUCT_SERVICE_URL || "http://localhost:3001",
}

app.use(cors())

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway" })
})

// /api/products/* and /api/categories → product service
// Express strips /api from req.url before the proxy sees it,
// so /api/products/featured becomes /products/featured on the target
app.use(
  "/api",
  createProxyMiddleware({
    target: SERVICES.products,
    changeOrigin: true,
  })
)

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`)
  console.log(`  /api/* → ${SERVICES.products}`)
})
