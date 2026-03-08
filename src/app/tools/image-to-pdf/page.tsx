"use client"

import { useState } from "react"
import { Image as ImageIcon, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { imagesToPdf, downloadFile } from "@/lib/pdf-utils"

export default function ImageToPdfPage() {
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

    const handleConvert = async () => {
        if (files.length === 0) {
            setError("Please select at least one image to convert.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            const pdfBytes = await imagesToPdf(files)
            downloadFile(pdfBytes, "converted_images.pdf")
        } catch (err) {
            console.error(err)
            setError("An error occurred while converting images. Ensure they are valid JPG or PNG formats.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
            <div className="mb-8 text-center">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-4">
                    <ImageIcon className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Image to PDF</h1>
                <p className="text-muted-foreground">
                    Convert JPG or PNG images into a PDF document. Your images never leave your browser.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                    }}
                    value={files}
                    onRemove={handleRemoveFile}
                    description="Supports JPG and PNG images"
                />

                {error && (
                    <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                        {error}
                    </div>
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
                                onClick={() => setFiles([])}
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
