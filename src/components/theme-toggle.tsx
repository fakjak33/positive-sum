"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const EVENT = "ps-theme-changed";

/**
 * The theme lives on the <html> element, set before paint by the inline script
 * in the root layout. That attribute — not React state — is the source of
 * truth, so this subscribes to it as an external store rather than mirroring
 * it into component state.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function getServerSnapshot(): Theme {
  // Night mode is the default everywhere, so the server and the inline script
  // agree and there is no flash.
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ps-theme", next);
    } catch {
      // Private browsing with storage disabled — the toggle still works for
      // this session, it just won't be remembered.
    }
    window.dispatchEvent(new CustomEvent(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-text-muted transition-all hover:-translate-y-px hover:bg-surface hover:text-text"
      aria-label={`Switch to ${theme === "dark" ? "day" : "night"} mode`}
      title={`Switch to ${theme === "dark" ? "day" : "night"} mode`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px]"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
      <span className="hidden text-xs font-bold uppercase tracking-wider sm:inline">
        {theme === "dark" ? "Night" : "Day"}
      </span>
    </button>
  );
}
