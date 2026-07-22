"use client";

import Image from "next/image";
import { useId } from "react";

import { TRANSLATIONS, type LangKey } from "../../lib/portfolio-data";
import {
  getArchiveIntro,
  getArchiveProjects,
  type ArchiveProject,
  type WorkCategory,
  type WorkCategorySlug,
} from "../../lib/works-categories";
import { localizeDigits } from "../../lib/locale-preference";
import { localeCase, trackHeading, trackMeta } from "../../lib/locale-ui";
import { PortfolioImage } from "../PortfolioImage";
import { LiveWebsiteButton } from "./LiveWebsiteButton";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

function isRemoteSrc(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function WorksArchiveIntro({
  category,
  lang,
  t,
}: {
  category: WorkCategory;
  lang: LangKey;
  t: TFn;
}) {
  const isFa = lang === "fa";
  const intro = getArchiveIntro(category.slug, lang, t);

  return (
    <section
      className="border-b px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      style={{ borderColor: category.dividerColor }}
    >
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
        <p
          className={`font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.28em]"} ${trackMeta(lang)}`}
          style={{ color: category.muted }}
        >
          {localizeDigits(category.index, lang)} / {t("works_project_archive")}
        </p>
        <h2
          className={`text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.82] ${
            isFa ? "tracking-[0]" : "uppercase tracking-[-0.08em]"
          } ${localeCase(lang)} ${trackHeading(lang)}`}
        >
          <span className="block">{intro.heading[0]}</span>
          <span className="block">{intro.heading[1]}</span>
        </h2>
        <p
          className={`max-w-md text-sm leading-relaxed sm:text-base ${localeCase(lang)}`}
          style={{ color: category.muted }}
        >
          {intro.description}
        </p>
      </div>
    </section>
  );
}

function ArchiveMediaItem({
  src,
  alt,
  fit = "cover",
  sizes,
  priority = false,
  className = "",
  objectPosition = "object-center",
  frameTone = "neutral",
}: {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
  sizes: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
  frameTone?: "neutral" | "dark" | "warm";
}) {
  const frameBg =
    frameTone === "dark"
      ? "bg-[#141414]"
      : frameTone === "warm"
        ? "bg-[#E8E4DC]"
        : "bg-black/[0.06]";

  const imgClass =
    fit === "contain"
      ? `object-contain object-center p-2 sm:p-3`
      : `object-cover ${objectPosition}`;

  return (
    <div
      className={`relative overflow-hidden border border-black/15 transition-transform duration-700 ease-out hover:scale-[1.01] ${frameBg} ${className}`}
    >
      {isRemoteSrc(src) ? (
        <PortfolioImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imgClass}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imgClass}
          draggable={false}
        />
      )}
    </div>
  );
}

function PinkArmyMetaBlock({
  project,
  lang,
  className = "",
}: {
  project: ArchiveProject;
  lang: LangKey;
  className?: string;
}) {
  const isFa = lang === "fa";
  return (
    <div
      className={`flex flex-col justify-center ${isFa ? "text-end" : "text-start"} ${className}`}
      dir={isFa ? "rtl" : "ltr"}
    >
      <p
        className={`font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.24em]"} text-black/55`}
      >
        {project.category}
      </p>
      <p
        className={`mt-3 text-[clamp(1.75rem,3.2vw,2.85rem)] font-black leading-[0.9] ${
          isFa ? "tracking-[0]" : "uppercase tracking-[-0.06em]"
        } ${localeCase(lang)}`}
      >
        {project.title}
      </p>
      <p
        className={`mt-3 font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.2em]"} text-black/55`}
      >
        {localizeDigits(project.year, lang)} · {project.status}
      </p>
    </div>
  );
}

type EditorialImageConfig = {
  aspectRatio: string;
  objectPosition: string;
  desktopWidth: string;
  tabletWidth?: string;
  mobileWidth: string;
  mobileAlign: "start" | "end" | "stretch";
  offsetClass: string;
  sizes: string;
};

