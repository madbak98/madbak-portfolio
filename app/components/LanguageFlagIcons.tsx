import type { FC } from "react";
import Image from "next/image";

import type { LangKey } from "../lib/portfolio-data";

/** Compact glyphs — muted tones so they read as flags without loud primaries. */
const box = "block h-[11px] w-[17px] shrink-0 sm:h-3 sm:w-[21px]";

/** US — simplified stripes & canton in desaturated, warm-grayscale palette. */
export function FlagEn({ className = "" }: { className?: string }) {
  const stripes = 13;
  const sh = 30 / stripes;
  const a = "#5c3d42";
  const b = "#b8b0a6";
  const canton = "#3a4552";
  const star = "#d4cfc5";
  return (
    <svg
      viewBox="0 0 60 30"
      className={`${box} ${className}`.trim()}
      aria-hidden
    >
      {Array.from({ length: stripes }, (_, i) => (
        <rect
          key={i}
          y={i * sh}
          width="60"
          height={sh + 0.02}
          fill={i % 2 === 0 ? a : b}
        />
      ))}
      <rect width="26" height={7 * sh + 0.1} fill={canton} />
      {[
        [6.5, 2.1],
        [13, 2.1],
        [19.5, 2.1],
        [10, 4.4],
        [16.5, 4.4],
        [6.5, 6.7],
        [13, 6.7],
        [19.5, 6.7],
        [10, 9],
        [16.5, 9],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.05} fill={star} opacity="0.88" />
      ))}
    </svg>
  );
}

/** Turkey — dusty crimson field, cream emblem. */
export function FlagTr({ className = "" }: { className?: string }) {
  const field = "#7a3e44";
  const cream = "#e5e1d8";
  return (
    <svg
      viewBox="0 0 60 40"
      className={`${box} ${className}`.trim()}
      aria-hidden
    >
      <rect width="60" height="40" fill={field} />
      <circle cx="22" cy="20" r="11" fill={cream} />
      <circle cx="25.2" cy="20" r="9" fill={field} />
      <path
        fill={cream}
        d="M34.8 20l2.1-6.4 2.1 6.4h6.8l-5.5 4 2.1 6.4-5.5-4-5.5 4 2.1-6.4-5.5-4h6.8z"
      />
    </svg>
  );
}

/**
 * Historical Iran — Lion & Sun (local asset, tuned to match muted nav treatment).
 * Source image stored at /public/flags/iran-lion-sun.jpg
 */
export function FlagFa({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/flags/iran-lion-sun.jpg"
      alt=""
      width={894}
      height={511}
      sizes="24px"
      className={`${box} object-cover object-[center_42%] contrast-[0.94] saturate-[0.82] brightness-[0.99] ${className}`.trim()}
      aria-hidden
    />
  );
}

const FLAGS: Record<LangKey, FC<{ className?: string }>> = {
  en: FlagEn,
  fa: FlagFa,
  tr: FlagTr,
};

export function LanguageFlag({
  code,
  className = "",
}: {
  code: LangKey;
  className?: string;
}) {
  const Cmp = FLAGS[code];
  return <Cmp className={className} />;
}
