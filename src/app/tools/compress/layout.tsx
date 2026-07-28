import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Compress PDF",
    description: "Compress PDFs by rasterizing pages to JPEG with quality controls — fully in your browser.",
}

export default function CompressLayout({ children }: { children: React.ReactNode }) {
    return children
}
