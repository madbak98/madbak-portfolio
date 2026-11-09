"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";

import type { LangKey } from "../../lib/portfolio-data";
import { MoonIcon, SunIcon } from "../articles/icons";
import {
  WORKS_THEME_ATTRIBUTE,
  WORKS_THEME_KEY,
  applyTheme,
  currentTheme,
  readStoredTheme,
  systemTheme,
  themeRoot,
  type WorksTheme,
} from "./works-theme";

function subscribe(onChange: () => void) {
  const root = themeRoot();
  if (!root) return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: [WORKS_THEME_ATTRIBUTE] });
  return () => observer.disconnect();
}

const serverTheme = (): WorksTheme => "light";

const LABELS: Record<LangKey, Record<WorksTheme, string>> = {
  en: { light: "Switch to light mode", dark: "Switch to dark mode" },
  fa: { light: "تغییر به حالت روشن", dark: "تغییر به حالت تیره" },
};

export function WorksThemeToggle({ lang }: { lang: LangKey }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, serverTheme);

  // The inline script only runs on a full page load; cover client-side entry.
  useLayoutEffect(() => {
    if (!themeRoot()?.hasAttribute(WORKS_THEME_ATTRIBUTE)) {
      applyTheme(readStoredTheme() ?? systemTheme());
    }
  }, []);

  // Follow the OS setting until the visitor makes an explicit choice.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!readStoredTheme()) applyTheme(systemTheme());
    };
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);

  const next: WorksTheme = theme === "dark" ? "light" : "dark";
  const label = LABELS[lang][next];

  function toggle() {
    applyTheme(next);
    try {
      window.localStorage.setItem(WORKS_THEME_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="group flex h-11 w-11 shrink-0 items-center justify-center border border-(--wt-fg) text-(--wt-fg) transition-colors duration-300 hover:bg-(--wt-fg) hover:text-(--wt-bg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--wt-bg)"
    >
      {theme === "dark" ? (
        <SunIcon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90 motion-reduce:transition-none" />
      ) : (
        <MoonIcon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-rotate-12 motion-reduce:transition-none" />
      )}
    </button>
  );
}
