export type MerchantTrust = {
  rating: number
  reviewCount: number
  source: string
  url: string
  // A condition of buying that the price alone does not reveal, e.g. a
  // mandatory paid membership. Shown next to the buy button, because a
  // shopper who arrives from search never sees what a blog post explains.
  notice?: string
}

// Seller-level reputation, not a product rating. Keyed by exact merchant name.
// Only add entries with a real, verifiable source, never estimate or reuse a
// product rating here, and never reuse this as a product's own rating.
export const merchantTrust: Record<string, MerchantTrust> = {
  "Quzo UK": {
    rating: 4.0,
    reviewCount: 740,
    source: "Trustpilot",
    url: "https://uk.trustpilot.com/review/quzo.co.uk",
  },
  // 3.2 is polarised rather than mediocre: 54% five-star against 38%
  // one-star. The one-star reviews are almost all about the membership,
  // which their own terms confirm rather than contradict: "To make a
  // purchase with Plusshop, the customer must subscribe to a membership."
  // £9.95/month, free for 14 days, cancellable but not within the first
  // 24 hours, and no refunds. So our listed price is not one a new
  // customer can pay on its own, which is exactly what `notice` exists to
  // say. Terms checked 2026-09-07, last updated by them 25 June 2026.
  "Plusshop UK": {
    rating: 3.2,
    reviewCount: 39,
    source: "Trustpilot",
    url: "https://www.trustpilot.com/review/uk.plusshop.com",
    notice:
      "Plusshop requires a £9.95 per month membership to buy anything. It is free for the first 14 days and you can cancel, but you have to remember to, and there are no refunds. Worth it if you shop there regularly, not for a single item.",
  },
}

export function getMerchantTrust(merchant: string): MerchantTrust | undefined {
  return merchantTrust[merchant]
}
