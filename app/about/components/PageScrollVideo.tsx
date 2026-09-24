"use client";

import { useEffect, useRef } from "react";

type PageScrollVideoProps = {
  videoSrc: string;
  posterSrc?: string;
};

/**
 * Fixed full-page background video scrubbed by document scroll.
 *
 * The media is fetched once into a blob URL so reverse seeks stay reliable —
 * progressive HTTP range seeks often drop readyState and glitch when scrolling
 * back up after reaching the page bottom.
 */
export function PageScrollVideo({ videoSrc, posterSrc }: PageScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let duration = 0;
    let targetTime = 0;
    let seeking = false;
    let rafId = 0;
    let destroyed = false;
    let objectUrl: string | null = null;
    let abort: AbortController | null = null;

    const reducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const usableDuration = () => {
      if (!Number.isFinite(duration) || duration <= 0) return 0;
      return Math.max(duration - 0.08, 0);
    };

    const readScrollTarget = () => {
      if (reducedMotion()) return;
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
      const range = usableDuration();
      if (range > 0) targetTime = progress * range;
    };

    const applySeek = () => {
      if (destroyed || seeking || reducedMotion()) return;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

      const range = usableDuration();
      if (range <= 0) return;

      const next = Math.min(range, Math.max(0.001, targetTime));
      if (Math.abs(next - video.currentTime) < 0.035) return;

      seeking = true;
      try {
        video.currentTime = next;
      } catch {
        seeking = false;
      }
    };

    const onSeeked = () => {
      seeking = false;
      if (Math.abs(targetTime - video.currentTime) >= 0.035) applySeek();
    };

    const onSeeking = () => {
      seeking = true;
    };

    const tick = () => {
      rafId = 0;
      readScrollTarget();
      applySeek();
    };

    const sync = () => {
      readScrollTarget();
      if (!rafId) rafId = window.requestAnimationFrame(tick);
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
      const next = video.duration;
      duration = Number.isFinite(next) ? next : 0;
      void unlock().then(() => {
        if (!destroyed) sync();
      });
    };

    const bindMedia = () => {
      video.pause();
      video.addEventListener("loadedmetadata", onMeta);
      video.addEventListener("loadeddata", onMeta);
      video.addEventListener("durationchange", onMeta);
      video.addEventListener("seeked", onSeeked);
      video.addEventListener("seeking", onSeeking);
      if (video.readyState >= 1) onMeta();
    };

    const loadBlob = async () => {
      abort = new AbortController();
      try {
        const response = await fetch(videoSrc, {
          signal: abort.signal,
          cache: "force-cache",
        });
        if (!response.ok) throw new Error(`video fetch ${response.status}`);
        const blob = await response.blob();
        if (destroyed) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
        bindMedia();
      } catch (error) {
        if (destroyed || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        // Fallback: progressive URL if blob fetch fails.
        video.src = videoSrc;
        video.load();
        bindMedia();
      }
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    void loadBlob();
    sync();

    return () => {
      destroyed = true;
      abort?.abort();
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("seeking", onSeeking);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      if (rafId) window.cancelAnimationFrame(rafId);
      video.removeAttribute("src");
      video.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc]);

  return (
    <div className="about-page-video" aria-hidden="true">
      <video
        ref={videoRef}
        key={videoSrc}
        className="about-page-video__media"
        poster={posterSrc}
        muted
        playsInline
        preload="auto"
      />
      <div className="about-page-video__tint" />
    </div>
  );
}
