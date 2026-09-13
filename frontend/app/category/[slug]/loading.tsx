import { LoadingRegion, SkeletonGrid } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <LoadingRegion label="Loading this category">
        <div className="h-8 w-56 rounded bg-slate-100 animate-pulse mb-2" />
        <div className="h-4 w-80 rounded bg-slate-100 animate-pulse mb-8" />
        <SkeletonGrid />
      </LoadingRegion>
    </div>
  )
}
