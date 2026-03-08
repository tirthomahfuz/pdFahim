"use client"

import { useState } from "react"
import { LayoutPanelLeft, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { splitPdf, downloadFile } from "@/lib/pdf-utils"

export default function SplitPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [startPage, setStartPage] = useState<number>(1)
    const [endPage, setEndPage] = useState<number>(1)

    const handleFilesSelected = (newFiles: File[]) => {
        // Replace current file with new file (only 1 file supported for split)
        setFiles([newFiles[0]])
        setError(null)
    }

    const handleRemoveFile = () => {
        setFiles([])
    }

    const handleSplit = async () => {
        if (files.length === 0) {
            setError("Please select a PDF file.")
            return
        }

        if (startPage > endPage) {
            setError("Start page cannot be greater than end page.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            const splitPdfBytes = await splitPdf(files[0], startPage, endPage)
            downloadFile(splitPdfBytes, `split_${startPage}-${endPage}_${files[0].name}`)
        } catch (err) {
            console.error(err)
            setError("An error occurred while splitting the PDF. Note: Some encrypted PDFs may not be supported.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
                    <LayoutPanelLeft className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Split PDF Document</h1>
                <p className="text-muted-foreground">
                    Extract a range of pages from your PDF file. 100% private.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                {files.length === 0 ? (
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        description="Select a single PDF file to split"
                    />
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "application/pdf": [".pdf"] }}
                            value={files}
                            onRemove={handleRemoveFile}
                            maxFiles={1}
                        />

                        <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Page Range</h3>
                                <p className="text-sm text-muted-foreground mb-4">Select the pages you want to extract.</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="startPage" className="text-sm font-medium">From Page</label>
                                    <input
                                        id="startPage"
                                        type="number"
                                        min={1}
                                        value={startPage}
                                        onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="endPage" className="text-sm font-medium">To Page</label>
                                    <input
                                        id="endPage"
                                        type="number"
                                        min={startPage}
                                        value={endPage}
                                        onChange={(e) => setEndPage(parseInt(e.target.value) || 1)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                size="lg"
                                onClick={handleSplit}
                                disabled={isProcessing}
                                className="w-full md:w-auto"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Splitting...
                                    </>
                                ) : (
                                    "Split & Download PDF"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
