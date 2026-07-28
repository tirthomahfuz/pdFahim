import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Unlock PDF",
    description: "Remove a known PDF password and download an unlocked copy locally.",
}

export default function UnlockLayout({ children }: { children: React.ReactNode }) {
    return children
}
