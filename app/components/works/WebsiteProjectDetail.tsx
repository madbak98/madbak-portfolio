"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion, useReducedMotion } from "motion/react";

import { TRANSLATIONS, type LangKey } from "../../lib/portfolio-data";
import {
  getWebsiteProject,
  type WebsiteProject,
} from "../../lib/works-categories";
import { localizeDigits } from "../../lib/locale-preference";
import { localeCase, trackHeading } from "../../lib/locale-ui";
import { LiveWebsiteButton } from "./LiveWebsiteButton";
import { FullPageFrame, WEBSITE_COPY, metaClass } from "./WebsiteShowcase";
import { WorksThemeToggle } from "./WorksThemeToggle";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

const EASE = [0.22, 1, 0.36, 1] as const;

function SectionLabel({
  index,
  children,
  isFa,
}: {
  index: string;
  children: string;
  isFa: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4 border-t-2 border-(--wt-fg) pt-4">
      <span className={`${metaClass(isFa)} text-(--wt-accent)`}>{index}</span>
      <h2 className={`${metaClass(isFa)} text-(--wt-fg)`}>{children}</h2>
    </div>
  );
}

function AdjacentLink({
  project,
  label,
  direction,
  lang,
}: {
  project: WebsiteProject;
  label: string;
  direction: "previous" | "next";
  lang: LangKey;
}) {
  const isFa = lang === "fa";
  const isNext = direction === "next";
  const arrow = isNext === !isFa ? "→" : "←";

  return (
    <Link
      href={`/works/websites/${project.slug}`}
      className={`group flex min-h-[44px] flex-col gap-4 border-t border-(--wt-divider) py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent) ${
        isNext ? "sm:items-end sm:text-end" : ""
      }`}
    >
      <span className={`${metaClass(isFa)} text-(--wt-muted)`}>
        {isNext ? null : <span aria-hidden>{arrow} </span>}
        {label}
        {isNext ? <span aria-hidden> {arrow}</span> : null}
      </span>
      <span className="flex items-end gap-4">
        <span
          aria-hidden
          className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.75] tracking-[-0.08em] text-(--wt-muted) transition-colors duration-500 group-hover:text-(--wt-accent)"
        >
          {localizeDigits(project.index, lang)}
        </span>
        <span
          className={`text-[clamp(1.6rem,3.6vw,2.75rem)] font-black leading-[0.9] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isNext
              ? "group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              : "group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
          } ${isFa ? "tracking-[0]" : "uppercase tracking-[-0.06em]"} ${localeCase(lang)}`}
        >
          {project.title}
        </span>
      </span>
    </Link>
  );
}

