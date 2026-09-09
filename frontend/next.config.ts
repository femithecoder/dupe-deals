import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "nourishskinrange.com",
      },
      {
        protocol: "https",
        hostname: "images2.productserve.com",
      },
      {
        protocol: "https",
        hostname: "assets.media-quzo.co.uk",
      },
      {
        // Plusshop UK serves its own product images. Every merchant image host
        // has to be listed here or next/image throws and the product page 500s
        // rather than degrading, so this must be updated alongside any new
        // merchant.
        protocol: "https",
        hostname: "uk.plusshop.com",
      },
    ],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  // Two sample posts were removed in 02f3f62 (2026-08-10) because they claimed
  // testing we never did and had no products behind them. Removing the content
  // was right; removing the URLs was not, because Google had indexed both and
  // they still draw more search impressions than anything else on the site,
  // all of them landing on a 404.
  //
  // 301 rather than 302: these are gone for good, and a permanent redirect is
  // what passes the ranking signal to the replacement.
  // public/admin/index.html is served at /admin/index.html. The CMS and every
  // link to it use the bare /admin, so map it explicitly rather than relying
  // on the host's directory-index behaviour.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }]
  },

  async redirects() {
    return [
      {
        // A real, honest La Mer post now exists, so this demand finally has
        // somewhere legitimate to go.
        source: "/blog/best-la-mer-dupes-uk",
        destination: "/blog/creme-de-la-mer-dupe-uk-2026",
        permanent: true,
      },
      {
        // No nappies post exists and we decided not to write one: the honest
        // cheap answer is supermarket own-brand, which we cannot monetise or
        // even link. The category is the closest honest destination. Google may
        // treat this as a soft 404 and drop it, which is the same outcome as
        // leaving it dead, so the only real gain here is for a human who lands
        // on it.
        source: "/blog/pampers-vs-own-brand-nappies",
        destination: "/category/baby-kids",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
