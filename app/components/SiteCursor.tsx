"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site-wide custom cursor. Mount once at the root so it survives route changes.
 * Only activates for fine pointers on md+ viewports; otherwise native cursor is used.
 */
export function SiteCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
    );

    const sync = () => {
      const next = media.matches;
      setActive(next);
      document.documentElement.toggleAttribute("data-custom-cursor", next);
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      document.documentElement.removeAttribute("data-custom-cursor");
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const baseInner =
      "h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out";

    let overFlag = false;
    let hoverable = false;

    const paintInner = () => {
      const el = innerRef.current;
      if (!el) return;
      if (overFlag) {
        el.className = `${baseInner} bg-[#ff2a2a]`;
      } else if (hoverable) {
        el.className = `${baseInner} scale-[3] bg-white`;
      } else {
        el.className = `${baseInner} bg-[#ff2a2a]`;
      }
    };

    const moveCursor = (e: MouseEvent) => {
      if (!outerRef.current) return;
      outerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      outerRef.current.style.opacity = "1";
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const nextFlag = Boolean(target?.closest("[data-cursor-no-difference]"));
      const nextHoverable = Boolean(target?.closest("a, button, .cursor-pointer"));
      if (nextFlag === overFlag && nextHoverable === hoverable) return;
      overFlag = nextFlag;
      hoverable = nextHoverable;
      if (outerRef.current) {
        outerRef.current.style.mixBlendMode = overFlag ? "normal" : "difference";
      }
      paintInner();
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("pointerover", onOver);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={outerRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{ willChange: "transform", opacity: 0 }}
      aria-hidden
    >
      <div
        ref={innerRef}
        className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff2a2a] transition-all duration-300 ease-out"
      />
    </div>
  );
}
