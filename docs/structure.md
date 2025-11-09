# Project Structure Overview

A quick map of where everything lives in the ChitraData repo. Use it as a compass when exploring or extending the codebase.

## Root
- `src/` – Application source code
- `public/` – Static assets served by Vite
- `dist/` – Production build output (generated)
- `docs/` – Project documentation (this folder)
- `screenshots/` – UI reference imagery
- Config files – `vite.config.ts`, `tailwind.config.js`, `tsconfig*.json`, `eslint.config.js`

## `src/`
```
src
├── assets/              # Static assets imported via bundler (logos, JSON, images)
├── components/          # React components (page-level and shared UI)
│   ├── LandingPage.tsx        – Marketing homepage
│   ├── Navbar.tsx / Footer.tsx – Global shell and navigation
│   ├── GraphCreationNew.tsx   – Chart builder experience
│   ├── IndiaMapPageClean.tsx  – Map studio experience
│   ├── GraphGallery.tsx       – Saved charts gallery
│   ├── ...                   – Supporting components (DataEditor, TemplateGallery, etc.)
├── hooks/               # Reusable React hooks (e.g., undo/redo)
├── utils/               # Helpers for export, palettes, chart recommendations, templates
├── types/               # Shared TypeScript type definitions
├── App.tsx              # Route wiring (React Router) and layout shell
└── main.tsx             # Entry point that mounts `<App />`
```

## Component Flow
- **App.tsx** sets up routes:
  - `/` → `LandingPage`
  - `/chart` (historically `/create`) → `GraphCreationNew`
  - `/map` → `IndiaMapPageClean`
  - `/gallery` → `GraphGallery`
- `Navbar`/`Footer` wrap all routes.
- `GraphCreationNew` composes child components from `components/` and helpers from `utils/` & `hooks/`.
- `IndiaMapPageClean` is standalone but relies on constants and helpers defined near the top of the file.

## Utilities & Data
- `utils/colorPalettes.ts` – Palette definitions consumed by the chart builder.
- `utils/chartRecommendations.ts` – AI-like suggestions for chart type selection.
- `utils/chartTemplates.ts` – Pre-baked chart structures for quick starts.
- `utils/exportUtils.ts` – Export helpers for chart and map experiences.

## Styling
- Tailwind CSS powers most styling.
- Global base styles live in `src/index.css`; the project imports the Inter font there.

## Where to Add New Functionality
- **New page** → create component in `components/`, register route in `App.tsx`.
- **Shared UI piece** → add component under `components/` (optionally in a subfolder).
- **Custom hooks or utilities** → place in `hooks/` or `utils/` to keep logic reusable.
- **Documentation** → add markdown here in `docs/` or in root if it’s broad (e.g., roadmaps).

Keep this sheet updated whenever the structure evolves so future contributors (and your future self) can navigate quickly.
