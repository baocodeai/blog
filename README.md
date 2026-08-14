# BaoNV — Computer Vision Engineer Portfolio & Technical Blog

A high-performance, minimalist personal portfolio and technical blog built with [Astro](https://astro.build), tailored specifically for **Computer Vision & Edge AI Engineers**.

---

## 🌟 Key Highlights & Architecture

- **Dark-Mode First**: Defaults to high-contrast `tokyo-night` theme with 18 switchable runtime color palettes.
- **Adaptive Logo**: Automatically adapts between high-contrast Electric Cyan (Dark mode with subtle neon glow) and deep sapphire (Light mode).
- **Zero-Margin Favicon**: Multi-resolution favicons with zero-margin tight cropping for maximum tab readability.
- **9 Principles CV Blog Grid**:
  - **16:9 / 16:10 Ratio-Locked Covers**: Ensures clean, uniform card alignment with zero layout shift.
  - **Authentic CV Result Thumbnails**: Visualizes real detection boxes, 3DGS Gaussian ellipsoids, SAM 2 masks, and WebGPU WGSL pipelines.
  - **Featured Hero Banner + 4-Column Grid**: Dynamic rhythm guiding readers into top-priority papers and engineering logs.
  - **Instant Live Filter & Search**: Client-side zero-latency filtering across 6 technical domains (`Detection`, `3D Vision`, `VLM`, `Deployment`, `Diffusion`, `Segmentation`) and search index.
- **Featured Projects**: Live interactive WebGPU demos and repository showcases.
- **Fast & 100% Static**: Pure static HTML/CSS with client-side Pagefind search (Ctrl+K).

---

## 🚀 Quick Start

```sh
npm install
npm run dev       # Start local development server on http://localhost:4321
npm run build     # Compile static bundle and generate Pagefind search index
npm run preview   # Preview the production build locally
npm run check     # Type-check Astro and TypeScript content collections
```

---

## 📁 Directory Layout

```
src/
├── components/         Layout (Header, Nav, Socials, Theme Switcher), TypedLede
├── content/
│   ├── blog/           Markdown articles (Paper Reproductions, Deep Dives, Deployment Logs)
│   └── projects/       Featured CV & Edge AI engineering projects
└── pages/
    ├── index.astro     Hero, 6 Technical Domains, Featured Projects, Recent Posts
    ├── blog/           9-Principle CV Blog (Featured Banner, Domain Chips, 4-Col Grid)
    ├── projects/       Project showcase & live demo cards
    ├── about.astro     Bio, background, and contact
    └── tags/[tag].astro Dynamic tag & domain topic routing
public/
├── covers/             Authentic CV result cover illustrations (16:9 SVGs)
├── css/style.css       Core stylesheet, design system tokens, palette definitions
├── favicon.svg         Zero-margin vector favicon
└── logo.png / logo-dark.png Adaptive high-res brand logos
templates/
├── HUONG-DAN.md        Complete Vietnamese workflow and writing guide
├── bai-viet.md         Starter template for new technical blog posts
└── du-an.md            Starter template for new portfolio projects
```

---

## ✍️ Writing Content

- **New Blog Post**: Copy [`templates/bai-viet.md`](templates/bai-viet.md) to `src/content/blog/your-post-slug.md`.
- **New Project**: Copy [`templates/du-an.md`](templates/du-an.md) to `src/content/projects/your-project-slug.md`.
- **Full Guide**: See [`templates/HUONG-DAN.md`](templates/HUONG-DAN.md) for complete documentation.

---

## 📄 License

AGPL-3.0-or-later.
