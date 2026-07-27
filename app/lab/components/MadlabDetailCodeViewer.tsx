"use client";

import { useState } from "react";

export function MadlabDetailCodeViewer({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-4">
      <button type="button" onClick={() => setOpen((current) => !current)} className="border border-[#ff2a2a] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a] transition-colors hover:bg-[#ff2a2a] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]" aria-expanded={open}>
        {open ? "Close code" : "View code"}
      </button>
      {open ? (
        <div className="mt-4 border border-white/15 bg-[#101010] p-4 sm:p-5" role="region" aria-label="Component source code">
          <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a]">MADLAB / component source</p>
            <button type="button" onClick={copyCode} className="border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:border-white/40 hover:text-white">{copied ? "Copied" : "Copy"}</button>
          </div>
          <pre className="mt-4 max-h-[28rem] overflow-auto bg-[#080808] p-4 font-mono text-[10px] leading-relaxed text-[#ebe8e1]"><code>{code}</code></pre>
        </div>
      ) : null}
    </div>
  );
}
