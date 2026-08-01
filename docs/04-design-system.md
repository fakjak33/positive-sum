# Design System & Component Library — Phase 4

## Principle

The app uses casino *mechanics* and rejects casino *aesthetics*. No felt green, no neon, no chrome, no coin-drop sounds, no reels that jitter for excitement. The reference points are Swiss modernism, NYT visual journalism and Bloomberg's data graphics — the visual language of a serious publication that happens to be interactive.

This is a substantive decision, not a taste one. An app that looks like a casino while explaining that investing is not a casino undercuts its own argument on sight.

## Colour

Dark is the default and the designed-for case. Light mode is supported and tested, not an afterthought.

```
--bg              #0B0D0F   page
--surface         #12161A   cards
--surface-raised  #1A1F25   popovers, tooltips
--border          #262D35   hairlines
--text            #F2F0EB   primary (off-white, never pure #FFF)
--text-muted      #9BA4AE   secondary
--text-subtle     #6B747E   captions, metadata

--gain            #10B981   emerald — positive outcomes
--loss            #E5484D   vermilion — negative outcomes
--rare            #D4A24C   gold — RESERVED for tail events only
--market          #2B5FA8   deep blue — the index / aggregate
--house           #8B5CF6   violet — casino-side series
```

Rules that are enforced, not suggested:

- **Gold means rare.** It appears only on genuine tail events — a top-4% company, a jackpot, a black swan. If gold shows up, something statistically unusual happened. Using it decoratively would destroy a colour channel the app relies on for meaning.
- **Vermilion, not casino red.** `#E5484D` reads as editorial loss, not as a roulette table.
- **Colour never encodes alone.** Gain/loss carries ▲/▼ and position as well. This is the app's main axis and also the most common colour-vision deficiency.
- Every text/background pair verified ≥4.5:1; large text ≥3:1. `--text-subtle` on `--bg` is 4.6:1 and is the tightest pair in the system.

Light mode inverts the neutrals and darkens the semantics (`--gain` → `#047857`, `--loss` → `#C6282D`) to hold contrast against a light field.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display / headlines | Instrument Serif | Editorial voice; only at 32px+ |
| UI / body | Inter | Variable, `feature-settings: 'cv05','ss01'` |
| Numerals / data | JetBrains Mono | **All** figures, so columns align |

Self-hosted through `next/font` with `display: swap` and subsetting — required for offline support, and it removes a third-party request.

Scale (1.25 ratio): 12 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61. Body 16/1.6. Measure capped at 68ch. Statistics render at 61px in mono with `-0.02em` tracking.

## Space & form

8px base scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Radii: 4 (inputs) · 8 (cards) · 12 (modals) · full (pills). Shadows are low-opacity and large-radius (`0 1px 2px rgb(0 0 0 / .3), 0 8px 24px rgb(0 0 0 / .2)`) — depth, not drama. Borders are 1px hairlines at `--border`; in dark mode a hairline does more work than a shadow.

## Motion

Springs, not eases, for anything physical. `{ type: 'spring', stiffness: 260, damping: 30 }`. Durations 150ms (micro) / 250ms (transition) / 400ms (reveal). Staggered children at 20–40ms.

The one place the app permits theatre is the reveal beat — 500 squares resolving, reels landing, a curve collapsing as days are removed. Everything else is quiet.

**Reduced motion is a first-class path, not a fallback.** Under `prefers-reduced-motion: reduce`, animations resolve instantly to their end state; the roulette field renders already-resolved, count-ups show final values, the crash simulator steps rather than scrubs. The rule: *reduced motion must never mean reduced information*.

## Component library

### Primitives
`Button` (primary/secondary/ghost, 44px min touch target) · `Slider` (keyboard: arrows, shift+arrows, Home/End; touch target 44px) · `Toggle` · `Tabs` · `Popover` · `Tooltip` (hover *and* focus *and* tap) · `Sheet` (mobile nav/filters) · `Skeleton`

### Data display
- **`Statistic`** — the hero figure. Mono, CSS-only reveal, optional caption. Deliberately *not* a numeric count-up: many headlines are not numbers ("2× Kelly ≈ 0", "Same average, different ending"), so an animated counter was both dead code and the wrong idea for the content. Being CSS-only, it respects reduced motion through the global rule with no JavaScript involved.
- **`SourceCard`** — publisher, date, sample period, assumptions, external link. Collapsed by default on mobile, expanded on desktop. Renders a `contested` variant with both sides side by side.
- **`AnalogyCard`** — index tile: statistic, title, category chip, interactive indicator, bookmark toggle.
- **`ReframePanel`** — the works/breaks-down pair. Enforces equal width and equal weight; accepts no "primary" prop by design, so no caller can visually favour one side.
- **`DataTable`** — the screen-reader-accessible representation of every simulation result. Visually hidden by default, toggleable to visible for anyone who prefers numbers to pictures.

### Visualisation
Built on `d3-scale`, `d3-shape`, `d3-array` — modular imports only, never the full `d3` bundle, which would roughly triple the JS payload for no benefit.

- **`Axis`** — shared x/y with responsive tick density
- **`Grid`** — the 500-square constituent field, canvas-rendered above ~200 nodes for frame rate
- **`DistributionChart`** — histogram + kernel density, used by every Monte Carlo interactive
- **`PathChart`** — many semi-transparent simulated paths plus highlighted percentiles
- **`ComparisonCurves`** — two compounding series, used by house-edge-vs-fees and volatility drag
- **`Timeline`** — scrubable historical series for best-days and the crash simulator

### Interactive shell
- **`PredictionGate`** — the Predict beat. Slider or multiple choice, locks in an answer, persists it, and renders it as a marker on the subsequent reveal. Used by all 16 interactive analogies, which is what makes the prediction mechanic feel native rather than bolted on.
- **`ExperienceFrame`** — full-bleed wrapper: title, reset, seed display, share-this-run, reduced-motion notice.
- **`SeedControl`** — shows and edits the RNG seed. Every simulation is reproducible and shareable by URL.

## Iconography

Lucide, 1.5px stroke, 20px default. No suit symbols, dice, or chips as decoration — they appear only where they carry meaning inside an interactive.

## Voice

Sentences over fragments. No exclamation marks. Numbers always carry their units and period. Never "shocking", "insane", "guaranteed", or "you should". The app presents evidence and names its own limitations; it does not give advice, and the About page says so explicitly.

Headlines state the finding, not the reaction: "Half of all stocks lose money" — not "The SHOCKING truth about stocks".
