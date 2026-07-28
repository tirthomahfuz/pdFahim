type PdfjsModule = typeof import("pdfjs-dist")

let pdfjsPromise: Promise<PdfjsModule> | null = null
let workerConfigured = false

async function getPdfjs(): Promise<PdfjsModule> {
    if (typeof window === "undefined") {
        throw new Error("PDF preview is only available in the browser.")
    }

    if (!pdfjsPromise) {
        pdfjsPromise = import("pdfjs-dist")
    }

    const pdfjs = await pdfjsPromise

    if (!workerConfigured) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
        workerConfigured = true
    }

    return pdfjs
}

export async function loadPdfjsDocument(file: File, password?: string) {
    const pdfjs = await getPdfjs()
    const data = new Uint8Array(await file.arrayBuffer())
    const loadingTask = pdfjs.getDocument({
        data,
        password,
        useSystemFonts: true,
    })
    return loadingTask.promise
}

export async function renderPdfPageToJpeg(
    file: File,
    pageNumber: number,
    options: { scale?: number; quality?: number; password?: string } = {}
): Promise<{ bytes: Uint8Array; width: number; height: number }> {
    const { scale = 1.25, quality = 0.72, password } = options
    const pdf = await loadPdfjsDocument(file, password)
    try {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.floor(viewport.width))
        canvas.height = Math.max(1, Math.floor(viewport.height))
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Could not create canvas context for PDF rendering.")

        await page.render({ canvas, canvasContext: ctx, viewport }).promise

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (result) => (result ? resolve(result) : reject(new Error("Failed to encode JPEG page."))),
                "image/jpeg",
                quality
            )
        })

        const bytes = new Uint8Array(await blob.arrayBuffer())
        return { bytes, width: canvas.width, height: canvas.height }
    } finally {
        await pdf.cleanup()
    }
}

/**
 * Renders the first page of a PDF to a small data-URL thumbnail.
 */
export async function renderPdfThumbnail(file: File, maxWidth = 96): Promise<string> {
    const pdf = await loadPdfjsDocument(file)
    try {
        const page = await pdf.getPage(1)
        const unscaled = page.getViewport({ scale: 1 })
        const scale = maxWidth / unscaled.width
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.floor(viewport.width))
        canvas.height = Math.max(1, Math.floor(viewport.height))
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Could not create canvas context.")

        await page.render({ canvas, canvasContext: ctx, viewport }).promise
        return canvas.toDataURL("image/jpeg", 0.7)
    } finally {
        await pdf.cleanup()
    }
}
