import { beforeEach, describe, expect, it, vi } from "vitest"
import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib"

vi.mock("@/lib/pdf-preview", () => ({
    renderPdfPageToJpeg: vi.fn(),
}))

import {
    getPdfPageCount,
    mergePdfs,
    splitPdf,
    watermarkPdf,
    protectPdf,
    unlockPdf,
    compressPdf,
} from "@/lib/pdf-utils"

async function makePdfFile(name: string, pages: number, label = "Doc"): Promise<File> {
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    for (let i = 0; i < pages; i++) {
        const page = doc.addPage([400, 600])
        page.drawText(`${label} page ${i + 1}`, {
            x: 40,
            y: 520,
            size: 18,
            font,
            color: rgb(0, 0, 0),
        })
    }
    const bytes = await doc.save()
    return new File([bytes], name, { type: "application/pdf" })
}

describe("pdf-utils", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("counts pages", async () => {
        const file = await makePdfFile("a.pdf", 3)
        await expect(getPdfPageCount(file)).resolves.toBe(3)
    })

    it("merges PDFs in order", async () => {
        const a = await makePdfFile("a.pdf", 2, "A")
        const b = await makePdfFile("b.pdf", 3, "B")
        const merged = await mergePdfs([a, b])
        const doc = await PDFDocument.load(merged)
        expect(doc.getPageCount()).toBe(5)
    })

    it("splits a validated page range", async () => {
        const file = await makePdfFile("range.pdf", 5)
        const split = await splitPdf(file, 2, 4)
        const doc = await PDFDocument.load(split)
        expect(doc.getPageCount()).toBe(3)
    })

    it("rejects invalid split ranges", async () => {
        const file = await makePdfFile("range.pdf", 5)
        await expect(splitPdf(file, 4, 2)).rejects.toThrow(/greater than/i)
        await expect(splitPdf(file, 9, 10)).rejects.toThrow(/only has/i)
    })

    it("applies a watermark without changing page count", async () => {
        const file = await makePdfFile("mark.pdf", 2)
        const marked = await watermarkPdf(file, { text: "DRAFT", opacity: 0.2 })
        const doc = await PDFDocument.load(marked)
        expect(doc.getPageCount()).toBe(2)
    })

    it("protects and unlocks a PDF with a password", async () => {
        const file = await makePdfFile("secret.pdf", 1)
        const protectedBytes = await protectPdf(file, "s3cret")

        await expect(PDFDocument.load(protectedBytes)).rejects.toThrow(/encrypt/i)

        const unlockedFile = new File([protectedBytes], "secret.pdf", { type: "application/pdf" })
        const unlocked = await unlockPdf(unlockedFile, "s3cret")
        const doc = await PDFDocument.load(unlocked)
        expect(doc.getPageCount()).toBe(1)
        expect(doc.isEncrypted).toBe(false)
    })

    it("rejects an incorrect unlock password clearly", async () => {
        const file = await makePdfFile("secret.pdf", 1)
        const protectedBytes = await protectPdf(file, "s3cret")
        const locked = new File([protectedBytes], "secret.pdf", { type: "application/pdf" })
        await expect(unlockPdf(locked, "wrong")).rejects.toThrow(/password|unsupported/i)
    })

    it("lossless compress keeps page count and selectable structure", async () => {
        const file = await makePdfFile("text.pdf", 2)
        const optimized = await compressPdf(file, { mode: "lossless" })
        const doc = await PDFDocument.load(optimized)
        expect(doc.getPageCount()).toBe(2)
    })
})
