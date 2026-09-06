import { NextResponse } from "next/server"
import { fetchProductById } from "@/lib/api"
import { SITE_URL } from "@/lib/site"

// Every click has to reach the server, so this must never be cached or
// prerendered.
export const dynamic = "force-dynamic"

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL

/**
 * Outbound affiliate redirect, so a click is counted on our own domain before
 * it leaves for the network.
 *
 * This does not defeat ad blockers. The browser still has to land on the
 * network's domain for the tracking cookie to be set, and that navigation is
 * what gets blocked. What it does give us is a first-party click count that a
 * blocker cannot suppress, so the gap between our count and the network's
 * reported clicks becomes measurable instead of invisible.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await fetchProductById(id)

  if (!product?.affiliateUrl) {
    return NextResponse.redirect(new URL("/", SITE_URL), 302)
  }

  await recordClick(id, product.merchant, request.headers.get("referer"))

  // 302 rather than 301: a permanent redirect would be cached by the browser
  // and later clicks would skip the server entirely, losing the count. It also
  // keeps the affiliate URL swappable without stale redirects lingering.
  return NextResponse.redirect(product.affiliateUrl, 302)
}

async function recordClick(productId: string, merchant: string, referrer: string | null) {
  if (!GATEWAY) return

  try {
    // Bounded so a slow or down gateway delays the redirect by at most a
    // moment. Getting the visitor to the retailer beats recording that we did.
    // /api is the prefix the gateway proxies on, it strips /api and forwards
    // to product-service's /clicks (same convention as lib/api.ts).
    await fetch(`${GATEWAY}/api/clicks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, merchant, referrer }),
      signal: AbortSignal.timeout(1000),
      cache: "no-store",
    })
  } catch (err) {
    console.error(`[go] failed to record click for product ${productId}:`, err)
  }
}
