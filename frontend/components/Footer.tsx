import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-black text-xs shadow-sm">
                DD
              </span>
              <span className="font-bold text-slate-900">
                Dupe<span className="text-violet-600">Deals</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Cheaper alternatives to the products you love, curated for UK shoppers.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Categories</h4>
            <ul className="space-y-2">
              {[
                { href: "/category/beauty-skincare", label: "Beauty & Skincare" },
                { href: "/category/baby-kids", label: "Baby & Kids" },
                { href: "/category/home-kitchen", label: "Home & Kitchen" },
                { href: "/category/electronics-tech", label: "Electronics & Tech" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-violet-600 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Info</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-violet-600 transition">About</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-slate-500 hover:text-violet-600 transition">How it works</Link></li>
              <li><Link href="/submit-deal" className="text-sm text-slate-500 hover:text-violet-600 transition">Submit a deal</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-violet-600 transition">Contact us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-violet-600 transition">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 hover:text-violet-600 transition">Terms</Link></li>
              <li><Link href="/affiliate-disclosure" className="text-sm text-slate-500 hover:text-violet-600 transition">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} DupeDeals. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            We earn a commission on purchases made through our links.
          </p>
        </div>
      </div>
    </footer>
  )
}
