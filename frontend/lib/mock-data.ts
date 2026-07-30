export type Product = {
  id: string
  name: string
  brand: string
  category: string
  categorySlug: string
  description: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  imageUrl: string
  affiliateUrl: string
  merchant: string
  rating: number
  reviewCount: number
  dupeFor?: string
}

export type Category = {
  name: string
  slug: string
  icon: string
  description: string
  productCount: number
  colour: string
}

export const categories: Category[] = [
  {
    name: "Beauty & Skincare",
    slug: "beauty-skincare",
    icon: "✦",
    description: "Dupes for high-end serums, moisturisers, and makeup",
    productCount: 124,
    colour: "from-pink-500 to-rose-500",
  },
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: "◎",
    description: "Quality essentials for little ones at honest prices",
    productCount: 89,
    colour: "from-sky-400 to-blue-500",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: "⌂",
    description: "Premium alternatives for your home without the premium price",
    productCount: 156,
    colour: "from-amber-400 to-orange-500",
  },
  {
    name: "Electronics & Tech",
    slug: "electronics-tech",
    icon: "⚡",
    description: "Smart tech picks that perform like the big brands",
    productCount: 203,
    colour: "from-violet-500 to-purple-600",
  },
]

export const products: Product[] = [
  // Beauty & Skincare
  {
    id: "1",
    name: "CeraVe Moisturising Cream 340g",
    brand: "CeraVe",
    category: "Beauty & Skincare",
    categorySlug: "beauty-skincare",
    description: "Dermatologist-recommended moisturiser with ceramides and hyaluronic acid. Identical ingredients to La Mer for a fraction of the price.",
    originalPrice: 18.99,
    salePrice: 11.99,
    discountPercent: 37,
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Boots",
    rating: 4.8,
    reviewCount: 12400,
    dupeFor: "La Mer Crème de la Mer",
  },
  {
    id: "2",
    name: "The Ordinary Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "Beauty & Skincare",
    categorySlug: "beauty-skincare",
    description: "Hydration serum with multiple weights of hyaluronic acid. A genuine dupe for SkinCeuticals Hyaluronic Acid Intensifier.",
    originalPrice: 12.90,
    salePrice: 7.90,
    discountPercent: 39,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "ASOS",
    rating: 4.7,
    reviewCount: 8900,
    dupeFor: "SkinCeuticals Hyaluronic Acid",
  },
  {
    id: "3",
    name: "Garnier Vitamin C Brightening Serum 30ml",
    brand: "Garnier",
    category: "Beauty & Skincare",
    categorySlug: "beauty-skincare",
    description: "Fast-absorbing vitamin C serum that brightens and evens skin tone. Works just as well as Skinceuticals CE Ferulic.",
    originalPrice: 14.99,
    salePrice: 8.99,
    discountPercent: 40,
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Superdrug",
    rating: 4.5,
    reviewCount: 5600,
    dupeFor: "Skinceuticals CE Ferulic",
  },
  // Baby & Kids
  {
    id: "4",
    name: "Aldi Mamia Ultra Dry Nappies Size 4",
    brand: "Mamia",
    category: "Baby & Kids",
    categorySlug: "baby-kids",
    description: "Consistently rated alongside Pampers in independent tests. 48 nappies for less than half the price.",
    originalPrice: 4.99,
    salePrice: 2.99,
    discountPercent: 40,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Aldi",
    rating: 4.6,
    reviewCount: 3200,
    dupeFor: "Pampers Active Fit",
  },
  {
    id: "5",
    name: "Tommee Tippee Closer to Nature Bottles 3pk",
    brand: "Tommee Tippee",
    category: "Baby & Kids",
    categorySlug: "baby-kids",
    description: "Anti-colic baby bottles with breast-like teat. Currently on sale — same quality as Philips Avent at a better price.",
    originalPrice: 24.99,
    salePrice: 14.99,
    discountPercent: 40,
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Boots",
    rating: 4.7,
    reviewCount: 6700,
    dupeFor: "Philips Avent Natural",
  },
  {
    id: "6",
    name: "Chicco Next2Me Magic Co-Sleeping Crib",
    brand: "Chicco",
    category: "Baby & Kids",
    categorySlug: "baby-kids",
    description: "Side-sleeping crib with 9 height positions. Equivalent to Snuzpod at significantly lower cost.",
    originalPrice: 249.99,
    salePrice: 179.99,
    discountPercent: 28,
    imageUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "John Lewis",
    rating: 4.6,
    reviewCount: 2100,
    dupeFor: "Snuzpod 4",
  },
  // Home & Kitchen
  {
    id: "7",
    name: "Tower Vortx Air Fryer 4L",
    brand: "Tower",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    description: "Rapid air circulation technology, 4L capacity, 1500W. Consistently outperforms Philips Airfryer in consumer tests.",
    originalPrice: 59.99,
    salePrice: 34.99,
    discountPercent: 42,
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Currys",
    rating: 4.5,
    reviewCount: 4800,
    dupeFor: "Philips Airfryer Essential",
  },
  {
    id: "8",
    name: "Dunelm Waffle Towel Set 4pc",
    brand: "Dunelm",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    description: "600gsm Egyptian cotton waffle towels. Softer than the White Company equivalent at a third of the price.",
    originalPrice: 34.99,
    salePrice: 19.99,
    discountPercent: 43,
    imageUrl: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Dunelm",
    rating: 4.4,
    reviewCount: 3100,
    dupeFor: "The White Company Waffle Towel",
  },
  {
    id: "9",
    name: "Salter Megastone Non-Stick Pan Set 3pc",
    brand: "Salter",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    description: "3-layer non-stick coating with marble effect. Performs like Le Creuset non-stick at a fraction of the cost.",
    originalPrice: 49.99,
    salePrice: 27.99,
    discountPercent: 44,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Argos",
    rating: 4.3,
    reviewCount: 2900,
    dupeFor: "Le Creuset Toughened Non-Stick",
  },
  // Electronics & Tech
  {
    id: "10",
    name: "Soundcore by Anker Q30 Headphones",
    brand: "Soundcore",
    category: "Electronics & Tech",
    categorySlug: "electronics-tech",
    description: "Hybrid Active Noise Cancelling, 40hr battery, Hi-Res Audio. Reviewers consistently prefer it over Sony WH-1000XM3.",
    originalPrice: 79.99,
    salePrice: 44.99,
    discountPercent: 44,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Amazon",
    rating: 4.6,
    reviewCount: 18400,
    dupeFor: "Sony WH-1000XM4",
  },
  {
    id: "11",
    name: "Nothing Ear (2) True Wireless Earbuds",
    brand: "Nothing",
    category: "Electronics & Tech",
    categorySlug: "electronics-tech",
    description: "Dual-driver system, active noise cancellation, 36hr total battery. Sound quality matches AirPods Pro at lower cost.",
    originalPrice: 149.00,
    salePrice: 99.00,
    discountPercent: 34,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "John Lewis",
    rating: 4.5,
    reviewCount: 7600,
    dupeFor: "Apple AirPods Pro 2",
  },
  {
    id: "12",
    name: "Xiaomi Redmi Note 13 Pro 256GB",
    brand: "Xiaomi",
    category: "Electronics & Tech",
    categorySlug: "electronics-tech",
    description: "200MP camera, AMOLED display, 5000mAh battery with 67W charging. Flagship features without the flagship price.",
    originalPrice: 379.99,
    salePrice: 279.99,
    discountPercent: 26,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    affiliateUrl: "#",
    merchant: "Currys",
    rating: 4.4,
    reviewCount: 4200,
    dupeFor: "Samsung Galaxy S23",
  },
]

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug)
}

export function getFeaturedDeals(): Product[] {
  return [...products].sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 8)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.dupeFor?.toLowerCase().includes(q)
  )
}
