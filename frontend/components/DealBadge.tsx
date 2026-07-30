export default function DealBadge({ percent }: { percent: number }) {
  const colour =
    percent >= 40
      ? "bg-emerald-500"
      : percent >= 25
      ? "bg-amber-500"
      : "bg-blue-500"

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold text-white ${colour}`}
    >
      -{percent}%
    </span>
  )
}
