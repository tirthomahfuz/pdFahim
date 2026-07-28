/** Yield to the browser so large PDF jobs do not freeze the UI. */
export function yieldToMain(timeoutMs = 0): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            setTimeout(resolve, timeoutMs)
            return
        }

        const ric = (
            window as Window & {
                requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
            }
        ).requestIdleCallback

        if (typeof ric === "function") {
            ric(() => resolve(), { timeout: Math.max(16, timeoutMs) })
            return
        }

        setTimeout(resolve, timeoutMs)
    })
}

export const LARGE_FILE_BYTES = 25 * 1024 * 1024
export const VERY_LARGE_FILE_BYTES = 75 * 1024 * 1024
export const LARGE_PAGE_COUNT = 40
export const MAX_LOSSY_PAGES = 150

export function describeFileRisk(file: File, pageCount?: number | null): string | null {
    if (file.size >= VERY_LARGE_FILE_BYTES) {
        return `This file is ${formatMb(file.size)}. Very large PDFs can freeze or crash the browser tab. Consider splitting first.`
    }
    if (file.size >= LARGE_FILE_BYTES) {
        return `This file is ${formatMb(file.size)}. Processing may take a while and use significant memory.`
    }
    if (pageCount != null && pageCount >= LARGE_PAGE_COUNT) {
        return `This PDF has ${pageCount} pages. Large jobs stay responsive, but expect a longer wait.`
    }
    return null
}

function formatMb(bytes: number) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
