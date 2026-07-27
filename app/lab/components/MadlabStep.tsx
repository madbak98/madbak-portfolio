import type { ReactNode } from "react";

export function MadlabStep({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/12 pt-5">
      <div className="flex gap-4">
        <span className="font-mono text-[10px] text-[#ff2a2a]">{number}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold tracking-[-0.03em] text-white/90">{title}</h3>
          <div className="mt-3 text-white/55">{children}</div>
        </div>
      </div>
    </div>
  );
}
