"use client";

import { memo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { PROJECTS, type LangKey } from "../lib/portfolio-data";
import { PortfolioImage } from "./PortfolioImage";
import { localeCase, trackHeading, trackMeta } from "../lib/locale-ui";

type Project = (typeof PROJECTS)[number];
type GenreVariant = "character" | "influencer" | "fashion" | "poster";

const GENRES: {
  id: string;
  number: string;
  variant: GenreVariant;
  projectIds: readonly string[];
  title: Record<LangKey, string>;
  description: Record<LangKey, string>;
}[] = [
  {
    id: "character",
    number: "01",
    variant: "character",
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
    projectIds: ["02"],
    title: { en: "AI INFLUENCER", fa: "اینفلوئنسر هوش مصنوعی", tr: "YZ INFLUENCER" },
    description: {
      en: "Synthetic identity, styling, and image-making in a moving feed.",
      fa: "هویت مصنوعی، استایل و تصویرسازی در یک فید همیشه متحرک.",
      tr: "Hareketli bir akışta sentetik kimlik, stil ve görsel üretim.",
    },
  },
  {
    id: "fashion",
    number: "03",
    variant: "fashion",
    projectIds: ["04"],
    title: { en: "FASHION / CAMPAIGN", fa: "فشن / کمپین", tr: "MODA / KAMPANYA" },
    description: {
      en: "Luxury references, pop symbols, and a campaign imagined as a moving image.",
      fa: "ارجاع‌های لوکس، نمادهای پاپ و کمپینی که مثل یک تصویر متحرک ساخته شده است.",
      tr: "Lüks referanslar, pop sembolleri ve hareketli bir görüntü gibi tasarlanan kampanya.",
    },
  },
];

const WEB_PROJECTS = [
  {
    title: "SIGMAA.PRO",
    href: "https://sigmaa.pro",
    images: [
      "/projects/sigmaa/home.png",
      "/projects/sigmaa/regions.png",
      "/projects/sigmaa/system.png",
      "/projects/sigmaa/insights.png",
    ],
    label: {
      en: "Website in development",
      fa: "نمونه وب‌سایت در حال ساخت",
      tr: "Geliştirme aşamasındaki web sitesi",
    },
    description: {
      en: "A future web direction — calm, tactile, and built for immersive storytelling.",
      fa: "یک مسیر وب‌محور برای آینده — آرام، لمسی و ساخته‌شده برای روایت غوطه‌ور.",
      tr: "Gelecekteki web yönü — sakin, dokunsal ve sürükleyici anlatı için tasarlandı.",
    },
  },
];

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
    return (
      <article ref={ref} className="relative min-h-[86svh] overflow-hidden border-t border-white/10 bg-[#10151b] px-5 py-8 text-[#F4F0E8] sm:px-8 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
        <div className="mx-auto flex min-h-[78svh] max-w-[1400px] flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[#A9BDC6]">
            <span>{category}</span>
            <span>{project.year}</span>
          </div>
          <div className="relative my-10 h-[48svh] overflow-hidden border-y border-[#A9BDC6]/25 sm:h-[56svh]">
            <motion.div className="absolute inset-y-0 flex w-max items-center gap-4 sm:gap-6" style={{ x: railX }}>
              {[...images, ...images].map((src, i) => (
                <div key={`${src}-${i}`} className="relative h-[72%] w-[34vw] min-w-[12rem] max-w-[25rem] overflow-hidden bg-[#1b232b] sm:h-[82%]">
                  <PortfolioImage src={src} alt={`${title} ${i + 1}`} fill sizes="25rem" className="object-cover" priority={i === 0} />
                </div>
              ))}
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#10151b] via-transparent to-[#10151b]" />
            <motion.h3 className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[clamp(3rem,11vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.1em] text-[#F4F0E8] mix-blend-difference" style={{ y }}>
              <ProjectTitleDisplay project={project} lang={lang} />
            </motion.h3>
          </div>
          <div className="flex flex-col gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <p className={`max-w-md text-sm leading-relaxed text-white/55 sm:text-base ${localeCase(lang)}`}>{description}</p>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C45C4A]">
              {variant === "character" ? "01 / 01 · character study" : "01 / 01 · moving identity"}
            </span>
          </div>
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
            <motion.div className="relative order-1 h-[54svh] min-h-[22rem] overflow-hidden bg-[#12141A] md:order-2 md:h-[62svh]" style={{ clipPath: reveal, y: reduce ? 0 : y }}>
              <motion.div className="absolute inset-y-0 flex w-max items-center gap-4 p-5 md:gap-6 md:p-8" style={{ x: fashionRailX }}>
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
          <div className="relative flex min-h-[54svh] items-center justify-center py-8 sm:min-h-[70svh]">
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
    <section ref={ref} className="relative overflow-hidden" dir={lang === "fa" ? "rtl" : "ltr"}>
      <header className="relative flex min-h-[70svh] items-end overflow-hidden bg-[#080808] px-5 pb-12 pt-24 text-[#F4F0E8] sm:px-8 sm:pb-16 lg:px-12">
        <motion.div className="pointer-events-none absolute -end-[8vw] top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(8rem,28vw,30rem)] font-black uppercase leading-none tracking-[-0.13em] text-white/[0.05]" style={{ y: headingY }} aria-hidden>
          {genre.number}
        </motion.div>
        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-[#A9BDC6]">
            <span>{genre.number} / {String(GENRES.length).padStart(2, "0")}</span>
            <span>{projects.length} {lang === "fa" ? "اثر" : "editions"}</span>
          </div>
          <motion.h2 className={`mt-6 max-w-[11ch] text-[clamp(3.75rem,12vw,12rem)] font-black uppercase leading-[0.73] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`} style={{ y: headingY }}>
            {genre.title[lang]}
          </motion.h2>
          <p className={`mt-7 max-w-md text-sm leading-relaxed text-white/55 sm:text-base ${localeCase(lang)}`}>{genre.description[lang]}</p>
        </div>
      </header>

      {projects.map((project, i) => (
        <ChapterProject key={project.id} project={project} index={i} lang={lang} variant={genre.variant} />
      ))}
    </section>
  );
}

function WebProjectCard({
  project,
  index,
  lang,
}: {
  project: (typeof WEB_PROJECTS)[number];
  index: number;
  lang: LangKey;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [34, 0, -34]);
  const railX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-34%"]);
  const layoutClass = WEB_PROJECTS.length === 1 ? "lg:col-span-12" : index === 0 ? "lg:col-span-8" : "lg:col-span-4";

  return (
    <motion.a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className={`group relative block min-h-[32rem] overflow-hidden rounded-[2rem] border border-black/10 bg-[#10151b] outline-none focus-visible:ring-2 focus-visible:ring-[#A9BDC6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F0E8] sm:min-h-[38rem] ${layoutClass}`}
      style={{ y }}
      aria-label={`${project.title} — ${project.label[lang]}`}
    >
      <motion.div className="absolute inset-y-0 flex w-max items-center gap-5 p-5 sm:gap-8 sm:p-8" style={{ x: railX }}>
        {project.images.map((src, imageIndex) => (
          <div key={src} className="relative h-[78%] w-[min(76vw,48rem)] shrink-0 overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#0A0E12] sm:h-[82%]">
            <PortfolioImage
              src={src}
              alt={`${project.title} ${imageIndex + 1}`}
              fill
              priority={imageIndex === 0}
              sizes="48rem"
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b13] via-transparent to-[#07132c]/10" />
      <div className="absolute start-6 top-6 z-10 font-mono text-[9px] uppercase tracking-[0.22em] text-white/55 sm:start-8 sm:top-8">MADBAK / WEB {String(index + 1).padStart(3, "0")}</div>
      <div className="absolute bottom-6 start-6 end-6 z-10 flex items-end justify-between gap-6 text-white sm:bottom-8 sm:start-8 sm:end-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A9BDC6]">{project.label[lang]}</p>
          <h3 className="mt-3 text-[clamp(2rem,6vw,5.5rem)] font-black uppercase leading-[0.78] tracking-[-0.09em]">{project.title}</h3>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
      </div>
    </motion.a>
  );
}

function WebProjectsSection({ lang }: { lang: LangKey }) {
  return (
    <section className="relative overflow-hidden border-t border-black/10 bg-[#F4F0E8] px-5 py-20 text-[#1C1A17] sm:px-8 sm:py-28 lg:px-12" dir={lang === "fa" ? "rtl" : "ltr"}>
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

        <div className="grid grid-cols-12 gap-5 sm:gap-7">
          {WEB_PROJECTS.map((project, index) => (
            <WebProjectCard key={project.title} project={project} index={index} lang={lang} />
          ))}
        </div>
      </div>
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
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] text-[#A9BDC6] ${localeCase(lang)} ${trackMeta(lang)}`}>{lang === "fa" ? "آرشیو پروژه‌ها" : "PROJECT ARCHIVE"}</p>
          <h2 className={`mt-5 max-w-[9ch] text-[clamp(5rem,17vw,16rem)] font-black uppercase leading-[0.73] tracking-[-0.1em] ${localeCase(lang)} ${trackHeading(lang)}`}>
            {lang === "fa" ? "آثار" : "WORKS"}
          </h2>
          <p className={`mt-8 max-w-sm text-sm leading-relaxed text-white/55 sm:text-base ${localeCase(lang)}`}>
            {lang === "fa" ? "هر ژانر، یک فصل مستقل با ریتم و زبان تصویری مخصوص خودش." : lang === "tr" ? "Her tür, kendi ritmi ve görsel dili olan bağımsız bir bölüm." : "Each genre is its own chapter, with a distinct visual language and motion rhythm."}
          </p>
        </div>
      </header>

      <WebProjectsSection lang={lang} />

      {GENRES.map((genre) => {
        const projects = genre.projectIds
          .map((id) => PROJECTS.find((project) => project.id === id))
          .filter((project): project is Project => Boolean(project));
        return <GenreSection key={genre.id} genre={genre} projects={projects} lang={lang} />;
      })}
    </section>
  );
}
