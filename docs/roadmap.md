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

## Phase 2: Enhanced Interactivity (In Progress)
- [x] **File Reordering:** Move uploaded files up/down before merge or image-to-PDF conversion.
- [x] **Split Page Count:** Detect and display PDF page count with validated ranges.
- **PDF Preview Generation:** Use `pdf.js` to render thumbnails of the first page of uploaded PDFs so users have a visual confirmation of their files.
- **Metadata Editor:** A tool to view, add, or scrub PDF properties (Title, Author, Subject, Keywords).
- **Drag-and-Drop Reordering:** Visual drag handles in addition to the current up/down controls.

## Phase 3: Advanced Client-Side Features (Exploring)
- **PDF to Image Conversion:** The reverse of our current tool. Extract pages from a PDF to download as standalone JPG or PNG files.
- **Watermarking:** Add custom text or image watermarks across PDF pages with opacity controls.
- **Password Protection:** Encrypt and password-protect a PDF document securely in the browser.
- **Remove Password:** Strip passwords from known-password PDFs without transmitting the file or password.

## Phase 4: Local Application (Long-Term)
- **Progressive Web App (PWA):** Configure service workers to allow users to install pdFahim directly as a desktop or mobile application.
- **Tauri Integration:** Wrap the Next.js static export using Tauri for a native, lightweight, cross-platform desktop application experience.
