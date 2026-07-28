import { PDFDocument, StandardFonts, degrees, rgb } from "@cantoo/pdf-lib"
import { renderPdfPageToJpeg } from "@/lib/pdf-preview"
import { MAX_LOSSY_PAGES, yieldToMain } from "@/lib/runtime"

export type ProgressUpdate = {
    current: number
    total: number
    message?: string
}

export type ProgressCallback = (progress: ProgressUpdate) => void

const ENCRYPTED_MESSAGE =
    "This PDF is password-protected. Open it with the Unlock tool and enter the password."

function isPasswordError(err: unknown) {
    const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase()
    return (
        message.includes("password") ||
        message.includes("encrypt") ||
        message.includes("decrypt") ||
        message.includes("security")
    )
}

async function loadPdfDocument(file: File, password?: string): Promise<PDFDocument> {
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    const attempts: Array<Record<string, unknown> | undefined> = []
    if (password != null && password !== "") {
        attempts.push({ password })
        if (password.trim() !== password) {
            attempts.push({ password: password.trim() })
        }
    } else {
        attempts.push(undefined)
    }

    let lastError: unknown

    for (const options of attempts) {
        try {
            const pdf = await PDFDocument.load(bytes, options)
            if (pdf.isEncrypted && !options?.password) {
                throw new Error(ENCRYPTED_MESSAGE)
            }
            return pdf
        } catch (err) {
            lastError = err
        }
    }

    // Permission-restricted PDFs sometimes open with ignoreEncryption when no user password is set.
    if (!password) {
        try {
            const maybe = await PDFDocument.load(bytes, { ignoreEncryption: true })
            if (maybe.isEncrypted) {
                throw new Error(ENCRYPTED_MESSAGE)
            }
            return maybe
        } catch (err) {
            lastError = err
        }
    }

    if (password) {
        if (isPasswordError(lastError)) {
            throw new Error(
                "Could not unlock this PDF. Check the password, or the encryption type may be unsupported in-browser."
            )
        }
        throw new Error(
            lastError instanceof Error
                ? lastError.message
                : "Could not unlock this PDF. The encryption type may be unsupported in-browser."
        )
    }

    if (isPasswordError(lastError)) {
        throw new Error(ENCRYPTED_MESSAGE)
    }

    throw new Error(
        lastError instanceof Error && lastError.message
            ? lastError.message
            : "Could not read this PDF. It may be damaged or unsupported."
    )
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
        await yieldToMain()
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

export type CompressMode = "lossless" | "lossy"
export type CompressQuality = "high" | "medium" | "low"

const COMPRESS_PRESETS: Record<CompressQuality, { scale: number; jpegQuality: number }> = {
    high: { scale: 1.5, jpegQuality: 0.82 },
    medium: { scale: 1.2, jpegQuality: 0.65 },
    low: { scale: 1.0, jpegQuality: 0.45 },
}

export type CompressOptions = {
    mode?: CompressMode
    quality?: CompressQuality
    onProgress?: ProgressCallback
}

/**
 * Compress a PDF.
 * - lossless: keeps selectable text; cleans metadata / object streams
 * - lossy: rasterizes pages to JPEG for stronger size reduction
 */
export async function compressPdf(
    file: File,
    qualityOrOptions: CompressQuality | CompressOptions = "medium",
    maybeOnProgress?: ProgressCallback
): Promise<Uint8Array> {
    const options: CompressOptions =
        typeof qualityOrOptions === "string"
            ? { mode: "lossy", quality: qualityOrOptions, onProgress: maybeOnProgress }
            : qualityOrOptions

    const mode = options.mode ?? "lossy"
    const onProgress = options.onProgress

    if (mode === "lossless") {
        return optimizePdfStructure(file, onProgress)
    }

    const quality = options.quality ?? "medium"
    const preset = COMPRESS_PRESETS[quality]
    const pageCount = await getPdfPageCount(file)

    if (pageCount > MAX_LOSSY_PAGES) {
        throw new Error(
            `Strong compression is limited to ${MAX_LOSSY_PAGES} pages in the browser (this file has ${pageCount}). Use Lossless mode or split the PDF first.`
        )
    }

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
        await yieldToMain()
    }

    out.setCreator("")
    out.setProducer("pdFahim")
    return await out.save({ useObjectStreams: true })
}

/**
 * Lightweight metadata cleanup without rasterizing pages (keeps selectable text).
 */
export async function optimizePdfStructure(
    file: File,
    onProgress?: ProgressCallback
): Promise<Uint8Array> {
    onProgress?.({ current: 1, total: 2, message: "Cleaning metadata…" })
    const pdf = await loadPdfDocument(file)
    pdf.setCreator("")
    pdf.setProducer("pdFahim")
    pdf.setTitle("")
    pdf.setSubject("")
    pdf.setKeywords([])
    onProgress?.({ current: 2, total: 2, message: "Optimizing structure…" })
    await yieldToMain()
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
        await yieldToMain()
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
        if (i % 5 === 4) await yieldToMain()
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
    await yieldToMain()

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

    onProgress?.({ current: 1, total: 3, message: "Decrypting…" })
    const source = await loadPdfDocument(file, password)

    onProgress?.({ current: 2, total: 3, message: "Copying pages…" })
    const unlocked = await PDFDocument.create()
    const indices = source.getPageIndices()

    // Copy in batches so very large unlocked docs stay responsive
    const batchSize = 10
    for (let i = 0; i < indices.length; i += batchSize) {
        const slice = indices.slice(i, i + batchSize)
        const pages = await unlocked.copyPages(source, slice)
        pages.forEach((page) => unlocked.addPage(page))
        onProgress?.({
            current: 2,
            total: 3,
            message: `Copying pages ${Math.min(i + batchSize, indices.length)} / ${indices.length}`,
        })
        await yieldToMain()
    }

    onProgress?.({ current: 3, total: 3, message: "Saving unlocked PDF…" })
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
