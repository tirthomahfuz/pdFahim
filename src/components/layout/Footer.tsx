import Link from "next/link"
import { FileDown, Github } from "lucide-react"

const REPO_URL = "https://github.com/tirthomahfuz/pdFahim"

export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex bg-primary text-primary-foreground p-1.5 rounded-lg">
                                <FileDown className="size-4" />
                            </div>
                            <span className="font-bold tracking-tight">pdFahim</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            A clean, modern, browser-based PDF toolkit. No backend, no accounts, just fast local processing.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                                <Github className="size-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4 md:col-start-3">
                        <h4 className="text-sm font-semibold">Tools</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/tools/merge" className="text-muted-foreground hover:text-foreground">Merge PDF</Link>
                            </li>
                            <li>
                                <Link href="/tools/split" className="text-muted-foreground hover:text-foreground">Split PDF</Link>
                            </li>
                            <li>
                                <Link href="/tools/compress" className="text-muted-foreground hover:text-foreground">Compress PDF</Link>
                            </li>
                            <li>
                                <Link href="/tools/image-to-pdf" className="text-muted-foreground hover:text-foreground">Image to PDF</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Project</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground">About pdFahim</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                            </li>
                            <li>
                                <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">Source Code</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row justify-between items-center border-t pt-8 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} pdFahim. Built for portfolio demonstration.</p>
                    <p className="mt-2 md:mt-0">100% Client-side Processing</p>
                </div>
            </div>
        </footer>
    )
}
