import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Watermark PDF",
    description: "Add custom text watermarks to PDF pages privately in your browser.",
}

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
    return children
}
