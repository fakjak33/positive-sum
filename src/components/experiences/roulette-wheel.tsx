"use client";

import { useMemo, useRef, useState } from "react";
import type { Constituent } from "@/lib/data";
import { mulberry32, randInt } from "@/lib/sim/random";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** Companies to place on the wheel. */
  pockets: readonly Constituent[];
  seed: number;
  onResult?: (c: Constituent) => void;
};

const SIZE = 320;
const R = SIZE / 2;

/**
 * A real spinning wheel, with companies as pockets instead of numbers.
 *
 * The spin is seeded and the landing pocket is chosen BEFORE the animation
 * starts — the wheel then rotates to land on it. That keeps results
 * reproducible and shareable, and means the animation is presentation rather
 * than the source of the outcome.
 *
 * Under reduced motion the wheel jumps straight to its final angle: the result
 * is identical, only the theatre is skipped.
 */
export function RouletteWheel({ pockets, seed, onResult }: Props) {
  const reduced = useReducedMotion();
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<Constituent | null>(null);
  const spinCount = useRef(0);

  // A wheel with 500 slivers is unreadable, so show a sample. Seeded, so the
  // same seed always produces the same wheel.
  const slots = useMemo(() => {
    const rng = mulberry32(seed);
    const arr = pockets.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(rng, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 24);
  }, [pockets, seed]);

  const step = 360 / slots.length;

  function spin() {
    if (spinning || slots.length === 0) return;
    spinCount.current += 1;
    const rng = mulberry32(seed + spinCount.current * 7919);
    const target = randInt(rng, slots.length);

    // The pointer sits at the top (12 o'clock). To bring slot `target` there,
    // rotate so its centre angle lands at -90°, plus whole extra turns.
    const centre = target * step + step / 2;
    const turns = reduced ? 0 : 5;
    const final = turns * 360 + (360 - centre);

    setLanded(null);
    setSpinning(true);
    setAngle((a) => a + final - (a % 360));

    const settle = () => {
      setSpinning(false);
      setLanded(slots[target]);
      onResult?.(slots[target]);
    };

    if (reduced) settle();
    else setTimeout(settle, 3400);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Pointer */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "18px solid var(--text)",
          }}
        />

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label={`Roulette wheel with ${slots.length} companies. ${
            landed
              ? `Landed on ${landed.name}, ${(landed.return * 100).toFixed(1)} percent.`
              : "Not yet spun."
          }`}
          style={{
            transform: `rotate(${angle}deg)`,
            transition: reduced
              ? "none"
              : "transform 3.4s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
          }}
        >
          {slots.map((c, i) => {
            const a0 = ((i * step - 90) * Math.PI) / 180;
            const a1 = (((i + 1) * step - 90) * Math.PI) / 180;
            const x0 = R + R * 0.96 * Math.cos(a0);
            const y0 = R + R * 0.96 * Math.sin(a0);
            const x1 = R + R * 0.96 * Math.cos(a1);
            const y1 = R + R * 0.96 * Math.sin(a1);
            const up = c.return > 0;

            // Label sits mid-sector, rotated to read outward.
            const mid = (i + 0.5) * step - 90;
            const lr = R * 0.66;
            const lx = R + lr * Math.cos((mid * Math.PI) / 180);
            const ly = R + lr * Math.sin((mid * Math.PI) / 180);

            return (
              <g key={`${c.symbol}-${i}`}>
                <path
                  d={`M ${R} ${R} L ${x0} ${y0} A ${R * 0.96} ${R * 0.96} 0 0 1 ${x1} ${y1} Z`}
                  fill={up ? "var(--gain)" : "var(--loss)"}
                  opacity={landed && landed.symbol === c.symbol ? 1 : 0.82}
                  stroke="var(--bg)"
                  strokeWidth={1.5}
                />
                <text
                  x={lx}
                  y={ly}
                  fontSize={9}
                  fontWeight={700}
                  fill="var(--bg)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid + 90} ${lx} ${ly})`}
                >
                  {c.symbol.slice(0, 5)}
                </text>
              </g>
            );
          })}

          <circle cx={R} cy={R} r={R * 0.17} fill="var(--bg)" stroke="var(--border-strong)" strokeWidth={2} />
        </svg>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="min-h-11 rounded-md bg-text px-6 text-sm font-bold uppercase tracking-wider text-bg transition-all hover:-translate-y-px hover:opacity-90 active:translate-y-0 disabled:opacity-40"
      >
        {spinning ? "Spinning…" : "Spin the wheel"}
      </button>

      <div aria-live="polite" className="min-h-16 text-center">
        {landed && (
          <div className="animate-fade-up">
            <p className="text-sm text-text-muted">{landed.name}</p>
            <p
              className={`tabular text-3xl font-bold ${landed.return > 0 ? "text-gain" : "text-loss"}`}
            >
              <span aria-hidden="true">{landed.return > 0 ? "▲" : "▼"}</span>{" "}
              {(landed.return * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
