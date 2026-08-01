"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "ps-bookmarks";
const EVENT = "ps-bookmarks-changed";

export type Bookmark = { slug: string; title: string; saved: number };

const EMPTY: Bookmark[] = [];

// `useSyncExternalStore` compares snapshots with Object.is, so returning a
// freshly parsed array on every call would loop forever. Cache the parsed
// value and only re-parse when the underlying string actually changes.
let cachedRaw: string | null = null;
let cachedValue: Bookmark[] = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): Bookmark[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as Bookmark[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function getServerSnapshot(): Bookmark[] {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  // `storage` fires when another tab changes the value, keeping tabs in sync.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(list: Bookmark[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable (private mode, quota exceeded). Bookmarks simply
    // won't persist; nothing else in the app depends on them.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * Bookmarks, stored locally.
 *
 * Deliberately localStorage rather than an account: nothing on this site needs
 * a server, and adding one would mean collecting reading history the app has
 * no use for.
 */
export function useBookmarks() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((slug: string, title: string) => {
    const list = getSnapshot();
    const exists = list.some((b) => b.slug === slug);
    write(
      exists
        ? list.filter((b) => b.slug !== slug)
        : [...list, { slug, title, saved: Date.now() }]
    );
  }, []);

  const has = useCallback(
    (slug: string) => items.some((b) => b.slug === slug),
    [items]
  );

  // `useSyncExternalStore` returns the server snapshot during hydration, so
  // consumers still need to know when the real value is available before
  // rendering a saved/unsaved state that could otherwise mismatch.
  const ready = typeof window !== "undefined";

  return { items, toggle, has, ready };
}
