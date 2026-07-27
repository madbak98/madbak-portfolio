"use client";

import { createContext, useContext, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

import AnimatedContent from "../react-bits/Animations/AnimatedContent/AnimatedContent";
import Antigravity from "../react-bits/Animations/Antigravity/Antigravity";
import BlobCursor from "../react-bits/Animations/BlobCursor/BlobCursor";
import ClickSpark from "../react-bits/Animations/ClickSpark/ClickSpark";
import Crosshair from "../react-bits/Animations/Crosshair/Crosshair";
import Cubes from "../react-bits/Animations/Cubes/Cubes";
import CursorGrid from "../react-bits/Animations/CursorGrid/CursorGrid";
import ElectricBorder from "../react-bits/Animations/ElectricBorder/ElectricBorder";
import LogoLoop from "../react-bits/Animations/LogoLoop/LogoLoop";
import MagicRings from "../react-bits/Animations/MagicRings/MagicRings";
import Magnet from "../react-bits/Animations/Magnet/Magnet";
import Strands from "../react-bits/Animations/Strands/Strands";
import LetterGlitch from "../react-bits/Backgrounds/LetterGlitch/LetterGlitch";
import ShapeGrid from "../react-bits/Backgrounds/ShapeGrid/ShapeGrid";
import Waves from "../react-bits/Backgrounds/Waves/Waves";
import AnimatedList from "../react-bits/Components/AnimatedList/AnimatedList";
import Counter from "../react-bits/Components/Counter/Counter";
import Folder from "../react-bits/Components/Folder/Folder";
import SpotlightCard from "../react-bits/Components/SpotlightCard/SpotlightCard";
import BlurText from "../react-bits/TextAnimations/BlurText/BlurText";
import CircularText from "../react-bits/TextAnimations/CircularText/CircularText";
import CountUp from "../react-bits/TextAnimations/CountUp/CountUp";
import GradientText from "../react-bits/TextAnimations/GradientText/GradientText";
import ShinyText from "../react-bits/TextAnimations/ShinyText/ShinyText";
import TrueFocus from "../react-bits/TextAnimations/TrueFocus/TrueFocus";
import type { ReactBitsFreeItem } from "../../lib/react-bits-free";

export type MadlabPalette = {
  primary: string;
  light: string;
  deep: string;
};

const DEFAULT_PALETTE: MadlabPalette = { primary: "#FF2A2A", light: "#EBE8E1", deep: "#8B1515" };

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((character) => `${character}${character}`).join("") : value;
  const red = Number.parseInt(normalized.slice(0, 2), 16) || 0;
  const green = Number.parseInt(normalized.slice(2, 4), 16) || 0;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) || 0;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})` as `rgba(${number}, ${number}, ${number}, ${number})`;
}

type BrandName = "github" | "instagram" | "vercel" | "x" | "linkedin";

function BrandIcon({ name }: { name: BrandName }) {
  const commonProps = { className: "h-8 w-8", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

  if (name === "github") {
    return <svg {...commonProps}><path d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.78-.25.78-.55v-2.02c-3.18.69-3.85-1.34-3.85-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.54-.29-5.21-1.27-5.21-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.13 1.17a10.9 10.9 0 0 1 5.7 0c2.17-1.48 3.13-1.17 3.13-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.4-2.68 5.36-5.23 5.65.41.36.78 1.07.78 2.16v3.2c0 .31.2.66.79.55A11.3 11.3 0 0 0 12 .7Z" /></svg>;
  }

  if (name === "instagram") {
    return <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" /><circle cx="12" cy="12" r="4.1" /><circle cx="17.4" cy="6.7" r=".8" fill="currentColor" stroke="none" /></svg>;
  }

  if (name === "vercel") {
    return <svg {...commonProps}><path d="M12 3 22 20H2L12 3Z" /></svg>;
  }

  if (name === "x") {
    return <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 4 16 16M20 4 4 20" /></svg>;
  }

  return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M7 7v.01M11 17v-4a3 3 0 0 1 6 0v4M11 10v7" fill="none" stroke="#0d0d0d" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

type PreviewContextValue = {
  size: "card" | "detail";
  palette: MadlabPalette;
};

const PreviewContext = createContext<PreviewContextValue>({ size: "card", palette: DEFAULT_PALETTE });

function Frame({ children }: { children: ReactNode }) {
  const { size, palette } = useContext(PreviewContext);
  const isDetail = size === "detail";

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0d0d0d] text-[#ebe8e1] [contain:layout_paint] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full ${isDetail ? "min-h-[24rem] h-[min(34rem,58vw)]" : "h-[10.5rem]"}`}
      style={{
        "--madlab-primary": palette.primary,
        "--madlab-light": palette.light,
        "--madlab-deep": palette.deep,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}

function CrosshairPreview({ palette }: { palette: MadlabPalette }) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Crosshair color={palette.primary} containerRef={containerRef as unknown as RefObject<HTMLElement>} />
      <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-[0.18em] text-[#ebe8e1]/70">
        Move inside
      </div>
    </div>
  );
}

