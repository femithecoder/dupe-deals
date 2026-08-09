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
    ],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

export default nextConfig
