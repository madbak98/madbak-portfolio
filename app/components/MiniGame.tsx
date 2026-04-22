"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, MouseEvent } from "react";
import { useReducedMotion } from "motion/react";

import { SecretTerminal } from "./SecretTerminal";
import { TRANSLATIONS, type LangKey } from "../lib/portfolio-data";
import { localeCase, trackHeading, trackMeta } from "../lib/locale-ui";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

const LOG_KEYS = ["game_log_1", "game_log_2", "game_log_3"] as const;
const MAX_PROGRESS = 100;
const CLICK_RATE_MS = 420;
const GLITCH_MS = 150;
const SCRAMBLE_MS = 200;
const PARTICLE_COUNT = 12;
const RARE_CHANCE = 0.045;
const TOAST_MS = 2200;
const LONG_PRESS_MS = 900;

/** Pixel bat: place your exact art at `public/mini-game-bat.png` (this path). */
const BAT_IMAGE_SRC = "/mini-game-bat.png";
const BAT_DISPLAY_PX = 56;

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? "X";
}

function scrambleString(s: string) {
  return s
    .split("")
    .map((c) => {
      if (/\s/.test(c)) return c;
      if (/[/\\:;،,.·|—–-]/.test(c)) return c;
      return randomChar();
    })
    .join("");
}

function computeIncrement(recentTs: number[]) {
  const now = Date.now();
  const inWindow = recentTs.filter((t) => now - t < CLICK_RATE_MS);
  const rate = inWindow.length;
  return Math.min(6.5, 1.15 + rate * 0.72);
}

type ParticleTone = "signal" | "packet" | "void";

type Particle = {
  id: number;
  tx: number;
  ty: number;
  w: number;
  h: number;
  tone: ParticleTone;
};

function pickTone(): ParticleTone {
  const r = Math.random();
  if (r < 0.55) return "signal";
  if (r < 0.88) return "packet";
  return "void";
}

type RareKind = "invert" | "toast_fail" | "toast_access";

