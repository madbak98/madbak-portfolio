"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import { CURSOR_MEDIA } from "./cursor-motion";

/**
 * Layout-level host for the Gundam cursor.
 * Three/GLB only download after first paint + idle, and only for desktop mouse
 * users with WebGL and without reduced motion / save-data. Until then (or if
 * any of that fails) the existing site cursor stays in charge.
 * Imperative import (not next/dynamic at module scope) so the chunk is not prefetched early.
 */

const DEFER_MS = 2500;

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

function shouldSkipCursor(): boolean {
  if (typeof window === "undefined") return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  if (!window.matchMedia(CURSOR_MEDIA).matches) {
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

  return !hasWebGL();
}

export function SiteGuardians() {
  const [GuardianSystem, setGuardianSystem] = useState<ComponentType | null>(
    null,
  );

  useEffect(() => {
    if (shouldSkipCursor()) return;

    let idleId = 0;
    let timeoutId = 0;
    let cancelled = false;

    const load = () => {
      if (cancelled || shouldSkipCursor()) return;
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
