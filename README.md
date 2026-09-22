# ChitraData

**A free, browser-based chart studio and India map maker. No signup, no server, no upload.**

Build bar, line, area, pie, and doughnut charts, or turn state-level India data into a choropleth map — then export presentation-ready PNG or PDF files. Everything runs client-side, and your data never leaves your browser.

[![Live Demo](https://img.shields.io/badge/live_demo-chitradata.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://chitradata.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![D3](https://img.shields.io/badge/D3-7.9-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

## Why ChitraData

- **Local-first** — charts and settings persist in `localStorage`; no account, backend, or data upload.
- **Fast** — go from landing page to a finished, exported chart in under a minute.
- **Free and open source** — MIT licensed. The core app is free to use with no paid tiers.

## Features

### Chart studio (`/create`)

- **5 chart types** — bar, line, area, pie, doughnut
- **Live preview** — edits render instantly while you type
- **Templates and samples** — a starter-template gallery plus a ready-made sample data library
- **Styling controls** — 19 color palettes, per-series colors, colorblind-safe pie slices, and light/dark themes
- **Exports** — real PNG and PDF output at HD, 2K, 4K, or 8K with 16:9, 1:1, 4:3, A4, and custom sizes

### India map studio (`/map`)

- **State/UT choropleth** — all 36 states and union territories, rendered with D3 from a bundled GeoJSON
- **Full control** — sequential color scales, palettes, legend, labels, value table, and layout padding
- **High-resolution export** — download the map as a print-ready PNG

### Gallery (`/gallery`)

- Browse and delete locally saved charts, and download any saved chart as PNG

### Experience

- Dark and light mode
- Responsive layout for laptop and mobile
- Smooth motion via Framer Motion

## Routes

| Route      | Page               |
| ---------- | ------------------ |
| `/`        | Landing page       |
| `/create`  | Chart studio       |
| `/map`     | India map studio   |
| `/gallery` | Saved charts       |

## Tech stack

| Technology          | Purpose                        | Version |
| ------------------- | ------------------------------ | ------- |
| React               | UI framework                   | 18.2    |
| TypeScript          | Type safety                    | 5.8     |
| Vite                | Build tool and dev server      | 6       |
| Tailwind CSS        | Styling                        | 3.4     |
| Chart.js            | Canvas chart rendering         | 4.5     |
| react-chartjs-2     | React bindings for Chart.js    | 5.3     |
| D3                  | India map rendering and scales | 7.9     |
| Framer Motion       | Animation                      | 12      |
| Zod                 | Runtime validation             | 4       |
| jsPDF               | PDF export (loaded on demand)  | 3       |
| Vitest              | Unit testing                   | 3       |

## Getting started

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone
git clone https://github.com/subhajitlucky/chitraData.git
cd chitraData

# 2. Install
npm install

# 3. Develop
npm run dev
# → http://localhost:5173
```

### Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server            |
| `npm run build`     | Type-check and build to `dist/` |
| `npm run preview`   | Preview the production build    |
| `npm run lint`      | Run ESLint                      |
| `npm run typecheck` | Run TypeScript checks           |
| `npm test`          | Run the Vitest unit suite       |

### Deployment

Configured for Vercel (`vercel.json` included):

- Build command: `npm run build`
- Output directory: `dist`

## Project structure

```text
chitraData/
├── public/
│   └── india-govt-map.geojson    # Bundled India state/UT boundaries
├── src/
│   ├── components/
│   │   ├── chart-builder/        # Chart studio: editor, templates, palettes, export, guidance
│   │   ├── map/india/            # India map engine: renderers, legends, labels, export helpers
│   │   ├── gallery/              # Saved-chart gallery
│   │   └── landing/              # Landing page
│   ├── App.tsx                   # Routes
│   └── main.tsx                  # Entry point
├── docs/
│   ├── market-launch-plan.md     # Product direction and phases
│   └── structure.md              # Codebase map
├── AGI-readiness.md              # Differentiators in an AI-saturated tool market
└── vercel.json
```

## Design documents

- [`docs/market-launch-plan.md`](docs/market-launch-plan.md) — phased plan: hardening, builder UX, brand kits, offline bundles, accessibility
- [`docs/structure.md`](docs/structure.md) — architecture and module ownership
- [`AGI-readiness.md`](AGI-readiness.md) — why local-first craft still matters

## Roadmap

- [x] Export aspect presets (16:9, 1:1, 4:3, A4) with HD–8K resolution
- [x] Colorblind-safe pie/doughnut defaults
- [x] Unit tests wired into CI (typecheck, lint, test, build)
- [ ] Chart Doctor and insights panel wired into the builder
- [ ] Reopen a saved chart from the gallery
- [ ] Brand kits: logo, fonts, palette, watermark toggle
- [ ] Portable project bundles (`.cdchart`) for offline share and re-import
- [ ] Story frames and annotations for narrative charts
- [ ] District-level India maps
- [ ] Domain data packs (census, budget, economic indicators)
- [ ] Visual-regression and e2e tests
- [ ] Transparent background and 9:16 export presets

## Free and open source

ChitraData is MIT licensed and the core app is and will remain free. There is no backend and no account: chart data, map values, and settings never leave your browser. The hosted site uses privacy-friendly Vercel Analytics to count page views only.

## Contributing

Issues and pull requests are welcome.

1. Fork the repo and create a branch (`feat/your-feature`)
2. Keep changes typed and scoped; run `npm run lint`, `npm test`, and `npm run build` before pushing
3. Open a PR with a short description of the change and screenshots when relevant

## License

[MIT](LICENSE) © Subhajit Pradhan ([@subhajitlucky](https://github.com/subhajitlucky))
