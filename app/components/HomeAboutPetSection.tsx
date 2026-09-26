"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { AboutPetComputer } from "../about/components/AboutPetComputer";
import { aboutText } from "../lib/about-i18n";
import { usePreferredLang } from "../lib/locale-preference";
import { resolvePetPageContext } from "../lib/pet-page-context";
import { localeCase, trackHeading, trackMeta } from "../lib/locale-ui";
import type { LangKey } from "../lib/portfolio-data";
import { TRANSLATIONS } from "../lib/portfolio-data";
import "./home-about-machine.css";

/**
 * Game console loads in its own chunk — never blocks Pet / dialogue / options.
 */
const GameConsole3D = dynamic(
  () =>
    import("../about/components/GameConsole3D").then((m) => m.GameConsole3D),
  { ssr: false, loading: () => null },
);

/**
 * Homepage #about — Pet/dialogue first; Game Console decorative & independent.
 */
export function HomeAboutPetSection() {
  const [lang] = usePreferredLang();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);
  const [active, setActive] = useState(false);
  const [consoleMount, setConsoleMount] = useState(false);

  const t = (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] ?? String(key);

  useEffect(() => {
    const el = document.getElementById("about");
    if (!el) return;

    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setActive(true);
    };

    // Immediate visibility check — IO alone can miss first paint / odd hosts
    const nearViewport = () => {
      const r = el.getBoundingClientRect();
      const pad = 160;
      return r.bottom > -pad && r.top < window.innerHeight + pad;
    };
    if (nearViewport()) activate();

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) activate();
        },
        { rootMargin: "160px 0px", threshold: 0.01 },
      );
      io.observe(el);
    }

    // Scroll/resize fallback when IntersectionObserver is unavailable or silent
    const onScroll = () => {
      if (nearViewport()) activate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mount 3D only after Pet has committed — never share Suspense/load with Pet
  useEffect(() => {
    if (!active || consoleMount) return;
    const t = window.setTimeout(() => setConsoleMount(true), 900);
    return () => window.clearTimeout(t);
  }, [active, consoleMount]);

  return (
    <section
      id="about"
      className="relative z-20 scroll-mt-[5.5rem] bg-[#EBE8E1] px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-28 lg:px-12 lg:py-36"
      aria-labelledby="home-about-title"
    >
      <div className="home-about-machine">
        <div className="home-about-machine__intro">
          <div
            className={`home-about-machine__meta mb-6 flex w-full justify-between border-t-2 border-black pt-4 font-mono text-[10px] ${localeCase(lang)} ${trackMeta(lang)}`}
          >
            <span>{t("about_op")}</span>
            <span className="unicode-bidi-isolate tabular-nums">( ID: 001 )</span>
          </div>
          <p
            className={`mb-2 font-mono text-[10px] tracking-[0.22em] text-black/45 uppercase ${localeCase(lang)}`}
          >
            MADBAK / ABOUT
          </p>
          <h2
            id="home-about-title"
            className={`max-w-[18ch] text-[clamp(1.75rem,5vw,2.75rem)] font-black leading-[0.95] tracking-tight ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            {lang === "fa" ? "با ماشین حرف بزن" : "talk to the machine"}
          </h2>
        </div>

        <div className="home-about-machine__stage">
          {active ? (
            <AboutPetComputer
              tone="light"
              layout="split"
              pageContext={resolvePetPageContext("/about")}
              lang={lang as LangKey}
              portraitAlt={aboutText(lang, "portraitAlt")}
              reducedMotion={reduceMotion}
            />
          ) : (
            <div className="home-about-machine__placeholder" aria-hidden />
          )}

          {consoleMount ? (
            <GameConsole3D className="home-about-machine__console" lang={lang} />
          ) : null}
        </div>

        <p
          className={`home-about-machine__footnote font-mono text-[11px] leading-relaxed text-black/40 ${localeCase(lang)} ${trackMeta(lang)}`}
        >
          {lang === "fa"
            ? "رزومه حوصله‌ش سر رفته. برو از پت بپرس."
            : "the resume got bored. ask the pet instead."}
        </p>
      </div>
    </section>
  );
}
