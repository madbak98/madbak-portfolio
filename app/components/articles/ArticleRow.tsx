import Image from "next/image";
import Link from "next/link";

import { formatArticleDate, getTopic, type ArticleSummary } from "../../lib/articles";
import { EditorialArtwork } from "./EditorialArtwork";
import { ArrowUpRightIcon } from "./icons";

type RowProps = { article: ArticleSummary; number: string; index: number };
type Tone = "light" | "purple";

const LAYOUTS = [SplitRow, TypeRow, BleedRow, OffsetRow, SlabRow];

/** Each position in the index gets its own composition so the list never reads as a template. */
export function ArticleRow(props: RowProps) {
  const Layout = LAYOUTS[props.index % LAYOUTS.length];
  return <Layout {...props} />;
}

const rowBase = "group relative border-t-[6px] border-(--a-ink) py-10 first:border-t-0 lg:py-[4.5vw]";

function SplitRow({ article, number, index }: RowProps) {
  const mirrored = index >= LAYOUTS.length;
  return (
    <article className={`${rowBase} grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-0`}>
      <div className={`overflow-hidden lg:col-span-7 ${mirrored ? "lg:order-2" : ""}`}>
        <EditorialArtwork
          image={article.cover}
          variant={article.artwork}
          eager={index === 0}
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="aspect-[4/3] w-full lg:aspect-[16/11]"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div
        className={`relative flex flex-col lg:col-span-5 ${mirrored ? "lg:items-end lg:pr-[2.5vw] lg:text-right" : "lg:pl-[2.5vw]"}`}
      >
        <IndexNumber
          value={number}
          className={`text-[length:30vw] lg:text-[length:12vw] ${mirrored ? "lg:-mr-[8vw]" : "lg:-ml-[8vw]"}`}
        />
        <Tag article={article} className="mt-6" />
        <Title article={article} className="mt-4 text-[length:clamp(2.5rem,4.3vw,5.4rem)]" />
        <Description article={article} className="mt-5 max-w-md" />
        <Footer article={article} className="mt-8 lg:mt-auto lg:pt-10" />
      </div>
    </article>
  );
}

function TypeRow({ article, number }: RowProps) {
  return (
    <article className={rowBase}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 lg:grid-cols-12 lg:gap-x-0">
        <IndexNumber value={number} className="text-[length:24vw] lg:col-span-2 lg:text-[length:12vw]" />
        <div className="self-end lg:hidden">
          <Tag article={article} />
        </div>
        <Title
          article={article}
          className="col-span-2 mt-6 text-[length:clamp(2.7rem,7.2vw,9rem)] leading-[0.8] lg:col-span-10 lg:mt-0"
        />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 border-t-2 border-(--a-ink) pt-5 sm:grid-cols-[minmax(0,1fr)_14rem] lg:mt-10 lg:grid-cols-12 lg:gap-0">
        <Tag article={article} className="hidden lg:col-span-2 lg:block" />
        <Description article={article} className="lg:col-span-5 lg:pr-[3vw]" />
        <Footer article={article} className="sm:col-start-1 lg:col-span-3 lg:col-start-auto lg:items-start lg:pr-[2vw]" stacked />
        <div className="overflow-hidden sm:col-start-2 sm:row-span-2 sm:row-start-1 lg:col-span-2 lg:col-start-auto lg:row-span-1 lg:row-start-auto">
          <EditorialArtwork
            image={article.cover}
            variant={article.artwork}
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 14rem, 100vw"
            className="aspect-[4/3] w-full"
            imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </div>
      </div>
    </article>
  );
}

function BleedRow({ article, number }: RowProps) {
  return (
    <article className={rowBase}>
      <div className="a-bleed relative overflow-hidden">
        <EditorialArtwork
          image={article.cover}
          variant={article.artwork}
          sizes="100vw"
          className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]"
          imageClassName="transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="a-display a-outline-white pointer-events-none absolute right-(--a-gutter) top-[6%] text-[length:32vw] leading-[0.75] lg:text-[length:20vw]"
        >
          {number}
        </span>
      </div>
      <div className="relative z-10 -mt-16 grid grid-cols-1 lg:-mt-[10vw] lg:grid-cols-12">
        <div className="a-bleed-l bg-(--a-bg) pr-5 pt-6 lg:col-span-8 lg:pr-[3vw] lg:pt-[2.4vw]">
          <div className="flex items-center gap-4">
            <span className="a-display text-[2.6rem] leading-none text-(--a-purple)">{number}</span>
            <Tag article={article} />
          </div>
          <Title article={article} className="mt-4 text-[length:clamp(2.6rem,5.6vw,7rem)]" />
          <div className="mt-6 grid grid-cols-1 items-end gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10">
            <Description article={article} className="max-w-xl" />
            <Footer article={article} stacked />
          </div>
        </div>
      </div>
    </article>
  );
}

