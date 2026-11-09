import { formatArticleDate } from "../../lib/articles";

export function ArticleMeta({
  author,
  publishedAt,
  readingMinutes,
  className = "",
}: {
  author: string;
  publishedAt: string;
  readingMinutes: number;
  className?: string;
}) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-(--a-muted) ${className}`}
    >
      <span className="font-medium text-(--a-ink)">{author}</span>
      <span aria-hidden>·</span>
      <time dateTime={publishedAt}>{formatArticleDate(publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{readingMinutes} min read</span>
    </p>
  );
}
