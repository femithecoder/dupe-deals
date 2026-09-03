"use client"

import { useState } from "react"

const CONTACT_EMAIL = "contactus@dupedeals.co.uk"

type Status = "idle" | "sending" | "sent" | "fallback" | "error"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [company, setCompany] = useState("") // honeypot, hidden from users
  const [status, setStatus] = useState<Status>("idle")

  function openMailto() {
    const mailSubject = subject ? `Contact: ${subject}` : "Contact form message"
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n")
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, company }),
      })
      if (res.ok) {
        setStatus("sent")
        return
      }
      // Server can't send (e.g. not configured, or a send error): fall back to
      // opening the visitor's email app with the message pre-filled.
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
        <p className="font-bold text-slate-900 mb-1">Message sent</p>
        <p className="text-sm text-slate-600">
          Thanks, we&apos;ve got your message and will reply to {email || "your email"} soon.
        </p>
      </div>
    )
  }

  if (status === "fallback") {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center">
        <p className="font-bold text-slate-900 mb-1">Almost there</p>
        <p className="text-sm text-slate-600">
          We&apos;ve opened your email app with your message ready, just hit send. Didn&apos;t open? Email us
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
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Your email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's this about?"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1">Message</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          rows={5}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Honeypot: visually hidden, real users never fill this. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  )
}
