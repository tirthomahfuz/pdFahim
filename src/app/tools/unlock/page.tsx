"use client"

import { useState } from "react"
import { Unlock, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import { unlockPdf, downloadFile, toUserFacingError, formatBytes, type ProgressUpdate } from "@/lib/pdf-utils"

export default function UnlockPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [password, setPassword] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ filename: string; size: number } | null>(null)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleUnlock = async () => {
        if (!file) {
            setError("Please select a PDF file.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            const bytes = await unlockPdf(file, password, setProgress)
            setSuccess(downloadFile(bytes, `unlocked_${file.name}`))
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "Could not unlock this PDF."))
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
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 mb-4">
                    <Unlock className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Unlock PDF</h1>
                <p className="text-muted-foreground">
                    Remove a known password and download an unlocked copy. The password is used only in your browser.
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
                    description="Select a password-protected PDF"
                />

                <div className="rounded-xl border bg-muted/20 p-6 space-y-2">
                    <label htmlFor="unlockPassword" className="text-sm font-medium">PDF password</label>
                    <input
                        id="unlockPassword"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
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
                    <Button
                        size="lg"
                        onClick={handleUnlock}
                        disabled={isProcessing || !file || !password}
                        className="w-full md:w-auto"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Unlocking...
                            </>
                        ) : (
                            "Unlock PDF"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
