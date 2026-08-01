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

export const constituents = constituentsJson.data as Constituent[];
export const constituentsMeta = meta(constituentsJson);
export const constituentsYear = constituentsJson.year;
export const constituentsDerived = constituentsJson.derived;

export const drawdowns = drawdownsJson.data as Drawdown[];
export const drawdownsMeta = meta(drawdownsJson);
export const drawdownsDataEnds = drawdownsJson.dataEnds;

export const casinoGames = casinoJson.data as CasinoGame[];
export const casinoMeta = meta(casinoJson);

/** Plain array of constituent returns, the input to the portfolio simulations. */
export const constituentReturns = constituents.map((c) => c.return);

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
