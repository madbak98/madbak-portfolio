"use client";

import { useSyncExternalStore } from "react";

import { WORKS_THEME_SCRIPT } from "./works-theme";

const noopSubscribe = () => () => {};

/**
 * Pre-paint theme script. It is only rendered on the server and during hydration — on
 * client-side navigation React would warn that it never executes, and `WorksThemeToggle`
 * applies the theme in a layout effect instead.
 */
export function WorksThemeScript() {
  const serverOrHydrating = useSyncExternalStore(
    noopSubscribe,
    () => false,
    () => true,
  );
  if (!serverOrHydrating) return null;
  return <script dangerouslySetInnerHTML={{ __html: WORKS_THEME_SCRIPT }} />;
}
