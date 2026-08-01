# Information Architecture, User Flow & Wireframes — Phase 3

## Site map

```
/                        Thesis + featured + entry paths
├── /analogies           Index: search, category filter, tag filter
│   └── /[slug]          Detail (30 pages, each independently shareable)
├── /play                Interactive hub
│   └── /[experience]    Full-bleed interactive (16 pages)
├── /sources             Citation database — sortable, filterable, linkable
├── /about               Methodology, integrity statement, what this is not
└── /bookmarks           Locally saved items
```

Two routes intentionally omitted from v1: user accounts (nothing here needs a server, and adding one would mean collecting data the app has no use for) and a comments layer (moderation cost with no educational return).

## Navigation model

Persistent top bar: wordmark · Analogies · Play · Sources · About · search (`⌘K`/`/`) · bookmarks · theme toggle. On mobile it collapses to wordmark + search + a sheet menu.

Analogy and experience pages carry prev/next within their tier, so the app can be read straight through like a publication rather than only browsed.

## Three entry paths

The home page offers three doors instead of one, because the audiences are genuinely different:

1. **"Test your intuition"** → `/play/guess-odds`. For the casual visitor. Prediction-first, immediately engaging, and the calibration score gives a reason to continue.
2. **"Start from the beginning"** → a curated 8-stop sequence through the tier-1 interactives, ordered so each builds on the last: coin flip → house edge → red or black → 4% jackpot → diversification → best days → holding period → zero-sum. This is the argument in its intended order.
3. **"Browse the evidence"** → `/analogies`. For the skeptical or already-informed reader who wants to check the sourcing before accepting any framing.

## Core user flow

```
Landing
  └─> pick a door
        ├─ Guess the Odds ──> predict ─> reveal ─> "see the full analogy" ──┐
        ├─ Guided sequence ─> analogy 1 ─> ... ─> analogy 8 ────────────────┤
        └─ Browse index ────> filter ─> analogy detail ────────────────────>┤
                                                                            │
                              ┌─────────────────────────────────────────────┘
                              v
                     Analogy detail page
                     Hook ─> Predict ─> Reveal ─> Reframe ─> Cite
                              │
                     ┌────────┼────────┬──────────────┐
                     v        v        v              v
                  bookmark  share   next analogy   /sources
```

## Page rhythm (every analogy detail page)

The same five-beat structure everywhere, so the app reads as one publication:

1. **Hook** — the statistic, set large, with an animated count-up. One sentence of context. No interpretation yet.
2. **Predict** — the user commits a guess before seeing data. This is the step that makes it stick, and it is not skippable-by-default (though it is dismissible for repeat visitors).
3. **Reveal** — the interactive or chart. The user's own guess stays visible as a marker on the result.
4. **Reframe** — "What this explains well" and "What this does not explain", two columns, equal width, equal typographic weight, no colour coding that implies one is the verdict.
5. **Cite** — inline expandable source cards: publisher, date, sample period, assumptions, link. Contested statistics show both sides here.

The Reframe step is the reason the app exists. It is never collapsed by default, never below a "read more", and on mobile the two panels stack in alternating order across pages so neither position is consistently first.

## Wireframes

### Home — desktop
```
┌──────────────────────────────────────────────────────────────┐
│ POSITIVE SUM      Analogies  Play  Sources  About   ⌘K ☆ ◐   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   Half of all stocks lose money.                             │
│   The market still goes up.                                  │
│                                                              │
│   Both of those are true. Understanding why is the           │
│   difference between investing and gambling.                 │
│                                                              │
│   [ Test your intuition ]  [ Start from the beginning ]      │
│   [ Browse the evidence ]                                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│   ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│   │  51.6%     │  │   5.26%    │  │    4%      │            │
│   │  of stocks │  │  house edge│  │  of firms  │            │
│   │  lost money│  │  vs 1% fee │  │  made it all│           │
│   │  ─────────>│  │  ─────────>│  │  ─────────>│            │
│   └────────────┘  └────────────┘  └────────────┘            │
├──────────────────────────────────────────────────────────────┤
│   THE ARGUMENT IN ONE LINE                                   │
│   A casino is negative-sum by design. A market is            │
│   positive-sum because businesses produce things.            │
│   Everything else on this site is a consequence of that.     │
└──────────────────────────────────────────────────────────────┘
```

