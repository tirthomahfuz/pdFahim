"use client"

import { useState } from "react"
import { Layers, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { mergePdfs, downloadFile } from "@/lib/pdf-utils"

export default function MergePdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
        setError(null)
    }

    const handleRemoveFile = (fileToRemove: File) => {
        setFiles((prev) => prev.filter((f) => f !== fileToRemove))
    }

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please select at least 2 PDF files to merge.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            const mergedPdfBytes = await mergePdfs(files)
            downloadFile(mergedPdfBytes, "merged_document.pdf")
        } catch (err) {
            console.error(err)
            setError("An error occurred while merging the PDF files.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <Layers className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Merge PDF Files</h1>
                <p className="text-muted-foreground">
                    Combine multiple PDFs into a single document. 100% free and processes locally in your browser.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{ "application/pdf": [".pdf"] }}
                    value={files}
                    onRemove={handleRemoveFile}
                    description="Only PDF files are supported"
                />

                {error && (
                    <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                        {error}
                    </div>
                )}

                {files.length > 0 && (
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
                        <p className="text-sm text-muted-foreground">
                            {files.length} file{files.length !== 1 && "s"} selected.
                        </p>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="w-full md:w-auto"
                                onClick={() => setFiles([])}
                                disabled={isProcessing}
                            >
                                Clear All
                            </Button>
                            <Button
                                className="w-full md:w-auto"
                                onClick={handleMerge}
                                disabled={isProcessing || files.length < 2}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Merging...
                                    </>
                                ) : (
                                    "Merge PDFs"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
