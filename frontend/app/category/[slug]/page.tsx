import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ensureDescription, pageMetadata } from "@/lib/seo"
import { categories } from "@/lib/mock-data"
import { fetchProductsByCategory } from "@/lib/api"
import ProductCard from "@/components/ProductCard"

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}

  return pageMetadata({
    title: `${category.name} Deals | DupeDeals`,
    description: ensureDescription(
      `${category.description}.`,
      "Compare live UK prices from trusted retailers and see how much you save."
    ),
    path: `/category/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const products = await fetchProductsByCategory(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className={`rounded-2xl bg-gradient-to-br ${category.colour} p-8 text-white mb-8`}>
        <span className="text-4xl mb-3 block">{category.icon}</span>
        <h1 className="text-3xl font-black mb-2">{category.name}</h1>
        <p className="text-white/80">{category.description}</p>
        <p className="mt-2 text-sm text-white/60">{products.length} deals available</p>
      </div>

      {products.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No deals found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
