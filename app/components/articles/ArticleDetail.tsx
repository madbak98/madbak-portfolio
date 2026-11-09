import Image from "next/image";
import Link from "next/link";

import {
  ARTICLES,
  formatArticleDate,
  formatIndex,
  getAdjacentArticles,
  getArticleNumber,
  getRelatedArticles,
  getTableOfContents,
  getTopic,
  type Article,
} from "../../lib/articles";
import { ArticleBody } from "./ArticleBody";
import { ArticleCard } from "./ArticleCard";
import { ArticleTableOfContents } from "./ArticleTableOfContents";
import { EditorialArtwork } from "./EditorialArtwork";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";
import { ReadingProgress } from "./ReadingProgress";
import { ShareControls } from "./ShareControls";
import { SubscribeBand } from "./SubscribeBand";

export function ArticleDetail({ article }: { article: Article }) {
  const topic = getTopic(article.topic);
  const headings = getTableOfContents(article);
  const related = getRelatedArticles(article);
  const { previous, next } = getAdjacentArticles(article.slug);
  const path = `/articles/${article.slug}`;
  const number = getArticleNumber(article.slug);
  const coverIsOriginal = article.cover.treatment === "original";

  return (
    <>
      <ReadingProgress />

      <article>
        <header className="a-wrap">
          <nav
            aria-label="Breadcrumb"
            className="a-label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b-2 border-(--a-ink) py-3"
          >
            <Link
              href="/articles"
              className="group inline-flex items-center gap-2 font-semibold transition-colors hover:text-(--a-purple)"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              All articles
            </Link>
            <span className="hidden sm:inline">MADBAK® Journal — Issue 001 / 2026</span>
            <span className="text-(--a-purple)">
              N° {number} / {formatIndex(ARTICLES.length)}
            </span>
          </nav>

          <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-12 lg:gap-0 lg:pt-10">
            <div className="flex items-end justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-start lg:pr-[2vw]">
              <span
                aria-hidden
                className="a-display text-[length:38vw] leading-[0.74] text-(--a-purple) lg:text-[length:17vw]"
              >
                {number}
              </span>
              <Link
                href={`/articles?topic=${topic.slug}#latest`}
                className="a-display mb-2 inline-block bg-(--a-purple) px-4 pb-2 pt-2.5 text-[1.6rem] leading-none text-white transition-colors hover:bg-(--a-ink) hover:text-(--a-on-ink) lg:mb-0 lg:mt-6 lg:text-[2rem]"
              >
                {topic.label}
              </Link>
            </div>
            <div className="lg:col-span-9">
              <h1 className="a-display text-[length:clamp(3.2rem,7.6vw,10rem)] leading-[0.82] text-(--a-ink)">
                {article.title}
                {article.subtitle && (
                  <>
                    <span className="sr-only">: </span>
                    <span className="mt-5 block max-w-5xl text-[length:clamp(1.7rem,3.1vw,3.7rem)] leading-[0.9] text-(--a-purple) lg:mt-7">
                      {article.subtitle}
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-8 max-w-3xl text-[1.2rem] font-medium leading-[1.4] tracking-[-0.01em] lg:text-[1.5rem]">
                {article.description}
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 border-y-2 border-(--a-ink) sm:grid-cols-2 lg:mt-14 lg:grid-cols-12">
            <div className="flex items-center gap-3 border-(--a-ink) py-4 sm:border-r-2 lg:col-span-4">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-(--a-purple)">
                <Image
                  src={article.author.avatar}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover object-top grayscale mix-blend-multiply"
                />
              </span>
              <div>
                <p className="a-display text-[1.6rem] leading-none">{article.author.name}</p>
                <p className="a-label mt-1 text-(--a-muted)">{article.author.role}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 border-t-2 border-(--a-ink) sm:border-t-0 lg:col-span-4 lg:border-r-2">
              <div className="border-r-2 border-(--a-ink) px-0 py-4 sm:px-4">
                <dt className="a-label text-(--a-muted)">Published</dt>
                <dd className="a-display mt-1 text-[1.5rem] leading-none">
                  <time dateTime={article.publishedAt}>
                    {formatArticleDate(article.publishedAt, "long")}
                  </time>
                </dd>
              </div>
              <div className="px-4 py-4">
                <dt className="a-label text-(--a-muted)">Reading</dt>
                <dd className="a-display mt-1 text-[1.5rem] leading-none">
                  {article.readingMinutes} min
                </dd>
              </div>
            </dl>
            <div className="flex items-center border-t-2 border-(--a-ink) py-4 sm:col-span-2 lg:col-span-4 lg:justify-end lg:border-t-0">
              <ShareControls title={article.title} path={path} />
            </div>
          </div>
        </header>

        <figure className="a-wrap relative mt-10 lg:mt-14">
          <span
            aria-hidden
            className="a-bleed-r absolute -top-4 right-0 h-[72%] w-[38%] bg-(--a-purple) lg:-top-8"
          />
          <EditorialArtwork
            image={article.cover}
            variant={article.artwork}
            preload
            sizes="(min-width: 1024px) 88vw, 100vw"
            className={
              coverIsOriginal
                ? "w-full lg:w-[90%]"
                : "aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9] lg:w-[90%]"
            }
            imageClassName={coverIsOriginal ? "" : "[object-position:50%_38%]!"}
            style={
              coverIsOriginal
                ? { aspectRatio: `${article.cover.width} / ${article.cover.height}` }
                : undefined
            }
          />
          <figcaption className="a-label mt-3 flex justify-between gap-4 text-(--a-muted) lg:w-[90%]">
            <span className="text-(--a-ink)">Fig. {number}</span>
            {article.cover.credit && <span className="text-right">{article.cover.credit}</span>}
          </figcaption>
        </figure>

        <div className="a-wrap grid grid-cols-1 gap-10 pb-20 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)_minmax(0,1fr)] lg:gap-[4vw] lg:pt-20">
          <aside className="a-no-scrollbar lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto">
            <ArticleTableOfContents headings={headings} />
          </aside>

          <div className="w-full">
            <ArticleBody blocks={article.body} />

            <div className="mt-16 flex flex-col gap-6 border-t-[6px] border-(--a-ink) pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/articles?topic=${topic.slug}#latest`}
                className="a-label transition-colors hover:text-(--a-purple)"
              >
                Filed under{" "}
                <span className="bg-(--a-purple) px-2 py-1 font-semibold text-white">
                  {topic.label}
                </span>
              </Link>
              <ShareControls title={article.title} path={path} />
            </div>
          </div>

          <div aria-hidden className="hidden lg:block" />
        </div>

        <nav
          aria-label="More stories"
          className="grid grid-cols-1 border-y-[6px] border-(--a-ink) sm:grid-cols-2"
        >
          {previous ? (
            <AdjacentLink article={previous} direction="previous" />
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? <AdjacentLink article={next} direction="next" /> : <span className="hidden sm:block" />}
        </nav>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="a-wrap py-20 lg:py-[7vw]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              id="related-title"
              className="a-display text-[length:19vw] leading-[0.78] lg:text-[length:10vw]"
            >
              Keep <span className="text-(--a-purple)">reading.</span>
            </h2>
            <Link
              href="/articles#latest"
              className="a-label group inline-flex h-12 items-center gap-3 bg-(--a-ink) px-5 font-semibold text-(--a-on-ink) transition-colors hover:bg-(--a-purple) hover:text-white"
            >
              View all articles
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-[2vw] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}

      <SubscribeBand />
    </>
  );
}

function AdjacentLink({
  article,
  direction,
}: {
  article: Article;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/articles/${article.slug}`}
      rel={isNext ? "next" : "prev"}
      className={`a-wrap group flex flex-col gap-4 py-10 transition-colors hover:bg-(--a-purple) hover:text-white lg:py-14 ${
        isNext ? "border-t-[6px] border-(--a-ink) sm:items-end sm:border-l-[6px] sm:border-t-0 sm:text-right" : ""
      }`}
    >
      <span className="a-label inline-flex items-center gap-2 font-semibold text-(--a-purple) group-hover:text-white">
        {!isNext && <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />}
        {isNext ? "Newer story" : "Older story"} — N° {getArticleNumber(article.slug)}
        {isNext && <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </span>
      <span className="a-display max-w-2xl text-[length:clamp(2.2rem,4vw,4.6rem)]">
        {article.title}
      </span>
    </Link>
  );
}
