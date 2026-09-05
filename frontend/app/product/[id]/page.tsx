import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { products } from "@/lib/mock-data"
import { fetchProductById, fetchProductsByCategory, fetchPriceHistory } from "@/lib/api"
import DealBadge from "@/components/DealBadge"
import ProductCard from "@/components/ProductCard"
import JsonLd from "@/components/JsonLd"
import ViewDealButton from "@/components/ViewDealButton"
import PriceInsight from "@/components/PriceInsight"
import PriceFreshness from "@/components/PriceFreshness"
import { highResImage } from "@/lib/image"
import { SITE_URL } from "@/lib/site"
import { ensureDescription, pageMetadata, shortenProductName, withBrand } from "@/lib/seo"
import { PRODUCT_TITLE_OVERRIDES } from "@/lib/product-titles"
import { getMerchantTrust } from "@/lib/merchant-trust"
import { getPostsForProduct } from "@/lib/blog"

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await fetchProductById(id)
  if (!product) return {}

  return pageMetadata({
    // Feed names run to 130+ chars, so the <title> uses a hand-written short
    // name where we have one and an automatic trim otherwise. Either way the
    // page itself still shows the full name as its H1.
    title: withBrand(PRODUCT_TITLE_OVERRIDES[product.id] ?? shortenProductName(product.name)),
    ogTitle: product.name,
    description: ensureDescription(
      product.description,
      "Live UK price and full spec on DupeDeals."
    ),
    path: `/product/${product.id}`,
    images: [product.imageUrl],
  })
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await fetchProductById(id)
  if (!product) notFound()

  const savings = (product.originalPrice - product.salePrice).toFixed(2)
  const guides = getPostsForProduct(product.id)
  const sellerTrust = getMerchantTrust(product.merchant)
  const [priceHistory, related] = await Promise.all([
    fetchPriceHistory(product.id),
    fetchProductsByCategory(product.categorySlug).then((list) => {
      // Rotate the window by this product's position instead of always slicing
      // from the top. Taking the first four meant every page in a category
      // showed the same four items, and 30 of 50 products were never linked
      // from any other product page.
      const others = list.filter((p) => p.id !== product.id)
      if (others.length === 0) return others
      const start = Math.max(0, list.findIndex((p) => p.id === product.id))
      return Array.from(
        { length: Math.min(4, others.length) },
        (_, i) => others[(start + i) % others.length]
      )
    }),
  ])

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating:
      product.reviewCount > 0
        ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount }
        : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "GBP",
      price: product.salePrice,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: product.merchant },
    },
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={productJsonLd} />
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6 flex gap-2">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.categorySlug}`} className="hover:text-violet-600 transition">{product.category}</Link>
        <span>/</span>
        <span className="text-slate-900 truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
          <Image
            src={highResImage(product.imageUrl)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.discountPercent > 0 && (
            <div className="absolute top-3 left-3">
              <DealBadge percent={product.discountPercent} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 font-medium">{product.merchant} · {product.category}</p>
          <h1 className="text-2xl font-black text-slate-900 leading-snug">{product.name}</h1>

          {sellerTrust && (
            <a
              href={sellerTrust.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition"
            >
              <span>
                Sold by <span className="font-semibold text-slate-700">{product.merchant}</span>
              </span>
              <span className="text-amber-400">★</span>
              <span>
                {sellerTrust.rating} ({sellerTrust.reviewCount.toLocaleString()} seller reviews on {sellerTrust.source})
              </span>
            </a>
          )}

          {product.dupeFor && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-violet-50 border border-violet-100 px-4 py-2.5">
              <span className="text-violet-600 font-bold text-sm">Dupe for:</span>
              <span className="text-slate-900 font-semibold text-sm">{product.dupeFor}</span>
            </div>
          )}

          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

          <div className="flex items-end gap-3 pt-2">
            <span className="text-4xl font-black text-slate-900">£{product.salePrice.toFixed(2)}</span>
            {product.originalPrice > product.salePrice && (
              <div className="mb-1">
                <p className="text-sm text-slate-400 line-through">£{product.originalPrice.toFixed(2)}</p>
                <p className="text-sm text-emerald-600 font-semibold">Save £{savings}</p>
              </div>
            )}
          </div>

          <PriceInsight history={priceHistory} currentPrice={product.salePrice} />

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                ))}
              </span>
              <span className="text-slate-600">{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
            </div>
          )}

          <ViewDealButton
            productId={product.id}
            productName={product.name}
            merchant={product.merchant}
            affiliateUrl={product.affiliateUrl}
          />
          <p className="text-xs text-slate-400 text-center">
            <PriceFreshness history={priceHistory} />
            We may earn a commission if you buy via this link. Prices come from the retailer&apos;s
            feed and can change at any time, so always confirm the current price on their site
            before buying.
          </p>
        </div>
      </div>

      {guides.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Read our guide</h2>
          <ul className="space-y-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/blog/${g.slug}`}
                  className="text-violet-600 font-semibold hover:text-violet-700 hover:underline"
                >
                  {g.title}
                </Link>
                <span className="text-slate-400 text-sm"> &middot; {g.readingTime}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">More {product.category} deals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
