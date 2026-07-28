import Link from "next/link"
import { Layers, LayoutPanelLeft, Minimize2, Image as ImageIcon, Stamp, Lock, Unlock } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

const tools = [
    {
        href: "/tools/merge",
        title: "Merge PDF",
        description: "Combine multiple PDFs into one document, with drag-to-reorder and page thumbnails.",
        icon: Layers,
        tone: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    },
    {
        href: "/tools/split",
        title: "Split PDF",
        description: "Extract a specific page range from a PDF into a new file.",
        icon: LayoutPanelLeft,
        tone: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
    },
    {
        href: "/tools/compress",
        title: "Compress PDF",
        description: "Rasterize pages to JPEG for meaningful size reduction, with quality controls.",
        icon: Minimize2,
        tone: "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white",
    },
    {
        href: "/tools/image-to-pdf",
        title: "Image to PDF",
        description: "Convert JPG or PNG images into a PDF, with previews and reordering.",
        icon: ImageIcon,
        tone: "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white",
    },
    {
        href: "/tools/watermark",
        title: "Watermark PDF",
        description: "Stamp custom text across every page with opacity control.",
        icon: Stamp,
        tone: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    },
    {
        href: "/tools/protect",
        title: "Protect PDF",
        description: "Encrypt a PDF with a password entirely in your browser.",
        icon: Lock,
        tone: "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white",
    },
    {
        href: "/tools/unlock",
        title: "Unlock PDF",
        description: "Remove a known password and download an unlocked copy.",
        icon: Unlock,
        tone: "bg-teal-500/10 text-teal-600 group-hover:bg-teal-500 group-hover:text-white",
    },
]

export default function ToolsDashboard() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 flex-1">
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">All PDF Tools</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    Select a tool to get started. All file processing is completely secure and happens exclusively in your browser.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                        <Link key={tool.href} href={tool.href} className="group">
                            <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                    <div className={`size-10 shrink-0 rounded-lg flex items-center justify-center transition-colors ${tool.tone}`}>
                                        <Icon className="size-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="mb-1.5">{tool.title}</CardTitle>
                                        <CardDescription>{tool.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
