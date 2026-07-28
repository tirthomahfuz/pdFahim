import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored / generated browser assets
    "public/pdf.worker.min.mjs",
    "public/sw.js",
    "public/frames/**",
    // Desktop build artifacts
    "src-tauri/target/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
