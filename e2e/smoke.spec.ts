import { test, expect } from "@playwright/test"
import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib"
import path from "path"
import { writeFileSync, mkdirSync } from "fs"
import os from "os"

async function writeSamplePdf(filePath: string, label: string) {
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const page = doc.addPage([400, 600])
    page.drawText(label, { x: 40, y: 520, size: 20, font, color: rgb(0, 0, 0) })
    writeFileSync(filePath, await doc.save())
}

test.describe("pdFahim smoke", () => {
    test("home and tools pages render", async ({ page }) => {
        await page.goto("/")
        await expect(page.getByText("pdFahim").first()).toBeVisible()
        await expect(page.getByRole("heading", { name: /work with pdfs/i })).toBeVisible()

        await page.goto("/tools")
        await expect(page.getByRole("heading", { name: /all pdf tools/i })).toBeVisible()
        await expect(page.locator('a[href="/tools/merge"]').first()).toBeVisible()
        await expect(page.locator('a[href="/tools/watermark"]').first()).toBeVisible()
        await expect(page.locator('a[href="/tools/protect"]').first()).toBeVisible()
    })

    test("merge tool accepts PDFs and enables merge", async ({ page }) => {
        const dir = path.join(os.tmpdir(), `pdfahim-e2e-${Date.now()}`)
        mkdirSync(dir, { recursive: true })
        const a = path.join(dir, "a.pdf")
        const b = path.join(dir, "b.pdf")
        await writeSamplePdf(a, "Doc A")
        await writeSamplePdf(b, "Doc B")

        await page.goto("/tools/merge")
        await expect(page.getByRole("heading", { name: /merge pdf files/i })).toBeVisible()

        const input = page.locator('input[type="file"]')
        await input.setInputFiles([a, b])

        await expect(page.getByText("a.pdf")).toBeVisible()
        await expect(page.getByText("b.pdf")).toBeVisible()
        await expect(page.getByRole("button", { name: /merge pdfs/i })).toBeEnabled()

        const downloadPromise = page.waitForEvent("download")
        await page.getByRole("button", { name: /merge pdfs/i }).click()
        const download = await downloadPromise
        expect(download.suggestedFilename()).toMatch(/merged/i)
        await expect(page.getByText(/download started/i)).toBeVisible()
    })

    test("compress tool exposes lossless mode", async ({ page }) => {
        await page.goto("/tools/compress")
        await expect(page.getByRole("heading", { name: /compress pdf/i })).toBeVisible()
        await expect(page.getByText(/keep selectable text|lossless/i).first()).toBeVisible()
    })

    test("404 page works", async ({ page }) => {
        await page.goto("/this-route-does-not-exist")
        await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible()
        await expect(page.getByRole("link", { name: /browse tools/i })).toBeVisible()
    })
})
