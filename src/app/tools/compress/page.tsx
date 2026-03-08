"use client"

import { useState } from "react"
import { FileLock2, Loader2, CheckCircle } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { compressPdf, downloadFile } from "@/lib/pdf-utils"

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

            downloadFile(compressedPdfBytes, `compressed_${file.name}`)
        } catch (err) {
            console.error(err)
            setError("An error occurred while compressing the PDF.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mb-4">
                    <FileLock2 className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Compress PDF</h1>
                <p className="text-muted-foreground">
                    Reduce the file size of your PDF directly in your browser. Fast, free, and private.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                {!file ? (
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        description="Select a PDF to compress"
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
                                        <h3 className="font-semibold text-green-800">Compression Complete</h3>
                                        <p className="text-sm text-green-700 mt-1">
                                            Reduced from {(success.originalSize / 1024 / 1024).toFixed(2)} MB to {(success.newSize / 1024 / 1024).toFixed(2)} MB
                                            ({Math.round((1 - success.newSize / success.originalSize) * 100)}% reduction).
                                        </p>
                                        <p className="text-xs text-green-600 mt-2">
                                            Note: Client-side compression mainly removes unused objects. Highly image-heavy PDFs might not shrink significantly.
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
