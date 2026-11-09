"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { ArticleSummary, ArticleTopicFilter } from "../../lib/articles";
import { ArticleRow } from "./ArticleRow";

export function ArticleList({
  articles,
  numbers,
  topic,
  onReset,
}: {
  articles: ArticleSummary[];
  numbers: Map<string, string>;
  topic: ArticleTopicFilter;
  onReset: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div aria-live="polite" className="border-b-[10px] border-(--a-ink)">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={topic}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {articles.length === 0 ? (
            <div className="py-20 text-center">
              <p className="a-display text-[3rem]">No stories here yet.</p>
              <button
                type="button"
                onClick={onReset}
                className="a-label mt-6 bg-(--a-purple) px-5 py-3 font-semibold text-white hover:bg-(--a-ink) hover:text-(--a-on-ink)"
              >
                Show all articles
              </button>
            </div>
          ) : (
            articles.map((article, index) => (
              <ArticleRow
                key={article.slug}
                article={article}
                number={numbers.get(article.slug) ?? ""}
                index={index}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
