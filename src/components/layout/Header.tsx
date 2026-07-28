"use client"

import { useState } from "react"
import Link from "next/link"
import { FileDown, Menu, X } from "lucide-react"

const navLinks = [
    { href: "/tools/merge", label: "Merge" },
    { href: "/tools/split", label: "Split" },
    { href: "/tools/compress", label: "Compress" },
    { href: "/tools/image-to-pdf", label: "Image to PDF" },
]

export function Header() {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
                    <div className="flex bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
                        <FileDown className="size-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">pdFahim</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/tools"
                        className="hidden sm:inline text-sm font-medium text-primary hover:underline underline-offset-4"
                        onClick={() => setOpen(false)}
                    >
                        All Tools &rarr;
                    </Link>
                    <button
                        type="button"
                        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {open ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>
            </div>

            {open && (
                <div id="mobile-nav" className="md:hidden border-t bg-background">
                    <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/tools"
                            className="rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
                            onClick={() => setOpen(false)}
                        >
                            All Tools
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
