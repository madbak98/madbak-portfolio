"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface HeroVideoProps {
  videoSrc: string;
  posterSrc?: string;
  className?: string;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const isInteractiveTarget = (target: EventTarget | null) => (
  target instanceof Element &&
  Boolean(target.closest("a, button, input, textarea, select, [role='button']"))
);

export function HeroVideo({
  videoSrc,
  posterSrc,
  className = "",
}: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const animateRef = useRef<(timestamp: number) => void>(() => undefined);

  const isVisibleRef = useRef(true);
  const isDocumentVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const isTouchingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartProgressRef = useRef(0);
  const touchAxisRef = useRef<"pending" | "horizontal" | "vertical">("pending");

  const [isVideoReady, setIsVideoReady] = useState(false);

  const stopAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    previousFrameTimeRef.current = null;
  }, []);

  const animate = useCallback((timestamp: number) => {
    rafIdRef.current = null;

    const shouldRun =
      isVisibleRef.current &&
      isDocumentVisibleRef.current &&
      !reducedMotionRef.current;

    if (!shouldRun) {
      previousFrameTimeRef.current = null;
      return;
    }

    const video = videoRef.current;
    const previousTimestamp = previousFrameTimeRef.current ?? timestamp;
    const deltaSeconds = Math.min(
      Math.max((timestamp - previousTimestamp) / 1000, 0),
      0.1,
    );
    const dampingFactor = 1 - Math.exp(-12 * deltaSeconds);

    previousFrameTimeRef.current = timestamp;
    currentProgressRef.current +=
      (targetProgressRef.current - currentProgressRef.current) * dampingFactor;

    if (
      video &&
      Number.isFinite(video.duration) &&
      video.duration > 0 &&
      video.readyState >= HTMLMediaElement.HAVE_METADATA
    ) {
      const safeDuration = Math.max(video.duration - 0.001, 0);
      const targetTime = clamp01(currentProgressRef.current) * safeDuration;

      if (Math.abs(video.currentTime - targetTime) > 0.008) {
        try {
          video.currentTime = targetTime;
        } catch {
          // Ignore transient seek errors while browser metadata settles.
        }
      }
    }

    rafIdRef.current = requestAnimationFrame((nextTimestamp) => {
      animateRef.current(nextTimestamp);
    });
  }, []);

  useEffect(() => {
    animateRef.current = animate;

    return () => {
      animateRef.current = () => undefined;
    };
  }, [animate]);

  const startAnimation = useCallback(() => {
    const shouldRun =
      isVisibleRef.current &&
      isDocumentVisibleRef.current &&
      !reducedMotionRef.current;

    if (!shouldRun || rafIdRef.current !== null) {
      return;
    }

    previousFrameTimeRef.current = null;
    rafIdRef.current = requestAnimationFrame((timestamp) => {
      animateRef.current(timestamp);
    });
  }, []);

  const updateProgressFromClientX = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;

    if (!container || reducedMotionRef.current) {
      return;
    }

    const rect = container.getBoundingClientRect();

    if (
      rect.width <= 0 ||
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return;
    }

    const relativeX = Math.min(rect.width, Math.max(0, clientX - rect.left));
    targetProgressRef.current = clamp01(1 - relativeX / rect.width);
    startAnimation();
  }, [startAnimation]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isTouchingRef.current) {
      updateProgressFromClientX(event.clientX, event.clientY);
    }
  }, [updateProgressFromClientX]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (
      reducedMotionRef.current ||
      event.touches.length !== 1 ||
      isInteractiveTarget(event.target)
    ) {
      return;
    }

    const touch = event.touches[0];
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();

    if (
      !rect ||
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      return;
    }

    isTouchingRef.current = true;
    touchAxisRef.current = "pending";
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchStartProgressRef.current = targetProgressRef.current;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    const container = containerRef.current;

    if (
      !container ||
      !isTouchingRef.current ||
      reducedMotionRef.current ||
      event.touches.length !== 1
    ) {
      return;
    }

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    if (touchAxisRef.current === "pending") {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) {
        return;
      }

      touchAxisRef.current = Math.abs(deltaX) > Math.abs(deltaY)
        ? "horizontal"
        : "vertical";
    }

    if (touchAxisRef.current === "vertical") {
      return;
    }

    event.preventDefault();

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;

    targetProgressRef.current = clamp01(
      touchStartProgressRef.current - deltaX / rect.width,
    );
    startAnimation();
  }, [startAnimation]);

  const endTouch = useCallback(() => {
    isTouchingRef.current = false;
    touchAxisRef.current = "pending";
  }, []);

  const handleVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsVideoReady(true);

    const safeDuration = Math.max(video.duration - 0.001, 0);
    video.currentTime = clamp01(currentProgressRef.current) * safeDuration;
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncReadyState = () => handleVideoReady();

    video.addEventListener("loadedmetadata", syncReadyState);
    video.addEventListener("loadeddata", syncReadyState);
    video.addEventListener("durationchange", syncReadyState);
    video.addEventListener("canplay", syncReadyState);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      syncReadyState();
    }

    return () => {
      video.removeEventListener("loadedmetadata", syncReadyState);
      video.removeEventListener("loadeddata", syncReadyState);
      video.removeEventListener("durationchange", syncReadyState);
      video.removeEventListener("canplay", syncReadyState);
    };
  }, [handleVideoReady]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyPreference = (matches: boolean) => {
      reducedMotionRef.current = matches;

      if (matches) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    applyPreference(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => applyPreference(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;

      if (entry.isIntersecting) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }, { threshold: 0.05 });

    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = !document.hidden;

      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    observer.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", endTouch, { passive: true, capture: true });
    window.addEventListener("touchcancel", endTouch, { passive: true, capture: true });
    startAnimation();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchmove", handleTouchMove, true);
      window.removeEventListener("touchend", endTouch, true);
      window.removeEventListener("touchcancel", endTouch, true);
      stopAnimation();
    };
  }, [endTouch, handleMouseMove, handleTouchMove, handleTouchStart, startAnimation, stopAnimation]);

  return (
    <div
      ref={containerRef}
      aria-label="MADBAK interactive hero background"
      className={["hero-video-layer", className].join(" ")}
    >
      <h1 className="sr-only">MADBAK — Frontend Developer &amp; Web Designer</h1>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onLoadedMetadata={handleVideoReady}
        onCanPlay={handleVideoReady}
        className={["hero-video-element", isVideoReady ? "is-ready" : ""].join(" ")}
      />
    </div>
  );
}
