import type { LangKey } from "./portfolio-data";

/** Native names for language switcher (same in every UI locale) */
export const LANGUAGE_DISPLAY: Record<LangKey, string> = {
  en: "English",
  fa: "فارسی",
  tr: "Türkçe",
};

/** Root typography + optional Turkish tuning */
export function rootLocaleClasses(lang: LangKey): string {
  if (lang === "fa") return "lang-fa";
  return lang === "tr" ? "lang-latin lang-tr" : "lang-latin";
}

export function htmlLangAttr(lang: LangKey): "en" | "fa" | "tr" {
  return lang === "fa" ? "fa" : lang === "tr" ? "tr" : "en";
}

/**
 * Latin display titles: uppercase. Persian: never fake-uppercase Arabic script.
 */
export function localeCase(lang: LangKey): string {
  return lang === "fa" ? "normal-case" : "uppercase";
}

/** Brand-only Latin lockups (MADBAK, EN/FA/TR codes, Sys_Boot) */
export function brandUppercase(): string {
  return "uppercase";
}

/** Wide label tracking — Persian: no letter-spacing */
export function trackLabel(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-widest";
}

export function trackLabelLoose(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-widest";
}

export function trackMeta(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-widest";
}

export function trackHeading(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-tighter";
}

export function trackKickerEm(lang: LangKey, enEm: string): string {
  return lang === "fa" ? "tracking-[0]" : `tracking-[${enEm}]`;
}

export function heroSubTracking(lang: LangKey): string {
  return lang === "fa"
    ? "tracking-[0]"
    : "tracking-[0.22em] sm:tracking-[0.3em] md:tracking-[0.55em]";
}

/** Turkish long words + FA paragraph rhythm */
export function bodyProse(lang: LangKey): string {
  if (lang === "tr") return "text-pretty hyphens-auto [overflow-wrap:anywhere] leading-[1.65] sm:leading-[1.7]";
  if (lang === "fa")
    return "text-pretty [overflow-wrap:anywhere] leading-[1.82] sm:leading-[1.78] tracking-[0]";
  return "text-pretty leading-relaxed";
}

export function leadProse(lang: LangKey): string {
  if (lang === "fa")
    return "text-pretty [overflow-wrap:anywhere] leading-[1.38] sm:leading-[1.34] tracking-[0]";
  if (lang === "tr")
    return "text-pretty hyphens-auto [overflow-wrap:anywhere] leading-[1.1] sm:leading-[1.08]";
  return "text-pretty leading-[1.1]";
}

export function modalBody(lang: LangKey): string {
  if (lang === "tr")
    return "text-pretty hyphens-auto [overflow-wrap:anywhere] leading-relaxed";
  if (lang === "fa")
    return "text-pretty [overflow-wrap:anywhere] leading-[1.82] tracking-[0]";
  return "text-pretty leading-relaxed";
}

export function nftSub1Track(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.34em]";
}

export function nftSub2Track(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.18em]";
}

export function nftTitleTracking(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.02em]";
}

export function nftSpanTracking(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.55em]";
}

export function nftCardTitleTrack(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.035em]";
}

export function nftDtTrack(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.24em]";
}

export function nftLinkTrack(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.22em]";
}

export function contactMonoLabel(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.3em]";
}

export function contactSocialLabel(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.2em]";
}

export function contactSansEm(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.1em]";
}

export function contactFooterLabel(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.2em]";
}

export function contactFooterMono(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.15em]";
}

export function contactAvailableTrack(lang: LangKey): string {
  return lang === "fa" ? "tracking-[0]" : "tracking-[0.2em]";
}

/** Large stacked display lines (about, works) — Persian needs looser leading than Latin lockups */
export function displayStackLeading(lang: LangKey): string {
  if (lang === "fa")
    return "leading-[1.12] sm:leading-[1.1] md:leading-[1.08]";
  return "leading-[0.88]";
}

/** NFT section oversized title — Persian */
export function nftDisplayLeading(lang: LangKey): string {
  if (lang === "fa") return "leading-[1.08] sm:leading-[1.06]";
  return "leading-[0.88]";
}
