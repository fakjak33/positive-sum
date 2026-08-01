/**
 * Typed access to the committed datasets in /data.
 *
 * These are static JSON imports, so they are bundled at build time and the app
 * works fully offline. Nothing here fetches at runtime.
 *
 * Every dataset carries its own provenance and assumptions; `datasetMeta`
 * exposes them so any chart can show where its numbers came from without the
 * component having to hard-code a source string.
 */

import annualJson from "../../data/sp500-annual.json";
import dailyJson from "../../data/sp500-daily.json";
import monthlyJson from "../../data/sp500-monthly.json";
import constituentsJson from "../../data/constituents-year.json";
import drawdownsJson from "../../data/drawdowns.json";
import casinoJson from "../../data/casino-games.json";

export type DatasetMeta = {
  name: string;
  source: string;
  sourceUrl: string;
  retrieved: string;
  assumptions: readonly string[];
};

export type AnnualReturn = { year: number; return: number };
export type DailyClose = { date: string; close: number };
export type MonthlyPoint = {
  date: string;
  price: number;
  dividend: number | null;
  cpi: number;
};
export type Constituent = {
  symbol: string;
  name: string;
  sector: string;
  return: number;
};

/** Raw row: one company, one return per year (null where it wasn't trading). */
export type ConstituentRow = {
  symbol: string;
  name: string;
  sector: string;
  returns: (number | null)[];
};

export type YearStat = {
  year: number;
  count: number;
  positive: number;
  positiveShare: number | null;
  meanReturn: number | null;
  medianReturn: number | null;
};
export type Drawdown = {
  peakDate: string;
  troughDate: string;
  recoveryDate: string | null;
  depth: number;
  monthsToTrough: number;
  monthsToRecover: number | null;
  openAtEndOfData?: boolean;
};
export type CasinoGame = {
  game: string;
  houseEdge: number;
  stdDev: number;
  note?: string;
};

function meta(d: {
  name: string;
  source: string;
  sourceUrl: string;
  retrieved: string;
  assumptions: readonly string[];
}): DatasetMeta {
  return {
    name: d.name,
    source: d.source,
    sourceUrl: d.sourceUrl,
    retrieved: d.retrieved,
    assumptions: d.assumptions,
  };
}

export const annualReturns = annualJson.data as AnnualReturn[];
export const annualMeta = meta(annualJson);
export const annualDerived = annualJson.derived;

export const dailyCloses = dailyJson.data as DailyClose[];
export const dailyMeta = meta(dailyJson);

export const monthlySeries = monthlyJson.data as MonthlyPoint[];
export const monthlyMeta = meta(monthlyJson);

export const constituentRows = constituentsJson.data as ConstituentRow[];
export const constituentsMeta = meta(constituentsJson);
export const constituentsDerived = constituentsJson.derived;

/** Every year in the file, including thin early ones. */
export const allConstituentYears = constituentsJson.years as number[];

/** Per-year aggregates, precomputed during data preparation. */
export const perYearStats = constituentsDerived.perYear as YearStat[];

/**
 * Years with enough companies to be worth showing.
 *
 * Coverage falls off going back, because membership is the CURRENT index
 * applied retrospectively. Below ~100 companies the cross-section stops
 * meaning anything, so those years are hidden from the picker rather than
 * silently offered as if they were comparable.
 */
export const MIN_COMPANIES_PER_YEAR = 100;

export const constituentYears = perYearStats
  .filter((s) => s.count >= MIN_COMPANIES_PER_YEAR)
  .map((s) => s.year);

export const latestConstituentYear =
  constituentYears[constituentYears.length - 1];

const yearToIndex = new Map(allConstituentYears.map((y, i) => [y, i]));

/** All companies that traded in a given year, with that year's return. */
export function constituentsForYear(year: number): Constituent[] {
  const i = yearToIndex.get(year);
  if (i === undefined) return [];
  const out: Constituent[] = [];
  for (const row of constituentRows) {
    const r = row.returns[i];
    if (r === null || r === undefined) continue;
    out.push({ symbol: row.symbol, name: row.name, sector: row.sector, return: r });
  }
  return out.sort((a, b) => b.return - a.return);
}

/**
 * Every company-year pooled into one cross-section.
 *
 * This is the "all years" view: one observation per company per year, which
 * is the honest way to answer "what does a random pick in a random year look
 * like" rather than betting the whole argument on one flattering year.
 */
export function pooledConstituentReturns(): number[] {
  const out: number[] = [];
  for (const row of constituentRows) {
    for (const r of row.returns) {
      if (r !== null && r !== undefined) out.push(r);
    }
  }
  return out;
}

/** Pooled, but keeping company identity — used by the roulette grid. */
export function pooledConstituents(): Constituent[] {
  const out: Constituent[] = [];
  for (const row of constituentRows) {
    for (let i = 0; i < row.returns.length; i++) {
      const r = row.returns[i];
      if (r === null || r === undefined) continue;
      out.push({
        symbol: row.symbol,
        name: `${row.name} · ${allConstituentYears[i]}`,
        sector: row.sector,
        return: r,
      });
    }
  }
  return out;
}

export function statsForYear(year: number): YearStat | undefined {
  return perYearStats.find((s) => s.year === year);
}

export const pooledStats = constituentsDerived.pooled as {
  observations: number;
  positive: number;
  positiveShare: number;
  meanReturn: number;
  medianReturn: number;
};

export const drawdowns = drawdownsJson.data as Drawdown[];
export const drawdownsMeta = meta(drawdownsJson);
export const drawdownsDataEnds = drawdownsJson.dataEnds;

export const casinoGames = casinoJson.data as CasinoGame[];
export const casinoMeta = meta(casinoJson);

/** Pooled constituent returns — the default input to portfolio simulations. */
export const constituentReturns = pooledConstituentReturns();

/** Plain array of annual index returns. */
export const annualReturnValues = annualReturns.map((a) => a.return);

export function findGame(name: string): CasinoGame | undefined {
  return casinoGames.find((g) => g.game === name);
}

/** Named games the interactives reference directly. */
export const AMERICAN_ROULETTE_EDGE =
  findGame("American roulette")?.houseEdge ?? 0.0526;
export const EUROPEAN_ROULETTE_EDGE =
  findGame("European roulette")?.houseEdge ?? 0.027;
export const BLACKJACK_EDGE =
  findGame("Blackjack — basic strategy")?.houseEdge ?? 0.0028;
