"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { MobileNavOverlay, SiteNav } from "../components/SiteNav";
import {
  ABOUT_OPERATOR_IMAGE_SRC,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  TRANSLATIONS,
} from "../lib/portfolio-data";
import { usePreferredLang } from "../lib/locale-preference";
import { htmlLangAttr, rootLocaleClasses } from "../lib/locale-ui";
import { PageScrollVideo } from "./components/PageScrollVideo";
import { ScrollRevealObserver } from "./components/ScrollRevealObserver";
import "./about-landing.css";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;
type SocialIconName = "x" | "instagram" | "telegram" | "whatsapp" | "linkedin" | "github";

function SocialIcon({ name }: { name: SocialIconName }) {
  const props = {
    className: "contact-pg-social-svg",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;

  if (name === "x") {
    return (
      <svg {...props}>
        <path
          d="M4.4 3.5h4.1l4 5.3 4.6-5.3h2.4l-5.9 6.8 6.4 8.2h-4.1l-4.4-5.7-5 5.7H4.1l6.4-7.2L4.4 3.5Zm3.1 1.8 8.9 11.4h1.5L9 5.3H7.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...props}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
      </svg>
    );
  }

  if (name === "telegram") {
    return (
      <svg {...props}>
        <path
          d="m21.3 3.7-18 6.9c-.9.3-.9 1.6 0 1.9l4.6 1.7 1.7 5.4c.3.9 1.4 1.1 2 .4l2.8-3.4 4.7 3.6c.8.6 1.9.2 2.1-.8l2.8-14.3c.2-.9-.8-1.7-1.7-1.4Zm-11.1 10.1 9.3-7.6-7.8 9.1-.6 2.2-1-3.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg {...props}>
        <path
          d="M12 2.4a9.6 9.6 0 0 0-8.3 14.4L2.5 21.5l4.9-1.2A9.6 9.6 0 1 0 12 2.4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8.3 7.7c.2-.4.5-.4.8-.4h.6c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.1.1-.1.3 0 .5.5.9 1.2 1.6 2.1 2.1.2.1.4.1.5-.1l.8-.8c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.6-.1.7-.4 1.3-1 1.6-.6.3-1.3.3-2 .1-1.1-.3-2.2-1-3.1-1.8-.9-.8-1.7-1.8-2.2-2.9-.3-.7-.4-1.4-.1-2.1l.2-1.6Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...props}>
        <circle cx="4.5" cy="4.5" r="1.6" fill="currentColor" />
        <path
          d="M3.1 8.2h2.8V21H3.1V8.2Zm5 0h2.7V10c.7-1.2 1.9-2.1 3.8-2.1 3 0 4.3 1.9 4.3 5.2V21h-2.8v-7.4c0-1.8-.6-2.9-2.1-2.9-1.6 0-2.3 1.1-2.3 3.1V21H8.1V8.2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path
        d="M12 .8a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.3.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.7-.7 2.1-1.2.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3.1 1.1a10.7 10.7 0 0 1 5.6 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.3-5.1 5.6.4.4.8 1.1.8 2.2V22c0 .3.2.7.8.6A11.2 11.2 0 0 0 12 .8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="contact-pg-mail-svg" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutPage() {
  const [lang, setLang] = usePreferredLang();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const t: TFn = (key) => TRANSLATIONS[lang][key] ?? String(key);

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

  const socials: { name: SocialIconName; label: string; href: string; handle: string }[] = [
    { name: "x", label: "X", href: SOCIAL_LINKS.x, handle: "@Lilosama98" },
    { name: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram, handle: "@madbak98" },
    { name: "telegram", label: "Telegram", href: SOCIAL_LINKS.telegram, handle: "@Lilosaama" },
    {
      name: "whatsapp",
      label: "WhatsApp",
      href: SOCIAL_LINKS.whatsapp,
      handle: "+90 501 005 03 95",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      href: SOCIAL_LINKS.linkedin,
      handle: "babak-ravanbakhsh",
    },
    { name: "github", label: "GitHub", href: SOCIAL_LINKS.github, handle: "@madbak98" },
  ];

  return (
    <div
      lang={htmlLangAttr(lang)}
      dir={lang === "fa" ? "rtl" : "ltr"}
      className={`about-landing selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
    >
      <PageScrollVideo
        videoSrc="/about-hero.mp4"
        posterSrc="/about-hero-poster.png"
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
        prefersReducedMotion={false}
        onNavigate={onNavigate}
        homeLinks={false}
        worksAccordionOpen={worksAccordionOpen}
        setWorksAccordionOpen={setWorksAccordionOpen}
      />

      <main className="about-landing__content">
        <ScrollRevealObserver />
        <h1 className="sr-only">About Madbak</h1>

        <section className="about-hero" id="top">
          <div className="about-glass about-hero-card" data-scroll-reveal>
            <p className="eyebrow">
              {t("header_arch")} · {t("header_loc")}
            </p>
            <p className="hero-intro">
              {lang === "fa"
                ? "من بابک هستم — با نام Madbak. وب‌سایت‌های تعاملی، هویت‌های دیجیتال و تجربه‌های موشن‌محور طراحی و می‌سازم."
                : lang === "tr"
                  ? "Ben Babak — Madbak olarak üretiyorum. Etkileşimli web siteleri, dijital kimlikler ve motion odaklı deneyimler tasarlayıp geliştiriyorum."
                  : "I'm Babak — creating as Madbak. I design and build interactive websites, digital identities and motion-led experiences."}
            </p>
            <a className="circle-link" href="#about" aria-label="Scroll to about">
              <span>↓</span>
            </a>
          </div>
          <div className="hero-meta" aria-hidden="true">
            <span>00 — 01</span>
            <span>{t("hero_scroll")}</span>
            <span>© 2024—26</span>
          </div>
        </section>

        <section className="about-pg" id="about">
          <div className="about-grid">
            <div className="about-rail">
              <div className="about-index" data-scroll-reveal>
                <span>{t("about_op")}</span>
                <span>( ID: 001 )</span>
              </div>
              <h2 className="about-title" data-scroll-reveal data-reveal-delay="1">
                {t("about_h1_1")}
                <br />
                {t("about_h1_2")}
              </h2>
              <figure
                className="about-portrait about-glass"
                data-scroll-reveal
                data-reveal-delay="2"
              >
                <Image
                  src={ABOUT_OPERATOR_IMAGE_SRC}
                  alt={t("about_operator_image_alt")}
                  width={720}
                  height={960}
                  sizes="(max-width: 1024px) 90vw, 30vw"
                />
              </figure>
            </div>

            <div className="about-copy">
              <p className="about-lead" data-scroll-reveal data-reveal-delay="1">
                {t("about_intro_before")}
                <span>MADBAK</span>
                {t("about_intro_after")}
              </p>
              <div className="about-body about-glass" data-scroll-reveal data-reveal-delay="2">
                <p>{t("about_p2")}</p>
                <p>{t("about_p3")}</p>
                <p>{t("about_p4")}</p>
                <p>{t("about_p5")}</p>
              </div>
              <div className="about-stats about-glass" data-scroll-reveal data-reveal-delay="3">
                <div>
                  <span>{t("stat_role")}</span>
                  <strong>{t("val_role")}</strong>
                </div>
                <div>
                  <span>{t("stat_stack")}</span>
                  <strong>React / Next</strong>
                </div>
                <div>
                  <span>{t("stat_engine")}</span>
                  <strong>Three.js / WebGL</strong>
                </div>
                <div>
                  <span>{t("stat_loc")}</span>
                  <strong>{t("val_loc")}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-pg" id="contact">
          <div className="contact-pg-inner about-glass" data-scroll-reveal>
            <p className="contact-pg-label">[004] CONTACT</p>
            <h2 className="contact-pg-title" data-reveal-delay="1">
              LET&apos;S CREATE
              <br />
              TOGETHER
            </h2>
            <a
              className="contact-pg-email"
              href={`mailto:${CONTACT_EMAIL}?subject=MADBAK%20%E2%80%94%20contact`}
            >
              <MailIcon />
              <span>{CONTACT_EMAIL}</span>
            </a>
            <div className="contact-pg-socials" role="list">
              {socials.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  role="listitem"
                >
                  <span className="contact-pg-social-name">
                    <SocialIcon name={item.name} />
                    {item.label}
                  </span>
                  <strong dir={item.name === "whatsapp" ? "ltr" : undefined}>
                    {item.handle}
                  </strong>
                </a>
              ))}
            </div>
            <div className="contact-pg-rule" />
            <div className="contact-pg-footer">
              <div>
                <p>
                  {lang === "fa"
                    ? "آماده همکاری‌های منتخب فریلنس و پروژه‌های خلاق"
                    : lang === "tr"
                      ? "Seçili freelance projeler ve yaratıcı işbirliklerine açığım"
                      : "Open to select freelance projects and creative collaborations"}
                </p>
                <small>© 2026 MADBAK. All rights reserved.</small>
              </div>
              <span className="contact-pg-available">
                <i /> CURRENTLY AVAILABLE
              </span>
            </div>
          </div>
        </section>

        {/* Extra scroll length so the full video timeline can be scrubbed */}
        <div className="about-scrub-spacer" aria-hidden="true" />
      </main>
    </div>
  );
}
