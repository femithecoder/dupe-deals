import type { Metadata } from "next"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | DupeDeals",
  description: "Get in touch with the DupeDeals team. Questions, feedback, or a price that looks wrong, we'd love to hear from you.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-black text-slate-900 mb-4">Contact us</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Got a question, some feedback, or spotted a price that looks off? Send us a message below and we&apos;ll get
        back to you. You can also email us directly at{" "}
        <a href="mailto:contactus@dupedeals.co.uk" className="text-violet-600 hover:underline">
          contactus@dupedeals.co.uk
        </a>
        .
      </p>

      <ContactForm />
    </div>
  )
}
