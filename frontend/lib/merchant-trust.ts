export type MerchantTrust = {
  rating: number
  reviewCount: number
  source: string
  url: string
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
  // Polarised rather than simply mediocre: 54% five-star against 38%
  // one-star, so the average hides the shape of it. The recurring
  // one-star complaint is a membership charge of roughly £10-15 a month
  // after a "14 day free trial" that reviewers say is disclosed in small
  // print. Shown here so the page discloses it rather than hiding it,
  // but the rating alone does not convey that specific risk. Checked
  // 2026-09-07.
  "Plusshop UK": {
    rating: 3.2,
    reviewCount: 39,
    source: "Trustpilot",
    url: "https://www.trustpilot.com/review/uk.plusshop.com",
  },
}

export function getMerchantTrust(merchant: string): MerchantTrust | undefined {
  return merchantTrust[merchant]
}
