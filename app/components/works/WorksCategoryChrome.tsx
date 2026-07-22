"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { TRANSLATIONS, type LangKey } from "../../lib/portfolio-data";
import type { WorkCategory } from "../../lib/works-categories";
import { getNextWorkCategory } from "../../lib/works-categories";
import { localizeDigits } from "../../lib/locale-preference";
import { localeCase, trackHeading, trackMeta } from "../../lib/locale-ui";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

export function WorksCategoryHero({
  category,
  lang,
  t,
}: {
  category: WorkCategory;
  lang: LangKey;
  t: TFn;
}) {
  const reduce = useReducedMotion();
  const titleLines = category.titleLines[lang];
  const isFa = lang === "fa";

  return (
    <header
      className="relative flex min-h-[72svh] items-end overflow-hidden px-5 pb-12 pt-32 sm:min-h-[78svh] sm:px-8 sm:pb-16 sm:pt-36 lg:px-12"
      style={{ backgroundColor: category.accent, color: category.foreground }}
    >
      <motion.div
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(10rem,28vw,28rem)] font-black leading-none opacity-[0.08] ${
          isFa
            ? "start-0 tracking-[0]"
            : "-end-6 uppercase tracking-[-0.12em]"
        }`}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 0.08, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        {localizeDigits(category.index, lang)}
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <div
          className={`flex items-center justify-between font-mono text-[9px] ${
            isFa ? "tracking-[0]" : "uppercase tracking-[0.28em]"
          }`}
          style={{ color: category.muted }}
        >
          <span>{category.eyebrow[lang]}</span>
          <Link
            href="/"
            className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            {t("works_archive_crumb")}
          </Link>
        </div>

        <motion.h1
          className={`mt-8 max-w-[12ch] text-[clamp(3.75rem,12vw,11rem)] font-black leading-[0.78] ${
            isFa ? "tracking-[0]" : "uppercase tracking-[-0.1em]"
          } ${localeCase(lang)} ${trackHeading(lang)}`}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay: reduce ? 0 : 0.05,
          }}
        >
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className={`mt-8 max-w-lg text-sm leading-relaxed sm:text-base ${localeCase(lang)}`}
          style={{ color: category.muted }}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: reduce ? 0 : 0.12,
          }}
        >
          {category.description[lang]}
        </motion.p>

        <p
          className={`mt-10 font-mono text-[9px] ${
            isFa ? "tracking-[0]" : "uppercase tracking-[0.24em]"
          }`}
          style={{ color: category.muted }}
        >
          {t("works_scroll_cue")}
          <span aria-hidden> {isFa ? "←" : "→"}</span>
        </p>
      </div>
    </header>
  );
}

export function CategoryNextNav({
  category,
  lang,
  t,
}: {
  category: WorkCategory;
  lang: LangKey;
  t: TFn;
}) {
  const next = getNextWorkCategory(category.slug);
  const isFa = lang === "fa";
  const forwardArrow = isFa ? "←" : "→";
  const backArrow = isFa ? "→" : "←";

  return (
    <section
      className="border-t px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      style={{
        backgroundColor: category.accent,
        color: category.foreground,
        borderColor: category.dividerColor,
      }}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className={`font-mono text-[9px] ${trackMeta(lang)} ${
              isFa ? "" : "uppercase tracking-[0.28em]"
            }`}
            style={{ color: category.muted }}
          >
            {t("works_next_category")}
          </p>
          <Link
            href={next.href}
            className={`group mt-4 inline-flex items-end gap-4 text-[clamp(2rem,6vw,4.5rem)] font-black leading-[0.85] transition-transform duration-500 hover:translate-x-1 rtl:hover:-translate-x-1 ${
              isFa ? "tracking-[0]" : "uppercase tracking-[-0.08em]"
            } ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            <span className="border-b-2 pb-1" style={{ borderColor: next.accent }}>
              {localizeDigits(next.index, lang)} / {next.shortTitle[lang]}
            </span>
            <span className="mb-2 font-mono text-sm tracking-[0.18em] transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              {forwardArrow}
            </span>
          </Link>
        </div>
        <Link
          href="/#works"
          className={`font-mono text-[10px] transition-opacity hover:opacity-70 ${
            isFa ? "tracking-[0]" : "uppercase tracking-[0.22em]"
          }`}
          style={{ color: category.muted }}
        >
          {backArrow} {t("works_back_to_works")}
        </Link>
      </div>
    </section>
  );
}
