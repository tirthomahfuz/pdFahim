import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "pdFahim — private browser PDF toolkit"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "linear-gradient(145deg, #09090b 0%, #1e1b4b 55%, #4c1d95 100%)",
                    color: "white",
                    padding: "72px",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: "#7c3aed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            fontWeight: 700,
                        }}
                    >
                        PDF
                    </div>
                    <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>pdFahim</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, maxWidth: 900 }}>
                        Work with PDFs beautifully
                    </div>
                    <div style={{ fontSize: 30, color: "#d4d4d8", maxWidth: 820 }}>
                        Merge, split, compress, convert, watermark, and protect — privately in your browser.
                    </div>
                </div>

                <div style={{ fontSize: 22, color: "#a1a1aa" }}>100% client-side · No uploads · Free</div>
            </div>
        ),
        { ...size }
    )
}
