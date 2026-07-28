export function getSiteUrl() {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
    }

    return "http://localhost:3000"
}

export const siteConfig = {
    name: "pdFahim",
    title: "pdFahim — Modern Browser-based PDF Toolkit",
    description:
        "Merge, split, compress, and convert PDFs privately in your browser. Free, local-first, no uploads.",
}
