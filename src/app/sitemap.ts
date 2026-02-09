import type { MetadataRoute } from "next"

import { APP_URL } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_URL.replace(/\/$/, "")

  const now = new Date()

  const routes = [
    "",
    "/about",
    "/pricing",
    "/resources",
    "/search",
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard",
    "/library",
    "/settings",
    "/contact",
    "/terms",
    "/privacy",
  ]

  return routes.map((route) => ({
    url: `${base}${route || "/"}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }))
}

