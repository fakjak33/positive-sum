"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production only.
 *
 * Skipped in development because a caching worker and Fast Refresh fight each
 * other, and the resulting stale-bundle confusion is not worth the fidelity.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration can fail on unsupported or restricted origins. The site
        // is fully functional without it; only offline support is lost.
      });
    };

    // Hydration frequently happens AFTER `load` has already fired, in which
    // case a listener would never run at all. Check the current state first
    // and only wait for the event if the page is genuinely still loading.
    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
