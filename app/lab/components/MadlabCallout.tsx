import type { ReactNode } from "react";

export function MadlabCallout({ kind, title, children }: { kind: "note" | "warning" | "tip"; title: string; children: ReactNode }) {
  return (
    <aside className={`my-6 border-s-2 p-4 ${kind === "warning" ? "border-[#ff2a2a] bg-[#ff2a2a]/[0.06]" : "border-white/25 bg-white/[0.04]"}`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff2a2a]">{kind} / {title}</p>
      <div className="mt-2 text-sm text-white/60">{children}</div>
    </aside>
  );
}
