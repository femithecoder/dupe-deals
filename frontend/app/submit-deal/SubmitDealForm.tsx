"use client"

import { useState } from "react"

const CONTACT_EMAIL = "contactus@dupedeals.co.uk"

type Status = "idle" | "sending" | "sent" | "fallback" | "error"

const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"

export default function SubmitDealForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [productName, setProductName] = useState("")
  const [link, setLink] = useState("")
  const [price, setPrice] = useState("")
  const [notes, setNotes] = useState("")
  const [company, setCompany] = useState("") // honeypot, hidden from users
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  function openMailto() {
    const subject = `Deal: ${productName}`
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      `Product: ${productName}`,
      `Link: ${link}`,
      price ? `Price: ${price}` : null,
      notes ? `\nNotes:\n${notes}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n")
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "deal", name, email, productName, link, price, notes, company }),
      })
      if (res.ok) {
        setStatus("sent")
        return
      }
      // A 400 is the submission's own fault, so say what is wrong rather than
      // handing it to an email client that cannot fix it either.
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Please check the details and try again.")
        setStatus("error")
        return
      }
      // Anything else means we cannot send it: not configured, or SMTP is
      // down. Fall back to the visitor's own email app rather than lose it.
      openMailto()
      setStatus("fallback")
    } catch {
      openMailto()
      setStatus("fallback")
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
        <p className="font-bold text-slate-900 mb-1">Deal sent</p>
        <p className="text-sm text-slate-600">
          Thanks. We&apos;ll check the price and reply to {email || "your email"} if we feature it.
        </p>
      </div>
    )
  }

  if (status === "fallback") {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center">
        <p className="font-bold text-slate-900 mb-1">Almost there</p>
        <p className="text-sm text-slate-600">
          We&apos;ve opened your email app with the details ready, just hit send. Didn&apos;t open? Email us
          directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-600 hover:underline">
            {CONTACT_EMAIL}
          </a>{" "}
          or{" "}
          <button onClick={() => setStatus("idle")} className="text-violet-600 hover:underline">
            try again
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Your name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className={field} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Your email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
        <p className="mt-1 text-xs text-slate-500">So we can tell you if we feature it. We won&apos;t add you to anything.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Product</label>
        <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="What is it?" className={field} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Link</label>
        <input type="url" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className={field} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">
          Price <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="£29.99" className={field} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">
          Anything else <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What makes it a good find?" rows={4} className={field} />
      </div>

      {/* Honeypot: visually hidden, real users never fill this. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      {status === "error" && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send deal"}
      </button>
    </form>
  )
}
