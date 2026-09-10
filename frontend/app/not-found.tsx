import Link from "next/link"

// Reached two ways: an unmatched URL, and notFound() from a product, post or
// category page. That second route is the important one. A product we delisted
// or a post we pulled is exactly the moment someone wants to tell us something
// is wrong, and until now they landed on the framework's bare default with no
// way to do it and nowhere to go.

const CATEGORIES = [
  { slug: "beauty-skincare", label: "Beauty & Skincare" },
  { slug: "baby-kids", label: "Baby & Kids" },
  { slug: "home-kitchen", label: "Home & Kitchen" },
  { slug: "electronics-tech", label: "Electronics & Tech" },
]

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-violet-600 font-semibold mb-2">404</p>
      <h1 className="text-3xl font-black text-slate-900 mb-4">We can&apos;t find that page</h1>
      <p className="text-slate-500 mb-10 leading-relaxed">
        The link may be out of date, or a deal may have ended and been taken down. Prices and products change often
        here, so pages do sometimes retire.
      </p>

      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-3">Try one of these</h2>
      <ul className="space-y-2 mb-10">
        <li>
          <Link href="/" className="text-violet-600 hover:underline">
            Today&apos;s deals
          </Link>
        </li>
        <li>
          <Link href="/blog" className="text-violet-600 hover:underline">
            Our buying guides
          </Link>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link href={`/category/${c.slug}`} className="text-violet-600 hover:underline">
              {c.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
        <p className="font-bold text-slate-900 mb-1">Did we break a link?</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          If you followed a link from somewhere on this site and ended up here, that is our mistake and we would like
          to know. Email{" "}
          <a href="mailto:contactus@dupedeals.co.uk" className="text-violet-600 hover:underline">
            contactus@dupedeals.co.uk
          </a>{" "}
          or use the{" "}
          <Link href="/contact" className="text-violet-600 hover:underline">
            contact form
          </Link>
          , and tell us which page sent you.
        </p>
      </div>
    </div>
  )
}
