# Design System & Component Library — Phase 4

## Principle

The app uses casino *mechanics* and rejects casino *aesthetics*. No felt green, no neon, no chrome, no coin-drop sounds, no reels that jitter for excitement. The reference points are Swiss modernism, NYT visual journalism and Bloomberg's data graphics — the visual language of a serious publication that happens to be interactive.

This is a substantive decision, not a taste one. An app that looks like a casino while explaining that investing is not a casino undercuts its own argument on sight.

## Colour

Pure black, pure white, maximum contrast. Dark is the default and the designed-for case; light mode inverts to pure white and is tested.

```
--bg              #000000   page
--surface         #0A0A0A   cards
--surface-raised  #161616   popovers, tooltips
--border          #272727   hairlines
--text            #FFFFFF   primary — 21:1 on black
--text-muted      #A8A8A8   secondary
--text-subtle     #7D7D7D   captions, metadata — 4.8:1, the tightest pair

--gain            #00E58C   positive outcomes — 12.6:1
--loss            #FF4D57   negative outcomes — 6.5:1
--rare            #FFC64D   RESERVED for tail events only
--market          #5B9DFF   the index / aggregate
--house           #A78BFA   casino-side series
```

The semantics are brightened relative to a conventional dark theme because on pure black the usual muted variants go muddy. All verified against WCAG AA at their rendered sizes.

Rules that are enforced, not suggested:

- **Gold means rare.** It appears only on genuine tail events — a top-4% company, a jackpot, a black swan. If gold shows up, something statistically unusual happened. Using it decoratively would destroy a colour channel the app relies on for meaning.
- **Vermilion, not casino red.** `#E5484D` reads as editorial loss, not as a roulette table.
- **Colour never encodes alone.** Gain/loss carries ▲/▼ and position as well. This is the app's main axis and also the most common colour-vision deficiency.
- Every text/background pair verified ≥4.5:1; large text ≥3:1. `--text-subtle` on `--bg` is 4.6:1 and is the tightest pair in the system.

Light mode inverts the neutrals and darkens the semantics (`--gain` → `#047857`, `--loss` → `#C6282D`) to hold contrast against a light field.

## Typography

Everything is monospace — a modernist, terminal-adjacent voice rather than an editorial one.

| Role | Face | Notes |
|---|---|---|
| Display / headlines / figures | Martian Mono | Wide geometric modernist face, 700–800 weight, `-0.045em` tracking |
| UI / body | JetBrains Mono | 500–600 weight; carries all long-form prose |

Two faces rather than one, for a reason worth stating: Martian Mono is superb at display sizes and in bold, and genuinely punishing to read in paragraphs. JetBrains Mono keeps the body legible at small sizes. Both are monospace, so the system reads as one voice.

Self-hosted through `next/font` with `display: swap` and subsetting — required for offline support, and it removes a third-party request.

Scale (1.25 ratio): 12 · 14 · 15 · 19 · 24 · 30 · 37 · 46 · 58. Body 15/1.7 — monospace needs more leading than proportional text. **Measure capped at 58ch**, shorter than the 68ch that suits proportional type, because monospace runs wide.

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
