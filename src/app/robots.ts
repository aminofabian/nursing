import type { MetadataRoute } from "next"

import { APP_URL } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  const host = APP_URL.replace(/\/$/, "")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}

