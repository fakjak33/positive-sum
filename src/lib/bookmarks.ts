"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "ps-bookmarks";

export type Bookmark = { slug: string; title: string; saved: number };

function read(): Bookmark[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    return [];
  }
}

function write(list: Bookmark[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable (private mode, quota). Bookmarks simply won't
    // persist; nothing else in the app depends on them.
  }
  window.dispatchEvent(new CustomEvent("ps-bookmarks-changed"));
}

/**
 * Bookmarks, stored locally.
 *
 * Deliberately localStorage rather than an account: nothing on this site needs
 * a server, and adding one would mean collecting reading history the app has
 * no use for.
 */
export function useBookmarks() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
    const sync = () => setItems(read());
    window.addEventListener("ps-bookmarks-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ps-bookmarks-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string, title: string) => {
    const list = read();
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

  return { items, toggle, has, ready };
}
