"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";

import { ARTICLES_HERO_IMAGE, type Article } from "../../lib/articles";
import { FeaturedStory } from "./FeaturedStory";
import { ArrowUpRightIcon } from "./icons";

const EASE = [0.22, 1, 0.36, 1] as const;

const LINES = [
  { word: "Design.", className: "" },
  { word: "Code.", className: "text-(--a-purple) pl-[11vw] lg:pl-[7.5vw]" },
  { word: "Create.", className: "" },
  { word: "Disrupt.", className: "text-(--a-purple)" },
];

export function ArticlesHero({
  featured,
  featuredNumber,
  total,
  topicCount,
}: {
  featured: Article;
  featuredNumber: string;
  total: number;
  topicCount: number;
}) {
  const reduce = useReducedMotion();

  const lines: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const line: Variants = {
    hidden: reduce ? { y: 0 } : { y: "105%" },
    show: { y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <section aria-labelledby="articles-hero-title" className="relative">
      <div className="a-wrap">
        <div className="a-label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b-2 border-(--a-ink) py-3">
          <span className="font-semibold">MADBAK® Journal</span>
          <span>Issue 001 / 2026</span>
          <span className="hidden md:inline">Technology / Design / Security</span>
          <span className="text-(--a-purple)">
            {String(total).padStart(2, "0")} stories — {String(topicCount).padStart(2, "0")} topics
          </span>
        </div>
      </div>

      <div className="a-wrap">
        <div className="relative grid grid-cols-1 lg:grid-cols-12">
          <motion.h1
            id="articles-hero-title"
            variants={lines}
            initial="hidden"
            animate="show"
            className="a-display relative z-10 pt-4 text-[length:24.5vw] leading-[0.8] sm:text-[length:19vw] lg:col-span-12 lg:row-start-1 lg:pt-5 lg:text-[length:min(15.5vw,25.5svh)]"
          >
            {LINES.map(({ word, className }) => (
              <span key={word} className="block overflow-hidden pb-[0.02em]">
                <motion.span variants={line} className={`block ${className}`}>
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <HeroVisual reduce={Boolean(reduce)} />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
            className="a-bleed relative z-20 -mt-20 sm:-mt-28 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:ml-0 lg:-mt-[13vw] lg:flex lg:flex-col"
          >
            <FeaturedStory article={featured} number={featuredNumber} />
          </motion.div>

          <div className="relative z-10 mt-10 lg:col-span-6 lg:row-start-2 lg:mt-0 lg:pr-[4vw] lg:pt-8">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-t-[6px] border-(--a-ink) pt-5 lg:gap-7">
              <ArrowUpRightIcon className="h-14 w-14 rotate-90 text-(--a-purple) lg:h-20 lg:w-20" />
              <p className="max-w-lg text-[1.15rem] font-medium leading-[1.35] tracking-[-0.01em] lg:text-[1.35rem]">
                Articles, tutorials and field notes at the intersection of technology, creativity
                and the digital world — written by a creative technologist in Istanbul.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 pb-4">
              <a
                href="#latest"
                className="a-label group inline-flex h-14 items-center gap-4 bg-(--a-ink) px-6 font-semibold text-(--a-on-ink) transition-colors hover:bg-(--a-purple) hover:text-white"
              >
                Explore the index
                <ArrowUpRightIcon className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5" />
              </a>
              <span className="a-label text-(--a-muted)">
                Scroll — Selected reading
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
      className="a-bleed relative mt-6 aspect-[4/5] sm:aspect-[5/4] lg:absolute lg:inset-y-0 lg:left-[46%] lg:right-[calc(var(--a-gutter)*-1)] lg:mx-0 lg:mt-0 lg:aspect-auto"
    >
      <span className="absolute right-0 top-0 h-[62%] w-[46%] bg-(--a-purple)" />
      <span
        aria-hidden
        className="a-display a-outline-white a-vertical pointer-events-none absolute right-[1.5%] top-[3%] select-none text-[length:11vw] leading-[0.8] lg:text-[length:7.4vw]"
      >
        Issue 001
      </span>
      <span aria-hidden className="absolute right-0 top-[62%] h-[6px] w-[20%] bg-(--a-ink)" />

      <div className="absolute bottom-0 left-[6%] right-[18%] top-[10%] lg:left-0 lg:right-[20%] lg:top-[17%]">
        <p className="a-label absolute bottom-full left-0 mb-2 hidden whitespace-nowrap text-(--a-ink) sm:block lg:left-[18%]">
          Fig. 001{ARTICLES_HERO_IMAGE.credit && ` — ${ARTICLES_HERO_IMAGE.credit}`}
        </p>
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={ARTICLES_HERO_IMAGE.src}
            alt={ARTICLES_HERO_IMAGE.alt}
            fill
            preload
            loading="eager"
            sizes="(min-width: 1024px) 42vw, 80vw"
            className="object-cover contrast-[1.12] grayscale"
            style={{ objectPosition: "50% 20%" }}
          />
          <span className="pointer-events-none absolute inset-x-0 top-[52%] h-[14%] bg-(--a-purple) mix-blend-multiply" />
          <span className="pointer-events-none absolute bottom-0 right-0 top-0 w-[20%] bg-(--a-purple) mix-blend-multiply" />
        </div>
      </div>
    </motion.div>
  );
}
