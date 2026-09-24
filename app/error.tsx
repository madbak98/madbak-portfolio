"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#0A0A0A] px-6 text-[#EBE8E1]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]">
        Error
      </p>
      <h1 className="mt-4 text-center text-[clamp(2rem,6vw,4rem)] font-black leading-[0.92] tracking-[-0.05em]">
        Something broke.
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-[#EBE8E1]/70">
        The experience failed to load. Retry or return home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center bg-[#ff2a2a] px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-black"
        >
          Retry
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center border border-white/25 px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-[#ff2a2a] hover:text-[#ff2a2a]"
        >
          Home →
        </Link>
      </div>
    </main>
  );
}
