import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/mock-data"
import DealBadge from "./DealBadge"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2">
          <DealBadge percent={product.discountPercent} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <p className="text-xs text-slate-500 font-medium">{product.merchant}</p>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
          {product.name}
        </h3>

        {product.dupeFor && (
          <p className="text-xs text-violet-600 font-medium">
            Dupe for: <span className="font-semibold">{product.dupeFor}</span>
          </p>
        )}

        {/* Pricing */}
        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-slate-900">
              £{product.salePrice.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 line-through">
              £{product.originalPrice.toFixed(2)}
            </p>
          </div>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="text-amber-400">★</span>
              <span>{product.rating}</span>
              <span>({product.reviewCount.toLocaleString()})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
