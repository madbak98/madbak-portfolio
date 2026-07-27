import Link from "next/link";

import { getRelatedMadlabEntries, type MadlabEntry } from "../../lib/madlab";

export function MadlabRelatedExperiments({ entry }: { entry: MadlabEntry }) {
  const related = getRelatedMadlabEntries(entry);
  return (
    <section className="border-t border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="related-experiments-title">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-end justify-between gap-6">
          <div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">Continue exploring</p><h2 id="related-experiments-title" className="mt-3 text-3xl font-black tracking-[-0.06em]">Related experiments</h2></div>
          <Link href="/lab" className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-[#ff2a2a]">Full archive ↗</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {related.map((item) => (
            <Link key={item.slug} href={`/lab/${item.slug}`} className="group border border-white/12 p-5 transition-colors hover:border-[#ff2a2a]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">
              <span className="font-mono text-[10px] text-[#ff2a2a]">{item.number}</span>
              <h3 className="mt-8 text-2xl font-black tracking-[-0.05em] group-hover:text-[#ff2a2a]">{item.title}</h3>
              <p className="mt-3 text-sm text-white/45">{item.category} / {item.status}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
