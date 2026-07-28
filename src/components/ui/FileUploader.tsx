"use client"

import * as React from "react"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import { UploadCloud, File, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { Alert } from "./Alert"

interface FileUploaderProps extends Omit<DropzoneOptions, "onDrop"> {
    onFilesSelected: (files: File[]) => void
    maxFiles?: number
    accept?: Record<string, string[]>
    className?: string
    description?: string
    value?: File[]
    onRemove?: (file: File) => void
    onReorder?: (files: File[]) => void
    showPreviews?: boolean
}

function describeRejection(rejection: FileRejection) {
    const code = rejection.errors[0]?.code
    if (code === "file-invalid-type") {
        return `${rejection.file.name} is not an accepted file type.`
    }
    if (code === "too-many-files") {
        return "Too many files selected."
    }
    if (code === "file-too-large") {
        return `${rejection.file.name} is too large.`
    }
    return rejection.errors[0]?.message || `${rejection.file.name} was rejected.`
}

export function FileUploader({
    onFilesSelected,
    maxFiles = 0,
    accept,
    className,
    description = "Drag & drop files here, or click to select",
    value = [],
    onRemove,
    onReorder,
    showPreviews = false,
    ...props
}: FileUploaderProps) {
    const [rejectMessage, setRejectMessage] = React.useState<string | null>(null)
    const [previewUrls, setPreviewUrls] = React.useState<Record<string, string>>({})

    const onDrop = React.useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                setRejectMessage(describeRejection(fileRejections[0]))
            } else {
                setRejectMessage(null)
            }

            if (acceptedFiles.length > 0) {
                onFilesSelected(acceptedFiles)
            }
        },
        [onFilesSelected]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        maxFiles,
        accept,
        ...props,
    })

    React.useEffect(() => {
        if (!showPreviews || value.length === 0) {
            const frame = window.requestAnimationFrame(() => setPreviewUrls({}))
            return () => window.cancelAnimationFrame(frame)
        }

        const next: Record<string, string> = {}
        const created: string[] = []

        value.forEach((file, index) => {
            if (!file.type.startsWith("image/")) return
            const key = `${file.name}-${file.size}-${file.lastModified}-${index}`
            const url = URL.createObjectURL(file)
            next[key] = url
            created.push(url)
        })

        const frame = window.requestAnimationFrame(() => setPreviewUrls(next))

        return () => {
            window.cancelAnimationFrame(frame)
            created.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [value, showPreviews])

    const moveFile = (index: number, direction: -1 | 1) => {
        if (!onReorder) return
        const target = index + direction
        if (target < 0 || target >= value.length) return
        const next = [...value]
        const [item] = next.splice(index, 1)
        next.splice(target, 0, item)
        onReorder(next)
    }

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 px-6 py-14 text-center transition-all hover:bg-muted/10 cursor-pointer",
                    isDragActive && "border-primary bg-primary/5",
                    isDragReject && "border-destructive bg-destructive/5"
                )}
            >
                <input {...getInputProps()} />
                <div className="rounded-full bg-primary/10 p-4 mb-4 text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-8" aria-hidden />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                    {isDragActive ? "Drop the files here" : "Click or drag files to upload"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
            </div>

            {rejectMessage && (
                <Alert className="mt-4" variant="error">
                    {rejectMessage}
                </Alert>
            )}

            {value.length > 0 && (
                <div className="mt-6 space-y-3">
                    {value.map((file, i) => {
                        const key = `${file.name}-${file.size}-${file.lastModified}-${i}`
                        const preview = previewUrls[key]

                        return (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-4 rounded-lg border bg-background p-3 shadow-sm"
                            >
                                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                    {onReorder && value.length > 1 && (
                                        <div className="flex flex-col shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground"
                                                onClick={() => moveFile(i, -1)}
                                                disabled={i === 0}
                                                type="button"
                                                aria-label={`Move ${file.name} up`}
                                            >
                                                <ChevronUp className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground"
                                                onClick={() => moveFile(i, 1)}
                                                disabled={i === value.length - 1}
                                                type="button"
                                                aria-label={`Move ${file.name} down`}
                                            >
                                                <ChevronDown className="size-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={preview}
                                            alt=""
                                            className="size-12 rounded-md object-cover border shrink-0"
                                        />
                                    ) : (
                                        <div className="rounded-md bg-muted p-2 text-muted-foreground shrink-0">
                                            <File className="size-4" aria-hidden />
                                        </div>
                                    )}
                                    <div className="grid gap-0.5 min-w-0">
                                        <p className="truncate text-sm font-medium leading-none text-foreground">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                            {onReorder && value.length > 1 ? ` · #${i + 1}` : ""}
                                        </p>
                                    </div>
                                </div>
                                {onRemove && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRemove(file)
                                        }}
                                        type="button"
                                    >
                                        <X className="size-4" />
                                        <span className="sr-only">Remove file</span>
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
