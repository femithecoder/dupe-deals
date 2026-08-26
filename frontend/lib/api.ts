import type { Product, Category } from "./mock-data"
import {
  products as mockProducts,
  getFeaturedDeals,
  getProductsByCategory,
  getProductById as getMockProductById,
  searchProducts as searchMockProducts,
} from "./mock-data"

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL

async function get<T>(path: string): Promise<T> {
  try {
    if (!GATEWAY) throw new Error("No gateway configured")
    const res = await fetch(`${GATEWAY}${path}`, { next: { revalidate: 300, tags: ["products"] } })
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
    return await res.json()
  } catch (err) {
    // callers fall back to static mock data on failure, that fallback being
    // silent is exactly what let stale prices sit unnoticed in production
    console.error(`[api] live fetch failed for ${path}, falling back to mock data:`, err)
    throw err
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const data = await get<{ products: Product[] }>(`/api/products/featured?limit=${limit}`)
    return data.products
  } catch {
    return getFeaturedDeals().slice(0, limit)
  }
}

export async function fetchProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const data = await get<{ products: Product[] }>(`/api/products?category=${slug}&limit=50`)
    return data.products
  } catch {
    return getProductsByCategory(slug)
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await get<Product>(`/api/products/${id}`)
  } catch {
    return getMockProductById(id) ?? null
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const data = await get<{ products: Product[] }>(`/api/products/search?q=${encodeURIComponent(query)}`)
    return data.products
  } catch {
    return searchMockProducts(query)
  }
}

export async function fetchCategories(): Promise<Pick<Category, "name" | "slug">[]> {
  try {
    const data = await get<{ categories: Pick<Category, "name" | "slug">[] }>("/api/categories")
    return data.categories
  } catch {
    return mockProducts
      .map((p) => ({ name: p.category, slug: p.categorySlug }))
      .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i)
  }
}
