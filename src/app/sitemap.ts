import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = getSiteUrl()
    const routes = [
        "",
        "/tools",
        "/tools/merge",
        "/tools/split",
        "/tools/compress",
        "/tools/image-to-pdf",
        "/about",
        "/privacy",
    ]

    return routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route.startsWith("/tools/") ? "monthly" : "weekly",
        priority: route === "" ? 1 : route === "/tools" ? 0.9 : 0.7,
    }))
}
