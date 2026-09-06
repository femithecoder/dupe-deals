"use client"

import { track } from "@vercel/analytics"

type ViewDealButtonProps = {
  productId: string
  productName: string
  merchant: string
}

export default function ViewDealButton({ productId, productName, merchant }: ViewDealButtonProps) {
  return (
    <a
      // Goes through our own /go redirect so the click is counted server-side.
      // The track() call below only fires for visitors without an ad blocker,
      // which is exactly the population that is already easy to count.
      href={`/go/${productId}`}
      target="_blank"
      // noreferrer is deliberately absent: it would strip the Referer on the
      // way to our own /go route, leaving the referrer column always null, and
      // would also hide our domain from the affiliate network on the hop after
      // it. noopener still blocks window.opener access.
      rel="noopener sponsored"
      onClick={() => track("view_deal_click", { productId, productName, merchant })}
      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 px-6 font-bold text-white hover:bg-violet-700 transition"
    >
      View deal at {merchant} →
    </a>
  )
}
