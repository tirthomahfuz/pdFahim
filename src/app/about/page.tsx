import Link from "next/link"
import { ArrowLeft, Github, FileDown } from "lucide-react"
import { Button } from "@/components/ui/Button"

const REPO_URL = "https://github.com/tirthomahfuz/pdFahim"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
            </Link>

            <div className="space-y-8">
                <div>
                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                        <FileDown className="size-6" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">About pdFahim</h1>
                    <p className="text-xl text-muted-foreground">
                        A fast, private, and modern PDF toolkit built for the web.
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-semibold mt-8 mb-4">The Objective</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        pdFahim was created to solve a simple problem: most online PDF tools are bloated with ads, require account signups, limit your usage, or upload your sensitive documents to remote servers. We believe document processing should be fast, free, and completely secure.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">100% Client-Side Processing</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        What makes pdFahim different is its architecture. All PDF manipulation—whether merging, splitting, compressing, or converting—happens entirely within your browser using modern JavaScript libraries such as pdf-lib.
                        <br className="mb-2" />
                        <strong>Your files are never uploaded to our servers.</strong> This guarantees absolute privacy and allows the tools to keep working after the page has loaded, even if you briefly lose your internet connection.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Open Source & Free</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        Built as a strong portfolio project demonstrating modern web development capabilities, pdFahim is freely available. There are no premium tiers, no watermarks, and no artificial limitations.
                    </p>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
                    <div>
                        <h3 className="font-semibold mb-1">View the Source Code</h3>
                        <p className="text-sm text-muted-foreground">Check out the GitHub repository to see how it is built.</p>
                    </div>
                    <Button asChild>
                        <a href={REPO_URL} target="_blank" rel="noreferrer">
                            <Github className="mr-2 size-4" />
                            GitHub Repository
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
