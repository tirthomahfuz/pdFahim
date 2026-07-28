# pdFahim

**pdFahim** is a refined, browser-based PDF toolkit tailored for students, independent professionals, and enterprise users. It distills essential document utilities into a focused, minimalist interface designed to maximize productivity and eliminate distractions.

Engineered with **Next.js**, **Tailwind CSS**, and **pdf-lib**, pdFahim operates under a strict local-first paradigm. All document processing is executed entirely within the client's browser environment, ensuring absolute data privacy—no files are ever transmitted to or retained on external servers.

> **Note:** This project serves as a portfolio-grade demonstration of modern UI architecture and advanced client-side web capabilities. It is not currently deployed as a commercial application.

---

## Essential Features

- **Merge PDF:** Consolidate multiple PDF documents into a singular, cohesive file with drag-to-reorder and page thumbnails.
- **Split PDF:** Extract a validated page range into a new document.
- **Compress PDF:** Rebuild pages as optimized JPEGs with High/Medium/Low quality presets for real size savings.
- **Image to PDF:** Convert JPG and PNG images into PDF documents with previews and reordering.
- **Watermark PDF:** Stamp custom text across every page with opacity and size controls.
- **Protect / Unlock PDF:** Encrypt with a password or remove a known password entirely in the browser.
- **PWA Install:** Installable app shell for faster repeat visits.
- **Absolute Privacy:** Functions exclusively on the client-side without relying on backend infrastructure, external APIs, or data uploads.
- **Modern Interface:** Constructed utilizing Tailwind CSS, featuring a design language inspired by premium software aesthetics.

---

## Technical Architecture

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Interface Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Document Processing:** [`@cantoo/pdf-lib`](https://www.npmjs.com/package/@cantoo/pdf-lib) + [PDF.js](https://mozilla.github.io/pdf.js/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Interaction (Drag & Drop):** [React Dropzone](https://react-dropzone.js.org/) + [dnd kit](https://dndkit.com/)
- **Type System:** [TypeScript](https://www.typescriptlang.org/)

---

## Local Development Setup

To initialize and run pdFahim within a local environment, proceed with the following instructions:

### Prerequisites
- Node.js (v18 or a more recent version is recommended)
- Package manager (npm, pnpm, or yarn)

### 1. Repository Cloning
```bash
git clone https://github.com/tirthomahfuz/pdFahim.git
cd pdFahim
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Server Initialization
```bash
npm run dev
```

### 4. Application Access
Navigate to `http://localhost:3000` via your preferred web browser to access the pdFahim interface.

### 5. Tests
```bash
npm test
```

---

## Visual References

- `public/screenshots/landing.png` - Landing hero
- `public/screenshots/tools-dashboard.png` - Tool selection grid
- `public/screenshots/merge-tool.png` - Merge workflow

---

## Project Documentation

- **[Product Specification](docs/product-spec.md)** - Comprehensive details regarding project scope, target demographic, and functional mechanics.
- **[Roadmap](docs/roadmap.md)** - Documentation of prospective features and the overarching project trajectory.

---

<p align="center">
  Engineered for a refined document management experience.
</p>
