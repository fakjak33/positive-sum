import type { Citation } from "./types";

/**
 * The citation database.
 *
 * Every statistic rendered anywhere in the app resolves to an entry here.
 * `CitationId` is derived from these keys, so referencing a source that does
 * not exist is a compile error rather than a broken footnote.
 *
 * Sourcing rules (docs/01-research-corpus.md):
 *   - Cite the publisher, never the blog that summarised the publisher.
 *   - Assumptions travel with the number. A return figure without
 *     nominal/real, total/price, pre/post-fee is not a finished citation.
 *   - `status: "to-verify"` figures may not headline a page.
 *   - Disputed findings carry `contested` and render with the rebuttal.
 */
export const CITATIONS = {
  // ---------------------------------------------------------------
  // Concentration and skew
  // ---------------------------------------------------------------
  "bessembinder-2024": {
    id: "bessembinder-2024",
    title: "Which U.S. Stocks Generated the Highest Long-Term Returns?",
    authors: ["Hendrik Bessembinder"],
    publisher: "Arizona State University / SSRN",
    publicationDate: "2024-07",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4897069",
    statistic:
      "51.6% of 29,078 US common stocks had negative cumulative lifetime returns; 17 stocks exceeded 5,000,000% cumulative return, led by Altria at roughly 265,000,000%; the top performers compounded at an average of just 13.47% a year.",
    samplePeriod: "December 1925 – December 2023, CRSP universe",
    assumptions: [
      "Cumulative buy-and-hold return across each stock's entire listed life",
      "Nominal, includes dividends",
      "Delisted companies included, so this is not survivorship-biased",
    ],
    status: "secondary",
  },

  "bessembinder-2018": {
    id: "bessembinder-2018",
    title: "Do Stocks Outperform Treasury Bills?",
    authors: ["Hendrik Bessembinder"],
    publisher: "Journal of Financial Economics 129(3), 440–457",
    publicationDate: "2018-09",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2900447",
    statistic:
      "The best-performing 4% of listed US firms account for the entire net dollar wealth creation of the US stock market since 1926; the other 96% collectively matched one-month Treasury bills.",
    samplePeriod: "1926 – 2016, CRSP universe",
    assumptions: [
      "Measured in lifetime dollar wealth creation, not in returns",
      "4% of firms is roughly 1,100 companies",
      "Dollar-weighted, so larger firms dominate the measure by construction",
    ],
    status: "secondary",
  },

  "jpm-agony-ecstasy": {
    id: "jpm-agony-ecstasy",
    title:
      "The Agony and the Ecstasy Part IV: an update on catastrophic stock declines",
    authors: ["Michael Cembalest"],
    publisher: "J.P. Morgan",
    publicationDate: "2024-10-03",
    url: "https://www.jpmorgan.com/content/dam/jpmorgan/documents/wealth-management/the-agony-and-the-ecstasy-2024.pdf",
    statistic:
      "Around 40% of Russell 3000 stocks since 1980 suffered a catastrophic loss; roughly two-thirds underperformed the index; the median stock underperformed the Russell 3000 by about 54% over its lifetime.",
    samplePeriod: "Russell 3000 constituents, 1980 onwards",
    assumptions: [
      "'Catastrophic loss' means a 70%+ decline from peak with no meaningful recovery",
      "Technology, biotech and metals & mining show materially higher rates",
    ],
    status: "secondary",
  },

  "spdji-shadows-of-giants": {
    id: "spdji-shadows-of-giants",
    title: "In the Shadows of Giants",
    publisher: "S&P Dow Jones Indices",
    publicationDate: "2025",
    url: "https://www.spglobal.com/spdji/en/research/article/in-the-shadows-of-giants/",
    statistic:
      "44% of S&P 500 members beat the index in H1 2025, against 28% in 2024 and 26% in 2023.",
    samplePeriod: "S&P 500 constituents, 2023 – H1 2025",
    assumptions: [
      "Constituent total returns compared against index total return",
      "Highly sensitive to the measurement window — the figure moves a lot year to year",
    ],
    status: "secondary",
  },

  "spdji-concentration": {
    id: "spdji-concentration",
    title: "Addressing Concentration with the S&P 500 3% Capped Index",
    publisher: "S&P Dow Jones Indices (Indexology)",
    publicationDate: "2025-10-01",
    url: "https://www.indexologyblog.com/2025/10/01/addressing-concentration-with-the-sp-500-3-capped-index/",
    statistic:
      "The 10 largest S&P 500 companies reached roughly 40% of index weight by mid-2025, the highest concentration since the mid-1960s.",
    samplePeriod: "S&P 500, through mid-2025",
    status: "secondary",
  },

  // ---------------------------------------------------------------
  // Active management, skill, survivorship
  // ---------------------------------------------------------------
  "spiva-us": {
    id: "spiva-us",
    title: "SPIVA U.S. Scorecard",
    publisher: "S&P Dow Jones Indices",
    publicationDate: "2025-12",
    url: "https://www.spglobal.com/spdji/en/documents/spiva/spiva-us-year-end-2025.pdf",
    statistic:
      "US large-cap funds underperforming the S&P 500: 65.24% over 1 year, 84.96% over 3, 76.26% over 5, 84.34% over 10 and 89.50% over 15 years (as of 31 December 2024). In 2025, 79% underperformed — the fourth-worst year in the scorecard's 25-year history.",
    samplePeriod: "Rolling horizons to 31 December 2024 and calendar 2025",
    assumptions: [
      "Net of fees",
      "Uses the CRSP Survivor-Bias-Free database, so liquidated and merged funds are included — this is why SPIVA figures look worse than industry-reported ones",
    ],
    status: "primary",
  },

  "spiva-survivorship": {
    id: "spiva-survivorship",
    title: "SPIVA U.S. Scorecard — fund survivorship",
    publisher: "S&P Dow Jones Indices",
    publicationDate: "2025-12",
    url: "https://www.spglobal.com/spdji/en/documents/spiva/spiva-us-year-end-2025.pdf",
    statistic:
      "Over the 20 years ending December 2024, close to 64% of domestic stock funds were merged or liquidated.",
    samplePeriod: "20 years to December 2024",
    assumptions: [
      "Counts funds that disappeared, which most performance tables silently exclude",
    ],
    status: "secondary",
  },

  "barber-odean-taiwan": {
    id: "barber-odean-taiwan",
    title: "Do Individual Day Traders Make Money? Evidence from Taiwan",
    authors: [
      "Brad M. Barber",
      "Yi-Tsung Lee",
      "Yu-Jane Liu",
      "Terrance Odean",
    ],
    publisher: "University of California, Berkeley / UC Davis",
    publicationDate: "2004",
    url: "https://faculty.haas.berkeley.edu/odean/papers/Day%20Traders/Day%20Trade%20040330.pdf",
    statistic:
      "Fewer than 1% of day traders were predictably profitable net of fees. Survival rates were 44% at one year, 24% at two years and 15% at three.",
    samplePeriod: "Taiwan Stock Exchange, 1992 – 2006",
    assumptions: [
      "Complete exchange records, not a self-selected sample",
      "'Predictably profitable' means positive abnormal returns that persisted out of sample",
    ],
    status: "secondary",
  },

  "chague-brazil": {
    id: "chague-brazil",
    title: "Day Trading for a Living?",
    authors: [
      "Fernando Chague",
      "Rodrigo De-Losso",
      "Bruno Giovannetti",
    ],
    publisher: "University of São Paulo / SSRN",
    publicationDate: "2020",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3423101",
    statistic:
      "Of roughly 1,600 individuals who day-traded index futures for more than 300 sessions, 97% lost money and only 1.1% earned more than the Brazilian minimum wage.",
    samplePeriod: "Brazilian index futures, 2013 – 2015 cohort",
    status: "secondary",
  },

  "barber-odean-2000": {
    id: "barber-odean-2000",
    title:
      "Trading Is Hazardous to Your Wealth: The Common Stock Investment Performance of Individual Investors",
    authors: ["Brad M. Barber", "Terrance Odean"],
    publisher: "The Journal of Finance 55(2)",
    publicationDate: "2000-04",
    url: "https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/individual_investor_performance_final.pdf",
    statistic:
      "The most active traders earned 11.4% a year while the market returned 17.9%. The average household earned 16.4% and turned over 75% of its portfolio annually.",
    samplePeriod: "66,465 households at a US discount broker, 1991 – 1996",
    assumptions: ["Gross returns adjusted for trading costs"],
    status: "secondary",
  },

  "levitt-miles-poker": {
    id: "levitt-miles-poker",
    title: "The Role of Skill Versus Luck in Poker: Evidence from the World Series of Poker",
    authors: ["Steven D. Levitt", "Thomas J. Miles"],
    publisher: "Journal of Sports Economics 15(1), 31–44 / NBER w17023",
    publicationDate: "2014-02",
    url: "https://www.nber.org/papers/w17023",
    statistic:
      "Players identified as highly skilled before the 2010 World Series of Poker returned an average of +30% on investment against −15% for everyone else. Simulation work suggests skill dominates chance from roughly 1,500 hands onward.",
    samplePeriod: "2010 World Series of Poker",
    assumptions: [
      "Skill was assigned in advance, not fitted after the fact — that is what makes the result meaningful",
    ],
    status: "secondary",
  },

  // ---------------------------------------------------------------
  // Time, timing, drawdowns
  // ---------------------------------------------------------------
  "hartford-best-days": {
    id: "hartford-best-days",
    title: "Timing the Market Is Impossible",
    publisher: "Hartford Funds",
    publicationDate: "2025",
    url: "https://www.hartfordfunds.com/practice-management/client-conversations/managing-volatility/timing-the-market-is-impossible.html",
    statistic:
      "Missing the 30 best days cut the annualised return from 8.4% to 2.1% — below the 2.5% average inflation rate over the period. 76% of the best days occurred during a bear market or in the first two months of a bull market.",
    samplePeriod: "S&P 500, 1 July 1995 – 30 June 2025",
    assumptions: [
      "The mirror calculation is equally dramatic: avoiding the worst days would have produced spectacular returns",
      "Best and worst days cluster in the same volatile stretches — the honest lesson is about clustering, not about staying invested being costless",
    ],
    status: "secondary",
  },

  "jpm-guide-intra-year": {
    id: "jpm-guide-intra-year",
    title: "Guide to the Markets — annual returns and intra-year declines",
    publisher: "J.P. Morgan Asset Management",
    publicationDate: "2025",
    url: "https://am.jpmorgan.com/us/en/asset-management/adv/insights/market-insights/guide-to-the-markets/",
    statistic:
      "The S&P 500 has fallen an average of 14.2% at some point within each calendar year, yet finished positive in 35 of 46 years.",
    samplePeriod: "S&P 500, 1980 onwards",
    assumptions: ["Price returns for the intra-year drawdown measure"],
    status: "secondary",
  },

  "damodaran-returns": {
    id: "damodaran-returns",
    title:
      "Annual Returns on Stock, T.Bonds and T.Bills: 1928 – Current",
    authors: ["Aswath Damodaran"],
    publisher: "NYU Stern School of Business",
    publicationDate: "2025-01",
    url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
    statistic:
      "The S&P 500 produced positive total returns in 71 of the 97 years from 1928 to 2024 — roughly 73%. The worst year was 1931 at −43.84%; the best was 1954 at +52.56%.",
    samplePeriod: "1928 – 2024",
    assumptions: [
      "Nominal, not inflation-adjusted",
      "Total return including dividends",
      "Pre-tax and pre-fee",
    ],
    status: "secondary",
  },

  "vanguard-dca": {
    id: "vanguard-dca",
    title: "Dollar-cost averaging vs. lump-sum investing",
    publisher: "The Vanguard Group",
    publicationDate: "2023",
    url: "https://investor.vanguard.com/investor-resources-education/online-trading/dollar-cost-averaging-vs-lump-sum",
    statistic:
      "Investing a lump sum beat dollar-cost averaging in about 68% of rolling 12-month periods, by roughly 2.3% on average.",
    samplePeriod: "US, UK and Australian markets, 1976 – 2022",
    assumptions: [
      "60/40 portfolios, rolling 12-month windows",
      "Dollar-cost averaging is a regret-minimising strategy, not a return-maximising one — mean return is the wrong axis to judge it on",
    ],
    status: "secondary",
  },

  // ---------------------------------------------------------------
  // Expectancy: house edge and fees
  // ---------------------------------------------------------------
  "wizard-house-edge": {
    id: "wizard-house-edge",
    title: "House Edge of Casino Games Compared",
    publisher: "Wizard of Odds",
    publicationDate: "2025",
    url: "https://wizardofodds.com/gambling/house-edge/",
    statistic:
      "American roulette 5.26%, European roulette 2.70%, blackjack with basic strategy 0.28% under liberal Vegas rules, craps pass line 1.41%, craps free odds 0.00%, baccarat banker 1.06%, baccarat tie 14.36%, slots 2–15%, keno 25–29%.",
    assumptions: [
      "House edge is expected loss as a share of the initial wager",
      "Blackjack figures assume perfect basic strategy and specific table rules; typical play is materially worse",
    ],
    status: "primary",
  },

  "matheson-lottery": {
    id: "matheson-lottery",
    title: "In Search of a Fair Bet in the Lottery",
    authors: ["Victor A. Matheson", "Kent Grote"],
    publisher: "College of the Holy Cross",
    publicationDate: "2004",
    url: "https://web.williams.edu/Economics/wp/mathesonlottery.pdf",
    statistic:
      "State lotteries typically return only 50–60% of ticket revenue as prizes, an effective house edge of 40–50% — far worse than any casino game.",
    assumptions: [
      "Prize payout as a share of ticket revenue",
      "Jackpot expected value calculations ignore tax and the effect of split jackpots",
    ],
    status: "secondary",
  },

  "sec-fees": {
    id: "sec-fees",
    title:
      "How Fees and Expenses Affect Your Investment Portfolio — Investor Bulletin",
    publisher: "U.S. Securities and Exchange Commission",
    publicationDate: "2014",
    url: "https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf",
    statistic:
      "A $100,000 portfolio growing at 4% a year for 20 years is worth about $179,000 after a 1.00% annual fee, against about $208,000 after a 0.25% fee — a difference of roughly $29,000.",
    assumptions: [
      "4% annual growth before fees, no additional contributions",
      "Illustrative arithmetic, not a forecast",
    ],
    status: "primary",
  },

  "kelly-1956": {
    id: "kelly-1956",
    title: "A New Interpretation of Information Rate",
    authors: ["J. L. Kelly Jr."],
    publisher: "Bell System Technical Journal 35(4)",
    publicationDate: "1956-07",
    url: "https://ieeexplore.ieee.org/document/6771227",
    statistic:
      "The Kelly fraction f* = (bp − q) / b maximises the long-run geometric growth rate of a bankroll. Betting around twice Kelly gives back essentially all of the growth advantage, and beyond that expected growth turns clearly negative.",
    assumptions: [
      "Assumes known probabilities and repeated independent bets — in markets both assumptions are approximations, which is the usual argument for fractional Kelly",
      "The clean 'twice Kelly earns exactly zero' identity holds exactly only in the continuous Gaussian case, where g(f) = fμ − f²σ²/2. For discrete bets it is a close approximation that runs slightly negative",
    ],
    status: "secondary",
  },

  // ---------------------------------------------------------------
  // Behaviour
  // ---------------------------------------------------------------
  "bali-max": {
    id: "bali-max",
    title:
      "Maxing Out: Stocks as Lotteries and the Cross-Section of Expected Returns",
    authors: ["Turan G. Bali", "Nusret Cakici", "Robert F. Whitelaw"],
    publisher: "Journal of Financial Economics 99(2), 427–446",
    publicationDate: "2011-02",
    url: "https://pages.stern.nyu.edu/~rwhitela/papers/max%20jfe11.pdf",
    statistic:
      "Stocks in the highest decile of maximum daily return over the prior month underperform the lowest decile by more than 1% a month.",
    samplePeriod: "US equities, 1962 – 2005",
    assumptions: [
      "Robust to controls for size, book-to-market, momentum, short-term reversal, liquidity and skewness",
    ],
    status: "secondary",
  },

  "croson-sundali": {
    id: "croson-sundali",
    title: "The Gambler's Fallacy and the Hot Hand: Empirical Data from Casinos",
    authors: ["Rachel Croson", "James Sundali"],
    publisher: "Journal of Risk and Uncertainty 30(3), 195–209",
    publicationDate: "2005",
    url: "https://link.springer.com/article/10.1007/s11166-005-1153-2",
    statistic:
      "Roulette players displayed the gambler's fallacy about the wheel (betting against recent outcomes) and the hot-hand fallacy about themselves (betting more after wins) at the same time.",
    samplePeriod:
      "18 hours of casino security video, one roulette table, Reno, July 1998",
    assumptions: [
      "Small sample from a single table over three days",
      "Effects were statistically significant but modest in size",
    ],
    status: "secondary",
  },

  "odean-disposition": {
    id: "odean-disposition",
    title: "Are Investors Reluctant to Realize Their Losses?",
    authors: ["Terrance Odean"],
    publisher: "The Journal of Finance 53(5), 1775–1798",
    publicationDate: "1998-10",
    url: "https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf",
    statistic:
      "Investors were 1.5 to 2 times more likely to sell winning positions than losing ones, and the subsequent performance of what they kept did not justify the choice.",
    samplePeriod: "10,000 US discount brokerage accounts, 1987 – 1993",
    assumptions: [
      "Controls for portfolio rebalancing and tax-motivated selling",
    ],
    status: "secondary",
  },

  "kahneman-tversky-loss": {
    id: "kahneman-tversky-loss",
    title:
      "Advances in Prospect Theory: Cumulative Representation of Uncertainty",
    authors: ["Amos Tversky", "Daniel Kahneman"],
    publisher: "Journal of Risk and Uncertainty 5(4), 297–323",
    publicationDate: "1992",
    url: "https://link.springer.com/article/10.1007/BF00122574",
    statistic:
      "Losses are felt roughly 2.25 times as intensely as equivalent gains, with experimental estimates clustering between about 1.5 and 2.5.",
    assumptions: [
      "2.25 is a median from specific experiments, not a universal constant",
      "The literature contains substantial heterogeneity between individuals and contexts",
    ],
    status: "secondary",
  },

  "morningstar-gap": {
    id: "morningstar-gap",
    title: "Mind the Gap 2025",
    publisher: "Morningstar",
    publicationDate: "2025-08",
    url: "https://www.morningstar.com/business/insights/research/mind-the-gap",
    statistic:
      "The average dollar invested in US mutual funds and ETFs earned about 1.2% a year less than the funds themselves over the past decade — roughly 15% of those funds' gains.",
    samplePeriod: "10 years to December 2024, US funds and ETFs",
    assumptions: [
      "Dollar-weighted (investor) returns compared against time-weighted (fund) returns",
    ],
    status: "secondary",
    contested: {
      summary:
        "The size and the cause of this gap are actively disputed. Critics argue the methodology attributes to bad timing what is largely an artefact of comparing dollar-weighted and time-weighted returns over periods with growing asset bases.",
      counterTitle:
        "Bad Timing Does Not Cost Investors 15% of Their Funds' Returns",
      counterUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4904652",
    },
  },

  "beckmeyer-0dte": {
    id: "beckmeyer-0dte",
    title: "Retail Traders Love 0DTE Options... But Should They?",
    authors: ["Heiner Beckmeyer", "Nicole Branger", "Leander Gayda"],
    publisher: "University of Münster / SSRN",
    publicationDate: "2023-04",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704",
    statistic:
      "Retail options traders lost money on average at every horizon studied — roughly $5.03 million a day in aggregate, about $2.1 billion in total. More than 75% of retail S&P 500 option trades are same-day-expiry contracts.",
    samplePeriod: "November 2019 – June 2021, OPRA trade data",
    assumptions: [
      "Assumes all trades open new positions and a 10-day horizon",
      "Identifies retail flow via the automated price improvement mechanism",
    ],
    status: "secondary",
  },

  "ritter-ipo": {
    id: "ritter-ipo",
    title: "Initial Public Offerings: Updated Statistics",
    authors: ["Jay R. Ritter"],
    publisher: "University of Florida, Warrington College of Business",
    publicationDate: "2025",
    url: "https://site.warrington.ufl.edu/ritter/files/IPOs-long-run-returns-on-IPOs.pdf",
    statistic:
      "The average IPO first-day return is about 19%, but the median is only about 7%. Ritter's 1991 study found a three-year buy-and-hold return of 34.5% for IPOs against 61.9% for matched control firms.",
    samplePeriod: "US operating-company IPOs, 1980 onwards",
    assumptions: [
      "The average is inflated by a small number of very large first-day pops — the mean/median gap is the finding",
    ],
    status: "secondary",
  },

  // ---------------------------------------------------------------
  // Diversification
  // ---------------------------------------------------------------
  "statman-1987": {
    id: "statman-1987",
    title: "How Many Stocks Make a Diversified Portfolio?",
    authors: ["Meir Statman"],
    publisher:
      "Journal of Financial and Quantitative Analysis 22(3), 353–363",
    publicationDate: "1987-09",
    url: "https://www.jstor.org/stable/2330969",
    statistic:
      "A well-diversified portfolio requires at least 30 stocks for a borrowing investor and 40 for a lending investor — against the 8 to 10 that Evans and Archer concluded in 1968.",
    assumptions: [
      "Diversification is defined here as variance reduction, which converges quickly",
      "Variance reduction is not the same target as capturing the extreme winners, which converges far more slowly",
    ],
    status: "secondary",
  },

  "campbell-idiosyncratic": {
    id: "campbell-idiosyncratic",
    title:
      "Have Individual Stocks Become More Volatile? An Empirical Exploration of Idiosyncratic Risk",
    authors: [
      "John Y. Campbell",
      "Martin Lettau",
      "Burton G. Malkiel",
      "Yexiao Xu",
    ],
    publisher: "The Journal of Finance 56(1), 1–43",
    publicationDate: "2001-02",
    url: "https://onlinelibrary.wiley.com/doi/10.1111/0022-1082.00318",
    statistic:
      "Idiosyncratic volatility rose over the second half of the twentieth century, so the number of stocks needed for a given level of diversification has increased over time.",
    samplePeriod: "US equities, 1962 – 1997",
    status: "secondary",
  },

  // ---------------------------------------------------------------
  // Retirement and sequence risk
  // ---------------------------------------------------------------
  "sequence-risk": {
    id: "sequence-risk",
    title: "Sequence of returns risk in retirement",
    publisher: "Fidelity Investments",
    publicationDate: "2024",
    url: "https://www.fidelity.com/learning-center/personal-finance/retirement/sequence-risk",
    statistic:
      "Two retirees with the same average annual return over 30 years can end in completely different places: the one who suffers losses early can be depleted before year 30, while the one who gets the same returns in the opposite order finishes with a large balance.",
    assumptions: [
      "Illustrative modelling, not historical outcomes",
      "Order of returns only matters once withdrawals begin — it is irrelevant to a pure accumulator",
    ],
    status: "to-verify",
  },
} as const satisfies Record<string, Citation>;

/**
 * Union of every valid citation key. Referencing a source that does not exist
 * in the database above is a compile error.
 */
export type CitationId = keyof typeof CITATIONS;

export const CITATION_LIST: readonly Citation[] = Object.values(CITATIONS);

export function getCitation(id: CitationId): Citation {
  return CITATIONS[id];
}
