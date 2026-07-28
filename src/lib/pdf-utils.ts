import { PDFDocument, StandardFonts, degrees, rgb } from "@cantoo/pdf-lib"
import { renderPdfPageToJpeg } from "@/lib/pdf-preview"

export type ProgressUpdate = {
    current: number
    total: number
    message?: string
}

export type ProgressCallback = (progress: ProgressUpdate) => void

const ENCRYPTED_MESSAGE =
    "This PDF is password-protected. Open it with the Unlock tool first, or provide the password."

async function loadPdfDocument(file: File, password?: string): Promise<PDFDocument> {
    const arrayBuffer = await file.arrayBuffer()

    try {
        const pdf = await PDFDocument.load(arrayBuffer, password ? { password } : undefined)
        if (pdf.isEncrypted && !password) {
            throw new Error(ENCRYPTED_MESSAGE)
        }
        return pdf
    } catch (err) {
        if (err instanceof Error && err.message === ENCRYPTED_MESSAGE) {
            throw err
        }

        const message = err instanceof Error ? err.message.toLowerCase() : ""
        if (message.includes("encrypt") || message.includes("password")) {
            if (password) {
                throw new Error("Incorrect password, or this PDF cannot be decrypted in the browser.")
            }
            throw new Error(ENCRYPTED_MESSAGE)
        }

        try {
            const maybeEncrypted = await PDFDocument.load(arrayBuffer, {
                ignoreEncryption: true,
                ...(password ? { password } : {}),
            })
            if (maybeEncrypted.isEncrypted && !password) {
                throw new Error(ENCRYPTED_MESSAGE)
            }
            return maybeEncrypted
        } catch (inner) {
            if (inner instanceof Error && (inner.message === ENCRYPTED_MESSAGE || inner.message.includes("Incorrect password"))) {
                throw inner
            }
        }

        throw new Error(
            err instanceof Error && err.message
                ? err.message
                : "Could not read this PDF. It may be damaged or unsupported."
        )
    }
}

export function toUserFacingError(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message) return err.message
    return fallback
}

export async function getPdfPageCount(file: File, password?: string): Promise<number> {
    const pdf = await loadPdfDocument(file, password)
    return pdf.getPageCount()
}

export async function mergePdfs(
    files: File[],
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    if (files.length < 2) {
        throw new Error("At least two PDF files are required to merge.")
    }

    const mergedPdf = await PDFDocument.create()

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        onProgress?.({
            current: i + 1,
            total: files.length,
            message: `Merging ${file.name}`,
        })
        const pdf = await loadPdfDocument(file)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    return await mergedPdf.save()
}

export async function splitPdf(
    file: File,
    startPage: number,
    endPage: number,
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    onProgress?.({ current: 0, total: 1, message: "Reading PDF…" })
    const pdf = await loadPdfDocument(file)
    const totalPages = pdf.getPageCount()

    if (!Number.isInteger(startPage) || !Number.isInteger(endPage)) {
        throw new Error("Start and end pages must be whole numbers.")
    }
    if (startPage < 1 || endPage < 1) {
        throw new Error("Page numbers must be 1 or greater.")
    }
    if (startPage > endPage) {
        throw new Error("Start page cannot be greater than end page.")
    }
    if (startPage > totalPages) {
        throw new Error(`This PDF only has ${totalPages} page${totalPages === 1 ? "" : "s"}.`)
    }

    const start = startPage - 1
    const end = Math.min(totalPages, endPage) - 1
    const pageIndices: number[] = []
    for (let i = start; i <= end; i++) pageIndices.push(i)

    if (pageIndices.length === 0) {
        throw new Error("No pages were selected for splitting.")
    }

    onProgress?.({ current: 1, total: 1, message: "Extracting pages…" })
    const splitPdfDoc = await PDFDocument.create()
    const copiedPages = await splitPdfDoc.copyPages(pdf, pageIndices)
    copiedPages.forEach((page) => splitPdfDoc.addPage(page))
    return await splitPdfDoc.save()
}

export type CompressQuality = "high" | "medium" | "low"

const COMPRESS_PRESETS: Record<CompressQuality, { scale: number; jpegQuality: number }> = {
    high: { scale: 1.5, jpegQuality: 0.82 },
    medium: { scale: 1.2, jpegQuality: 0.65 },
    low: { scale: 1.0, jpegQuality: 0.45 },
}

/**
 * Recompresses a PDF by rasterizing each page to JPEG and rebuilding the document.
 * This produces meaningful size reductions for image-heavy PDFs (lossy).
 */
