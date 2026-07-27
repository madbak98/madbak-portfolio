"use client";

import { useMemo, useState } from "react";
import type { MadlabEntry } from "../../lib/madlab";

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const GRID_SIZE = 5;

export function MadlabExperimentVisual({
  entry,
  featured = false,
}: {
  entry: MadlabEntry;
  featured?: boolean;
}) {
  const [pointer, setPointer] = useState<PointerState>({ x: 0.5, y: 0.5, active: false });

  const cells = useMemo(() => Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => index), []);

  function handlePointerMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
      active: true,
    });
  }

  function handlePointerLeave() {
    setPointer((current) => ({ ...current, active: false }));
  }

  return (
    <div
      className={`relative isolate overflow-hidden border border-white/15 bg-[#111111] ${featured ? "min-h-[22rem] sm:min-h-[32rem]" : "min-h-[13rem] sm:min-h-[17rem]"}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(255,42,42,0.18),transparent_35%)]" />
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${featured ? "w-[min(72%,34rem)]" : "w-[min(74%,18rem)]"}`}>
        <div className="relative aspect-square border border-[#ff2a2a]/45 bg-[#0a0a0a]/80 p-[10%] shadow-[0_0_80px_rgba(255,42,42,0.13)]">
          <div
            className="grid h-full grid-cols-5 grid-rows-5 gap-1 border border-white/15 p-1 touch-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
            role="img"
            aria-label="Interactive cursor proximity grid. Move your pointer over the cells."
          >
            {cells.map((index) => {
              const column = index % GRID_SIZE;
              const row = Math.floor(index / GRID_SIZE);
              const cellX = (column + 0.5) / GRID_SIZE;
              const cellY = (row + 0.5) / GRID_SIZE;
              const distance = Math.hypot(pointer.x - cellX, pointer.y - cellY);
              const proximity = pointer.active ? Math.max(0, 1 - distance * 3.2) : 0;

              return (
                <span
                  key={index}
                  className={`relative border border-white/10 transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#ff2a2a]/30 hover:shadow-[inset_0_0_28px_rgba(255,42,42,0.34)] ${proximity > 0.6 ? "bg-[#ff2a2a]/35" : proximity > 0.3 ? "bg-[#ff2a2a]/20" : "bg-white/[0.025]"}`}
                  style={{
                    boxShadow: proximity > 0.05 ? `inset 0 0 28px rgba(255, 42, 42, ${proximity * 0.34})` : "none",
                    transform: `scale(${1 + proximity * 0.025})`,
                  }}
                />
              );
            })}
          </div>
          <span className="absolute -right-3 -top-3 bg-[#ff2a2a] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[#0a0a0a]">
            {entry.number}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/35">
          <span>{pointer.active ? "pointer / tracking" : "pointer / proximity"}</span>
          <span>{pointer.active ? "live" : "move to test"}</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[8px] uppercase tracking-[0.16em] text-white/30 sm:bottom-6 sm:left-6">
        {entry.category} / {entry.technologies[0]}
      </div>
    </div>
  );
}
