"use client"

import { useEffect, useState } from "react"
import { LayoutPanelLeft, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import { splitPdf, downloadFile, getPdfPageCount, toUserFacingError, formatBytes, type ProgressUpdate } from "@/lib/pdf-utils"

export default function SplitPdfPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ filename: string; size: number } | null>(null)
    const [pageCount, setPageCount] = useState<number | null>(null)
    const [isReadingPages, setIsReadingPages] = useState(false)
    const [startPage, setStartPage] = useState(1)
    const [endPage, setEndPage] = useState(1)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles([newFiles[0]])
        setError(null)
        setSuccess(null)
        setPageCount(null)
    }

    useEffect(() => {
        if (files.length === 0) return
        let cancelled = false
        setIsReadingPages(true)

        getPdfPageCount(files[0])
            .then((count) => {
                if (cancelled) return
                setPageCount(count)
                setStartPage(1)
                setEndPage(count)
                setError(null)
            })
            .catch((err) => {
                if (cancelled) return
                setPageCount(null)
                setError(toUserFacingError(err, "Could not read this PDF."))
            })
            .finally(() => {
                if (!cancelled) setIsReadingPages(false)
            })

        return () => {
            cancelled = true
        }
    }, [files])

    const handleSplit = async () => {
        if (files.length === 0) {
            setError("Please select a PDF file.")
            return
        }
        if (pageCount == null) {
            setError("Still reading the PDF page count. Please wait a moment.")
            return
        }
        if (startPage > endPage || startPage < 1 || endPage > pageCount) {
            setError(`Choose a range between 1 and ${pageCount}.`)
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            const splitPdfBytes = await splitPdf(files[0], startPage, endPage, setProgress)
            const result = downloadFile(splitPdfBytes, `split_${startPage}-${endPage}_${files[0].name}`)
            setSuccess(result)
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "An error occurred while splitting the PDF."))
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
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
                    <LayoutPanelLeft className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Split PDF Document</h1>
                <p className="text-muted-foreground">Extract a page range from your PDF file. 100% private.</p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                {files.length === 0 ? (
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxFiles={1}
                        showPdfPreviews
                        description="Select a single PDF file to split"
                    />
                ) : (
                    <div className="space-y-6">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ "application/pdf": [".pdf"] }}
                            value={files}
                            onRemove={() => {
                                setFiles([])
                                setPageCount(null)
                                setStartPage(1)
                                setEndPage(1)
                                setSuccess(null)
                            }}
                            maxFiles={1}
                            showPdfPreviews
                        />

                        <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Page Range</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {isReadingPages && "Reading page count…"}
                                    {!isReadingPages && pageCount != null && (
                                        <>This PDF has <span className="font-medium text-foreground">{pageCount}</span> page{pageCount === 1 ? "" : "s"}.</>
                                    )}
                                    {!isReadingPages && pageCount == null && "Select a valid PDF to choose a page range."}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="startPage" className="text-sm font-medium">From Page</label>
                                    <input
                                        id="startPage"
                                        type="number"
                                        min={1}
                                        max={pageCount ?? undefined}
                                        value={startPage}
                                        disabled={pageCount == null}
                                        onChange={(e) => setStartPage(parseInt(e.target.value, 10) || 1)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label htmlFor="endPage" className="text-sm font-medium">To Page</label>
                                    <input
                                        id="endPage"
                                        type="number"
                                        min={startPage}
                                        max={pageCount ?? undefined}
                                        value={endPage}
                                        disabled={pageCount == null}
                                        onChange={(e) => setEndPage(parseInt(e.target.value, 10) || 1)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                size="lg"
                                onClick={handleSplit}
                                disabled={isProcessing || isReadingPages || pageCount == null}
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
