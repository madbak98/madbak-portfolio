import type { FC } from "react";
import Image from "next/image";

import type { LangKey } from "../lib/portfolio-data";

/** Compact glyphs — muted tones so they read as flags without loud primaries. */
const box =
  "block h-[11px] w-[17px] shrink-0 rounded-[2px] sm:h-3 sm:w-[21px]";

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

const FLAG_FA_TOOLTIP = "Raise My Flag , Thats Lion & Sun";
/**
 * Historical Iran — Lion & Sun (local asset, tuned to match muted nav treatment).
 * Source image stored at /public/flags/iran-lion-sun.jpg
 */
export function FlagFa({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden ${box} ${className}`.trim()}
      title={FLAG_FA_TOOLTIP}
    >
      <Image
        src="/flags/iran-lion-sun.jpg"
        alt=""
        width={894}
        height={511}
        sizes="(min-width: 640px) 49px, 42px"
        className="h-full w-full object-cover object-[center_42%] contrast-[0.94] saturate-[0.82] brightness-[0.99]"
        aria-hidden
      />
    </span>
  );
}

const FLAGS: Record<LangKey, FC<{ className?: string }>> = {
  en: FlagEn,
  fa: FlagFa,
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