export function MiniGame({
  t,
  lang,
  onNavigateToProjects,
}: {
  t: TFn;
  lang: LangKey;
  onNavigateToProjects?: () => void;
}) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [glitchKey, setGlitchKey] = useState(0);
  const [scramble, setScramble] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [injectFx, setInjectFx] = useState(0);
  const [rare, setRare] = useState<RareKind | null>(null);
  const [logIdx, setLogIdx] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);
  const clickTimesRef = useRef<number[]>([]);
  const timersRef = useRef<(ReturnType<typeof setTimeout> | null)[]>([]);
  const [secretOpen, setSecretOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressInjectClickRef = useRef(false);
  const batRef = useRef<HTMLDivElement | null>(null);
  const batRafRef = useRef<number | null>(null);
  const batIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const batTargetRef = useRef({ x: 0, y: 0 });
  const batRenderRef = useRef({ x: 0, y: 0 });
  const batLastXRef = useRef(0);
  const batSideRef = useRef<1 | -1>(1);
  const lastPointerRef = useRef<{ x: number; y: number; hasValue: boolean }>({
    x: 0,
    y: 0,
    hasValue: false,
  });

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const complete = progress >= MAX_PROGRESS;
  const pct = Math.min(100, Math.round(progress));

  const spawnParticles = useCallback(() => {
    if (reduce) return;
    const base = particleId.current++;
    const next: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.38;
      const dist = 38 + Math.random() * 48;
      next.push({
        id: base * 1000 + i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        w: 1,
        h: 2,
        tone: pickTone(),
      });
    }
    setParticles(next);
    const t1 = setTimeout(() => setParticles([]), 520);
    timersRef.current.push(t1);
  }, [reduce]);

  const fireGlitch = useCallback(() => {
    if (reduce) return;
    setGlitchKey((k) => k + 1);
    const t2 = setTimeout(() => setGlitchKey((k) => k + 1), GLITCH_MS);
    timersRef.current.push(t2);
  }, [reduce]);

  const handleInject = useCallback(() => {
    if (complete) return;

    const now = Date.now();
    clickTimesRef.current = clickTimesRef.current.filter(
      (x) => now - x < CLICK_RATE_MS,
    );
    clickTimesRef.current.push(now);

    const inc = computeIncrement(clickTimesRef.current);
    setProgress((p) => Math.min(MAX_PROGRESS, p + inc));
    setPulse((p) => p + 1);
    setLogIdx((i) => (i + 1) % LOG_KEYS.length);
    setInjectFx((k) => k + 1);
    spawnParticles();
    fireGlitch();

    if (!reduce) {
      setScramble(true);
      const t3 = setTimeout(() => setScramble(false), SCRAMBLE_MS);
      timersRef.current.push(t3);
    }

    if (!reduce && !complete && rare === null && Math.random() < RARE_CHANCE) {
      const roll = Math.random();
      if (roll < 0.38) {
        setRare("invert");
        const tr = setTimeout(() => {
          setRare((r) => (r === "invert" ? null : r));
        }, 175);
        timersRef.current.push(tr);
      } else if (roll < 0.68) {
        setRare("toast_fail");
        const tr = setTimeout(() => {
          setRare((r) => (r === "toast_fail" ? null : r));
        }, TOAST_MS);
        timersRef.current.push(tr);
      } else {
        setRare("toast_access");
        const tr = setTimeout(() => {
          setRare((r) => (r === "toast_access" ? null : r));
        }, TOAST_MS);
        timersRef.current.push(tr);
      }
    }
  }, [complete, reduce, rare, spawnParticles, fireGlitch]);

  const batCompanionActive = progress >= MAX_PROGRESS;

  const onInjectPointerDown = useCallback(() => {
    clearLongPress();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      suppressInjectClickRef.current = true;
      setSecretOpen(true);
    }, LONG_PRESS_MS);
  }, [clearLongPress]);

  const onInjectPointerEnd = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const onInjectClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (suppressInjectClickRef.current) {
        e.preventDefault();
        e.stopPropagation();
        suppressInjectClickRef.current = false;
        return;
      }
      lastPointerRef.current = {
        x: e.clientX,
        y: e.clientY,
        hasValue: true,
      };
      handleInject();
    },
    [handleInject],
  );

  useEffect(() => {
    if (!batCompanionActive || typeof window === "undefined") return;
    const node = batRef.current;
    if (!node) return;
    const canFollow =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canFollow) return;

    const sideOffset = 32;
    const liftOffset = -16;
    const starter = lastPointerRef.current.hasValue
      ? lastPointerRef.current
      : { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    batTargetRef.current.x = starter.x + batSideRef.current * sideOffset;
    batTargetRef.current.y = starter.y + liftOffset;
    batRenderRef.current.x = starter.x + batSideRef.current * sideOffset;
    batRenderRef.current.y = starter.y + liftOffset;
    batLastXRef.current = batRenderRef.current.x;
    node.classList.remove("mini-game-bat--idle-hidden");

    const queueIdle = () => {
      if (reduce) return;
      if (batIdleTimerRef.current != null) {
        clearTimeout(batIdleTimerRef.current);
      }
      batIdleTimerRef.current = setTimeout(() => {
        node.classList.add("mini-game-bat--idle-hidden");
        batIdleTimerRef.current = null;
      }, 2800);
    };

    const onMouseMove = (event: globalThis.MouseEvent) => {
      const dx = event.clientX - lastPointerRef.current.x;
      if (Math.abs(dx) > 1.2) {
        batSideRef.current = dx > 0 ? 1 : -1;
      }
      lastPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        hasValue: true,
      };
      batTargetRef.current.x = event.clientX + batSideRef.current * sideOffset;
      batTargetRef.current.y = event.clientY + liftOffset;
      if (!reduce) {
        node.classList.remove("mini-game-bat--idle-hidden");
        queueIdle();
      }
    };

    const tick = () => {
      const render = batRenderRef.current;
      const target = batTargetRef.current;
      const easing = reduce ? 0.3 : 0.14;
      render.x += (target.x - render.x) * easing;
      render.y += (target.y - render.y) * easing;

      const dx = render.x - batLastXRef.current;
      batLastXRef.current = render.x;
      const tilt = Math.max(-10, Math.min(10, dx * 0.9));

      node.style.transform = `translate3d(${render.x}px, ${render.y}px, 0) rotate(${tilt}deg)`;
      batRafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    queueIdle();
    batRafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (batIdleTimerRef.current != null) {
        clearTimeout(batIdleTimerRef.current);
        batIdleTimerRef.current = null;
      }
      if (batRafRef.current != null) {
        window.cancelAnimationFrame(batRafRef.current);
        batRafRef.current = null;
      }
    };
  }, [batCompanionActive, reduce]);

  useEffect(() => {
    const ref = timersRef;
    return () => {
      ref.current.forEach((id) => {
        if (id != null) clearTimeout(id);
      });
      ref.current = [];
      clearLongPress();
      if (batIdleTimerRef.current != null) {
        clearTimeout(batIdleTimerRef.current);
        batIdleTimerRef.current = null;
      }
      if (batRafRef.current != null) {
        cancelAnimationFrame(batRafRef.current);
        batRafRef.current = null;
      }
    };
  }, [clearLongPress]);

  const glitchOn = !reduce && glitchKey % 2 === 1;

  const sys = t("game_sys");
  const dec = t("game_dec");
  const proto = t("game_proto");

  const showLatinScramble = scramble && !reduce && lang !== "fa";
  const showFaScramble = scramble && !reduce && lang === "fa";

  const isFa = lang === "fa";

  return (
    <section
      dir={isFa ? "rtl" : "ltr"}
      lang={isFa ? "fa" : undefined}
      className={`mini-game-section relative z-20 overflow-hidden border-t border-black/10 bg-[#EBE8E1] px-4 py-16 text-[#0A0A0A] sm:px-6 sm:py-24 md:px-12 md:py-32 ${
        glitchOn ? "mini-game-glitching" : ""
      } ${isFa ? "mini-game-section--fa" : ""}`}
    >
      {!reduce && injectFx > 0 && (
        <div
          key={injectFx}
          className="mini-game-screen-flicker pointer-events-none absolute inset-0 z-[11] bg-white"
          aria-hidden
        />
      )}

      {!reduce && rare === "invert" && (
        <div
          key={`inv-${injectFx}`}
          className="mini-game-rare-invert pointer-events-none absolute inset-0 z-[12] bg-white mix-blend-difference"
          aria-hidden
        />
      )}

      <div className="relative z-20 mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-8 md:gap-16 lg:max-w-[90vw] lg:flex-row lg:gap-16">
        <div
          className={`w-full md:w-1/2 ${isFa ? "mini-game-fa-copy text-start" : ""}`}
        >
          <div
            className={`font-mono text-[10px] opacity-50 ${localeCase(lang)} ${trackMeta(lang)} ${
              isFa
                ? "mb-9 border-s-2 border-[#ff2a2a] ps-4 pe-4 leading-[1.65] tracking-[0] [font-feature-settings:'kern'_1] [font-synthesis:none]"
                : "mb-8 border-s-2 border-[#ff2a2a] px-4"
            } ${showFaScramble ? "mini-game-fa-scramble" : ""}`}
          >
            {showLatinScramble ? scrambleString(proto) : proto}
          </div>
          <h2
            className={`font-black transition-opacity duration-150 ${localeCase(lang)} ${
              isFa
                ? "mini-game-fa-heading mb-7 max-w-[min(100%,36rem)] text-start text-3xl leading-[1.18] tracking-[0] break-words text-pretty sm:mb-8 sm:text-5xl sm:leading-[1.14] md:mb-9 md:text-7xl md:leading-[1.1] [font-feature-settings:'kern'_1] [font-synthesis:none]"
                : `mb-6 text-3xl leading-[0.85] sm:text-5xl md:text-7xl ${trackHeading(lang)}`
            } ${
              showLatinScramble ? "opacity-[0.94]" : ""
            } ${showFaScramble ? "mini-game-fa-scramble" : ""}`}
            style={
              showLatinScramble
                ? {
                    textShadow:
                      "0.5px 0 0 rgba(255,42,42,0.14), -0.5px 0 0 rgba(0,0,0,0.08)",
                  }
                : undefined
            }
          >
            {lang === "fa" ? (
              <span className="flex flex-col gap-3 sm:gap-4">
                <span className="block">{sys}</span>
                <span className="block text-[#ff2a2a]">{dec}</span>
              </span>
            ) : showLatinScramble ? (
              <>
                {scrambleString(sys)}
                <br />
                <span className="text-[#ff2a2a]">{scrambleString(dec)}</span>
              </>
            ) : (
              <>
                {sys}
                <br />
                <span className="text-[#ff2a2a]">{dec}</span>
              </>
            )}
          </h2>
          <p
            className={
              isFa
                ? "max-w-prose text-start text-base font-light leading-[1.85] opacity-60 sm:text-lg sm:leading-[1.82] [font-feature-settings:'kern'_1]"
                : "text-base font-light opacity-60 sm:text-lg"
            }
          >
            {complete ? t("game_desc2") : t("game_desc1")}
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col items-center md:w-1/2">
          <div className="relative flex min-h-[200px] min-w-[200px] items-center justify-center sm:min-h-[208px] sm:min-w-[208px] md:min-h-[272px] md:min-w-[272px]">
            {particles.map((p) => {
              const toneClass =
                p.tone === "signal"
                  ? "bg-[#ff2a2a] opacity-[0.78]"
                  : p.tone === "packet"
                    ? "bg-[#0A0A0A] opacity-[0.58]"
                    : "border border-black/10 bg-white/75 opacity-[0.68]";
              return (
                <span
                  key={p.id}
                  className={`mini-game-particle pointer-events-none absolute rounded-[1px] ${toneClass}`}
                  style={
                    {
                      width: `${p.w}px`,
                      height: `${p.h}px`,
                      left: "50%",
                      top: "50%",
                      ["--tx" as string]: `${p.tx}px`,
                      ["--ty" as string]: `${p.ty}px`,
                    } as CSSProperties
                  }
                />
              );
            })}

            <button
              type="button"
              aria-disabled={complete}
              onPointerDown={onInjectPointerDown}
              onPointerUp={onInjectPointerEnd}
              onPointerLeave={onInjectPointerEnd}
              onPointerCancel={onInjectPointerEnd}
              onClick={onInjectClick}
              style={{ WebkitTapHighlightColor: "transparent" }}
              className={`relative z-20 flex h-44 min-h-[176px] w-44 min-w-[176px] touch-manipulation select-none flex-col items-center justify-center overflow-visible rounded-full border transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out will-change-transform sm:h-48 sm:w-48 md:h-64 md:w-64 ${
                complete
                  ? "pointer-events-auto border-[#ff2a2a] bg-[#0A0A0A] text-[#EBE8E1] shadow-[0_0_28px_rgba(255,42,42,0.2)]"
                  : "border-black hover:scale-[1.015] hover:bg-black hover:text-[#EBE8E1] active:scale-[0.985]"
              }`}
            >
              <span
                key={reduce ? 0 : pulse}
                className={`flex flex-col items-center px-4 ${!reduce && !complete ? "mini-game-tap-flash" : ""}`}
              >
                <span
                  className={`text-center font-black transition-all duration-300 ${
                    isFa
                      ? "tracking-[0] [font-feature-settings:'kern'_1]"
                      : trackHeading(lang)
                  } ${
                    complete
                      ? "text-xs leading-tight text-[#ff2a2a] sm:text-sm md:text-base"
                      : `text-3xl md:text-5xl ${localeCase(lang)}`
                  }`}
                >
                  {complete ? t("game_access") : t("game_btn1")}
                </span>
                {!complete && (
                  <span
                    className={`mt-2 font-mono text-[10px] opacity-50 ${localeCase(lang)} ${
                      isFa ? "tracking-[0] leading-normal" : trackMeta(lang)
                    }`}
                  >
                    {t("game_tap")}
                  </span>
                )}
              </span>
            </button>
          </div>

          <div
            className="mt-10 w-full max-w-sm min-w-0"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              className={`mb-2 flex justify-between gap-3 font-mono text-[10px] font-bold ${localeCase(lang)} ${
                isFa ? "tracking-[0] leading-normal" : trackMeta(lang)
              }`}
            >
              <span className="min-w-0 min-h-[1.25em] truncate tabular-nums text-start">
                {t(LOG_KEYS[logIdx]!)}
              </span>
              <span className="shrink-0 tabular-nums">{pct}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden bg-black/10">
              <div
                className="absolute top-0 start-0 h-full w-full origin-start bg-[#ff2a2a] will-change-transform"
                style={{
                  transform: `scaleX(${progress / MAX_PROGRESS})`,
                  transition:
                    "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1.012)",
                }}
              />
            </div>
            {complete && (
              <p
                className={`mt-3 font-mono text-[9px] text-[#ff2a2a]/90 ${localeCase(lang)} ${
                  isFa
                    ? "tracking-[0] leading-relaxed"
                    : "tracking-[0.18em]"
                } ${isFa ? "" : trackMeta(lang)}`}
              >
                {t("game_complete_sub")}
              </p>
            )}
          </div>
        </div>
      </div>

      {secretOpen ? (
        <SecretTerminal
          onClose={() => setSecretOpen(false)}
          onNavigateProjects={() => {
            onNavigateToProjects?.();
            setSecretOpen(false);
          }}
        />
      ) : null}

      {!reduce && (rare === "toast_fail" || rare === "toast_access") && (
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-[30] max-w-[90vw] -translate-x-1/2 px-3"
          role="status"
          aria-live="polite"
        >
          <p
            className={`border border-[#ff2a2a]/35 bg-[#0A0A0A] px-4 py-2.5 font-mono text-[9px] text-[#EBE8E1] shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${localeCase(lang)} ${
              isFa ? "tracking-[0] leading-relaxed" : `tracking-[0.22em] ${trackMeta(lang)}`
            } mini-game-surprise-toast`}
          >
            {rare === "toast_fail"
              ? t("game_surprise_fail")
              : t("game_surprise_access")}
          </p>
        </div>
      )}

      {batCompanionActive && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={batRef}
              className="mini-game-bat mini-game-bat--visible"
              aria-hidden
            >
              <div
                className={`mini-game-bat-inner ${reduce ? "mini-game-bat-inner--reduce" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- pixel art: crisp native scaling, not next/image */}
                <img
                  src={BAT_IMAGE_SRC}
                  alt=""
                  width={BAT_DISPLAY_PX}
                  height={BAT_DISPLAY_PX}
                  className="mini-game-bat-img"
                  style={{
                    width: BAT_DISPLAY_PX,
                    height: BAT_DISPLAY_PX,
                  }}
                  draggable={false}
                  decoding="async"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
