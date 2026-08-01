# Research Corpus — Phase 1

Statistical comparisons between equity investing and casino gambling, with primary sources.

**Compiled:** 31 July 2026

## Rules this corpus follows

1. **No invented statistics.** Every figure traces to a named publisher with a URL and a publication date.
2. **Assumptions travel with the number.** A return figure is meaningless without knowing whether it is nominal or real, total return or price return, pre- or post-fee, pre- or post-tax.
3. **Contested figures are presented as contested.** Where the literature disputes a number (Morningstar's investor return gap is the live example), the app shows the dispute rather than picking the more dramatic side.
4. **Verification status is tracked per entry.** `PRIMARY` = confirmed against the source document. `SECONDARY` = figure consistent across independent summaries, primary document identified but not yet machine-readable. `TO VERIFY` = must be confirmed before shipping.
5. **Untraceable figures get cut, not softened.** There is no "studies suggest" tier.

A note on why rule 2 matters here specifically: the single most quoted statistic in this space — "the market returns about 10% a year" — is nominal, pre-tax, pre-fee, total-return, and survivorship-adjusted at the index level. Every one of those qualifiers moves the number. An app that teaches probability intuition cannot be sloppy about the inputs.

---

## A. Concentration and skew

The strongest material in the corpus. This is where the casino analogy is most visually compelling and most intellectually dangerous, because the *shape* of the distribution really is lottery-like while the *mechanism* is the opposite.

### A1 — Most individual stocks lose money over their lifetime
**Statistic:** Of 29,078 US common stocks in CRSP from December 1925 to December 2023, **51.6% had negative cumulative lifetime returns**.
**Source:** Bessembinder, H. (2024). *Which U.S. Stocks Generated the Highest Long-Term Returns?* SSRN 4897069. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4897069
**Assumptions:** Cumulative buy-and-hold return over each stock's entire listed life; nominal; includes dividends; delisted stocks included.
**Status:** SECONDARY

### A2 — 4% of firms produced all net wealth creation
**Statistic:** The best-performing **4%** of listed US firms account for the entire net dollar wealth creation of the US stock market since 1926. The remaining 96% collectively matched one-month Treasury bills.
**Source:** Bessembinder, H. (2018). *Do Stocks Outperform Treasury Bills?* Journal of Financial Economics 129(3), 440–457. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2900447
**Assumptions:** Measured in lifetime dollar wealth creation, not returns. 4% of firms ≈ 1,100 companies. Wealth creation is dollar-weighted, so large firms dominate by construction.
**Status:** SECONDARY

### A3 — The extreme tail, and why it isn't a jackpot
**Statistic:** 17 stocks exceeded 5,000,000% cumulative return. Altria is highest at ~265,000,000% (~$2.65m per dollar invested). **Their annualized compound returns averaged only 13.47%.**
**Source:** Bessembinder (2024), as A1.
**Why this one matters:** This is the corpus's best single counter to the slot-machine framing. The top performers were not explosive — they were *ordinary compounders left alone for decades*. 13.47% annualized is a good return, not a miracle; the 265,000,000% is what 13.47% does over ~100 years. There is no casino mechanism that converts patience into payout.
**Status:** SECONDARY

### A4 — Catastrophic losses in individual stocks
**Statistic:** ~**40%** of Russell 3000 stocks since 1980 suffered a "catastrophic loss" — a decline of 70%+ from peak with no meaningful recovery (eventual loss from peak of 60%+). About **two-thirds underperformed** the index. The **median stock underperformed the Russell 3000 by −54%** over its lifetime.
**Source:** Cembalest, M., J.P. Morgan. *The Agony and the Ecstasy Part IV: an update on catastrophic stock declines*, 3 October 2024. https://www.jpmorgan.com/content/dam/jpmorgan/documents/wealth-management/the-agony-and-the-ecstasy-2024.pdf
**Assumptions:** Russell 3000 constituents from 1980. Sector concentration: technology, biotech, metals & mining had materially higher catastrophic-loss rates.
**Status:** SECONDARY — primary PDF located and stable; figures agree across independent summaries. Extract text to confirm exact definitions before shipping.

### A5 — Index concentration
**Statistic:** The 10 largest S&P 500 companies reached **~40% of index weight** by mid-2025, the highest since the mid-1960s.
**Source:** S&P Dow Jones Indices, Indexology Blog, *Addressing Concentration with the S&P 500 3% Capped Index*, 1 October 2025. https://www.indexologyblog.com/2025/10/01/addressing-concentration-with-the-sp-500-3-capped-index/
**Status:** SECONDARY

### A6 — Breadth: how many constituents beat the index
**Statistic:** **44%** of S&P 500 members beat the index in H1 2025, versus **28%** in 2024 and **26%** in 2023.
**Source:** S&P Dow Jones Indices, *In the Shadows of Giants*. https://www.spglobal.com/spdji/en/research/article/in-the-shadows-of-giants/
**Assumptions:** Constituent total returns vs index total return over the stated period. Sensitive to the measurement window.
**Note:** The app's flagship roulette interactive is built on this. The commonly repeated "about half of stocks fall in an up year" is directionally right but the actual figure moves a lot year to year — the interactive must use the real per-year number, not a round approximation.
**Status:** SECONDARY

---

## B. Active management, skill, and the cost of trying

### B1 — SPIVA: active underperformance by horizon
**Statistic (as of 31 Dec 2024):** US large-cap funds underperforming the S&P 500 — **65.24%** (1yr), **84.96%** (3yr), **76.26%** (5yr), **84.34%** (10yr), **89.50%** (15yr).
**Statistic (Year-End 2025):** **79%** of active large-cap funds underperformed in 2025 — the 4th-worst year in the scorecard's 25-year history. Roughly **92%** of domestic funds underperformed over 20 years.
**Source:** S&P Dow Jones Indices, *SPIVA U.S. Scorecard*. https://www.spglobal.com/spdji/en/documents/spiva/spiva-us-year-end-2025.pdf
**Assumptions:** Net of fees. Uses the CRSP Survivor-Bias-Free database, so dead funds are included — this is why SPIVA numbers are worse than industry-reported ones.
**Status:** PRIMARY for the YE-2024 series; TO VERIFY the YE-2025 figures against the PDF.

### B2 — Fund survivorship
**Statistic:** Over the 20 years ending December 2024, nearly **64% of domestic stock funds were merged or liquidated**.
**Source:** SPIVA / CRSP Survivor-Bias-Free US Mutual Fund Database.
**Why it matters:** This is survivorship bias with a number attached. Any performance table drawn from *surviving* funds silently deletes the majority of the original field, and deletes it non-randomly — the failures go first. The casino parallel is exact and worth making: you never meet the gamblers who stopped coming.
**Status:** SECONDARY

### B3 — Day traders (Taiwan)
**Statistic:** **Fewer than 1%** of day traders were predictably profitable net of fees, 1992–2006. Survival: **44%** at one year, **24%** at two, **15%** at three.
**Source:** Barber, B., Lee, Y-T., Liu, Y-J. & Odean, T., *Do Individual Day Traders Make Money? Evidence from Taiwan*. https://faculty.haas.berkeley.edu/odean/papers/Day%20Traders/Day%20Trade%20040330.pdf
**Assumptions:** Complete Taiwan Stock Exchange records. "Predictably profitable" = positive abnormal returns persisting out of sample.
**Status:** SECONDARY

### B4 — Day traders (Brazil)
**Statistic:** Of ~1,600 individuals who day-traded index futures beyond 300 sessions, **97% lost money**; only **1.1%** earned more than the Brazilian minimum wage.
**Source:** Chague, F., De-Losso, R. & Giovannetti, B. (2020). *Day Trading for a Living?*
**Status:** SECONDARY

### B5 — Turnover and overconfidence
**Statistic:** Of 66,465 households at a discount broker, 1991–1996: the most active traders earned **11.4%/yr** against a **17.9%** market return. The average household earned **16.4%** while turning over **75%** of its portfolio annually.
**Source:** Barber, B. & Odean, T. (2000). *Trading Is Hazardous to Your Wealth*, Journal of Finance 55(2). https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/individual_investor_performance_final.pdf
**Status:** SECONDARY

### B6 — Poker: skill emerges, but only with sample size
**Statistic:** Players identified as highly skilled *before* the 2010 World Series of Poker achieved an average ROI of **+30%** versus **−15%** for all others. Simulation work indicates skill dominates chance at roughly **1,500+ hands**.
**Source:** Levitt, S. & Miles, T. (2014). *The Role of Skill Versus Luck in Poker*, Journal of Sports Economics 15(1), 31–44. NBER w17023. https://www.nber.org/papers/w17023
**Why it matters:** This is the corpus's cleanest statement of the signal-to-noise problem. Skill is real and measurable — and still invisible below a threshold sample size. The same logic explains why three good years tells you almost nothing about a fund manager.
**Status:** SECONDARY

---

## C. Time, timing, and drawdowns

### C1 — Missing the best days
**Statistic:** For the S&P 500 from 1 July 1995 to 30 June 2025, missing the **30 best days** cut returns from **8.4%/yr to 2.1%/yr** — below the 2.5% average inflation rate over the same period. Missing the 10 best days roughly halved the return. **76%** of the best days occurred during a bear market or in the first two months of a bull market.
**Source:** Hartford Funds, *Timing the Market Is Impossible*. https://www.hartfordfunds.com/practice-management/client-conversations/managing-volatility/timing-the-market-is-impossible.html
**Assumptions:** Price/total return basis and dividend treatment must be confirmed. **Important honesty caveat:** the symmetrical "missing the worst days" calculation is equally dramatic in the opposite direction, and the best and worst days cluster together. The app must present both sides — the honest lesson is that volatility clusters, not that staying invested is free money.
**Status:** SECONDARY, with the symmetry caveat mandatory.

### C2 — Intra-year drawdowns vs calendar returns
**Statistic:** Average intra-year drawdown of **14.2%**, yet annual returns were positive in **35 of 46 years**.
**Source:** J.P. Morgan Asset Management, *Guide to the Markets*. https://am.jpmorgan.com/us/en/asset-management/adv/insights/market-insights/guide-to-the-markets/
**Status:** SECONDARY

### C3 — Frequency of positive calendar years
**Statistic:** The S&P 500 produced positive returns in **71 of 97 years** (~73%) from 1928 to 2024. Worst year 1931 at −43.84%; best year 1954 at +52.56%. Returned +20% or more in 36 years.
**Source:** NYU Stern, Damodaran historical returns dataset. https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html
**Assumptions:** Nominal, total return including dividends, pre-tax, pre-fee.
**Status:** SECONDARY — recompute directly from the dataset, which the app bundles anyway.

### C4 — Holding period and probability of gain
**Statistic:** No rolling 20-year window in the S&P 500's history has produced a negative nominal total return.
**Status:** **TO VERIFY — compute directly from the bundled Damodaran series.**
**Mandatory caveats:** (a) nominal, not real — inflation-adjusted 20-year windows *have* been negative; (b) this is a single country's history with roughly five independent 20-year periods, which is a very small sample to make a probability claim from; (c) survivorship at the *market* level — the US is the winner among 20th-century equity markets, and several national markets went to zero. This entry is the one most likely to be misused, so the app states all three caveats inline rather than in a footnote.

### C5 — Bear market depth and recovery
**Statistic:** 1929–32: −82%, ~25 years to recover. 1973–74: −51.9%, ~8 years. 2000–02: −49%, ~6.9 years. 2007–09: −48%, ~5.5 years. 2020: −34% in 32 days, recovered within months.
**Source:** To be sourced to a single consistent primary series (Morningstar's 150-year crash analysis and Invesco's bear market taxonomy are candidates). Recovery definitions vary by whether dividends and inflation are included — **the app must use one definition and state it.**
**Status:** TO VERIFY

### C6 — Lump sum vs dollar-cost averaging
**Statistic:** Lump-sum investing beat DCA in ~**68%** of rolling 12-month periods, 1976–2022, by ~**2.3%** on average.
**Source:** Vanguard. https://investor.vanguard.com/investor-resources-education/online-trading/dollar-cost-averaging-vs-lump-sum
**Assumptions:** US, UK, Australia; 60/40 portfolios; rolling 12-month windows.
**Nuance the app keeps:** DCA is not a return-maximising strategy and was never claimed to be — it is a regret-minimising one. Judging it on mean return alone is the wrong test.
**Status:** SECONDARY

### C7 — Sequence of returns risk
**Statistic:** Fidelity's illustration: two retirees, each starting with $1m, withdrawing $50k/yr, both averaging **6.8%** over 30 years. The one who suffers early losses is depleted by year 27; the one with early gains ends above **$3m**.
**Source:** Fidelity. **Status:** TO VERIFY — locate the primary Fidelity publication and its exact assumptions.
**Why it matters:** Same average return, opposite outcome. This is the clearest demonstration in the corpus that *order matters once you are withdrawing* — and it is the point at which the "just hold for the long run" advice stops applying cleanly.

---

## D. Expectancy: house edge vs fees

### D1 — Casino house edges
**Statistic:** American roulette **5.26%** · European roulette **2.70%** · blackjack, liberal Vegas rules with basic strategy **0.28%** · craps pass/come **1.41%** · craps free odds **0.00%** · baccarat banker **1.06%** · baccarat player **1.24%** · baccarat tie **14.36%** · slots **2–15%** · keno **25–29%** · big six wheel **11.11–24.07%**.
Standard deviation per unit bet: American roulette 0.99, blackjack 1.15, baccarat 0.93–2.64, keno 1.30–46.04.
**Source:** Wizard of Odds, house edge tables. https://wizardofodds.com/gambling/house-edge/
**Status:** PRIMARY — verified by direct fetch.

### D2 — State lotteries are far worse than casinos
**Statistic:** State lotteries return roughly **50–60%** of ticket revenue as prizes — an effective house edge of ~40–50%. Casino slots typically return 85–98%.
**Source:** Matheson, V. & Grote, K., *In Search of a Fair Bet in the Lottery*. https://web.williams.edu/Economics/wp/mathesonlottery.pdf
**Why it's in the corpus:** It calibrates the reader. Before comparing investing to gambling, it's worth knowing that "gambling" spans a 40-percentage-point range of expectancy, and the most heavily state-promoted form is the worst one.
**Status:** SECONDARY

### D3 — Investment fees compound like a house edge
**Statistic:** $100,000 growing at 4% annually over 20 years: **~$179,000** at a 1.00% annual fee versus **~$208,000** at 0.25%. A 0.75 percentage point difference costs ~$29,000.
**Source:** SEC Office of Investor Education, *How Fees and Expenses Affect Your Investment Portfolio*. https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf
**The analogy, stated carefully:** A 1% annual fee levied for 20 years removes a larger share of wealth than a single spin of European roulette (2.70%) removes from a single bet. That comparison is arithmetically fair and worth making. But it is *not* the same thing, and the app says so directly: the fee is a deduction from a positive-expectancy asset, so the investor still expects to finish ahead; the house edge is a deduction from a zero-sum wager, so the gambler expects to finish behind. Same mechanism, opposite destination. **This distinction is the thesis of the whole application.**
**Status:** PRIMARY

### D4 — Kelly criterion and the cost of over-betting
**Statistic:** Kelly fraction f* = (bp − q)/b maximises the *geometric* growth rate. Betting **twice Kelly** drives excess growth over the risk-free rate to **zero**; beyond that, expected growth turns negative. Half-Kelly retains ~**75%** of the growth rate at substantially lower variance.
**Source:** Kelly, J.L. (1956), Bell System Technical Journal; Thorp, E., *The Kelly Criterion in Blackjack, Sports Betting and the Stock Market*.
**Why it matters:** The bridge concept of the entire app. An expected-value maximiser bets everything on any positive-EV proposition and goes broke with probability approaching 1. A geometric-growth maximiser sizes positions. This is *identical* mathematics for a card counter and a portfolio manager, and it is the one place where the analogy holds essentially without leakage.
**Status:** SECONDARY

### D5 — Volatility drag
**Statistic:** Geometric return ≈ arithmetic return − σ²/2. A portfolio alternating +50% and −50% has an arithmetic mean of 0% and a geometric mean of −13.4% per period.
**Source:** Standard result; to be cited to a textbook treatment rather than a blog.
**Status:** TO VERIFY — needs a proper citation. The arithmetic is trivially checkable and the app derives it live in the interactive.

---

## E. Behaviour and lottery preference

### E1 — Lottery-like stocks underperform
**Statistic:** Stocks in the highest decile of maximum daily return over the prior month underperform the lowest decile by **more than 1% per month**, robust to controls for size, book-to-market, momentum, short-term reversal, liquidity and skewness.
**Source:** Bali, T., Cakici, N. & Whitelaw, R. (2011). *Maxing Out: Stocks as Lotteries and the Cross-Section of Expected Returns*, Journal of Financial Economics 99(2), 427–446. https://pages.stern.nyu.edu/~rwhitela/papers/max%20jfe11.pdf
**Why it matters:** Direct evidence that investors *pay* for lottery-like payoff shapes in stocks, and are compensated with lower returns for it. The gambling impulse shows up inside the market and is priced.
**Status:** SECONDARY

### E2 — Gambler's fallacy and hot-hand fallacy, simultaneously
**Statistic:** Roulette players in a Reno casino displayed the gambler's fallacy about *wheel outcomes* (betting against recent numbers) and the hot-hand fallacy about *themselves* (betting more after wins) at the same time.
**Source:** Croson, R. & Sundali, J. (2005). *The Gambler's Fallacy and the Hot Hand: Empirical Data from Casinos*, Journal of Risk and Uncertainty 30(3), 195–209. https://link.springer.com/article/10.1007/s11166-005-1153-2
**Assumptions:** 18 hours of casino security video, single roulette table, Reno, July 1998, three six-hour blocks over three days. Small sample; effects were statistically significant but modest.
**Why it's the best behavioural entry:** The two beliefs are logically contradictory — the wheel is due to change, but I am not — and people hold both at once. The investing parallel is holding "reversion to the mean" and "this manager is hot" simultaneously.
**Status:** SECONDARY

### E3 — Disposition effect
**Statistic:** Investors were **1.5 to 2 times more likely** to sell winners than losers, controlling for taxes and rebalancing. Subsequent performance did not justify the behaviour.
**Source:** Odean, T. (1998). *Are Investors Reluctant to Realize Their Losses?* Journal of Finance 53, 1775–1798. https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf
**Casino parallel:** Colouring up small wins while letting losses ride in hope of getting even.
**Status:** SECONDARY

### E4 — Loss aversion
**Statistic:** Median loss aversion coefficient λ ≈ **2.25** — losses are felt roughly 2.25× as intensely as equivalent gains. Experimental estimates cluster between **1.5 and 2.5**.
**Source:** Tversky, A. & Kahneman, D. (1991/1992), cumulative prospect theory.
**Honesty note:** λ = 2.25 is a *median from specific experiments*, not a universal constant, and the literature contains meaningful heterogeneity. The app presents the range, not the single number.
**Status:** SECONDARY

### E5 — The investor return gap (CONTESTED)
**Statistic:** Morningstar finds the average dollar in US funds earned ~**1.2%/yr less** than the funds themselves over ten years, ~15% of total gains.
**Source:** Morningstar, *Mind the Gap 2025*. https://www.morningstar.com/business/insights/research/mind-the-gap
**Counter-source:** Fulkerson, J., Jordan, B., Riley, T. & Yan, Q. *Bad Timing Does Not Cost Investors 15% of Their Funds' Returns*. SSRN 4904652. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4904652
**How the app handles it:** Both sides shown together, with the methodological disagreement explained. This entry exists partly to model intellectual honesty — a popular, useful-sounding statistic that is genuinely disputed is more educational when the dispute is visible.
**Status:** CONTESTED — ships only with the rebuttal attached.

### E6 — Retail options traders
**Statistic:** Retail options traders lost on average at every horizon studied. Aggregate ≈ **−$5.03m per day**, roughly **$2.1bn** total, November 2019 – June 2021. More than **75%** of retail S&P 500 option trades are 0DTE.
**Source:** Beckmeyer, H., Branger, N. & Gayda, L. *Retail Traders Love 0DTE Options... But Should They?* SSRN 4404704. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704
**Status:** SECONDARY

### E7 — IPOs
**Statistic:** Mean first-day return ~**19%** but **median only ~7%** (1980–2025). Ritter (1991): three-year buy-and-hold of **34.5%** for IPOs versus **61.9%** for matched control firms.
**Source:** Ritter, J., IPO data, University of Florida. https://site.warrington.ufl.edu/ritter/files/IPOs-long-run-returns-on-IPOs.pdf
**Why the mean/median gap is the lesson:** The average is inflated by a handful of enormous first-day pops. The typical IPO does far less than the headline. This is the same skew story as A2, at a scale readers can feel.
**Status:** SECONDARY

---

## F. Diversification

### F1 — How many stocks
**Statistic:** Evans & Archer (1968) concluded 8–10 stocks sufficed. Statman (1987) concluded **at least 30–40**. Campbell, Lettau, Malkiel & Xu (2001) showed idiosyncratic volatility *rose* over time, so the required number has increased.
**Sources:** Evans & Archer (1968), Journal of Finance; Statman (1987), JFQA; Campbell et al. (2001), Journal of Finance.
**The subtlety the app teaches:** These studies measure diversification as *variance reduction*, which converges quickly. But given A1–A4, variance is the wrong target — what matters is the probability of missing the few extreme winners, and that converges far more slowly. A 30-stock portfolio can be well-diversified by the 1987 definition and still very likely to miss every one of the top-4% firms.
**Status:** SECONDARY

### F2 — Diversification in a casino
**Fact, not statistic:** Splitting a bet across 20 roulette numbers reduces variance and leaves expected value unchanged at −5.26%. Splitting capital across 20 stocks reduces variance and leaves expected value positive.
**Why this is the corpus's cleanest single contrast:** Diversification does the *same thing to risk* in both settings and *completely different things to expectancy*. It is the argument for indexing and, simultaneously, the argument that no amount of bet-splitting can rescue a negative-expectancy game.
**Status:** Derived from D1; no external citation needed beyond the house-edge table.

---

## G. Where the analogy breaks down — the structural arguments

These are not statistics but the load-bearing conceptual content. The app must make these explicitly, because everything above superficially supports "investing is gambling."

1. **Zero-sum versus positive-sum.** Casino winnings come from other players and are reduced by the house edge. Equity returns come from earnings produced by businesses. The aggregate outcome of everyone playing roulette is negative by construction; the aggregate outcome of everyone owning the market has been positive because the underlying assets produce goods and services.
2. **Ownership versus wager.** A roulette chip is a claim on nothing after the wheel stops. A share is a durable legal claim on assets and future cash flows that persists regardless of price.
3. **Fixed versus estimated odds.** Roulette's probabilities are known exactly, forever. Equity return distributions are *estimated from a short, non-stationary, single-country history*. This cuts against investing as much as for it — and the app must not pretend the odds are known.
4. **Time works in opposite directions.** More spins moves a gambler toward certain loss. More time in a positive-expectancy asset moves an investor toward the expected return. The law of large numbers is the same theorem serving opposite masters.
5. **Bounded versus unbounded payoff.** A roulette payout is capped at 35:1. A share's upside is unbounded (A3), while the downside is capped at −100%. Positive skew is structural, not incidental.
6. **Where the analogy genuinely holds:** position sizing (D4), the effect of costs (D3), sample size required to detect skill (B6), variance reduction from diversification (F2), and every behavioural bias in section E. These are real, and the app does not soften them.
7. **Where investing genuinely *is* gambling:** concentrated single-stock speculation, 0DTE options (E6), leveraged short-horizon trading (B3, B4). The app is explicit that some activities conducted inside a brokerage account are, structurally, negative-expectancy wagers after costs. Calling them "investing" because of where they happen is the actual error.

---

## Roadmap for corpus expansion

Target 60–80 entries. Still to add at the same standard: recency bias, confirmation bias in investor forums, home-country bias, the equity risk premium puzzle, dispersion vs manager skill, leveraged ETF decay, momentum/reversal as pattern-seeking, base-rate neglect in forecasts, and international market histories (Dimson, Marsh & Staunton) as the corrective to C4's US-only survivorship.
