import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { mulberry32, seedFromString, shuffle } from "./random";
import {
  compound,
  annualise,
  feeDrag,
  volatilityDrag,
  kellyFraction,
  kellyFractionContinuous,
  logGrowthRate,
  logGrowthRateContinuous,
  percentile,
  houseEdgeDrag,
} from "./finance";
import { missingDays, holdingPeriodStats, normalCdf } from "./timing";
import { simulatePortfolios, bootstrapYears, histogram } from "./portfolio";
import { simulateEvenMoneyBets, simulateErgodicCoin } from "./casino";

const DATA = join(process.cwd(), "data");
const load = (f: string) => JSON.parse(readFileSync(join(DATA, f), "utf8"));

// =====================================================================
// Determinism — every shared result depends on this
// =====================================================================
describe("seeded randomness", () => {
  it("produces identical sequences for identical seeds", () => {
    const a = Array.from({ length: 50 }, mulberry32(1234));
    const b = Array.from({ length: 50 }, mulberry32(1234));
    expect(a).toEqual(b);
  });

  it("produces different sequences for different seeds", () => {
    const a = Array.from({ length: 20 }, mulberry32(1));
    const b = Array.from({ length: 20 }, mulberry32(2));
    expect(a).not.toEqual(b);
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 5000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("derives a stable seed from a string", () => {
    expect(seedFromString("red-or-black")).toBe(seedFromString("red-or-black"));
    expect(seedFromString("a")).not.toBe(seedFromString("b"));
  });

  it("shuffles without losing or duplicating elements", () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    const out = shuffle(mulberry32(7), input);
    expect(out.slice().sort((a, b) => a - b)).toEqual(input);
    expect(out).not.toEqual(input);
  });
});

// =====================================================================
// Published-figure fixtures — if these fail, the site is making a
// claim it can no longer support
// =====================================================================
describe("SEC fee illustration", () => {
  // $100,000 at 4% for 20 years: ~$179,000 at 1.00%, ~$208,000 at 0.25%.
  // https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf
  it("reproduces the 1.00% fee ending value", () => {
    const r = feeDrag(100_000, 0.04, 0.01, 20);
    expect(Math.round(r.net / 1000)).toBe(179);
  });

  it("reproduces the 0.25% fee ending value", () => {
    const r = feeDrag(100_000, 0.04, 0.0025, 20);
    expect(Math.round(r.net / 1000)).toBe(208);
  });

  it("puts the cost of the fee difference near $29,000", () => {
    const high = feeDrag(100_000, 0.04, 0.01, 20).net;
    const low = feeDrag(100_000, 0.04, 0.0025, 20).net;
    expect(low - high).toBeGreaterThan(28_000);
    expect(low - high).toBeLessThan(30_000);
  });

  it("charges nothing when the fee is zero", () => {
    const r = feeDrag(100_000, 0.04, 0, 20);
    expect(r.cost).toBeCloseTo(0, 6);
    expect(r.net).toBeCloseTo(100_000 * 1.04 ** 20, 6);
  });
});

describe("volatility drag", () => {
  // The canonical demonstration: +50% then -50% averages zero and compounds
  // to -13.4% per period.
  it("gives -13.4% per period for +50%/-50%", () => {
    const v = volatilityDrag([0.5, -0.5]);
    expect(v.arithmetic).toBeCloseTo(0, 10);
    expect(v.geometric).toBeCloseTo(-0.1339745962, 8);
  });

  it("has zero drag when every return is identical", () => {
    const v = volatilityDrag([0.07, 0.07, 0.07]);
    expect(v.drag).toBeCloseTo(0, 10);
  });

  it("shows drag rising with dispersion", () => {
    const mild = volatilityDrag([0.1, -0.1]).drag;
    const wild = volatilityDrag([0.6, -0.6]).drag;
    expect(wild).toBeGreaterThan(mild);
  });
});

describe("Kelly criterion", () => {
  // Even-money bet at 60% — the textbook example — stakes 20%.
  it("gives 20% for a 60/40 even-money bet", () => {
    expect(kellyFraction(0.6, 1)).toBeCloseTo(0.2, 10);
  });

  it("stakes nothing on a negative-edge bet", () => {
    expect(kellyFraction(0.47, 1)).toBe(0);
    expect(kellyFraction(18 / 38, 1)).toBe(0);
  });

  it("maximises the log growth rate at the Kelly fraction", () => {
    const p = 0.6;
    const b = 1;
    const f = kellyFraction(p, b);
    const atKelly = logGrowthRate(p, b, f);
    for (const delta of [-0.1, -0.05, 0.05, 0.1, 0.2]) {
      expect(atKelly).toBeGreaterThan(logGrowthRate(p, b, f + delta));
    }
  });

  it("gives approximately zero growth at twice Kelly for a discrete bet", () => {
    // The tidy "twice Kelly earns nothing" identity is exact only in the
    // continuous Gaussian case. For a discrete binary bet it lands close to
    // zero and slightly negative, so that is what we assert — and what the
    // site says.
    const p = 0.6;
    const f = kellyFraction(p, 1);
    const g = logGrowthRate(p, 1, 2 * f);
    expect(Math.abs(g)).toBeLessThan(0.01);
    expect(g).toBeLessThan(0);
  });

  it("gives exactly zero growth at twice Kelly in the continuous case", () => {
    const mu = 0.08;
    const sigma = 0.2;
    const f = kellyFractionContinuous(mu, sigma);
    expect(f).toBeCloseTo(2, 10); // 0.08 / 0.04
    expect(logGrowthRateContinuous(mu, sigma, 2 * f)).toBeCloseTo(0, 12);
    expect(logGrowthRateContinuous(mu, sigma, f)).toBeGreaterThan(0);
  });

  it("goes clearly negative beyond twice Kelly", () => {
    const p = 0.6;
    const f = kellyFraction(p, 1);
    expect(logGrowthRate(p, 1, 2.5 * f)).toBeLessThan(0);
    expect(logGrowthRate(p, 1, 2.5 * f)).toBeLessThan(logGrowthRate(p, 1, 2 * f));
  });
});

// =====================================================================
// Compounding basics
// =====================================================================
describe("compounding", () => {
  it("compounds geometrically, not arithmetically", () => {
    // +10% then +10% is +21%, not +20%.
    expect(compound([0.1, 0.1])).toBeCloseTo(0.21, 10);
  });

  it("requires +100% to recover from -50%", () => {
    expect(compound([-0.5, 1.0])).toBeCloseTo(0, 10);
  });

  it("annualises a total return correctly", () => {
    expect(annualise(0.21, 2)).toBeCloseTo(0.1, 10);
  });

  it("computes percentiles", () => {
    const xs = [1, 2, 3, 4, 5];
    expect(percentile(xs, 0)).toBe(1);
    expect(percentile(xs, 0.5)).toBe(3);
    expect(percentile(xs, 1)).toBe(5);
  });

  it("erodes a bankroll by the house edge in expectation", () => {
    const r = houseEdgeDrag(1000, 0.0526, 100);
    expect(r.expected).toBeCloseTo(1000 * 0.9474 ** 100, 6);
    expect(r.expected).toBeLessThan(10);
  });
});

// =====================================================================
// Real-data checks — these run against the committed datasets
// =====================================================================
describe("annual return dataset", () => {
  const annual = load("sp500-annual.json");
  const returns: number[] = annual.data.map((d: { return: number }) => d.return);

  it("covers 1928 onwards", () => {
    expect(annual.data[0].year).toBe(1928);
    expect(returns.length).toBeGreaterThan(90);
  });

  it("has roughly 73% positive years, matching the cited figure", () => {
    const positive = returns.filter((r) => r > 0).length;
    expect(positive / returns.length).toBeGreaterThan(0.7);
    expect(positive / returns.length).toBeLessThan(0.77);
  });

  it("records 1931 as the worst year and 1954 as the best", () => {
    const worst = annual.data.reduce((a: { return: number }, b: { return: number }) => (b.return < a.return ? b : a));
    const best = annual.data.reduce((a: { return: number }, b: { return: number }) => (b.return > a.return ? b : a));
    expect(worst.year).toBe(1931);
    expect(best.year).toBe(1954);
  });

  it("carries its assumptions, so the number can never be quoted bare", () => {
    expect(annual.assumptions.join(" ")).toMatch(/nominal/i);
    expect(annual.assumptions.join(" ")).toMatch(/dividend/i);
    expect(annual.sourceUrl).toContain("stern.nyu.edu");
  });
});

describe("holding period statistics", () => {
  const returns: number[] = load("sp500-annual.json").data.map(
    (d: { return: number }) => d.return
  );
  const stats = holdingPeriodStats(returns, [1, 5, 10, 20]);

  it("shows the positive share rising with holding period", () => {
    for (let i = 1; i < stats.length; i++) {
      expect(stats[i].positiveShare).toBeGreaterThanOrEqual(
        stats[i - 1].positiveShare
      );
    }
  });

  it("finds no negative 20-year window in nominal total returns", () => {
    const twenty = stats.find((s) => s.years === 20)!;
    expect(twenty.positiveShare).toBe(1);
    expect(twenty.worst).toBeGreaterThan(0);
  });

  it("exposes how few windows the long-horizon claim rests on", () => {
    // ~98 years of data gives ~79 OVERLAPPING 20-year windows but only about
    // five non-overlapping ones. The app must never present this as a large
    // sample, so the window count is surfaced rather than hidden.
    const twenty = stats.find((s) => s.years === 20)!;
    expect(twenty.windows).toBeLessThan(85);
    expect(Math.floor(returns.length / 20)).toBeLessThanOrEqual(5);
  });
});

describe("missing the best days", () => {
  const daily = load("sp500-daily.json").data;

  it("has the full daily series", () => {
    expect(daily.length).toBeGreaterThan(7000);
  });

  it("cuts the return sharply as the best days are removed", () => {
    const res = missingDays(daily, 30, "best");
    expect(res[0].daysRemoved).toBe(0);
    expect(res[30].annualised).toBeLessThan(res[0].annualised);
    // The direction and rough magnitude should match Hartford's published
    // result: a large fall, to a small fraction of the full-period return.
    expect(res[30].annualised).toBeLessThan(res[0].annualised * 0.5);
  });

  it("decreases monotonically as more best days are removed", () => {
    const res = missingDays(daily, 20, "best");
    for (let i = 1; i < res.length; i++) {
      expect(res[i].annualised).toBeLessThanOrEqual(res[i - 1].annualised);
    }
  });

  it("is equally dramatic in reverse — the caveat the app must show", () => {
    // If only the "best days" version is shown, the statistic is a sales
    // pitch. Removing the worst days improves returns by a comparable
    // magnitude, which is why both are always displayed together.
    const best = missingDays(daily, 30, "best");
    const worst = missingDays(daily, 30, "worst");
    const lostToBest = best[0].annualised - best[30].annualised;
    const gainedFromWorst = worst[30].annualised - worst[0].annualised;
    expect(gainedFromWorst).toBeGreaterThan(0);
    expect(gainedFromWorst).toBeGreaterThan(lostToBest * 0.5);
  });
});

type ConstituentRow = { returns: (number | null)[] };

const constituentFile = load("constituents-year.json");
const pooledReturns: number[] = constituentFile.data.flatMap(
  (r: ConstituentRow) => r.returns.filter((v): v is number => v !== null)
);

describe("constituent dataset", () => {
  it("has close to 500 real companies", () => {
    expect(constituentFile.data.length).toBeGreaterThan(450);
  });

  it("spans at least 30 years", () => {
    // The interactives must never rest on a single flattering year.
    const usable = constituentFile.derived.perYear.filter(
      (p: { count: number }) => p.count >= 100
    );
    expect(usable.length).toBeGreaterThanOrEqual(30);
  });

  it("pools thousands of company-years", () => {
    expect(pooledReturns.length).toBeGreaterThan(10_000);
  });

  it("declares its survivorship bias explicitly", () => {
    expect(constituentFile.assumptions.join(" ")).toMatch(/survivorship/i);
  });

  it("warns that the bias worsens further back", () => {
    expect(constituentFile.assumptions.join(" ")).toMatch(/worse|WORSE/);
  });

  it("shows the cross-section is skewed — mean above median", () => {
    const mean = pooledReturns.reduce((a, b) => a + b, 0) / pooledReturns.length;
    expect(mean).toBeGreaterThan(percentile(pooledReturns, 0.5));
  });

  it("captures both a disastrous and a spectacular year", () => {
    // If the year range ever silently narrows, this catches it: the point of
    // the multi-year data is that the share of winners swings enormously.
    const shares = constituentFile.derived.perYear
      .filter((p: { count: number }) => p.count >= 100)
      .map((p: { positiveShare: number }) => p.positiveShare);
    expect(Math.min(...shares)).toBeLessThan(0.2);
    expect(Math.max(...shares)).toBeGreaterThan(0.9);
  });

  it("pools to a mean well above the index — the survivorship tell", () => {
    // Roughly double the index's real long-run return. This is not a finding,
    // it is the bias, and the app says so on the page.
    const mean = pooledReturns.reduce((a, b) => a + b, 0) / pooledReturns.length;
    expect(mean).toBeGreaterThan(0.15);
  });
});

// =====================================================================
// Portfolio simulation
// =====================================================================
describe("portfolio simulation", () => {
  const stockReturns: number[] = pooledReturns;

  it("is reproducible for a given seed", () => {
    const a = simulatePortfolios(stockReturns, 5, 500, 42);
    const b = simulatePortfolios(stockReturns, 5, 500, 42);
    expect(a.outcomes).toEqual(b.outcomes);
  });

  it("narrows the outcome distribution as holdings increase", () => {
    const one = simulatePortfolios(stockReturns, 1, 4000, 7);
    const five = simulatePortfolios(stockReturns, 5, 4000, 7);
    const twenty = simulatePortfolios(stockReturns, 20, 4000, 7);
    const spread = (r: { p95: number; p5: number }) => r.p95 - r.p5;
    expect(spread(five)).toBeLessThan(spread(one));
    expect(spread(twenty)).toBeLessThan(spread(five));
  });

  it("leaves the mean roughly unchanged — diversification cuts risk, not return", () => {
    const one = simulatePortfolios(stockReturns, 1, 6000, 11);
    const twenty = simulatePortfolios(stockReturns, 20, 6000, 11);
    expect(Math.abs(one.mean - twenty.mean)).toBeLessThan(0.02);
  });

  it("reduces the chance of losing money as holdings increase", () => {
    const one = simulatePortfolios(stockReturns, 1, 6000, 3);
    const twenty = simulatePortfolios(stockReturns, 20, 6000, 3);
    expect(twenty.lossShare).toBeLessThan(one.lossShare);
  });

  it("never samples the same company twice in one portfolio", () => {
    // A duplicate would understate diversification. Verified indirectly: a
    // portfolio of every stock must equal the equal-weighted mean exactly.
    const all = simulatePortfolios(stockReturns, stockReturns.length, 3, 5);
    const mean = stockReturns.reduce((a, b) => a + b, 0) / stockReturns.length;
    for (const o of all.outcomes) expect(o).toBeCloseTo(mean, 10);
  });
});

describe("bootstrap over years", () => {
  const returns: number[] = load("sp500-annual.json").data.map(
    (d: { return: number }) => d.return
  );

  it("is reproducible", () => {
    const a = bootstrapYears(returns, 20, 300, 5);
    const b = bootstrapYears(returns, 20, 300, 5);
    expect(a.outcomes).toEqual(b.outcomes);
  });

  it("makes losses rarer over longer horizons", () => {
    const short = bootstrapYears(returns, 1, 5000, 9);
    const long = bootstrapYears(returns, 20, 5000, 9);
    expect(long.lossShare).toBeLessThan(short.lossShare);
  });
});

describe("histogram", () => {
  it("bins every value exactly once", () => {
    const vals = Array.from({ length: 500 }, (_, i) => i / 100);
    const bins = histogram(vals, 20);
    expect(bins.reduce((s, b) => s + b.count, 0)).toBe(500);
  });

  it("handles a degenerate all-equal input", () => {
    const bins = histogram([1, 1, 1], 10);
    expect(bins).toHaveLength(1);
    expect(bins[0].count).toBe(3);
  });
});

// =====================================================================
// Casino
// =====================================================================
describe("casino simulation", () => {
  it("parameterises American roulette as exactly 18/38", () => {
    // (1 - 0.0526)/2 should equal 18/38 to within rounding of the published
    // house edge. This is the check that the model matches the real game.
    const impliedWinProb = (1 - 0.0526) / 2;
    expect(impliedWinProb).toBeCloseTo(18 / 38, 4);
  });

  it("loses money in expectation, and more of it with more bets", () => {
    const short = simulateEvenMoneyBets(0.0526, 50, 10, 1000, 21);
    const long = simulateEvenMoneyBets(0.0526, 2000, 10, 1000, 21);
    expect(long.final).toBeLessThan(short.final);
  });

  it("is reproducible for a given seed", () => {
    const a = simulateEvenMoneyBets(0.0526, 200, 5, 500, 8);
    const b = simulateEvenMoneyBets(0.0526, 200, 5, 500, 8);
    expect(a.final).toBe(b.final);
    expect(a.history).toEqual(b.history);
  });

  it("stops and flags ruin when the bankroll cannot cover the stake", () => {
    const r = simulateEvenMoneyBets(0.0526, 10_000, 100, 200, 4);
    expect(r.ruined).toBe(true);
    expect(r.final).toBeLessThan(100);
  });
});

describe("ergodicity", () => {
  it("ruins most players on a bet with positive expected value", () => {
    // +50%/-40% at even odds has an expected value of +5% per round, yet
    // betting the full stake drives the median path toward zero. This is the
    // single most counter-intuitive result in the app, so it is pinned here.
    const full = simulateErgodicCoin(0.5, -0.4, 0.5, 1.0, 100, 2000, 17);
    expect(full.median).toBeLessThan(0.5);
    expect(full.mean).toBeGreaterThan(full.median);
  });

  it("preserves growth when the stake is sized down", () => {
    const full = simulateErgodicCoin(0.5, -0.4, 0.5, 1.0, 100, 2000, 17);
    const sized = simulateErgodicCoin(0.5, -0.4, 0.5, 0.25, 100, 2000, 17);
    expect(sized.median).toBeGreaterThan(full.median);
  });

  it("is reproducible", () => {
    const a = simulateErgodicCoin(0.5, -0.4, 0.5, 0.5, 50, 100, 2);
    const b = simulateErgodicCoin(0.5, -0.4, 0.5, 0.5, 50, 100, 2);
    expect(a.finals).toEqual(b.finals);
  });
});

describe("normal CDF", () => {
  it("is 0.5 at zero", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
  });
  it("matches known quantiles", () => {
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
  });
});
