# Positive Sum

An interactive, fully cited look at where casino analogies genuinely explain investing — and where they fall apart.

The name is the argument. A casino is negative-sum by construction: every game has an edge built into its rules, so the aggregate result of everyone playing is a loss. A market is positive-sum because the things being traded are claims on businesses that produce goods and services. Everything on the site follows from that one structural difference — including all the places where the comparison genuinely holds.

## What's in it

- **31 analogies**, each stating what it explains *and* where it breaks down
- **16 interactive experiences** running on real historical data
- **28 cited sources** with publisher, date, sample period and assumptions
- **6 datasets** committed with provenance headers
- Installable PWA that works fully offline
- Dark and light themes, WCAG AA, keyboard operable throughout

## Quick start

Requires Node 20.9+ (developed on 24.18).

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Simulation and content-integrity tests |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | Typecheck, lint, test and build in sequence |
| `npm run data` | Re-fetch and rebuild every dataset |

## How it's built

```
data/                 Committed datasets, each with a provenance header
docs/                 Research corpus, ranked analogies, IA, design system
scripts/
  prepare-data.mjs    Fetches and normalises all six datasets
  make-icons.mjs      Generates the PWA icon set
src/
  app/                Routes, metadata, manifest, sitemap, robots, OG images
  components/
    charts/           Distribution and curve primitives (D3 scales, hand-rolled SVG)
    experiences/      The 16 interactives
    ui/               Statistic, PredictionGate, ReframePanel, SourceCard, DataTable
  content/            Analogies, citations, and the types that enforce the rules
  lib/sim/            Seeded simulation engine
public/sw.js          Hand-written service worker
```

### Editorial rules, enforced by the compiler

The content model turns editorial policy into type errors rather than good intentions:

```ts
type Analogy = {
  breaksDownBecause: NonEmpty<string>;   // no one-sided analogies
  citations: NonEmpty<CitationId>;       // no uncited claims
  // ...
};
```

`CitationId` is derived from the keys of the citation database, so referencing a source that doesn't exist fails the build rather than producing a dead footnote. Further rules live in `src/content/content.test.ts`: sources need a publisher, a parseable date and an absolute URL; disputed findings must carry a counter-source; a statistic still marked `to-verify` may inform a page but may never headline one.

### The simulation engine

Every simulation is a pure, seeded function in `src/lib/sim/`. Nothing uses `Math.random()`, so results are reproducible and shareable.

The tests pin the app's claims to published figures. `feeDrag` must reproduce the SEC's own illustration — $100,000 at 4% for 20 years is worth about $179,000 after a 1.00% fee and about $208,000 after 0.25%. If that stops being true the build fails, rather than the site quietly misinforming someone.

Portfolio simulations resample **real** historical returns rather than drawing from a fitted distribution. That is deliberate: the cross-section of stock returns is violently skewed, and any tidy parametric fit would quietly delete the extreme winners that drive the entire result.

### Data

`npm run data` rebuilds everything from public sources. Each file records where it came from, when it was retrieved, and what its limitations are.

| File | Source |
|---|---|
| `sp500-annual.json` | NYU Stern (Damodaran), 1928–2025 |
| `sp500-daily.json` | Yahoo Finance ^GSPC, 7,821 trading days |
| `sp500-monthly.json` | Shiller long-run series with CPI |
| `constituents-year.json` | Real calendar-year returns for ~500 index members |
| `drawdowns.json` | Computed from the monthly series in real terms |
| `casino-games.json` | Wizard of Odds; lottery figure from Matheson & Grote |

Known limitations, stated on the pages that depend on them: constituent data uses current index membership applied backwards (a survivorship bias that flatters the results); the daily series is a price index and excludes dividends; the monthly series ends September 2023, where its CPI data stops.

## Deployment

The whole site prerenders to static pages, so there are no environment variables to configure and no server-side runtime to pay for.

### Vercel

1. Push the repository to GitHub.
2. At [vercel.com/new](https://vercel.com/new), import it. Vercel detects Next.js and needs no configuration.
3. Optionally set `NEXT_PUBLIC_SITE_URL` to your final domain so canonical URLs, the sitemap and OG images point at the right host.

Verify the exact production artefact locally with:

```bash
npm run build && npm start
```

The service worker only registers in production, so offline support must be tested against `npm start` rather than the dev server.

### Anywhere else

`next build` writes a plain folder to `out/`. Any static host serves it — GitHub Pages, Netlify, Cloudflare Pages, an S3 bucket. There is no database, no API and no secrets.

Two things to know if you move hosts:

- **`trailingSlash`.** GitHub Pages serves directories rather than extensionless files, so it needs `trailingSlash: true` in `next.config.ts`. Vercel does not, and setting it there breaks other things — see the comment in that file.
- **Share cards are pre-generated.** `npm run og` renders 32 real `.png` files into `public/og`, which are committed. This deliberately avoids Next's `opengraph-image.tsx` convention, which emits *extensionless* files that static hosts serve as `application/octet-stream`; link-preview scrapers then refuse to render them. Regenerate after editing any analogy headline.

### Two deployment traps worth knowing

- **`vercel.json` accepts no comments.** It is validated against a strict schema, and an unknown key (such as a `"//"` comment) fails the build. Worse, the live site keeps serving the previous build, so nothing *looks* broken — the failure is visible only in the deployment status.
- **Check deployment status, not just the site.** `gh api repos/<owner>/<repo>/deployments` plus the statuses endpoint will tell you whether the build actually shipped.

## Testing

```bash
npm run verify
```

Runs the typechecker, linter, 70+ tests and a production build. The suite covers the simulation maths, the published-figure fixtures, and the content integrity rules.

## Contributing a statistic

1. Add the source to `src/content/citations.ts` with publisher, date, URL, sample period and assumptions. Mark its verification status honestly.
2. Reference it from an analogy in `src/content/analogies.ts`, including at least one entry in `breaksDownBecause`.
3. Run `npm test`. The content tests will reject an unused source, a missing counter-source on a contested finding, or a breakdown section thinner than the endorsement.

If a figure cannot be traced to a primary document, cut it rather than softening the language.

## Known issues

`npm audit` reports advisories in `postcss` and `sharp`, both transitive dependencies of Next.js at its current release. There is no fix available that does not downgrade Next, and neither is reachable in a statically prerendered site that takes no user input server-side.

## Licence and disclaimer

Educational material. Not financial advice, and no product, provider or course of action is recommended anywhere on the site.
