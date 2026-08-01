import { mulberry32, randInt } from "./random";
import { compound, percentile } from "./finance";

export type PortfolioSimResult = {
  stockCount: number;
  draws: number;
  /** Terminal total return of each simulated portfolio. */
  outcomes: number[];
  mean: number;
  median: number;
  p5: number;
  p25: number;
  p75: number;
  p95: number;
  /** Share of simulated portfolios that lost money. */
  lossShare: number;
  /** Share that beat holding the whole population (equal-weighted). */
  beatMarketShare: number;
};

/**
 * Monte Carlo over REAL historical stock returns.
 *
 * Each simulated portfolio picks `stockCount` companies at random from the
 * actual cross-section and equal-weights them. Resampling real returns rather
 * than drawing from a fitted distribution is the whole point: the cross-section
 * is violently skewed, and a normal (or even lognormal) fit would quietly
 * delete the extreme winners that drive the entire result.
 *
 * Sampling is WITHOUT replacement within a portfolio — you cannot own the same
 * company twice — and independently across draws.
 */
export function simulatePortfolios(
  stockReturns: readonly number[],
  stockCount: number,
  draws: number,
  seed: number
): PortfolioSimResult {
  const rng = mulberry32(seed);
  const n = stockReturns.length;
  const size = Math.min(stockCount, n);
  const outcomes: number[] = [];

  // The equal-weighted return of the whole population is the benchmark: it is
  // what you would have got by owning everything, which is the alternative the
  // interactive is comparing against.
  const marketReturn =
    stockReturns.reduce((a, b) => a + b, 0) / (n || 1);

  const idx = new Uint32Array(n);
  for (let i = 0; i < n; i++) idx[i] = i;

  for (let d = 0; d < draws; d++) {
    // Partial Fisher-Yates: shuffle only the first `size` slots. O(size) per
    // draw rather than O(n), which matters at 10,000 draws.
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const j = i + randInt(rng, n - i);
      const tmp = idx[i];
      idx[i] = idx[j];
      idx[j] = tmp;
      sum += stockReturns[idx[i]];
    }
    outcomes.push(sum / size);
  }

  const losses = outcomes.filter((r) => r < 0).length;
  const beats = outcomes.filter((r) => r > marketReturn).length;

  return {
    stockCount: size,
    draws,
    outcomes,
    mean: outcomes.reduce((a, b) => a + b, 0) / (outcomes.length || 1),
    median: percentile(outcomes, 0.5),
    p5: percentile(outcomes, 0.05),
    p25: percentile(outcomes, 0.25),
    p75: percentile(outcomes, 0.75),
    p95: percentile(outcomes, 0.95),
    lossShare: outcomes.length ? losses / outcomes.length : 0,
    beatMarketShare: outcomes.length ? beats / outcomes.length : 0,
  };
}

/**
 * Multi-year bootstrap: resample annual index returns with replacement to
 * build a distribution of long-horizon outcomes.
 *
 * Bootstrapping destroys any serial correlation present in the real series
 * (mean reversion, volatility clustering), so this answers "what if each year
 * were an independent draw from history" — a deliberate simplification the UI
 * states rather than hides.
 */
export function bootstrapYears(
  annualReturns: readonly number[],
  years: number,
  draws: number,
  seed: number
): { outcomes: number[]; median: number; p5: number; p95: number; lossShare: number } {
  const rng = mulberry32(seed);
  const outcomes: number[] = [];

  for (let d = 0; d < draws; d++) {
    const path: number[] = [];
    for (let y = 0; y < years; y++) {
      path.push(annualReturns[randInt(rng, annualReturns.length)]);
    }
    outcomes.push(compound(path));
  }

  const losses = outcomes.filter((r) => r < 0).length;
  return {
    outcomes,
    median: percentile(outcomes, 0.5),
    p5: percentile(outcomes, 0.05),
    p95: percentile(outcomes, 0.95),
    lossShare: outcomes.length ? losses / outcomes.length : 0,
  };
}

/**
 * Histogram helper for the distribution charts.
 * Returns evenly spaced bins covering [min, max].
 */
export function histogram(
  values: readonly number[],
  bins: number
): { x0: number; x1: number; count: number }[] {
  if (values.length === 0 || bins <= 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === max) {
    return [{ x0: min, x1: min, count: values.length }];
  }
  const width = (max - min) / bins;
  const out = Array.from({ length: bins }, (_, i) => ({
    x0: min + i * width,
    x1: min + (i + 1) * width,
    count: 0,
  }));
  for (const v of values) {
    const i = Math.min(bins - 1, Math.floor((v - min) / width));
    out[i].count++;
  }
  return out;
}
