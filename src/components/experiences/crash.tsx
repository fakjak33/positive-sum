"use client";

import { useState } from "react";
import { drawdowns, drawdownsMeta, drawdownsDataEnds } from "@/lib/data";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DataTable } from "@/components/ui/data-table";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const yrs = (m: number | null) => (m === null ? "—" : `${(m / 12).toFixed(1)} years`);

/**
 * The Crash Simulator.
 *
 * Walks real drawdown episodes decision by decision. The episodes are computed
 * from the Shiller series in REAL terms — recovering nominally is not
 * recovering in purchasing power, and the nominal figures usually quoted are
 * therefore optimistic.
 *
 * Episodes still open when the data ends are labelled as censored rather than
 * shown as markets that never came back.
 */
export function Crash() {
  const completed = drawdowns.filter((d) => !d.openAtEndOfData);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"hold" | "sell" | null>(null);

  const episode = completed[index];

  return (
    <ExperienceFrame
      title="Live through it"
      intro="Every 20%+ real decline in the US market since 1871, measured in purchasing power rather than headline index points."
      datasets={[drawdownsMeta]}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a crash">
        {completed.map((d, i) => (
          <button
            key={d.peakDate}
            type="button"
            onClick={() => {
              setIndex(i);
              setChoice(null);
            }}
            aria-pressed={index === i}
            className={`min-h-11 rounded-md border px-3 text-sm transition-colors ${
              index === i
                ? "border-text bg-text text-bg"
                : "border-border text-text-muted hover:bg-surface-raised hover:text-text"
            }`}
          >
            {d.peakDate.slice(0, 4)}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="text-xs uppercase tracking-widest text-text-subtle">
          Peaked {episode.peakDate.slice(0, 7)}
        </p>
        <p className="tabular mt-2 text-4xl text-loss">
          <span aria-hidden="true">▼</span> {pct(episode.depth)}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Took {episode.monthsToTrough} months to reach the bottom in{" "}
          {episode.troughDate.slice(0, 7)}.
        </p>

        {choice === null ? (
          <div className="mt-6">
            <p className="text-sm text-text">
              You are at the bottom. Your portfolio has lost {pct(episode.depth)}{" "}
              of its purchasing power. What do you do?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setChoice("hold")}
                className="min-h-11 rounded-md bg-text px-5 text-sm font-medium text-bg hover:opacity-90"
              >
                Hold
              </button>
              <button
                type="button"
                onClick={() => setChoice("sell")}
                className="min-h-11 rounded-md border border-border px-5 text-sm text-text-muted hover:bg-surface-raised hover:text-text"
              >
                Sell and wait
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t border-border pt-5" role="status">
            <p className="text-sm text-text">
              It took{" "}
              <span className="tabular">{yrs(episode.monthsToRecover)}</span>{" "}
              from the peak to get back to even in real terms, recovering in{" "}
              {episode.recoveryDate?.slice(0, 7)}.
            </p>
            <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
              {choice === "hold"
                ? "Holding worked — eventually. Whether that was the right decision depends entirely on whether you needed the money during those years, which is the part a simulation cannot tell you."
                : "Selling locked in the loss. But note that this is only obviously wrong in hindsight: at the bottom, nobody knew there was a bottom, and the recovery took long enough that plenty of people who sold never lived to see it."}
            </p>
          </div>
        )}
      </div>

      <DataTable
        caption={`Real (inflation-adjusted) US equity drawdowns of 20% or more, price index, monthly resolution. Data ends ${drawdownsDataEnds}.`}
        columns={["Peak", "Trough", "Depth", "To trough", "To recover"]}
        rows={drawdowns.map((d) => [
          d.peakDate.slice(0, 7),
          d.troughDate.slice(0, 7),
          pct(d.depth),
          `${d.monthsToTrough} mo`,
          d.openAtEndOfData ? "still open at end of data" : yrs(d.monthsToRecover),
        ])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          The casino parallel is chasing losses: a realised decline creates
          pressure to act, and acting under that pressure usually makes things
          worse. That behavioural driver is genuinely shared.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">
            Where it breaks down is more important.
          </span>{" "}
          A casino loss is final the moment the wheel stops. A drawdown is only
          realised if you sell. And &ldquo;it always comes back&rdquo; is not a
          complete answer when coming back took 29 years — that is not a market
          cycle, it is most of a working life.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-subtle">
          These figures are deliberately harsher than the ones usually quoted.
          They are inflation-adjusted and exclude dividends, so they measure
          what actually happened to purchasing power. Including dividends would
          shorten every recovery here substantially.
        </p>
      </div>
    </ExperienceFrame>
  );
}