function ReferencePreview({ item }: { item: ReactBitsFreeItem }) {
  const isBackground = item.category === "BACKGROUNDS";
  const isComponent = item.category === "COMPONENTS";
  const isText = item.category === "TEXT ANIMATIONS";

  return (
    <Frame>
      <div className="absolute inset-0 overflow-hidden bg-[#101010]">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: isBackground
              ? "radial-gradient(circle at 28% 46%, color-mix(in srgb, var(--madlab-primary) 55%, transparent), transparent 25%), radial-gradient(circle at 72% 60%, color-mix(in srgb, var(--madlab-deep) 70%, transparent), transparent 32%)"
              : isComponent
                ? "radial-gradient(circle at 50% 48%, color-mix(in srgb, var(--madlab-primary) 24%, transparent), transparent 30%)"
                : isText
                  ? "linear-gradient(110deg, transparent 18%, color-mix(in srgb, var(--madlab-primary) 34%, transparent) 48%, transparent 78%)"
                  : "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--madlab-primary) 30%, transparent), transparent 28%)",
          }}
        />

        {isBackground ? (
          <div className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2 bg-[var(--madlab-light)]/30 shadow-[0_0_28px_var(--madlab-primary)]">
            <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--madlab-primary)]/70 bg-[var(--madlab-primary)]/10 shadow-[0_0_42px_var(--madlab-primary)]" />
          </div>
        ) : null}

        {isComponent ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-16 w-[22%] rounded-[0.35rem] border border-[var(--madlab-light)]/25 bg-white/[0.035] shadow-[inset_0_0_24px_var(--madlab-deep)]"
                style={{ transform: `translateY(${index === 1 ? "-10px" : "10px"}) rotate(${index === 0 ? "-6deg" : index === 2 ? "6deg" : "0deg"})` }}
              />
            ))}
          </div>
        ) : null}

        {isText ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <span className="text-[clamp(1.6rem,4vw,3rem)] font-black uppercase leading-none tracking-[-0.1em] text-[var(--madlab-light)] drop-shadow-[0_0_18px_var(--madlab-primary)]">
              {item.title}
            </span>
          </div>
        ) : null}

        {!isBackground && !isComponent && !isText ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-20 w-20 rounded-full border border-[var(--madlab-primary)]/70 shadow-[0_0_0_16px_color-mix(in_srgb,var(--madlab-primary)_8%,transparent),0_0_48px_var(--madlab-primary)]" />
            <span className="absolute h-2.5 w-2.5 rounded-full bg-[var(--madlab-primary)] shadow-[0_0_22px_var(--madlab-primary)]" />
          </div>
        ) : null}

        <div className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">{item.category} / reference</div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <span className="max-w-[70%] truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--madlab-light)]/75">{item.title}</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[var(--madlab-primary)]">source ↗</span>
        </div>
      </div>
    </Frame>
  );
}

