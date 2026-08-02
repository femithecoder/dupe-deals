import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import ReactMarkdown from "react-markdown"
import JsonLd from "@/components/JsonLd"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | DupeDeals Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={articleJsonLd} />
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6 flex gap-2">
        <Link href="/" className="hover:text-violet-600 transition">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-violet-600 transition">Blog</Link>
        <span>/</span>
        <span className="text-slate-900 truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">{post.readingTime}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 leading-tight mb-3">{post.title}</h1>
        <p className="text-slate-500 text-sm">
          By {post.author} ·{" "}
          {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-slate prose-violet max-w-none
        prose-headings:font-black prose-headings:text-slate-900
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-strong:text-slate-900
        prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
        prose-hr:border-slate-200
      ">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>

      {/* Back link */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <Link href="/blog" className="text-sm font-medium text-violet-600 hover:text-violet-700 transition">
          ← Back to blog
        </Link>
      </div>
    </div>
  )
}
