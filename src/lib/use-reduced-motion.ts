"use client";

import { useEffect, useState } from "react";

/**
 * Whether the reader has asked for reduced motion.
 *
 * Defaults to `false` on the server and on first paint, then corrects after
 * mount. Every animated component in the app consults this, and every one of
 * them must have a static path that conveys the same information — reduced
 * motion must never mean reduced information.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
