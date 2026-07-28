import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About",
    description: "Learn why pdFahim keeps PDF processing local, private, and free.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children
}
