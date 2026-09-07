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
}

export default nextConfig
