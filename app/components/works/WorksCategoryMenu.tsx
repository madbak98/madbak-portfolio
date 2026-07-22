"use client";

import Link from "next/link";

import { WORK_CATEGORIES, type WorkCategorySlug } from "../../lib/works-categories";
import type { LangKey } from "../../lib/portfolio-data";
import { localeCase, trackMeta } from "../../lib/locale-ui";

export function WorksMegaMenuPanel({
  id,
  open,
  lang,
  activeSlug,
  onNavigate,
}: {
  id: string;
  open: boolean;
  lang: LangKey;
  activeSlug?: WorkCategorySlug | null;
  onNavigate?: () => void;
}) {
  return (
    <div
      id={id}
      hidden={!open}
      className="absolute inset-x-0 top-full z-[105] border-b border-white/10 bg-[#0A0A0A]"
      role="region"
      aria-label="Works categories"
    >
      {open ? (
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-4 lg:px-10">
          {WORK_CATEGORIES.map((category) => {
            const active = activeSlug === category.slug;
            return (
              <Link
                key={category.slug}
                href={category.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`group relative flex min-h-[7.5rem] flex-col justify-between px-4 py-6 transition-[background-color,border-color] duration-300 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff2a2a]/70 sm:px-5 sm:py-8 ${
                  active ? "bg-white/[0.045]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#ff2a2a]">
                    {category.index}
                  </p>
                  <span
                    className="font-mono text-[11px] text-white/30 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white/70"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
                <div>
                  <p
                    className={`text-[clamp(0.95rem,1.4vw,1.15rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#EBE8E1] transition-transform duration-500 group-hover:translate-x-1 ${localeCase(lang)}`}
                  >
                    {category.menuLabel[lang]}
                  </p>
                  <p
                    className={`mt-2 font-mono text-[9px] uppercase leading-relaxed text-white/38 ${trackMeta(lang)}`}
                  >
                    {category.menuDescriptor[lang]}
                  </p>
                </div>
                <span
                  className={`pointer-events-none absolute inset-x-4 bottom-0 h-px transition-colors duration-300 sm:inset-x-5 ${
                    active ? "bg-[#ff2a2a]/70" : "bg-transparent group-hover:bg-white/20"
                  }`}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function WorksMobileCategoryList({
  lang,
  activeSlug,
  onNavigate,
}: {
  lang: LangKey;
  activeSlug?: WorkCategorySlug | null;
  onNavigate?: () => void;
}) {
  return (
    <div className="ms-1 flex flex-col gap-0.5 border-s border-white/12 ps-3">
      {WORK_CATEGORIES.map((category) => {
        const active = activeSlug === category.slug;
        return (
          <Link
            key={category.slug}
            href={category.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors ${
              active
                ? "bg-[#ff2a2a]/12 text-[#ff2a2a]"
                : "text-[#EBE8E1]/85 hover:bg-white/[0.06]"
            } ${localeCase(lang)}`}
          >
            <span className="text-white/35">{category.index}</span>
            <span>{category.menuLabel[lang]}</span>
          </Link>
        );
      })}
    </div>
  );
}