### Analogy detail — desktop
```
┌──────────────────────────────────────────────────────────────┐
│ ‹ Analogies                                    ☆ Save  ↗ Share│
├──────────────────────────────────────────────────────────────┤
│ CONCENTRATION & SKEW                                          │
│ Red or Black, 500 Times                                       │
│                                                               │
│      44%                                                      │
│      of S&P 500 members beat the index in H1 2025             │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│ ┌─ BEFORE YOU LOOK ──────────────────────────────────────┐   │
│ │ What share do you think finished the year positive?     │   │
│ │ 0% ──────────●──────────── 100%        [ Lock it in ]   │   │
│ └─────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪  500 companies │   │
│ │ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪                │   │
│ │ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪  ▲ your guess  │   │
│ │ [ Pick one at random ]  [ Buy the whole index ]          │   │
│ └─────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ ┌── WHAT THIS EXPLAINS ────┐ ┌── WHAT IT DOESN'T ─────────┐  │
│ │ • A one-year single-stock│ │ • Roulette pays a fixed     │  │
│ │   pick is close to a     │ │   35:1. Stocks are unbounded│  │
│ │   coin flip              │ │   above, capped at −100%    │  │
│ │ • Most people overrate   │ │ • The wheel's odds are known│  │
│ │   their odds             │ │   exactly. These are        │  │
│ │                          │ │   estimated from history    │  │
│ │                          │ │ • Cap-weighting means the   │  │
│ │                          │ │   index ≠ the average square│  │
│ └──────────────────────────┘ └─────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ SOURCES                                                       │
│ ▸ S&P Dow Jones Indices — In the Shadows of Giants            │
│   Published 2025 · Sample: S&P 500 constituents, H1 2025      │
│   Assumptions: total return incl. dividends       [ open ↗ ]  │
└──────────────────────────────────────────────────────────────┘
```

### Analogy detail — mobile (375px)
```
┌───────────────────────┐
│ ‹        ☆   ↗        │
├───────────────────────┤
│ CONCENTRATION & SKEW  │
│ Red or Black,         │
│ 500 Times             │
│                       │
│   44%                 │
│   beat the index      │
├───────────────────────┤
│ BEFORE YOU LOOK       │
│ 0% ────●──── 100%     │
│ [    Lock it in     ] │
├───────────────────────┤
│ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪        │
│ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪  500   │
│ ▪▪▪▪▪▪▪▪▪▪▪▪▪▪        │
│ [ Pick one at random ]│
│ [ Buy the index      ]│
├───────────────────────┤
│ WHAT THIS EXPLAINS    │
│ • ...                 │
├───────────────────────┤
│ WHAT IT DOESN'T       │
│ • ...                 │
├───────────────────────┤
│ SOURCES ▸             │
└───────────────────────┘
```

Grid: single column below 768px, two columns to 1280px, three-column editorial with a wide centre well above that. Interactives are full-bleed on mobile and constrained to the centre well on desktop.

### Analogy index
```
┌──────────────────────────────────────────────────────────────┐
│ [ search analogies…                                    ⌘K ]  │
│ All · Skew · Costs · Behaviour · Time · Diversification      │
│ ○ Has interactive   ○ Bookmarked                             │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ 51.6%        │ │ 5.26% / 1%   │ │ 40%          │          │
│ │ Most stocks  │ │ House edge   │ │ Catastrophic │          │
│ │ lose money   │ │ vs your fee  │ │ losses       │          │
│ │ SKEW    ▶play│ │ COSTS   ▶play│ │ SKEW         │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

## Accessibility architecture

Not a late pass — structural decisions made here:

- Every interactive ships a **screen-reader data table** rendered alongside (visually hidden, toggleable to visible). The simulation results are data; they must be readable as data.
- **Colour is never the only encoding.** Green/red is this app's primary axis and also the most common colour-vision deficiency, so gain/loss additionally carries shape (▲/▼) and position. Verified against deuteranopia and protanopia simulation.
- Every interactive is **fully keyboard operable**, including the prediction sliders (arrow keys, Home/End) and the roulette grid (arrow navigation, Enter to select).
- `prefers-reduced-motion` gets a **static equivalent that still teaches** — the roulette field renders resolved rather than animating in, the count-up shows its final value. Reduced motion must never mean reduced information.
- Focus order follows the five-beat page rhythm. Skip link to main content and a second skip link past each interactive.

## SEO and sharing

Each analogy page has its own title, description, canonical URL, and generated OG image showing the headline statistic. `Article` structured data with `citation` fields pointing at the primary sources. Sitemap covers all 30 analogy pages, 16 experience pages, and the source database. Seeded simulations encode their seed in the URL, so a shared link reproduces the exact run the sender saw.
