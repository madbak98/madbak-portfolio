import Link from "next/link";

import { WorkSignature } from "../WorkSignature";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/works/websites" },
  { label: "MADLAB", href: "/lab" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export function ArticlesFooter() {
  return (
    <footer className="a-wrap pb-8 pt-10 lg:pt-14">
      <p
        aria-hidden
        className="a-display flex select-none items-start text-[length:28vw] leading-[0.76] tracking-[-0.02em]"
      >
        MADBAK
        <span className="ml-[0.04em] mt-[0.02em] text-[0.22em] leading-none text-(--a-purple)">®</span>
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 border-t-[6px] border-(--a-ink) pt-6 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <p className="a-label font-semibold text-(--a-purple)">MADBAK® Journal — Articles</p>
          <p className="mt-3 max-w-sm text-[1rem] font-medium leading-snug">
            An independent journal on design, code, AI and security — written by a creative
            technologist in Istanbul.
          </p>
        </div>
        <nav aria-label="Footer" className="lg:col-span-5">
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {LINKS.map((link) => (
              <li key={link.label} className="border-y-2 border-(--a-ink) [&:nth-child(n+4)]:border-t-0 max-sm:[&:nth-child(n+3)]:border-t-0">
                <Link
                  href={link.href}
                  className="a-label flex h-12 items-center justify-between px-1 font-semibold transition-colors hover:bg-(--a-purple) hover:px-3 hover:text-white"
                >
                  {link.label}
                  <span aria-hidden>↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex lg:col-span-3 lg:justify-end">
          <WorkSignature className="self-start" />
        </div>
      </div>
      <p className="a-label mt-10 flex flex-col justify-between gap-2 text-(--a-muted) sm:flex-row">
        <span>© 2026 MADBAK IND.</span>
        <span>Sculpture photography: public-domain (CC0) museum collections.</span>
      </p>
    </footer>
  );
}
