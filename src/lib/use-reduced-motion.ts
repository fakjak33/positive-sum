"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// On the server we cannot know the preference, so we assume motion is allowed
// and correct on hydration. Erring the other way would mean animations never
// ran for anyone on first paint.
function getServerSnapshot() {
  return false;
}

/**
 * Whether the reader has asked for reduced motion.
 *
 * Uses `useSyncExternalStore` rather than an effect: the media query is an
 * external store, and subscribing to it properly avoids the extra render pass
 * that setting state inside an effect would cause.
 *
 * Every animated component in the app consults this, and every one of them
 * must have a static path that conveys the same information — reduced motion
 * must never mean reduced information.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
