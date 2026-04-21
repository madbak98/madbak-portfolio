import type { FC } from "react";

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
 * Historical Iran — soft tricolor + restrained Lion & Sun mark.
 */
export function FlagFa({ className = "" }: { className?: string }) {
  const g = "#4f5e52";
  const w = "#d9d4cb";
  const r = "#7a4a48";
  const gold = "#8f7a52";
  const sunFill = "#c4b89a";
  const lion = "#252525";

  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return (
      <line
        key={deg}
        x1={30 + c * 6}
        y1={18 + s * 6}
        x2={30 + c * 8.5}
        y2={18 + s * 8.5}
        stroke={gold}
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.75"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 60 36"
      className={`${box} ${className}`.trim()}
      aria-hidden
    >
      <rect y="0" width="60" height="12" fill={g} />
      <rect y="12" width="60" height="12" fill={w} />
      <rect y="24" width="60" height="12" fill={r} />
      <circle cx="30" cy="18" r="4.5" fill="none" stroke={gold} strokeWidth="0.85" opacity="0.85" />
      <circle cx="30" cy="18" r="2.8" fill={sunFill} fillOpacity="0.28" />
      {rays}
      <path
        fill={lion}
        fillOpacity="0.78"
        d="M21.2 18.4c.6-1.1 1.8-1.7 3-1.5 1 .2 1.7.9 2.1 1.7.4-.4 1.1-.6 1.7-.4.5.2.9.6 1.1 1.1.3-.2.8-.3 1.2-.1.4.2.7.6.8 1l.1.4c.1.5-.1 1-.6 1.2-.4.2-.9.1-1.3-.2-.1.4-.5.8-1 .9-.5.1-1 0-1.4-.3-.2.3-.7.5-1.2.4-.4-.1-.7-.3-1-.6-.2.2-.6.4-1 .3-.4-.1-.7-.3-.9-.6l-.2.2c-.4.3-1 .3-1.5-.1-.5-.3-.7-.9-.5-1.4.1-.3.3-.6.6-.8-.4-.2-.7-.6-.7-1.1 0-.5.4-1 .9-1.2z"
      />
      <path
        fill="none"
        stroke={lion}
        strokeOpacity="0.5"
        strokeWidth="0.4"
        strokeLinecap="round"
        d="M19.5 19.6c1.4.5 3 .4 4.3-.4"
      />
    </svg>
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
