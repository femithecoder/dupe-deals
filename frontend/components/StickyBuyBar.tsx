"use client"

import { useEffect, useRef, useState } from "react"
import { track } from "@vercel/analytics"

/**
 * Mobile-only buy bar, pinned to the bottom once the main button scrolls away.
 *
 * A product page is long: price, chart, trust notice, description, related
 * items. On a phone the only way to buy was to scroll back up, and that is
 * where people give up. It appears only below the `sm` breakpoint, because on
 * a desktop the main button is usually still on screen.
 */
export default function StickyBuyBar({
  productId,
  productName,
  merchant,
  price,
}: {
  productId: string
  productName: string
  merchant: string
  price: string
}) {
  const [show, setShow] = useState(false)
  const sentinel = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // The bar mirrors the main button, so showing both at once is noise.
    // Watch the real button and only take over once it has left the screen.
    const target = document.getElementById("primary-buy-button")
    if (!target) return
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 })
    io.observe(target)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={sentinel}>
      <div
        className={`sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 transition-transform duration-200 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
        // Hidden from assistive tech and from tabbing while off screen, so it
        // is not a focus trap sitting below the page.
        aria-hidden={!show}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500">{productName}</p>
            <p className="font-bold text-slate-900 leading-tight">{price}</p>
          </div>
          <a
            href={`/go/${productId}`}
            target="_blank"
            rel="noopener sponsored"
            tabIndex={show ? 0 : -1}
            onClick={() => track("view_deal_click", { productId, productName, merchant, placement: "sticky" })}
            className="ml-auto shrink-0 rounded-xl bg-violet-600 py-3 px-5 text-sm font-bold text-white hover:bg-violet-700 transition"
          >
            View deal →
          </a>
        </div>
      </div>
    </div>
  )
}
