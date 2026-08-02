export const metadata = {
  title: "Affiliate Disclosure | DupeDeals",
  description: "How DupeDeals makes money from affiliate links.",
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">Affiliate Disclosure</h1>
      <p className="text-violet-600 font-semibold mb-8">How we make money, in plain English.</p>

      <div className="prose prose-slate prose-violet max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          DupeDeals is free to use and always will be. To cover the cost of running the site, we use affiliate
          links.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">What that means</h2>
        <p>
          When you click through to a retailer from DupeDeals and make a purchase, we may earn a small commission
          from that retailer. This comes at no extra cost to you. The price you pay is the same whether you reach
          the retailer through us or find it yourself.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">It doesn&apos;t change what we recommend</h2>
        <p>
          Commission never decides what makes it onto DupeDeals. We only feature price drops and dupes we&apos;d
          genuinely recommend, and our comparisons are based on real ingredients, specs, and consumer test results,
          not which retailer pays the highest commission.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Retailers we work with</h2>
        <p>
          We link to trusted UK retailers including Boots, John Lewis, Currys, Argos, and Dunelm, among others, via
          their affiliate programmes.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Questions</h2>
        <p>
          If you have any questions about how we&apos;re funded, email us at{" "}
          <a href="mailto:hello@dupedeals.co.uk" className="text-violet-600 hover:underline">hello@dupedeals.co.uk</a>.
        </p>
      </div>
    </div>
  )
}
