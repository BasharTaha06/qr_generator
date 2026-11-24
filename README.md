# QRForge Studio

A general-purpose, 100% client-side custom QR Code generator built with React, TypeScript, Tailwind CSS, and `qr-code-styling`.

## Features

- **9 Content Types**: Link/URL (with optional UTM builder), Wi-Fi, vCard Contact, WhatsApp, Plain Text, Email, Phone, SMS, and GPS Location.
- **Deep Visual Customization**:
  - 8 curated presets + full custom solid, linear, and radial gradients
  - Independent Corner Eye frame and center pupil colors
  - Square and Circular QR shapes, 6 data module patterns, custom quiet zone margin, background rounding, and transparency
  - Real-time contrast & scanability checker + Error Correction Levels (`L`, `M`, `Q`, `H`) and matrix version density
- **Center Logo Studio**:
  - 16 vector icons, custom text/monogram badges, or local image uploads (PNG/SVG/JPG/WebP) with adjustable scale, padding, and backdrop shapes
- **Scan Frames & Printable Card Mode**:
  - 6 customizable scan frames (`Bottom Pill`, `Scan Banner`, `Tag Card`, `Dark Frame`, `Badge Border`)
  - Full Printable Card / Sign studio with `Arch Luxury`, `Modern Minimal`, `Midnight Slate`, and `Table Standee` templates
- **Multi-Format Exports**:
  - Infinite-resolution Vector SVG
  - 512px, 1K, 2K, and 4K (300 DPI) PNG / JPEG / WebP
  - High-DPI Framed / Card PNG, print-ready A4 PDF, clipboard copy, and browser print
  - Local saved designs in `localStorage`

## Development

```bash
npm install
npm run dev
npm run build
```
