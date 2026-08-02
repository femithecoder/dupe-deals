import Link from "next/link"
import Image from "next/image"
import { getAllPosts } from "@/lib/blog"

export const metadata = {
  title: "Blog | DupeDeals",
  description: "Dupe guides, honest comparisons, and money-saving tips for UK shoppers.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">The DupeDeals Blog</h1>
        <p className="text-slate-500">Honest comparisons, dupe guides, and money-saving tips.</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-200"
            >
              {post.coverImage && (
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 p-5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">{post.readingTime}</span>
                </div>
                <h2 className="font-bold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <p className="mt-auto pt-2 text-xs text-slate-400">
                  {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
