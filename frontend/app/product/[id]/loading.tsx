import { LoadingRegion, SkeletonLine } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <LoadingRegion label="Loading this product">
        <SkeletonLine w="w-64" />
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-slate-100 animate-pulse" />
          <div className="space-y-4">
            <SkeletonLine w="w-24" />
            <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-8 w-2/3 rounded bg-slate-100 animate-pulse" />
            <SkeletonLine />
            <SkeletonLine w="w-5/6" />
            <div className="h-12 w-40 rounded bg-slate-100 animate-pulse mt-6" />
            <div className="h-12 w-full rounded-xl bg-slate-100 animate-pulse" />
          </div>
        </div>
      </LoadingRegion>
    </div>
  )
}
