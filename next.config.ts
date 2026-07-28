import type { NextConfig } from "next";

const isTauri = process.env.TAURI_ENV === "1";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Static export feeds the Tauri desktop bundle.
  ...(isTauri ? { output: "export" as const } : {}),
  images: {
    unoptimized: isTauri,
  },
  // pdf.js worker is served from /public; keep package imports client-bundled.
  turbopack: {
    resolveAlias: {
      canvas: "./src/lib/empty-module.ts",
    },
  },
};

export default nextConfig;
