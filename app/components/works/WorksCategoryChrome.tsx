"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import type { LangKey } from "../../lib/portfolio-data";
import type { WorkCategory } from "../../lib/works-categories";
import { getNextWorkCategory } from "../../lib/works-categories";
import { localeCase, trackHeading, trackMeta } from "../../lib/locale-ui";

export function WorksCategoryHero({
  category,
  lang,
}: {
  category: WorkCategory;
  lang: LangKey;
}) {
  const reduce = useReducedMotion();
  const titleLines = category.titleLines[lang];

  return (
    <header
      className="relative flex min-h-[72svh] items-end overflow-hidden px-5 pb-12 pt-28 sm:min-h-[78svh] sm:px-8 sm:pb-16 lg:px-12"
      style={{ backgroundColor: category.accent, color: category.foreground }}
    >
      <motion.div
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(10rem,28vw,28rem)] font-black uppercase leading-none tracking-[-0.12em] opacity-[0.08]"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 0.08, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        {category.index}
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <div
          className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em]"
          style={{ color: category.muted }}
        >
          <span>{category.eyebrow[lang]}</span>
          <Link
            href="/"
            className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            MADBAK / ARCHIVE
          </Link>
        </div>

        <motion.h1
          className={`mt-8 max-w-[12ch] text-[clamp(3.75rem,12vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`}
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
          className="mt-10 font-mono text-[9px] uppercase tracking-[0.24em]"
          style={{ color: category.muted }}
        >
          Scroll to explore →
        </p>
      </div>
    </header>
  );
}

export function CategoryNextNav({
  category,
  lang,
}: {
  category: WorkCategory;
  lang: LangKey;
}) {
  const next = getNextWorkCategory(category.slug);

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
            className={`font-mono text-[9px] uppercase tracking-[0.28em] ${trackMeta(lang)}`}
            style={{ color: category.muted }}
          >
            Next category
          </p>
          <Link
            href={next.href}
            className={`group mt-4 inline-flex items-end gap-4 text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.85] tracking-[-0.08em] transition-transform duration-500 hover:translate-x-1 ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            <span className="border-b-2 pb-1" style={{ borderColor: next.accent }}>
              {next.index} / {next.shortTitle[lang]}
            </span>
            <span className="mb-2 font-mono text-sm tracking-[0.18em] transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <Link
          href="/#works"
          className="font-mono text-[10px] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
          style={{ color: category.muted }}
        >
          ← All works
        </Link>
      </div>
    </section>
  );
}
