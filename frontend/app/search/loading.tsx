import { LoadingRegion, SkeletonGrid } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <LoadingRegion label="Searching">
        <div className="h-8 w-64 rounded bg-slate-100 animate-pulse mb-8" />
        <SkeletonGrid count={4} />
      </LoadingRegion>
    </div>
  )
}
