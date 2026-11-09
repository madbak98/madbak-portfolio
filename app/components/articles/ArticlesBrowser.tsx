"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  formatIndex,
  getTopicCounts,
  isTopicFilter,
  type ArticleSummary,
  type ArticleTopicFilter,
} from "../../lib/articles";
import { ArticleList } from "./ArticleList";
import { TopicBar } from "./TopicBar";

function syncTopicToUrl(topic: ArticleTopicFilter) {
  const url = new URL(window.location.href);
  if (topic === "all") url.searchParams.delete("topic");
  else url.searchParams.set("topic", topic);
  window.history.replaceState(window.history.state, "", url);
}

export function ArticlesBrowser({ articles }: { articles: ArticleSummary[] }) {
  const [topic, setTopic] = useState<ArticleTopicFilter>("all");
  const counts = useMemo(() => getTopicCounts(articles), [articles]);
  const numbers = useMemo(
    () => new Map(articles.map((article, index) => [article.slug, formatIndex(index + 1)])),
    [articles],
  );
  const visible = useMemo(
    () => (topic === "all" ? articles : articles.filter((a) => a.topic === topic)),
    [articles, topic],
  );

  // Deep links such as /articles?topic=cybersecurity (used by article category labels).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("topic");
    if (isTopicFilter(fromUrl) && fromUrl !== "all") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
      setTopic(fromUrl);
    }
  }, []);

  const select = useCallback((next: ArticleTopicFilter) => {
    setTopic(next);
    syncTopicToUrl(next);
  }, []);

  const showAll = useCallback(() => {
    select("all");
    document.getElementById("latest")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [select]);

  return (
    <section
      id="latest"
      aria-labelledby="latest-title"
      className="scroll-mt-16 pb-24 pt-24 lg:pb-36 lg:pt-36"
    >
      <div className="a-wrap">
        <div className="grid grid-cols-1 items-end gap-8 border-t-[10px] border-(--a-ink) pt-6 lg:grid-cols-12 lg:gap-6">
          <h2
            id="latest-title"
            className="a-display text-[length:23vw] leading-[0.78] lg:col-span-9 lg:text-[length:13.5vw]"
          >
            Selected
            <br />
            <span className="text-(--a-purple)">Reading.</span>
          </h2>
          <div className="lg:col-span-3 lg:pb-[1vw]">
            <p className="a-label flex justify-between border-b-2 border-(--a-ink) pb-2 font-semibold">
              <span>Index</span>
              <span className="text-(--a-purple)">
                {formatIndex(visible.length)} / {formatIndex(articles.length)}
              </span>
            </p>
            <p className="mt-4 max-w-xs text-[1rem] font-medium leading-snug">
              Long-form essays on security, AI, the web and the craft between design and code.
            </p>
            <p className="a-label mt-4 text-(--a-muted)">Issue 001 — Autumn 2026</p>
          </div>
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        <TopicBar active={topic} counts={counts} onSelect={select} />
        <div className="a-wrap">
          <ArticleList articles={visible} numbers={numbers} topic={topic} onReset={showAll} />
        </div>
      </div>
    </section>
  );
}
