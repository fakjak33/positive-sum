"use client";

import { useId, useState } from "react";

type Props = {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly (string | number)[])[];
};

/**
 * The accessible representation of a visualisation.
 *
 * Every simulation and chart in the app renders one of these alongside it.
 * Simulation results are data; a reader using a screen reader — or anyone who
 * simply prefers numbers to pictures — gets the same information rather than
 * an alt-text summary of it.
 *
 * Hidden visually by default and revealed by a real button, so it is in the
 * accessibility tree at all times but does not double the page length.
 */
export function DataTable({ caption, columns, rows }: Props) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-expanded={visible}
        aria-controls={id}
        className="min-h-11 text-xs uppercase tracking-widest text-text-subtle underline decoration-border underline-offset-4 hover:text-text-muted"
      >
        {visible ? "Hide" : "Show"} the numbers
      </button>

      <div
        id={id}
        className={
          visible
            ? "mt-3 overflow-x-auto rounded-lg border border-border"
            : "sr-only"
        }
      >
        <table className="w-full text-left text-sm">
          <caption className="px-4 py-3 text-left text-xs text-text-muted">
            {caption}
          </caption>
          <thead>
            <tr className="border-y border-border">
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-4 py-2 text-xs font-medium uppercase tracking-widest text-text-subtle"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="tabular px-4 py-2 text-text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
