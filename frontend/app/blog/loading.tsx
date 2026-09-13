import { LoadingRegion, SkeletonLine } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <LoadingRegion label="Loading the blog">
        <div className="h-8 w-48 rounded bg-slate-100 animate-pulse mb-8" />
        <div className="grid gap-8 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="aspect-[2/1] bg-slate-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <SkeletonLine w="w-1/4" />
                <SkeletonLine />
                <SkeletonLine w="w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </LoadingRegion>
    </div>
  )
}
