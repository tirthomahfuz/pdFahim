import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "pdFahim",
        short_name: "pdFahim",
        description: "Private browser-based PDF toolkit — merge, split, compress, convert, watermark, and protect.",
        start_url: "/tools",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#6d28d9",
        lang: "en",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    }
}