const PINK_ARMY_IMAGE_CONFIG: EditorialImageConfig[] = [
  {
    aspectRatio: "3 / 4",
    objectPosition: "object-[center_18%]",
    desktopWidth: "34%",
    tabletWidth: "42%",
    mobileWidth: "86%",
    mobileAlign: "start",
    offsetClass: "mt-[clamp(1.5rem,3vw,2.75rem)]",
    sizes: "(max-width: 767px) 86vw, (max-width: 1279px) 42vw, 34vw",
  },
  {
    aspectRatio: "3 / 4",
    objectPosition: "object-[center_12%]",
    desktopWidth: "52%",
    tabletWidth: "52%",
    mobileWidth: "100%",
    mobileAlign: "stretch",
    offsetClass: "mt-0",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 52vw, 52vw",
  },
  {
    aspectRatio: "4 / 5",
    objectPosition: "object-[center_16%]",
    desktopWidth: "44%",
    tabletWidth: "46%",
    mobileWidth: "100%",
    mobileAlign: "stretch",
    offsetClass: "mt-[clamp(0.75rem,2vw,1.75rem)]",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 46vw, 44vw",
  },
  {
    aspectRatio: "3 / 4",
    objectPosition: "object-[center_14%]",
    desktopWidth: "36%",
    tabletWidth: "42%",
    mobileWidth: "88%",
    mobileAlign: "end",
    offsetClass: "mt-0 xl:-mt-6",
    sizes: "(max-width: 767px) 88vw, (max-width: 1279px) 42vw, 36vw",
  },
  {
    aspectRatio: "4 / 5",
    objectPosition: "object-[center_20%]",
    desktopWidth: "50%",
    tabletWidth: "72%",
    mobileWidth: "100%",
    mobileAlign: "stretch",
    offsetClass: "mt-0",
    sizes: "(max-width: 767px) 100vw, (max-width: 1279px) 72vw, 50vw",
  },
];

