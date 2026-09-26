"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useId, useRef } from "react";

import { TRANSLATIONS, type LangKey } from "../lib/portfolio-data";
import {
  WORK_CATEGORIES,
  type WorkCategorySlug,
} from "../lib/works-categories";
import { LanguageFlag } from "./LanguageFlagIcons";
import {
  WorksMegaMenuPanel,
  WorksMobileCategoryList,
} from "./works/WorksCategoryMenu";
import {
  LANGUAGE_DISPLAY,
  brandUppercase,
  localeCase,
  trackHeading,
  trackMeta,
} from "../lib/locale-ui";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

function worksSlugFromPath(pathname: string | null): WorkCategorySlug | null {
  if (!pathname?.startsWith("/works/")) return null;
  const slug = pathname.replace("/works/", "").split("/")[0];
  return WORK_CATEGORIES.some((category) => category.slug === slug)
    ? (slug as WorkCategorySlug)
    : null;
}

export function SiteNav({
  lang,
  setLang,
  t,
  mobileNavOpen,
  setMobileNavOpen,
  scrolled,
  onNavigate,
  worksMenuOpen,
  setWorksMenuOpen,
  homeLinks = true,
  size = "md",
}: {
  lang: LangKey;
  setLang: (code: LangKey) => void;
  t: TFn;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  scrolled: boolean;
  onNavigate: (hash: string) => void;
  worksMenuOpen: boolean;
  setWorksMenuOpen: (open: boolean) => void;
  homeLinks?: boolean;
  /** `lg` ≈ 2× scale (About page). */
  size?: "md" | "lg";
}) {
  const pathname = usePathname();
  const activeSlug = worksSlugFromPath(pathname);
  const worksActive = Boolean(activeSlug) || worksMenuOpen;
  const labActive = pathname === "/lab" || pathname?.startsWith("/lab/");
  const servicesActive = pathname === "/services";
  const aboutActive = pathname === "/about";
  const menuId = useId();
  const menuShellRef = useRef<HTMLDivElement>(null);
  const large = size === "lg";

  useEffect(() => {
    if (!worksMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWorksMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [worksMenuOpen, setWorksMenuOpen]);

  useEffect(() => {
    if (!worksMenuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuShellRef.current?.contains(event.target as Node)) {
        setWorksMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [worksMenuOpen, setWorksMenuOpen]);

  useEffect(() => {
    setWorksMenuOpen(false);
  }, [pathname, setWorksMenuOpen]);

  const linkClass = `group relative font-mono uppercase ${lang === "fa" ? "tracking-[0]" : "tracking-[0.18em]"} text-[#EBE8E1]/75 transition-colors duration-200 hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] ${localeCase(lang)} ${trackMeta(lang)} ${
    large ? "text-[15px] sm:text-[20px]" : "text-[10px]"
  }`;

  const linkUnderline = (
    <span
      className={`pointer-events-none absolute start-0 w-0 bg-[#ff2a2a] transition-[width] duration-300 ease-out group-hover:w-full ${
        large ? "-bottom-2 h-0.5" : "-bottom-1 h-px"
      }`}
      aria-hidden
    />
  );

  const aboutHref = "/about";
  const contactHref = homeLinks ? "#contact" : "/#contact";
  const logoHref = homeLinks ? "#hero" : "/";

  return (
    <header
      ref={menuShellRef}
      className={`fixed top-0 start-0 z-[100] w-full border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled || worksMenuOpen
          ? "border-white/12 bg-[#0A0A0A]/88 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-white/[0.08] bg-[#0A0A0A]/40 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[100vw] items-center justify-between ${
          large
            ? "h-20 gap-3 px-4 sm:h-[7.5rem] sm:gap-8 sm:px-10 md:px-14"
            : "h-14 gap-3 px-4 sm:h-[3.75rem] sm:gap-4 sm:px-6 md:px-10"
        }`}
      >
        <div className={`flex min-w-0 items-center ${large ? "gap-3 sm:gap-5" : "gap-3"}`}>
          {homeLinks ? (
            <a
              href={logoHref}
              onClick={(e) => {
                e.preventDefault();
                onNavigate("hero");
                setWorksMenuOpen(false);
              }}
              className={`group flex min-w-0 shrink-0 touch-manipulation items-center text-[#EBE8E1] transition-opacity duration-200 hover:opacity-95 active:opacity-90 ${brandUppercase()} ${lang === "fa" ? "" : trackHeading(lang)} ${
                large ? "min-h-[52px] gap-3 sm:min-h-[72px] sm:gap-4" : "min-h-[44px] gap-2"
              }`}
              aria-label={t("nav_logo_aria")}
            >
              <span
                className={`block shrink-0 bg-[#ff2a2a] shadow-[0_0_12px_rgba(255,42,42,0.45)] transition-transform duration-300 group-hover:scale-110 ${
                  large ? "h-3 w-3 sm:h-4 sm:w-4" : "h-2 w-2"
                }`}
                aria-hidden
              />
              <span
                className={`fa-wordmark-latin font-sans font-black leading-none ${lang === "fa" ? "tracking-[0]" : "tracking-tight"} ${
                  large ? "text-2xl sm:text-4xl" : "text-lg sm:text-xl"
                }`}
              >
                MADBAK
              </span>
            </a>
          ) : (
            <Link
              href="/"
              className={`group flex min-w-0 shrink-0 touch-manipulation items-center text-[#EBE8E1] transition-opacity duration-200 hover:opacity-95 active:opacity-90 ${brandUppercase()} ${lang === "fa" ? "" : trackHeading(lang)} ${
                large ? "min-h-[52px] gap-3 sm:min-h-[72px] sm:gap-4" : "min-h-[44px] gap-2"
              }`}
              aria-label={t("nav_logo_aria")}
              onClick={() => setWorksMenuOpen(false)}
            >
              <span
                className={`block shrink-0 bg-[#ff2a2a] shadow-[0_0_12px_rgba(255,42,42,0.45)] transition-transform duration-300 group-hover:scale-110 ${
                  large ? "h-3 w-3 sm:h-4 sm:w-4" : "h-2 w-2"
                }`}
                aria-hidden
              />
              <span
                className={`fa-wordmark-latin font-sans font-black leading-none ${lang === "fa" ? "tracking-[0]" : "tracking-tight"} ${
                  large ? "text-2xl sm:text-4xl" : "text-lg sm:text-xl"
                }`}
              >
                MADBAK
              </span>
            </Link>
          )}
        </div>

        <div
          className={`flex min-w-0 flex-1 items-center justify-end ${
            large ? "gap-3 sm:gap-10 md:gap-12" : "gap-4 sm:gap-6 md:gap-8"
          }`}
        >
          <nav
            className={`hidden items-center lg:flex ${
              large ? "gap-10 md:gap-12" : "gap-6 md:gap-7"
            }`}
            aria-label={t("nav_primary_aria")}
          >
            <button
              type="button"
              className={`${linkClass} ${worksActive ? "text-[#ff2a2a]" : ""}`}
              aria-expanded={worksMenuOpen}
              aria-controls={menuId}
              onClick={() => setWorksMenuOpen(!worksMenuOpen)}
            >
              {t("nav_works")}
              {linkUnderline}
            </button>

            <Link
              href={aboutHref}
              className={`${linkClass} ${aboutActive ? "text-[#ff2a2a]" : ""}`}
              onClick={() => setWorksMenuOpen(false)}
            >
              {t("nav_about")}
              {linkUnderline}
            </Link>

            {homeLinks ? (
              <a
                href={contactHref}
                onClick={(e) => {
                  e.preventDefault();
                  setWorksMenuOpen(false);
                  onNavigate("contact");
                }}
                className={linkClass}
              >
                {t("nav_contact")}
                {linkUnderline}
              </a>
            ) : (
              <Link
                href={contactHref}
                className={linkClass}
                onClick={() => setWorksMenuOpen(false)}
              >
                {t("nav_contact")}
                {linkUnderline}
              </Link>
            )}

            <Link
              href="/lab"
              className={`${linkClass} ${labActive ? "text-[#ff2a2a]" : ""}`}
              onClick={() => setWorksMenuOpen(false)}
            >
              {t("nav_lab")}
              {linkUnderline}
            </Link>

            <Link
              href="/services"
              className={`${linkClass} ${servicesActive ? "text-[#ff2a2a]" : ""}`}
              onClick={() => setWorksMenuOpen(false)}
            >
              {t("nav_services")}
              {linkUnderline}
            </Link>
          </nav>

          <div
            className={`flex items-center gap-px rounded-full border border-white/[0.09] bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm ${
              large ? "p-1.5" : "hidden p-0.5 sm:flex"
            }`}
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
                  className={`group relative flex touch-manipulation items-center justify-center rounded-full transition-all duration-300 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${
                    large
                      ? "min-h-[44px] min-w-[44px] p-1.5 sm:min-h-[64px] sm:min-w-[64px] sm:p-2.5"
                      : "min-h-[32px] min-w-[32px] p-[5px]"
                  } ${
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
                      className={`origin-center rounded-[2px] transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.24] motion-reduce:group-hover:scale-100 ${
                        large ? "!h-4 !w-[26px] sm:!h-7 sm:!w-[49px]" : ""
                      }`}
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
            onClick={() => {
              setWorksMenuOpen(false);
              setMobileNavOpen(!mobileNavOpen);
            }}
            className={`flex shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/18 bg-black/35 text-[#EBE8E1] backdrop-blur-sm transition-[transform,colors] duration-200 hover:border-white/25 hover:bg-black/50 active:scale-90 lg:hidden ${
              large
                ? "min-h-[52px] min-w-[52px] sm:min-h-[72px] sm:min-w-[72px]"
                : "min-h-[44px] min-w-[44px]"
            }`}
          >
            {mobileNavOpen ? (
              <svg
                viewBox="0 0 24 24"
                className={large ? "h-7 w-7 sm:h-10 sm:w-10" : "h-5 w-5"}
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
                className={large ? "h-7 w-7 sm:h-10 sm:w-10" : "h-5 w-5"}
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

      {large ? (
        <nav
          className={`mx-auto flex max-w-[100vw] items-center gap-5 overflow-x-auto border-t border-white/[0.06] px-4 pb-3.5 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 sm:px-10 md:px-14 lg:hidden [&::-webkit-scrollbar]:hidden ${localeCase(lang)}`}
          aria-label={t("nav_primary_aria")}
        >
          <button
            type="button"
            className={`${linkClass} shrink-0 whitespace-nowrap ${worksActive ? "text-[#ff2a2a]" : ""}`}
            onClick={() => {
              setWorksMenuOpen(false);
              setMobileNavOpen(true);
            }}
          >
            {t("nav_works")}
            {linkUnderline}
          </button>
          <Link
            href={aboutHref}
            className={`${linkClass} shrink-0 whitespace-nowrap ${aboutActive ? "text-[#ff2a2a]" : ""}`}
            onClick={() => setWorksMenuOpen(false)}
          >
            {t("nav_about")}
            {linkUnderline}
          </Link>
          {homeLinks ? (
            <a
              href={contactHref}
              onClick={(e) => {
                e.preventDefault();
                setWorksMenuOpen(false);
                onNavigate("contact");
              }}
              className={`${linkClass} shrink-0 whitespace-nowrap`}
            >
              {t("nav_contact")}
              {linkUnderline}
            </a>
          ) : (
            <Link
              href={contactHref}
              className={`${linkClass} shrink-0 whitespace-nowrap`}
              onClick={() => setWorksMenuOpen(false)}
            >
              {t("nav_contact")}
              {linkUnderline}
            </Link>
          )}
          <Link
            href="/lab"
            className={`${linkClass} shrink-0 whitespace-nowrap ${labActive ? "text-[#ff2a2a]" : ""}`}
            onClick={() => setWorksMenuOpen(false)}
          >
            {t("nav_lab")}
            {linkUnderline}
          </Link>
          <Link
            href="/services"
            className={`${linkClass} shrink-0 whitespace-nowrap ${servicesActive ? "text-[#ff2a2a]" : ""}`}
            onClick={() => setWorksMenuOpen(false)}
          >
            {t("nav_services")}
            {linkUnderline}
          </Link>
        </nav>
      ) : null}

      <div className="hidden lg:block">
        <WorksMegaMenuPanel
          id={menuId}
          open={worksMenuOpen}
          lang={lang}
          activeSlug={activeSlug}
          onNavigate={() => setWorksMenuOpen(false)}
          ariaLabel={t("nav_works_categories_aria")}
        />
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
  homeLinks = true,
  worksAccordionOpen,
  setWorksAccordionOpen,
  size = "md",
}: {
  lang: LangKey;
  t: TFn;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  setLang: (code: LangKey) => void;
  prefersReducedMotion: boolean;
  onNavigate: (hash: string) => void;
  homeLinks?: boolean;
  worksAccordionOpen: boolean;
  setWorksAccordionOpen: (open: boolean) => void;
  size?: "md" | "lg";
}) {
  const pathname = usePathname();
  const activeSlug = worksSlugFromPath(pathname);
  const labActive = pathname === "/lab" || pathname?.startsWith("/lab/");
  const worksPanelId = useId();
  const large = size === "lg";
  const itemClass = large
    ? `flex min-h-[64px] items-center rounded-xl px-4 py-3 font-mono text-[18px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-white/[0.06] active:scale-[0.99] ${localeCase(lang)}`
    : `flex min-h-[48px] items-center rounded-xl px-3 py-2.5 font-mono text-[13px] font-semibold transition-colors hover:bg-white/[0.06] active:scale-[0.99] ${localeCase(lang)}`;

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
        className={`absolute end-0 top-0 flex h-full flex-col overflow-y-auto overscroll-contain bg-[#0A0A0A]/96 text-[#EBE8E1] shadow-2xl backdrop-blur-xl ${
          large
            ? "w-[min(100%,28rem)] p-7 pt-[max(1.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:w-[32rem] sm:p-10"
            : "w-[min(100%,20rem)] p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:w-80"
        }`}
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
        <div
          className={`mb-8 flex items-center gap-px self-start rounded-full border border-white/[0.09] bg-black/35 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
            large ? "" : "hidden"
          }`}
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
                className={`flex min-h-[52px] min-w-[52px] touch-manipulation items-center justify-center rounded-full p-2 transition-all duration-300 ${
                  active
                    ? "bg-[#ff2a2a]/[0.12] shadow-[inset_0_0_0_1px_rgba(255,42,42,0.28)]"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <LanguageFlag
                  code={code}
                  className="!h-5 !w-[34px] origin-center rounded-[2px]"
                />
              </button>
            );
          })}
        </div>

        <nav
          className={`mb-8 flex flex-col border-b border-white/10 pb-6 ${large ? "gap-2" : "gap-1"} ${localeCase(lang)} ${trackMeta(lang)}`}
          aria-label={t("nav_primary_aria")}
        >
          <p className={`mb-3 font-mono text-white/35 ${large ? "text-[11px] tracking-[0.2em]" : "text-[9px]"}`}>
            {t("nav_section_label")}
          </p>

          <button
            type="button"
            aria-expanded={worksAccordionOpen}
            aria-controls={worksPanelId}
            className={`${itemClass} w-full justify-between text-start ${
              activeSlug || worksAccordionOpen ? "text-[#ff2a2a]" : "text-[#EBE8E1]"
            }`}
            onClick={() => setWorksAccordionOpen(!worksAccordionOpen)}
          >
            <span>{t("nav_works")}</span>
            <span className={`font-mono text-white/40 ${large ? "text-[16px]" : "text-[11px]"}`} aria-hidden>
              {worksAccordionOpen ? "−" : "+"}
            </span>
          </button>
          <div id={worksPanelId} hidden={!worksAccordionOpen} className="pb-2">
            {worksAccordionOpen ? (
              <WorksMobileCategoryList
                lang={lang}
                activeSlug={activeSlug}
                onNavigate={() => setMobileNavOpen(false)}
              />
            ) : null}
          </div>

          <Link
            href="/about"
            className={`${itemClass} ${
              pathname === "/about" ? "text-[#ff2a2a]" : "text-[#EBE8E1]"
            }`}
            onClick={() => setMobileNavOpen(false)}
          >
            {t("nav_about")}
          </Link>

          {homeLinks ? (
            <motion.a
              href="#contact"
              initial={false}
              animate={
                mobileNavOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }
              }
              transition={{
                delay:
                  mobileNavOpen && !prefersReducedMotion ? 0.12 : 0,
                duration: prefersReducedMotion ? 0.2 : 0.28,
                ease: [0.18, 1, 0.32, 1],
              }}
              className={`${itemClass} text-[#EBE8E1]`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate("contact");
              }}
            >
              {t("nav_contact")}
            </motion.a>
          ) : (
            <Link
              href="/#contact"
              className={`${itemClass} text-[#EBE8E1]`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav_contact")}
            </Link>
          )}

          <Link
            href="/lab"
            className={`${itemClass} ${labActive ? "text-[#ff2a2a]" : "text-[#EBE8E1]"}`}
            onClick={() => setMobileNavOpen(false)}
          >
            {t("nav_lab")}
          </Link>

          <Link
            href="/services"
            className={`${itemClass} ${pathname === "/services" ? "text-[#ff2a2a]" : "text-[#EBE8E1]"}`}
            onClick={() => setMobileNavOpen(false)}
          >
            {t("nav_services")}
          </Link>

          {homeLinks ? (
            <motion.a
              href="#hero"
              initial={false}
              animate={
                mobileNavOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }
              }
              transition={{
                delay:
                  mobileNavOpen && !prefersReducedMotion ? 0.16 : 0,
                duration: prefersReducedMotion ? 0.2 : 0.28,
                ease: [0.18, 1, 0.32, 1],
              }}
              className={`${itemClass} mt-1 text-white/55 ${large ? "text-[15px]" : "text-[12px]"}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate("hero");
              }}
            >
              {t("nav_home")}
            </motion.a>
          ) : (
            <Link
              href="/"
              className={`${itemClass} mt-1 text-white/55 ${large ? "text-[15px]" : "text-[12px]"}`}
              onClick={() => setMobileNavOpen(false)}
            >
              {t("nav_home")}
            </Link>
          )}
        </nav>

        <p
          className={`mb-8 font-mono leading-relaxed text-white/50 ${large ? "text-[13px]" : "text-[10px]"} ${localeCase(lang)} ${trackMeta(lang)}`}
        >
          {t("header_loc")}
          <br />
          {t("header_idx")}
        </p>

        {!large ? (
          <>
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
          </>
        ) : null}

        {homeLinks ? (
          <motion.a
            href="#contact"
            initial={false}
            animate={mobileNavOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              delay: mobileNavOpen && !prefersReducedMotion ? 0.22 : 0,
              duration: prefersReducedMotion ? 0.2 : 0.3,
              ease: [0.18, 1, 0.32, 1],
            }}
            className={`mt-6 flex items-center justify-center rounded-xl border border-white/20 px-4 text-center font-mono transition-[transform,colors] duration-200 hover:border-[#ff2a2a] hover:text-[#ff2a2a] active:scale-[0.99] ${
              large ? "min-h-[56px] py-4 text-sm tracking-[0.16em]" : "min-h-[48px] py-3 text-xs"
            } ${localeCase(lang)} ${trackMeta(lang)}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("contact");
            }}
          >
            {t("foot_init")}
          </motion.a>
        ) : (
          <Link
            href="/#contact"
            className={`mt-6 flex items-center justify-center rounded-xl border border-white/20 px-4 text-center font-mono transition-colors hover:border-[#ff2a2a] hover:text-[#ff2a2a] ${
              large ? "min-h-[56px] py-4 text-sm tracking-[0.16em]" : "min-h-[48px] py-3 text-xs"
            } ${localeCase(lang)} ${trackMeta(lang)}`}
            onClick={() => setMobileNavOpen(false)}
          >
            {t("foot_init")}
          </Link>
        )}
      </motion.div>
    </div>
  );
}
