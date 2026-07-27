import Link from "next/link";

import type { MadlabEntry } from "../../lib/madlab";
import { MadlabExperimentVisual } from "./MadlabExperimentVisual";

export function MadlabExperimentRow({ entry, index }: { entry: MadlabEntry; index: number }) {
  return (
    <article className="group grid gap-6 border-t border-white/12 py-8 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(14rem,0.65fr)_auto] sm:items-center sm:gap-8 sm:py-10">
      <p className="font-mono text-xs text-[#ff2a2a]">{entry.number}</p>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          <span>{entry.category}</span>
          <span aria-hidden>·</span>
          <span>{entry.status}</span>
        </div>
        <h3 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.86] tracking-[-0.08em] transition-colors group-hover:text-[#ff2a2a]">
          <Link href={`/lab/${entry.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A]">
            {entry.title}
          </Link>
        </h3>
      </div>
      <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 sm:block">
        <MadlabExperimentVisual entry={entry} />
        <p className="mt-0 text-sm leading-relaxed text-white/45 sm:mt-4">{entry.description}</p>
      </div>
      <div className="flex items-end justify-between gap-5 sm:block sm:text-end">
        <div className="space-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
          <p>{entry.technologies.join(" / ")}</p>
          <p>{entry.difficulty}</p>
        </div>
        <span className="mt-5 block font-mono text-xl text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#ff2a2a]" aria-hidden>
          ↗
        </span>
      </div>
      <span className="sr-only">Experiment {index + 1}: {entry.title}</span>
    </article>
  );
}