export function WebsiteProjectDetail({
  slug,
  lang,
  t,
}: {
  slug: string;
  lang: LangKey;
  t: TFn;
}) {
  const reduce = useReducedMotion();
  const entry = getWebsiteProject(slug, lang);
  if (!entry) return null;

  const { project, previous, next, total } = entry;
  const isFa = lang === "fa";
  const copy = WEBSITE_COPY[lang];
  const backArrow = isFa ? "→" : "←";

  const info: { label: string; value: string }[] = [
    { label: copy.category, value: project.discipline },
    { label: copy.type, value: project.projectType },
    { label: copy.identity, value: project.identity },
    ...(project.year
      ? [{ label: copy.year, value: localizeDigits(project.year, lang) }]
      : []),
    ...(project.status ? [{ label: copy.status, value: project.status }] : []),
    ...project.facts,
  ];

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, ease: EASE, delay },
        };

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-(--wt-bg) text-(--wt-fg)">
        <header className="px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-center justify-between gap-6">
              <Link
                href="/works/websites"
                className={`${metaClass(isFa)} inline-flex min-h-[44px] items-center gap-2 text-(--wt-muted) transition-colors hover:text-(--wt-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--wt-accent)`}
              >
                <span aria-hidden>{backArrow}</span>
                {copy.back}
              </Link>
              <div className="flex items-center gap-5">
                <span
                  className={`${metaClass(isFa)} hidden text-(--wt-muted) sm:inline`}
                >
                  {copy.project} — {localizeDigits(project.index, lang)} /{" "}
                  {localizeDigits(String(total).padStart(2, "0"), lang)}
                </span>
                <WorksThemeToggle lang={lang} />
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 border-t-2 border-(--wt-fg) pt-8 lg:mt-16 lg:grid-cols-12 lg:gap-12">
              <motion.span
                aria-hidden
                className="block text-[clamp(7.5rem,22vw,19rem)] font-black leading-[0.72] tracking-[-0.09em] text-(--wt-accent) lg:col-span-4"
                {...reveal()}
              >
                {localizeDigits(project.index, lang)}
              </motion.span>
              <div className="lg:col-span-8">
                <motion.p
                  className={`${metaClass(isFa)} text-(--wt-muted)`}
                  {...reveal(0.05)}
                >
                  {project.discipline}
                </motion.p>
                <motion.h1
                  className={`mt-5 text-[clamp(3rem,8.5vw,8rem)] font-black leading-[0.82] ${
                    isFa ? "tracking-[0]" : "uppercase tracking-[-0.08em]"
                  } ${localeCase(lang)} ${trackHeading(lang)}`}
                  {...reveal(0.1)}
                >
                  {project.title}
                </motion.h1>
                <motion.p
                  className={`mt-8 max-w-2xl text-base leading-relaxed text-(--wt-muted) sm:text-lg ${localeCase(lang)}`}
                  {...reveal(0.16)}
                >
                  {project.description}
                </motion.p>
              </div>
            </div>
          </div>
        </header>

        <section
          className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12"
          aria-labelledby="project-information"
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="flex items-baseline gap-4 border-t-2 border-(--wt-fg) pt-4">
                <span className={`${metaClass(isFa)} text-(--wt-accent)`}>
                  {localizeDigits("01", lang)}
                </span>
                <h2
                  id="project-information"
                  className={`${metaClass(isFa)} text-(--wt-fg)`}
                >
                  {copy.info}
                </h2>
              </div>
              <div className="mt-8">
                <LiveWebsiteButton
                  href={project.href}
                  projectName={project.title}
                  lang={lang}
                  liveLabel={t("works_cta_live")}
                  actionLabel={t("works_visit_project")}
                  accent="var(--wt-fg)"
                  invertedText="var(--wt-bg)"
                />
                <p
                  className="mt-3 font-mono text-[10px] tracking-[0.08em] text-(--wt-muted)"
                  dir="ltr"
                >
                  {project.domain}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-1 border-t border-(--wt-divider) sm:grid-cols-2 lg:col-span-8">
              {info.map((row) => (
                <div
                  key={row.label}
                  className="border-b border-(--wt-divider) py-5 sm:odd:pe-8 sm:even:border-s sm:even:ps-8"
                >
                  <dt className={`${metaClass(isFa)} text-(--wt-muted)`}>
                    {row.label}
                  </dt>
                  <dd
                    className={`mt-2 text-[15px] font-semibold leading-snug sm:text-base ${localeCase(lang)}`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <SectionLabel index={localizeDigits("02", lang)} isFa={isFa}>
              {copy.fullPage}
            </SectionLabel>
            <div className="mt-8 bg-(--wt-panel) px-[clamp(1rem,6vw,6rem)] py-[clamp(2rem,7vw,6rem)]">
              <FullPageFrame project={project} maxScale={1.5} priority />
            </div>
          </div>
        </section>

        {project.images.length > 0 ? (
          <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
            <div className="mx-auto max-w-[1400px]">
              <SectionLabel index={localizeDigits("03", lang)} isFa={isFa}>
                {copy.screens}
              </SectionLabel>
              <div
                className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
                dir="ltr"
              >
                {project.images.map((src, index) => (
                  <figure
                    key={src}
                    className={`relative aspect-[16/10] overflow-hidden border border-(--wt-line) bg-(--wt-panel) ${
                      index === 0 && project.images.length % 2 === 1
                        ? "md:col-span-2"
                        : ""
                    }`}
                  >
                    <Image
                      src={src}
                      alt={
                        project.imageAlts[index] ??
                        `${project.title} ${index + 1}`
                      }
                      fill
                      sizes={
                        index === 0 && project.images.length % 2 === 1
                          ? "(max-width: 1400px) 100vw, 1400px"
                          : "(max-width: 768px) 100vw, 700px"
                      }
                      quality={90}
                      className="object-contain"
                      draggable={false}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <nav
          aria-label={isFa ? "پیمایش پروژه‌ها" : "Project navigation"}
          className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12"
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 border-b border-(--wt-divider) sm:grid-cols-2 sm:gap-12">
            <AdjacentLink
              project={previous}
              label={copy.previous}
              direction="previous"
              lang={lang}
            />
            <AdjacentLink
              project={next}
              label={copy.next}
              direction="next"
              lang={lang}
            />
          </div>
        </nav>
      </main>
    </MotionConfig>
  );
}
