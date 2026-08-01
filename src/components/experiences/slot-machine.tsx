"use client";

import { useMemo, useState } from "react";
import { constituents, constituentsMeta, constituentsYear } from "@/lib/data";
import { mulberry32, randInt } from "@/lib/sim/random";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { DataTable } from "@/components/ui/data-table";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

/**
 * Bessembinder's top long-run performers, transcribed from the published
 * paper. The annualised column is the load-bearing one: these are not
 * jackpots, they are ordinary compounding left alone for most of a century.
 * @see https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4897069
 */
const MEGA_WINNERS = [
  { name: "Altria Group", multiple: "2,650,000×", annualised: 0.163, years: 98 },
  { name: "Vulcan Materials", multiple: "390,000×", annualised: 0.145, years: 98 },
  { name: "Kansas City Southern", multiple: "300,000×", annualised: 0.142, years: 98 },
  { name: "General Dynamics", multiple: "160,000×", annualised: 0.135, years: 98 },
  { name: "Boeing", multiple: "140,000×", annualised: 0.133, years: 98 },
];

/**
 * The 4% Jackpot.
 *
 * Spin real companies. Most are unremarkable. Occasionally the reel lands on a
 * genuine long-run compounder — and the reveal deliberately undercuts the slot
 * framing by showing that its annualised return was around 13–16%, not a
 * lightning strike.
 */
export function SlotMachine() {
  const reduced = useReducedMotion();
  const [seed, setSeed] = useState(9001);
  const [spins, setSpins] = useState(0);
  const [reels, setReels] = useState<(typeof constituents)[number][]>([]);
  const [jackpot, setJackpot] = useState<(typeof MEGA_WINNERS)[number] | null>(
    null
  );
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  // Bessembinder: about 4% of firms produced all the net wealth creation.
  const JACKPOT_ODDS = 0.04;

  const rng = useMemo(() => mulberry32(seed + spins), [seed, spins]);

  function spin() {
    const next = [
      constituents[randInt(rng, constituents.length)],
      constituents[randInt(rng, constituents.length)],
      constituents[randInt(rng, constituents.length)],
    ];
    const hit = rng() < JACKPOT_ODDS;

    const apply = () => {
      setReels(next);
      setJackpot(hit ? MEGA_WINNERS[randInt(mulberry32(seed + spins + 7), MEGA_WINNERS.length)] : null);
      setHistory((h) => [...h, next[0].return].slice(-40));
      setSpinning(false);
      setSpins((s) => s + 1);
    };

    if (reduced) {
      apply();
    } else {
      setSpinning(true);
      setTimeout(apply, 500);
    }
  }

  const wins = history.filter((r) => r > 0).length;

  return (
    <ExperienceFrame
      title="Pull the handle"
      intro={`Each reel is a real S&P 500 company and its actual ${constituentsYear} return. Roughly one spin in twenty-five lands on one of the rare long-run compounders that Bessembinder found account for all of the market's net wealth creation.`}
      datasets={[constituentsMeta]}
      seed={seed}
      onReseed={() => {
        setSeed((s) => s + 1);
        setSpins(0);
        setReels([]);
        setJackpot(null);
        setHistory([]);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        {[0, 1, 2].map((i) => {
          const c = reels[i];
          return (
            <div
              key={i}
              className={`rounded-lg border p-5 text-center transition-all ${
                spinning
                  ? "border-border bg-surface-raised"
                  : jackpot && i === 1
                    ? "border-rare bg-rare/10"
                    : "border-border bg-bg"
              }`}
            >
              {spinning || !c ? (
                <p className="tabular text-2xl text-text-subtle">
                  {spinning ? "· · ·" : "—"}
                </p>
              ) : jackpot && i === 1 ? (
                <>
                  <p className="text-xs uppercase tracking-widest text-rare">
                    Long-run compounder
                  </p>
                  <p className="mt-1 text-sm text-text">{jackpot.name}</p>
                  <p className="tabular mt-1 text-2xl text-rare">
                    {jackpot.multiple}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-text-subtle">{c.symbol}</p>
                  <p
                    className={`tabular mt-1 text-2xl ${c.return > 0 ? "text-gain" : "text-loss"}`}
                  >
                    <span aria-hidden="true">{c.return > 0 ? "▲" : "▼"}</span>{" "}
                    {pct(c.return)}
                  </p>
                  <p className="mt-1 truncate text-xs text-text-subtle">
                    {c.name}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="min-h-11 rounded-md bg-text px-6 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Spin
        </button>
        <p className="tabular text-sm text-text-subtle">
          {spins} spin{spins === 1 ? "" : "s"}
          {history.length > 0 && ` · ${wins}/${history.length} up`}
        </p>
      </div>

      {jackpot && (
        <div className="mt-6 rounded-lg border border-rare/40 bg-rare/5 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-rare">
            And here is why it is not a jackpot
          </p>
          <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
            {jackpot.name} returned{" "}
            <span className="tabular text-rare">{jackpot.multiple}</span> the
            original investment. That sounds like lightning striking. It is
            actually{" "}
            <span className="tabular text-text">
              {pct(jackpot.annualised)} a year
            </span>{" "}
            for {jackpot.years} years.
          </p>
          <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
            A good return, held for a very long time. No single explosive
            moment, no lucky pull — and nothing a casino can offer, because no
            slot machine converts patience into payout.
          </p>
        </div>
      )}

      <DataTable
        caption="The highest cumulative long-run returns in the US market, 1925–2023, from Bessembinder (2024). Note the annualised column."
        columns={["Company", "Cumulative", "Annualised", "Years"]}
        rows={MEGA_WINNERS.map((m) => [
          m.name,
          m.multiple,
          pct(m.annualised),
          m.years,
        ])}
      />

      <div className="mt-6 rounded-lg border border-border bg-bg p-5">
        <p className="measure text-sm leading-relaxed text-text-muted">
          The shape really is lottery-like: 51.6% of all US stocks since 1925
          lost money over their entire listed life, and the best 4% of firms
          account for the whole market&rsquo;s net wealth creation. If you are
          picking single stocks, the median outcome is genuinely poor.
        </p>
        <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
          <span className="text-text">But the mechanism is inverted.</span> A
          slot jackpot is funded by other players&rsquo; losses and paid
          instantly. Altria&rsquo;s return was funded by selling products for a
          century, and required holding for a century. Nobody had to lose for
          that shareholder to win.
        </p>
      </div>
    </ExperienceFrame>
  );
}
