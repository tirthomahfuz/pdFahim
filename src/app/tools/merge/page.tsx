"use client"

import { useState } from "react"
import { Layers, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import { mergePdfs, downloadFile, toUserFacingError, formatBytes, type ProgressUpdate } from "@/lib/pdf-utils"

export default function MergePdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ filename: string; size: number } | null>(null)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles((prev) => [...prev, ...newFiles])
        setError(null)
        setSuccess(null)
    }

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please select at least 2 PDF files to merge.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            setProgress({ current: 0, total: files.length, message: "Starting…" })
            const mergedPdfBytes = await mergePdfs(files, setProgress)
            const result = downloadFile(mergedPdfBytes, "merged_document.pdf")
            setSuccess(result)
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "An error occurred while merging the PDF files."))
        } finally {
            setIsProcessing(false)
            setProgress(null)
        }
    }

    const progressValue = progress && progress.total > 0
        ? (progress.current / progress.total) * 100
        : 0

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <Layers className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Merge PDF Files</h1>
                <p className="text-muted-foreground">
                    Combine multiple PDFs into a single document. Drag to reorder. Processing stays in your browser.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{ "application/pdf": [".pdf"] }}
                    value={files}
                    onRemove={(fileToRemove) => {
                        setFiles((prev) => prev.filter((f) => f !== fileToRemove))
                        setSuccess(null)
                    }}
                    onReorder={(next) => {
                        setFiles(next)
                        setSuccess(null)
                    }}
                    showPdfPreviews
                    description="Only PDF files are supported"
                />

                {error && <Alert className="mt-6" variant="error">{error}</Alert>}
                {success && (
                    <Alert className="mt-6" variant="success" title="Download started">
                        Saved as {success.filename} ({formatBytes(success.size)}).
                    </Alert>
                )}
                {isProcessing && progress && (
                    <Progress className="mt-6" value={progressValue} label={progress.message} />
                )}

                {files.length > 0 && (
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
                        <p className="text-sm text-muted-foreground">
                            {files.length} file{files.length !== 1 && "s"} selected
                            {files.length === 1 ? " — add at least one more to merge." : "."}
                        </p>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="w-full md:w-auto"
                                onClick={() => {
                                    setFiles([])
                                    setSuccess(null)
                                }}
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
