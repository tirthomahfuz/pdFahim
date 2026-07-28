"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Layers, LayoutPanelLeft, Minimize2, Image as ImageIcon, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { ScrollImageSequence } from "@/components/ui/ScrollImageSequence"

export default function Home() {
  const heroSectionRef = useRef<HTMLElement>(null)

  return (
    <div className="flex flex-col flex-1 bg-zinc-950 text-white min-h-screen">
      <section ref={heroSectionRef} className="relative w-full h-[220vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 w-full h-full z-0">
            <ScrollImageSequence
              frameFolder="/frames/pdf-sequence"
              frameCount={240}
              frameStep={2}
              scrollTriggerRef={heroSectionRef}
            />
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 -mt-16">
            <p className="mb-5 text-sm md:text-base font-semibold tracking-[0.28em] uppercase text-primary">
              pdFahim
            </p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-5xl mb-6 text-white leading-[1.1]">
              Work with PDFs <span className="text-primary italic font-serif tracking-normal">beautifully</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light">
              Merge, split, compress, and convert files privately in your browser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm sm:max-w-none">
              <Button size="lg" className="rounded-full text-base h-12 px-8 bg-white text-black hover:bg-zinc-200 border-0" asChild>
                <Link href="/tools">
                  Explore Tools <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base h-12 px-8 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white backdrop-blur-sm" asChild>
                <Link href="/about">
                  Why pdFahim
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 bg-background text-foreground border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Powerful Tools, Simple UI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your PDF documents without the clutter of complex software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/tools/merge" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                    <Layers className="size-6" />
                  </div>
                  <CardTitle>Merge PDF</CardTitle>
                  <CardDescription>Combine multiple PDFs into a single, seamless document in seconds.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/tools/split" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-500">
                    <LayoutPanelLeft className="size-6" />
                  </div>
                  <CardTitle>Split PDF</CardTitle>
                  <CardDescription>Extract specific pages or separate a large PDF into smaller files.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/tools/compress" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-500">
                    <Minimize2 className="size-6" />
                  </div>
                  <CardTitle>Compress PDF</CardTitle>
                  <CardDescription>Clean metadata and optimize PDF structure for a smaller download.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/tools/image-to-pdf" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                <CardHeader>
                  <div className="size-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-500">
                    <ImageIcon className="size-6" />
                  </div>
                  <CardTitle>Image to PDF</CardTitle>
                  <CardDescription>Convert JPG and PNG images perfectly formatted into PDF documents.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-20 bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why choose pdFahim?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary/10 p-1.5 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Absolute Privacy</h3>
                    <p className="text-muted-foreground">Your files never leave your device. All processing happens entirely within your browser.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary/10 p-1.5 text-primary">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Lightning Fast</h3>
                    <p className="text-muted-foreground">No waiting for uploads or downloads. Process your files instantly using local computing power.</p>
                  </div>
                </li>
              </ul>
              <Button asChild className="mt-4">
                <Link href="/tools">Start Using Tools</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-20 blur-2xl"></div>
              <div className="relative rounded-2xl border bg-card p-8 shadow-2xl">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="size-12 rounded bg-muted/50 border border-dashed flex items-center justify-center">
                      <ImageIcon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded bg-muted/50 border border-dashed flex items-center justify-center">
                      <ImageIcon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <div className="h-8 bg-muted rounded w-24"></div>
                    <div className="h-10 bg-primary/20 rounded w-32 border border-primary/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
