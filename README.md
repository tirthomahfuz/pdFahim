# pdFahim

**pdFahim** is a refined, browser-based PDF toolkit tailored for students, independent professionals, and enterprise users. It distills essential document utilities into a focused, minimalist interface designed to maximize productivity and eliminate distractions.

Engineered with **Next.js**, **Tailwind CSS**, and **pdf-lib**, pdFahim operates under a strict local-first paradigm. All document processing is executed entirely within the client's browser environment, ensuring absolute data privacy—no files are ever transmitted to or retained on external servers.

> **Note:** This project serves as a portfolio-grade demonstration of modern UI architecture and advanced client-side web capabilities. It is not currently deployed as a commercial application.

---

## Essential Features

- **Merge PDF:** Consolidate multiple PDF documents into a singular, cohesive file.
- **Split PDF:** Extract specific pages or partition comprehensive documents into localized segments.
- **Compress PDF:** Clean metadata and optimize PDF structure client-side. Reductions are often modest on image-heavy files.
- **Image to PDF:** Seamlessly convert JPG and PNG image formats into properly structured PDF documents.
- **Absolute Privacy:** Functions exclusively on the client-side without relying on backend infrastructure, external APIs, or data uploads.
- **Modern Interface:** Constructed utilizing Tailwind CSS, featuring a design language inspired by premium software aesthetics.

---

## Technical Architecture

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Interface Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Document Processing:** [pdf-lib](https://pdf-lib.js.org/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Interaction (Drag & Drop):** [React Dropzone](https://react-dropzone.js.org/)
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

---

## Visual References

*(Placeholders - Actual visual assets should be deposited within the `public/screenshots/` directory)*

- `public/screenshots/landing.png` - Demonstration of the primary application interface.
- `public/screenshots/tools-dashboard.png` - The primary utility selection grid.
- `public/screenshots/merge-tool.png` - The interactive file composition interface.

---

## Project Documentation

- **[Product Specification](docs/product-spec.md)** - Comprehensive details regarding project scope, target demographic, and functional mechanics.
- **[Roadmap](docs/roadmap.md)** - Documentation of prospective features and the overarching project trajectory.

---

<p align="center">
  Engineered for a refined document management experience.
</p>
