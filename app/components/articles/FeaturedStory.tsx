import Link from "next/link";

import { formatArticleDate, getTopic, type Article } from "../../lib/articles";
import { ArrowUpRightIcon } from "./icons";

export function FeaturedStory({ article, number }: { article: Article; number: string }) {
  return (
    <article className="group relative flex flex-1 flex-col bg-(--a-purple) px-5 pb-6 pt-5 text-white sm:px-8 sm:pb-8 lg:px-[2.4vw] lg:pb-[2.2vw] lg:pt-[1.8vw]">
      <div className="a-label flex items-center justify-between gap-4 border-b border-white/35 pb-3">
        <span className="font-semibold">Featured story</span>
        <span className="text-white/75">
          N° {number} / {getTopic(article.topic).label}
        </span>
      </div>
      <h2 className="a-display mt-6 text-[length:clamp(2.9rem,4.7vw,6rem)] leading-[0.84]">
        <Link
          href={`/articles/${article.slug}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-white"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-white/80">
        {article.description}
      </p>
      <div className="mt-7 flex items-end justify-between gap-4 border-t border-white/35 pt-4 lg:mt-auto">
        <p className="a-label text-white/80">
          {article.author.name} — {formatArticleDate(article.publishedAt)}
          <br />
          {article.readingMinutes} min read
        </p>
        <span
          aria-hidden
          className="a-label flex h-12 shrink-0 items-center gap-3 bg-white px-4 font-semibold text-(--a-purple) transition-colors duration-300 group-hover:bg-(--a-purple-black) group-hover:text-white"
        >
          Read
          <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </div>
    </article>
  );
}
