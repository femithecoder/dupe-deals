import Link from "next/link"
import type { Category } from "@/lib/mock-data"

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl p-5 min-h-36 hover:shadow-lg transition-all duration-200"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.colour} opacity-90 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <span className="text-3xl mb-2 block">{category.icon}</span>
        <h3 className="font-bold text-white text-base leading-tight">{category.name}</h3>
        <p className="text-white/80 text-xs mt-0.5">{category.productCount} deals</p>
      </div>
    </Link>
  )
}
