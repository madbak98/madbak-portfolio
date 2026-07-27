import type { MadlabEntry } from "../../lib/madlab";
import { formatMadlabDate } from "../../lib/madlab";

export function MadlabArticleHeader({ entry }: { entry: MadlabEntry }) {
  return (
    <header className="relative border-b border-white/12 px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span className="text-[#ff2a2a]">{entry.number}</span>
          <span>{entry.category}</span>
          <span>{entry.status}</span>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] lg:items-end lg:gap-20">
          <h1 className="max-w-4xl break-words text-[clamp(3.2rem,8vw,9rem)] font-black leading-[0.82] tracking-[-0.1em]">{entry.title}</h1>
          <p className="max-w-md text-lg leading-relaxed text-white/55">{entry.description}</p>
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/12 pt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 sm:grid-cols-4">
          <div><dt>Difficulty</dt><dd className="mt-2 text-white/70">{entry.difficulty}</dd></div>
          <div><dt>Build time</dt><dd className="mt-2 text-white/70">{entry.estimatedTime}</dd></div>
          <div><dt>Published</dt><dd className="mt-2 text-white/70">{formatMadlabDate(entry.publishedAt)}</dd></div>
          <div><dt>Updated</dt><dd className="mt-2 text-white/70">{formatMadlabDate(entry.updatedAt ?? entry.publishedAt)}</dd></div>
        </dl>
      </div>
    </header>
  );
}
