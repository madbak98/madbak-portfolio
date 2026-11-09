"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";

import {
  ARTICLES_THEME_ATTRIBUTE,
  ARTICLES_THEME_KEY,
  applyTheme,
  currentTheme,
  readStoredTheme,
  systemTheme,
  themeRoot,
  type ArticlesTheme,
} from "./articles-theme";
import { MoonIcon, SunIcon } from "./icons";

function subscribe(onChange: () => void) {
  const root = themeRoot();
  if (!root) return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(root, {
    attributes: true,
    attributeFilter: [ARTICLES_THEME_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

const serverTheme = (): ArticlesTheme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, serverTheme);

  // The inline script only runs on a full page load; cover client-side entry into /articles.
  useLayoutEffect(() => {
    if (!themeRoot()?.hasAttribute(ARTICLES_THEME_ATTRIBUTE)) {
      applyTheme(readStoredTheme() ?? systemTheme());
    }
  }, []);

  // Follow the OS setting until the reader makes an explicit choice.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!readStoredTheme()) applyTheme(systemTheme());
    };
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);

  const next: ArticlesTheme = theme === "dark" ? "light" : "dark";

  function toggle() {
    applyTheme(next);
    try {
      window.localStorage.setItem(ARTICLES_THEME_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="group flex h-11 w-11 items-center justify-center border-2 border-(--a-ink) text-(--a-ink) transition-colors hover:bg-(--a-ink) hover:text-(--a-on-ink)"
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
      ) : (
        <MoonIcon className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
}
