import type { WorkCategory } from "../../lib/works-categories";

export type WorksTheme = "light" | "dark";

export const WORKS_THEME_KEY = "madbak-works-theme";
export const WORKS_THEME_ATTRIBUTE = "data-works-theme";
const ROOT_SELECTOR = ".works-theme-root";

/**
 * Runs inline as the first child of `.works-theme-root`, before the Websites markup
 * paints, so the saved (or system) theme is applied without a flash. Keep it
 * dependency-free: it is serialised as-is.
 */
export const WORKS_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${WORKS_THEME_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.currentScript.parentElement.setAttribute("${WORKS_THEME_ATTRIBUTE}",t)}catch(e){}})();`;

export function themeRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>(ROOT_SELECTOR);
}

export function readStoredTheme(): WorksTheme | null {
  try {
    const value = window.localStorage.getItem(WORKS_THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function systemTheme(): WorksTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: WorksTheme) {
  themeRoot()?.setAttribute(WORKS_THEME_ATTRIBUTE, theme);
}

export function currentTheme(): WorksTheme {
  return themeRoot()?.getAttribute(WORKS_THEME_ATTRIBUTE) === "dark" ? "dark" : "light";
}

/** Categories whose pages follow the light / dark theme (palette lives in `app/works/works-theme.css`). */
export function isThemedCategory(category: WorkCategory): boolean {
  return category.slug === "websites";
}

/** Swaps a themed category's colours for the CSS variables, so every existing consumer follows the theme. */
export function withThemeColors(category: WorkCategory): WorkCategory {
  if (!isThemedCategory(category)) return category;
  return {
    ...category,
    accent: "var(--wt-bg)",
    foreground: "var(--wt-fg)",
    muted: "var(--wt-muted)",
    dividerColor: "var(--wt-divider)",
    marqueeBackground: "var(--wt-marquee-bg)",
    marqueeTextColor: "var(--wt-fg)",
  };
}
