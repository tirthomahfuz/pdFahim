import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
    return (
        <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4">404</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Page not found</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                That route does not exist. Head back to the toolkit and keep working with PDFs locally.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                    <Link href="/tools">Browse tools</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">Go home</Link>
                </Button>
            </div>
        </div>
    )
}
