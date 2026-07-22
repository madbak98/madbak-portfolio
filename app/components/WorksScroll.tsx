"use client";

import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { NFT_ITEMS, PROJECTS, type LangKey } from "../lib/portfolio-data";
import { WEB_PROJECTS } from "../lib/works-categories";
import { PortfolioImage } from "./PortfolioImage";
import { ProjectMarquee } from "./ProjectMarquee";
import { localeCase, trackHeading, trackMeta } from "../lib/locale-ui";
import Link from "next/link";

type Project = (typeof PROJECTS)[number];
type GenreVariant = "character" | "influencer" | "fashion" | "poster";

const GENRES: {
  id: string;
  number: string;
  variant: GenreVariant;
  href: string;
  projectIds: readonly string[];
  title: Record<LangKey, string>;
  description: Record<LangKey, string>;
}[] = [
  {
    id: "character",
    number: "01",
    variant: "character",
    href: "/works/character-design",
    projectIds: ["01"],
    title: { en: "CHARACTER DESIGN", fa: "طراحی کاراکتر", tr: "KARAKTER TASARIMI" },
    description: {
      en: "One character study, presented as a focused visual identity.",
      fa: "یک مطالعه‌ی کاراکتر، به‌عنوان یک هویت بصری متمرکز.",
      tr: "Tek bir karakter çalışması, odaklanmış bir görsel kimlik olarak sunuluyor.",
    },
  },
  {
    id: "influencer",
    number: "02",
    variant: "influencer",
    href: "/works/ai-influencer",
    projectIds: ["02"],
    title: { en: "AI INFLUENCER", fa: "اینفلوئنسر هوش مصنوعی", tr: "YZ INFLUENCER" },
    description: {
      en: "Synthetic identity, styling, and image-making in a moving feed.",
      fa: "هویت مصنوعی، استایل و تصویرسازی در یک فید همیشه متحرک.",
      tr: "Hareketli bir akışta sentetik kimlik, stil ve görsel üretim.",
    },
  },
];

const WEB_CARD_SLOTS = [
  "col-span-2 sm:col-span-3 lg:col-span-6",
  "col-span-2 sm:col-span-3 lg:col-span-6",
] as const;

/** Shared slideshow timing for SIGMAA.PRO + ART GALLERY cards */
const WEB_CARD_AUTOPLAY_MS = 3700;
const WEB_CARD_CROSSFADE_S = 0.55;

const SIGMA_META_CATEGORY: Record<LangKey, string> = {
  en: "Web3 Growth Platform",
  fa: "پلتفرم رشد وب۳",
  tr: "Web3 Büyüme Platformu",
};

const ART_GALLERY_META_TITLE: Record<LangKey, string> = {
  en: "Art Gallery",
  fa: "گالری هنری",
  tr: "Sanat Galerisi",
};

const ART_GALLERY_META_CATEGORY: Record<LangKey, string> = {
  en: "Cultural Website",
  fa: "وب‌سایت فرهنگی",
  tr: "Kültürel Web Sitesi",
};

const LIVE_WEBSITE_LABEL: Record<LangKey, string> = {
  en: "Live Website",
  fa: "وب‌سایت زنده",
  tr: "Canlı Site",
};

const ProjectTitleDisplay = memo(function ProjectTitleDisplay({
  project,
  lang,
}: {
  project: Project;
  lang: LangKey;
}) {
  const title = project.langs[lang]?.title ?? "";
  const lines =
    "titleStack" in project && project.titleStack
      ? project.titleStack[lang]
      : undefined;

  if (!lines?.length) return <span dir="auto">{title}</span>;

  return (
    <span
      dir="auto"
      className={`flex flex-col ${lang === "fa" ? "gap-1 leading-[1.1]" : "gap-0 leading-[0.86]"}`}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </span>
  );
});

