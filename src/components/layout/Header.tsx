import Link from "next/link"
import { FileDown } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
                        <FileDown className="size-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">pdFahim</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/tools/merge" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Merge
                    </Link>
                    <Link href="/tools/split" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Split
                    </Link>
                    <Link href="/tools/compress" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Compress
                    </Link>
                    <Link href="/tools/image-to-pdf" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Image to PDF
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/tools" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                        All Tools &rarr;
                    </Link>
                </div>
            </div>
        </header>
    )
}
