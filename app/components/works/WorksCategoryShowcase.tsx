"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import type { LangKey } from "../../lib/portfolio-data";
import {
  WEB_PROJECTS,
  getCharacterProject,
  getInfluencerProject,
  getNftItems,
  type WorkCategory,
  type WorkCategorySlug,
} from "../../lib/works-categories";
import { PortfolioImage } from "../PortfolioImage";
import { ProjectMarquee } from "../ProjectMarquee";
import { localeCase } from "../../lib/locale-ui";

const WEB_CARD_AUTOPLAY_MS = 3700;
const WEB_CARD_CROSSFADE_S = 0.55;

function WebsiteLandingCard({
  project,
  lang,
}: {
  project: (typeof WEB_PROJECTS)[number];
  lang: LangKey;
}) {
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const isFeatured = "featured" in project && project.featured;
  const frameTone = isFeatured ? "warm" : "dark";

  useEffect(() => {
    if (reduce || project.images.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % project.images.length);
    }, WEB_CARD_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [project.images.length, reduce]);

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-[#1C1A17]/10 bg-[#FAF8F4] outline-none focus-visible:ring-2 focus-visible:ring-[#A9BDC6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F0E8]"
      aria-label={`${project.title} — ${project.label[lang]}`}
    >
      <div className="p-4 sm:p-5 lg:p-6">
        <div
          className={`relative aspect-[16/10] w-full overflow-hidden rounded-[1.35rem] border border-[#1C1A17]/10 ${
            frameTone === "dark" ? "bg-[#141414]" : "bg-[#E8E4DC]"
          }`}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={project.images[activeImage]}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: WEB_CARD_CROSSFADE_S, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={project.images[activeImage]}
                alt={
                  "imageAlts" in project
                    ? project.imageAlts[activeImage] ?? `${project.title} preview`
                    : `${project.title} preview ${activeImage + 1}`
                }
                fill
                sizes="(max-width: 768px) 100vw, 42rem"
                className="object-contain object-center p-2"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C45C4A]">
              {"liveLabel" in project ? project.liveLabel[lang] : project.label[lang]}
            </p>
            <h2 className="mt-2 text-[clamp(1.75rem,4vw,3.25rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]">
              {project.title}
            </h2>
            <p className={`mt-3 max-w-md text-sm leading-relaxed text-[#6E6A63] ${localeCase(lang)}`}>
              {project.description[lang]}
            </p>
          </div>
          <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1C1A17]/55 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
            ↗
          </span>
        </div>
      </div>
    </a>
  );
}

