"use client";

import { scaleLinear } from "d3-scale";
import { line as d3line } from "d3-shape";

export type Series = {
  label: string;
  color: string;
  points: readonly { x: number; y: number }[];
  /** Dashed lines read as "modelled" or "counterfactual". */
  dashed?: boolean;
};

type Props = {
  series: readonly Series[];
  height?: number;
  formatX?: (n: number) => string;
  formatY?: (n: number) => string;
  ariaLabel: string;
  /** Draw a horizontal rule at this y value (usually 0 or the starting stake). */
  baseline?: number;
  yFromZero?: boolean;
};

/**
 * Multi-series line chart used by the compounding, attrition and
 * holding-period interactives.
 *
 * Series are distinguished by colour AND by dash pattern AND by an explicit
 * legend, so the chart is readable without colour perception.
 */
export function Curves({
  series,
  height = 260,
  formatX = (n) => String(n),
  formatY = (n) => String(n),
  ariaLabel,
  baseline,
  yFromZero = false,
}: Props) {
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return null;

  const width = 720;
  const pad = { top: 16, right: 16, bottom: 32, left: 56 };

  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const yMin = yFromZero ? Math.min(0, ...ys) : Math.min(...ys);
  const yMax = Math.max(...ys);

  const x = scaleLinear()
    .domain([Math.min(...xs), Math.max(...xs)])
    .range([pad.left, width - pad.right]);
  const y = scaleLinear()
    .domain([yMin, yMax])
    .nice()
    .range([height - pad.bottom, pad.top]);

  const path = d3line<{ x: number; y: number }>()
    .x((p) => x(p.x))
    .y((p) => y(p.y));

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={ariaLabel}
      >
        {y.ticks(5).map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={pad.left - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize={11}
              className="fill-text-subtle"
            >
              {formatY(t)}
            </text>
          </g>
        ))}

        {baseline !== undefined && baseline >= yMin && baseline <= yMax && (
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={y(baseline)}
            y2={y(baseline)}
            className="stroke-text-subtle"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        {series.map((s, i) => (
          <path
            key={s.label}
            // `pathLength=1` normalises the dash maths so the draw-in animation
            // takes the same time regardless of the real path length.
            pathLength={s.dashed ? undefined : 1}
            className={s.dashed ? undefined : "animate-draw"}
            style={
              s.dashed ? undefined : { animationDelay: `${i * 140}ms` }
            }
            d={path(s.points as { x: number; y: number }[]) ?? undefined}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeDasharray={s.dashed ? "5 4" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {x.ticks(6).map((t) => (
          <text
            key={t}
            x={x(t)}
            y={height - 10}
            textAnchor="middle"
            fontSize={11}
            className="fill-text-subtle"
          >
            {formatX(t)}
          </text>
        ))}
      </svg>

      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-2 text-xs text-text-muted">
            <svg width="18" height="8" aria-hidden="true">
              <line
                x1="0"
                y1="4"
                x2="18"
                y2="4"
                stroke={s.color}
                strokeWidth="2"
                strokeDasharray={s.dashed ? "4 3" : undefined}
              />
            </svg>
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
