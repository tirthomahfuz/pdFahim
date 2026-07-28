import Link from "next/link"
import { Layers, LayoutPanelLeft, Minimize2, Image as ImageIcon } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

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
                <Link href="/tools/merge" className="group">
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Layers className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="mb-1.5">Merge PDF</CardTitle>
                                <CardDescription>
                                    Combine multiple PDFs into a single, seamless document in the order you want.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/tools/split" className="group">
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="size-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <LayoutPanelLeft className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="mb-1.5">Split PDF</CardTitle>
                                <CardDescription>
                                    Extract specific pages or separate a large PDF by page range.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/tools/compress" className="group">
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="size-10 shrink-0 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Minimize2 className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="mb-1.5">Compress PDF</CardTitle>
                                <CardDescription>
                                    Clean metadata and optimize PDF structure for a smaller download.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/tools/image-to-pdf" className="group">
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="size-10 shrink-0 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <ImageIcon className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="mb-1.5">Image to PDF</CardTitle>
                                <CardDescription>
                                    Convert JPG or PNG images instantly to a PDF document.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
