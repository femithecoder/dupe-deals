import SubmitDealForm from "./SubmitDealForm"

export const metadata = {
  title: "Submit a Deal | DupeDeals",
  description: "Found a great deal or dupe? Let us know and we might feature it.",
}

export default function SubmitDealPage() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">Submit a Deal</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Spotted a price drop or a dupe worth sharing? Tell us about it below and, if it checks out, we&apos;ll feature it
        on the site.
      </p>

      <SubmitDealForm />
    </div>
  )
}
