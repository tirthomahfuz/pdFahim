import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Protect PDF",
    description: "Encrypt a PDF with a password entirely in your browser.",
}

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
    return children
}
