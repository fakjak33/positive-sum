# Ranked Analogies — Phase 2

Thirty analogies drawn from the [research corpus](01-research-corpus.md), ranked and tiered for build.

## Ranking method

Each analogy scored 1–5 on three axes, ranked by their product:

- **Educational value** — does understanding this change how someone actually behaves or reasons?
- **Visual potential** — is there an interaction that *demonstrates* the point rather than illustrating it?
- **Analogy integrity** — how much does the comparison survive scrutiny? A high score means the parallel is structurally real, not merely rhetorical.

Integrity is weighted equally with the other two on purpose. A vivid analogy that falls apart under examination is worse than no analogy, because it teaches a wrong model that feels earned. Two candidates were cut entirely for scoring 1 on integrity: "the market is rigged like a slot machine" (false — it describes market microstructure costs, not expectancy) and "index funds are the house" (incoherent — index investors have no counterparty edge).

**Tier 1** (10) — bespoke full interactive. **Tier 2** (6) — chart with a focused interaction. **Tier 3** (14) — cited card with a small static visual.

---

## Tier 1 — flagship interactives

### 1. Red or Black, 500 Times
`roulette` · Corpus A6, F2 · **Ed 5 · Vis 5 · Int 4**

Pick a stock before you know the outcome. Then watch all 500 constituents resolve at once — a field of green and red — and compare your single pick against holding the whole index.

**Works because:** a single-stock pick over one year genuinely is close to a coin flip, and most people badly overestimate their odds. The visceral moment is seeing your one green square surrounded by a field that, collectively, still went up.
**Breaks down because:** roulette pays a fixed 35:1 and the wheel's odds are exactly known. Stock outcomes are unbounded above, capped at −100% below, and the distribution is estimated rather than known. Cap-weighting means the index is not the average of those squares — it's dominated by a few large ones.

### 2. The 4% Jackpot
`slot-machine` · Corpus A1, A2, A3 · **Ed 5 · Vis 5 · Int 3**

Spin reels of real companies. Most spins are unremarkable or negative. Rarely, a genuine top-4% compounder appears — and the reveal shows its annualized return was only ~13.5%.

**Works because:** the payoff distribution really is extremely positively skewed, and most participants really do get a below-average outcome. The intuition that "a few winners carry everything" is correct.
**Breaks down because:** and this is the most important correction in the app — a slot jackpot is funded by other players' losses and is instantaneous. Altria's 265,000,000% was funded by selling products for a century, and required *holding for a century*. The reveal deliberately undercuts the slot framing: the jackpot wasn't a jackpot, it was patience.

### 3. Missing the Best Days
`best-days` · Corpus C1 · **Ed 5 · Vis 5 · Int 3**

A 30-year timeline. Remove the best days one at a time and watch the terminal value collapse. Then a toggle removes the *worst* days instead — and the result is equally dramatic in the other direction.

**Works because:** returns are concentrated in a handful of days, which is genuinely surprising and argues against reflexive trading.
**Breaks down because:** the one-sided version of this statistic is a sales pitch, not an analysis. Best and worst days cluster in the same volatile periods; an investor who avoided all the worst days would have done spectacularly. The honest lesson is about clustering and unpredictability, not about staying invested being costless. The symmetry toggle is not optional — it is the analogy.

### 4. How Many Stocks Is Enough
`diversification` · Corpus F1, F2, A2 · **Ed 5 · Vis 5 · Int 5**

Build 1, 5, 20, or 500-stock portfolios. Run thousands of bootstrap draws from real historical returns. Watch the outcome distribution narrow.

**Works because:** diversification reduces dispersion identically in both worlds, and the visual is the same shape.
**Breaks down because:** in roulette, narrowing the distribution converges you on a guaranteed loss; in equities it converges you on a positive expected return. Same operation, opposite destination. Secondary lesson, from A2: variance converges much faster than *the probability of capturing the extreme winners*, so a 30-stock portfolio can look well-diversified and still be very likely to miss every top-4% firm.

### 5. House Edge vs Expense Ratio
`house-edge` · Corpus D1, D3 · **Ed 5 · Vis 4 · Int 5**

Two compounding curves side by side: a bankroll against a chosen house edge, a portfolio against a chosen fee.

**Works because:** the arithmetic of a recurring percentage drag is identical, and a 1% annual fee over decades really does remove more wealth proportionally than one European roulette spin.
**Breaks down because:** the fee is subtracted from a positive-expectancy asset — the investor still expects to finish ahead, just less far ahead. The house edge is subtracted from a zero-sum wager, so the gambler expects to finish behind. Highest integrity score in the app: the mechanism is genuinely the same and only the sign of the base rate differs.

### 6. The Crash Simulator
`crash` · Corpus C5, C2 · **Ed 5 · Vis 5 · Int 3**

Live through 1929, 1973, 2000, 2008, 2020 in first person. Choose to hold or sell at each step, then see the recovery you did or didn't participate in.

**Works because:** it produces the emotional state that causes the actual mistake, which reading a drawdown table does not.
**Breaks down because:** the user knows they are in a simulation and knows recoveries happened. Hindsight makes holding feel obvious in a way it never was in 1932. The app states this limitation rather than letting the simulation imply that holding is always correct — 25 years to recover from 1929 is a real outcome for a real lifespan.

