import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "./site"

// Limits Google truncates at, and that Ahrefs Site Audit flags against.
export const TITLE_MAX = 60
export const DESC_MAX = 155
export const DESC_MIN = 110

const BRAND_SUFFIX = ` | ${SITE_NAME}`

function cutAtWord(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(" ")
  const kept = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut
  return kept.replace(/[\s,.;:&/-]+$/, "")
}

/**
 * Retailer feed names front-load the useful part and then pile on specs
 * ("roborock Q7 M5 Robot Vacuum Cleaner with Mop, 10,000Pa Suction"), so cut at
 * the first comma when that still leaves a recognisable product, then hard-cap.
 * Only the <title> is shortened; pages still show the full name as their H1.
 */
export function shortenProductName(name: string, max = TITLE_MAX - BRAND_SUFFIX.length) {
  const comma = name.indexOf(",")
  const head = comma >= 15 ? name.slice(0, comma) : name
  return cutAtWord(head, max)
}

/** Append the brand only when it still fits inside the title limit. */
export function withBrand(title: string) {
  return title.length + BRAND_SUFFIX.length <= TITLE_MAX ? `${title}${BRAND_SUFFIX}` : title
}

/**
 * Trim to whole sentences under the limit where possible, so a clipped
 * description never ends mid-clause. Falls back to a word-boundary cut.
 */
export function clampDescription(text: string, max = DESC_MAX) {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed

  let whole = ""
  for (const sentence of trimmed.match(/[^.!?]+[.!?]+/g) ?? []) {
    if ((whole + sentence).trim().length > max) break
    whole += sentence
  }
  whole = whole.trim()

  return whole.length >= DESC_MIN ? whole : `${cutAtWord(trimmed, max - 1)}…`
}

/**
 * Feed copy is sometimes too thin to earn its own search snippet, so top it up
 * with a sentence that still describes the page rather than boilerplate.
 */
export function ensureDescription(text: string, filler: string, max = DESC_MAX) {
  const base = clampDescription(text, max)
  if (base.length >= DESC_MIN) return base

  const joined = /[.!?]$/.test(base) ? `${base} ${filler}` : `${base}. ${filler}`
  return clampDescription(joined, max)
}

type PageMetaInput = {
  title: string
  description: string
  /** Route path with a leading slash, e.g. "/blog". Drives canonical and og:url. */
  path: string
  ogTitle?: string
  images?: string[]
  publishedTime?: string
  authors?: string[]
}

/**
 * Builds title, canonical and Open Graph together so og:url can never drift
 * from the canonical URL. Next.js replaces the whole `openGraph` object rather
 * than merging it with the root layout's, so every field is repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  images,
  publishedTime,
  authors,
}: PageMetaInput): Metadata {
  const shared = {
    title: ogTitle ?? title,
    description,
    url: `${SITE_URL}${path}`,
    siteName: SITE_NAME,
    locale: "en_GB",
    images,
  }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: publishedTime
      ? { ...shared, type: "article" as const, publishedTime, authors }
      : { ...shared, type: "website" as const },
  }
}
