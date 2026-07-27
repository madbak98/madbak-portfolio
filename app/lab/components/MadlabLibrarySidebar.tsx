"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MADLAB_ENTRIES } from "../../lib/madlab";
import { REACT_BITS_FREE_GROUPS } from "../../lib/react-bits-free";

const LIBRARY_GROUPS = [
  ...REACT_BITS_FREE_GROUPS.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      title: item.title,
      href: `/lab/${item.slug}`,
    })),
  })),
  {
    title: "MADLAB / BUILT",
    items: MADLAB_ENTRIES.map((entry) => ({
      title: entry.title,
      href: `/lab/${entry.slug}`,
    })),
  },
];

function LibraryContents({ onClose }: { onClose?: () => void }) {
  return (
    <div className="px-5 py-8 sm:px-8 lg:px-5 lg:py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">MADLAB / index</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.07em]">LIBRARY</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]"
            aria-label="Close MADLAB library"
          >
            CLOSE ×
          </button>
        ) : (
          <Link href="#archive" className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35 hover:text-[#ff2a2a]">↓</Link>
        )}
      </div>

      <nav className="grid gap-8 sm:grid-cols-2 lg:block" aria-label="MADLAB library titles">
        {LIBRARY_GROUPS.map((group) => (
          <section key={group.title} className="lg:mb-9">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">{group.title}</h3>
            <ul className="mt-4 space-y-3 border-l border-white/12 pl-4">
              {group.items.map((item) => (
                <li key={`${group.title}-${item.title}`}>
                  <Link href={item.href} className="text-sm leading-tight text-white/70 transition-colors hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </div>
  );
}

function MadlabLibraryMobileAndDesktop() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className="border-b border-white/12 px-5 py-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between border border-white/15 px-4 py-3 text-left transition-colors hover:border-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]"
          aria-expanded={isOpen}
          aria-controls="madlab-mobile-library"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]">MADLAB / INDEX</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">OPEN LIBRARY ↗</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="MADLAB component library">
          <button type="button" className="absolute inset-0 bg-[#0A0A0A]/80" onClick={() => setIsOpen(false)} aria-label="Close MADLAB library" />
          <aside id="madlab-mobile-library" className="relative h-full w-[min(88vw,22rem)] overflow-y-auto border-r border-white/15 bg-[#0A0A0A] pt-14 shadow-[20px_0_80px_rgba(0,0,0,0.45)] sm:pt-[3.75rem]">
            <LibraryContents onClose={() => setIsOpen(false)} />
          </aside>
        </div>
      )}

      <aside className="hidden border-b border-white/12 lg:block lg:self-start lg:border-b-0 lg:border-r lg:border-white/12" aria-label="MADLAB component library">
        <LibraryContents />
      </aside>
    </>
  );
}

export function MadlabLibrarySidebar() {
  return <MadlabLibraryMobileAndDesktop />;
}
