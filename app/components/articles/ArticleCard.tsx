import Link from "next/link";

import { getArticleNumber, getTopic, type Article } from "../../lib/articles";
import { ArticleMeta } from "./ArticleMeta";
import { EditorialArtwork } from "./EditorialArtwork";
import { ArrowRightIcon } from "./icons";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex flex-col border-t-[6px] border-(--a-ink) pt-4">
      <div className="flex items-start justify-between gap-4">
        <span aria-hidden className="a-display text-[4.5rem] leading-[0.78] text-(--a-purple)">
          {getArticleNumber(article.slug)}
        </span>
        <p className="a-label pt-1 text-right font-semibold text-(--a-purple)">
          / {getTopic(article.topic).label}
        </p>
      </div>
      <div className="mt-4 overflow-hidden">
        <EditorialArtwork
          image={article.cover}
          variant={article.artwork}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="aspect-[4/3] w-full"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <h3 className="a-display mt-5 text-[2.4rem] leading-[0.86] text-(--a-ink) transition-colors group-hover:text-(--a-purple)">
        <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-(--a-muted)">
        {article.description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-(--a-ink) pt-3">
        <ArticleMeta
          author={article.author.name}
          publishedAt={article.publishedAt}
          readingMinutes={article.readingMinutes}
        />
        <ArrowRightIcon className="h-5 w-5 shrink-0 text-(--a-ink) transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-(--a-purple)" />
      </div>
    </article>
  );
}
