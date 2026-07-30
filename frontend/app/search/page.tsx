import { searchProducts, fetchFeaturedProducts } from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import SearchBar from "@/components/SearchBar"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q ?? ""
  const isAll = query === "all" || query === ""
  const results = isAll ? await fetchFeaturedProducts(20) : await searchProducts(query)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl mb-8">
        <SearchBar defaultValue={isAll ? "" : query} />
      </div>

      <div className="mb-6">
        {isAll ? (
          <h1 className="text-2xl font-bold text-slate-900">All Deals</h1>
        ) : (
          <h1 className="text-2xl font-bold text-slate-900">
            Results for &ldquo;{query}&rdquo;
            <span className="ml-3 text-base font-normal text-slate-500">
              {results.length} deal{results.length !== 1 ? "s" : ""} found
            </span>
          </h1>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-slate-900 font-semibold text-lg mb-2">No deals found for &ldquo;{query}&rdquo;</p>
          <p className="text-slate-500 text-sm">
            Try a brand name or product type, e.g. &ldquo;AirPods&rdquo;, &ldquo;moisturiser&rdquo;, or &ldquo;nappies&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
