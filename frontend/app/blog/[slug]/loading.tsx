import { LoadingRegion, SkeletonLine } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <LoadingRegion label="Loading this guide">
        <div className="h-4 w-32 rounded bg-slate-100 animate-pulse mb-4" />
        <div className="h-10 w-full rounded bg-slate-100 animate-pulse mb-3" />
        <div className="h-10 w-2/3 rounded bg-slate-100 animate-pulse mb-8" />
        <div className="aspect-[2/1] rounded-2xl bg-slate-100 animate-pulse mb-10" />
        <div className="space-y-3">
          {["w-full", "w-full", "w-5/6", "w-full", "w-2/3", "w-full", "w-3/4"].map((w, i) => (
            <SkeletonLine key={i} w={w} />
          ))}
        </div>
      </LoadingRegion>
    </div>
  )
}
