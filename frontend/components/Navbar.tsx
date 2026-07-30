"use client"

import Link from "next/link"
import { useState } from "react"
import SearchBar from "./SearchBar"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-black text-sm shadow-sm">
              DD
            </span>
            <span className="font-bold text-lg text-slate-900">
              Dupe<span className="text-violet-600">Deals</span>
            </span>
          </Link>

          {/* Search — hidden on mobile */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-auto">
            <Link
              href="/category/beauty-skincare"
              className="px-3 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
            >
              Beauty
            </Link>
            <Link
              href="/category/baby-kids"
              className="px-3 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
            >
              Baby & Kids
            </Link>
            <Link
              href="/category/home-kitchen"
              className="px-3 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
            >
              Home
            </Link>
            <Link
              href="/category/electronics-tech"
              className="px-3 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
            >
              Tech
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="ml-auto md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-600"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          {[
            { href: "/category/beauty-skincare", label: "Beauty & Skincare" },
            { href: "/category/baby-kids", label: "Baby & Kids" },
            { href: "/category/home-kitchen", label: "Home & Kitchen" },
            { href: "/category/electronics-tech", label: "Electronics & Tech" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
