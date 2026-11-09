"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";

import { getTopic, type ArticleSummary } from "../../lib/articles";
import { ArticleMeta } from "./ArticleMeta";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "./icons";
import { useDialogBehaviour } from "./useDialogBehaviour";

function matches(article: ArticleSummary, query: string) {
  const haystack =
    `${article.title} ${article.description} ${getTopic(article.topic).label}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

type SearchProps = {
  open: boolean;
  onClose: () => void;
  articles: ArticleSummary[];
};

export function ArticleSearch({ open, onClose, articles }: SearchProps) {
  return (
    <AnimatePresence>
      {open && <SearchPanel onClose={onClose} articles={articles} />}
    </AnimatePresence>
  );
}

function SearchPanel({ onClose, articles }: Omit<SearchProps, "open">) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehaviour(true, onClose, panelRef);

  const results = useMemo(
    () => (deferred.trim() ? articles.filter((a) => matches(a, deferred)) : articles),
    [articles, deferred],
  );

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-(--a-scrim) px-4 pt-[10vh] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search articles"
        className="w-full max-w-2xl overflow-hidden border-2 border-(--a-ink) bg-(--a-surface) shadow-[12px_12px_0_var(--a-purple)]"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 border-b-2 border-(--a-ink) px-5">
          <SearchIcon className="h-5 w-5 text-(--a-muted)" />
          <label htmlFor="article-search" className="sr-only">
            Search articles
          </label>
          <input
            id="article-search"
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, topics, ideas…"
            className="h-16 min-w-0 flex-1 bg-transparent text-[1.05rem] font-medium text-(--a-ink) outline-none placeholder:text-(--a-muted)/70 [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="hidden border border-(--a-ink) px-1.5 py-0.5 text-[0.7rem] text-(--a-muted) sm:block">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="-mr-5 flex h-16 w-16 items-center justify-center bg-(--a-ink) text-(--a-on-ink) transition-colors hover:bg-(--a-purple) hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="px-3 pb-2 pt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-(--a-muted)">
            {deferred.trim()
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "All stories"}
          </p>
          {results.length === 0 ? (
            <p className="px-3 pb-6 pt-2 text-sm text-(--a-muted)">
              Nothing matches “{deferred}”. Try “security”, “AI” or “design”.
            </p>
          ) : (
            <ul>
              {results.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 border-b border-(--a-line) px-3 py-3 transition-colors hover:bg-(--a-lavender) focus-visible:bg-(--a-lavender)"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--a-purple)">
                        {getTopic(article.topic).label}
                      </p>
                      <p className="a-display mt-1 truncate text-[1.6rem] text-(--a-ink)">
                        {article.title}
                      </p>
                      <ArticleMeta
                        className="mt-1"
                        author={article.authorName}
                        publishedAt={article.publishedAt}
                        readingMinutes={article.readingMinutes}
                      />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-(--a-muted) transition-transform group-hover:translate-x-1 group-hover:text-(--a-purple)" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
