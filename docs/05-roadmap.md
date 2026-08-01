# Roadmap

What shipped, what was deliberately left out, and what would genuinely improve the site rather than just enlarge it.

## Shipped

31 analogies, 16 interactives, 28 cited sources, 6 committed datasets, offline PWA, WCAG AA, dark and light themes, client-side search, bookmarks, per-analogy OG images, sitemap and structured data.

## Deliberately not built

- **User accounts.** Nothing here needs a server. Adding one would mean collecting reading history the app has no use for, and would break the fully-static deployment.
- **A comments layer.** Moderation cost with no educational return.
- **Live market data.** The app needs historical depth, not current quotes. A live API would add a key, rate limits, cost, and a runtime dependency that breaks offline support — in exchange for a number nobody needs here.
- **A "what should I invest in" tool.** The site presents evidence and states its own limits. Turning that into a recommendation engine would cross from education into advice.

## Next, in rough order of value

### 1. Correct the survivorship bias in the constituent data
The single biggest honesty gap. Current index membership is applied backwards, which excludes every company that was dropped and therefore flatters the cross-section. A point-in-time membership list would make the roulette and diversification interactives materially more truthful. This is a data-sourcing problem, not a code problem.

### 2. International history
Every long-horizon claim rests on US data, and the US was the twentieth century's most successful equity market. Dimson, Marsh and Staunton's multi-country dataset is the standard corrective and would let the holding-period interactive show what the same question looks like in markets that did *not* win. This would strengthen the site's argument by weakening its most over-claimed page.

### 3. Extend the corpus toward 60–80 entries
The research doc lists the gaps: recency bias, confirmation bias, home-country bias, the equity risk premium puzzle, dispersion versus manager skill, leveraged ETF decay, base-rate neglect in forecasts.

### 4. Finish the verification pass
Most sources are `secondary` — the figure is corroborated and the primary document is identified, but the PDF has not been read line by line. Working through those to `primary` would let the sources page show a much stronger claim. One entry (`sequence-risk`) is still `to-verify` and is barred from headlining by the content tests.

### 5. Total-return daily series
The missing-best-days interactive uses a price index, so its levels sit below the published total-return figures. A dividend-adjusted daily series would let it reproduce Hartford's numbers directly rather than approximately.

### 6. Shareable simulation runs
The engine is already seeded and deterministic; the seed just isn't in the URL yet. Encoding it would let someone share the exact run they saw rather than a different one that happens to make the same point.

### 7. Reduced-motion verification in CI
The reduced-motion paths are implemented and reviewed but were verified by code inspection rather than by emulating the media query in a browser. A Playwright run with `prefers-reduced-motion: reduce` would turn that into a real check.

### 8. Per-route code splitting for the interactives
The experience registry uses static imports because a `next/dynamic` registry left the server-rendered markup permanently suspended and un-hydrated. Restoring code splitting — most likely by importing each experience directly in a per-key route segment — would trim the shared bundle. Correctness first; this is an optimisation, and the site is small enough that it can wait.

## Things that would be tempting and wrong

- **Adding a "score" or streak mechanic across the whole site.** Calibration scoring works in Guess the Odds because being wrong is the lesson. Gamifying the rest would import exactly the psychology the site is trying to explain.
- **Making the analogies more dramatic.** Several are deliberately undersold — the blackjack one openly calls itself the weakest comparison on the site. That is a feature.
- **Dropping the contested Morningstar statistic.** It is the clearest opportunity the site has to model what to do when the evidence genuinely disagrees.
