"use client";

import { useState } from "react";
import { ExperienceFrame } from "@/components/ui/experience-frame";
import { annualDerived, constituentsDerived, constituentsYear } from "@/lib/data";

type Question = {
  id: string;
  prompt: string;
  answer: number;
  unit: string;
  explain: string;
  source: string;
};

const QUESTIONS: Question[] = [
  {
    id: "negative-lifetime",
    prompt:
      "What share of all US stocks since 1925 lost money over their entire listed life?",
    answer: 51.6,
    unit: "%",
    explain:
      "Just over half. The median stock is not a good investment — the market's returns come from a minority of firms.",
    source: "Bessembinder (2024), 29,078 stocks, 1925–2023",
  },
  {
    id: "spiva-15",
    prompt:
      "What share of US large-cap funds underperformed the S&P 500 over 15 years?",
    answer: 89.5,
    unit: "%",
    explain:
      "Roughly nine in ten, net of fees. Note this uses a survivor-bias-free database, so funds that closed are counted.",
    source: "SPIVA U.S. Scorecard, to 31 December 2024",
  },
  {
    id: "positive-years",
    prompt:
      "What share of calendar years since 1928 did the S&P 500 finish positive?",
    answer: Math.round((annualDerived.positiveShare ?? 0.735) * 1000) / 10,
    unit: "%",
    explain:
      "About three years in four — nominal, total return including dividends. Most people guess considerably lower.",
    source: "Computed from the NYU Stern / Damodaran dataset",
  },
  {
    id: "constituents-positive",
    prompt: `What share of S&P 500 companies finished ${constituentsYear} positive?`,
    answer:
      Math.round((constituentsDerived.positiveShare ?? 0.65) * 1000) / 10,
    unit: "%",
    explain:
      "This moves a great deal year to year. The current-membership list is also survivorship-biased, which flatters it.",
    source: `Computed from real ${constituentsYear} constituent returns`,
  },
  {
    id: "roulette",
    prompt:
      "On American roulette, what is your chance of winning a single red-or-black bet?",
    answer: 47.4,
    unit: "%",
    explain:
      "18 of 38 pockets. The two green zeros are the entire business model — they turn a coin flip into a 5.26% edge.",
    source: "Wizard of Odds house edge tables",
  },
  {
    id: "day-traders",
    prompt:
      "What share of Taiwanese day traders were predictably profitable after fees?",
    answer: 1,
    unit: "%",
    explain:
      "Under 1%, from complete exchange records rather than self-reported results. Three-year survival was 15%.",
    source: "Barber, Lee, Liu & Odean, Taiwan, 1992–2006",
  },
  {
    id: "lottery",
    prompt: "What share of state lottery ticket revenue comes back as prizes?",
    answer: 55,
    unit: "%",
    explain:
      "Around 50–60%, an effective house edge near 45% — far worse than any casino game, and the one most heavily promoted by governments.",
    source: "Matheson & Grote (2004)",
  },
];

/**
 * Guess the Odds.
 *
 * Commit before the reveal. Prediction-then-feedback is what turns a statistic
 * into a belief update rather than a fact skimmed, and the running calibration
 * score makes miscalibration measurable rather than merely felt.
 */
export function GuessOdds() {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState(50);
  const [revealed, setRevealed] = useState(false);
  const [errors, setErrors] = useState<number[]>([]);

  const q = QUESTIONS[i];
  const error = Math.abs(guess - q.answer);
  const done = i >= QUESTIONS.length - 1 && revealed;

  function reveal() {
    setRevealed(true);
    setErrors((e) => [...e, error]);
  }

  function next() {
    setI((n) => n + 1);
    setGuess(50);
    setRevealed(false);
  }

  function restart() {
    setI(0);
    setGuess(50);
    setRevealed(false);
    setErrors([]);
  }

  const avgError =
    errors.length > 0 ? errors.reduce((a, b) => a + b, 0) / errors.length : 0;

  return (
    <ExperienceFrame
      title={`Question ${i + 1} of ${QUESTIONS.length}`}
      intro="Commit to a number before you see the answer. Being wrong about a figure you have just committed to is what makes it stick."
    >
      <p className="measure text-lg">{q.prompt}</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={guess}
          disabled={revealed}
          onChange={(e) => setGuess(Number(e.target.value))}
          aria-label={q.prompt}
          aria-valuetext={`${guess}${q.unit}`}
          className="h-11 w-full cursor-pointer accent-[var(--market)] disabled:cursor-default sm:flex-1"
        />
        <span className="tabular shrink-0 text-3xl sm:w-28 sm:text-right">
          {guess.toFixed(1)}
          {q.unit}
        </span>
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={reveal}
          className="mt-6 min-h-11 rounded-md bg-text px-6 text-sm font-medium text-bg hover:opacity-90"
        >
          Lock it in
        </button>
      ) : (
        <div className="mt-6 border-t border-border pt-5" role="status" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-subtle">
                You said
              </p>
              <p className="tabular mt-1 text-2xl text-text-muted">
                {guess.toFixed(1)}
                {q.unit}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-text-subtle">
                Actual
              </p>
              <p className="tabular mt-1 text-2xl text-market">
                {q.answer}
                {q.unit}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-text-subtle">
                Out by
              </p>
              <p
                className={`tabular mt-1 text-2xl ${error < 5 ? "text-gain" : error < 15 ? "text-text-muted" : "text-loss"}`}
              >
                {error.toFixed(1)}
              </p>
            </div>
          </div>

          <p className="measure mt-4 text-sm leading-relaxed text-text-muted">
            {q.explain}
          </p>
          <p className="mt-2 text-xs text-text-subtle">{q.source}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            {i < QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="min-h-11 rounded-md bg-text px-5 text-sm font-medium text-bg hover:opacity-90"
              >
                Next question
              </button>
            ) : (
              <button
                type="button"
                onClick={restart}
                className="min-h-11 rounded-md border border-border px-5 text-sm text-text-muted hover:bg-surface-raised hover:text-text"
              >
                Start again
              </button>
            )}
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-bg p-5">
          <p className="text-xs uppercase tracking-widest text-text-subtle">
            Your calibration so far
          </p>
          <p className="tabular mt-2 text-2xl text-text">
            {avgError.toFixed(1)} points off on average
          </p>
          {done && (
            <p className="measure mt-3 text-sm leading-relaxed text-text-muted">
              {avgError < 8
                ? "Well calibrated. You already had a realistic picture of these base rates, which is rarer than it sounds."
                : avgError < 20
                  ? "About typical. Most people are systematically off on these, usually in the direction that makes stock picking look more attractive than it is."
                  : "A long way off — which is the useful result. These base rates are not intuitive, and confidence about them is not the same as knowledge of them."}
            </p>
          )}
        </div>
      )}
    </ExperienceFrame>
  );
}
