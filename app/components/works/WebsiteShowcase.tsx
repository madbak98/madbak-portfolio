"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import type { LangKey } from "../../lib/portfolio-data";
import {
  getWebsiteProjects,
  type WebsiteProject,
} from "../../lib/works-categories";
import { localizeDigits } from "../../lib/locale-preference";
import { localeCase, trackHeading } from "../../lib/locale-ui";

export const WEBSITE_COPY = {
  en: {
    explore: "Explore project",
    exploreTitle: (title: string) => `Explore ${title}`,
    live: "Live site",
    fullPage: "Full-page capture",
    project: "Website project",
    info: "Project information",
    category: "Category",
    type: "Project type",
    identity: "Visual identity",
    year: "Year",
    status: "Status",
    screens: "Selected screens",
    previous: "Previous project",
    next: "Next project",
    back: "All websites",
  },
  fa: {
    explore: "مشاهده پروژه",
    exploreTitle: (title: string) => `مشاهده ${title}`,
    live: "سایت زنده",
    fullPage: "نمای کامل صفحه",
    project: "پروژه وب‌سایت",
    info: "اطلاعات پروژه",
    category: "دسته‌بندی",
    type: "نوع پروژه",
    identity: "هویت بصری",
    year: "سال",
    status: "وضعیت",
    screens: "صفحه‌های منتخب",
    previous: "پروژه قبلی",
    next: "پروژه بعدی",
    back: "همه وب‌سایت‌ها",
  },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function metaClass(isFa: boolean) {
  return `font-mono text-[10px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.24em]"}`;
}

/**
 * A full-page screenshot in a minimal browser frame. The frame takes the capture's own
 * aspect ratio, so the image is never cropped or stretched, and it never grows past
 * `maxScale` × the file's native width.
 */
export function FullPageFrame({
  project,
  maxScale,
  priority = false,
  className = "",
}: {
  project: WebsiteProject;
  maxScale: number;
  priority?: boolean;
  className?: string;
}) {
  const { src, width, height, alt } = project.fullPage;
  const maxWidth = Math.round(width * maxScale);

  return (
    <figure
      className={`relative mx-auto border border-(--wt-line) bg-(--wt-bg) shadow-[0_30px_60px_-30px_var(--wt-shadow)] ${className}`}
      style={{ width: `min(100%, ${maxWidth}px)` }}
      dir="ltr"
    >
      <div className="flex items-center gap-2 border-b border-(--wt-line) px-3 py-2">
        <span aria-hidden className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-(--wt-muted) opacity-60" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--wt-muted) opacity-60" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--wt-muted) opacity-60" />
        </span>
        <span className="min-w-0 flex-1 truncate text-center font-mono text-[9px] tracking-[0.08em] text-(--wt-muted)">
          {project.domain}
        </span>
      </div>
      <div
        className="relative w-full"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`(max-width: 640px) 90vw, ${maxWidth}px`}
          quality={90}
          priority={priority}
          className="object-contain"
          draggable={false}
        />
      </div>
    </figure>
  );
}

