"use client";

import { useId, useState } from "react";

type Props = {
  question: string;
  /** Unit suffix shown next to the value, e.g. "%". */
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  initial?: number;
  /** The true value, revealed once the reader commits. */
  answer: number;
  /** How to phrase the answer, e.g. (n) => `${n.toFixed(1)}%`. */
  format?: (n: number) => string;
  /** Called with the reader's guess when they lock it in. */
  onCommit?: (guess: number) => void;
  children?: React.ReactNode;
};

/**
 * The Predict beat of the page rhythm.
 *
 * The reader commits to a number before seeing the data. This is the step that
 * turns a statistic into a belief update rather than a fact skimmed — being
 * wrong about a number you just committed to is what makes it stick.
 *
 * The guess persists after reveal so it can be drawn as a marker on the
 * result, and the gate is skippable for anyone who would rather just look.
 */
export function PredictionGate({
  question,
  unit = "%",
  min = 0,
  max = 100,
  step = 1,
  initial = 50,
  answer,
  format = (n) => `${n.toFixed(0)}${unit}`,
  onCommit,
  children,
}: Props) {
  const [guess, setGuess] = useState(initial);
  const [committed, setCommitted] = useState(false);
  const id = useId();

  const error = Math.abs(guess - answer);
  const verdict =
    error <= (max - min) * 0.03
      ? "That is close."
      : error <= (max - min) * 0.1
        ? "Not far off."
        : "That is some way off.";

  function commit() {
    setCommitted(true);
    onCommit?.(guess);
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-widest text-text-subtle">
        Before you look
      </p>
      <label htmlFor={id} className="measure mt-2 block text-base">
        {question}
      </label>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={guess}
          disabled={committed}
          onChange={(e) => setGuess(Number(e.target.value))}
          aria-valuetext={format(guess)}
          className="h-11 w-full cursor-pointer accent-[var(--market)] disabled:cursor-default sm:flex-1"
        />
        <output
          htmlFor={id}
          className="tabular shrink-0 text-2xl text-text sm:w-28 sm:text-right"
        >
          {format(guess)}
        </output>
      </div>

      {!committed ? (
        <button
          type="button"
          onClick={commit}
          className="mt-5 min-h-11 rounded-md bg-text px-5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Lock it in
        </button>
      ) : (
        <div
          className="mt-5 border-t border-border pt-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-subtle">
                You said
              </p>
              <p className="tabular mt-1 text-xl text-text-muted">
                {format(guess)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-text-subtle">
                Actual
              </p>
              <p className="tabular mt-1 text-xl text-text">{format(answer)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-text-subtle">
                Out by
              </p>
              <p className="tabular mt-1 text-xl text-text-muted">
                {format(error)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-text-muted">{verdict}</p>
          {children}
        </div>
      )}
    </div>
  );
}
