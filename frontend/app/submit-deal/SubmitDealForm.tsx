"use client"

import { useState } from "react"

export default function SubmitDealForm() {
  const [productName, setProductName] = useState("")
  const [link, setLink] = useState("")
  const [price, setPrice] = useState("")
  const [notes, setNotes] = useState("")
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = `Deal submission: ${productName}`
    const body = [
      `Product: ${productName}`,
      `Link: ${link}`,
      `Price: ${price}`,
      notes ? `Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    window.location.href = `mailto:hello@dupedeals.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center">
        <p className="font-bold text-slate-900 mb-1">Almost there</p>
        <p className="text-sm text-slate-600">
          We&apos;ve opened your email app with the details filled in, just hit send. Didn&apos;t open?{" "}
          <button onClick={() => setSent(false)} className="text-violet-600 hover:underline">
            Try again
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Product name</label>
        <input
          type="text"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. L'Oréal Revitalift Serum"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Link to the deal</label>
        <input
          type="url"
          required
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Price</label>
        <input
          type="text"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="£19.99"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What's it a dupe for, or why's it a good deal?"
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition"
      >
        Submit deal
      </button>
    </form>
  )
}
