import type { PricePoint } from "@/lib/api"

// Distills tracked price history into a single meaningful line, or nothing.
// We deliberately stay silent unless there is something worth telling a
// shopper: a price that is currently at its tracked low, or that has come
// down from a recent high. A flat or barely-moving price says nothing useful,
// and an empty widget is worse than no widget.
function derivePriceInsight(history: PricePoint[], currentPrice: number) {
  if (!history || history.length < 2) return null

  const prices = history.map((h) => h.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  // Price never moved across the tracked window, nothing to report.
  if (max - min < 0.01) return null

  // Half a penny of slack absorbs floating-point noise without ever claiming
  // a low the current price has not actually reached.
  const isLowest = currentPrice <= min + 0.005

  const droppedFrom = max > currentPrice + 0.01 ? max : null
  const dropAmount = droppedFrom ? droppedFrom - currentPrice : 0

  if (!isLowest && dropAmount < 0.01) return null

  const firstAt = new Date(history[0].checkedAt).getTime()
  const days = Math.max(1, Math.round((Date.now() - firstAt) / 86_400_000))

  return { isLowest, dropAmount, droppedFrom, days }
}

export default function PriceInsight({
  history,
  currentPrice,
}: {
  history: PricePoint[]
  currentPrice: number
}) {
  const insight = derivePriceInsight(history, currentPrice)
  if (!insight) return null

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {insight.isLowest && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-emerald-700 font-semibold">
          <span aria-hidden>▼</span>
          Lowest price in the last {insight.days} {insight.days === 1 ? "day" : "days"}
        </span>
      )}
      {insight.dropAmount >= 0.01 && insight.droppedFrom !== null && (
        <span className="text-slate-500">
          Down £{insight.dropAmount.toFixed(2)} from a recent £{insight.droppedFrom.toFixed(2)}
        </span>
      )}
    </div>
  )
}
