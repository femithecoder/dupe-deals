import Link from "next/link"

/**
 * A way to tell us a page is wrong, from the page that is wrong.
 *
 * Visitors click through to the retailer constantly, so they see a stale feed
 * price before we do, and they read a post more carefully than a checker can.
 * Neither had any route to report it: the only contact link was in the footer,
 * and reaching it meant describing from memory which page they had been on.
 *
 * The subject and the path travel in the query string so the message arrives
 * already saying what it is about. Nothing personal goes in the URL.
 */
export default function ReportIssue({
  prompt,
  subject,
  path,
}: {
  prompt: string
  subject: string
  path: string
}) {
  const href = `/contact?subject=${encodeURIComponent(subject)}&about=${encodeURIComponent(path)}`

  return (
    <p className="mt-10 border-t border-slate-100 pt-5 text-sm text-slate-500">
      {prompt}{" "}
      <Link href={href} className="font-semibold text-violet-600 hover:underline">
        Tell us
      </Link>{" "}
      and we&apos;ll fix it.
    </p>
  )
}
