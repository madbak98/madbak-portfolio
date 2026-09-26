"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MobileNavOverlay, SiteNav } from "../components/SiteNav";
import { TRANSLATIONS } from "../lib/portfolio-data";
import { aboutText } from "../lib/about-i18n";
import { usePreferredLang } from "../lib/locale-preference";
import { htmlLangAttr, rootLocaleClasses } from "../lib/locale-ui";
import { GlassCard } from "./components/GlassCard";
import { PageScrollVideo } from "./components/PageScrollVideo";
import { ScrollRevealObserver } from "./components/ScrollRevealObserver";
import "./about-landing.css";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

export default function AboutPage() {
  const [lang, setLang] = usePreferredLang();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const t: TFn = (key) => TRANSLATIONS[lang][key] ?? String(key);
  const a = (key: Parameters<typeof aboutText>[1]) => aboutText(lang, key);

  useEffect(() => {
    document.title = aboutText(lang, "metaTitle");
    document.documentElement.lang = htmlLangAttr(lang);
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const onNavigate = (hash: string) => {
    if (hash === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileNavOpen(false);
    setWorksMenuOpen(false);
  };

  return (
    <div
      lang={htmlLangAttr(lang)}
      dir={lang === "fa" ? "rtl" : "ltr"}
      className={`about-landing selection:bg-[#f4978e] selection:text-[#121214] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
    >
      <PageScrollVideo
        posterSrc="/about-hero-poster.webp"
        framesManifestSrc="/about-hero-frames/manifest.json"
      />

      <SiteNav
        lang={lang}
        setLang={setLang}
        t={t}
        scrolled={navScrolled}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        worksMenuOpen={worksMenuOpen}
        setWorksMenuOpen={setWorksMenuOpen}
        onNavigate={onNavigate}
        homeLinks={false}
        size="lg"
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
        size="lg"
      />

      <main className="about-landing__content">
        <ScrollRevealObserver />

        {/* 01 Hero — editorial About; Pet lives on homepage / floating routes only */}
        <section
          className="about-hero about-hero--copy-only"
          id="top"
          aria-labelledby="about-hero-title"
        >
          <div className="about-hero__copy" data-scroll-reveal>
            <p className="about-kicker">MADBAK / ABOUT</p>
            <h1 id="about-hero-title" className="about-display about-hero__headline">
              {a("heroHeadline1")}
              <br />
              {a("heroHeadline2")}
            </h1>
            <p className="about-hero__sub">{a("heroSub")}</p>
            <p className="about-hero__axes">{a("heroAxes")}</p>
            <GlassCard className="about-hero__status">
              <i aria-hidden />
              {a("status")}
            </GlassCard>
          </div>
        </section>

        {/* Selected work */}
        <section className="about-section" aria-labelledby="about-work-title">
          <p className="about-kicker" data-scroll-reveal>
            ARCHIVE
          </p>
          <h2
            id="about-work-title"
            className="about-display"
            data-scroll-reveal
            data-reveal-delay="1"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
          >
            {a("selectedWork")}
          </h2>
          <div className="about-work-grid">
            <a
              href="https://sigmaa.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="about-work-link"
              data-scroll-reveal
            >
              <GlassCard as="article" className="about-work-card" interactive>
                <div>
                  <p className="meta">{a("sigmaMeta")}</p>
                  <h3>{a("sigmaTitle")}</h3>
                  <p className="body">{a("sigmaBody")}</p>
                </div>
                <p className="tech">{a("sigmaTech")}</p>
              </GlassCard>
            </a>
            <Link href="/" className="about-work-link" data-scroll-reveal data-reveal-delay="1">
              <GlassCard as="article" className="about-work-card" interactive>
                <div>
                  <p className="meta">{a("madbakMeta")}</p>
                  <h3>{a("madbakTitle")}</h3>
                  <p className="body">{a("madbakBody")}</p>
                </div>
              </GlassCard>
            </Link>
            <Link href="/lab" className="about-work-link" data-scroll-reveal data-reveal-delay="2">
              <GlassCard as="article" className="about-work-card" interactive>
                <div>
                  <p className="meta">{a("madlabMeta")}</p>
                  <h3>{a("madlabTitle")}</h3>
                  <p className="body">{a("madlabBody")}</p>
                </div>
              </GlassCard>
            </Link>
            <Link
              href="/works/character-design"
              className="about-work-link"
              data-scroll-reveal
              data-reveal-delay="3"
            >
              <GlassCard as="article" className="about-work-card" interactive>
                <div>
                  <p className="meta">{a("experimentsMeta")}</p>
                  <h3>{a("experimentsTitle")}</h3>
                  <p className="body">{a("experimentsBody")}</p>
                </div>
              </GlassCard>
            </Link>
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-madlab-title">
          <GlassCard className="about-madlab-feature" data-scroll-reveal>
            <h2 id="about-madlab-title">{a("madlabFeatureTitle")}</h2>
            <p>{a("madlabFeatureBody")}</p>
            <Link href="/lab">{a("madlabCta")}</Link>
          </GlassCard>
        </section>

        <section className="about-section" aria-labelledby="about-cta-title">
          <GlassCard className="about-cta-card" data-scroll-reveal>
            <h2 id="about-cta-title">{a("ctaTitle")}</h2>
            <h3>{a("ctaSub")}</h3>
            <p>{a("ctaBody")}</p>
            <div className="about-cta-actions">
              <Link href="/services" className="primary">
                {a("ctaPrimary")}
              </Link>
              <Link href="/works/websites" className="secondary">
                {a("ctaSecondary")}
              </Link>
            </div>
          </GlassCard>
        </section>

        <div className="about-scrub-spacer" aria-hidden="true" />
      </main>
    </div>
  );
}
