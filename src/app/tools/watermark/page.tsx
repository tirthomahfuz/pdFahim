"use client"

import { useState } from "react"
import { Stamp, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import { FileRiskNotice } from "@/components/ui/FileRiskNotice"
import { watermarkPdf, downloadFile, toUserFacingError, formatBytes, type ProgressUpdate } from "@/lib/pdf-utils"
import { describeFileRisk } from "@/lib/runtime"

export default function WatermarkPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [text, setText] = useState("CONFIDENTIAL")
    const [opacity, setOpacity] = useState(0.28)
    const [fontSize, setFontSize] = useState(48)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ filename: string; size: number } | null>(null)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleWatermark = async () => {
        if (!file) {
            setError("Please select a PDF file.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            const bytes = await watermarkPdf(file, {
                text,
                opacity,
                fontSize,
                onProgress: setProgress,
            })
            setSuccess(downloadFile(bytes, `watermarked_${file.name}`))
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "Could not watermark this PDF."))
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
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-4">
                    <Stamp className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Watermark PDF</h1>
                <p className="text-muted-foreground">
                    Add diagonal text across every page. Processing stays on your device.
                </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <FileUploader
                    onFilesSelected={(files) => {
                        setFile(files[0])
                        setError(null)
                        setSuccess(null)
                    }}
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    value={file ? [file] : []}
                    onRemove={() => {
                        setFile(null)
                        setSuccess(null)
                    }}
                    showPdfPreviews
                    description="Select a PDF to watermark"
                />

                {file && <FileRiskNotice message={describeFileRisk(file)} />}

                <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="watermarkText" className="text-sm font-medium">Watermark text</label>
                        <input
                            id="watermarkText"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="opacity" className="text-sm font-medium">Opacity ({Math.round(opacity * 100)}%)</label>
                            <input
                                id="opacity"
                                type="range"
                                min={0.05}
                                max={0.8}
                                step={0.01}
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="fontSize" className="text-sm font-medium">Size ({fontSize}px)</label>
                            <input
                                id="fontSize"
                                type="range"
                                min={24}
                                max={96}
                                step={2}
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {error && <Alert variant="error">{error}</Alert>}
                {success && (
                    <Alert variant="success" title="Download started">
                        Saved as {success.filename} ({formatBytes(success.size)}).
                    </Alert>
                )}
                {isProcessing && progress && (
                    <Progress value={progressValue} label={progress.message} />
                )}

                <div className="flex justify-end pt-2 border-t">
                    <Button size="lg" onClick={handleWatermark} disabled={isProcessing || !file} className="w-full md:w-auto">
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Watermarking...
                            </>
                        ) : (
                            "Apply Watermark"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
