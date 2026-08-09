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
}

export function getMerchantTrust(merchant: string): MerchantTrust | undefined {
  return merchantTrust[merchant]
}
