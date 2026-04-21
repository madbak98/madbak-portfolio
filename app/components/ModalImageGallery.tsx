"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { PROJECTS } from "../lib/portfolio-data";
import { PortfolioImage } from "./PortfolioImage";

type Project = (typeof PROJECTS)[number];

type ModalImageGalleryProps = {
  project: Project;
  title: string | undefined;
};

const SWIPE_THRESHOLD = 44;
const VELOCITY_THRESHOLD = 0.32;
const PARALLAX = 0.065;

export function ModalImageGallery({ project, title }: ModalImageGalleryProps) {
  const slides = useMemo(() => {
    const extras = project.images?.filter((u) => u !== project.image) ?? [];
    return [project.image, ...extras];
  }, [project]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startT = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCw(el.offsetWidth));
    ro.observe(el);
    setCw(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const max = slides.length - 1;
      setIndex(Math.max(0, Math.min(max, next)));
      setDragOffset(0);
    },
    [slides.length],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (slides.length < 2) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    startT.current = performance.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || slides.length < 2 || cw <= 0) return;
    const dx = e.clientX - startX.current;
    const atStart = index <= 0 && dx > 0;
    const atEnd = index >= slides.length - 1 && dx < 0;
    const damp = atStart || atEnd ? 0.22 : 1;
    setDragOffset(dx * damp);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current || slides.length < 2 || cw <= 0) return;
    draggingRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    const dt = Math.max(12, performance.now() - startT.current);
    const totalDx = e.clientX - startX.current;
    const vx = totalDx / dt;

    let next = index;
    if (totalDx < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
      next = Math.min(slides.length - 1, index + 1);
    } else if (totalDx > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
      next = Math.max(0, index - 1);
    }

    setDragOffset(0);
    setIndex(next);
  };

  const onLostPointerCapture = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
  };

  const duration = prefersReducedMotion ? 0 : 0.42;
  const easing = "cubic-bezier(0.2, 0.92, 0.28, 1)";
  const tx = cw > 0 ? -index * cw + dragOffset : 0;
  const parallaxX = prefersReducedMotion || !isDragging ? 0 : -dragOffset * PARALLAX;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative aspect-[4/3] w-full touch-pan-y overflow-hidden border-b border-white/10 md:hidden ${isDragging ? "select-none" : ""}`}
        style={{ touchAction: "pan-y pinch-zoom", overscrollBehaviorX: "contain" }}
      >
        <div
          className="flex h-full will-change-transform"
          style={{
            touchAction: slides.length > 1 ? "pan-x" : "auto",
            width: cw > 0 ? `${slides.length * cw}px` : "100%",
            transform: `translate3d(${tx}px, 0, 0)`,
            transition: isDragging
              ? "none"
              : `transform ${duration}s ${easing}`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={onLostPointerCapture}
        >
          {slides.map((src, i) => (
            <div
              key={`${project.id}-m-${i}-${src.slice(-20)}`}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: cw > 0 ? cw : "100%" }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  transform: `translate3d(${parallaxX}px, 0, 0)`,
                  transition: isDragging
                    ? "none"
                    : `transform ${duration}s ${easing}`,
                }}
              >
                <PortfolioImage
                  src={src}
                  alt={i === 0 ? (title ?? "Project") : `${title ?? "Project"} — ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="pointer-events-none select-none object-cover"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div
            className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-0.5 sm:bottom-3"
            aria-hidden
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={0}
                aria-label={`Image ${i + 1} of ${slides.length}`}
                aria-current={i === index}
                className="pointer-events-auto flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-full p-2 outline-none transition-opacity duration-150 active:opacity-80 focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                onClick={() => goTo(i)}
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)] ${
                    i === index
                      ? "w-5 bg-[#ff2a2a] shadow-[0_0_12px_rgba(255,42,42,0.35)]"
                      : "w-1.5 bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden min-h-0 w-full flex-col md:flex">
        {slides.map((src, i) => (
          <div
            key={`${project.id}-d-${i}-${src.slice(-20)}`}
            className="relative w-full border-b border-white/10"
          >
            <PortfolioImage
              src={src}
              alt={
                i === 0
                  ? (title ?? "Project")
                  : `${title ?? "Project"} — ${i + 1}`
              }
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1280px) 50vw, 40vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </>
  );
}
