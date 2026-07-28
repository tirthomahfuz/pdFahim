import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Compress PDF",
    description: "Compress PDFs losslessly (keep text) or with strong JPEG rebuilding — fully in your browser.",
}

export default function CompressLayout({ children }: { children: React.ReactNode }) {
    return children
}
