import type { MadlabEntry } from "../../lib/madlab";
import { MadlabDetailCodeViewer } from "./MadlabDetailCodeViewer";
import { MadlabLivePreview } from "./MadlabLivePreview";

export function MadlabPreviewShell({ entry, code }: { entry: MadlabEntry; code: string }) {
  return (
    <section className="border-b border-white/12 px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="preview-title">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
          <h2 id="preview-title">Interactive preview shell</h2>
          <span>{entry.status}</span>
        </div>
        <div className="relative">
          <MadlabLivePreview entry={entry} />
          <p className="absolute bottom-5 left-5 max-w-xs border border-white/20 bg-[#0a0a0a]/85 px-3 py-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/55 backdrop-blur-sm sm:bottom-7 sm:left-7">
            {entry.slug === "cursor-grid" ? "Move your pointer over the grid to test proximity feedback." : entry.slug === "magnetic-button" ? "Move toward the button and feel the attraction." : "A continuous text loop with a controlled, readable pace."}
          </p>
        </div>
        <MadlabDetailCodeViewer code={code} />
      </div>
    </section>
  );
}