function ChapterProject({
  project,
  index,
  lang,
  variant,
}: {
  project: Project;
  index: number;
  lang: LangKey;
  variant: GenreVariant;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [70, 0, -70]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1, 1.08]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [0, 0, 0] : variant === "character" ? [-3, 0, 3] : variant === "poster" ? [4, 0, -4] : [1.5, 0, -1.5],
  );
  const railX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-28%"]);
  const fashionRailX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-58%"]);
  const reveal = useTransform(
    scrollYProgress,
    [0, 0.35, 0.72, 1],
    reduce
      ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
      : ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 100%)"],
  );

  const title = project.langs[lang]?.title ?? "";
  const category = project.langs[lang]?.cat ?? "";
  const description = project.langs[lang]?.desc ?? "";
  const images = project.images?.length ? project.images : [project.image];

  if (variant === "influencer" || variant === "character") {
    const isPinkArmy = variant === "influencer";
    const isYoungMi = variant === "character";

    const gallery = (
      <div className="relative h-[48svh] overflow-hidden sm:h-[56svh]" dir="ltr">
        <motion.div
          className="absolute inset-y-0 left-0 flex w-max items-center gap-4 sm:gap-6"
          style={{ x: railX }}
        >
          {[...images, ...images].map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-[72%] w-[34vw] min-w-[12rem] max-w-[25rem] overflow-hidden bg-[#1b232b] sm:h-[82%]">
              <PortfolioImage src={src} alt={`${title} character design artwork by Madbak`} fill sizes="25rem" className="object-cover" priority={i === 0} />
            </div>
          ))}
        </motion.div>
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent ${
            isPinkArmy
              ? "from-[#ff00cc] to-[#ff00cc]"
              : isYoungMi
                ? "from-[#33FF00] to-[#33FF00]"
                : "from-[#10151b] to-[#10151b]"
          }`}
        />
        <motion.h3
          className={`pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[clamp(3rem,11vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.1em] mix-blend-difference ${
            isPinkArmy || isYoungMi ? "text-white" : "text-[#F4F0E8]"
          }`}
          style={{ y }}
        >
          <ProjectTitleDisplay project={project} lang={lang} />
        </motion.h3>
      </div>
    );

    const descriptionBlock = (
      <div className="mt-8 flex flex-col gap-4 pt-0 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
        <p
          className={`max-w-md text-sm leading-relaxed sm:text-base ${localeCase(lang)} ${
            isPinkArmy || isYoungMi ? "text-black/70" : "text-white/55"
          }`}
        >
          {description}
        </p>
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.2em] ${
            isPinkArmy || isYoungMi ? "text-black/75" : "text-[#C45C4A]"
          }`}
        >
          {variant === "character" ? "01 / 01 · character study" : "01 / 01 · moving identity"}
        </span>
      </div>
    );

    return (
      <article
        ref={ref}
        className={`relative min-h-[86svh] overflow-hidden border-t px-5 py-8 sm:px-8 lg:px-12 ${
          isPinkArmy
            ? "border-black/15 bg-[#ff00cc] text-[#0A0A0A]"
            : isYoungMi
              ? "border-black/15 bg-[#33FF00] text-[#0A0A0A]"
              : "border-white/10 bg-[#10151b] text-[#F4F0E8]"
        }`}
        dir={lang === "fa" ? "rtl" : "ltr"}
      >
        <div className="mx-auto flex min-h-[78svh] max-w-[1400px] flex-col justify-between">
          <div
            className={`flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] ${
              isPinkArmy || isYoungMi ? "text-black/55" : "text-[#A9BDC6]"
            }`}
          >
            <span>{category}</span>
            <span>{project.year}</span>
          </div>

          <div className="relative my-10 overflow-hidden">{gallery}</div>

          {isPinkArmy ? (
            <ProjectMarquee
              text="PINK ARMY"
              accessibleLabel="PINK ARMY"
              stripBackground="rgba(180, 0, 95, 0.28)"
              textColor="#ff9bd5"
              dividerColor="rgba(0, 0, 0, 0.2)"
              lang={lang}
            />
          ) : null}

          {isYoungMi ? (
            <ProjectMarquee
              text={
                lang === "fa"
                  ? "طراحی کاراکتر"
                  : lang === "tr"
                    ? "KARAKTER TASARIMI"
                    : "CHARACTER DESIGN"
              }
              accessibleLabel={
                lang === "fa"
                  ? "طراحی کاراکتر"
                  : lang === "tr"
                    ? "KARAKTER TASARIMI"
                    : "Character Design"
              }
              stripBackground="rgba(22, 125, 0, 0.38)"
              textColor="#d9ffcc"
              dividerColor="rgba(0, 0, 0, 0.42)"
              lang={lang}
            />
          ) : null}

          {descriptionBlock}
        </div>
      </article>
    );
  }

  if (variant === "fashion") {
    return (
      <article ref={ref} className="relative min-h-[92svh] overflow-hidden border-t border-black/10 bg-[#D9CBB6] px-5 py-8 text-[#1C1A17] sm:px-8 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
        <div className="mx-auto flex min-h-[84svh] max-w-[1400px] flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[#6E6A63]">
            <span>{category}</span>
            <span>{project.year}</span>
          </div>
          <div className="relative grid flex-1 items-center gap-8 py-10 md:grid-cols-[0.72fr_1.5fr] md:gap-12 lg:gap-20">
            <div className="relative z-10 order-2 md:order-1">
              <motion.p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#C45C4A]" style={{ y: reduce ? 0 : y }}>
                {String(index + 1).padStart(2, "0")} · campaign study
              </motion.p>
              <h3 className={`mt-5 text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[0.76] tracking-[-0.09em] ${localeCase(lang)} ${trackHeading(lang)}`}>
                <ProjectTitleDisplay project={project} lang={lang} />
              </h3>
              <p className={`mt-7 max-w-sm text-sm leading-relaxed text-[#6E6A63] sm:text-base ${localeCase(lang)}`}>{description}</p>
            </div>
            <motion.div className="relative order-1 h-[54svh] min-h-[22rem] overflow-hidden bg-[#12141A] md:order-2 md:h-[62svh]" style={{ clipPath: reveal, y: reduce ? 0 : y }} dir="ltr">
              <motion.div className="absolute inset-y-0 left-0 flex w-max items-center gap-4 p-5 md:gap-6 md:p-8" style={{ x: fashionRailX }}>
                {images.map((src, i) => (
                  <div key={`${src}-${i}`} className="relative h-[78%] w-[min(68vw,34rem)] shrink-0 overflow-hidden border border-white/15 bg-[#1B1B1B] md:h-[84%]">
                    <PortfolioImage src={src} alt={`${title} ${i + 1}`} fill priority={i === 0} sizes="34rem" className="object-contain" />
                  </div>
                ))}
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#12141A] via-transparent to-[#12141A] opacity-80" />
              <div className="pointer-events-none absolute bottom-5 start-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 md:bottom-8 md:start-8">{images.length} frames · scroll to explore</div>
            </motion.div>
          </div>
          <div className="border-t border-black/15 pt-4 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6E6A63]">{category} · MADBAK archive</div>
        </div>
      </article>
    );
  }

  if (variant === "poster") {
    return (
      <article ref={ref} className="relative min-h-[92svh] overflow-hidden border-t border-white/10 bg-[#C45C4A] px-5 py-8 text-[#F4F0E8] sm:px-8 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
        <div className="mx-auto grid min-h-[84svh] max-w-[1400px] items-center gap-10 md:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div className="relative z-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/65">{category} · {project.year}</p>
            <h3 className={`mt-5 text-[clamp(3.3rem,9vw,9rem)] font-black uppercase leading-[0.72] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`}>
              <ProjectTitleDisplay project={project} lang={lang} />
            </h3>
            <p className={`mt-7 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base ${localeCase(lang)}`}>{description}</p>
          </div>
          <div className="relative flex min-h-[54svh] items-center justify-center py-8 sm:min-h-[70svh]" dir="ltr">
            {images.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                className="absolute h-[52svh] w-[min(68vw,24rem)] overflow-hidden border border-white/35 bg-[#12141A] shadow-2xl sm:h-[62svh]"
                style={{
                  y: reduce ? 0 : y,
                  rotate: reduce ? 0 : rotate,
                  x: `${(i - Math.min(images.length - 1, 3) / 2) * 22}%`,
                  scale: 1 - i * 0.045,
                  zIndex: images.length - i,
                }}
              >
                <PortfolioImage src={src} alt={`${title} ${i + 1}`} fill sizes="24rem" className="object-cover" priority={i === 0} />
              </motion.div>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article ref={ref} className="relative min-h-[92svh] overflow-hidden border-t border-black/10 bg-[#F4F0E8] px-5 py-8 text-[#1C1A17] sm:px-8 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
      <div className="mx-auto grid min-h-[84svh] max-w-[1400px] items-center gap-10 md:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="relative z-10 order-2 md:order-1">
          <p className={`font-mono text-[10px] uppercase tracking-[0.25em] text-[#6E6A63] ${localeCase(lang)} ${trackMeta(lang)}`}>{category} · {project.year}</p>
          <h3 className={`mt-5 text-[clamp(3.25rem,9vw,9rem)] font-black uppercase leading-[0.74] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`}>
            <ProjectTitleDisplay project={project} lang={lang} />
          </h3>
          <p className={`mt-7 max-w-sm text-sm leading-relaxed text-[#6E6A63] sm:text-base ${localeCase(lang)}`}>{description}</p>
          <div className="mt-8 h-px w-16 bg-[#A9BDC6]" aria-hidden />
        </div>
        <div className="relative order-1 flex min-h-[54svh] items-center justify-center md:order-2 md:min-h-[70svh]">
          <motion.div className="absolute h-[54svh] w-[min(70vw,27rem)] overflow-hidden border border-[#1C1A17]/20 bg-[#12141A] shadow-[18px_20px_0_rgba(169,189,198,0.28)] sm:h-[66svh]" style={{ y, scale, rotate }}>
            <PortfolioImage src={project.image} alt={title} fill priority={index === 0} sizes="(max-width: 768px) 70vw, 30rem" className="object-contain" />
          </motion.div>
          <motion.p className="pointer-events-none absolute -bottom-2 start-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(4rem,15vw,13rem)] font-black uppercase leading-none tracking-[-0.12em] text-[#1C1A17]/[0.07]" style={{ y: reduce ? 0 : y }} aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </motion.p>
        </div>
      </div>
    </article>
  );
}

function GenreSection({
  genre,
  projects,
  lang,
}: {
  genre: (typeof GENRES)[number];
  projects: Project[];
  lang: LangKey;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  return (
    <section id={genre.id} ref={ref} className="relative scroll-mt-24 overflow-hidden" dir={lang === "fa" ? "rtl" : "ltr"}>
      <header
        className={`relative flex min-h-[46svh] items-end overflow-hidden px-5 pb-10 pt-20 sm:min-h-[52svh] sm:px-8 sm:pb-14 lg:px-12 ${
          genre.id === "influencer"
            ? "bg-[#ff00cc] text-[#0A0A0A]"
            : genre.id === "character"
              ? "bg-[#33FF00] text-[#0A0A0A]"
              : "bg-[#080808] text-[#F4F0E8]"
        }`}
      >
        <motion.div
          className={`pointer-events-none absolute -right-[2.8rem] top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(10rem,30vw,32rem)] font-black uppercase leading-none tracking-[-0.13em] ${
            genre.id === "influencer" || genre.id === "character"
              ? "text-black/[0.08]"
              : "text-white/[0.05]"
          }`}
          style={{ y: headingY }}
          aria-hidden
        >
          {genre.number}
        </motion.div>
        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div
            className={`flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] ${
              genre.id === "influencer" || genre.id === "character"
                ? "text-black/55"
                : "text-[#A9BDC6]"
            }`}
          >
            <span>{genre.number} / {String(GENRES.length).padStart(2, "0")}</span>
            <span>{projects.length} {lang === "fa" ? "اثر" : "editions"}</span>
          </div>
          <motion.h2 className={`mt-6 max-w-[11ch] text-[clamp(3.75rem,12vw,12rem)] font-black uppercase leading-[0.73] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`} style={{ y: headingY }}>
            {genre.title[lang]}
          </motion.h2>
          <p
            className={`mt-7 max-w-md text-sm leading-relaxed sm:text-base ${localeCase(lang)} ${
              genre.id === "influencer" || genre.id === "character"
                ? "text-black/70"
                : "text-white/55"
            }`}
          >
            {genre.description[lang]}
          </p>
          <Link
            href={genre.href}
            className={`mt-8 inline-flex min-h-[44px] items-center font-mono text-[10px] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 ${
              lang === "fa" ? "tracking-[0]" : "uppercase tracking-[0.22em]"
            } ${
              genre.id === "influencer" || genre.id === "character"
                ? "text-black/75"
                : "text-[#A9BDC6]"
            }`}
          >
            {lang === "fa" ? "باز کردن آرشیو" : lang === "tr" ? "Arşivi aç" : "Open archive"}
            <span aria-hidden className="ms-2">
              {lang === "fa" ? "←" : "→"}
            </span>
          </Link>
        </div>
      </header>

      {projects.map((project, i) => (
        <ChapterProject key={project.id} project={project} index={i} lang={lang} variant={genre.variant} />
      ))}
    </section>
  );
}

function EditorialWebCard({
  title,
  href,
  images,
  imageAlts,
  meta,
  slotClass,
  frameTone = "warm",
}: {
  title: string;
  href: string;
  images: readonly string[];
  imageAlts?: readonly string[];
  meta: readonly string[];
  slotClass: string;
  frameTone?: "warm" | "dark";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 220, damping: 26, mass: 0.4 });
  const springY = useSpring(tiltY, { stiffness: 220, damping: 26, mass: 0.4 });
  const liftY = useSpring(0, { stiffness: 260, damping: 28, mass: 0.35 });
  const cardScale = useSpring(1, { stiffness: 260, damping: 28, mass: 0.35 });

  const tiltEnabled = Boolean(!reduce && isPointerFine);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setIsPointerFine(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce || images.length < 2) return;
    if (isPointerFine && isHovering) return;
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, WEB_CARD_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [images.length, isHovering, isPointerFine, reduce]);

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    liftY.set(0);
    cardScale.set(1);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (isPointerFine && images.length > 1) {
      const ratio = Math.min(0.999, Math.max(0, (event.clientX - rect.left) / rect.width));
      setActiveImage(Math.floor(ratio * images.length));
    }
    if (!tiltEnabled) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(Math.max(-3, Math.min(3, -py * 6)));
    tiltY.set(Math.max(-3, Math.min(3, px * 6)));
  };

  const frameBg = frameTone === "dark" ? "bg-[#141414]" : "bg-[#E8E4DC]";

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={() => {
        setIsHovering(true);
        if (tiltEnabled) {
          liftY.set(-6);
          cardScale.set(1.012);
        }
      }}
      onPointerLeave={() => {
        setIsHovering(false);
        setActiveImage(0);
        resetTilt();
      }}
      onPointerMove={handlePointerMove}
      className={`group relative flex h-full flex-col rounded-[1.5rem] border border-[#1C1A17]/08 bg-[#F7F3EB] text-[#1C1A17] outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-[#A9BDC6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F0E8] sm:rounded-[1.75rem] lg:rounded-[2rem] ${slotClass}`}
      style={{
        rotateX: tiltEnabled ? springX : 0,
        rotateY: tiltEnabled ? springY : 0,
        y: tiltEnabled ? liftY : 0,
        scale: tiltEnabled ? cardScale : 1,
        transformPerspective: 1400,
        boxShadow: isHovering && tiltEnabled
          ? "inset 0 1px 0 rgba(255,255,255,0.72), 0 1px 2px rgba(28,26,23,0.05), 0 22px 48px -14px rgba(28,26,23,0.2)"
          : "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(28,26,23,0.04), 0 16px 36px -14px rgba(28,26,23,0.14)",
      }}
      aria-label={`${title} — ${meta[0] ?? title}`}
    >
      <div className="relative flex min-h-0 flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] border border-[#1C1A17]/10 sm:aspect-[16/10] sm:rounded-[1.5rem] lg:rounded-[1.75rem] ${frameBg} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_28px_-12px_rgba(28,26,23,0.28)] transition-[box-shadow,border-color] duration-500 group-hover:border-[#1C1A17]/14 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_34px_-12px_rgba(28,26,23,0.34)]`}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={images[activeImage]}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: WEB_CARD_CROSSFADE_S, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={images[activeImage]}
                alt={imageAlts?.[activeImage] ?? `${title} preview ${activeImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42rem"
                priority={activeImage === 0}
                quality={92}
                className="object-contain object-center p-2 sm:p-2.5"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 ? (
            <div className="absolute bottom-3 end-3 z-10 flex gap-1.5 sm:bottom-4 sm:end-4" aria-hidden>
              {images.map((src, index) => (
                <span
                  key={src}
                  className={`h-1 w-1 rounded-full transition-all duration-300 sm:h-1.5 sm:w-1.5 ${
                    index === activeImage
                      ? frameTone === "dark"
                        ? "scale-125 bg-white"
                        : "scale-125 bg-[#1C1A17]"
                      : frameTone === "dark"
                        ? "bg-white/35"
                        : "bg-[#1C1A17]/25"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-4 sm:mt-5 sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6E6A63] sm:text-[10px]">
              {meta.map((item, index) => (
                <span key={`${item}-${index}`} className="contents">
                  {index > 0 ? (
                    <span className="text-[#1C1A17]/25" aria-hidden>
                      /
                    </span>
                  ) : null}
                  <span
                    className={
                      index === 0
                        ? "text-[#C45C4A]"
                        : index === meta.length - 1
                          ? "text-[#1C1A17]/70"
                          : undefined
                    }
                  >
                    {item}
                  </span>
                </span>
              ))}
            </div>
            <h3 className="mt-2 text-[clamp(1.75rem,4.2vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#1C1A17]">
              {title}
            </h3>
          </div>

          <span
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1C1A17] text-white shadow-[0_8px_18px_-10px_rgba(28,26,23,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-11 sm:w-11"
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function WebProjectsSection({ lang }: { lang: LangKey }) {
  return (
    <section id="websites" className="relative scroll-mt-24 overflow-x-clip border-t border-black/10 bg-[#F4F0E8] px-5 py-20 text-[#1C1A17] sm:px-8 sm:py-28 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-12 flex flex-col gap-6 border-t-2 border-[#1C1A17] pt-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C45C4A]">{lang === "fa" ? "نمونه‌کار وب‌سایت" : "WEBSITE WORK"}</p>
            <h2 className="mt-5 max-w-[9ch] text-[clamp(4rem,13vw,12rem)] font-black uppercase leading-[0.72] tracking-[-0.1em]">{lang === "fa" ? "وب‌سایت‌ها" : "WEBSITES"}</h2>
          </div>
          <p className={`max-w-sm text-sm leading-relaxed text-[#6E6A63] sm:text-base ${localeCase(lang)}`}>
            {lang === "fa" ? "هر کارت برای یک وب‌سایت است؛ با اضافه‌شدن پروژه‌های جدید، همین گرید کامل‌تر می‌شود." : "Each card belongs to one website. New projects can be added to the same living grid."}
          </p>
        </header>
        <div className="mb-10">
          <Link
            href="/works/websites"
            className={`inline-flex min-h-[44px] items-center font-mono text-[10px] text-[#1C1A17]/70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1A17]/35 ${
              lang === "fa" ? "tracking-[0]" : "uppercase tracking-[0.22em]"
            }`}
          >
            {lang === "fa" ? "باز کردن آرشیو وب‌سایت‌ها" : lang === "tr" ? "Web arşivini aç" : "Open websites archive"}
            <span aria-hidden className="ms-2">
              {lang === "fa" ? "←" : "→"}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-6 sm:gap-6 lg:grid-cols-12 lg:gap-7">
          {WEB_PROJECTS.map((project, index) => {
            const slotClass = WEB_CARD_SLOTS[index] ?? WEB_CARD_SLOTS[0];
            const isFeatured = "featured" in project && project.featured;
            const meta = isFeatured
              ? [
                  ART_GALLERY_META_TITLE[lang],
                  ART_GALLERY_META_CATEGORY[lang],
                  "2026",
                  LIVE_WEBSITE_LABEL[lang],
                ]
              : [
                  project.label[lang],
                  SIGMA_META_CATEGORY[lang],
                  "2026",
                  LIVE_WEBSITE_LABEL[lang],
                ];

            return (
              <EditorialWebCard
                key={project.title}
                title={project.title}
                href={project.href}
                images={project.images}
                imageAlts={"imageAlts" in project ? project.imageAlts : undefined}
                meta={meta}
                slotClass={slotClass}
                frameTone={isFeatured ? "warm" : "dark"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NFTSection({ lang }: { lang: LangKey }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const railX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-34%"]);

  return (
    <section id="nfts" ref={ref} className="relative scroll-mt-24 overflow-hidden" dir={lang === "fa" ? "rtl" : "ltr"}>
      <header className="relative flex min-h-[46svh] items-end overflow-hidden bg-[#00CCFF] px-5 pb-10 pt-20 text-[#050505] sm:min-h-[52svh] sm:px-8 sm:pb-14 lg:px-12">
        <motion.div
          className="pointer-events-none absolute -right-[2.8rem] top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(10rem,30vw,32rem)] font-black leading-none tracking-[-0.13em] text-black/[0.08]"
          style={{ y: headingY }}
          aria-hidden
        >
          03
        </motion.div>
        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-black/55">
            <span>03 / 03</span>
            <span>
              {NFT_ITEMS.length}{" "}
              {lang === "fa" ? "اثر" : lang === "tr" ? "edisyon" : "editions"}
            </span>
          </div>
          <motion.h2 className={`mt-6 max-w-[11ch] text-[clamp(3.75rem,12vw,12rem)] font-black uppercase leading-[0.73] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`} style={{ y: headingY }}>
            {lang === "fa"
              ? "مجموعه NFT"
              : lang === "tr"
                ? "NFT KOLEKSİYONU"
                : "NFT COLLECTION"}
          </motion.h2>
          <p className={`mt-7 max-w-md text-sm leading-relaxed text-black/70 sm:text-base ${localeCase(lang)}`}>
            {lang === "fa"
              ? "تمام نسخه‌ها در یک فید متحرک؛ هر اثر به صفحه‌ی اصلی خودش لینک شده است."
              : lang === "tr"
                ? "Her edisyon tek bir hareketli akışta; her parça kendi mint sayfasına bağlı."
                : "Every edition in one moving feed, with each piece linked to its original mint page."}
          </p>
          <Link
            href="/works/nft-collection"
            className={`mt-8 inline-flex min-h-[44px] items-center font-mono text-[10px] text-black/75 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 ${
              lang === "fa" ? "tracking-[0]" : "uppercase tracking-[0.22em]"
            }`}
          >
            {lang === "fa" ? "باز کردن آرشیو NFT" : lang === "tr" ? "NFT arşivini aç" : "Open NFT archive"}
            <span aria-hidden className="ms-2">
              {lang === "fa" ? "←" : "→"}
            </span>
          </Link>
        </div>
      </header>

      <article className="relative min-h-[86svh] overflow-hidden border-t border-black/15 bg-[#00CCFF] px-5 py-8 text-[#050505] sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[78svh] max-w-[1400px] flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-black/55">
            <span>Foundation / 1 of 1</span>
            <span>{NFT_ITEMS.length} frames</span>
          </div>

          <div className="relative my-10 overflow-hidden" dir="ltr">
            <div className="relative h-[48svh] overflow-hidden sm:h-[56svh]">
              <motion.div className="absolute inset-y-0 left-0 flex w-max items-center gap-4 sm:gap-6" style={{ x: railX }}>
                {[...NFT_ITEMS, ...NFT_ITEMS].map((nft, i) => (
                  <a
                    key={`${nft.id}-${i}`}
                    href={nft.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative h-[72%] w-[34vw] min-w-[12rem] max-w-[25rem] overflow-hidden bg-[#1b232b] outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:h-[82%]"
                    aria-label={`${nft.langs[lang]?.title ?? "NFT"} — ${nft.langs[lang]?.cat ?? "1/1"}`}
                  >
                    <PortfolioImage src={nft.image} alt={`${nft.langs[lang]?.title ?? "NFT"} — Foundation 1/1 edition by Madbak`} fill sizes="25rem" className="object-cover transition duration-700 group-hover:scale-[1.04]" priority={i === 0} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75">
                      {nft.langs[lang]?.title}
                    </div>
                  </a>
                ))}
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00CCFF] via-transparent to-[#00CCFF]" />
              <motion.h3
                className={`pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[clamp(3rem,11vw,10rem)] font-black leading-[0.78] text-white mix-blend-difference ${
                  lang === "fa" ? "tracking-[0]" : "uppercase tracking-[-0.1em]"
                } ${localeCase(lang)}`}
                style={{ y: headingY }}
              >
                {lang === "fa" ? "آن‌چین" : "ON-CHAIN"}
              </motion.h3>
            </div>
          </div>

          <ProjectMarquee
            text={
              lang === "fa"
                ? "مجموعه NFT"
                : lang === "tr"
                  ? "NFT KOLEKSİYONU"
                  : "NFT COLLECTION"
            }
            accessibleLabel={
              lang === "fa"
                ? "مجموعه NFT"
                : lang === "tr"
                  ? "NFT KOLEKSİYONU"
                  : "NFT Collection"
            }
            stripBackground="rgba(0, 105, 135, 0.34)"
            textColor="#c9f7ff"
            dividerColor="rgba(0, 0, 0, 0.42)"
            lang={lang}
          />

          <div className="mt-8 flex flex-col gap-4 pt-0 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <p className={`max-w-md text-sm leading-relaxed text-black/70 sm:text-base ${localeCase(lang)}`}>
              {lang === "fa"
                ? "مجموعه‌ای از آثار دیجیتال مستقل، هرکدام با صفحه‌ی اختصاصی برای مشاهده و مینت."
                : lang === "tr"
                  ? "Her biri görüntüleme ve mint için kendi sayfasına sahip bağımsız dijital parçalar koleksiyonu."
                  : "A collection of independent digital pieces, each with its own page for viewing and minting."}
            </p>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/75">
              {NFT_ITEMS.length} / {NFT_ITEMS.length} ·{" "}
              {lang === "fa"
                ? "نسخه‌های تاییدشده"
                : lang === "tr"
                  ? "doğrulanmış edisyonlar"
                  : "verified editions"}
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}

export function WorksScroll({
  lang,
}: {
  lang: LangKey;
}) {
  return (
    <section id="works" className="relative z-20 overflow-hidden bg-[#080808] text-[#F4F0E8]">
      <header className="relative flex min-h-[74svh] items-end overflow-hidden border-t border-white/10 px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(169,189,198,0.16),transparent_38%)]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div>
            <p className={`font-mono text-[10px] uppercase tracking-[0.3em] text-[#A9BDC6] ${localeCase(lang)} ${trackMeta(lang)}`}>{lang === "fa" ? "آرشیو پروژه‌ها" : "PROJECT ARCHIVE"}</p>
            <h2 className={`mt-5 max-w-[9ch] text-[clamp(5rem,17vw,16rem)] font-black uppercase leading-[0.73] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`}>
              {lang === "fa" ? "آثار" : "WORKS"}
            </h2>
            <p className={`mt-8 max-w-sm text-sm leading-relaxed text-white/55 sm:text-base ${localeCase(lang)}`}>
              {lang === "fa" ? "هر ژانر، یک فصل مستقل با ریتم و زبان تصویری مخصوص خودش." : lang === "tr" ? "Her tür, kendi ritmi ve görsel dili olan bağımsız bir bölüm." : "Each genre is its own chapter, with a distinct visual language and motion rhythm."}
            </p>
          </div>
        </div>
      </header>

      <WebProjectsSection lang={lang} />

      {GENRES.map((genre) => {
        const projects = genre.projectIds
          .map((id) => PROJECTS.find((project) => project.id === id))
          .filter((project): project is Project => Boolean(project));
        return <GenreSection key={genre.id} genre={genre} projects={projects} lang={lang} />;
      })}

      <NFTSection lang={lang} />
    </section>
  );
}
