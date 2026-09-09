import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

/**
 * The CMS writes frontmatter without quotes, and YAML reads an unquoted
 * 2026-08-10 as a timestamp rather than a string. So a post edited through
 * /admin returns a Date here while every hand-written one returns a string.
 *
 * That difference shipped a real bug: article:published_time rendered as
 * "[object Object]" on the first post edited in the CMS, because the value was
 * passed straight into a meta tag. Normalising here means the site does not
 * care how the frontmatter was written.
 */
function isoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return typeof value === "string" ? value : ""
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  coverImage: string
  readingTime: string
  content: string
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8")
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? "",
        date: isoDate(data.date),
        author: data.author ?? "DupeDeals",
        category: data.category ?? "General",
        coverImage: data.coverImage ?? "",
        readingTime: readingTime(content).text,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`)
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : filePath

  if (!fs.existsSync(fullPath)) return null

  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date: isoDate(data.date),
    author: data.author ?? "DupeDeals",
    category: data.category ?? "General",
    coverImage: data.coverImage ?? "",
    readingTime: readingTime(content).text,
    content,
  }
}

/**
 * Posts that link to a given product. Lets a product page point back at the
 * guide covering it, so a post outside a topic cluster still earns inbound
 * links instead of hanging off the blog index alone.
 */
export function getPostsForProduct(productId: string): Omit<BlogPost, "content">[] {
  const pattern = new RegExp(`\\]\\(/product/${productId}(?![0-9])`)
  return getAllPosts().filter((post) => {
    const full = getPostBySlug(post.slug)
    return full ? pattern.test(full.content) : false
  })
}
