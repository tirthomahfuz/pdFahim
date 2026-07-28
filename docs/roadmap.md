# pdFahim Roadmap

This document outlines the planned trajectory for pdFahim. While the MVP provides immediate utility, these enhancements represent the future vision for a comprehensive, privacy-first PDF toolkit.

## Phase 1: MVP (Completed)
- [x] Next.js setup with Tailwind CSS
- [x] Design system and reusable components
- [x] Landing page and Dashboard UI
- [x] Core Tool: Merge PDF
- [x] Core Tool: Split PDF
- [x] Core Tool: Compress PDF (Client-side)
- [x] Core Tool: Image to PDF
- [x] Privacy Policy & About pages

## Phase 2: Enhanced Interactivity (Completed)
- [x] **File Reordering:** Drag-and-drop reorder for merge and image-to-PDF queues
- [x] **PDF Preview Generation:** First-page thumbnails via `pdf.js`
- [x] **Split Page Count:** Detect and display PDF page count with validated ranges
- [x] **Progress UI:** Progress feedback for multi-step local jobs

## Phase 3: Advanced Client-Side Features (Completed)
- [x] **Real Compression:** Rasterize pages to JPEG with quality presets
- [x] **Watermarking:** Custom text watermarks with opacity/size controls
- [x] **Password Protection:** Encrypt PDFs in-browser via `@cantoo/pdf-lib`
- [x] **Remove Password:** Unlock known-password PDFs without uploading

## Phase 4: Local Application (In Progress)
- [x] **Progressive Web App (PWA):** Installable app shell with service worker
- [ ] **Tauri Integration:** Wrap the Next.js static export using Tauri for a native desktop experience

## Quality & Distribution
- [x] Automated unit tests for core PDF utilities
- [x] Open Graph image generation
- [x] README screenshots (generated from running app when available)
