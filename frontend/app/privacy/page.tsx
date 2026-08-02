export const metadata = {
  title: "Privacy Policy — DupeDeals",
  description: "How DupeDeals collects, uses, and protects your information.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-8">Last updated 2 August 2026</p>

      <div className="prose prose-slate prose-violet max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p>
          DupeDeals (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains what information we collect when
          you use dupedeals.co.uk, why we collect it, and what rights you have over it.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">What we collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Usage data such as pages viewed, searches made, and device/browser type, collected automatically via analytics.</li>
          <li>Information you give us directly, such as your email address if you contact us or submit a deal.</li>
          <li>Chat messages sent through our on-site support chat, so we can respond to your query.</li>
        </ul>
        <p>We do not collect payment details — all purchases happen on the retailer&apos;s own site.</p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">How we use it</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To operate and improve the site, including which deals and dupes we surface.</li>
          <li>To respond to messages sent via chat or email.</li>
          <li>To measure aggregate site performance. We do not sell your personal data.</li>
        </ul>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Cookies</h2>
        <p>
          We use essential cookies to run the site and analytics cookies to understand how it&apos;s used. You can control
          cookies through your browser settings at any time.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Third parties</h2>
        <p>
          Links to retailers take you to their own sites, which have their own privacy policies. We aren&apos;t
          responsible for how third-party sites handle your data.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Your rights</h2>
        <p>
          Under UK GDPR, you can ask us what data we hold about you, request a correction, or ask us to delete it.
          Contact us at{" "}
          <a href="mailto:hello@dupedeals.co.uk" className="text-violet-600 hover:underline">hello@dupedeals.co.uk</a>{" "}
          to make a request.
        </p>

        <h2 className="text-xl font-black text-slate-900 mt-10 mb-2">Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected by updating the date at
          the top of this page.
        </p>
      </div>
    </div>
  )
}
