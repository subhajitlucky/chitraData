# Market Launch Build Plan

This document outlines how to evolve ChitraData from the current codebase into a market-ready, open-source product. Scope is frontend-only (no backend beyond localStorage), with phases that stay shippable and focused on outclassing paid tools.

## Product Goals
- First-chart-in-60-seconds: minimize friction from landing → sample → preview → export.
- Outclass paid tools: best-in-class readability, guidance, accessibility, and exports—while staying free.
- Frontend-only: everything runs client-side, persisting to localStorage; sharing via exports/snapshots.
- Maintainable, performance-conscious codebase with clear ownership boundaries.

## Phase 0 — Baseline Hardening (Now)
- Tighten sample fidelity: ensure sample `chartType` and palette correctness across pie/doughnut (done).
- Data editor coherence: keep grid in sync with loaded samples/templates (done).
- Home focus: lean landing (hero, 3 value props, chart library strip, CTA) (done).
- Add schemas: define `ChartConfig`, `SampleData`, `Template` via zod for validation.
- Introduce domain folders: `modules/chart-builder`, `modules/gallery`, `modules/landing`, `modules/shared`.
- Establish design tokens: colors, radii, spacing; align Tailwind config to tokens.
- Testing seed: add unit tests for chart recommendations, color assignment, and sample/template parsing.
- Exit criteria: type-safe configs, no critical lint, smoke test “load sample → preview → export”.

## Phase 1 — Experience Core (Week 1–2)
- Builder layout: left rail (data/templates/samples), right rail (style/export), fixed top actions (Undo/Redo/Save/Export).
- Inline “chart doctor”: heuristics (too many slices, missing units, low contrast, label density) with one-click fixes.
- Lightweight previews: use DOM/SVG renderer for cards and gallery thumbnails to avoid Chart.js weight.
- CSV/Excel paste parser with schema inference; friendly errors.
- Exit criteria: create flow <60s with guided path; chart doctor surfaces at least 3 actionable hints; gallery shows live mini-previews.

## Phase 2 — Feature Depth (Week 3–4)
- Brand kits (client-side): logo, font, palette, watermark toggle; stored locally; applied on export.
- Export pipeline: preset aspect ratios (16:9, 4:3, 1:1, 9:16), PNG/PDF/SVG, transparent background option.
- Narrative & annotations: callouts, arrows, and “story frames” you can step through; export as PDF/PNG bundle.
- Template & sample packs: verticalized sets (sales/marketing/ops/finance/civic) with recommended chart types baked in.
- Chart recommendations 2.0: quality scoring, overplot warnings, “try instead” suggestions with short rationale.
- Exit criteria: brand kits reusable across sessions; exports honor presets; story frames export cleanly; recommendations feel opinionated and helpful.

## Phase 3 — Sharing Without Backend (Week 5–6)
- Snapshots: export/import `.cdchart` JSON (data + config + brand kit) for offline collaboration.
- Shareable preview bundles: generate static HTML/PNG/SVG packages users can pass around; optional signed hash for integrity.
- Boards locally: board/grouping UI saved to localStorage; duplicate/move charts between boards.
- Exit criteria: user can export a chart/story as a portable bundle, re-import it, and organize multiple charts locally.

## Phase 4 — Performance, A11y, Reliability (Week 7+)
- Code splitting: lazy-load Chart.js and map studio bundles by route/type; keep DOM/SVG previews lightweight.
- Caching: memoized chart configs; cached templates/samples; defer heavy work off main interactions.
- Accessibility: WCAG contrast checks, colorblind-safe defaults, alt/ARIA for exports; auto alt-text summaries.
- Testing: visual regression for key chart types; e2e smoke (Playwright/Cypress) for “first chart” flow; perf budgets.
- Exit criteria: lighthouse-style pass for a11y/color contrast; p95 interaction under target; green CI for unit + e2e.

## Architecture Guidelines
- Keep renderers swappable: Chart.js for fidelity, DOM/SVG for previews.
- Single source of truth for tokens and chart schemas; no duplicated sample/template definitions.
- Encapsulate exports: shared utility that applies brand kits and sizing; avoid ad-hoc canvas grabs.
- Strong typing at boundaries: validate IO (imports/exports) with zod; narrow props.

## Next Steps to Start (Frontend-only)
- Add zod schemas for chart/sample/template and wire validation into sample/template load.
- Restructure folders into domain modules and introduce design tokens in Tailwind.
- Implement chart doctor v1 (heuristics + inline fixes) and surface inline guidance.
- Replace gallery/template/sample icons with lightweight previews from the DOM/SVG renderer.
- Add export presets (aspect ratios, transparent BG) and local brand kits.

