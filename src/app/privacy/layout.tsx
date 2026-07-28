import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "pdFahim processes files only in your browser. No uploads, no tracking cookies.",
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return children
}
