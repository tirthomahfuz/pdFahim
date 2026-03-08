"use client"

import * as React from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
import { UploadCloud, File, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface FileUploaderProps extends Omit<DropzoneOptions, "onDrop"> {
    onFilesSelected: (files: File[]) => void
    maxFiles?: number
    accept?: Record<string, string[]>
    className?: string
    description?: string
    value?: File[]
    onRemove?: (file: File) => void
}

export function FileUploader({
    onFilesSelected,
    maxFiles = 0,
    accept,
    className,
    description = "Drag & drop files here, or click to select",
    value = [],
    onRemove,
    ...props
}: FileUploaderProps) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            onFilesSelected(acceptedFiles)
        },
        [onFilesSelected]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        maxFiles,
        accept,
        ...props,
    })

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
                    <UploadCloud className="size-8" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                    {isDragActive ? "Drop the files here" : "Click or drag files to upload"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
            </div>

            {value.length > 0 && (
                <div className="mt-6 space-y-3">
                    {value.map((file, i) => (
                        <div
                            key={`${file.name}-${i}`}
                            className="flex items-center justify-between gap-4 rounded-lg border bg-background p-3 shadow-sm"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="rounded-md bg-muted p-2 text-muted-foreground">
                                    <File className="size-4" />
                                </div>
                                <div className="grid gap-0.5">
                                    <p className="truncate text-sm font-medium leading-none text-foreground">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
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
                    ))}
                </div>
            )}
        </div>
    )
}
