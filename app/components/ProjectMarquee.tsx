"use client";

import type { LangKey } from "../lib/portfolio-data";
import { localeCase } from "../lib/locale-ui";

const MARQUEE_ITEMS = Array.from({ length: 10 }, (_, index) => index);

const EDGE_MASK =
  "[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_56px,black_calc(100%-56px),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_64px,black_calc(100%-64px),transparent)]";

type ProjectMarqueeProps = {
  text: string;
  accessibleLabel: string;
  stripBackground: string;
  textColor: string;
  dividerColor?: string;
  lang?: LangKey;
};

function marqueeTextClass(lang: LangKey) {
  if (lang === "fa") {
    return "shrink-0 font-[family-name:var(--font-persian)] text-[clamp(1.8rem,3vw,3.6rem)] leading-[1.15] tracking-[0] [font-feature-settings:'kern'_1]";
  }
  return `shrink-0 font-bevan text-[clamp(1.8rem,3vw,3.6rem)] leading-[0.95] tracking-[-0.03em] uppercase ${localeCase(lang)}`;
}

function MarqueeGroup({
  text,
  textColor,
  trackKey,
  lang,
}: {
  text: string;
  textColor: string;
  trackKey: string;
  lang: LangKey;
}) {
  return (
    <div className="project-marquee-group gap-8 pe-8 sm:gap-10 sm:pe-10 md:gap-12 md:pe-12">
      {MARQUEE_ITEMS.map((item) => (
        <span key={`${trackKey}-${item}`} className="contents">
          <span className={marqueeTextClass(lang)} style={{ color: textColor }}>
            {text}
          </span>
          <span
            className={`shrink-0 text-[clamp(0.85rem,1.4vw,1.35rem)] leading-none ${
              lang === "fa" ? "font-[family-name:var(--font-persian)]" : "font-bevan"
            }`}
            style={{ color: textColor }}
            aria-hidden
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function ProjectMarquee({
  text,
  accessibleLabel,
  stripBackground,
  textColor,
  dividerColor = "rgba(0, 0, 0, 0.2)",
  lang = "en",
}: ProjectMarqueeProps) {
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: dividerColor }}>
      <span className="sr-only">{accessibleLabel}</span>

      <div
        className="project-marquee-static relative items-center justify-center overflow-hidden py-2.5 sm:py-3.5 md:py-4"
        style={{ backgroundColor: stripBackground }}
        aria-hidden="true"
      >
        <span className={marqueeTextClass(lang)} style={{ color: textColor }}>
          {text}
        </span>
      </div>

      <div
        className={`project-marquee-viewport relative overflow-hidden py-2.5 sm:py-3.5 md:py-4 ${EDGE_MASK}`}
        style={{ backgroundColor: stripBackground }}
        dir="ltr"
        aria-hidden="true"
      >
        <div className="project-marquee-track">
          <MarqueeGroup text={text} textColor={textColor} trackKey="a" lang={lang} />
          <MarqueeGroup text={text} textColor={textColor} trackKey="b" lang={lang} />
        </div>
      </div>
    </div>
  );
}
