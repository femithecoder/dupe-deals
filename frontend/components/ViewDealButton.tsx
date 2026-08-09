"use client"

import { track } from "@vercel/analytics"

type ViewDealButtonProps = {
  productId: string
  productName: string
  merchant: string
  affiliateUrl: string
}

export default function ViewDealButton({ productId, productName, merchant, affiliateUrl }: ViewDealButtonProps) {
  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => track("view_deal_click", { productId, productName, merchant })}
      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 px-6 font-bold text-white hover:bg-violet-700 transition"
    >
      View deal at {merchant} →
    </a>
  )
}