function ShowcaseEntry({
  project,
  total,
  lang,
  flip,
  priority,
}: {
  project: WebsiteProject;
  total: number;
  lang: LangKey;
  flip: boolean;
  priority: boolean;
}) {
  const isFa = lang === "fa";
  const copy = WEBSITE_COPY[lang];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [32, -32]);
  const detailHref = `/works/websites/${project.slug}`;
  const forward = isFa ? "←" : "→";

  return (
    <article
      ref={ref}
      className="group/project grid grid-cols-1 gap-10 border-t border-(--wt-divider) py-[clamp(3.5rem,8vw,7.5rem)] lg:grid-cols-12 lg:gap-x-12"
    >
      <motion.div
        className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="lg:sticky lg:top-32">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="block text-[clamp(6.5rem,17vw,15rem)] font-black leading-[0.72] tracking-[-0.09em] transition-[color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:translate-x-2 group-hover/project:text-(--wt-accent) motion-reduce:transition-none rtl:group-hover/project:-translate-x-2"
            >
              {localizeDigits(project.index, lang)}
            </span>
            <span
              className={`${metaClass(isFa)} mt-2 text-(--wt-muted)`}
              aria-hidden
            >
              / {localizeDigits(String(total).padStart(2, "0"), lang)}
            </span>
          </div>

          <p className={`${metaClass(isFa)} mt-8 text-(--wt-accent)`}>
            {project.discipline}
          </p>

          <h3
            className={`mt-4 text-[clamp(2.4rem,5.6vw,5rem)] font-black leading-[0.86] ${
              isFa ? "tracking-[0]" : "uppercase tracking-[-0.07em]"
            } ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            <Link
              href={detailHref}
              className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:bg-[length:100%_3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent) motion-reduce:transition-none"
            >
              {project.title}
            </Link>
          </h3>

          <p className={`${metaClass(isFa)} mt-5 text-(--wt-muted)`}>
            {project.projectType}
            {project.year ? <> · {localizeDigits(project.year, lang)}</> : null}
          </p>

          <p
            className={`mt-6 max-w-md text-[15px] leading-relaxed text-(--wt-muted) sm:text-base ${localeCase(lang)}`}
          >
            {project.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={detailHref}
              className={`group/cta inline-flex min-h-[48px] items-center gap-4 border border-(--wt-fg) px-5 text-[11px] font-black transition-colors duration-300 hover:bg-(--wt-fg) hover:text-(--wt-bg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--wt-bg) ${
                isFa ? "tracking-[0]" : "uppercase tracking-[0.16em]"
              }`}
            >
              {copy.explore}
              <span
                aria-hidden
                className="font-mono text-sm transition-transform duration-500 group-hover/cta:translate-x-1 motion-reduce:transition-none rtl:group-hover/cta:-translate-x-1"
              >
                {forward}
              </span>
            </Link>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${metaClass(isFa)} inline-flex min-h-[44px] items-center gap-2 text-(--wt-muted) transition-colors hover:text-(--wt-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent)`}
            >
              {copy.live}
              <span aria-hidden>{isFa ? "↖" : "↗"}</span>
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}
        initial={reduce ? false : { opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 1, ease: EASE, delay: reduce ? 0 : 0.08 }}
      >
        <Link
          href={detailHref}
          aria-label={copy.exploreTitle(project.title)}
          className="relative block overflow-hidden bg-(--wt-panel) px-[clamp(1.25rem,5vw,4.5rem)] pb-[clamp(2.5rem,6vw,5rem)] pt-[clamp(3.5rem,7vw,5.5rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent)"
        >
          <span
            className={`${metaClass(isFa)} absolute start-[clamp(1.25rem,3vw,2rem)] top-[clamp(1.1rem,2.5vw,1.75rem)] text-(--wt-muted)`}
          >
            {copy.fullPage}
          </span>
          <span
            aria-hidden
            className={`${metaClass(isFa)} absolute end-[clamp(1.25rem,3vw,2rem)] top-[clamp(1.1rem,2.5vw,1.75rem)] text-(--wt-muted) transition-colors duration-500 group-hover/project:text-(--wt-accent)`}
          >
            {copy.explore} {forward}
          </span>
          <motion.div style={{ y: reduce ? 0 : drift }}>
            <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/project:-translate-y-2 group-hover/project:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover/project:transform-none">
              <FullPageFrame
                project={project}
                maxScale={1.3}
                priority={priority}
              />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </article>
  );
}

export function WebsiteShowcase({ lang }: { lang: LangKey }) {
  const projects = getWebsiteProjects(lang);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-[1400px] border-b border-(--wt-divider)">
          {projects.map((project, index) => (
            <ShowcaseEntry
              key={project.slug}
              project={project}
              total={projects.length}
              lang={lang}
              flip={index % 2 === 1}
              priority={index === 0}
            />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
