"use client"

import { useState } from "react"
import { Minimize2, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { compressPdf, downloadFile, toUserFacingError, formatBytes } from "@/lib/pdf-utils"

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ originalSize: number; newSize: number; filename: string } | null>(null)

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
            const result = downloadFile(compressedPdfBytes, `optimized_${file.name}`)

            setSuccess({
                originalSize: file.size,
                newSize: result.size,
                filename: result.filename,
            })
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "An error occurred while optimizing the PDF."))
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
                            <Alert variant="success" title="Optimization complete">
                                <p>
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
                                    Download started as {success.filename}. Client-side optimization mainly removes unused objects and metadata.
                                </p>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="error">{error}</Alert>
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
