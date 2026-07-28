import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Split PDF",
    description: "Extract a page range from a PDF privately in your browser.",
}

export default function SplitLayout({ children }: { children: React.ReactNode }) {
    return children
}
