"use client";

import type { CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

import type { LangKey } from "../../lib/portfolio-data";
import { localeCase } from "../../lib/locale-ui";

type LiveWebsiteButtonProps = {
  href: string;
  projectName: string;
  lang: LangKey;
  liveLabel: string;
  actionLabel: string;
  className?: string;
  /** Foreground / border accent — typically the category foreground. */
  accent?: string;
  /** Text color when the fill covers the button. */
  invertedText?: string;
};

export function LiveWebsiteButton({
  href,
  projectName,
  lang,
  liveLabel,
  actionLabel,
  className = "",
  accent = "#1C1A17",
  invertedText = "#F4F0E8",
}: LiveWebsiteButtonProps) {
  const reduce = useReducedMotion();
  const isFa = lang === "fa";
  const ariaLabel = `${liveLabel}: ${projectName} — ${actionLabel}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`group relative isolate inline-flex min-h-[48px] w-full max-w-md items-stretch overflow-hidden border text-start outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[var(--cta-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.99] sm:w-auto sm:min-w-[18rem] ${className}`}
      style={
        {
          borderColor: accent,
          color: accent,
          "--cta-accent": accent,
          "--cta-invert": invertedText,
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 origin-left scale-x-0 bg-[var(--cta-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        style={{ transformOrigin: isFa ? "right center" : "left center" }}
      />

      <span className="relative z-10 flex min-h-[48px] w-full items-center gap-3 px-4 py-3 transition-colors duration-300 group-hover:text-[var(--cta-invert)] group-focus-visible:text-[var(--cta-invert)] sm:gap-4 sm:px-5">
        <span className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className={`inline-block h-2 w-2 rounded-full bg-current ${
              reduce ? "" : "transition-transform duration-500 group-hover:scale-125"
            }`}
          />
          <span
            className={`font-mono text-[9px] leading-none ${
              isFa ? "tracking-[0]" : "uppercase tracking-[0.22em]"
            }`}
          >
            {liveLabel}
          </span>
        </span>

        <span
          className="h-4 w-px shrink-0 bg-current opacity-30"
          aria-hidden
        />

        <span
          className={`min-w-0 flex-1 text-[11px] font-black leading-none sm:text-xs ${
            isFa ? "tracking-[0]" : "uppercase tracking-[0.14em]"
          } ${localeCase(lang)}`}
        >
          {actionLabel}
        </span>

        <span
          aria-hidden
          className={`shrink-0 font-mono text-sm leading-none ${
            reduce
              ? ""
              : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
          }`}
        >
          ↗
        </span>
      </span>
    </a>
  );
}
