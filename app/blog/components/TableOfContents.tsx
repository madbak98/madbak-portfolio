import Link from "next/link";

import type { BlogHeading } from "../../lib/blog";

export function TableOfContents({ headings }: { headings: BlogHeading[] }) {
  if (headings.length < 3) return null;

  return (
    <aside className="border-y border-white/12 py-5 lg:sticky lg:top-24 lg:border-y-0 lg:border-s lg:py-0 lg:ps-6" aria-label="Table of contents">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff2a2a]">On this page</p>
      <nav className="mt-4 space-y-3">
        {headings.map((heading) => (
          <Link
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm leading-relaxed text-white/45 transition-colors hover:text-[#EBE8E1] ${heading.level === 3 ? "ps-3 text-xs" : ""}`}
          >
            {heading.text}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
