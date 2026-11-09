"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return active;
}

function TocList({ headings, active }: { headings: Heading[]; active?: string }) {
  return (
    <ol className="border-t-2 border-(--a-ink)">
      {headings.map((heading, index) => {
        const current = heading.id === active;
        return (
          <li key={heading.id} className="border-b border-(--a-ink)/20">
            <a
              href={`#${heading.id}`}
              aria-current={current ? "location" : undefined}
              className={`flex items-start gap-3 px-2 py-2.5 text-[0.9rem] font-medium leading-snug transition-colors ${
                current
                  ? "bg-(--a-purple) text-white"
                  : "text-(--a-ink) hover:bg-(--a-lavender)"
              }`}
            >
              <span
                className={`a-display w-8 shrink-0 text-[1.6rem] leading-[0.85] tabular-nums ${
                  current ? "text-white" : "text-(--a-purple)"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function ArticleTableOfContents({ headings }: { headings: Heading[] }) {
  const active = useActiveHeading(headings);
  if (headings.length === 0) return null;

  return (
    <>
      <details className="group border-y-2 border-(--a-ink) py-4 lg:hidden">
        <summary className="a-label flex cursor-pointer list-none items-center justify-between font-semibold text-(--a-ink) [&::-webkit-details-marker]:hidden">
          In this article — {String(headings.length).padStart(2, "0")} sections
          <span className="a-display text-[2rem] text-(--a-purple) transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="mt-4">
          <TocList headings={headings} active={active} />
        </div>
      </details>

      <nav aria-label="Table of contents" className="hidden lg:block">
        <p className="a-label mb-3 flex justify-between font-semibold text-(--a-ink)">
          In this article
          <span className="text-(--a-purple)">{String(headings.length).padStart(2, "0")}</span>
        </p>
        <TocList headings={headings} active={active} />
      </nav>
    </>
  );
}
