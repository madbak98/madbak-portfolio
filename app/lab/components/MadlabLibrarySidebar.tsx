import Link from "next/link";

import { MADLAB_ENTRIES } from "../../lib/madlab";
import { REACT_BITS_FREE_GROUPS } from "../../lib/react-bits-free";

export function MadlabLibrarySidebar() {
  return (
    <aside className="border-b border-white/12 lg:self-start lg:border-b-0 lg:border-r lg:border-white/12" aria-label="MADLAB component library">
      <div className="px-5 py-8 sm:px-8 lg:px-5 lg:py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">MADLAB / index</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.07em]">LIBRARY</h2>
          </div>
          <Link href="#archive" className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35 hover:text-[#ff2a2a]">↓</Link>
        </div>

        <nav className="grid gap-8 sm:grid-cols-2 lg:block" aria-label="MADLAB library titles">
          {[...REACT_BITS_FREE_GROUPS.map((group) => ({
            title: group.title,
            items: group.items.map((item) => ({
              title: item.title,
              href: `/lab/${item.slug}`,
            })),
          })), {
            title: "MADLAB / BUILT",
            items: MADLAB_ENTRIES.map((entry) => ({
              title: entry.title,
              href: `/lab/${entry.slug}`,
            })),
          }].map((group) => (
            <section key={group.title} className="lg:mb-9">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">{group.title}</h3>
              <ul className="mt-4 space-y-3 border-l border-white/12 pl-4">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.title}`}>
                    {item.href ? (
                      <Link href={item.href} className="text-sm leading-tight text-white/70 transition-colors hover:text-[#ff2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">
                        {item.title}
                      </Link>
                    ) : (
                      <span className="text-sm leading-tight text-white/55">{item.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </aside>
  );
}
