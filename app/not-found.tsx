import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found — MADBAK" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#0A0A0A] px-6 text-[#EBE8E1]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]">
        404
      </p>
      <h1 className="mt-4 text-center text-[clamp(2.5rem,8vw,5rem)] font-black leading-[0.9] tracking-[-0.06em]">
        PAGE NOT FOUND
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-[#EBE8E1]/70">
        This route does not exist in the MADBAK system.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center border border-white/25 px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-[#ff2a2a] hover:text-[#ff2a2a]"
      >
        Back home →
      </Link>
    </main>
  );
}
