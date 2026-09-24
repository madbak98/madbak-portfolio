import Link from "next/link";

import { MADLAB_ENTRIES } from "../../lib/madlab";

/**
 * Indexable MADLAB experiments — hand-authored pages with unique writeups.
 * Catalog demos stay in the archive below; these are the SEO-facing core.
 */
export function MadlabFeaturedExperiments() {
  return (
    <section
      id="featured-experiments"
      className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      aria-labelledby="featured-experiments-title"
    >
      <div className="mx-auto max-w-[1600px]">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2a2a]">
            MADLAB / START HERE
          </p>
          <h2
            id="featured-experiments-title"
            className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[0.88] tracking-[-0.08em]"
          >
            Written experiments
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/50">
            Three interaction studies with overview, build steps, starter code, and notes.
            The component archive below stays as a live reference library.
          </p>
        </header>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MADLAB_ENTRIES.map((entry) => (
            <li key={entry.slug} className="border border-white/12 bg-[#101010] p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff2a2a]">
                {entry.number} / {entry.category}
              </p>
              <h3 className="mt-4 text-2xl font-black tracking-[-0.05em]">
                <Link
                  href={`/lab/${entry.slug}`}
                  className="transition-colors hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]"
                >
                  {entry.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{entry.description}</p>
              <Link
                href={`/lab/${entry.slug}`}
                className="mt-6 inline-flex font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a] transition-colors hover:text-[#ebe8e1]"
              >
                Open experiment ↗
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