function CharacterArchive({
  images,
  title,
}: {
  images: readonly string[];
  title: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`relative overflow-hidden border border-black/15 bg-black/10 ${
            index === 0 ? "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:col-span-2" : "aspect-[4/5]"
          }`}
        >
          <PortfolioImage
            src={src}
            alt={`${title} ${index + 1}`}
            fill
            sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
            priority={index < 2}
          />
          {index === 0 ? (
            <h3 className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[clamp(2.75rem,9vw,7rem)] font-black uppercase leading-[0.78] tracking-[-0.1em] text-white mix-blend-difference">
              {title}
            </h3>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function InfluencerArchive({
  images,
  title,
  accent,
}: {
  images: readonly string[];
  title: string;
  accent: string;
}) {
  const centerIndex = Math.min(1, images.length - 1);
  const center = images[centerIndex]!;
  const sides = images.filter((_, index) => index !== centerIndex);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="relative overflow-hidden">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[28rem] overflow-hidden border border-black/15 bg-black/10 sm:max-w-[34rem]">
          <PortfolioImage
            src={center}
            alt={`${title} — primary`}
            fill
            sizes="34rem"
            className="object-cover"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${accent}, transparent, ${accent})`,
            }}
          />
          <h3 className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.78] tracking-[-0.1em] text-white mix-blend-difference">
            {title}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {sides.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative aspect-[4/5] overflow-hidden border border-black/15 bg-black/10"
          >
            <PortfolioImage
              src={src}
              alt={`${title} ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorksCategoryShowcase({
  slug,
  category,
  lang,
}: {
  slug: WorkCategorySlug;
  category: WorkCategory;
  lang: LangKey;
}) {
  if (slug === "websites") {
    return (
      <section
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        style={{ backgroundColor: category.accent, color: category.foreground }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10">
            <ProjectMarquee
              text={category.marqueeText}
              accessibleLabel={category.shortTitle.en}
              stripBackground={category.marqueeBackground}
              textColor={category.marqueeTextColor}
              dividerColor={category.dividerColor}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {WEB_PROJECTS.map((project) => (
              <WebsiteLandingCard key={project.title} project={project} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (slug === "character-design") {
    const project = getCharacterProject();
    const images = project.images?.length ? project.images : [project.image];
    const title = project.langs[lang]?.title ?? "YOUNG MI";

    return (
      <section
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        style={{ backgroundColor: category.accent, color: category.foreground }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: category.muted }}>
            <span>{project.langs[lang]?.cat}</span>
            <span>{project.year}</span>
          </div>
          <CharacterArchive images={images} title={title} />
          <div className="mt-10">
            <ProjectMarquee
              text={category.marqueeText}
              accessibleLabel={category.shortTitle.en}
              stripBackground={category.marqueeBackground}
              textColor={category.marqueeTextColor}
              dividerColor={category.dividerColor}
            />
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className={`max-w-md text-sm leading-relaxed sm:text-base ${localeCase(lang)}`} style={{ color: category.muted }}>
              {project.langs[lang]?.desc}
            </p>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: category.muted }}>
              01 / 01 · character study
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (slug === "ai-influencer") {
    const project = getInfluencerProject();
    const images = project.images?.length ? project.images : [project.image];
    const title = project.langs[lang]?.title ?? "PINK ARMY";

    return (
      <section
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        style={{ backgroundColor: category.accent, color: category.foreground }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: category.muted }}>
            <span>{project.langs[lang]?.cat}</span>
            <span>{project.year}</span>
          </div>
          <InfluencerArchive images={images} title={title} accent={category.accent} />
          <div className="mt-10">
            <ProjectMarquee
              text={category.marqueeText}
              accessibleLabel="Pink Army"
              stripBackground={category.marqueeBackground}
              textColor={category.marqueeTextColor}
              dividerColor={category.dividerColor}
            />
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className={`max-w-md text-sm leading-relaxed sm:text-base ${localeCase(lang)}`} style={{ color: category.muted }}>
              {project.langs[lang]?.desc}
            </p>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: category.muted }}>
              01 / 01 · moving identity
            </span>
          </div>
        </div>
      </section>
    );
  }

  const items = getNftItems();

  return (
    <section
      className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      style={{ backgroundColor: category.accent, color: category.foreground }}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: category.muted }}>
              Foundation / 1 of 1
            </p>
            <h2 className={`mt-3 text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] ${localeCase(lang)}`}>
              {lang === "fa" ? "دارایی‌ها" : "ON-CHAIN"}
            </h2>
          </div>
          <p className={`max-w-md text-sm leading-relaxed ${localeCase(lang)}`} style={{ color: category.muted }}>
            {lang === "fa"
              ? "مجموعه‌ای از آثار دیجیتال مستقل، هرکدام با صفحه‌ی اختصاصی برای مشاهده و مینت."
              : "A collection of independent digital pieces, each with its own page for viewing and minting."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((nft) => (
            <a
              key={nft.id}
              href={nft.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/5] overflow-hidden border border-black/15 bg-black/10 outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              aria-label={`${nft.langs[lang]?.title ?? "NFT"} — ${nft.langs[lang]?.cat ?? "1/1"}`}
            >
              <PortfolioImage
                src={nft.image}
                alt={nft.langs[lang]?.title ?? "NFT"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80">
                {nft.langs[lang]?.title}
              </div>
            </a>
          ))}
        </div>
        <div className="mt-12">
          <ProjectMarquee
            text={category.marqueeText}
            accessibleLabel="NFT Collection"
            stripBackground={category.marqueeBackground}
            textColor={category.marqueeTextColor}
            dividerColor={category.dividerColor}
          />
        </div>
      </div>
    </section>
  );
}
