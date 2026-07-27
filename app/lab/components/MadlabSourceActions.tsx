import type { MadlabEntry } from "../../lib/madlab";

export function MadlabSourceActions({ entry }: { entry: MadlabEntry }) {
  return (
    <div className="border border-white/15 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff2a2a]">Final source actions</p>
          <p className="mt-3 text-sm text-white/55">{entry.sourceAvailable ? "Source is available in the implementation block above." : "Source will be published with the complete tutorial release."}</p>
        </div>
        {entry.sourceAvailable ? (
          <a href="#implementation-code" className="border border-[#ff2a2a]/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a] transition-colors hover:bg-[#ff2a2a] hover:text-[#0a0a0a] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#ebe8e1]">
            jump to code
          </a>
        ) : <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">not published</span>}
      </div>
    </div>
  );
}
