export const metadata = {
  title: "Terms of Service | DupeDeals",
  description: "The terms that govern your use of DupeDeals.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">Terms of Service</h1>
      <p className="text-slate-400 text-sm mb-8">Last updated 2 August 2026</p>

      <div className="prose prose-slate prose-violet max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          By using dupedeals.co.uk, you agree to these terms. If you don&apos;t agree with them, please don&apos;t use the
          site.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">What DupeDeals is</h2>
        <p>
          DupeDeals is a UK-based deals and recommendations site. We surface price drops and curate alternative
          products from third-party retailers. We are not a retailer ourselves. We don&apos;t sell products, process
          payments, or hold stock.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Accuracy of information</h2>
        <p>
          We do our best to keep prices, stock, and product details accurate, but retailers change these constantly
          and we can&apos;t guarantee that what you see on DupeDeals matches what you see when you click through. Always
          confirm price and availability on the retailer&apos;s site before buying.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Affiliate links</h2>
        <p>
          Many links on this site are affiliate links. We may earn a commission if you make a purchase through them,
          at no extra cost to you. See our{" "}
          <a href="/affiliate-disclosure" className="text-violet-600 hover:underline">Affiliate Disclosure</a> for details.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Purchases and disputes</h2>
        <p>
          Any purchase you make happens directly with the retailer, under their own terms and conditions. Order
          issues, returns, refunds, and disputes should be raised with the retailer, not DupeDeals.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Acceptable use</h2>
        <p>
          You agree not to misuse the site, including attempting to scrape it at scale, interfere with its
          operation, or submit false or misleading deal information.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Liability</h2>
        <p>
          DupeDeals is provided &quot;as is&quot;. To the extent permitted by law, we aren&apos;t liable for losses arising from
          your reliance on information found on the site or your dealings with third-party retailers.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Changes</h2>
        <p>
          We may update these terms from time to time. Continuing to use the site after a change means you accept
          the updated terms.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:hello@dupedeals.co.uk" className="text-violet-600 hover:underline">hello@dupedeals.co.uk</a>.
        </p>
      </div>
    </div>
  )
}
