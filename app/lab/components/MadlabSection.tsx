import type { ReactNode } from "react";

export function MadlabSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby={`${eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`}>
      <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.3fr_1fr] lg:gap-16">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff2a2a]">{eyebrow}</p>
          <h2 id={`${eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`} className="mt-3 text-2xl font-black tracking-[-0.05em] sm:text-3xl">{title}</h2>
        </div>
        <div className="min-w-0 text-base leading-relaxed text-white/60">{children}</div>
      </div>
    </section>
  );
}
