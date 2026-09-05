import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ChatWidget from "@/components/ChatWidget"
import JsonLd from "@/components/JsonLd"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DupeDeals | Cheaper Alternatives to the Products You Love",
  description: SITE_DESCRIPTION,
  openGraph: {
    // No `url` here: Next.js hands this whole object to any page that does not
    // define its own openGraph, which made og:url point at the homepage
    // sitewide. Pages set og:url alongside their canonical via pageMetadata().
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        <JsonLd data={websiteJsonLd} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
