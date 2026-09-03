import type { PricePoint } from "@/lib/api"

// How long ago we last recorded a price for this product, in plain words. The
// point is honesty: our price comes from a periodic retailer feed, not a live
// lookup, so we timestamp it rather than imply it is current to the second.
function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.round(ms / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export default function PriceFreshness({ history }: { history: PricePoint[] }) {
  if (!history || history.length === 0) return null
  const lastChecked = history[history.length - 1].checkedAt
  return <>Price last checked {timeAgo(lastChecked)}. </>
}
