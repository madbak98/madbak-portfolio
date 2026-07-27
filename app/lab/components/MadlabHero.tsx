"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { TextFlippingBoard } from "../../../components/ui/text-flipping-board";
import { usePreferredLang } from "../../lib/locale-preference";
import { madlabText } from "../../lib/madlab-i18n";
import { MadlabDexterModel } from "./MadlabDexterModel";

const PHRASES = [
  "MADLAB",
  "LEARN THE IDEA",
  "BUILD THE SYSTEM",
  "TAKE THE CODE",
  "LEARN HERE.\nTAKE THE CODE.",
] as const;

export function MadlabHero() {
  const [lang] = usePreferredLang();
  const heroRef = useRef<HTMLElement>(null);
  const [phrase, setPhrase] = useState<string>(PHRASES[0]);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setPhrase((current) => {
        const currentIndex = PHRASES.indexOf(current as (typeof PHRASES)[number]);
        return PHRASES[(currentIndex + 1) % PHRASES.length];
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      aria-labelledby="madlab-hero-title"
      className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden border-b border-white/12 bg-[#0A0A0A] sm:min-h-[calc(100svh-3.75rem)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(235,232,225,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(235,232,225,0.1)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(255,42,42,0.13),transparent_62%)]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[1600px] flex-col px-5 pb-8 pt-8 sm:min-h-[calc(100svh-3.75rem)] sm:px-8 sm:pb-10 sm:pt-10 lg:px-12">
        <div className="flex items-start justify-between gap-8 border-b border-white/12 pb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
          <p className="max-w-[22rem] text-[#ff2a2a]">{madlabText(lang, "heroKicker")}</p>
          <p className="shrink-0 text-end">LAB / 001</p>
        </div>

        <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-20">
          <div className="w-full">
            <div className="mb-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 sm:mb-7">
              <span>{madlabText(lang, "liveDisplay")}</span>
              <span aria-hidden>01—05</span>
            </div>
            <div className="grid w-full min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 sm:gap-5 lg:grid-cols-[minmax(12rem,0.28fr)_minmax(0,1fr)] lg:items-center lg:gap-8">
              <MadlabDexterModel />
              <div
                role="img"
                aria-label="MADLAB — MADBAK Experimental Development Lab"
                className="min-w-0 w-full"
              >
                <div aria-hidden="true">
                  <TextFlippingBoard
                    text={phrase}
                    theme="madbak"
                    reducedMotion={prefersReducedMotion}
                    duration={0.35}
                    className="!max-w-[980px] !rounded-[3px] !border !border-white/15 !p-1 sm:!p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-t border-white/12 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10">
          <div>
            <h1 id="madlab-hero-title" className="sr-only">
              MADLAB — MADBAK Experimental Development Lab
            </h1>
            <p className="max-w-xl text-[clamp(1.35rem,3vw,2.8rem)] font-black leading-[0.95] tracking-[-0.06em] text-[#ebe8e1]">
              {madlabText(lang, "heroDescription")}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
              {madlabText(lang, "heroSubcopy")}
            </p>
          </div>
          <a
            href="#archive"
            className="group flex w-fit items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-y-1">↓</span>
            {madlabText(lang, "exploreArchive")}
          </a>
        </div>
      </div>
    </section>
  );
}
