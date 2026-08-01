/**
 * Core financial arithmetic.
 *
 * These functions carry the app's central claims, so each one is tested
 * against a published figure where a published figure exists. If a test here
 * fails, a statement somewhere on the site has become false.
 */

/** Compound a sequence of period returns. Geometric, never arithmetic. */
export function compound(returns: readonly number[]): number {
  return returns.reduce((acc, r) => acc * (1 + r), 1) - 1;
}

/** Annualised (geometric mean) return from a total return over n periods. */
export function annualise(totalReturn: number, years: number): number {
  if (years <= 0) return 0;
  return Math.pow(1 + totalReturn, 1 / years) - 1;
}

/** The arithmetic mean of a series. */
export function mean(xs: readonly number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Population standard deviation. */
export function stdDev(xs: readonly number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

/** Value at a percentile (0–1) of a sorted-on-demand series. */
export function percentile(xs: readonly number[], p: number): number {
  if (xs.length === 0) return 0;
  const sorted = xs.slice().sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export type FeeDragResult = {
  /** Ending value with no fee at all. */
  gross: number;
  /** Ending value after the annual fee. */
  net: number;
  /** Money lost to the fee. */
  cost: number;
  /** Fee cost as a share of the no-fee ending value. */
  costShare: number;
  /** Ending value each year, for charting. */
  path: { year: number; gross: number; net: number }[];
};

/**
 * The compounding cost of an annual percentage fee.
 *
 * Matches the SEC's published illustration: $100,000 at 4% for 20 years is
 * worth ~$179,000 at a 1.00% fee and ~$208,000 at 0.25%.
 * @see https://www.sec.gov/investor/alerts/ib_fees_expenses.pdf
 *
 * The fee is applied to the balance at the end of each year, which is the
 * convention the SEC illustration uses.
 */
export function feeDrag(
  principal: number,
  annualGrowth: number,
  annualFee: number,
  years: number
): FeeDragResult {
  const path: FeeDragResult["path"] = [];
  let net = principal;
  let gross = principal;

  for (let y = 1; y <= years; y++) {
    gross = gross * (1 + annualGrowth);
    net = net * (1 + annualGrowth) * (1 - annualFee);
    path.push({ year: y, gross, net });
  }

  return {
    gross,
    net,
    cost: gross - net,
    costShare: gross > 0 ? (gross - net) / gross : 0,
    path,
  };
}

/**
 * The casino equivalent: a bankroll bet repeatedly into a fixed house edge,
 * expressed as expected value so it is directly comparable with `feeDrag`.
 *
 * This deliberately ignores variance and ruin — it answers "where does the
 * expectation go", which is the question the fee comparison is asking.
 */
export function houseEdgeDrag(
  bankroll: number,
  houseEdge: number,
  bets: number
): { expected: number; path: { bet: number; expected: number }[] } {
  const path: { bet: number; expected: number }[] = [];
  let expected = bankroll;
  for (let b = 1; b <= bets; b++) {
    expected = expected * (1 - houseEdge);
    path.push({ bet: b, expected });
  }
  return { expected, path };
}

/**
 * Volatility drag: the gap between the arithmetic and geometric mean.
 *
 * The canonical demonstration is +50% then −50%, which has an arithmetic mean
 * of exactly 0 and a geometric mean of −13.4% per period.
 */
export function volatilityDrag(returns: readonly number[]): {
  arithmetic: number;
  geometric: number;
  drag: number;
} {
  const arithmetic = mean(returns);
  const total = compound(returns);
  const geometric = Math.pow(1 + total, 1 / returns.length) - 1;
  return { arithmetic, geometric, drag: arithmetic - geometric };
}

/**
 * Kelly fraction for a binary bet.
 *
 * f* = (bp − q) / b, where b is net odds received on a win, p the win
 * probability and q = 1 − p. Returns 0 for a non-positive-edge bet: the
 * correct Kelly stake on a losing proposition is nothing.
 * @see Kelly (1956), Bell System Technical Journal 35(4)
 */
export function kellyFraction(winProb: number, netOdds: number): number {
  if (netOdds <= 0) return 0;
  const q = 1 - winProb;
  const f = (netOdds * winProb - q) / netOdds;
  return Math.max(0, f);
}

/**
 * Expected long-run log growth rate per bet at a given staking fraction,
 * for a DISCRETE binary bet.
 *
 * This is what Kelly maximises, and it is what makes over-betting visible:
 * growth peaks at f* and falls away on both sides.
 *
 * Note that growth reaches approximately — not exactly — zero at 2f*. The
 * clean "twice Kelly earns nothing" identity is exact only in the continuous
 * Gaussian case (see `logGrowthRateContinuous`); for discrete bets it is a
 * close approximation that runs slightly negative. The app states the result
 * in the form that is actually true rather than the tidier one.
 */
export function logGrowthRate(
  winProb: number,
  netOdds: number,
  fraction: number
): number {
  if (fraction <= 0) return 0;
  if (fraction >= 1) return -Infinity;
  const win = Math.log(1 + netOdds * fraction);
  const lose = Math.log(1 - fraction);
  return winProb * win + (1 - winProb) * lose;
}

/**
 * Continuous-time (Gaussian) growth rate: g(f) = f·μ − f²σ²/2.
 *
 * Here Kelly is f* = μ/σ², and g(2f*) = 0 exactly — the parabola passes back
 * through zero at precisely twice the optimal fraction. This is the form in
 * which the well-known result actually holds.
 */
export function logGrowthRateContinuous(
  mu: number,
  sigma: number,
  fraction: number
): number {
  return fraction * mu - (fraction ** 2 * sigma ** 2) / 2;
}

/** Kelly fraction in the continuous Gaussian case: μ/σ². */
export function kellyFractionContinuous(mu: number, sigma: number): number {
  if (sigma === 0) return 0;
  return mu / sigma ** 2;
}
