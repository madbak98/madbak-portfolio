"use client";

import { useEffect, useState } from "react";

import type { ReactBitsFreeItem } from "../../lib/react-bits-free";

type CodeResponse = {
  title: string;
  variant: string;
  sourcePath: string;
  code: string;
};

export function ReactBitsCodeViewer({ item, initiallyOpen = false }: { item: ReactBitsFreeItem; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<CodeResponse | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadSource() {
    if (source || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/react-bits-code/${item.slug}`);
      const payload = await response.json() as CodeResponse | { error?: string };
      if (!response.ok || !("code" in payload)) throw new Error("error" in payload ? payload.error : "Unable to load source.");
      setSource(payload);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load source.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // The code tab mounts this viewer already open; load the local source on demand.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void loadSource();
    // Loading is intentionally tied to the open state so the Code tab can render the source immediately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggleCode() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) void loadSource();
  }

  async function copyCode() {
    if (!source) return;
    await navigator.clipboard.writeText(source.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <div className="absolute bottom-3 right-3 z-10">
        <button type="button" onClick={toggleCode} className="border border-[#ff2a2a] bg-[#0A0A0A]/90 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#ff2a2a] backdrop-blur transition-colors hover:bg-[#ff2a2a] hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]" aria-expanded={open}>
          {open ? "Close code" : "View code"}
        </button>
      </div>
      {open ? (
        <div className="mt-3 w-full border border-white/15 bg-[#101010] p-4 text-left shadow-2xl sm:p-5" role="region" aria-label={`${item.title} source code`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#ff2a2a]">Official source / {item.title}</p>
              <p className="mt-1 font-mono text-[9px] text-white/35">TS + Tailwind / MADLAB source</p>
            </div>
            <button type="button" onClick={copyCode} disabled={!source} className="border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:border-white/40 hover:text-white disabled:cursor-wait disabled:opacity-40">{copied ? "Copied" : "Copy"}</button>
          </div>
          {loading ? <p className="py-8 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Loading source...</p> : null}
          {error ? <p className="py-8 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ff2a2a]">{error}</p> : null}
          {source ? (
            <>
              <pre className="mt-3 max-h-[22rem] overflow-auto border border-white/10 bg-[#080808] p-4 text-left font-mono text-[10px] leading-relaxed text-[#ebe8e1]"><code>{source.code}</code></pre>
              <p className="mt-3 break-all font-mono text-[9px] leading-relaxed text-white/30">Source: {source.sourcePath}</p>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