export async function compressPdf(
    file: File,
    quality: CompressQuality = "medium",
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    const preset = COMPRESS_PRESETS[quality]
    const pageCount = await getPdfPageCount(file)
    const out = await PDFDocument.create()

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        onProgress?.({
            current: pageNumber,
            total: pageCount,
            message: `Compressing page ${pageNumber} of ${pageCount}`,
        })

        const { bytes, width, height } = await renderPdfPageToJpeg(file, pageNumber, {
            scale: preset.scale,
            quality: preset.jpegQuality,
        })

        const image = await out.embedJpg(bytes)
        const page = out.addPage([width, height])
        page.drawImage(image, { x: 0, y: 0, width, height })
    }

    out.setCreator("")
    out.setProducer("pdFahim")
    return await out.save({ useObjectStreams: true })
}

/**
 * Lightweight metadata cleanup without rasterizing pages.
 */
export async function optimizePdfStructure(file: File): Promise<Uint8Array> {
    const pdf = await loadPdfDocument(file)
    pdf.setCreator("")
    pdf.setProducer("")
    pdf.setTitle("")
    pdf.setSubject("")
    pdf.setKeywords([])
    return await pdf.save({ useObjectStreams: true })
}

function resolveImageKind(file: File): "jpg" | "png" {
    const type = file.type.toLowerCase()
    const name = file.name.toLowerCase()

    if (type === "image/jpeg" || type === "image/jpg" || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
        return "jpg"
    }
    if (type === "image/png" || name.endsWith(".png")) {
        return "png"
    }
    throw new Error(`Unsupported image format: ${file.type || file.name}`)
}

export async function imagesToPdf(
    files: File[],
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    if (files.length === 0) {
        throw new Error("At least one image is required.")
    }

    const pdfDoc = await PDFDocument.create()

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        onProgress?.({
            current: i + 1,
            total: files.length,
            message: `Adding ${file.name}`,
        })
        const arrayBuffer = await file.arrayBuffer()
        const kind = resolveImageKind(file)
        const image = kind === "jpg"
            ? await pdfDoc.embedJpg(arrayBuffer)
            : await pdfDoc.embedPng(arrayBuffer)
        const page = pdfDoc.addPage([image.width, image.height])
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        })
    }

    return await pdfDoc.save()
}

export type WatermarkOptions = {
    text: string
    opacity?: number
    fontSize?: number
    onProgress?: ProgressCallback
}

export async function watermarkPdf(file: File, options: WatermarkOptions): Promise<Uint8Array> {
    const text = options.text.trim()
    if (!text) throw new Error("Enter watermark text.")

    const pdf = await loadPdfDocument(file)
    const font = await pdf.embedFont(StandardFonts.HelveticaBold)
    const pages = pdf.getPages()
    const opacity = Math.min(1, Math.max(0.05, options.opacity ?? 0.28))
    const fontSize = options.fontSize ?? 48

    for (let i = 0; i < pages.length; i++) {
        options.onProgress?.({
            current: i + 1,
            total: pages.length,
            message: `Watermarking page ${i + 1}`,
        })
        const page = pages[i]
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        page.drawText(text, {
            x: (width - textWidth) / 2,
            y: height / 2 - fontSize / 2,
            size: fontSize,
            font,
            color: rgb(0.45, 0.45, 0.45),
            rotate: degrees(-32),
            opacity,
        })
    }

    return await pdf.save()
}

export async function protectPdf(
    file: File,
    userPassword: string,
    ownerPassword?: string,
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    if (!userPassword.trim()) {
        throw new Error("Enter a password to protect this PDF.")
    }

    onProgress?.({ current: 1, total: 2, message: "Preparing document…" })
    const source = await loadPdfDocument(file)
    const secured = await PDFDocument.create()
    const pages = await secured.copyPages(source, source.getPageIndices())
    pages.forEach((page) => secured.addPage(page))

    onProgress?.({ current: 2, total: 2, message: "Encrypting…" })
    secured.encrypt({
        userPassword,
        ownerPassword: ownerPassword?.trim() || userPassword,
    })

    return await secured.save()
}

export async function unlockPdf(
    file: File,
    password: string,
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    if (!password) {
        throw new Error("Enter the PDF password.")
    }

    onProgress?.({ current: 1, total: 2, message: "Decrypting…" })
    const source = await loadPdfDocument(file, password)
    const unlocked = await PDFDocument.create()
    const pages = await unlocked.copyPages(source, source.getPageIndices())
    pages.forEach((page) => unlocked.addPage(page))

    onProgress?.({ current: 2, total: 2, message: "Saving unlocked PDF…" })
    return await unlocked.save()
}

export type DownloadResult = {
    filename: string
    size: number
}

export function downloadFile(data: Uint8Array, filename: string, type = "application/pdf"): DownloadResult {
    const bytes = new Uint8Array(data)
    const blob = new Blob([bytes], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return { filename, size: bytes.byteLength }
}

export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
