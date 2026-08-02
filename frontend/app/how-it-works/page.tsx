export const metadata = {
  title: "How It Works | DupeDeals",
  description: "How DupeDeals finds you sale alerts and dupes for the products you love.",
}

const steps = [
  {
    number: "01",
    title: "We track prices",
    body: "Our system watches prices across trusted UK retailers around the clock, so a genuine price drop never slips past you.",
  },
  {
    number: "02",
    title: "We curate dupes",
    body: "For popular premium products, we research and hand-pick cheaper alternatives that match on ingredients, specs, or performance.",
  },
  {
    number: "03",
    title: "You browse or search",
    body: "Check the live deals on the homepage, browse by category, or search for something specific you've already got your eye on.",
  },
  {
    number: "04",
    title: "You buy with confidence",
    body: "Every listing links straight to the retailer's own checkout. We never handle your payment details or hold your order.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">How It Works</h1>
      <p className="text-violet-600 font-semibold mb-8">From full price to fair price, in four steps.</p>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6">
            <span className="text-2xl font-black text-violet-200 shrink-0">{step.number}</span>
            <div>
              <h2 className="font-bold text-slate-900 mb-1">{step.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-violet-100 bg-violet-50 p-6">
        <h2 className="font-bold text-slate-900 mb-1">Still have questions?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Use the chat button in the bottom right, or read more{" "}
          <a href="/about" className="text-violet-600 hover:underline">about DupeDeals</a>.
        </p>
      </div>
    </div>
  )
}
