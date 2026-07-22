"use client";

const MARQUEE_ITEMS = Array.from({ length: 10 }, (_, index) => index);

const EDGE_MASK =
  "[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_56px,black_calc(100%-56px),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_64px,black_calc(100%-64px),transparent)]";

type ProjectMarqueeProps = {
  text: string;
  accessibleLabel: string;
  stripBackground: string;
  textColor: string;
  dividerColor?: string;
};

function MarqueeGroup({
  text,
  textColor,
  trackKey,
}: {
  text: string;
  textColor: string;
  trackKey: string;
}) {
  return (
    <div className="project-marquee-group gap-8 pr-8 sm:gap-10 sm:pr-10 md:gap-12 md:pr-12">
      {MARQUEE_ITEMS.map((item) => (
        <span key={`${trackKey}-${item}`} className="contents">
          <span
            className="shrink-0 font-bevan text-[clamp(1.8rem,3vw,3.6rem)] leading-[0.95] tracking-[-0.03em] uppercase"
            style={{ color: textColor }}
          >
            {text}
          </span>
          <span
            className="shrink-0 font-bevan text-[clamp(0.85rem,1.4vw,1.35rem)] leading-none"
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
}: ProjectMarqueeProps) {
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: dividerColor }}>
      <span className="sr-only">{accessibleLabel}</span>

      <div
        className={`project-marquee-static relative items-center justify-center overflow-hidden py-2.5 sm:py-3.5 md:py-4`}
        style={{ backgroundColor: stripBackground }}
      >
        <span
          className="font-bevan text-[clamp(1.8rem,3vw,3.6rem)] leading-[0.95] tracking-[-0.03em] uppercase"
          style={{ color: textColor }}
        >
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
          <MarqueeGroup text={text} textColor={textColor} trackKey="a" />
          <MarqueeGroup text={text} textColor={textColor} trackKey="b" />
        </div>
      </div>
    </div>
  );
}