/** Pink Army — three-act editorial composition */
function EditorialFiveGallery({
  project,
  lang,
  priorityLead,
}: {
  project: ArchiveProject;
  lang: LangKey;
  priorityLead: boolean;
}) {
  const images = project.images;
  if (images.length < 5) return null;

  const [escalator, selfie, airport, rooftopBlue, rooftopPink] = images;
  const alts = [
    `${project.title} — Pink Army AI influencer on an escalator`,
    `${project.title} — Pink Army AI influencer gym selfie portrait`,
    `${project.title} — Pink Army AI influencer at an airport with suitcase`,
    `${project.title} — Pink Army AI influencer on a rooftop in a blue outfit`,
    `${project.title} — Pink Army AI influencer on a rooftop in a pink shirt and sunglasses`,
  ] as const;

  const cfg = PINK_ARMY_IMAGE_CONFIG;
  const pairGap = "gap-[clamp(0.75rem,1.8vw,2rem)]";
  const actGap = "gap-[clamp(4rem,8vw,10rem)]";

  return (
    <div
      className={`flex flex-col ${actGap} scroll-mt-28 pt-[clamp(0.5rem,2vw,1.25rem)]`}
      dir="ltr"
    >
      {/* Mobile */}
      <div className="flex flex-col gap-[clamp(0.85rem,3vw,1.35rem)] md:hidden">
        <ArchiveMediaItem
          src={selfie!}
          alt={alts[1]}
          className="aspect-[3/4] w-full"
          sizes={cfg[1]!.sizes}
          priority={priorityLead}
          objectPosition={cfg[1]!.objectPosition}
        />
        <ArchiveMediaItem
          src={escalator!}
          alt={alts[0]}
          className="aspect-[3/4] w-[86%] self-start"
          sizes={cfg[0]!.sizes}
          objectPosition={cfg[0]!.objectPosition}
        />
        <ArchiveMediaItem
          src={airport!}
          alt={alts[2]}
          className="aspect-[4/5] w-full"
          sizes={cfg[2]!.sizes}
          objectPosition={cfg[2]!.objectPosition}
        />
        <ArchiveMediaItem
          src={rooftopBlue!}
          alt={alts[3]}
          className="aspect-[3/4] w-[88%] self-end"
          sizes={cfg[3]!.sizes}
          objectPosition={cfg[3]!.objectPosition}
        />
        <ArchiveMediaItem
          src={rooftopPink!}
          alt={alts[4]}
          className="aspect-[4/5] w-full"
          sizes={cfg[4]!.sizes}
          objectPosition={cfg[4]!.objectPosition}
        />
        <PinkArmyMetaBlock project={project} lang={lang} className="pt-2" />
      </div>

      {/* Tablet */}
      <div className={`hidden flex-col ${actGap} md:flex xl:hidden`}>
        <div className={`flex items-start ${pairGap}`}>
          <ArchiveMediaItem
            src={selfie!}
            alt={alts[1]}
            className="aspect-[3/4] w-[52%] shrink-0"
            sizes={cfg[1]!.sizes}
            priority={priorityLead}
            objectPosition={cfg[1]!.objectPosition}
          />
          <ArchiveMediaItem
            src={escalator!}
            alt={alts[0]}
            className={`aspect-[3/4] w-[42%] shrink-0 ${cfg[0]!.offsetClass}`}
            sizes={cfg[0]!.sizes}
            objectPosition={cfg[0]!.objectPosition}
          />
        </div>
        <div className={`flex items-start justify-between ${pairGap}`}>
          <ArchiveMediaItem
            src={airport!}
            alt={alts[2]}
            className={`aspect-[4/5] w-[46%] shrink-0 ${cfg[2]!.offsetClass}`}
            sizes={cfg[2]!.sizes}
            objectPosition={cfg[2]!.objectPosition}
          />
          <ArchiveMediaItem
            src={rooftopBlue!}
            alt={alts[3]}
            className="aspect-[3/4] w-[42%] shrink-0"
            sizes={cfg[3]!.sizes}
            objectPosition={cfg[3]!.objectPosition}
          />
        </div>
        <div className={`flex items-end gap-[clamp(1.5rem,4vw,5rem)]`}>
          <ArchiveMediaItem
            src={rooftopPink!}
            alt={alts[4]}
            className="aspect-[4/5] w-[72%] shrink-0"
            sizes={cfg[4]!.sizes}
            objectPosition={cfg[4]!.objectPosition}
          />
          <PinkArmyMetaBlock
            project={project}
            lang={lang}
            className="min-w-0 flex-1 pb-4"
          />
        </div>
      </div>

      {/* Desktop ≥1280 — three acts */}
      <div className={`hidden flex-col ${actGap} xl:flex`}>
        <div className={`flex items-start ${pairGap}`}>
          <ArchiveMediaItem
            src={escalator!}
            alt={alts[0]}
            className={`aspect-[3/4] w-[34%] shrink-0 ${cfg[0]!.offsetClass}`}
            sizes={cfg[0]!.sizes}
            objectPosition={cfg[0]!.objectPosition}
          />
          <ArchiveMediaItem
            src={selfie!}
            alt={alts[1]}
            className="aspect-[3/4] w-[52%] shrink-0"
            sizes={cfg[1]!.sizes}
            priority={priorityLead}
            objectPosition={cfg[1]!.objectPosition}
          />
        </div>

        <div className={`flex items-start justify-end ${pairGap}`}>
          <ArchiveMediaItem
            src={airport!}
            alt={alts[2]}
            className={`aspect-[4/5] w-[44%] shrink-0 ${cfg[2]!.offsetClass}`}
            sizes={cfg[2]!.sizes}
            objectPosition={cfg[2]!.objectPosition}
          />
          <ArchiveMediaItem
            src={rooftopBlue!}
            alt={alts[3]}
            className={`aspect-[3/4] w-[36%] shrink-0 ${cfg[3]!.offsetClass}`}
            sizes={cfg[3]!.sizes}
            objectPosition={cfg[3]!.objectPosition}
          />
        </div>

        <div className={`flex items-center gap-[clamp(1.5rem,4vw,5rem)]`}>
          <PinkArmyMetaBlock
            project={project}
            lang={lang}
            className="w-[min(38%,22rem)] shrink-0"
          />
          <ArchiveMediaItem
            src={rooftopPink!}
            alt={alts[4]}
            className="aspect-[4/5] w-[50%] max-w-[36rem] shrink-0"
            sizes={cfg[4]!.sizes}
            objectPosition={cfg[4]!.objectPosition}
          />
        </div>
      </div>
    </div>
  );
}

