"use client"

import { useState } from "react"
import { Lock, Loader2 } from "lucide-react"
import { FileUploader } from "@/components/ui/FileUploader"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Progress } from "@/components/ui/Progress"
import { protectPdf, downloadFile, toUserFacingError, formatBytes, type ProgressUpdate } from "@/lib/pdf-utils"

export default function ProtectPdfPage() {
    const [file, setFile] = useState<File | null>(null)
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ filename: string; size: number } | null>(null)
    const [progress, setProgress] = useState<ProgressUpdate | null>(null)

    const handleProtect = async () => {
        if (!file) {
            setError("Please select a PDF file.")
            return
        }
        if (password !== confirm) {
            setError("Passwords do not match.")
            return
        }

        try {
            setIsProcessing(true)
            setError(null)
            setSuccess(null)
            const bytes = await protectPdf(file, password, undefined, setProgress)
            setSuccess(downloadFile(bytes, `protected_${file.name}`))
        } catch (err) {
            console.error(err)
            setError(toUserFacingError(err, "Could not protect this PDF."))
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
                <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4">
                    <Lock className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Protect PDF</h1>
                <p className="text-muted-foreground">
                    Encrypt a PDF with a password. Encryption runs locally — the password never leaves your browser.
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
                    description="Select a PDF to encrypt"
                />

                <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirm" className="text-sm font-medium">Confirm password</label>
                        <input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>

                {error && <Alert variant="error">{error}</Alert>}
                {success && (
                    <Alert variant="success" title="Download started">
                        Saved as {success.filename} ({formatBytes(success.size)}). Store the password safely — we cannot recover it.
                    </Alert>
                )}
                {isProcessing && progress && (
                    <Progress value={progressValue} label={progress.message} />
                )}

                <div className="flex justify-end pt-2 border-t">
                    <Button
                        size="lg"
                        onClick={handleProtect}
                        disabled={isProcessing || !file || !password}
                        className="w-full md:w-auto"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Encrypting...
                            </>
                        ) : (
                            "Protect PDF"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
