import Link from "next/link";

import { FooterCrowd } from "../../components/FooterCrowd";

export function MadlabManifesto() {
  return (
    <section
      className="relative isolate min-h-[390px] overflow-hidden border-t-2 border-[#ff2a2a] bg-[#0a0a0a] px-5 py-10 text-[#ebe8e1] sm:min-h-[460px] sm:px-8 sm:py-12 lg:px-12"
      aria-labelledby="madlab-manifesto-title"
    >
      <FooterCrowd />

      <div className="relative z-10 mx-auto flex min-h-[330px] max-w-[1600px] flex-col gap-8 sm:min-h-[390px] sm:gap-10">
        <div className="max-w-3xl">
          <p id="madlab-manifesto-title" className="text-sm leading-relaxed text-white/60 sm:text-base">
            MADBAK — CREATIVE FRONTEND DEVELOPER AND WEB DESIGNER BUILDING INTERACTIVE WEBSITES, DIGITAL EXPERIENCES, AND MOTION-LED PROJECTS.
          </p>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff2a2a]">MADLAB / MANIFESTO</p>
        </div>

        <nav aria-label="MADLAB footer navigation" className="flex max-w-4xl flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
          <Link href="/works/websites" className="transition-colors hover:text-[#ebe8e1]">Websites</Link>
          <Link href="/works/character-design" className="transition-colors hover:text-[#ebe8e1]">Character Design</Link>
          <Link href="/works/ai-influencer" className="transition-colors hover:text-[#ebe8e1]">AI Influencer</Link>
          <Link href="/works/nft-collection" className="transition-colors hover:text-[#ebe8e1]">NFT Collection</Link>
          <Link href="/services" className="transition-colors hover:text-[#ebe8e1]">Services</Link>
          <Link href="/lab" className="text-[#ebe8e1] transition-colors hover:text-[#ff2a2a]">MADLAB</Link>
          <Link href="/#about" className="transition-colors hover:text-[#ebe8e1]">About</Link>
          <Link href="/#contact" className="transition-colors hover:text-[#ebe8e1]">Contact</Link>
        </nav>

        <div className="mt-auto flex flex-col gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          <p>© 2026 MADBAK IND.</p>
          <p className="text-[8px] tracking-[0.12em] text-white/25">
            Crowd study by <a className="underline underline-offset-2 transition-colors hover:text-white/60" href="https://skiper-ui.com/v1/skiper39" target="_blank" rel="noreferrer">Skiper UI</a> · characters by <a className="underline underline-offset-2 transition-colors hover:text-white/60" href="https://www.openpeeps.com/" target="_blank" rel="noreferrer">Open Peeps</a>
          </p>
        </div>
      </div>
    </section>
  );
}
