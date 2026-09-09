import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin is the CMS login and /api/cms is its OAuth handshake. Neither
      // is content, and a crawler following them achieves nothing.
      disallow: ["/search", "/go", "/admin", "/api/cms"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
