"use client"

import { useState } from "react"
import { Minimize2, Loader2, CheckCircle } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { compressPdf, downloadFile } from "@/lib/pdf-utils"

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ originalSize: number, newSize: number } | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFile(newFiles[0])
        setError(null)
        setSuccess(null)
    }

    const handleRemoveFile = () => {
        setFile(null)
        setSuccess(null)
    }

    const handleCompress = async () => {
        if (!file) {
            setError("Please select a PDF file.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)

            const compressedPdfBytes = await compressPdf(file)

            setSuccess({
                originalSize: file.size,
                newSize: compressedPdfBytes.length
            })

            downloadFile(compressedPdfBytes, `optimized_${file.name}`)
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "An error occurred while optimizing the PDF.")
        } finally {
            setIsProcessing(false)
        }
    }

    const sizeDelta = success ? success.originalSize - success.newSize : 0
    const reductionPct = success && success.originalSize > 0
        ? Math.round((sizeDelta / success.originalSize) * 100)
        : 0

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mb-4">
                    <Minimize2 className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Compress PDF</h1>
                <p className="text-muted-foreground">
                    Clean metadata and optimize PDF structure in your browser. Image-heavy files may only shrink a little.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                {!file ? (
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        description="Select a PDF to optimize"
                    />
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "application/pdf": [".pdf"] }}
                            value={[file]}
                            onRemove={handleRemoveFile}
                            maxFiles={1}
                        />

                        {success && (
                            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="size-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-green-800">Optimization Complete</h3>
                                        <p className="text-sm text-green-700 mt-1">
                                            {sizeDelta > 0 ? (
                                                <>
                                                    Reduced from {formatBytes(success.originalSize)} to {formatBytes(success.newSize)}
                                                    {" "}({reductionPct}% smaller).
                                                </>
                                            ) : sizeDelta < 0 ? (
                                                <>
                                                    Result is {formatBytes(success.newSize)} vs original {formatBytes(success.originalSize)}.
                                                    Structure was cleaned, but this file did not get smaller.
                                                </>
                                            ) : (
                                                <>
                                                    Size stayed at {formatBytes(success.newSize)}. Metadata was cleaned and the file was re-saved.
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-green-600 mt-2">
                                            Client-side optimization mainly removes unused objects and metadata. Embedded images are left as-is.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                size="lg"
                                onClick={handleCompress}
                                disabled={isProcessing}
                                className="w-full md:w-auto"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Optimizing...
                                    </>
                                ) : (
                                    success ? "Optimize Again" : "Optimize PDF"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
