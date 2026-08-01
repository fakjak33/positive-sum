"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** Pre-formatted display value, e.g. "51.6%". Used when `to` is absent. */
  value?: string;
  /** Numeric target for the count-up. */
  to?: number;
  format?: (n: number) => string;
  caption?: string;
  className?: string;
  tone?: "default" | "gain" | "loss" | "rare" | "market";
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-text",
  gain: "text-gain",
  loss: "text-loss",
  rare: "text-rare",
  market: "text-market",
};

/**
 * The hero figure at the top of an analogy page.
 *
 * Counts up on first view, unless the reader has asked for reduced motion —
 * in which case the final value renders immediately. The number is never
 * withheld to serve an animation.
 */
export function Statistic({
  value,
  to,
  format = (n) => n.toFixed(1),
  caption,
  className = "",
  tone = "default",
}: Props) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    to === undefined || reduced ? (value ?? (to !== undefined ? format(to) : "")) : format(0)
  );
  const ref = useRef<HTMLParagraphElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (to === undefined) {
      setDisplay(value ?? "");
      return;
    }
    if (reduced) {
      setDisplay(format(to));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();

        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutExpo — fast then settling, reads as decisive rather than slow
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(format(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, value, format, reduced]);

  return (
    <div className={className}>
      <p
        ref={ref}
        className={`tabular text-4xl leading-none sm:text-5xl ${TONE[tone]}`}
      >
        {display}
      </p>
      {caption && (
        <p className="measure mt-3 text-sm text-text-muted">{caption}</p>
      )}
    </div>
  );
}
