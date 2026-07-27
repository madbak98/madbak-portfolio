"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";

import type { MadlabEntry } from "../../lib/madlab";
import { MadlabExperimentVisual } from "./MadlabExperimentVisual";

const MARQUEE_ITEMS = ["MADLAB", "MOTION", "CODE", "INTERACTION", "BUILT FROM SCRATCH"];

function MagneticButtonPreview() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 24,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 24,
    });
  }

  return (
    <div
      className="flex min-h-[22rem] items-center justify-center border border-white/15 bg-[#101010]"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      aria-label="Interactive magnetic button preview"
    >
      <button
        type="button"
        className="border border-[#ff2a2a] bg-[#ff2a2a] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0a0a0a] transition-transform duration-200 ease-out hover:bg-[#ebe8e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ebe8e1] focus-visible:ring-offset-4 focus-visible:ring-offset-[#101010]"
        style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }}
      >
        Start a conversation
      </button>
    </div>
  );
}

function InfiniteMarqueePreview() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative min-h-[22rem] overflow-hidden border border-white/15 bg-[#101010] py-14" aria-label="Infinite marquee preview">
      <style>{`@keyframes madlab-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      <div className="absolute inset-y-0 left-1/2 w-px bg-[#ff2a2a]/60" aria-hidden="true" />
      <div
        className="flex w-max items-center gap-6 whitespace-nowrap font-black uppercase tracking-[-0.08em] text-[#ebe8e1] sm:gap-10"
        style={prefersReducedMotion ? undefined : { animation: "madlab-marquee 16s linear infinite" }}
      >
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`} className="text-[clamp(3rem,8vw,7rem)]">
            {item} <span className="text-[#ff2a2a]">/</span>
          </span>
        ))}
      </div>
      <p className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">continuous / interruptible / readable</p>
    </div>
  );
}

export function MadlabLivePreview({ entry }: { entry: MadlabEntry }) {
  if (entry.slug === "magnetic-button") return <MagneticButtonPreview />;
  if (entry.slug === "infinite-marquee") return <InfiniteMarqueePreview />;
  return <MadlabExperimentVisual entry={entry} featured />;
}
