import type { Product, Category } from "./mock-data"

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3002"

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${GATEWAY}${path}`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const data = await get<{ products: Product[] }>(`/api/products/featured?limit=${limit}`)
  return data.products
}

export async function fetchProductsByCategory(slug: string): Promise<Product[]> {
  const data = await get<{ products: Product[] }>(`/api/products?category=${slug}&limit=50`)
  return data.products
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await get<Product>(`/api/products/${id}`)
  } catch {
    return null
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await get<{ products: Product[] }>(`/api/products/search?q=${encodeURIComponent(query)}`)
  return data.products
}

export async function fetchCategories(): Promise<Pick<Category, "name" | "slug">[]> {
  const data = await get<{ categories: Pick<Category, "name" | "slug">[] }>("/api/categories")
  return data.categories
}
