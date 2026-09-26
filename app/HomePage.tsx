"use client";

import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PortfolioImage } from "./components/PortfolioImage";
import { ModalImageGallery } from "./components/ModalImageGallery";
import Link from "next/link";

import {
  ABOUT_OPERATOR_IMAGE_SRC,
  NFT_ITEMS,
  PROJECTS,
  TRANSLATIONS,
  type LangKey,
} from "./lib/portfolio-data";
import {
  usePreferredLang,
} from "./lib/locale-preference";
import { documentTitleForPath } from "./lib/seo";
import { MobileNavOverlay, SiteNav } from "./components/SiteNav";
import {
  bodyProse,
  brandUppercase,
  displayStackLeading,
  htmlLangAttr,
  leadProse,
  localeCase,
  modalBody,
  nftDisplayLeading,
  rootLocaleClasses,
  trackHeading,
  trackKickerEm,
  trackMeta,
  heroSubTracking,
  nftSub1Track,
  nftSub2Track,
  nftTitleTracking,
  nftSpanTracking,
  nftCardTitleTrack,
  nftDtTrack,
  nftLinkTrack,
} from "./lib/locale-ui";
import { ContactSection } from "./components/ContactSection";
import { WorksScroll } from "./components/WorksScroll";

const ThreeScene = dynamic(
  () =>
    import("./components/HomeThreeScene").then((m) => m.HomeThreeScene),
  { ssr: false },
);

const MiniGame = dynamic(
  () => import("./components/MiniGame").then((m) => m.MiniGame),
  { ssr: false },
);

const FooterCrowd = dynamic(
  () => import("./components/FooterCrowd").then((m) => m.FooterCrowd),
  { ssr: false },
);

/* ==========================================
   3. UI COMPONENTS
========================================== */

const HERO_SCENE_TIMEOUT_MS = 2800;

const LoadingScreen = ({
  onComplete,
  lang,
  progress,
}: {
  onComplete: () => void;
  lang: LangKey;
  progress: number;
}) => {
  const [flicker, setFlicker] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;
    const flickerTimer = window.setTimeout(() => setFlicker(true), 80);
    const doneTimer = window.setTimeout(onComplete, 80 + 380);
    return () => {
      window.clearTimeout(flickerTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete, progress]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#EBE8E1] font-mono transition-opacity duration-700 ${
        flicker ? "scale-105 opacity-0 blur-md" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-20" />
      <div className="w-full max-w-sm px-6">
        <div
          className={`mb-2 flex items-end justify-between text-[10px] ${brandUppercase()} ${trackMeta(lang)} text-black`}
        >
          <span>Sys_Boot</span>
          <span className="tabular-nums">
            {progress.toString().padStart(3, "0")}%
          </span>
        </div>
        <div className="relative h-[1px] w-full overflow-hidden bg-black/10">
          <div
            className="absolute top-0 start-0 h-full bg-[#ff2a2a] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          className={`fa-wordmark-latin mt-8 text-center font-sans text-4xl font-black ${brandUppercase()} ${trackHeading(lang)} text-black/5`}
        >
          MADBAK
        </div>
      </div>
    </div>
  );
};

type Project = (typeof PROJECTS)[number];

