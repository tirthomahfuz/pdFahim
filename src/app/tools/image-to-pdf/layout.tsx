import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Image to PDF",
    description: "Convert JPG and PNG images into a PDF document in your browser.",
}

export default function ImageToPdfLayout({ children }: { children: React.ReactNode }) {
    return children
}
