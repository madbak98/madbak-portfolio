"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { TRANSLATIONS, type LangKey } from "../../lib/portfolio-data";
import type { WorkCategory } from "../../lib/works-categories";
import { htmlLangAttr, rootLocaleClasses } from "../../lib/locale-ui";
import { MobileNavOverlay, SiteNav } from "../SiteNav";
import { WorksCategoryPage } from "./WorksCategoryPage";

export function WorksPageShell({ category }: { category: WorkCategory }) {
  const [lang, setLang] = useState<LangKey>("en");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const t = (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] ?? String(key);

  const onNavigate = useCallback((hash: string) => {
    window.location.href = hash === "hero" ? "/" : `/#${hash}`;
    setMobileNavOpen(false);
    setWorksMenuOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <div
      lang={htmlLangAttr(lang)}
      className={`min-h-screen overflow-x-hidden selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
      dir={lang === "fa" ? "rtl" : "ltr"}
      style={{ backgroundColor: category.accent, color: category.foreground }}
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
        prefersReducedMotion={reduceMotion}
        onNavigate={onNavigate}
        homeLinks={false}
        worksAccordionOpen={worksAccordionOpen}
        setWorksAccordionOpen={setWorksAccordionOpen}
      />
      <WorksCategoryPage category={category} lang={lang} />
    </div>
  );
}
