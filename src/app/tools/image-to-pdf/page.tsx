"use client"

import { useState } from "react"
import { Image as ImageIcon, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import { imagesToPdf, downloadFile, toUserFacingError, formatBytes, type ProgressUpdate } from "@/lib/pdf-utils"

export default function ImageToPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ filename: string; size: number } | null>(null)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleConvert = async () => {
        if (files.length === 0) {
            setError("Please select at least one image to convert.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            setProgress({ current: 0, total: files.length, message: "Starting…" })
            const pdfBytes = await imagesToPdf(files, setProgress)
            const result = downloadFile(pdfBytes, "converted_images.pdf")
            setSuccess(result)
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "An error occurred while converting images."))
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
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-4">
                    <ImageIcon className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Image to PDF</h1>
                <p className="text-muted-foreground">
                    Convert JPG or PNG images into a PDF document. Drag to reorder before creating the file.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <FileUploader
                    onFilesSelected={(newFiles) => {
                        setFiles((prev) => [...prev, ...newFiles])
                        setError(null)
                        setSuccess(null)
                    }}
                    accept={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                    }}
                    value={files}
                    onRemove={(fileToRemove) => {
                        setFiles((prev) => prev.filter((f) => f !== fileToRemove))
                        setSuccess(null)
                    }}
                    onReorder={(next) => {
                        setFiles(next)
                        setSuccess(null)
                    }}
                    showPreviews
                    description="Supports JPG and PNG images"
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
                            {files.length} image{files.length !== 1 && "s"} selected.
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
                                onClick={handleConvert}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    "Create PDF"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
