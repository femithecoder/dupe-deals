const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render's managed Postgres requires SSL; a local dev database on
  // localhost doesn't have a cert to verify, so only require it remotely.
  ssl:
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")
      ? { rejectUnauthorized: false }
      : false,
})

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    brand       TEXT NOT NULL,
    category    TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    description TEXT NOT NULL,
    original_price DOUBLE PRECISION NOT NULL,
    sale_price  DOUBLE PRECISION NOT NULL,
    discount_percent INTEGER NOT NULL,
    image_url   TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    merchant    TEXT NOT NULL,
    rating      DOUBLE PRECISION NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0,
    dupe_for    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
  CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount_percent DESC);

  CREATE TABLE IF NOT EXISTS price_history (
    id          SERIAL PRIMARY KEY,
    product_id  TEXT NOT NULL REFERENCES products(id),
    price       DOUBLE PRECISION NOT NULL,
    checked_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id, checked_at DESC);
`

// Memoized so the schema is only created once per process, not once per query.
let schemaReady = null
function ensureSchema() {
  if (!schemaReady) schemaReady = pool.query(SCHEMA_SQL)
  return schemaReady
}

async function query(text, params) {
  await ensureSchema()
  return pool.query(text, params)
}

module.exports = { query, pool }
