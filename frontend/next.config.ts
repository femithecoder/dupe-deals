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
    ],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

export default nextConfig
