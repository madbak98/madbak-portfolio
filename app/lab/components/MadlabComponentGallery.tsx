"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { REACT_BITS_FREE_ITEMS, type ReactBitsFreeCategory, type ReactBitsFreeItem } from "../../lib/react-bits-free";
import { usePreferredLang } from "../../lib/locale-preference";
import { madlabCategoryLabel, madlabText } from "../../lib/madlab-i18n";
import { ReactBitsCodeViewer } from "./ReactBitsCodeViewer";
import { ReactBitsLivePreview } from "./ReactBitsLivePreview";

const CATEGORIES: Array<"ALL" | ReactBitsFreeCategory> = ["ALL", "ANIMATIONS", "BACKGROUNDS", "COMPONENTS", "TEXT ANIMATIONS"];

function CatalogCard({ item, lang }: { item: ReactBitsFreeItem; lang: "en" | "fa" | "tr" }) {
  return (
    <article id={item.slug} className="group min-w-0 scroll-mt-32">
      <div className="relative">
        <Link href={`/lab/${item.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">
          <ReactBitsLivePreview item={item} />
        </Link>
        <ReactBitsCodeViewer item={item} />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{madlabCategoryLabel(lang, item.category)}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#ebe8e1] transition-colors group-hover:text-[#ff2a2a] sm:text-2xl"><Link href={`/lab/${item.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">{item.title}</Link></h3>
        </div>
        <span className="mt-1 font-mono text-sm text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#ff2a2a]" aria-hidden>↗</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#ff2a2a]">{madlabText(lang, "freeOpenSource")}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">{madlabText(lang, "officialSource")}</span>
      </div>
    </article>
  );
}

export function MadlabComponentGallery() {
  const [lang] = usePreferredLang();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("ALL");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return REACT_BITS_FREE_ITEMS.filter((item) => {
      const matchesCategory = category === "ALL" || item.category === category;
      const matchesQuery = !normalizedQuery || item.title.toLowerCase().includes(normalizedQuery) || item.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section id="archive" className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-20 lg:px-12" aria-labelledby="component-gallery-title">
      <div className="mx-auto max-w-[1600px]">
        <header className="flex flex-col gap-8 border-b border-white/12 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2a2a]">{madlabText(lang, "catalog")}</p>
            <h2 id="component-gallery-title" className="mt-4 max-w-4xl text-[clamp(3.4rem,8vw,8rem)] font-black leading-[0.8] tracking-[-0.11em]">{madlabText(lang, "components")}</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/45 sm:text-lg">{madlabText(lang, "catalogDescription")}</p>
          </div>
          <div className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 lg:text-right">
            <p>{REACT_BITS_FREE_ITEMS.length} {madlabText(lang, "freeReferences")}</p>
            <p className="mt-2 text-[#ff2a2a]">{madlabText(lang, "noPro")}</p>
          </div>
        </header>

        <div className="sticky top-14 z-20 -mx-5 border-b border-white/12 bg-[#0A0A0A]/95 px-5 py-4 backdrop-blur sm:top-[3.75rem] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex min-h-10 min-w-0 items-center gap-3 border border-white/15 px-3 focus-within:border-[#ff2a2a] lg:w-[20rem]">
              <span className="font-mono text-xs text-white/40" aria-hidden>⌕</span>
              <span className="sr-only">{madlabText(lang, "searchAria")}</span>
              <input aria-label={madlabText(lang, "searchAria")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={madlabText(lang, "search")} className="min-w-0 flex-1 bg-transparent font-mono text-[10px] uppercase tracking-[0.12em] text-[#ebe8e1] outline-none placeholder:text-white/30" />
            </label>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label={madlabText(lang, "filterAria")}>
              {CATEGORIES.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a] ${category === item ? "border-[#ff2a2a] bg-[#ff2a2a] text-[#0A0A0A]" : "border-white/15 text-white/45 hover:border-white/40 hover:text-[#ebe8e1]"}`} aria-pressed={category === item}>{madlabCategoryLabel(lang, item)}</button>
              ))}
            </div>
          </div>
        </div>

        <section className="pt-12 sm:pt-16" aria-labelledby="free-reference-title">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{madlabText(lang, "freeReference")}</p>
              <h3 id="free-reference-title" className="mt-3 text-3xl font-semibold tracking-[-0.07em] sm:text-4xl">{madlabText(lang, "library")}</h3>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{filteredItems.length} {madlabText(lang, "shown")}</span>
          </div>
          {filteredItems.length ? (
            <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filteredItems.map((item) => <CatalogCard key={item.slug} item={item} lang={lang} />)}</div>
          ) : <p className="border border-white/12 py-16 text-center font-mono text-xs uppercase tracking-[0.15em] text-white/40">{madlabText(lang, "noMatch")}</p>}
        </section>
      </div>
    </section>
  );
}
