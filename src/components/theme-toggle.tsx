"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Theme toggle. The initial value is already applied to <html> by the inline
 * script in the root layout, so this only has to read it back and keep the
 * two in sync — that ordering is what avoids a flash on load.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ps-theme", next);
    } catch {
      // Private browsing with storage disabled — the toggle still works for
      // this session, it just won't be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-9 place-items-center rounded-md text-text-muted transition-colors hover:bg-surface hover:text-text"
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
          : "Switch theme"
      }
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
    </button>
  );
}
