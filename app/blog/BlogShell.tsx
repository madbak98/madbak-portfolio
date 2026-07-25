"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

import { MobileNavOverlay, SiteNav } from "../components/SiteNav";
import { TRANSLATIONS } from "../lib/portfolio-data";
import { usePreferredLang } from "../lib/locale-preference";
import { htmlLangAttr, rootLocaleClasses } from "../lib/locale-ui";

export function BlogShell({ children }: { children: ReactNode }) {
  const [lang, setLang] = usePreferredLang();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  const t = (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] ?? String(key);

  useEffect(() => {
    document.documentElement.lang = htmlLangAttr(lang);
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const onNavigate = useCallback((hash: string) => {
    window.location.href = hash === "hero" ? "/" : `/#${hash}`;
    setMobileNavOpen(false);
    setWorksMenuOpen(false);
  }, []);

  return (
    <div
      lang={htmlLangAttr(lang)}
      dir={lang === "fa" ? "rtl" : "ltr"}
      className={`min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#EBE8E1] selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
    >
      <SiteNav
        lang={lang}
        setLang={setLang}
        t={t}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        scrolled={navScrolled}
        onNavigate={onNavigate}
        worksMenuOpen={worksMenuOpen}
        setWorksMenuOpen={setWorksMenuOpen}
        homeLinks={false}
      />
      <MobileNavOverlay
        lang={lang}
        t={t}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        setLang={setLang}
        prefersReducedMotion={prefersReducedMotion}
        onNavigate={onNavigate}
        homeLinks={false}
        worksAccordionOpen={worksAccordionOpen}
        setWorksAccordionOpen={setWorksAccordionOpen}
      />
      <div className="pt-14 sm:pt-[3.75rem]">{children}</div>
    </div>
  );
}
