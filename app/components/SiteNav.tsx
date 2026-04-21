"use client";

import { motion } from "motion/react";

import { TRANSLATIONS, type LangKey } from "../lib/portfolio-data";
import { LanguageFlag } from "./LanguageFlagIcons";
import {
  LANGUAGE_DISPLAY,
  brandUppercase,
  localeCase,
  trackHeading,
  trackMeta,
} from "../lib/locale-ui";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

const NAV_LINK_KEYS = ["nav_works", "nav_about", "nav_contact"] as const;
const NAV_HASH: Record<(typeof NAV_LINK_KEYS)[number], string> = {
  nav_works: "works",
  nav_about: "about",
  nav_contact: "contact",
};

export function SiteNav({
  lang,
  setLang,
  t,
  mobileNavOpen,
  setMobileNavOpen,
  scrolled,
  onNavigate,
}: {
  lang: LangKey;
  setLang: (code: LangKey) => void;
  t: TFn;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  scrolled: boolean;
  onNavigate: (hash: string) => void;
}) {
  const linkClass = `group relative font-mono text-[10px] uppercase tracking-[0.18em] text-[#EBE8E1]/75 transition-colors duration-200 hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${localeCase(lang)} ${trackMeta(lang)}`;

  const linkUnderline = (
    <span
      className="pointer-events-none absolute -bottom-1 start-0 h-px w-0 bg-[#ff2a2a] transition-[width] duration-300 ease-out group-hover:w-full"
      aria-hidden
    />
  );

  return (
    <header
      className={`fixed top-0 start-0 z-[100] w-full border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-white/12 bg-[#0A0A0A]/88 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-white/[0.08] bg-[#0A0A0A]/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[100vw] items-center justify-between gap-3 px-4 sm:h-[3.75rem] sm:gap-4 sm:px-6 md:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("hero");
            }}
            className={`group flex min-h-[44px] min-w-0 shrink-0 touch-manipulation items-center gap-2 text-[#EBE8E1] transition-opacity duration-200 hover:opacity-95 active:opacity-90 ${brandUppercase()} ${trackHeading(lang)}`}
            aria-label={t("nav_logo_aria")}
          >
            <span
              className="block h-2 w-2 shrink-0 bg-[#ff2a2a] shadow-[0_0_12px_rgba(255,42,42,0.45)] transition-transform duration-300 group-hover:scale-110"
              aria-hidden
            />
            <span className="text-lg font-black leading-none tracking-tight sm:text-xl">
              MADBAK
            </span>
          </a>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-6 md:gap-8">
          <nav
            className="hidden items-center gap-6 md:gap-7 lg:flex"
            aria-label={t("nav_primary_aria")}
          >
            {NAV_LINK_KEYS.map((key) => (
              <a
                key={key}
                href={`#${NAV_HASH[key]}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(NAV_HASH[key]);
                }}
                className={linkClass}
              >
                {t(key)}
                {linkUnderline}
              </a>
            ))}
          </nav>

          <div
            className="hidden items-center gap-px rounded-full border border-white/[0.09] bg-black/25 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:flex"
            role="group"
            aria-label={t("nav_lang_aria")}
          >
            {(["en", "fa", "tr"] as const).map((code) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  title={LANGUAGE_DISPLAY[code]}
                  aria-label={LANGUAGE_DISPLAY[code]}
                  aria-pressed={active}
                  className={`group relative flex min-h-[32px] min-w-[32px] touch-manipulation items-center justify-center rounded-full p-[5px] transition-all duration-300 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${
                    active
                      ? "bg-[#ff2a2a]/[0.12] shadow-[inset_0_0_0_1px_rgba(255,42,42,0.28),0_0_24px_rgba(255,42,42,0.1)]"
                      : "opacity-[0.58] hover:bg-white/[0.05] hover:opacity-100"
                  }`}
                >
                  <span
                    data-cursor-no-difference
                    className={`relative z-0 inline-flex overflow-visible rounded-[2px] ring-1 transition-[box-shadow,filter,transform] duration-300 group-hover:z-[5] ${
                      active
                        ? "ring-[#ff2a2a]/40 shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                        : "ring-white/[0.07]"
                    }`}
                  >
                    <LanguageFlag
                      code={code}
                      className="origin-center rounded-[2px] transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.24] motion-reduce:group-hover:scale-100"
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/18 bg-black/35 text-[#EBE8E1] backdrop-blur-sm transition-[transform,colors] duration-200 hover:border-white/25 hover:bg-black/50 active:scale-90 lg:hidden"
          >
            {mobileNavOpen ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
            <span className="sr-only">{t("nav_menu_toggle")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/** Mobile drawer panel — import motion from parent pattern; kept separate for clarity */
export function MobileNavOverlay({
  lang,
  t,
  mobileNavOpen,
  setMobileNavOpen,
  setLang,
  prefersReducedMotion,
  onNavigate,
}: {
  lang: LangKey;
  t: TFn;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  setLang: (code: LangKey) => void;
  prefersReducedMotion: boolean;
  onNavigate: (hash: string) => void;
}) {
  return (
    <div
      id="mobile-nav"
      className={`fixed inset-0 z-[110] lg:hidden ${mobileNavOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!mobileNavOpen}
    >
      <motion.button
        type="button"
        tabIndex={mobileNavOpen ? 0 : -1}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        initial={false}
        animate={{ opacity: mobileNavOpen ? 1 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.18, ease: "easeOut" }
            : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ willChange: "opacity" }}
        onClick={() => setMobileNavOpen(false)}
        aria-label={t("nav_close_menu")}
      />
      <motion.div
        className="absolute end-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-[#0A0A0A] p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[#EBE8E1] shadow-2xl sm:w-80"
        initial={false}
        animate={
          mobileNavOpen
            ? { x: 0, opacity: 1 }
            : { x: lang === "fa" ? "-100%" : "100%", opacity: 1 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
            : { type: "spring", damping: 28, stiffness: 360, mass: 0.78 }
        }
        style={{ willChange: "transform" }}
      >
        <nav
          className={`mb-8 flex flex-col gap-1 border-b border-white/10 pb-6 ${localeCase(lang)} ${trackMeta(lang)}`}
          aria-label={t("nav_primary_aria")}
        >
          <p className="mb-3 font-mono text-[9px] text-white/35">
            {t("nav_section_label")}
          </p>
          {NAV_LINK_KEYS.map((key, i) => (
            <motion.a
              key={key}
              href={`#${NAV_HASH[key]}`}
              initial={false}
              animate={
                mobileNavOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }
              }
              transition={{
                delay:
                  mobileNavOpen && !prefersReducedMotion ? 0.04 + i * 0.05 : 0,
                duration: prefersReducedMotion ? 0.2 : 0.28,
                ease: [0.18, 1, 0.32, 1],
              }}
              className={`flex min-h-[48px] items-center rounded-xl px-3 py-2.5 font-mono text-[13px] font-semibold text-[#EBE8E1] transition-colors hover:bg-white/[0.06] active:scale-[0.99] ${localeCase(lang)}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(NAV_HASH[key]);
              }}
            >
              {t(key)}
            </motion.a>
          ))}
          <motion.a
            href="#hero"
            initial={false}
            animate={
              mobileNavOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }
            }
            transition={{
              delay:
                mobileNavOpen && !prefersReducedMotion ? 0.2 : 0,
              duration: prefersReducedMotion ? 0.2 : 0.28,
              ease: [0.18, 1, 0.32, 1],
            }}
            className={`mt-1 flex min-h-[48px] items-center rounded-xl px-3 py-2.5 font-mono text-[12px] text-white/55 transition-colors hover:bg-white/[0.06] ${localeCase(lang)}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("hero");
            }}
          >
            {t("nav_home")}
          </motion.a>
        </nav>

        <p
          className={`mb-8 font-mono text-[10px] leading-relaxed text-white/50 ${localeCase(lang)} ${trackMeta(lang)}`}
        >
          {t("header_loc")}
          <br />
          {t("header_idx")}
        </p>
        <p
          className={`mb-2 font-mono text-[9px] text-white/35 ${localeCase(lang)} ${trackMeta(lang)}`}
        >
          {lang === "fa" ? "زبان" : lang === "tr" ? "Dil" : "Language"}
        </p>
        <div className="flex flex-col gap-1.5 border-b border-white/10 pb-6">
          {(["en", "fa", "tr"] as const).map((code, i) => (
            <motion.button
              key={code}
              type="button"
              onClick={() => {
                setLang(code);
                setMobileNavOpen(false);
              }}
              initial={false}
              animate={
                mobileNavOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }
              }
              transition={{
                delay:
                  mobileNavOpen && !prefersReducedMotion
                    ? 0.08 + i * 0.04
                    : 0,
                duration: prefersReducedMotion ? 0.2 : 0.3,
                ease: [0.18, 1, 0.32, 1],
              }}
              title={LANGUAGE_DISPLAY[code]}
              aria-label={LANGUAGE_DISPLAY[code]}
              aria-pressed={lang === code}
              className={`group flex min-h-[52px] flex-row items-center gap-3 rounded-xl px-4 py-2.5 text-start font-mono transition-[transform,colors,background-color] duration-200 active:scale-[0.985] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/50 ${trackMeta(lang)} ${
                lang === code
                  ? "bg-[#ff2a2a]/12 text-[#EBE8E1] shadow-[inset_0_0_0_1px_rgba(255,42,42,0.22)]"
                  : "text-[#EBE8E1]/90 hover:bg-white/[0.06]"
              }`}
            >
              <span
                data-cursor-no-difference
                className={`relative z-0 inline-flex shrink-0 overflow-visible rounded-[2px] ring-1 transition-shadow duration-300 group-hover:z-[5] ${
                  lang === code
                    ? "ring-[#ff2a2a]/45 shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
                    : "ring-white/[0.08] opacity-75 group-hover:opacity-100"
                }`}
              >
                <LanguageFlag
                  code={code}
                  className="origin-center rounded-[2px] transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.24] motion-reduce:group-hover:scale-100"
                />
              </span>
              <span
                className={`text-[15px] font-semibold leading-tight ${localeCase(lang)}`}
              >
                {LANGUAGE_DISPLAY[code]}
              </span>
            </motion.button>
          ))}
        </div>
        <motion.a
          href="#contact"
          initial={false}
          animate={mobileNavOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            delay: mobileNavOpen && !prefersReducedMotion ? 0.22 : 0,
            duration: prefersReducedMotion ? 0.2 : 0.3,
            ease: [0.18, 1, 0.32, 1],
          }}
          className={`mt-6 flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 px-4 py-3 text-center font-mono text-xs transition-[transform,colors] duration-200 hover:border-[#ff2a2a] hover:text-[#ff2a2a] active:scale-[0.99] ${localeCase(lang)} ${trackMeta(lang)}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("contact");
          }}
        >
          {t("foot_init")}
        </motion.a>
      </motion.div>
    </div>
  );
}
