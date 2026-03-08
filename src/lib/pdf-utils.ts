import { PDFDocument } from "pdf-lib"

/**
 * Merges multiple PDF files into a single PDF Document.
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
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
    const start = Math.max(1, startPage) - 1
    const end = Math.min(totalPages, endPage) - 1

    const splitPdfDoc = await PDFDocument.create()

    // Extract the specific pages
    const pageIndices = []
    for (let i = start; i <= end; i++) {
        pageIndices.push(i)
    }

    const copiedPages = await splitPdfDoc.copyPages(pdf, pageIndices)
    copiedPages.forEach((page) => {
        splitPdfDoc.addPage(page)
    })

    return await splitPdfDoc.save()
}

/**
 * Compresses a PDF file.
 * Client-side compression with pdf-lib is limited, but we can resave the document 
 * to remove some unused objects and metadata.
 */
export async function compressPdf(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    // Loading and resaving often reduces size by removing unreferenced objects
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

    pdf.setCreator("")
    pdf.setProducer("")

    // Save with objects stream to compress structure
    return await pdf.save({ useObjectStreams: true })
}

/**
 * Converts multiple image files (JPG/PNG) to a single PDF document.
 */
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        let image

        // Check type and embed accordingly
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
            image = await pdfDoc.embedJpg(arrayBuffer)
        } else if (file.type === "image/png") {
            image = await pdfDoc.embedPng(arrayBuffer)
        } else {
            throw new Error(`Unsupported image format: ${file.type}`)
        }

        // Create a page with the dimensions of the image
        const page = pdfDoc.addPage([image.width, image.height])

        // Draw the image on the page
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
    const blob = new Blob([data as any], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
