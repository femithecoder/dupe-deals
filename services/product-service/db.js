const Database = require("better-sqlite3")
const path = require("path")
const fs = require("fs")

const DATA_DIR = path.join(__dirname, "data")
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)

const db = new Database(path.join(DATA_DIR, "products.db"))

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    brand       TEXT NOT NULL,
    category    TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    description TEXT NOT NULL,
    original_price REAL NOT NULL,
    sale_price  REAL NOT NULL,
    discount_percent INTEGER NOT NULL,
    image_url   TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    merchant    TEXT NOT NULL,
    rating      REAL NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0,
    dupe_for    TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
  CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount_percent DESC);
`)

module.exports = db