### 7. Time in the Market
`holding-period` · Corpus C3, C4 · **Ed 5 · Vis 4 · Int 4**

A slider from one day to twenty years showing the historical share of periods that finished positive, against the casino's mirror image: the probability of being ahead after N spins, which only falls.

**Works because:** the same theorem — the law of large numbers — drives both curves. Seeing them diverge from a shared starting point is the single clearest statement of the app's thesis.
**Breaks down because:** the casino curve is a mathematical certainty; the market curve is an empirical frequency from ~5 independent 20-year periods in one unusually successful country. All three caveats from corpus C4 (nominal only, tiny effective sample, market-level survivorship) appear inline.

### 8. Guess the Odds
`guess-odds` · All corpus sections · **Ed 5 · Vis 4 · Int 5**

Commit a probability estimate before each reveal. Calibration is scored across the session.

**Works because:** prediction before feedback is what converts a statistic into a belief update. It's also the app's retention mechanic and the natural entry point for a first-time visitor.
**Breaks down because:** it's a quiz format, not an analogy — so it makes no claim that needs defending. Its integrity score is high by default.

### 9. Coin Flip and the Ergodicity Trap
`coin-flip` · Corpus D4, D5 · **Ed 5 · Vis 4 · Int 5**

A coin that pays +50% on heads and −40% on tails: positive expected value, and yet almost every individual path trends to ruin. Add a bet-size slider to find the Kelly fraction empirically.

**Works because:** it's the deepest idea in the app and the one most people have never encountered — the average outcome across many players is not the outcome of one player over time. It simultaneously explains why gamblers go broke on positive-EV bets and why leverage destroys portfolios.
**Breaks down because:** almost nothing. The mathematics is identical in both domains. Highest integrity score of any analogy here.

### 10. Basic Strategy vs Discipline
`blackjack` · Corpus D1, E3 · **Ed 4 · Vis 4 · Int 3**

Play hands with and without basic strategy; watch expectancy move from ~−2% to ~−0.28%.

**Works because:** a simple mechanical rule, followed without improvisation, dramatically outperforms intuition — and the temptation to deviate feels the same at a table and in a portfolio.
**Breaks down because:** blackjack basic strategy is *provably* optimal against known probabilities. No investing rule has that status. Comparing "always split aces" to "always rebalance annually" flatters the investing rule with certainty it hasn't earned. Lowest integrity score in tier 1, kept because the discipline lesson is worth the caveat — stated prominently.

---

## Tier 2 — chart plus focused interaction

| # | Title | Key | Corpus | Core tension |
|---|---|---|---|---|
| 11 | The Manager Survival Curve | `spiva` | B1, B2 | Underperformance rises with horizon — but part of that is survivorship arithmetic, not pure skill failure |
| 12 | How Long Do Day Traders Last | `day-traders` | B3, B4 | Attrition curve nearly identical to problem gambling; but a *few* traders are genuinely skilled (B6) |
| 13 | Lottery Tickets Inside the Market | `max-effect` | E1 | Investors pay for lottery-shaped payoffs and get lower returns — the casino impulse, priced |
| 14 | The IPO Pop | `ipo` | E7 | Mean 19%, median 7% — skew masquerading as a typical outcome |
| 15 | The Year Feels Worse Than It Is | `intra-year` | C2 | −14.2% average intra-year drop, positive in 35 of 46 years |
| 16 | When the Index Is a Few Companies | `concentration` | A5, A6 | Owning "the market" increasingly means owning ten firms |

---

## Tier 3 — cited cards

17. **Gambler's Fallacy** (E2) — the wheel has no memory; neither does a stock price, mostly.
18. **Hot-Hand Fallacy** (E2) — held simultaneously with #17, which is the interesting part.
19. **Loss Aversion** (E4) — λ ≈ 2.25, with the range shown honestly.
20. **Overconfidence and Turnover** (B5) — 11.4% vs 17.9%.
21. **Recency Bias** — pending citation.
22. **Confirmation Bias** — pending citation.
23. **Survivorship Bias** (B2) — 64% of funds gone in 20 years; you never meet the gamblers who stopped coming.
24. **Sequence of Returns Risk** (C7) — same average, opposite outcome, once you're withdrawing.
25. **Kelly and Over-Betting** (D4) — twice Kelly returns nothing for all that risk.
26. **Volatility Drag** (D5) — +50% then −50% is −25%, not zero.
27. **Lump Sum vs DCA** (C6) — DCA is regret-minimising, not return-maximising; judge it on the right axis.
28. **0DTE Options** (E6) — where investing genuinely is gambling.
29. **Skill Needs Sample Size** (B6) — 1,500 hands in poker; years in markets.
30. **Zero-Sum vs Positive-Sum** (G1) — the thesis card, and the app's conclusion.

---

## What this set deliberately avoids

- **No claim that investing is gambling.** Analogy #30 is the conclusion the other 29 build toward.
- **No claim that investing is safe.** #6 shows a 25-year recovery; #24 shows how averages mislead retirees; #7 states its own sample-size problem.
- **No implied endorsement of any product.** #5 criticises fees without recommending a provider; #11 shows active underperformance without naming a fund.
- **No pretence that the odds are known.** Corpus G3 — the estimated nature of equity return distributions — appears in every tier-1 breakdown panel where it applies.
