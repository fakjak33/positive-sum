"use client";

import { scaleLinear } from "d3-scale";

export type Marker = { value: number; label: string; tone?: string };

type Props = {
  bins: readonly { x0: number; x1: number; count: number }[];
  markers?: readonly Marker[];
  /** Values below this render in the loss colour. Defaults to 0. */
  zero?: number;
  height?: number;
  format?: (n: number) => string;
  ariaLabel: string;
};

/**
 * Histogram of simulated outcomes.
 *
 * Bars below zero take the loss colour, but the zero line is drawn explicitly
 * as well so the split is readable without relying on hue.
 */
export function DistributionChart({
  bins,
  markers = [],
  zero = 0,
  height = 220,
  format = (n) => `${(n * 100).toFixed(0)}%`,
  ariaLabel,
}: Props) {
  if (bins.length === 0) return null;

  const width = 720;
  const pad = { top: 12, right: 12, bottom: 28, left: 12 };

  const min = bins[0].x0;
  const max = bins[bins.length - 1].x1;
  const maxCount = Math.max(...bins.map((b) => b.count));

  const x = scaleLinear().domain([min, max]).range([pad.left, width - pad.right]);
  const y = scaleLinear()
    .domain([0, maxCount])
    .range([height - pad.bottom, pad.top]);

  const ticks = x.ticks(6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="none"
    >
      {bins.map((b, i) => {
        const bx = x(b.x0);
        const bw = Math.max(1, x(b.x1) - x(b.x0) - 1);
        const by = y(b.count);
        const bh = height - pad.bottom - by;
        const below = b.x1 <= zero;
        return (
          <rect
            key={i}
            x={bx}
            y={by}
            width={bw}
            height={Math.max(0, bh)}
            className={`animate-rise ${below ? "fill-loss" : "fill-gain"}`}
            style={{
              transformOrigin: `${bx}px ${height - pad.bottom}px`,
              animationDelay: `${Math.min(i, 44) * 12}ms`,
            }}
            opacity={0.85}
          />
        );
      })}

      {/* Zero line — the break-even point, always drawn explicitly. */}
      {zero >= min && zero <= max && (
        <line
          x1={x(zero)}
          x2={x(zero)}
          y1={pad.top}
          y2={height - pad.bottom}
          className="stroke-text-subtle"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      )}

      {markers.map((m) =>
        m.value >= min && m.value <= max ? (
          <g key={m.label}>
            <line
              x1={x(m.value)}
              x2={x(m.value)}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke={m.tone ?? "var(--market)"}
              strokeWidth={2}
            />
            <text
              x={x(m.value)}
              y={pad.top + 10}
              textAnchor="middle"
              fontSize={10}
              fill={m.tone ?? "var(--market)"}
            >
              {m.label}
            </text>
          </g>
        ) : null
      )}

      <line
        x1={pad.left}
        x2={width - pad.right}
        y1={height - pad.bottom}
        y2={height - pad.bottom}
        className="stroke-border"
      />
      {ticks.map((t) => (
        <text
          key={t}
          x={x(t)}
          y={height - 8}
          textAnchor="middle"
          fontSize={11}
          className="fill-text-subtle"
        >
          {format(t)}
        </text>
      ))}
    </svg>
  );
}
