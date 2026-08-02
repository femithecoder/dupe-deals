import Link from "next/link"
import { categories } from "@/lib/mock-data"
import { fetchFeaturedProducts } from "@/lib/api"
import CategoryCard from "@/components/CategoryCard"
import ProductCard from "@/components/ProductCard"
import SearchBar from "@/components/SearchBar"

export default async function HomePage() {
  const featured = await fetchFeaturedProducts(8)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium mb-6">
            <span className="text-yellow-300">✦</span>
            UK&apos;s best dupes &amp; sale prices, updated daily
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-5">
            Quality products.{" "}
            <span className="text-yellow-300">Half the price.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            We track price drops on the products you love, and find cheaper alternatives when
            there isn&apos;t one, across beauty, baby essentials, kitchen kit, and tech. All from
            trusted UK retailers.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-6 text-sm text-white/70">
            <span>Popular:</span>
            {["AirPods", "La Mer", "Pampers", "Dyson", "Le Creuset"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="underline underline-offset-2 hover:text-white transition"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Top Deals Right Now</h2>
          <Link href="/search?q=all" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">How DupeDeals works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Search for a product", body: "Type any brand or product, like \"AirPods\", \"La Mer\", or \"Dyson\", and we'll flag a discount if there's one, or the best alternative if there isn't." },
              { step: "2", title: "Compare the savings", body: "See side-by-side comparisons with real prices from UK retailers. We show you exactly how much you save." },
              { step: "3", title: "Buy with confidence", body: "Every product is curated and links directly to the retailer. No middlemen, no hidden fees." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 font-black text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            {["✓ Updated daily", "✓ UK retailers only", "✓ Verified discount prices", "✓ Honest dupe comparisons"].map((item) => (
              <span key={item} className="font-medium">{item}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
