const db = require("./db")

const products = [
  {
    id: "1", name: "CeraVe Moisturising Cream 340g", brand: "CeraVe",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Dermatologist-recommended moisturiser with ceramides and hyaluronic acid. Identical ingredients to La Mer for a fraction of the price.",
    original_price: 18.99, sale_price: 11.99, discount_percent: 37,
    image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Boots", rating: 4.8, review_count: 12400, dupe_for: "La Mer Crème de la Mer",
  },
  {
    id: "2", name: "The Ordinary Hyaluronic Acid 2% + B5", brand: "The Ordinary",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Hydration serum with multiple weights of hyaluronic acid. A genuine dupe for SkinCeuticals Hyaluronic Acid Intensifier.",
    original_price: 12.90, sale_price: 7.90, discount_percent: 39,
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "ASOS", rating: 4.7, review_count: 8900, dupe_for: "SkinCeuticals Hyaluronic Acid",
  },
  {
    id: "3", name: "Garnier Vitamin C Brightening Serum 30ml", brand: "Garnier",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Fast-absorbing vitamin C serum that brightens and evens skin tone. Works just as well as Skinceuticals CE Ferulic.",
    original_price: 14.99, sale_price: 8.99, discount_percent: 40,
    image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Superdrug", rating: 4.5, review_count: 5600, dupe_for: "Skinceuticals CE Ferulic",
  },
  {
    id: "4", name: "Aldi Mamia Ultra Dry Nappies Size 4", brand: "Mamia",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Consistently rated alongside Pampers in independent tests. 48 nappies for less than half the price.",
    original_price: 4.99, sale_price: 2.99, discount_percent: 40,
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Aldi", rating: 4.6, review_count: 3200, dupe_for: "Pampers Active Fit",
  },
  {
    id: "5", name: "Tommee Tippee Closer to Nature Bottles 3pk", brand: "Tommee Tippee",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Anti-colic baby bottles with breast-like teat. Currently on sale — same quality as Philips Avent at a better price.",
    original_price: 24.99, sale_price: 14.99, discount_percent: 40,
    image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Boots", rating: 4.7, review_count: 6700, dupe_for: "Philips Avent Natural",
  },
  {
    id: "6", name: "Chicco Next2Me Magic Co-Sleeping Crib", brand: "Chicco",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Side-sleeping crib with 9 height positions. Equivalent to Snuzpod at significantly lower cost.",
    original_price: 249.99, sale_price: 179.99, discount_percent: 28,
    image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "John Lewis", rating: 4.6, review_count: 2100, dupe_for: "Snuzpod 4",
  },
  {
    id: "7", name: "Tower Vortx Air Fryer 4L", brand: "Tower",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Rapid air circulation technology, 4L capacity, 1500W. Consistently outperforms Philips Airfryer in consumer tests.",
    original_price: 59.99, sale_price: 34.99, discount_percent: 42,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Currys", rating: 4.5, review_count: 4800, dupe_for: "Philips Airfryer Essential",
  },
  {
    id: "8", name: "Dunelm Waffle Towel Set 4pc", brand: "Dunelm",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "600gsm Egyptian cotton waffle towels. Softer than the White Company equivalent at a third of the price.",
    original_price: 34.99, sale_price: 19.99, discount_percent: 43,
    image_url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Dunelm", rating: 4.4, review_count: 3100, dupe_for: "The White Company Waffle Towel",
  },
  {
    id: "9", name: "Salter Megastone Non-Stick Pan Set 3pc", brand: "Salter",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "3-layer non-stick coating with marble effect. Performs like Le Creuset non-stick at a fraction of the cost.",
    original_price: 49.99, sale_price: 27.99, discount_percent: 44,
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Argos", rating: 4.3, review_count: 2900, dupe_for: "Le Creuset Toughened Non-Stick",
  },
  {
    id: "10", name: "Soundcore by Anker Q30 Headphones", brand: "Soundcore",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Hybrid Active Noise Cancelling, 40hr battery, Hi-Res Audio. Reviewers consistently prefer it over Sony WH-1000XM3.",
    original_price: 79.99, sale_price: 44.99, discount_percent: 44,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Amazon", rating: 4.6, review_count: 18400, dupe_for: "Sony WH-1000XM4",
  },
  {
    id: "11", name: "Nothing Ear (2) True Wireless Earbuds", brand: "Nothing",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Dual-driver system, active noise cancellation, 36hr total battery. Sound quality matches AirPods Pro at lower cost.",
    original_price: 149.00, sale_price: 99.00, discount_percent: 34,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "John Lewis", rating: 4.5, review_count: 7600, dupe_for: "Apple AirPods Pro 2",
  },
  {
    id: "12", name: "Xiaomi Redmi Note 13 Pro 256GB", brand: "Xiaomi",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "200MP camera, AMOLED display, 5000mAh battery with 67W charging. Flagship features without the flagship price.",
    original_price: 379.99, sale_price: 279.99, discount_percent: 26,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Currys", rating: 4.4, review_count: 4200, dupe_for: "Samsung Galaxy S23",
  },
]

const insert = db.prepare(`
  INSERT OR REPLACE INTO products
    (id, name, brand, category, category_slug, description, original_price, sale_price,
     discount_percent, image_url, affiliate_url, merchant, rating, review_count, dupe_for)
  VALUES
    (@id, @name, @brand, @category, @category_slug, @description, @original_price, @sale_price,
     @discount_percent, @image_url, @affiliate_url, @merchant, @rating, @review_count, @dupe_for)
`)

const seedAll = db.transaction((rows) => {
  for (const row of rows) insert.run(row)
})

seedAll(products)
console.log(`Seeded ${products.length} products.`)
