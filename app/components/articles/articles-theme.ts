export type ArticlesTheme = "light" | "dark";

export const ARTICLES_THEME_KEY = "madbak-articles-theme";
export const ARTICLES_THEME_ATTRIBUTE = "data-articles-theme";
const ROOT_SELECTOR = ".articles-root";

/**
 * Runs inline as the first child of `.articles-root`, before the Articles markup
 * paints, so the saved (or system) theme is applied without a flash. Keep it
 * dependency-free: it is serialised as-is.
 */
export const ARTICLES_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${ARTICLES_THEME_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.currentScript.parentElement.setAttribute("${ARTICLES_THEME_ATTRIBUTE}",t)}catch(e){}})();`;

export function themeRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>(ROOT_SELECTOR);
}

export function readStoredTheme(): ArticlesTheme | null {
  try {
    const value = window.localStorage.getItem(ARTICLES_THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function systemTheme(): ArticlesTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: ArticlesTheme) {
  themeRoot()?.setAttribute(ARTICLES_THEME_ATTRIBUTE, theme);
}

export function currentTheme(): ArticlesTheme {
  return themeRoot()?.getAttribute(ARTICLES_THEME_ATTRIBUTE) === "dark" ? "dark" : "light";
}