function FoundationExternalLink({
  href,
  label,
  isFa,
  className = "",
}: {
  href: string;
  label: string;
  isFa: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center gap-2 font-mono text-[10px] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35 ${
        isFa ? "tracking-[0]" : "uppercase tracking-[0.2em]"
      } ${className}`}
    >
      {label}
      <span aria-hidden>{isFa ? "↖" : "↗"}</span>
    </a>
  );
}

/** NFT collection wall — featured edition + supporting artworks */
function NftCollectionWall({
  projects,
  category,
  lang,
  t,
}: {
  projects: ArchiveProject[];
  category: WorkCategory;
  lang: LangKey;
  t: TFn;
}) {
  const isFa = lang === "fa";
  const featured = projects.find((p) => p.featured) ?? projects[0]!;
  const supporting = projects.filter((p) => p.id !== featured.id);
  const foundationLabel = t("works_view_on_foundation");

  return (
    <article
      className="border-t py-12 sm:py-16"
      style={{ borderColor: category.dividerColor }}
    >
      {/* Featured */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <a
          href={featured.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden border border-black/15 bg-[#0A0A0A] outline-none focus-visible:ring-2 focus-visible:ring-black/35 lg:col-span-8"
          aria-label={`${featured.title} — ${t("works_view_on_foundation")}`}
        >
          <div className="relative aspect-[4/5] w-full sm:aspect-[5/6] lg:aspect-[4/5]" dir="ltr">
            <PortfolioImage
              src={featured.images[0]!}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </a>
        <div className="lg:col-span-4">
          <p
            className={`font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.24em]"}`}
            style={{ color: category.muted }}
          >
            {localizeDigits(featured.index, lang)} · {featured.category}
          </p>
          <h3
            className={`mt-4 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] ${
              isFa ? "tracking-[0]" : "uppercase tracking-[-0.06em]"
            } ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            {featured.title}
          </h3>
          <p
            className={`mt-3 font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.18em]"}`}
            style={{ color: category.muted }}
          >
            {localizeDigits(featured.year, lang)} · {featured.status}
          </p>
          {featured.href ? (
            <div className="mt-6">
              <FoundationExternalLink
                href={featured.href}
                label={foundationLabel}
                isFa={isFa}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Supporting wall */}
      <div
        className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-12"
        dir="ltr"
      >
        {supporting.map((nft, index) => {
          const span =
            index === 0
              ? "lg:col-span-5"
              : index === 1
                ? "lg:col-span-7"
                : index === 2
                  ? "lg:col-span-4"
                  : index === 3
                    ? "lg:col-span-4"
                    : "lg:col-span-4";
          const widthMod =
            index === 1
              ? "max-sm:w-[90%] max-sm:ms-auto"
              : index === 3
                ? "max-sm:w-[86%] max-sm:ms-0"
                : "";

          return (
            <a
              key={nft.id}
              href={nft.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block outline-none focus-visible:ring-2 focus-visible:ring-black/35 ${span} ${widthMod}`}
              aria-label={`${nft.title} — ${t("works_view_on_foundation")}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-black/15 bg-[#0A0A0A]">
                <PortfolioImage
                  src={nft.images[0]!}
                  alt={nft.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.18em]"}`}
                    style={{ color: category.muted }}
                  >
                    {localizeDigits(nft.index, lang)} · {nft.category}
                  </p>
                  <p
                    className={`mt-1 text-sm font-black leading-tight sm:text-base ${
                      isFa ? "tracking-[0]" : "uppercase tracking-[-0.03em]"
                    } ${localeCase(lang)}`}
                  >
                    {nft.title}
                  </p>
                </div>
                <span
                  className="shrink-0 font-mono text-[11px] transition-transform duration-500 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                  aria-hidden
                >
                  {isFa ? "↖" : "↗"}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </article>
  );
}

function WorksArchiveGallery({
  project,
  lang,
  priorityLead = false,
}: {
  project: ArchiveProject;
  lang: LangKey;
  priorityLead?: boolean;
}) {
  const images = project.images;
  const fit = project.fit ?? "cover";
  const frameTone = fit === "contain" ? "dark" : "neutral";

  if (images.length === 0) return null;

  if (project.layout === "editorial-five") {
    return (
      <EditorialFiveGallery
        project={project}
        lang={lang}
        priorityLead={priorityLead}
      />
    );
  }

  const item = (src: string, index: number, className: string, sizes: string) => (
    <ArchiveMediaItem
      key={`${project.id}-${src}-${index}`}
      src={src}
      alt={project.imageAlts?.[index] ?? `${project.title} ${index + 1}`}
      fit={fit}
      sizes={sizes}
      priority={priorityLead && index === 0}
      className={className}
      frameTone={frameTone}
    />
  );

  if (project.layout === "art-board") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12 md:gap-5" dir="ltr">
        {images.map((src, index) => {
          if (index === 0) {
            return item(
              src,
              0,
              "aspect-[4/5] md:col-span-7 md:row-span-2 md:aspect-auto md:min-h-[36rem]",
              "(max-width: 768px) 100vw, 55vw",
            );
          }
          return item(
            src,
            index,
            "aspect-[4/5] md:col-span-5",
            "(max-width: 768px) 100vw, 35vw",
          );
        })}
      </div>
    );
  }

  // lead-grid (websites)
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5" dir="ltr">
      {item(
        images[0]!,
        0,
        "aspect-[16/10] w-full",
        "(max-width: 1400px) 100vw, 1200px",
      )}
      {images.length > 1 ? (
        <div
          className={`grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 ${
            images.length - 1 === 1
              ? "sm:grid-cols-1"
              : images.length - 1 === 2
                ? "sm:grid-cols-2"
                : images.length - 1 === 3
                  ? "sm:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {images.slice(1).map((src, index) =>
            item(
              src,
              index + 1,
              "aspect-[16/10]",
              "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

function WorksArchiveEntry({
  project,
  lang,
  category,
  t,
  priorityLead,
}: {
  project: ArchiveProject;
  lang: LangKey;
  category: WorkCategory;
  t: TFn;
  priorityLead: boolean;
}) {
  const isFa = lang === "fa";
  const hideHeaderMeta = project.layout === "editorial-five";
  const isWebsiteProject =
    project.layout === "lead-grid" && Boolean(project.external && project.href);

  return (
    <article
      className={`scroll-mt-28 border-t ${
        hideHeaderMeta
          ? "py-[clamp(3rem,7vw,5.5rem)]"
          : "py-12 sm:py-16"
      }`}
      style={{ borderColor: category.dividerColor }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0">
          {!hideHeaderMeta ? (
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] ${
                isFa ? "tracking-[0]" : "uppercase tracking-[0.2em]"
              }`}
              style={{ color: category.muted }}
            >
              <span>{localizeDigits(project.index, lang)}</span>
              <span aria-hidden>·</span>
              <span>{project.category}</span>
              <span aria-hidden>·</span>
              <span>{localizeDigits(project.year, lang)}</span>
              <span aria-hidden>·</span>
              <span>{project.status}</span>
            </div>
          ) : (
            <div
              className={`font-mono text-[9px] ${isFa ? "tracking-[0]" : "uppercase tracking-[0.2em]"} xl:hidden`}
              style={{ color: category.muted }}
            >
              {localizeDigits(project.index, lang)} · {project.category} ·{" "}
              {localizeDigits(project.year, lang)}
            </div>
          )}
          <h3
            className={`mt-4 text-[clamp(2.25rem,7vw,4.75rem)] font-black leading-[0.88] ${
              isFa ? "tracking-[0]" : "uppercase tracking-[-0.07em]"
            } ${hideHeaderMeta ? "xl:sr-only" : ""} ${localeCase(lang)} ${trackHeading(lang)}`}
          >
            {project.title}
          </h3>
          {project.description ? (
            <p
              className={`mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${localeCase(lang)}`}
              style={{ color: category.muted }}
            >
              {project.description}
            </p>
          ) : null}

          {isWebsiteProject && project.href ? (
            <div className="mt-6 sm:mt-7">
              <LiveWebsiteButton
                href={project.href}
                projectName={project.title}
                lang={lang}
                liveLabel={t("works_cta_live")}
                actionLabel={t("works_visit_project")}
                accent={category.foreground}
                invertedText={category.accent}
              />
            </div>
          ) : null}
        </div>

        {project.href && !isWebsiteProject ? (
          <a
            href={project.href}
            target={project.external ? "_blank" : undefined}
            rel={project.external ? "noopener noreferrer" : undefined}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 font-mono text-[10px] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35 ${
              isFa ? "tracking-[0]" : "uppercase tracking-[0.2em]"
            }`}
          >
            {project.external ? t("works_live_website") : t("works_view_project")}
            <span aria-hidden>{isFa ? "↖" : "↗"}</span>
          </a>
        ) : null}
      </header>

      <div className="mt-8 sm:mt-10">
        <WorksArchiveGallery
          project={project}
          lang={lang}
          priorityLead={priorityLead}
        />
      </div>
    </article>
  );
}

export function WorksArchiveList({
  slug,
  category,
  lang,
  t,
}: {
  slug: WorkCategorySlug;
  category: WorkCategory;
  lang: LangKey;
  t: TFn;
}) {
  const projects = getArchiveProjects(slug, lang);
  const listId = useId();

  if (slug === "nft-collection") {
    return (
      <section
        className="relative px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12"
        aria-labelledby={listId}
      >
        <h2 id={listId} className="sr-only">
          {t("works_project_archive")}
        </h2>
        <div
          className="mx-auto max-w-[1400px] border-b"
          style={{ borderColor: category.dividerColor }}
        >
          <NftCollectionWall
            projects={projects}
            category={category}
            lang={lang}
            t={t}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12"
      aria-labelledby={listId}
    >
      <h2 id={listId} className="sr-only">
        {t("works_project_archive")}
      </h2>

      <div
        className="mx-auto max-w-[1400px] border-b"
        style={{ borderColor: category.dividerColor }}
      >
        {projects.map((project, index) => (
          <WorksArchiveEntry
            key={project.id}
            project={project}
            lang={lang}
            category={category}
            t={t}
            priorityLead={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
