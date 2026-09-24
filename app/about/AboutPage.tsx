"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MobileNavOverlay, SiteNav } from "../components/SiteNav";
import { ABOUT_OPERATOR_IMAGE_SRC, TRANSLATIONS } from "../lib/portfolio-data";
import {
  ABOUT_INTERESTS,
  ABOUT_SKILL_GROUPS,
  aboutText,
} from "../lib/about-i18n";
import { usePreferredLang } from "../lib/locale-preference";
import { htmlLangAttr, rootLocaleClasses } from "../lib/locale-ui";
import { GlassCard } from "./components/GlassCard";
import { PageScrollVideo } from "./components/PageScrollVideo";
import { ScrollRevealObserver } from "./components/ScrollRevealObserver";
import "./about-landing.css";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

const INTERESTS_LOCALIZED: Record<"en" | "fa" | "tr", readonly string[]> = {
  en: ABOUT_INTERESTS,
  fa: ["بازی", "سینما", "فشن", "سه‌بعدی", "معماری", "موسیقی", "هنر دیجیتال", "تکنولوژی"],
  tr: ["Oyun", "Sinema", "Moda", "3D", "Mimari", "Müzik", "Dijital Sanat", "Teknoloji"],
};

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

  const interests = INTERESTS_LOCALIZED[lang];

  return (
    <div
      lang={htmlLangAttr(lang)}
      dir={lang === "fa" ? "rtl" : "ltr"}
      className={`about-landing selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
    >
      <PageScrollVideo
        videoSrc="/about-hero.mp4"
        posterSrc="/about-hero-poster.webp"
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

      <main className="about-landing__content">
        <ScrollRevealObserver />

        {/* 01 Hero */}
        <section className="about-hero" id="top" aria-labelledby="about-hero-title">
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

          <div className="about-hero__portrait-wrap" data-scroll-reveal data-reveal-delay="1">
            <GlassCard as="figure" className="about-hero__portrait">
              <Image
                src={ABOUT_OPERATOR_IMAGE_SRC}
                alt={a("portraitAlt")}
                width={720}
                height={960}
                sizes="(max-width: 720px) 90vw, 22rem"
                priority
              />
              <div className="about-hero__meta about-glass">
                <strong>BABAK RAVANBAKHSH</strong>
                <span>MADBAK</span>
                <span>{a("roleLine")}</span>
                <span>{a("location")}</span>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 02 Intro */}
        <section className="about-section" aria-labelledby="about-intro-title">
          <div className="about-intro-grid">
            <GlassCard className="about-intro-card" data-scroll-reveal>
              <h2 id="about-intro-title" className="about-display">
                {a("introTitle")}
              </h2>
            </GlassCard>
            <GlassCard className="about-intro-card" data-scroll-reveal data-reveal-delay="1">
              <p className="about-body-copy">{a("introP1")}</p>
              <p className="about-body-copy">{a("introP2")}</p>
              <p className="about-body-copy">{a("introP3")}</p>
              <p className="about-body-copy">{a("introP4")}</p>
            </GlassCard>
          </div>
        </section>

        {/* 03 What I do */}
        <section className="about-section" aria-labelledby="about-do-title">
          <p className="about-kicker" data-scroll-reveal>
            03
          </p>
          <h2 id="about-do-title" className="about-display" data-scroll-reveal data-reveal-delay="1" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
            {a("whatIDo")}
          </h2>
          <div className="about-do-grid">
            {[
              { title: a("doDigital"), body: a("doDigitalItems") },
              { title: a("doDesign"), body: a("doDesignItems") },
              { title: a("doCreative"), body: a("doCreativeItems") },
              { title: a("doExperiments"), body: a("doExperimentsItems") },
            ].map((card, index) => (
              <GlassCard
                key={card.title}
                className="about-do-card"
                interactive
                data-scroll-reveal
                data-reveal-delay={String((index % 3) + 1) as "1" | "2" | "3"}
              >
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 04 Design × Code */}
        <section className="about-section" aria-labelledby="about-dc-title">
          <p className="about-kicker" data-scroll-reveal>
            04
          </p>
          <h2 id="about-dc-title" className="about-display" data-scroll-reveal data-reveal-delay="1" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
            {a("designCode")}
          </h2>
          <div className="about-dc-grid">
            <GlassCard className="about-dc-card" interactive data-scroll-reveal>
              <h3>{a("designSide")}</h3>
              <div className="about-chip-row">
                {a("designSideItems")
                  .split(" · ")
                  .map((item) => (
                    <span className="about-chip" key={item}>
                      {item}
                    </span>
                  ))}
              </div>
            </GlassCard>
            <GlassCard className="about-dc-card" interactive data-scroll-reveal data-reveal-delay="1">
              <h3>{a("codeSide")}</h3>
              <div className="about-chip-row">
                {a("codeSideItems")
                  .split(" · ")
                  .map((item) => (
                    <span className="about-chip" key={item}>
                      {item}
                    </span>
                  ))}
              </div>
            </GlassCard>
          </div>
          <GlassCard className="about-dc-meet" data-scroll-reveal data-reveal-delay="2">
            <h3>{a("meetTitle")}</h3>
            <p>{a("meetBody")}</p>
          </GlassCard>
        </section>

        {/* 05 Manifesto */}
        <section className="about-section" aria-labelledby="about-manifesto-title">
          <GlassCard className="about-manifesto" data-scroll-reveal>
            <h2 id="about-manifesto-title">{a("manifestoTitle")}</h2>
            <p>{a("manifestoP1")}</p>
            <p>{a("manifestoP2")}</p>
            <p>{a("manifestoP3")}</p>
          </GlassCard>
        </section>

        {/* 06 Experience */}
        <section className="about-section" aria-labelledby="about-exp-title">
          <p className="about-kicker" data-scroll-reveal>
            06
          </p>
          <h2 id="about-exp-title" className="about-display" data-scroll-reveal data-reveal-delay="1" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
            {a("experience")}
          </h2>
          <GlassCard className="about-exp-card" data-scroll-reveal data-reveal-delay="2">
            <div className="about-exp-years">
              <span>2022</span>
              <span>↓</span>
              <span>{lang === "fa" ? "اکنون" : lang === "tr" ? "GÜNÜMÜZ" : "PRESENT"}</span>
            </div>
            <div className="about-exp-body">
              <h3>{a("expRole")}</h3>
              <p className="company">{a("expCompany")}</p>
              <p className="about-body-copy">{a("expBody")}</p>
            </div>
          </GlassCard>
        </section>

        {/* 07 Selected work */}
        <section className="about-section" aria-labelledby="about-work-title">
          <p className="about-kicker" data-scroll-reveal>
            07
          </p>
          <h2 id="about-work-title" className="about-display" data-scroll-reveal data-reveal-delay="1" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
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

        {/* 08 MADLAB */}
        <section className="about-section" aria-labelledby="about-madlab-title">
          <GlassCard className="about-madlab-feature" data-scroll-reveal>
            <h2 id="about-madlab-title">{a("madlabFeatureTitle")}</h2>
            <p>{a("madlabFeatureBody")}</p>
            <Link href="/lab">{a("madlabCta")}</Link>
          </GlassCard>
        </section>

        {/* 09 Currently */}
        <section className="about-section" aria-labelledby="about-now-title">
          <p className="about-kicker" data-scroll-reveal>
            09
          </p>
          <h2 id="about-now-title" className="about-display" data-scroll-reveal data-reveal-delay="1" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
            {a("currently")}
          </h2>
          <div className="about-now-grid">
            {[
              { title: a("curBuilding"), body: a("curBuildingItems") },
              { title: a("curLearning"), body: a("curLearningItems") },
              { title: a("curExploring"), body: a("curExploringItems") },
              { title: a("curBased"), body: a("curBasedItems") },
            ].map((card, index) => (
              <GlassCard
                key={card.title}
                className="about-now-card"
                interactive
                data-scroll-reveal
                data-reveal-delay={String((index % 3) + 1) as "1" | "2" | "3"}
              >
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 10 Skills */}
        <section className="about-section" aria-labelledby="about-skills-title">
          <p className="about-kicker" data-scroll-reveal>
            10
          </p>
          <h2 id="about-skills-title" className="about-display" data-scroll-reveal data-reveal-delay="1" style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
            {a("skills")}
          </h2>
          <div className="about-skills-grid">
            {(
              [
                ["skillFrontend", ABOUT_SKILL_GROUPS.frontend],
                ["skillCreative", ABOUT_SKILL_GROUPS.creative],
                ["skillDesign", ABOUT_SKILL_GROUPS.design],
                ["skillTools", ABOUT_SKILL_GROUPS.tools],
              ] as const
            ).map(([labelKey, items], index) => (
              <GlassCard
                key={labelKey}
                className="about-skill-group"
                data-scroll-reveal
                data-reveal-delay={String((index % 3) + 1) as "1" | "2" | "3"}
              >
                <h3>{a(labelKey)}</h3>
                <div className="about-chip-row">
                  {items.map((item) => (
                    <span className="about-chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 11 Education / Languages */}
        <section className="about-section" aria-label={a("education")}>
          <div className="about-meta-grid">
            <GlassCard className="about-meta-card" data-scroll-reveal>
              <h3>{a("education")}</h3>
              <p>{a("eduDegree")}</p>
              <p>{a("eduSchool")}</p>
            </GlassCard>
            <GlassCard className="about-meta-card" data-scroll-reveal data-reveal-delay="1">
              <h3>{a("languages")}</h3>
              <p>{a("langFa")}</p>
              <p>{a("langEn")}</p>
              <p>{a("langTr")}</p>
            </GlassCard>
          </div>
        </section>

        {/* Creative background bridge */}
        <section className="about-section" aria-labelledby="about-from-title">
          <GlassCard className="about-from-visual" data-scroll-reveal>
            <h2 id="about-from-title">{a("fromVisual")}</h2>
            <p>{a("fromVisualP1")}</p>
            <p>{a("fromVisualP2")}</p>
            <p>{a("fromVisualP3")}</p>
          </GlassCard>
        </section>

        {/* 12 Outside the screen */}
        <section className="about-section" aria-labelledby="about-outside-title">
          <GlassCard className="about-outside-card" data-scroll-reveal>
            <h2
              id="about-outside-title"
              className="about-display"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {a("outside")}
            </h2>
            <p className="note">{a("outsideNote")}</p>
            <div className="about-chip-row">
              {interests.map((item) => (
                <span className="about-chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* 13 Identity */}
        <section className="about-section" aria-labelledby="about-identity-title">
          <GlassCard className="about-identity-card" data-scroll-reveal>
            <h2 id="about-identity-title">{a("identityTitle")}</h2>
            <p>{a("identityBody")}</p>
          </GlassCard>
        </section>

        {/* 14 CTA */}
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
