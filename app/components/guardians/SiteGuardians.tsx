"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

/**
 * Layout-level Guardians host.
 * Three/GLB only download after first paint + idle — never on mobile / save-data / reduced-motion.
 * Imperative import (not next/dynamic at module scope) so the chunk is not prefetched early.
 */

const DEFER_MS = 2500;

function shouldSkipGuardian(): boolean {
  if (typeof window === "undefined") return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  if (window.matchMedia("(max-width: 767px)").matches) {
    return true;
  }

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (connection?.saveData) return true;
  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return true;
  }

  return false;
}

export function SiteGuardians() {
  const [GuardianSystem, setGuardianSystem] = useState<ComponentType | null>(
    null,
  );

  useEffect(() => {
    if (shouldSkipGuardian()) return;

    let idleId = 0;
    let timeoutId = 0;
    let cancelled = false;

    const load = () => {
      if (cancelled || shouldSkipGuardian()) return;
      void import("./GuardianSystem")
        .then((m) => {
          if (cancelled) return;
          setGuardianSystem(() => m.GuardianSystem);
        })
        .catch(() => {
          /* decorative — ignore */
        });
    };

    const scheduleIdle = () => {
      if (cancelled) return;
      const win = window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (typeof win.requestIdleCallback === "function") {
        idleId = win.requestIdleCallback(load, { timeout: DEFER_MS + 500 });
      } else {
        timeoutId = window.setTimeout(load, 0);
      }
    };

    // Wait for first paint, then idle before pulling Three + GLB
    timeoutId = window.setTimeout(scheduleIdle, DEFER_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      const win = window as Window & {
        cancelIdleCallback?: (id: number) => void;
      };
      if (idleId && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!GuardianSystem) return null;
  return <GuardianSystem />;
}