function OffsetRow({ article, number }: RowProps) {
  return (
    <article className={`${rowBase} grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-0`}>
      <div className="flex flex-col lg:col-span-5 lg:pr-[3vw]">
        <div className="flex items-start justify-between gap-4">
          <Tag article={article} className="pt-2" />
          <IndexNumber value={number} className="text-[length:26vw] lg:text-[length:9vw]" />
        </div>
        <Title article={article} className="mt-6 text-[length:clamp(2.5rem,4.6vw,5.8rem)]" />
        <Description article={article} className="mt-5 max-w-md" />
        <Footer article={article} className="mt-8 lg:mt-auto lg:pt-10" />
      </div>
      <div className="relative lg:col-span-7 lg:pt-[5vw]">
        <span
          aria-hidden
          className="a-bleed-r absolute right-0 top-0 h-[78%] w-[52%] bg-(--a-purple) lg:top-0"
        />
        <div className="relative w-[88%] overflow-hidden pt-8 lg:w-[84%] lg:pt-0">
          <EditorialArtwork
            image={article.cover}
            variant={article.artwork}
            sizes="(min-width: 1024px) 50vw, 90vw"
            className="aspect-[4/3] w-full lg:aspect-[16/11]"
            imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </article>
  );
}

function SlabRow({ article, number }: RowProps) {
  return (
    <article className="group relative a-bleed bg-(--a-purple) text-white">
      <div className="a-wrap grid grid-cols-1 gap-10 py-12 lg:grid-cols-12 lg:gap-0 lg:py-[5vw]">
        <div className="flex flex-col lg:col-span-7 lg:pr-[4vw]">
          <div className="flex items-start justify-between gap-4">
            <Tag article={article} tone="purple" className="pt-2" />
            <span
              aria-hidden
              className="a-display a-outline-white text-[length:26vw] leading-[0.75] lg:text-[length:10vw]"
            >
              {number}
            </span>
          </div>
          <Title
            article={article}
            tone="purple"
            className="mt-8 text-[length:clamp(2.6rem,5.6vw,7rem)]"
          />
          <Description article={article} tone="purple" className="mt-6 max-w-lg" />
          <Footer article={article} tone="purple" className="mt-10 lg:mt-auto lg:pt-12" />
        </div>
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-(--a-purple)">
            <Image
              src={article.cover.src}
              alt={article.cover.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                article.cover.treatment === "original" ? "" : "mix-blend-multiply contrast-[1.2] grayscale"
              }`}
              style={{ objectPosition: article.cover.focus ?? "50% 30%" }}
            />
            <span aria-hidden className="absolute inset-[6%] border-2 border-white/70" />
          </div>
        </div>
      </div>
    </article>
  );
}

function IndexNumber({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`a-display relative z-10 block leading-[0.75] tabular-nums text-(--a-purple) ${className}`}
    >
      {value}
    </span>
  );
}

function Tag({
  article,
  tone = "light",
  className = "",
}: {
  article: ArticleSummary;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={`a-label font-semibold ${tone === "purple" ? "text-white" : "text-(--a-purple)"} ${className}`}
    >
      / {getTopic(article.topic).label}
    </p>
  );
}

function Title({
  article,
  tone = "light",
  className = "",
}: {
  article: ArticleSummary;
  tone?: Tone;
  className?: string;
}) {
  return (
    <h3
      className={`a-display transition-colors duration-300 ${
        tone === "purple" ? "text-white" : "text-(--a-ink) group-hover:text-(--a-purple)"
      } ${className}`}
    >
      <Link
        href={`/articles/${article.slug}`}
        className={`after:absolute after:inset-0 after:z-20 after:content-[''] ${
          tone === "purple" ? "focus-visible:outline-white" : ""
        }`}
      >
        {article.title}
      </Link>
    </h3>
  );
}

function Description({
  article,
  tone = "light",
  className = "",
}: {
  article: ArticleSummary;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={`text-[1.02rem] leading-relaxed lg:text-[1.08rem] ${
        tone === "purple" ? "text-white/80" : "text-(--a-muted)"
      } ${className}`}
    >
      {article.description}
    </p>
  );
}

function Footer({
  article,
  tone = "light",
  stacked = false,
  className = "",
}: {
  article: ArticleSummary;
  tone?: Tone;
  stacked?: boolean;
  className?: string;
}) {
  const purple = tone === "purple";
  return (
    <div
      className={`flex gap-4 ${stacked ? "flex-col items-start" : "items-end justify-between border-t-2 pt-4"} ${
        purple ? "border-white/40" : "border-(--a-ink)"
      } ${className}`}
    >
      <p className={`a-label ${purple ? "text-white/80" : "text-(--a-muted)"}`}>
        <span className={purple ? "text-white" : "text-(--a-ink)"}>{article.authorName}</span> —{" "}
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        <br />
        {article.readingMinutes} min read
      </p>
      <span
        aria-hidden
        className={`a-label flex h-11 shrink-0 items-center gap-3 px-4 font-semibold transition-colors duration-300 ${
          purple
            ? "bg-white text-(--a-purple) group-hover:bg-(--a-purple-black) group-hover:text-white"
            : "bg-(--a-ink) text-(--a-on-ink) group-hover:bg-(--a-purple) group-hover:text-white"
        }`}
      >
        Read
        <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </div>
  );
}
