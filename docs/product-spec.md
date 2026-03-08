# pdFahim Product Specification

## 1. Overview
**pdFahim** is a browser-based PDF toolkit. It solves the common pain points of dealing with ad-heavy, limit-restricted, or privacy-invasive online PDF utilities. It offers an instantaneous, local-first alternative wrapped in a premium, modern user interface.

## 2. Target Audience
- **Students:** Needing to merge assignments or split chapters from large textbook PDFs.
- **Freelancers & Job Seekers:** Compiling portfolios, resumes, and cover letters.
- **Office Workers:** Quick daily document adjustments without needing enterprise software licenses.

## 3. Core Principles
- **Privacy by Default:** Zero server uploads. Processing must happen client-side in the browser.
- **SaaS Aesthetic:** The application should look like a paid product, despite being free and local.
- **No Friction:** No accounts, no subscriptions, no complicated deployment setups.
- **Performant:** Instant downloads and quick web-assembly backed JavaScript manipulations.

## 4. MVP Scope Features

### 4.1 Merge PDF
- Accept multiple `.pdf` files.
- Visual file queue (drag and drop).
- Merge action utilizing `pdf-lib`.
- Auto-download result as `merged_document.pdf`.

### 4.2 Split PDF
- Accept a single `.pdf` file.
- Input fields for `Start Page` and `End Page`.
- Boundary validation (start <= end).
- Auto-download result showing the page range in the filename.

### 4.3 Compress PDF
- Accept a single `.pdf` file.
- Client-side optimization (removing unreferenced objects, metadata).
- Display original vs. compressed size.
- Auto-download result.

### 4.4 Image to PDF
- Accept multiple `.jpg`, `.jpeg`, or `.png` images.
- Create a new PDF document and map each image to a newly created page matching the image dimensions.
- Auto-download result.

## 5. Non-Scope Characteristics (Explicitly Forbidden)
- No user accounts or authentication.
- No database connections.
- No payment processing or paywalls.
- No remote APIs for document handling.
- No pseudo-features or placeholder marketing pages that lead nowhere.

## 6. Technical Approach
- Using **Next.js** for the structured application routing and modern React ecosystem.
- Using **Tailwind CSS v4** configured with CSS variables to manage the design system, colors, and typography efficiently.
- Using `pdf-lib` for document manipulation as it operates seamlessly in modern browsers without Node.js polyfills.
- Using standard `Blob` and `URL.createObjectURL` to serve generated PDFs instantly back to the user without a roundtrip.
