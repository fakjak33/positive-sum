import type { Analogy } from "./types";
import type { CitationId } from "./citations";

/**
 * The thirty analogies, ranked and tiered in docs/02-analogies-ranked.md.
 *
 * Every entry must state where the comparison fails — the type system
 * enforces a non-empty `breaksDownBecause`, because an analogy that is only
 * ever flattering is propaganda with a chart on it.
 */
export const ANALOGIES: readonly Analogy<CitationId>[] = [
  // =================================================================
  // TIER 1 — flagship interactives
  // =================================================================
  {
    slug: "red-or-black",
    title: "Red or Black, 500 Times",
    category: "skew",
    tier: 1,
    headline: "44%",
    headlineCaption: "of S&P 500 members beat the index in the first half of 2025",
    marketStat:
      "In a typical year a large share of index constituents underperform the index itself, and in some years most of them fall outright — even when the index finishes up.",
    casinoComparison:
      "Picking one stock for a year feels like betting red or black: roughly even odds, one outcome, no control once the wheel is spinning.",
    explanation:
      "The index is capitalisation-weighted, so it is not the average of its members. A minority of very large winners can carry the whole index while the median constituent goes nowhere. That is why 'the market went up' and 'my stock went down' are routinely both true.",
    worksBecause: [
      "Over a single year, a single-stock pick genuinely is close to a coin flip, and most people badly overestimate their odds of choosing well.",
      "Both settings punish the same error: mistaking one draw from a wide distribution for a reliable outcome.",
    ],
    breaksDownBecause: [
      "Roulette pays a fixed 35:1 and its probabilities are known exactly and permanently. Stock outcomes are unbounded above, capped at −100% below, and their distribution is estimated from history rather than known.",
      "Cap-weighting means the index is not the average of those squares — it is dominated by a handful of the largest, which is the whole reason the index can rise while most members fall.",
      "A losing roulette chip is worth nothing the instant the ball lands. A share that fell 20% is still a claim on a business that keeps operating.",
    ],
    citations: ["spdji-shadows-of-giants", "wizard-house-edge"],
    interactive: "roulette",
    tags: ["breadth", "cap-weighting", "coin flip", "roulette"],
  },
  {
    slug: "the-4-percent-jackpot",
    title: "The 4% Jackpot",
    category: "skew",
    tier: 1,
    headline: "51.6%",
    headlineCaption:
      "of all US stocks since 1925 lost money over their entire listed life",
    marketStat:
      "Most individual stocks lose money over their lifetime. A very small minority produce nearly all of the market's wealth creation.",
    casinoComparison:
      "It looks like a slot machine: most spins give you nothing, and the whole payoff sits in a jackpot you will probably never hit.",
    explanation:
      "The distribution of long-run stock returns is extremely positively skewed. The best 4% of firms account for the entire net dollar wealth creation of the US market since 1926; the rest, collectively, merely matched Treasury bills.",
    worksBecause: [
      "The payoff shape really is lottery-like: a long left mass of losers and a thin, enormously valuable right tail.",
      "It explains why picking stocks feels unrewarding even in a rising market — the median outcome is genuinely poor.",
      "It is the strongest available argument for owning the whole distribution rather than sampling from it.",
    ],
    breaksDownBecause: [
      "A slot jackpot is funded by other players' losses. Altria's return was funded by selling products for a century — no one had to lose for that shareholder to win.",
      "The top performers were not explosive. They compounded at an average of 13.47% a year. The astronomical multiples came from duration, not from any single lucky spin — there is no casino mechanism that converts patience into payout.",
      "A slot machine's odds are fixed by its designer. A company's prospects change with what it actually does, and shareholders have legal claims and votes.",
    ],
    citations: [
      "bessembinder-2024",
      "bessembinder-2018",
      "jpm-agony-ecstasy",
      "wizard-house-edge",
    ],
    interactive: "slot-machine",
    tags: ["skew", "Bessembinder", "slot machine", "compounding"],
  },
  {
    slug: "missing-the-best-days",
    title: "Missing the Best Days",
    category: "time",
    tier: 1,
    headline: "8.4% → 2.1%",
    headlineCaption:
      "annualised return after missing the 30 best days in thirty years",
    marketStat:
      "Long-run returns are concentrated in a very small number of trading days, and those days cluster inside the worst periods.",
    casinoComparison:
      "There isn't one — and that absence is the lesson. No casino game has a handful of spins that carry the entire result.",
    explanation:
      "Returns arrive in bursts rather than evenly. Missing the thirty best days over thirty years took the annualised return below the inflation rate. 76% of those best days happened during a bear market or in the first two months of a recovery — precisely when selling feels most reasonable.",
    worksBecause: [
      "It shows concretely that being out of the market at the wrong moment is expensive, and that the wrong moments are unusually hard to identify in advance.",
      "It demonstrates that return distributions have fat tails in both directions, not just the downside people worry about.",
    ],
    breaksDownBecause: [
      "The symmetrical calculation is just as dramatic: an investor who avoided the worst days would have done spectacularly. Presenting only the best-days version is a sales pitch, not an analysis.",
      "Best and worst days cluster in the same volatile stretches, so avoiding one in practice means missing the other. The real finding is that volatility clusters and timing is hard — not that staying invested is costless.",
      "This has no casino counterpart at all. Roulette outcomes are independent and identically distributed; there are no 'best spins' whose absence changes your expected result.",
    ],
    citations: ["hartford-best-days", "damodaran-returns"],
    interactive: "best-days",
    tags: ["market timing", "volatility clustering", "fat tails"],
  },
  {
    slug: "how-many-stocks",
    title: "How Many Stocks Is Enough",
    category: "diversification",
    tier: 1,
    headline: "30–40",
    headlineCaption:
      "stocks needed to diversify away most variance — but not to capture the winners",
    marketStat:
      "Adding holdings narrows the range of outcomes quickly. Capturing the rare extreme winners takes far more holdings than variance reduction does.",
    casinoComparison:
      "Splitting a bet across twenty roulette numbers instead of one: the swings get smaller and the result gets more predictable.",
    explanation:
      "Diversification does the same thing to risk in both settings — it narrows the distribution of outcomes. What it does to the expected value is completely different, and that difference is the entire argument.",
    worksBecause: [
      "The variance-reduction mathematics is genuinely identical. Spreading a fixed stake across more independent draws narrows the spread of results in a casino exactly as it does in a portfolio.",
      "It explains why concentrated portfolios feel exciting and perform erratically.",
    ],
    breaksDownBecause: [
      "In roulette, narrowing the distribution converges you on a guaranteed loss — the expected value stays at −5.26% no matter how you split the stake. In equities it converges you on a positive expected return. Same operation, opposite destination.",
      "Variance converges much faster than the probability of capturing the extreme winners. A 30-stock portfolio can look well-diversified by the 1987 definition and still be very likely to miss every top-4% firm.",
      "Casino bets within one spin are mutually exclusive rather than independent, so the analogy is loose even on its own terms.",
    ],
    citations: [
      "statman-1987",
      "campbell-idiosyncratic",
      "bessembinder-2018",
      "wizard-house-edge",
    ],
    interactive: "diversification",
    tags: ["diversification", "variance", "Monte Carlo"],
  },
  {
    slug: "house-edge-vs-fees",
    title: "House Edge vs Expense Ratio",
    category: "costs",
    tier: 1,
    headline: "$29,000",
    headlineCaption:
      "cost of a 0.75% fee difference on $100,000 over twenty years",
    marketStat:
      "A recurring percentage fee compounds against you exactly the way a house edge does.",
    casinoComparison:
      "European roulette takes 2.70% of each wager. A 1% annual fee, compounded for twenty years, removes a larger share of your wealth than that.",
    explanation:
      "Both are a small percentage removed repeatedly from a base that would otherwise compound. The SEC's own illustration: $100,000 growing at 4% for twenty years is worth about $179,000 after a 1.00% fee and about $208,000 after a 0.25% fee.",
    worksBecause: [
      "The arithmetic of a recurring percentage drag really is the same in both places, and the comparison is a fair one to make.",
      "It reframes fees from a small number on a statement into a compounding force with the same character as a casino's edge.",
      "It makes the strongest available case for minimising costs — and it cuts against the finance industry rather than against the individual.",
    ],
    breaksDownBecause: [
      "The fee is subtracted from a positive-expectancy asset, so the investor still expects to finish ahead — just less far ahead. The house edge is subtracted from a zero-sum wager, so the gambler expects to finish behind. Same mechanism, opposite destination.",
      "The house edge is charged per bet; a fee is charged per year regardless of activity. They are not directly comparable rates without fixing a common time base.",
      "A fee sometimes buys something real — custody, rebalancing, advice that prevents a worse decision. A house edge buys the lights.",
    ],
    citations: ["sec-fees", "wizard-house-edge", "spiva-us"],
    interactive: "house-edge",
    tags: ["fees", "compounding", "house edge", "expectancy"],
  },
  {
    slug: "the-crash-simulator",
    title: "The Crash Simulator",
    category: "time",
    tier: 1,
    headline: "25 years",
    headlineCaption: "to recover from the 1929 peak — the worst case on record",
    marketStat:
      "Severe drawdowns have taken between a few months and roughly twenty-five years to recover.",
    casinoComparison:
      "Chasing losses. The impulse to act after a decline is the same impulse that doubles a bet after a loss.",
    explanation:
      "The emotional state that produces the mistake is not accessible from a table of drawdowns. Living through a decline decision by decision is a different experience from reading that it happened.",
    worksBecause: [
      "The behavioural driver is genuinely shared: a realised loss creates pressure to act, and acting under that pressure is usually worse than not acting.",
      "It shows why risk tolerance measured in calm conditions overstates real risk tolerance.",
    ],
    breaksDownBecause: [
      "You know you are in a simulation and you know recoveries happened. Hindsight makes holding feel obvious in a way it never was in 1932.",
      "Twenty-five years to recover is a real outcome for a real lifespan. 'It always comes back' is not a complete answer to someone who needs the money in year eight.",
      "A casino loss is final the moment it happens. A drawdown is only realised if you sell — the two are not the same kind of loss at all.",
    ],
    citations: ["damodaran-returns", "jpm-guide-intra-year"],
    interactive: "crash",
    tags: ["drawdown", "recovery", "loss aversion", "behaviour"],
  },
  {
    slug: "time-in-the-market",
    title: "Time in the Market",
    category: "time",
    tier: 1,
    headline: "73%",
    headlineCaption: "of calendar years since 1928 finished positive",
    marketStat:
      "The probability of a positive return has historically risen with the length of the holding period.",
    casinoComparison:
      "The mirror image. The longer you play a negative-expectancy game, the more certain your loss becomes.",
    explanation:
      "The same theorem drives both curves. The law of large numbers pulls repeated outcomes toward their expected value — which is why time helps an investor and destroys a gambler. It is the single clearest statement of what separates the two activities.",
    worksBecause: [
      "The underlying mathematics is identical. Only the sign of the expected value differs, and that one sign flip inverts the entire conclusion.",
      "It explains why 'just hold on' is reasonable advice for a diversified index and terrible advice at a roulette table.",
    ],
    breaksDownBecause: [
      "The casino curve is a mathematical certainty. The market curve is an empirical frequency drawn from history, not a law.",
      "There are only about five non-overlapping twenty-year periods in the whole US record. That is a very small sample to make a probability claim from, and overlapping windows do not add independent information.",
      "These are nominal, pre-tax, pre-fee figures from the single most successful equity market of the twentieth century. Several national markets went to zero in the same period — the US record is itself a survivorship-biased sample.",
    ],
    citations: ["damodaran-returns", "wizard-house-edge"],
    interactive: "holding-period",
    tags: ["law of large numbers", "holding period", "survivorship"],
  },
  {
    slug: "guess-the-odds",
    title: "Guess the Odds",
    category: "behaviour",
    tier: 1,
    headline: "How calibrated are you?",
    headlineCaption: "Commit to a number before you see the answer",
    marketStat:
      "Most people are systematically miscalibrated about financial base rates, and confident about it.",
    casinoComparison:
      "Every gambler has a number in their head for their odds. It is almost never the real one.",
    explanation:
      "Committing to an estimate before seeing the answer is what turns a statistic into a belief update. Reading a number changes very little; being wrong about a number you just committed to changes a lot.",
    worksBecause: [
      "Prediction before feedback is one of the better-supported mechanisms for durable learning.",
      "Miscalibration is measurable, so you get a score rather than an impression.",
    ],
    breaksDownBecause: [
      "This is a quiz format rather than a claim about the world, so there is no analogy here to break down.",
      "Calibration on trivia questions does not necessarily transfer to calibration on decisions with money at stake.",
    ],
    citations: ["damodaran-returns", "spiva-us", "bessembinder-2024"],
    interactive: "guess-odds",
    tags: ["calibration", "overconfidence", "quiz"],
  },
  {
    slug: "the-ergodicity-trap",
    title: "Coin Flip and the Ergodicity Trap",
    category: "costs",
    tier: 1,
    headline: "+50% / −40%",
    headlineCaption:
      "a coin with positive expected value that still ruins almost everyone who plays it",
    marketStat:
      "A bet with positive expected value can still lead almost every individual to ruin if it is sized wrongly.",
    casinoComparison:
      "The card counter's actual problem. Having an edge is not enough; betting too much of the bankroll on it still ends in zero.",
    explanation:
      "The average outcome across many players is not the outcome of one player over time. Multiplicative processes are not ergodic: the ensemble average and the time average diverge. Kelly sizing is the solution in both domains, and the mathematics is the same one.",
    worksBecause: [
      "Essentially nothing is lost in translation. The Kelly criterion applies identically to a card counter and a portfolio manager, and over-betting destroys both.",
      "It explains simultaneously why gamblers go broke on positive-expectancy bets and why leverage destroys otherwise sound portfolios.",
      "It is the deepest idea on the site and the one most people have never encountered.",
    ],
    breaksDownBecause: [
      "Kelly assumes you know the probabilities. A card counter roughly does; an investor does not, which is the standard argument for betting a fraction of Kelly.",
      "Real portfolios face correlated positions and fat tails rather than independent binary draws, so the clean formula understates the risk.",
    ],
    citations: ["kelly-1956", "wizard-house-edge"],
    interactive: "coin-flip",
    tags: ["ergodicity", "Kelly", "position sizing", "ruin"],
  },
  {
    slug: "basic-strategy-and-discipline",
    title: "Basic Strategy vs Discipline",
    category: "behaviour",
    tier: 1,
    headline: "2% → 0.28%",
    headlineCaption:
      "house edge in blackjack, intuition versus mechanical basic strategy",
    marketStat:
      "A simple rule followed without deviation tends to beat case-by-case judgement.",
    casinoComparison:
      "Blackjack basic strategy. A printed card, followed exactly, cuts the house edge by most of its size.",
    explanation:
      "In both settings the rule is unexciting, the temptation to deviate arrives precisely when it feels most justified, and the deviations are what cost the money.",
    worksBecause: [
      "The behavioural pattern is real and shared: people abandon correct rules under emotional pressure, and the pressure peaks exactly when the rule matters most.",
      "It reframes discipline as a mechanical practice rather than a character trait.",
    ],
    breaksDownBecause: [
      "Blackjack basic strategy is provably optimal against known probabilities. No investing rule has that status, and comparing 'always split aces' to 'always rebalance annually' lends the investing rule a certainty it has not earned.",
      "Even played perfectly, blackjack still has a negative expected value. Discipline there minimises a loss; in investing it improves an already-positive expectation.",
      "This is the weakest analogy in the first tier. It is included because the discipline lesson is worth the caveat — not because the comparison is tight.",
    ],
    citations: ["wizard-house-edge", "odean-disposition", "barber-odean-2000"],
    interactive: "blackjack",
    tags: ["discipline", "basic strategy", "rules"],
  },

  // =================================================================
  // TIER 2 — chart plus focused interaction
  // =================================================================
  {
    slug: "the-manager-survival-curve",
    title: "The Manager Survival Curve",
    category: "skill",
    tier: 2,
    headline: "89.5%",
    headlineCaption: "of US large-cap funds underperformed the S&P 500 over 15 years",
    marketStat:
      "The share of active funds beating their benchmark falls steadily as the measurement horizon lengthens.",
    casinoComparison:
      "The longer players stay at the table, the smaller the fraction still ahead.",
    explanation:
      "Costs compound against the manager while the benchmark carries none, and the arithmetic of active management means the average active dollar must underperform the average passive dollar before fees.",
    worksBecause: [
      "The attrition shape is genuinely similar: a persistent per-period drag guarantees fewer survivors the longer you measure.",
      "It shows that a few years of outperformance is very weak evidence of skill.",
    ],
    breaksDownBecause: [
      "Part of the decline is survivorship arithmetic rather than skill failure — SPIVA counts funds that closed, and closure is not the same as a gambler busting out.",
      "Some managers genuinely do have skill; the finding is that identifying them in advance is hard, not that skill does not exist.",
      "A fund that underperforms the index by 1% still made money in a rising market. A losing gambler simply has less.",
    ],
    citations: ["spiva-us", "spiva-survivorship"],
    interactive: "spiva",
    tags: ["active management", "SPIVA", "survivorship"],
  },
  {
    slug: "how-long-do-day-traders-last",
    title: "How Long Do Day Traders Last",
    category: "skill",
    tier: 2,
    headline: "<1%",
    headlineCaption: "of day traders were predictably profitable net of fees",
    marketStat:
      "Day trading attrition curves closely resemble the attrition curves of persistent gambling.",
    casinoComparison:
      "Almost the same curve. Most participants stop; the few who continue mostly continue losing.",
    explanation:
      "Complete exchange records from Taiwan show survival of 44% at one year, 24% at two and 15% at three. In Brazil, 97% of those who persisted past 300 sessions lost money.",
    worksBecause: [
      "This is the place where the comparison is most nearly literal. Short-horizon leveraged speculation after costs is, structurally, a negative-expectancy activity.",
      "The attrition data comes from complete records rather than self-reported results, so it avoids the survivorship problem that makes trading look better than it is.",
    ],
    breaksDownBecause: [
      "A small minority genuinely are skilled and persistently profitable, which is not true of roulette at all.",
      "These findings are about day trading specifically. Extending them to long-horizon diversified investing is exactly the error this site exists to correct.",
    ],
    citations: ["barber-odean-taiwan", "chague-brazil", "levitt-miles-poker"],
    interactive: "day-traders",
    tags: ["day trading", "attrition", "costs"],
  },
  {
    slug: "lottery-tickets-inside-the-market",
    title: "Lottery Tickets Inside the Market",
    category: "behaviour",
    tier: 2,
    headline: "−1%/month",
    headlineCaption:
      "underperformance of the most lottery-like stocks versus the least",
    marketStat:
      "Stocks with recent extreme positive returns subsequently underperform.",
    casinoComparison:
      "Buying the ticket because the jackpot is big, not because the odds are good.",
    explanation:
      "Investors appear to pay a premium for lottery-shaped payoffs, and are compensated with lower returns for it. The gambling impulse shows up inside the stock market and is priced.",
    worksBecause: [
      "It is direct evidence that the preference for lottery-like payoffs is not confined to casinos — it operates in equity markets and costs money.",
      "The effect survives controls for size, value, momentum, liquidity and skewness, so it is not obviously something else in disguise.",
    ],
    breaksDownBecause: [
      "This is a cross-sectional average, not a rule about any individual stock. Some high-MAX stocks did extremely well.",
      "The effect is measured over a specific sample and, like most documented anomalies, may weaken once widely known.",
    ],
    citations: ["bali-max", "matheson-lottery"],
    interactive: "max-effect",
    tags: ["lottery stocks", "MAX effect", "skewness preference"],
  },
  {
    slug: "the-ipo-pop",
    title: "The IPO Pop",
    category: "skew",
    tier: 2,
    headline: "19% vs 7%",
    headlineCaption: "mean versus median IPO first-day return",
    marketStat:
      "The average IPO first-day return is roughly 19%, but the median is about 7%.",
    casinoComparison:
      "The jackpot on the wall is real. It is just not what most players get.",
    explanation:
      "A handful of enormous first-day pops drag the average far above the typical outcome. Reporting the mean makes the typical IPO look like something it is not — and over the following three years, IPOs have historically underperformed matched firms.",
    worksBecause: [
      "It is a compact demonstration of how skew makes an average misleading, using numbers a reader can hold in their head.",
      "The advertised-versus-typical gap is exactly how jackpot marketing works.",
    ],
    breaksDownBecause: [
      "Most retail investors cannot buy at the offer price anyway, so the first-day return is not available to them — the comparison overstates what was ever on the table.",
      "IPO underperformance varies a lot by period and by sector; it is not a stable law.",
    ],
    citations: ["ritter-ipo", "bessembinder-2024"],
    interactive: "ipo",
    tags: ["IPO", "mean vs median", "skew"],
  },
  {
    slug: "the-year-feels-worse-than-it-is",
    title: "The Year Feels Worse Than It Is",
    category: "time",
    tier: 2,
    headline: "−14.2%",
    headlineCaption:
      "average intra-year drop, in years that mostly finished positive",
    marketStat:
      "The S&P 500 has fallen an average of 14.2% at some point within each calendar year, yet finished positive in 35 of 46 years.",
    casinoComparison:
      "A winning session that felt like a losing one, because of how far you were down at the midpoint.",
    explanation:
      "The path is far more alarming than the destination. Judging a year by its worst moment gives a systematically wrong picture of the outcome.",
    worksBecause: [
      "It captures something real about the psychological experience of variance in both settings: the low point is what gets remembered.",
      "It explains why investors report their experience as worse than their statements show.",
    ],
    breaksDownBecause: [
      "A casino session's low point carries no information about its end. A market drawdown sometimes does reflect genuine deterioration.",
      "'It recovers within the year' is an average across a sample where most years were positive; the years that did not recover are the ones that matter most.",
    ],
    citations: ["jpm-guide-intra-year", "damodaran-returns"],
    interactive: "intra-year",
    tags: ["drawdown", "volatility", "experience"],
  },
  {
    slug: "when-the-index-is-a-few-companies",
    title: "When the Index Is a Few Companies",
    category: "diversification",
    tier: 2,
    headline: "~40%",
    headlineCaption: "of S&P 500 weight held by its ten largest companies",
    marketStat:
      "Index concentration reached its highest level since the mid-1960s by mid-2025.",
    casinoComparison:
      "Believing you have spread your chips across the table when most of the stake sits on a few numbers.",
    explanation:
      "A capitalisation-weighted index automatically allocates more to whatever has already grown. 'Owning the market' increasingly means owning a small number of very large firms.",
    worksBecause: [
      "It punctures a genuine complacency: nominal diversification across 500 names is not the same as economic diversification.",
      "It shows that a passive choice still embeds an active concentration bet.",
    ],
    breaksDownBecause: [
      "Concentration is not automatically a mistake. Those firms are large because they generated real earnings, which is not how a lucky number becomes a big pile of chips.",
      "Historical concentration episodes have resolved in very different ways; high concentration is not a reliable timing signal.",
    ],
    citations: ["spdji-concentration", "spdji-shadows-of-giants"],
    interactive: "concentration",
    tags: ["concentration", "index", "cap-weighting"],
  },

  // =================================================================
  // TIER 3 — cited cards
  // =================================================================
  {
    slug: "the-gamblers-fallacy",
    title: "The Gambler's Fallacy",
    category: "behaviour",
    tier: 3,
    headline: "The wheel has no memory",
    headlineCaption: "Observed directly on casino security video",
    marketStat:
      "Investors expect reversal after a run in the same way roulette players expect a colour to be 'due'.",
    casinoComparison:
      "Betting against a run of reds because red has come up too often.",
    explanation:
      "Croson and Sundali recorded players betting against recent outcomes on a wheel where every spin is independent. The same reasoning appears when investors assume an asset must revert simply because it has risen.",
    worksBecause: [
      "The error is identical in structure: treating independent draws as if they were self-correcting.",
    ],
    breaksDownBecause: [
      "Roulette spins are provably independent. Asset prices are not fully independent — momentum and mean-reversion effects are both documented, so 'due for a reversal' is wrong for a different and more subtle reason.",
    ],
    citations: ["croson-sundali"],
    tags: ["gambler's fallacy", "independence", "bias"],
  },
  {
    slug: "the-hot-hand-fallacy",
    title: "The Hot-Hand Fallacy",
    category: "behaviour",
    tier: 3,
    headline: "Held at the same time",
    headlineCaption: "as the belief that the wheel is due to change",
    marketStat:
      "Investors extrapolate their own recent success while simultaneously expecting markets to revert.",
    casinoComparison:
      "Raising your bet after a win because you are running hot.",
    explanation:
      "The striking finding is that the same players held both beliefs at once: the wheel is due to change, but I am not. The investing equivalent is expecting mean reversion in markets while treating your own recent picks as evidence of skill.",
    worksBecause: [
      "The contradiction is genuinely the same one, and noticing you hold both beliefs is the useful moment.",
    ],
    breaksDownBecause: [
      "In some domains hot hands are real — skilled poker players and, on some evidence, basketball shooters. The fallacy is applying it to outcomes that are actually independent, not believing in skill at all.",
    ],
    citations: ["croson-sundali", "levitt-miles-poker"],
    tags: ["hot hand", "extrapolation", "bias"],
  },
  {
    slug: "loss-aversion",
    title: "Loss Aversion",
    category: "behaviour",
    tier: 3,
    headline: "≈2.25×",
    headlineCaption: "how much more a loss is felt than an equivalent gain",
    marketStat:
      "Losses are experienced roughly twice as intensely as equivalent gains, which distorts risk decisions in both directions.",
    casinoComparison:
      "Chasing a loss to get back to even, and leaving a winning session early to protect a gain.",
    explanation:
      "Because the loss side of the value function is steeper, an even-money bet looks unattractive despite a fair expected value — and a realised loss creates disproportionate pressure to act.",
    worksBecause: [
      "It is the common mechanism behind panic selling, loss chasing and premature profit taking, in both settings.",
    ],
    breaksDownBecause: [
      "The 2.25 figure is a median from specific experiments, not a universal constant; estimates range from about 1.5 to 2.5 and vary by person and context.",
      "Some loss aversion is rational rather than a bias — for someone who cannot replace the capital, a loss really does matter more than an equal gain.",
    ],
    citations: ["kahneman-tversky-loss"],
    tags: ["loss aversion", "prospect theory", "bias"],
  },
  {
    slug: "overconfidence-and-turnover",
    title: "Overconfidence and Turnover",
    category: "skill",
    tier: 3,
    headline: "11.4% vs 17.9%",
    headlineCaption: "most-active traders against the market, 1991–1996",
    marketStat:
      "The households that traded most earned substantially less than the market, and less than households that traded least.",
    casinoComparison:
      "More hands per hour means more exposure to the edge. Activity is the cost.",
    explanation:
      "Barber and Odean's core finding is that trading frequency predicts underperformance, and overconfidence explains the frequency.",
    worksBecause: [
      "The mechanism is shared: each transaction carries a cost, so more transactions means more cost regardless of skill.",
      "Overconfidence drives volume in both settings.",
    ],
    breaksDownBecause: [
      "In a casino, activity increases exposure to a negative edge. In markets, activity mainly incurs costs against a positive-expectancy asset you already owned — you are paying to reshuffle, not paying to lose.",
      "The study period had far higher trading costs than today, so the magnitude would differ now even if the direction did not.",
    ],
    citations: ["barber-odean-2000"],
    tags: ["overconfidence", "turnover", "costs"],
  },
  {
    slug: "the-disposition-effect",
    title: "Selling Winners, Keeping Losers",
    category: "behaviour",
    tier: 3,
    headline: "1.5–2×",
    headlineCaption: "more likely to sell a winner than a loser",
    marketStat:
      "Investors realise gains far more readily than losses, even after accounting for taxes and rebalancing.",
    casinoComparison:
      "Colouring up a small win while letting a loss ride in the hope of getting back to even.",
    explanation:
      "Selling a winner confirms a good decision; selling a loser confirms a bad one. The accounting is identical either way, but the feeling is not.",
    worksBecause: [
      "The mechanism — protecting a self-image rather than optimising an outcome — is the same in both settings.",
    ],
    breaksDownBecause: [
      "In taxable accounts the behaviour is not merely neutral but actively costly, since realising losses has tax value. There is no casino equivalent of a tax-loss harvest.",
    ],
    citations: ["odean-disposition", "kahneman-tversky-loss"],
    tags: ["disposition effect", "realisation", "bias"],
  },
  {
    slug: "survivorship-bias",
    title: "You Never Meet the Ones Who Stopped",
    category: "skill",
    tier: 3,
    headline: "64%",
    headlineCaption: "of US domestic stock funds merged or liquidated in 20 years",
    marketStat:
      "Nearly two-thirds of domestic stock funds disappeared over the twenty years to 2024, and they did not disappear at random.",
    casinoComparison:
      "The people still at the table at 3am are not a random sample of the people who sat down.",
    explanation:
      "Performance tables drawn from surviving funds silently delete the majority of the original field, and delete it non-randomly — the failures go first. SPIVA avoids this by using a survivor-bias-free database, which is why its numbers look worse than industry-reported ones.",
    worksBecause: [
      "The selection mechanism is exactly the same, and in both cases it makes the observed record look far better than the real one.",
    ],
    breaksDownBecause: [
      "Funds close for reasons other than poor performance — mergers, strategy changes, insufficient assets — so closure is a noisier signal of failure than busting out at a table.",
    ],
    citations: ["spiva-survivorship", "spiva-us"],
    tags: ["survivorship bias", "selection", "funds"],
  },
  {
    slug: "sequence-of-returns-risk",
    title: "Sequence of Returns Risk",
    category: "time",
    tier: 3,
    headline: "Same average, different ending",
    headlineCaption: "why order stops being irrelevant once you withdraw",
    marketStat:
      "Two retirees with identical average returns over thirty years can finish in completely different positions depending on the order those returns arrived in.",
    casinoComparison:
      "Going on your losing run before your winning run, while still paying for dinner each night.",
    explanation:
      "While you are only accumulating, order genuinely does not matter — multiplication is commutative. Once you are withdrawing, shares sold during a decline are gone and cannot participate in the recovery, so early losses compound in a way later gains cannot undo.",
    worksBecause: [
      "It isolates a real and frequently missed point: 'average return' is an inadequate summary once cash is flowing out.",
      "The mechanism — a fixed withdrawal against a variable balance — is the same as a gambler with fixed expenses and variable results.",
    ],
    breaksDownBecause: [
      "For a pure accumulator making no withdrawals, sequence risk does not exist at all. The comparison only applies to the decumulation phase.",
      "Retirees can adjust spending, which changes the outcome substantially. The illustration assumes rigid withdrawals that few people actually maintain.",
    ],
    citations: ["sequence-risk", "damodaran-returns"],
    tags: ["sequence risk", "retirement", "withdrawals"],
  },
  {
    slug: "kelly-and-over-betting",
    title: "Twice Kelly Pays Nothing",
    category: "costs",
    tier: 3,
    headline: "2× Kelly ≈ 0",
    headlineCaption: "growth advantage, for double the risk",
    marketStat:
      "Position sizing beyond the growth-optimal fraction reduces long-run growth while increasing volatility.",
    casinoComparison:
      "The card counter with a genuine edge who still goes broke by betting too large a share of the bankroll.",
    explanation:
      "Kelly maximises the geometric growth rate. Bet around twice that fraction and you give back essentially the whole growth advantage while carrying far more risk; push further and growth turns clearly negative. You take on more risk and are paid less for it.",
    worksBecause: [
      "The mathematics transfers without modification between blackjack and portfolio construction.",
      "It gives a precise reason why leverage that looks attractive on expected value destroys wealth in practice.",
    ],
    breaksDownBecause: [
      "Kelly assumes known probabilities and independent repeated bets. Investors have neither, which is why fractional Kelly is the practical recommendation rather than full Kelly.",
      "The neat 'twice Kelly earns exactly nothing' result is exact only in the continuous Gaussian case. For discrete bets it is an approximation — close to zero, slightly negative — and the tidier version is repeated more often than it is checked.",
    ],
    citations: ["kelly-1956"],
    tags: ["Kelly", "leverage", "position sizing"],
  },
  {
    slug: "volatility-drag",
    title: "Up 50%, Down 50%, Down Overall",
    category: "costs",
    tier: 3,
    headline: "−13.4%",
    headlineCaption:
      "per period, from a sequence whose arithmetic average is zero",
    marketStat:
      "Geometric returns fall below arithmetic returns by approximately half the variance.",
    casinoComparison:
      "A volatile session that ends below where it started despite an even record.",
    explanation:
      "Gains and losses compound multiplicatively, so a 50% loss requires a 100% gain to recover. Alternating +50% and −50% has an arithmetic mean of zero and a geometric mean of −13.4% per period.",
    worksBecause: [
      "It shows why volatility is a cost in its own right rather than merely a description of the ride, in any multiplicative process.",
    ],
    breaksDownBecause: [
      "This is arithmetic, not an empirical claim about either domain, so there is nothing to disagree with — but also no casino-specific insight in it.",
    ],
    citations: ["kelly-1956", "damodaran-returns"],
    tags: ["volatility drag", "compounding", "geometric mean"],
  },
  {
    slug: "lump-sum-vs-dca",
    title: "Lump Sum vs Dollar-Cost Averaging",
    category: "time",
    tier: 3,
    headline: "68%",
    headlineCaption: "of rolling 12-month periods where lump sum won",
    marketStat:
      "Investing all at once beat spreading it out in about 68% of rolling twelve-month periods, by roughly 2.3% on average.",
    casinoComparison:
      "Bet sizing again — but here the expectancy is positive, so waiting costs you rather than protecting you.",
    explanation:
      "Because markets rise more often than they fall, time out of the market is usually expensive. Dollar-cost averaging wins in the minority of periods that decline.",
    worksBecause: [
      "It illustrates that the right staking approach depends entirely on the sign of the expected value — the same question a gambler faces, with the opposite answer.",
    ],
    breaksDownBecause: [
      "Dollar-cost averaging is a regret-minimising strategy, not a return-maximising one. Judging it purely on mean return tests it against a goal it never claimed.",
      "The 68% figure is an average across market regimes and says nothing about any particular twelve months.",
    ],
    citations: ["vanguard-dca", "damodaran-returns"],
    tags: ["dollar-cost averaging", "lump sum", "timing"],
  },
  {
    slug: "zero-day-options",
    title: "Where Investing Really Is Gambling",
    category: "costs",
    tier: 3,
    headline: "$2.1bn",
    headlineCaption: "aggregate retail options losses over the study period",
    marketStat:
      "Retail options traders lost money on average at every horizon studied, and more than 75% of their S&P 500 option trades expire the same day.",
    casinoComparison:
      "Not an analogy. After costs, this is structurally a negative-expectancy wager that happens to be placed through a brokerage.",
    explanation:
      "This site exists to argue that investing is not gambling. The honest corollary is that some activities conducted inside a brokerage account are gambling, and calling them investing because of where they happen is the actual error.",
    worksBecause: [
      "There is no analogy to defend here — the structure genuinely matches. Short-dated options are a high-variance, negative-expectancy-after-costs bet on a short horizon.",
      "Naming this explicitly is what earns the site the right to reject the comparison elsewhere.",
    ],
    breaksDownBecause: [
      "Options themselves are not inherently speculative. The same instruments used for hedging serve a genuine risk-transfer function, which no casino game does.",
      "The study covers a specific period and identifies retail flow indirectly, so the precise magnitude is uncertain even though the direction is not.",
    ],
    citations: ["beckmeyer-0dte", "barber-odean-taiwan"],
    tags: ["options", "0DTE", "speculation"],
  },
  {
    slug: "skill-needs-sample-size",
    title: "Skill Needs a Sample Size",
    category: "skill",
    tier: 3,
    headline: "1,500 hands",
    headlineCaption: "before skill reliably dominates chance in poker",
    marketStat:
      "Distinguishing skill from luck requires far more observations than most investors ever accumulate.",
    casinoComparison:
      "Poker, where skill is real and measurable but invisible over a short session.",
    explanation:
      "Levitt and Miles found that players identified as skilled in advance returned +30% against −15% for everyone else — real, measurable skill. Simulation work suggests it takes roughly 1,500 hands for that signal to emerge from the noise.",
    worksBecause: [
      "It is the cleanest statement of the signal-to-noise problem available, and it explains why three good years tells you almost nothing about a fund manager.",
      "It rescues the middle ground: skill exists, and short records cannot detect it.",
    ],
    breaksDownBecause: [
      "A poker player can accumulate 1,500 hands in weeks. An investor with an annual decision cycle would need centuries, so the equivalent evidence is simply unobtainable.",
      "Poker is a closed system with fixed rules; markets change underneath the participants, so past skill may not persist even when it was real.",
    ],
    citations: ["levitt-miles-poker", "spiva-us"],
    tags: ["skill vs luck", "sample size", "poker"],
  },
  {
    slug: "state-lotteries-are-worse",
    title: "The Worst Bet Is the One the State Sells",
    category: "costs",
    tier: 3,
    headline: "40–50%",
    headlineCaption: "effective house edge on a typical state lottery",
    marketStat:
      "Before comparing investing to gambling, it is worth knowing that gambling itself spans a forty-point range of expectancy.",
    casinoComparison:
      "State lotteries return only 50–60% of ticket revenue as prizes. Casino slots typically return 85–98%.",
    explanation:
      "The most heavily state-promoted form of gambling is by a wide margin the worst one. This entry exists to calibrate the reader: 'gambling' is not a single thing with a single expectancy.",
    worksBecause: [
      "It establishes the scale before any comparison is drawn, which makes every later comparison more meaningful.",
      "It shows that a negative expectancy can vary by an order of magnitude, just as investment costs can.",
    ],
    breaksDownBecause: [
      "Lottery revenue often funds public spending, so the 'edge' is partly a tax rather than pure profit — an argument about its fairness, not about its expectancy.",
      "For a very small stake, buying a lottery ticket may be rationally purchased entertainment rather than a failed investment.",
    ],
    citations: ["matheson-lottery", "wizard-house-edge"],
    tags: ["lottery", "house edge", "expectancy"],
  },
  {
    slug: "the-behaviour-gap",
    title: "The Behaviour Gap — and the Argument About It",
    category: "behaviour",
    tier: 3,
    headline: "1.2%/yr",
    headlineCaption: "claimed cost of investor timing — and seriously disputed",
    marketStat:
      "Morningstar finds the average dollar in US funds earned about 1.2% a year less than the funds themselves over a decade. Other researchers argue the gap is largely a measurement artefact.",
    casinoComparison:
      "The gambler who would have finished ahead if only they had left when they were up.",
    explanation:
      "The claim compares dollar-weighted investor returns against time-weighted fund returns. Critics argue that much of the apparent shortfall is arithmetic — comparing those two measures over a period when assets were growing produces a gap even when nobody times anything badly.",
    worksBecause: [
      "The underlying behaviour is real and well documented elsewhere: money does tend to arrive after good performance and leave after bad.",
      "It is a useful prompt to check your own contribution timing against your fund's reported return.",
    ],
    breaksDownBecause: [
      "The magnitude is genuinely contested. Fulkerson, Jordan, Riley and Yan argue the methodology substantially overstates the cost of bad timing, and this site has no basis for declaring a winner.",
      "This card exists partly to model something: a statistic that is popular, intuitive and repeated everywhere can still be disputed, and the honest response is to show the disagreement rather than pick the more quotable side.",
    ],
    citations: ["morningstar-gap", "barber-odean-2000"],
    tags: ["behaviour gap", "contested", "dollar-weighted returns"],
  },
  {
    slug: "zero-sum-vs-positive-sum",
    title: "Zero-Sum vs Positive-Sum",
    category: "skew",
    tier: 3,
    headline: "The whole argument",
    headlineCaption: "Everything else on this site follows from this one thing",
    marketStat:
      "Equity returns come from earnings produced by operating businesses. Casino winnings come from other players, minus the house's cut.",
    casinoComparison:
      "None. This is the entry where the analogy is rejected rather than drawn.",
    explanation:
      "If every person on earth played roulette, the aggregate result would be negative by construction. If every person on earth owned the global market, the aggregate result would be the earnings of every business in it. That single structural fact is why every other comparison on this site has a limit.",
    worksBecause: [
      "It is the thesis. The similarities catalogued elsewhere — skew, attrition, cost drag, behavioural error — are all real, and none of them changes the sign of the expected value.",
    ],
    breaksDownBecause: [
      "Positive-sum in aggregate does not mean positive-sum for you. Trading against better-informed counterparties, paying high fees, or concentrating in one company can each produce a personally negative expectancy inside a positive-sum system.",
      "Historical positive returns are not a guarantee of future ones. The claim is about structure, not about entitlement — businesses can and do collectively lose money for extended periods.",
    ],
    citations: ["bessembinder-2018", "damodaran-returns", "wizard-house-edge"],
    tags: ["thesis", "zero-sum", "positive-sum", "ownership"],
  },
];

export const ANALOGY_BY_SLUG = new Map(ANALOGIES.map((a) => [a.slug, a]));

export function getAnalogy(slug: string) {
  return ANALOGY_BY_SLUG.get(slug);
}

export const INTERACTIVE_ANALOGIES = ANALOGIES.filter((a) => a.interactive);
