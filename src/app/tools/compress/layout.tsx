import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Compress PDF",
    description: "Clean metadata and optimize PDF structure client-side with no uploads.",
}

export default function CompressLayout({ children }: { children: React.ReactNode }) {
    return children
}
