import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "All PDF Tools",
    description: "Choose a private, browser-based PDF tool: merge, split, compress, or convert images.",
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return children
}
