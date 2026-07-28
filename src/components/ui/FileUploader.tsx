"use client"

import * as React from "react"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { UploadCloud, File, X, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { Alert } from "./Alert"
import { renderPdfThumbnail } from "@/lib/pdf-preview"

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
    showPdfPreviews?: boolean
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

function fileKey(file: File, index: number) {
    return `${file.name}-${file.size}-${file.lastModified}-${index}`
}

function SortableFileRow({
    id,
    file,
    index,
    total,
    preview,
    onRemove,
    canReorder,
}: {
    id: string
    file: File
    index: number
    total: number
    preview?: string
    onRemove?: (file: File) => void
    canReorder: boolean
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        disabled: !canReorder,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center justify-between gap-4 rounded-lg border bg-background p-3 shadow-sm",
                isDragging && "opacity-80 ring-2 ring-primary/40 z-10"
            )}
        >
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                {canReorder && (
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted cursor-grab active:cursor-grabbing"
                        aria-label={`Drag to reorder ${file.name}`}
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="size-4" />
                    </button>
                )}
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={preview}
                        alt=""
                        className="size-12 rounded-md object-cover border shrink-0 bg-muted"
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
                        {canReorder && total > 1 ? ` · #${index + 1}` : ""}
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
    showPdfPreviews = false,
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
        let cancelled = false
        const createdObjectUrls: string[] = []

        const frame = window.requestAnimationFrame(() => {
            void (async () => {
                if ((!showPreviews && !showPdfPreviews) || value.length === 0) {
                    if (!cancelled) setPreviewUrls({})
                    return
                }

                const next: Record<string, string> = {}

                for (let index = 0; index < value.length; index++) {
                    const file = value[index]
                    const key = fileKey(file, index)

                    if (showPreviews && file.type.startsWith("image/")) {
                        const url = URL.createObjectURL(file)
                        createdObjectUrls.push(url)
                        next[key] = url
                        continue
                    }

                    if (
                        showPdfPreviews &&
                        (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
                    ) {
                        try {
                            next[key] = await renderPdfThumbnail(file)
                        } catch {
                            // Thumbnail is best-effort; keep filename row usable.
                        }
                    }
                }

                if (!cancelled) setPreviewUrls(next)
            })()
        })

        return () => {
            cancelled = true
            window.cancelAnimationFrame(frame)
            createdObjectUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [value, showPreviews, showPdfPreviews])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const itemIds = value.map((file, index) => fileKey(file, index))
    const canReorder = Boolean(onReorder && value.length > 1)

    const handleDragEnd = (event: DragEndEvent) => {
        if (!onReorder) return
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = itemIds.indexOf(String(active.id))
        const newIndex = itemIds.indexOf(String(over.id))
        if (oldIndex < 0 || newIndex < 0) return
        onReorder(arrayMove(value, oldIndex, newIndex))
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
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                            {value.map((file, i) => {
                                const id = fileKey(file, i)
                                return (
                                    <SortableFileRow
                                        key={id}
                                        id={id}
                                        file={file}
                                        index={i}
                                        total={value.length}
                                        preview={previewUrls[id]}
                                        onRemove={onRemove}
                                        canReorder={canReorder}
                                    />
                                )
                            })}
                        </SortableContext>
                    </DndContext>
                    {canReorder && (
                        <p className="text-xs text-muted-foreground">Drag the handle to reorder files.</p>
                    )}
                </div>
            )}
        </div>
    )
}