const ProjectTitleDisplay = memo(function ProjectTitleDisplay({
  project,
  lang,
  className = "",
}: {
  project: Project;
  lang: LangKey;
  className?: string;
}) {
  const title = project.langs[lang]?.title ?? "";
  const lines =
    "titleStack" in project && project.titleStack
      ? project.titleStack[lang]
      : undefined;

  if (lines?.length) {
    return (
      <span
        dir="auto"
        className={`flex flex-col ${lang === "fa" ? "gap-1.5 leading-[1.12] sm:gap-2 sm:leading-[1.1]" : "gap-0 leading-[0.9]"} ${className}`.trim()}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span dir="auto" className={className}>
      {title}
    </span>
  );
});

const Modal = ({
  project,
  onClose,
  t,
  lang,
}: {
  project: Project;
  onClose: () => void;
  t: (key: keyof (typeof TRANSLATIONS)["en"]) => string;
  lang: LangKey;
}) => {
  const reduce = useReducedMotion();
  const title = project.langs[lang]?.title;
  const category = project.langs[lang]?.cat;
  const description = project.langs[lang]?.desc;
  const role = project.langs[lang]?.role ?? "";
  const context = project.langs[lang]?.context ?? "";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-0 backdrop-blur-xl md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduce ? 0.12 : 0.26,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative flex h-full max-h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#0A0A0A] text-[#EBE8E1] md:h-[min(100dvh,85vh)] md:max-h-[85vh] md:flex-row"
        initial={{
          opacity: 0,
          y: reduce ? 0 : 32,
          scale: reduce ? 1 : 0.985,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: reduce ? 0 : 14,
          scale: reduce ? 1 : 0.992,
        }}
        transition={{
          duration: reduce ? 0.18 : 0.52,
          ease: [0.16, 1, 0.3, 1],
        }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ willChange: "transform, opacity" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="group absolute top-4 end-4 z-30 flex min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation items-center justify-center rounded-full border border-white/20 bg-black/50 shadow-sm transition-[transform,colors,box-shadow] duration-200 hover:bg-white hover:text-black hover:shadow-md active:scale-[0.94] sm:top-6 sm:end-6 sm:h-12 sm:w-12"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-500 group-hover:rotate-90"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="z-10 flex h-full min-h-0 w-full flex-col border-b border-white/10 bg-[#0A0A0A] md:w-1/2 md:border-e md:border-b-0 md:border-white/10">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 pt-14 pb-6 sm:px-8 sm:pt-16 sm:pb-8 md:px-12 md:py-14 lg:p-16">
            <div
              className={`mb-8 flex shrink-0 items-center gap-3 font-mono text-[10px] text-[#ff2a2a] sm:mb-10 sm:gap-4 ${localeCase(lang)} ${trackKickerEm(lang, "0.2em")}`}
            >
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#ff2a2a]" />
              <span className="min-w-0 break-words">
                {`${t("modal_active")} // ${project.sys}`}
              </span>
            </div>

            <h2
              className={`mb-6 break-words font-black sm:mb-8 sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl xl:text-8xl ${localeCase(lang)} ${trackHeading(lang)} ${
                lang === "fa"
                  ? "text-[clamp(1.75rem,7vw,3.75rem)] leading-[1.12]"
                  : "text-4xl leading-[0.88] sm:leading-[0.85]"
              }`}
            >
              <ProjectTitleDisplay project={project} lang={lang} />
            </h2>

            <p
              className={`max-w-xl text-start text-base font-light opacity-60 sm:text-lg ${modalBody(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
            >
              {description}
            </p>

            <div className="mt-10 w-full shrink-0 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10">
              <div
                className={`grid grid-cols-1 gap-x-6 gap-y-4 font-mono text-[10px] opacity-40 sm:grid-cols-2 ${localeCase(lang)} ${trackMeta(lang)}`}
              >
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_type")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  {category}
                </div>
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_year")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  <span className="tabular-nums">{project.year}</span>
                </div>
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_role")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  {role}
                </div>
                <div className="min-w-0 break-words">
                  <span className="text-white/90">{t("modal_context")}</span>
                  <span className="mx-1.5 text-white/25">:</span>
                  {context}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative h-full min-h-0 w-full overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#111] md:w-1/2">
          <div className="flex h-auto w-full flex-col">
            <ModalImageGallery
              key={project.id}
              project={project}
              title={title}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ==========================================
   4. MAIN PAGE
========================================== */
export default function HomePage() {
  const [lang, setLang] = usePreferredLang();
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(12);
  const [sceneEnabled, setSceneEnabled] = useState(true);
  const [sceneGeneration, setSceneGeneration] = useState(0);
  const sceneRestoreCount = useRef(0);
  const finishLoader = useCallback(() => {
    setLoaderProgress(100);
  }, []);
  const [selected, setSelected] = useState<Project | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  useEffect(() => {
    const timeout = window.setTimeout(finishLoader, HERO_SCENE_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [finishLoader]);

  const handleSceneBootstrapped = useCallback(() => {
    setLoaderProgress((current) => (current >= 100 ? current : Math.max(current, 62)));
  }, []);

  const handleSceneUnavailable = useCallback(() => {
    setSceneEnabled(false);
    finishLoader();
  }, [finishLoader]);

  const handleSceneContextLost = useCallback(() => {
    sceneRestoreCount.current += 1;
    if (sceneRestoreCount.current > 1) {
      setSceneEnabled(false);
      finishLoader();
      return;
    }
    setSceneGeneration((generation) => generation + 1);
  }, [finishLoader]);

  useEffect(() => {
    document.title = documentTitleForPath("/", lang);
    document.documentElement.lang = htmlLangAttr(lang);
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  const navigateToHash = useCallback(
    (hash: string) => {
      const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
      setWorksMenuOpen(false);
      if (hash === "hero") {
        window.scrollTo({ top: 0, behavior });
        setMobileNavOpen(false);
        return;
      }
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior, block: "start" });
      }
      setMobileNavOpen(false);
    },
    [reduceMotion],
  );

  const t = (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] ?? String(key);

  const scrollProgressRef = useRef(0);
  const miniGameRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [showFooterCrowd, setShowFooterCrowd] = useState(false);
  const wordmarkShiftRef = useRef<HTMLDivElement>(null);
  const subtitleShiftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileNavOpen || selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen, selected]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLangAttr(lang);
    root.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileNavOpen(false);
      setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const watch = (
      element: Element | null,
      reveal: () => void,
    ) => {
      if (!element) return () => {};
      if (!("IntersectionObserver" in window)) {
        reveal();
        return () => {};
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          reveal();
          observer.disconnect();
        },
        { rootMargin: "600px" },
      );
      observer.observe(element);
      return () => observer.disconnect();
    };

    const stopMiniGame = watch(miniGameRef.current, () => setShowMiniGame(true));
    const stopFooter = watch(footerRef.current, () => setShowFooterCrowd(true));
    return () => {
      stopMiniGame();
      stopFooter();
    };
  }, []);

  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let rafId = 0;
    let navState = false;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    let scrollLoop = false;
    const updateScroll = () => {
      if (document.hidden) {
        scrollLoop = false;
        return;
      }
      scrollLoop = true;
      currentScroll += (targetScroll - currentScroll) * 0.1;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0
          ? Math.max(0, Math.min(1, currentScroll / maxScroll))
          : 0;

      scrollProgressRef.current = progress;
      if (wordmarkShiftRef.current) {
        wordmarkShiftRef.current.style.transform = `translate3d(0, ${progress * 200}px, 0)`;
      }
      if (subtitleShiftRef.current) {
        subtitleShiftRef.current.style.transform = `translate3d(0, ${progress * 350}px, 0)`;
      }

      const scrolled = targetScroll > 28;
      if (scrolled !== navState) {
        navState = scrolled;
        setNavScrolled(scrolled);
      }
      rafId = requestAnimationFrame(updateScroll);
    };

    const onVisibility = () => {
      if (!document.hidden && !scrollLoop) {
        targetScroll = window.scrollY;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      lang={htmlLangAttr(lang)}
      className={`min-h-screen overflow-x-hidden bg-[#EBE8E1] text-[#0A0A0A] selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
      dir={lang === "fa" ? "rtl" : "ltr"}
    >
      {loading && (
        <LoadingScreen
          onComplete={() => setLoading(false)}
          lang={lang}
          progress={loaderProgress}
        />
      )}

      <div className="pointer-events-none fixed inset-0 z-[60] bg-noise opacity-[0.22] [contain:strict]" />

      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[#030303]"
        aria-hidden
      />

      {sceneEnabled && (
        <ThreeScene
          key={sceneGeneration}
          scrollProgressRef={scrollProgressRef}
          introReady={!loading}
          reduceMotion={reduceMotion}
          onBootstrapped={handleSceneBootstrapped}
          onReady={finishLoader}
          onUnavailable={handleSceneUnavailable}
          onContextLost={handleSceneContextLost}
        />
      )}

      <main className="relative z-10 overflow-x-hidden pt-28 sm:pt-[7.5rem]">
        <SiteNav
          lang={lang}
          setLang={setLang}
          t={t}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          scrolled={navScrolled}
          onNavigate={navigateToHash}
          worksMenuOpen={worksMenuOpen}
          setWorksMenuOpen={setWorksMenuOpen}
          size="lg"
        />
        <MobileNavOverlay
          lang={lang}
          t={t}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          setLang={setLang}
          prefersReducedMotion={reduceMotion}
          onNavigate={navigateToHash}
          worksAccordionOpen={worksAccordionOpen}
          setWorksAccordionOpen={setWorksAccordionOpen}
        />

        <section
          id="hero"
          tabIndex={-1}
          className="pointer-events-none relative flex min-h-[min(92svh,40rem)] flex-col items-center justify-center overflow-x-hidden px-4 sm:min-h-[85vh] lg:h-[120vh] lg:min-h-0"
        >
          <div className="absolute inset-0 flex w-full flex-col items-center justify-center text-[#EBE8E1]">
            <div ref={wordmarkShiftRef} className="relative z-10">
              <motion.p
                className={`fa-wordmark-latin max-w-[100%] text-center font-sans text-[clamp(2.75rem,16vw,24rem)] leading-[0.75] font-black text-[#EBE8E1] select-none [text-shadow:0_2px_28px_rgba(0,0,0,0.72),0_0_2px_rgba(0,0,0,0.9)] sm:text-[18vw] lg:text-[20vw] lg:whitespace-nowrap ${brandUppercase()} ${trackHeading(lang)}`}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 56 }
                }
                animate={
                  loading
                    ? reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 56 }
                    : { opacity: 1, y: 0 }
                }
                transition={{
                  duration: reduceMotion ? 0.01 : 1.15,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reduceMotion || loading ? 0 : 0.06,
                }}
                style={{ willChange: reduceMotion ? undefined : "transform, opacity" }}
              >
                MADBAK
              </motion.p>
            </div>

            <div
              ref={subtitleShiftRef}
              className="relative z-10 mt-6 max-w-[95vw] text-center sm:mt-8 md:mt-12"
            >
              <motion.h1
                className="select-none mix-blend-normal"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 28 }
                }
                animate={
                  loading
                    ? reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 28 }
                    : { opacity: 1, y: 0 }
                }
                transition={{
                  duration: reduceMotion ? 0.01 : 0.95,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reduceMotion || loading ? 0 : 0.38,
                }}
                style={{
                  willChange: reduceMotion ? undefined : "transform, opacity",
                }}
              >
                <span
                  className={`inline-block max-w-[min(100%,42rem)] rounded-full border border-[#ff2a2a]/40 bg-[#0A0A0A]/90 px-3 py-1 text-center text-[10px] font-normal leading-snug text-[#ff2a2a] shadow-[0_0_24px_rgba(255,42,42,0.18)] backdrop-blur-sm sm:whitespace-nowrap sm:px-4 sm:py-1.5 sm:text-xs md:px-6 md:py-2 md:text-xl ${localeCase(lang)} ${heroSubTracking(lang)}`}
                >
                  {t("hero_dev")}
                </span>
              </motion.h1>
            </div>
          </div>

          <div className="absolute bottom-20 flex -translate-x-1/2 flex-col items-center text-[#EBE8E1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] start-1/2 sm:bottom-28 lg:bottom-32">
            <span
              className={`mb-4 font-mono text-[9px] opacity-50 ${localeCase(lang)} ${trackMeta(lang)}`}
            >
              {t("hero_scroll")}
            </span>
            <div className="relative h-16 w-[1px] overflow-hidden bg-white/20">
              <div className="animate-scroll-line absolute top-0 start-0 h-full w-full bg-white" />
            </div>
          </div>
        </section>

        <section
          id="about"
          className="relative z-20 scroll-mt-[5.5rem] bg-[#EBE8E1] px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32 lg:px-12 lg:py-48"
        >
          <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-12 sm:gap-16 md:gap-20 lg:max-w-[90vw] lg:grid-cols-12 lg:gap-24">
            <div className="flex min-w-0 flex-col justify-between lg:col-span-4">
              <div className="min-w-0">
                <div
                  className={`mb-8 flex justify-between border-t-2 border-black pt-4 font-mono text-[10px] ${localeCase(lang)} ${trackMeta(lang)}`}
                >
                  <span>{t("about_op")}</span>
                  <span className="unicode-bidi-isolate tabular-nums">
                    ( ID: 001 )
                  </span>
                </div>
                <h2
                  className={`max-w-full break-words text-[clamp(1.875rem,8.5vw,3rem)] font-black sm:text-[clamp(1.875rem,7.5vw,2.85rem)] md:text-[clamp(1.75rem,6.25vw,2.65rem)] lg:text-[clamp(1.25rem,2.35vw,1.875rem)] xl:text-[clamp(1.35rem,2.55vw,2rem)] ${displayStackLeading(lang)} ${localeCase(lang)} ${trackHeading(lang)}`}
                >
                  {t("about_h1_1")}
                  <br />
                  {t("about_h1_2")}
                </h2>
                <figure className="group relative mt-6 w-full min-w-0 sm:mt-8">
                  <div className="relative aspect-[3/4] w-full max-w-full overflow-hidden border border-black/12 bg-[#0A0A0A]/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <PortfolioImage
                      src={ABOUT_OPERATOR_IMAGE_SRC}
                      alt={t("about_operator_image_alt")}
                      fill
                      sizes="(max-width: 640px) min(100vw - 2rem, 36rem), (max-width: 1023px) min(100vw - 3rem, 40rem), (max-width: 1536px) 30vw, 380px"
                      className="object-cover object-center transition-[filter,transform] duration-[480ms] ease-out group-hover:brightness-[1.025] group-hover:contrast-[1.02] motion-reduce:transition-none"
                    />
                  </div>
                </figure>
              </div>
              <div className="mt-24 hidden lg:flex">
                <svg
                  viewBox="0 0 100 100"
                  className="h-32 w-32 animate-orbit-20s"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    opacity="0.3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="#ff2a2a"
                    strokeWidth="2"
                  />
                  <circle cx="50" cy="50" r="10" fill="black" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-8">
              <p
                className={`mb-7 max-w-4xl text-xl font-black sm:mb-9 sm:text-3xl md:mb-10 md:text-5xl ${localeCase(lang)} ${leadProse(lang)} ${trackHeading(lang)}`}
              >
                {t("about_intro_before")}
                <span
                  className={`text-[#ff2a2a] drop-shadow-[0_0_24px_rgba(255,42,42,0.22)] ${brandUppercase()}`}
                >
                  MADBAK
                </span>
                {t("about_intro_after")}
              </p>
              <div
                className={`mb-12 max-w-3xl space-y-6 text-base font-light opacity-70 sm:mb-16 sm:space-y-7 sm:text-lg md:space-y-8 md:text-2xl ${bodyProse(lang)}`}
              >
                <p>{t("about_p2")}</p>
                <p>{t("about_p3")}</p>
                <p>{t("about_p4")}</p>
                <p>{t("about_p5")}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-black/10 pt-8 sm:grid-cols-2 sm:gap-8 sm:pt-10 lg:grid-cols-4 lg:pt-12">
                {(
                  [
                    { l: t("stat_role"), v: t("val_role") },
                    { l: t("stat_stack"), v: "React / Next" },
                    { l: t("stat_engine"), v: "Three.js / WebGL" },
                    { l: t("stat_loc"), v: t("val_loc") },
                  ] as const
                ).map((stat, idx) => (
                  <div key={idx}>
                    <div
                      className={`mb-2 font-mono text-[10px] opacity-40 ${localeCase(lang)} ${trackMeta(lang)}`}
                    >
                      {stat.l}
                    </div>
                    <div
                      className={`text-sm font-black ${localeCase(lang)} ${lang === "fa" ? "tracking-normal" : "tracking-tight"}`}
                    >
                      {stat.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WorksScroll key={lang} lang={lang} />

        {false && (
        <section
          id="nfts"
          className="relative z-20 border-t border-black/10 bg-[#EBE8E1] px-4 py-16 text-[#0A0A0A] sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-16 lg:py-28"
        >
          <div className="relative mx-auto w-full max-w-[min(100%,80rem)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="h-3 w-[3px] shrink-0 bg-[#ff2a2a]" aria-hidden />
                <p
                  className={`text-xs font-semibold text-black/55 sm:text-[13px] ${lang !== "fa" ? "font-sans" : ""} ${localeCase(lang)} ${nftSub1Track(lang)}`}
                >
                  {t("nft_sub1")}
                </p>
              </div>
              <p
                className={`font-mono text-xs text-black/45 sm:text-[13px] ${localeCase(lang)} ${nftSub2Track(lang)}`}
              >
                {t("nft_sub2")}
              </p>
            </div>

            <div className="mt-8">
              <h2
                className={`max-w-full break-words text-[clamp(3.15rem,9.5vw,6.75rem)] font-black font-normal text-black sm:max-w-[20ch] ${nftDisplayLeading(lang)} ${localeCase(lang)} ${nftTitleTracking(lang)}`}
              >
                {t("nft_h1")}
                <span
                  className={`mt-1 block text-[0.42em] font-normal text-black/45 sm:mt-0 sm:inline sm:ps-4 sm:text-[0.5em] ${nftSpanTracking(lang)}`}
                >
                  {t("nft_h2")}
                </span>
              </h2>
            </div>

            <div className="mt-14 flex flex-col gap-12 sm:mt-16 sm:gap-14 md:gap-16">
              {NFT_ITEMS.map((nft, i) => {
                const alignRight = i % 2 === 1;
                const title = nft.langs[lang]?.title;
                const category = nft.langs[lang]?.cat;

                return (
                  <div
                    key={nft.id}
                    className={[
                      "flex w-full flex-col gap-5 md:flex-row md:items-stretch md:gap-8 lg:gap-12",
                      alignRight ? "md:flex-row-reverse" : "",
                    ].join(" ")}
                  >
                    <div className="w-full shrink-0 md:max-w-[min(100%,22rem)] lg:max-w-md">
                      <a
                        href={nft.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a] focus-visible:ring-offset-2"
                      >
                        <div className="relative overflow-hidden transition-[filter] duration-300 group-hover:brightness-[1.03]">
                          <div className="relative aspect-[4/5] w-full md:aspect-[3/4]">
                            <PortfolioImage
                              src={nft.image}
                              alt={title ?? ""}
                              fill
                              sizes="(max-width: 768px) 100vw, 22rem"
                              className="transition duration-500 group-hover:scale-[1.04]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition duration-300 group-hover:opacity-90" />
                          </div>
                        </div>
                      </a>
                    </div>

                    <aside
                      className="flex min-h-0 flex-1 flex-col justify-center px-0 py-2 text-start sm:px-2 sm:py-4 md:px-3"
                    >
                      <p
                        className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${trackKickerEm(lang, "0.28em")}`}
                      >
                        {`${nft.platform} // ${nft.sys}`}
                      </p>
                      <p
                        className={`mt-5 break-words text-[clamp(2rem,5vw,3.35rem)] font-black text-black ${lang === "fa" ? "leading-[1.14] sm:leading-[1.1]" : "leading-[1.02]"} ${localeCase(lang)} ${nftCardTitleTrack(lang)}`}
                      >
                        {title}
                      </p>
                      <dl className="mt-7 space-y-5 pt-1">
                        <div>
                          <dt
                            className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${nftDtTrack(lang)}`}
                          >
                            {t("modal_type")}
                          </dt>
                          <dd
                            className={`mt-2 text-[1.1rem] font-semibold text-black/90 sm:text-[1.2rem] md:text-[1.25rem] ${lang !== "fa" ? "font-sans" : ""}`}
                          >
                            {category}
                          </dd>
                        </div>
                        <div>
                          <dt
                            className={`font-mono text-xs text-[#ff2a2a] sm:text-[13px] ${localeCase(lang)} ${nftDtTrack(lang)}`}
                          >
                            {t("modal_year")}
                          </dt>
                          <dd
                            className={`mt-2 text-[1.1rem] font-semibold text-black/90 sm:text-[1.2rem] md:text-[1.25rem] ${lang !== "fa" ? "font-sans" : ""}`}
                          >
                            {nft.year}
                          </dd>
                        </div>
                      </dl>
                      <a
                        href={nft.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-9 inline-flex w-fit min-w-0 max-w-full items-center gap-2 break-words font-mono text-sm text-[#ff2a2a] underline decoration-[#ff2a2a]/50 underline-offset-[7px] transition hover:text-black hover:decoration-[#ff2a2a] sm:text-[15px] ${localeCase(lang)} ${nftLinkTrack(lang)} ${lang === "fa" ? "flex-row-reverse" : ""}`}
                      >
                        {t("nft_view")}
                        <span aria-hidden>→</span>
                      </a>
                    </aside>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        )}

        <div ref={miniGameRef}>
          {showMiniGame ? (
            <MiniGame
              t={t}
              lang={lang}
              onNavigateToProjects={() => navigateToHash("works")}
            />
          ) : (
            <div className="min-h-[28rem]" aria-hidden />
          )}
        </div>

        <ContactSection t={t} lang={lang} />

        <footer ref={footerRef} className="relative isolate overflow-hidden border-t border-white/10 bg-[#0A0A0A] px-4 py-10 text-[#EBE8E1] sm:px-6 sm:py-12">
          {showFooterCrowd ? <FooterCrowd reduceMotion={reduceMotion} /> : null}
          <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-8 sm:gap-10">
            <p
              className={`max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base ${localeCase(lang)} ${bodyProse(lang)}`}
            >
              {t("foot_blurb")}
            </p>
            <nav
              aria-label={t("foot_explore_works")}
              className={`flex flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] text-white/55 ${
                lang === "fa" ? "tracking-[0]" : "uppercase tracking-[0.18em]"
              }`}
            >
              <Link href="/works/websites" className="transition-opacity hover:opacity-100 hover:text-white">
                {lang === "fa" ? "وب‌سایت‌ها" : lang === "tr" ? "Web Siteleri" : "Websites"}
              </Link>
              <Link href="/works/character-design" className="transition-opacity hover:opacity-100 hover:text-white">
                {lang === "fa" ? "طراحی کاراکتر" : lang === "tr" ? "Karakter Tasarımı" : "Character Design"}
              </Link>
              <Link href="/works/ai-influencer" className="transition-opacity hover:opacity-100 hover:text-white">
                {lang === "fa" ? "اینفلوئنسر AI" : lang === "tr" ? "YZ Influencer" : "AI Influencer"}
              </Link>
              <Link href="/works/nft-collection" className="transition-opacity hover:opacity-100 hover:text-white">
                {lang === "fa" ? "مجموعه NFT" : lang === "tr" ? "NFT Koleksiyonu" : "NFT Collection"}
              </Link>
              <Link href="/services" className="transition-opacity hover:opacity-100 hover:text-white">
                {t("nav_services")}
              </Link>
              <Link href="/lab" className="transition-opacity hover:opacity-100 hover:text-white">
                {t("nav_lab")}
              </Link>
              <Link href="/about" className="transition-opacity hover:opacity-100 hover:text-white">
                {t("nav_about")}
              </Link>
              <Link href="/#contact" className="transition-opacity hover:opacity-100 hover:text-white">
                {t("nav_contact")}
              </Link>
            </nav>
            <div className="flex flex-col gap-2">
              <p
                className={`text-center font-mono text-[10px] text-white/40 sm:text-start ${brandUppercase()} ${trackMeta(lang)}`}
              >
                © 2026 MADBAK IND.
              </p>
              <p className="text-center font-mono text-[8px] uppercase tracking-[0.16em] text-white/25 sm:text-start">
                Crowd study by <a className="underline underline-offset-2 transition-colors hover:text-white/60" href="https://skiper-ui.com/v1/skiper39" target="_blank" rel="noreferrer">Skiper UI</a> · characters by <a className="underline underline-offset-2 transition-colors hover:text-white/60" href="https://www.openpeeps.com/" target="_blank" rel="noreferrer">Open Peeps</a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence mode="wait">
        {selected && (
          <Modal
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
            t={t}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
