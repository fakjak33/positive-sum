/**
 * Data preparation for Positive Sum.
 *
 * Run with:  node scripts/prepare-data.mjs
 *
 * Fetches, normalises and writes every dataset the app uses into /data as
 * committed JSON, each with a provenance header naming its source URL and the
 * date it was retrieved. Committing the output keeps the build reproducible
 * and lets the app work fully offline.
 *
 * Sourcing rules (docs/01-research-corpus.md):
 *   - Public sources only. Nothing behind a bot-detection challenge.
 *   - Derived figures (drawdowns, hit rates) are COMPUTED here from the raw
 *     series rather than transcribed from a secondary summary, so the app can
 *     show its working.
 *   - Every file records what it is, where it came from, and what its
 *     limitations are.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data");
const RETRIEVED = new Date().toISOString().slice(0, 10);

const UA = "Mozilla/5.0 (compatible; positive-sum-dataprep/1.0)";

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function getText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

async function write(name, payload) {
  await mkdir(DATA, { recursive: true });
  await writeFile(join(DATA, name), JSON.stringify(payload, null, 2) + "\n");
  const n = Array.isArray(payload.data) ? payload.data.length : "—";
  console.log(`  wrote data/${name}  (${n} rows)`);
}

// ===================================================================
// 1. Annual S&P 500 total returns, 1928–2025
// ===================================================================
// Transcribed from NYU Stern (Damodaran), the standard academic source for
// long-run US equity returns. Nominal, total return including dividends,
// pre-tax and pre-fee — all four qualifiers matter and travel with the data.
const DAMODARAN_ANNUAL = [
  [1928, 43.81], [1929, -8.3], [1930, -25.12], [1931, -43.84], [1932, -8.64],
  [1933, 49.98], [1934, -1.19], [1935, 46.74], [1936, 31.94], [1937, -35.34],
  [1938, 29.28], [1939, -1.1], [1940, -10.67], [1941, -12.77], [1942, 19.17],
  [1943, 25.06], [1944, 19.03], [1945, 35.82], [1946, -8.43], [1947, 5.2],
  [1948, 5.7], [1949, 18.3], [1950, 30.81], [1951, 23.68], [1952, 18.15],
  [1953, -1.21], [1954, 52.56], [1955, 32.6], [1956, 7.44], [1957, -10.46],
  [1958, 43.72], [1959, 12.06], [1960, 0.34], [1961, 26.64], [1962, -8.81],
  [1963, 22.61], [1964, 16.42], [1965, 12.4], [1966, -9.97], [1967, 23.8],
  [1968, 10.81], [1969, -8.24], [1970, 3.56], [1971, 14.22], [1972, 18.76],
  [1973, -14.31], [1974, -25.9], [1975, 37.0], [1976, 23.83], [1977, -6.98],
  [1978, 6.51], [1979, 18.52], [1980, 31.74], [1981, -4.7], [1982, 20.42],
  [1983, 22.34], [1984, 6.15], [1985, 31.24], [1986, 18.49], [1987, 5.81],
  [1988, 16.54], [1989, 31.48], [1990, -3.06], [1991, 30.23], [1992, 7.49],
  [1993, 9.97], [1994, 1.33], [1995, 37.2], [1996, 22.68], [1997, 33.1],
  [1998, 28.34], [1999, 20.89], [2000, -9.03], [2001, -11.85], [2002, -21.97],
  [2003, 28.36], [2004, 10.74], [2005, 4.83], [2006, 15.61], [2007, 5.48],
  [2008, -36.55], [2009, 25.94], [2010, 14.82], [2011, 2.1], [2012, 15.89],
  [2013, 32.15], [2014, 13.52], [2015, 1.38], [2016, 11.77], [2017, 21.61],
  [2018, -4.23], [2019, 31.21], [2020, 18.02], [2021, 28.47], [2022, -18.04],
  [2023, 26.06], [2024, 24.88], [2025, 17.78],
];

async function buildAnnual() {
  console.log("Annual returns (NYU Stern / Damodaran)…");
  const data = DAMODARAN_ANNUAL.map(([year, pct]) => ({ year, return: pct / 100 }));

  const positive = data.filter((d) => d.return > 0).length;
  const best = data.reduce((a, b) => (b.return > a.return ? b : a));
  const worst = data.reduce((a, b) => (b.return < a.return ? b : a));

  await write("sp500-annual.json", {
    name: "S&P 500 annual total returns",
    source: "NYU Stern School of Business — Aswath Damodaran historical returns dataset",
    sourceUrl:
      "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
    retrieved: RETRIEVED,
    units: "decimal fraction (0.1 = +10%)",
    assumptions: [
      "Nominal, not inflation-adjusted",
      "Total return including reinvested dividends",
      "Pre-tax and pre-fee",
      "US market only — this is itself a survivorship-biased sample of world equity markets",
    ],
    derived: {
      years: data.length,
      positiveYears: positive,
      positiveShare: positive / data.length,
      bestYear: best,
      worstYear: worst,
    },
    data,
  });
  console.log(
    `    ${positive}/${data.length} positive years (${((positive / data.length) * 100).toFixed(1)}%)`
  );
}

// ===================================================================
// 2. Daily S&P 500 price index, 1995–present
// ===================================================================
// Used by the "missing the best days" interactive, which needs daily
// granularity. This is a PRICE index — no dividends — and the app says so.
async function buildDaily() {
  console.log("Daily S&P 500 price index (Yahoo Finance)…");
  const p1 = Math.floor(Date.UTC(1995, 6, 1) / 1000);
  const p2 = Math.floor(Date.now() / 1000);
  const j = await getJSON(
    `https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?period1=${p1}&period2=${p2}&interval=1d`
  );
  const r = j.chart.result[0];
  const closes = r.indicators.adjclose?.[0]?.adjclose ?? r.indicators.quote[0].close;

  const rows = [];
  for (let i = 0; i < r.timestamp.length; i++) {
    const c = closes[i];
    if (c == null) continue;
    rows.push({
      date: new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10),
      close: Number(c.toFixed(2)),
    });
  }

  await write("sp500-daily.json", {
    name: "S&P 500 daily closing level",
    source: "Yahoo Finance chart API, ^GSPC",
    sourceUrl: "https://finance.yahoo.com/quote/%5EGSPC/",
    retrieved: RETRIEVED,
    units: "index level",
    assumptions: [
      "PRICE index — excludes dividends, so long-run returns computed from it understate total return by roughly 2% a year",
      "Trading days only",
      "Chosen to span the Hartford Funds window (1 July 1995 onwards) so their published figure can be checked against real data",
    ],
    data: rows,
  });
}

// ===================================================================
// 3. Shiller monthly series, 1871–present (with CPI)
// ===================================================================
// The CPI column is what makes this valuable: it is the only way to show
// inflation-adjusted holding-period results, which is the honest correction
// to the "no negative 20-year period" claim.
async function buildShiller() {
  console.log("Shiller monthly series with CPI…");
  const csv = await getText(
    "https://raw.githubusercontent.com/datasets/s-and-p-500/main/data/data.csv"
  );
  const lines = csv.trim().split(/\r?\n/);
  const head = lines[0].split(",");
  const iDate = head.indexOf("Date");
  const iP = head.indexOf("SP500");
  const iD = head.indexOf("Dividend");
  const iCPI = head.indexOf("Consumer Price Index");

  const rows = [];
  for (const line of lines.slice(1)) {
    const c = line.split(",");
    const price = Number(c[iP]);
    const cpi = Number(c[iCPI]);
    const div = Number(c[iD]);
    // Trailing rows in this dataset are forward-filled placeholders with
    // zeroed CPI/dividend fields. Drop anything without a usable CPI.
    if (!price || !cpi) continue;
    rows.push({
      date: c[iDate],
      price: Number(price.toFixed(2)),
      dividend: Number.isFinite(div) ? Number(div.toFixed(3)) : null,
      cpi: Number(cpi.toFixed(3)),
    });
  }

  await write("sp500-monthly.json", {
    name: "S&P 500 monthly price, dividend and CPI",
    source:
      "Robert J. Shiller, Yale University — 'Irrational Exuberance' long-run dataset, via the Datahub curated mirror",
    sourceUrl: "http://www.econ.yale.edu/~shiller/data.htm",
    mirrorUrl: "https://github.com/datasets/s-and-p-500",
    retrieved: RETRIEVED,
    units: "index level; dividend in index points per year; CPI 1982-84 = 100",
    dataEnds: rows[rows.length - 1].date,
    assumptions: [
      "Monthly averages of daily closes, not month-end values",
      "The CPI column enables real (inflation-adjusted) return calculations — this is the only dataset here that supports that, and it is what makes the honest version of the long-horizon argument possible",
      "Pre-1957 the 'S&P 500' is a backfilled reconstruction of a narrower index",
      "Rows are truncated at the last month with a usable CPI value, so this series ends earlier than the daily file. Use sp500-daily.json for recent history",
    ],
    data: rows,
  });
}

// ===================================================================
// 4. S&P 500 constituent calendar-year returns
// ===================================================================
// Powers the roulette interactive: 500 real companies, real outcomes.
async function buildConstituents(year) {
  console.log(`Constituent ${year} calendar-year returns…`);

  const csv = await getText(
    "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv"
  );
  const lines = csv.trim().split(/\r?\n/);
  const head = lines[0].split(",");
  const iSym = head.indexOf("Symbol");
  const iName = head.indexOf("Security");
  const iSector = head.indexOf("GICS Sector");

  // Handle quoted commas inside company names.
  const splitCsv = (line) =>
    line.match(/("([^"]*)")|([^,]+)|(?<=,)(?=,)/g)?.map((s) =>
      s.replace(/^"|"$/g, "")
    ) ?? [];

  const members = lines.slice(1).map((l) => {
    const c = splitCsv(l);
    return { symbol: c[iSym], name: c[iName], sector: c[iSector] };
  }).filter((m) => m.symbol);

  console.log(`    ${members.length} constituents listed`);

  const p1 = Math.floor(Date.UTC(year - 1, 11, 1) / 1000);
  const p2 = Math.floor(Date.UTC(year + 1, 0, 15) / 1000);

  const out = [];
  const failed = [];
  const CONCURRENCY = 6;

  async function fetchOne(m) {
    const sym = m.symbol.replace(/\./g, "-"); // BRK.B -> BRK-B on Yahoo
    try {
      const j = await getJSON(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?period1=${p1}&period2=${p2}&interval=1mo`
      );
      const r = j.chart.result?.[0];
      if (!r) throw new Error("no result");
      const closes = r.indicators.adjclose?.[0]?.adjclose ?? [];
      const stamps = r.timestamp ?? [];

      // Last close of the prior December, and last close of the target year.
      let start = null;
      let end = null;
      for (let i = 0; i < stamps.length; i++) {
        if (closes[i] == null) continue;
        const d = new Date(stamps[i] * 1000);
        const y = d.getUTCFullYear();
        const mo = d.getUTCMonth();
        if (y === year - 1 && mo === 11) start = closes[i];
        if (y === year) end = closes[i];
      }
      if (start == null || end == null || start <= 0) throw new Error("incomplete");

      out.push({
        symbol: m.symbol,
        name: m.name,
        sector: m.sector,
        return: Number(((end - start) / start).toFixed(4)),
      });
    } catch {
      failed.push(m.symbol);
    }
  }

  for (let i = 0; i < members.length; i += CONCURRENCY) {
    await Promise.all(members.slice(i, i + CONCURRENCY).map(fetchOne));
    if (i % 60 === 0) process.stdout.write(`    …${i}/${members.length}\r`);
  }

  out.sort((a, b) => b.return - a.return);
  const positive = out.filter((d) => d.return > 0).length;
  const median = out.length
    ? out[Math.floor(out.length / 2)].return
    : null;
  const mean = out.reduce((s, d) => s + d.return, 0) / (out.length || 1);

  console.log(
    `\n    ${out.length} resolved, ${failed.length} unavailable; ${positive} positive (${((positive / out.length) * 100).toFixed(1)}%)`
  );

  await write("constituents-year.json", {
    name: `S&P 500 constituent total returns, calendar ${year}`,
    source: "Yahoo Finance chart API; constituent list from the Datahub S&P 500 companies dataset",
    sourceUrl: "https://github.com/datasets/s-and-p-500-companies",
    retrieved: RETRIEVED,
    year,
    units: "decimal fraction (0.1 = +10%)",
    assumptions: [
      "Adjusted closes, so dividends and splits are included",
      "Membership is the CURRENT index, applied retrospectively — this is a survivorship bias, and it makes the results look BETTER than the true historical cross-section because companies removed from the index are missing",
      "Return measured from the last monthly close of the prior December to the last monthly close of the year",
      `${failed.length} symbols could not be resolved and are excluded`,
    ],
    derived: {
      count: out.length,
      positive,
      positiveShare: out.length ? positive / out.length : null,
      medianReturn: median,
      meanReturn: Number(mean.toFixed(4)),
      unresolved: failed,
    },
    data: out,
  });
}

// ===================================================================
// 5. Drawdowns — COMPUTED from the monthly series, not transcribed
// ===================================================================
async function buildDrawdowns() {
  console.log("Major drawdowns (computed from the Shiller monthly series)…");
  const { readFile } = await import("node:fs/promises");
  const monthly = JSON.parse(
    await readFile(join(DATA, "sp500-monthly.json"), "utf8")
  ).data;

  // Real (inflation-adjusted) price path: the honest basis for "how long did
  // it take to recover", since recovering nominally is not recovering.
  const base = monthly[monthly.length - 1].cpi;
  const series = monthly.map((m) => ({
    date: m.date,
    real: (m.price * base) / m.cpi,
  }));

  const episodes = [];
  let peak = series[0];
  let trough = series[0];
  let inDrawdown = false;

  for (const pt of series) {
    if (pt.real >= peak.real) {
      if (inDrawdown) {
        const depth = trough.real / peak.real - 1;
        if (depth <= -0.2) {
          episodes.push({
            peakDate: peak.date,
            troughDate: trough.date,
            recoveryDate: pt.date,
            depth: Number(depth.toFixed(4)),
            monthsToTrough: monthsBetween(peak.date, trough.date),
            monthsToRecover: monthsBetween(peak.date, pt.date),
          });
        }
      }
      peak = pt;
      trough = pt;
      inDrawdown = false;
    } else {
      inDrawdown = true;
      if (pt.real < trough.real) trough = pt;
    }
  }
  // A drawdown still open when the data ends is CENSORED, not unrecovered.
  // Emitting it as `recoveryDate: null` alongside the completed episodes would
  // imply the market never came back, when in fact we simply stopped looking.
  // It is flagged so the UI can label it rather than rank it.
  if (inDrawdown) {
    const depth = trough.real / peak.real - 1;
    if (depth <= -0.2) {
      episodes.push({
        peakDate: peak.date,
        troughDate: trough.date,
        recoveryDate: null,
        depth: Number(depth.toFixed(4)),
        monthsToTrough: monthsBetween(peak.date, trough.date),
        monthsToRecover: null,
        openAtEndOfData: true,
      });
    }
  }

  episodes.sort((a, b) => a.depth - b.depth);

  const dataEnds = monthly[monthly.length - 1].date;

  await write("drawdowns.json", {
    name: "S&P 500 real drawdowns of 20% or more",
    source: "Computed from data/sp500-monthly.json (Shiller)",
    sourceUrl: "http://www.econ.yale.edu/~shiller/data.htm",
    retrieved: RETRIEVED,
    dataEnds,
    assumptions: [
      "REAL (inflation-adjusted) price index — recovering in nominal terms is not recovering in purchasing power, and the nominal figures commonly quoted are therefore optimistic",
      "Price only, excluding dividends — including dividends would shorten every recovery substantially",
      "Monthly resolution, so short sharp declines such as 1987 and 2020 are understated or missed entirely",
      "A drawdown is counted from a running peak to the first month that exceeds it",
      `The CPI series in this dataset ends ${dataEnds}. Any episode marked openAtEndOfData is censored by that cutoff, NOT a market that failed to recover — the 2021 episode in particular had recovered in nominal terms well before this dataset ends`,
    ],
    data: episodes,
  });
  console.log(`    ${episodes.length} episodes of 20%+ real drawdown`);
}

function monthsBetween(a, b) {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

// ===================================================================
// 6. Casino game expectancy
// ===================================================================
async function buildCasino() {
  console.log("Casino house edge table…");
  const data = [
    { game: "Craps — free odds", houseEdge: 0.0, stdDev: 1.0, note: "The only bet in a casino with zero expected loss; it must be backed by a pass line bet that does carry an edge." },
    { game: "Blackjack — basic strategy", houseEdge: 0.0028, stdDev: 1.15, note: "Liberal Vegas rules with perfect basic strategy. Typical real play is several times worse." },
    { game: "Baccarat — banker", houseEdge: 0.0106, stdDev: 0.93 },
    { game: "Craps — pass line", houseEdge: 0.0141, stdDev: 1.0 },
    { game: "Baccarat — player", houseEdge: 0.0124, stdDev: 1.0 },
    { game: "European roulette", houseEdge: 0.027, stdDev: 0.99, note: "Single zero." },
    { game: "American roulette", houseEdge: 0.0526, stdDev: 0.99, note: "Double zero. The extra pocket nearly doubles the edge." },
    { game: "Slot machines", houseEdge: 0.08, stdDev: 8.0, note: "Ranges from about 2% to 15% depending on machine and jurisdiction; 8% is a mid-range illustration." },
    { game: "Baccarat — tie", houseEdge: 0.1436, stdDev: 2.64 },
    { game: "Keno", houseEdge: 0.27, stdDev: 10.0, note: "Ranges 25–29%." },
    { game: "State lottery", houseEdge: 0.45, stdDev: 100.0, note: "Prizes are typically 50–60% of ticket revenue. Sourced separately from Matheson & Grote, not from the Wizard of Odds table." },
  ];

  await write("casino-games.json", {
    name: "Casino game house edge and volatility",
    source: "Wizard of Odds house edge tables; state lottery figure from Matheson & Grote (2004)",
    sourceUrl: "https://wizardofodds.com/gambling/house-edge/",
    lotterySourceUrl: "https://web.williams.edu/Economics/wp/mathesonlottery.pdf",
    retrieved: RETRIEVED,
    units: "houseEdge as decimal fraction of the initial wager; stdDev per unit bet",
    assumptions: [
      "House edge is expected loss as a share of the initial wager",
      "Blackjack assumes perfect basic strategy under specific table rules",
      "Slot and keno figures are mid-range illustrations of a wide published range",
    ],
    data,
  });
}

// ===================================================================
async function main() {
  const year = Number(process.argv[2] ?? 2025);
  console.log(`\nPositive Sum — data preparation (${RETRIEVED})\n`);
  await buildAnnual();
  await buildDaily();
  await buildShiller();
  await buildDrawdowns();
  await buildCasino();
  await buildConstituents(year);
  console.log("\nDone. All datasets written to /data with provenance headers.\n");
}

main().catch((err) => {
  console.error("\nData preparation failed:", err);
  process.exit(1);
});
