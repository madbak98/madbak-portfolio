"use client";

import { motion } from "motion/react";

import { ARTICLE_TOPICS, type ArticleTopicFilter } from "../../lib/articles";

const OPTIONS: { slug: ArticleTopicFilter; label: string; short: string }[] = [
  { slug: "all", label: "All articles", short: "All" },
  ...ARTICLE_TOPICS,
];

export function TopicBar({
  active,
  counts,
  onSelect,
  className = "",
}: {
  active: ArticleTopicFilter;
  counts: Record<ArticleTopicFilter, number>;
  onSelect: (topic: ArticleTopicFilter) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Browse by topic"
      className={`sticky top-[66px] z-30 border-y-2 border-(--a-ink) bg-(--a-bg) ${className}`}
    >
      <ul className="a-no-scrollbar a-wrap flex snap-x scroll-px-(--a-gutter) overflow-x-auto">
        {OPTIONS.map((option, index) => {
          const selected = option.slug === active;
          const count = counts[option.slug];
          return (
            <li
              key={option.slug}
              className={`shrink-0 snap-start border-(--a-ink)/20 lg:flex-auto ${index > 0 ? "border-l" : ""}`}
            >
              <button
                type="button"
                onClick={() => onSelect(option.slug)}
                aria-pressed={selected}
                aria-label={`${option.label}, ${count} ${count === 1 ? "story" : "stories"}`}
                className={`group relative flex h-14 w-full items-center gap-2 whitespace-nowrap px-4 text-left transition-colors sm:px-5 lg:h-[4.5rem] lg:px-[1.4vw] ${
                  selected ? "text-white" : "text-(--a-ink) hover:text-(--a-purple)"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="topic-active"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    className="absolute inset-0 bg-(--a-purple)"
                  />
                )}
                <span className="a-display relative text-[1.5rem] leading-none tracking-[-0.005em] lg:text-[length:clamp(1.6rem,2.3vw,2.6rem)]">
                  {option.short}
                </span>
                <sup
                  aria-hidden
                  className={`a-label relative -top-2 ${selected ? "text-white/75" : "text-(--a-muted)"}`}
                >
                  {String(count).padStart(2, "0")}
                </sup>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
