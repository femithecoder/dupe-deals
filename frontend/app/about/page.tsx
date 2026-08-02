import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | DupeDeals",
  description: "Learn about DupeDeals, the UK's go-to site for finding cheaper alternatives to premium products.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">About DupeDeals</h1>
      <p className="text-violet-600 font-semibold mb-8">Quality products. Half the price.</p>

      <div className="prose prose-slate prose-violet max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          DupeDeals was built on a simple idea: you shouldn&apos;t have to pay a premium price to get a quality product. Whether it&apos;s a £175 moisturiser, a £300 air fryer, or a £30 pack of nappies, there&apos;s almost always a cheaper alternative that does the same job.
        </p>
        <p>
          We&apos;re a UK-based deals and recommendations site that does two things:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 not-prose my-8">
          {[
            {
              icon: "🏷️",
              title: "Sale alerts",
              body: "We track when products from trusted UK retailers drop in price, so you can buy at the right time.",
            },
            {
              icon: "✦",
              title: "Dupe finder",
              body: "We curate affordable alternatives to expensive brands: same quality, fraction of the cost.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.body}</p>
            </div>
          ))}
        </div>

        <p>
          Every product on DupeDeals links directly to a trusted UK retailer: Boots, John Lewis, Currys, Argos, Dunelm and more. We earn a small affiliate commission if you buy through our links, which keeps the site running at no extra cost to you.
        </p>

        <p>
          We&apos;re honest about what we do. We only feature products we&apos;d genuinely recommend, and our dupe comparisons are based on real ingredients, specs, and consumer test results, not brand hype.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Get in touch</h2>
        <p>
          Got a product suggestion, a deal tip, or just want to say hi? Use the chat button in the bottom right, or email us at{" "}
          <a href="mailto:hello@dupedeals.co.uk" className="text-violet-600 hover:underline">
            hello@dupedeals.co.uk
          </a>
          .
        </p>
      </div>
    </div>
  )
}
