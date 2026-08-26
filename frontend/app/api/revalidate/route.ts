import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Called by product-service right after a price-check finds real changes, so
// product/category pages pick up new prices immediately instead of waiting
// on the next request to lazily trigger ISR's background regeneration (which
// is what let stale mock-data prices sit on the live site unnoticed).
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET is not configured on this server" }, { status: 503 })
  }
  if (req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // { expire: 0 } for immediate expiration, this is a webhook from
  // product-service firing right after a real price change, not a page
  // visit, so the default stale-while-revalidate delay isn't appropriate
  revalidateTag("products", { expire: 0 })
  return NextResponse.json({ revalidated: true, tag: "products" })
}
