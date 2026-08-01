import { annualise } from "./finance";

export type DailyPoint = { date: string; close: number };

export type MissingDaysResult = {
  daysRemoved: number;
  totalReturn: number;
  annualised: number;
  endingValue: number;
};

/**
 * The "missing the best days" calculation, and its mirror image.
 *
 * Removing a day means compounding the series as if that day's return were
 * zero — i.e. you were in cash for exactly that session. That is the standard
 * construction, and it is generous to the argument: a real investor who
 * stepped out would also have missed the surrounding days.
 *
 * `direction: "worst"` runs the same calculation on the worst days. The app
 * always shows both, because the one-sided version of this statistic is a
 * sales pitch rather than an analysis — best and worst days cluster in the
 * same volatile stretches.
 */
export function missingDays(
  series: readonly DailyPoint[],
  maxDaysRemoved: number,
  direction: "best" | "worst" = "best",
  startValue = 10000
): MissingDaysResult[] {
  if (series.length < 2) return [];

  // Daily simple returns.
  const returns: number[] = [];
  for (let i = 1; i < series.length; i++) {
    returns.push(series[i].close / series[i - 1].close - 1);
  }

  // Rank day indices by return, so we can zero out the top/bottom N.
  const order = returns
    .map((r, i) => ({ r, i }))
    .sort((a, b) => (direction === "best" ? b.r - a.r : a.r - b.r))
    .map((d) => d.i);

  const years =
    (Date.parse(series[series.length - 1].date) - Date.parse(series[0].date)) /
    (365.2425 * 24 * 3600 * 1000);

  const out: MissingDaysResult[] = [];
  const removed = new Set<number>();

  for (let n = 0; n <= maxDaysRemoved; n++) {
    if (n > 0) removed.add(order[n - 1]);

    let value = startValue;
    for (let i = 0; i < returns.length; i++) {
      if (removed.has(i)) continue; // treated as a flat day in cash
      value *= 1 + returns[i];
    }

    const totalReturn = value / startValue - 1;
    out.push({
      daysRemoved: n,
      totalReturn,
      annualised: annualise(totalReturn, years),
      endingValue: value,
    });
  }

  return out;
}

export type HoldingPeriodStat = {
  years: number;
  windows: number;
  positive: number;
  positiveShare: number;
  worst: number;
  best: number;
  median: number;
};

/**
 * Share of historical holding periods of each length that finished positive.
 *
 * Windows overlap, so they are NOT independent observations. Across a ~98
 * year record there are only about five non-overlapping twenty-year periods,
 * and the app states that alongside the result — the smooth-looking curve
 * rests on a very small effective sample at the long end.
 */
export function holdingPeriodStats(
  annualReturns: readonly number[],
  lengths: readonly number[]
): HoldingPeriodStat[] {
  return lengths.map((len) => {
    const results: number[] = [];
    for (let i = 0; i + len <= annualReturns.length; i++) {
      let v = 1;
      for (let j = i; j < i + len; j++) v *= 1 + annualReturns[j];
      results.push(v - 1);
    }
    const positive = results.filter((r) => r > 0).length;
    const sorted = results.slice().sort((a, b) => a - b);
    return {
      years: len,
      windows: results.length,
      positive,
      positiveShare: results.length ? positive / results.length : 0,
      worst: sorted[0] ?? 0,
      best: sorted[sorted.length - 1] ?? 0,
      median: sorted[Math.floor(sorted.length / 2)] ?? 0,
    };
  });
}

/**
 * The casino mirror: probability of being ahead after n bets on a
 * negative-expectancy game, by normal approximation.
 *
 * Plotted against `holdingPeriodStats`, this is the clearest statement of the
 * site's thesis — the same law of large numbers, opposite destinations.
 */
export function probabilityAheadAfterBets(
  houseEdge: number,
  stdDevPerBet: number,
  bets: number
): number {
  if (bets <= 0) return 0.5;
  const meanTotal = -houseEdge * bets;
  const sd = stdDevPerBet * Math.sqrt(bets);
  if (sd === 0) return meanTotal > 0 ? 1 : 0;
  return 1 - normalCdf(-meanTotal / sd);
}

/** Abramowitz & Stegun 7.1.26 approximation to the normal CDF. */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.31938153 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}
