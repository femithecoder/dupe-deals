// Shared loading placeholders. The gateway runs on Render's free tier and
// spins down when idle, so a cold start can take the best part of a minute.
// Without these a visitor sees a blank page and no sign anything is happening.

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="aspect-square bg-slate-100 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
        <div className="h-5 w-1/2 rounded bg-slate-100 animate-pulse mt-3" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} rounded bg-slate-100 animate-pulse`} />
}

/** Announce to screen readers that something is loading, once per route. */
export function LoadingRegion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
