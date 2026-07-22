"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { LangKey } from "./portfolio-data";

const STORAGE_KEY = "madbak-lang";
const LANG_EVENT = "madbak-lang";

export function isLangKey(value: string | null | undefined): value is LangKey {
  return value === "en" || value === "fa" || value === "tr";
}

export function readPreferredLang(): LangKey {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLangKey(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

export function writePreferredLang(lang: LangKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(LANG_EVENT));
}

function subscribePreferredLang(onStoreChange: () => void) {
  window.addEventListener(LANG_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(LANG_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/** Shared preferred language — survives homepage ↔ /works/* navigation. */
export function usePreferredLang(): [LangKey, (code: LangKey) => void] {
  const lang = useSyncExternalStore(
    subscribePreferredLang,
    readPreferredLang,
    () => "en" as LangKey,
  );

  const setLang = useCallback((code: LangKey) => {
    writePreferredLang(code);
  }, []);

  return [lang, setLang];
}

/** Convert ASCII digits to Persian digits when locale is fa. */
export function localizeDigits(value: string, lang: LangKey): string {
  if (lang !== "fa") return value;
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]!);
}