function PreviewContent({
  item,
  palette,
  previewProps,
}: {
  item: ReactBitsFreeItem;
  palette: MadlabPalette;
  previewProps?: { speed?: number; count?: number; ringCount?: number; glow?: number; text?: string; duration?: number; delay?: number; animateBy?: "words" | "letters"; blur?: boolean };
}) {
  const { size } = useContext(PreviewContext);

  switch (item.sourceName) {
    case "CursorGrid":
      return <Frame><CursorGrid color={palette.primary} cellSize={34} radius={100} maxOpacity={0.9} gridOpacity={0.2} clickPulse /></Frame>;
    case "Strands":
      return <Frame><Strands colors={[palette.primary, palette.light, palette.deep]} count={previewProps?.count ?? 4} speed={previewProps?.speed ?? 0.35} glow={previewProps?.glow ?? 1.8} intensity={0.8} scale={1.35} /></Frame>;
    case "AnimatedContent":
      return <Frame><AnimatedContent distance={30} duration={previewProps?.duration ?? 0.7} delay={(previewProps?.delay ?? 80) / 1000} className="flex h-full items-center justify-center"><span className="text-3xl font-black tracking-[-0.1em]">{previewProps?.text ?? "MADLAB / MOTION"}</span></AnimatedContent></Frame>;
    case "Antigravity":
      return <Frame><Antigravity count={120} color={palette.primary} particleSize={1.6} autoAnimate rotationSpeed={0.1} /></Frame>;
    case "BlobCursor":
      return <Frame><BlobCursor fillColor={palette.primary} innerColor={palette.light} zIndex={1} /></Frame>;
    case "ClickSpark":
      return <Frame><ClickSpark sparkColor={palette.primary}><div className="flex h-full items-center justify-center"><span className="border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ borderColor: palette.primary }}>Click inside</span></div></ClickSpark></Frame>;
    case "Crosshair":
      return <Frame><CrosshairPreview palette={palette} /></Frame>;
    case "Cubes":
      return <Frame><div className="flex h-full w-full items-center justify-center overflow-hidden"><Cubes gridSize={5} cubeSize={size === "detail" ? 64 : 32} faceColor="#151515" borderStyle={`1px solid ${palette.primary}`} rippleColor={palette.primary} /></div></Frame>;
    case "ElectricBorder":
      return <Frame><div className="flex h-full items-center justify-center p-6"><ElectricBorder color={palette.primary} borderRadius={12} speed={0.7} className="w-full"><div className="p-5 text-center font-mono text-[10px] uppercase tracking-[0.18em]">Electric border</div></ElectricBorder></div></Frame>;
    case "MagicRings":
      return <Frame><MagicRings color={palette.primary} colorTwo={palette.light} speed={previewProps?.speed ?? 0.8} ringCount={previewProps?.ringCount ?? 6} followMouse clickBurst /></Frame>;
    case "LogoLoop":
      return (
        <Frame>
          <div className="flex h-full items-center" style={{ color: palette.light }}>
            <LogoLoop
              logos={[
                { node: <BrandIcon name="github" />, title: "GitHub", ariaLabel: "GitHub" },
                { node: <BrandIcon name="instagram" />, title: "Instagram", ariaLabel: "Instagram" },
                { node: <BrandIcon name="vercel" />, title: "Vercel", ariaLabel: "Vercel" },
                { node: <BrandIcon name="x" />, title: "X", ariaLabel: "X" },
                { node: <BrandIcon name="linkedin" />, title: "LinkedIn", ariaLabel: "LinkedIn" },
              ]}
              speed={48}
              logoHeight={28}
              gap={48}
              pauseOnHover
              fadeOut
              fadeOutColor="#0d0d0d"
              scaleOnHover
              ariaLabel="Brand logo loop"
            />
          </div>
        </Frame>
      );
    case "Magnet":
      return <Frame><div className="flex h-full items-center justify-center"><Magnet padding={90} magnetStrength={2.5}><span className="border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0a0a0a]" style={{ borderColor: palette.primary, backgroundColor: palette.primary }}>Magnetic</span></Magnet></div></Frame>;
    case "LetterGlitch":
      return <Frame><LetterGlitch glitchColors={[palette.primary, palette.light, palette.deep]} glitchSpeed={55} centerVignette outerVignette smooth characters="MADBAK01" /></Frame>;
    case "ShapeGrid":
      return <Frame><ShapeGrid borderColor={`${palette.light}55`} hoverFillColor={palette.primary} squareSize={28} shape="square" hoverTrailAmount={4} /></Frame>;
    case "Waves":
      return <Frame><Waves lineColor={palette.primary} backgroundColor="#0d0d0d" /></Frame>;
    case "AnimatedList":
      return <Frame><div className="flex h-full w-full items-center justify-center overflow-hidden p-4"><AnimatedList items={["Interactive", "Readable", "Reusable", "MADLAB"]} className="w-full max-w-[500px]" itemClassName="border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em]" /></div></Frame>;
    case "Counter":
      return <Frame><div className="flex h-full items-center justify-center text-6xl font-black tracking-[-0.12em]" style={{ color: palette.primary }}><Counter value={42} /></div></Frame>;
    case "Folder":
      return <Frame><div className="flex h-full items-center justify-center"><Folder color={palette.primary} size={size === "detail" ? 1.65 : 1.2} items={[<span key="one">MAD</span>, <span key="two">LAB</span>, <span key="three">CODE</span>]} /></div></Frame>;
    case "SpotlightCard":
      return <Frame><div className="flex h-full items-center justify-center p-5"><SpotlightCard spotlightColor={hexToRgba(palette.primary, 0.3)} className="w-full border border-white/15 p-5"><span className="font-mono text-[10px] uppercase tracking-[0.18em]">Move across the card</span></SpotlightCard></div></Frame>;
    case "BlurText":
      return <Frame><div className="flex h-full items-center justify-center text-center text-3xl font-black tracking-[-0.1em]"><BlurText text={previewProps?.text ?? "BLUR / REVEAL"} animateBy={previewProps?.animateBy ?? "words"} delay={previewProps?.delay ?? 80} stepDuration={previewProps?.duration ?? 0.35} animationFrom={previewProps?.blur === false ? { opacity: 0, y: -50 } : undefined} /></div></Frame>;
    case "CircularText":
      return <Frame><div className="flex h-full items-center justify-center" style={{ color: palette.primary }}><CircularText text={previewProps?.text ?? "MADLAB • MOTION • "} spinDuration={12} /></div></Frame>;
    case "CountUp":
      return <Frame><div className="flex h-full items-center justify-center text-6xl font-black tracking-[-0.12em]" style={{ color: palette.primary }}><CountUp to={132} duration={2} /></div></Frame>;
    case "GradientText":
      return <Frame><div className="flex h-full items-center justify-center text-3xl font-black tracking-[-0.1em]"><GradientText colors={[palette.primary, palette.light, palette.deep]} animationSpeed={previewProps?.duration ? Math.max(1, previewProps.duration * 8) : 8}>{previewProps?.text ?? "MADLAB"}</GradientText></div></Frame>;
    case "ShinyText":
      return <Frame><div className="flex h-full items-center justify-center text-3xl font-black tracking-[-0.1em]"><ShinyText text={previewProps?.text ?? "SHINY / TEXT"} color={palette.light} shineColor={palette.primary} speed={previewProps?.duration ? Math.max(0.5, previewProps.duration * 2.5) : 2} delay={(previewProps?.delay ?? 80) / 1000} /></div></Frame>;
    case "TrueFocus":
      return <Frame><div className="flex h-full items-center justify-center text-2xl font-black tracking-[-0.08em]"><TrueFocus sentence={previewProps?.text ?? "MADLAB FOCUS"} borderColor={palette.primary} glowColor={`${palette.primary}8c`} animationDuration={previewProps?.duration ?? 0.5} pauseBetweenAnimations={(previewProps?.delay ?? 80) / 1000} /></div></Frame>;
    default:
      return <ReferencePreview item={item} />;
  }
}

export function ReactBitsLivePreview({
  item,
  palette = DEFAULT_PALETTE,
  size = "card",
  previewProps,
}: {
  item: ReactBitsFreeItem;
  palette?: MadlabPalette;
  size?: "card" | "detail";
  previewProps?: { speed?: number; count?: number; ringCount?: number; glow?: number; text?: string; duration?: number; delay?: number; animateBy?: "words" | "letters"; blur?: boolean };
}) {
  return (
    <PreviewContext.Provider value={{ size, palette }}>
      <PreviewContent item={item} palette={palette} previewProps={previewProps} />
    </PreviewContext.Provider>
  );
}
