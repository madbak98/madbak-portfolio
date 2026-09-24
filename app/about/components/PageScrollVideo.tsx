"use client";

import { useEffect, useRef } from "react";

type PageScrollVideoProps = {
  videoSrc: string;
  posterSrc?: string;
};

/**
 * Fixed full-page background video scrubbed only by document scroll.
 * No mouse/touch timeline control.
 */
export function PageScrollVideo({ videoSrc, posterSrc }: PageScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame = 0;
    let duration = 0;
    let targetTime = 0;
    let lastSeekAt = 0;
    const scrubEase = 0.35;
    const seekInterval = 1000 / 30;

    const reducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const range = () => Math.max(duration - 0.05, 0);

    const readScrollTarget = () => {
      if (reducedMotion()) return;
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
      const r = range();
      if (r > 0) targetTime = progress * r;
    };

    const tick = (now: number) => {
      frame = 0;
      if (duration <= 0 || reducedMotion()) return;

      const difference = targetTime - video.currentTime;
      const nextTime =
        Math.abs(difference) < 0.01
          ? targetTime
          : video.currentTime + difference * scrubEase;

      if (
        Math.abs(nextTime - video.currentTime) > 0.002 &&
        video.readyState >= HTMLMediaElement.HAVE_METADATA &&
        now - lastSeekAt >= seekInterval
      ) {
        try {
          video.currentTime = nextTime;
        } catch {
          /* ignore */
        }
        lastSeekAt = now;
      }

      if (Math.abs(targetTime - video.currentTime) > 0.01) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const sync = () => {
      readScrollTarget();
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const unlock = async () => {
      try {
        video.muted = true;
        await video.play();
        video.pause();
      } catch {
        /* ignore */
      }
    };

    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      void unlock().then(sync);
    };

    video.pause();
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("canplay", onMeta);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (video.readyState >= 1) onMeta();
    sync();

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("canplay", onMeta);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [videoSrc]);

  return (
    <div className="about-page-video" aria-hidden="true">
      <video
        ref={videoRef}
        key={videoSrc}
        className="about-page-video__media"
        src={videoSrc}
        poster={posterSrc}
        muted
        playsInline
        preload="metadata"
      />
      <div className="about-page-video__tint" />
    </div>
  );
}
