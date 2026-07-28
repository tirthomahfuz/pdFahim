import { PDFDocument } from "pdf-lib"

/**
 * Returns the page count of a PDF file.
 */
export async function getPdfPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    return pdf.getPageCount()
}

/**
 * Merges multiple PDF files into a single PDF Document.
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
    if (files.length < 2) {
        throw new Error("At least two PDF files are required to merge.")
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

        copiedPages.forEach((page) => {
            mergedPdf.addPage(page)
        })
    }

    return await mergedPdf.save()
}

/**
 * Splits a PDF file by extracting a range of pages.
 * @param startPage 1-indexed start page
 * @param endPage 1-indexed end page
 */
export async function splitPdf(file: File, startPage: number, endPage: number): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

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

    const splitPdfDoc = await PDFDocument.create()
    const pageIndices: number[] = []

    for (let i = start; i <= end; i++) {
        pageIndices.push(i)
    }

    if (pageIndices.length === 0) {
        throw new Error("No pages were selected for splitting.")
    }

    const copiedPages = await splitPdfDoc.copyPages(pdf, pageIndices)
    copiedPages.forEach((page) => {
        splitPdfDoc.addPage(page)
    })

    return await splitPdfDoc.save()
}

/**
 * Optimizes a PDF by resaving with object streams and clearing producer metadata.
 * Client-side pdf-lib cannot recompress embedded images, so reductions are often modest.
 */
export async function compressPdf(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

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

/**
 * Converts multiple image files (JPG/PNG) to a single PDF document.
 */
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
    if (files.length === 0) {
        throw new Error("At least one image is required.")
    }

    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
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

/**
 * Helper to trigger file download in browser
 */
export function downloadFile(data: Uint8Array, filename: string, type = "application/pdf") {
    const bytes = new Uint8Array(data)
    const blob = new Blob([bytes], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
