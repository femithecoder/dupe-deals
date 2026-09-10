import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Server-side contact-form send. The browser can't send email itself, so the
// form POSTs here and we relay the message through the Zoho mailbox over SMTP.
// Credentials live only in env vars (never in client code):
//   CONTACT_SMTP_USER  e.g. contactus@dupedeals.co.uk
//   CONTACT_SMTP_PASS  a Zoho app-specific password (not the account password)
// Optional overrides: CONTACT_SMTP_HOST (default smtp.zoho.eu),
//   CONTACT_SMTP_PORT (default 465), CONTACT_TO (default = CONTACT_SMTP_USER).
//
// nodemailer needs the Node.js runtime (not edge).
export const runtime = "nodejs"

// Strip CR/LF so a field value can't inject extra email headers.
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim()
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(req: NextRequest) {
  const user = process.env.CONTACT_SMTP_USER
  const pass = process.env.CONTACT_SMTP_PASS
  if (!user || !pass) {
    // Not configured yet: tell the client so it can fall back to mailto.
    return NextResponse.json(
      { error: "Contact email is not configured on the server." },
      { status: 503 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Honeypot: real users leave this empty; bots tend to fill every field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  // Two senders share this route: the contact form and the deal submission
  // form. Only the composed message differs. The SMTP config, the honeypot and
  // the header-injection guard are the parts worth not duplicating.
  const kind = body.kind === "deal" ? "deal" : "contact"

  const name = oneLine(String(body.name ?? ""))
  const email = oneLine(String(body.email ?? ""))

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 })
  }

  let subject: string
  let text: string

  if (kind === "deal") {
    const productName = oneLine(String(body.productName ?? ""))
    const link = oneLine(String(body.link ?? ""))
    const price = oneLine(String(body.price ?? ""))
    const notes = String(body.notes ?? "").trim()

    if (!productName || !link) {
      return NextResponse.json({ error: "Product name and link are required." }, { status: 400 })
    }
    if (!/^https?:\/\//i.test(link)) {
      return NextResponse.json(
        { error: "The link needs to start with http:// or https://" },
        { status: 400 }
      )
    }

    subject = `Deal: ${productName}`
    text = [
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
  } else {
    const formSubject = oneLine(String(body.subject ?? ""))
    const message = String(body.message ?? "").trim()

    if (!message) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 })
    }

    // Set when the message came from a "Tell us" link, so the email says
    // which page is being reported without the sender having to describe it.
    const about = oneLine(String(body.about ?? ""))

    subject = formSubject ? `Contact: ${formSubject}` : "New contact form message"
    text = [`Name: ${name}`, `Email: ${email}`, about ? `Page: ${about}` : null, "", message]
      .filter((line) => line !== null)
      .join("\n")
  }

  const host = process.env.CONTACT_SMTP_HOST || "smtp.zoho.eu"
  const port = Number(process.env.CONTACT_SMTP_PORT || 465)
  const to = process.env.CONTACT_TO || user

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  try {
    await transporter.sendMail({
      // From must be our own mailbox so SPF/DKIM line up; the visitor's
      // address goes in replyTo so hitting reply answers them directly.
      from: `"DupeDeals ${kind === "deal" ? "deal submissions" : "contact form"}" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[contact] ${kind} send failed:`, err)
    return NextResponse.json({ error: "Could not send the message." }, { status: 502 })
  }
}
