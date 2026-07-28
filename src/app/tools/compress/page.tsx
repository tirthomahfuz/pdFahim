"use client"

import { useState } from "react"
import { Minimize2, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import {
    compressPdf,
    downloadFile,
    toUserFacingError,
    formatBytes,
    type CompressQuality,
    type ProgressUpdate,
} from "@/lib/pdf-utils"

export default function CompressPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [quality, setQuality] = useState<CompressQuality>("medium")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ originalSize: number; newSize: number; filename: string } | null>(null)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleCompress = async () => {
        if (!file) {
            setError("Please select a PDF file.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            setProgress({ current: 0, total: 1, message: "Starting compression…" })

            const compressedPdfBytes = await compressPdf(file, quality, setProgress)
            const result = downloadFile(compressedPdfBytes, `compressed_${file.name}`)

            setSuccess({
                originalSize: file.size,
                newSize: result.size,
                filename: result.filename,
            })
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "An error occurred while compressing the PDF."))
        } finally {
            setIsProcessing(false)
            setProgress(null)
        }
    }

    const sizeDelta = success ? success.originalSize - success.newSize : 0
    const reductionPct = success && success.originalSize > 0
        ? Math.round((sizeDelta / success.originalSize) * 100)
        : 0
    const progressValue = progress && progress.total > 0
        ? (progress.current / progress.total) * 100
        : 0

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mb-4">
                    <Minimize2 className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Compress PDF</h1>
                <p className="text-muted-foreground">
                    Rebuild pages as optimized JPEGs for real size savings. This is lossy — text stays readable at Medium/High.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                {!file ? (
                    <FileUploader
                        onFilesSelected={(files) => {
                            setFile(files[0])
                            setError(null)
                            setSuccess(null)
                        }}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        showPdfPreviews
                        description="Select a PDF to compress"
                    />
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFilesSelected={(files) => {
                                setFile(files[0])
                                setError(null)
                                setSuccess(null)
                            }}
                            accept={{ "application/pdf": [".pdf"] }}
                            value={[file]}
                            onRemove={() => {
                                setFile(null)
                                setSuccess(null)
                            }}
                            maxFiles={1}
                            showPdfPreviews
                        />

                        <div className="rounded-xl border bg-muted/20 p-6 space-y-3">
                            <h3 className="font-medium">Compression quality</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {([
                                    ["high", "High", "Larger file, sharper pages"],
                                    ["medium", "Medium", "Balanced size and clarity"],
                                    ["low", "Low", "Smallest file, more artifacts"],
                                ] as const).map(([value, label, hint]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setQuality(value)}
                                        className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                            quality === value
                                                ? "border-primary bg-primary/5"
                                                : "border-input bg-background hover:bg-muted/40"
                                        }`}
                                    >
                                        <div className="font-medium text-sm">{label}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{hint}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {success && (
                            <Alert variant="success" title="Compression complete">
                                <p>
                                    {sizeDelta > 0 ? (
                                        <>
                                            Reduced from {formatBytes(success.originalSize)} to {formatBytes(success.newSize)}
                                            {" "}({reductionPct}% smaller).
                                        </>
                                    ) : (
                                        <>
                                            Result is {formatBytes(success.newSize)} vs original {formatBytes(success.originalSize)}.
                                            Try a lower quality setting for stronger reduction.
                                        </>
                                    )}
                                </p>
                                <p className="text-xs text-green-600 mt-2">
                                    Download started as {success.filename}. Pages were rasterized, so selectable text may be lost.
                                </p>
                            </Alert>
                        )}

                        {error && <Alert variant="error">{error}</Alert>}
                        {isProcessing && progress && (
                            <Progress value={progressValue} label={progress.message} />
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
                                        Compressing...
                                    </>
                                ) : (
                                    success ? "Compress Again" : "Compress PDF"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
