"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PageScrollVideoProps = {
  videoSrc: string;
  posterSrc?: string;
};

/**
 * Fixed full-page background video scrubbed by document scroll.
 *
 * - Loads the full file into a blob URL (smooth reverse seeks)
 * - Continuous rAF with eased target chasing
 * - Serialized seeks (never stack currentTime while seeking)
 */
export function PageScrollVideo({ videoSrc, posterSrc }: PageScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(true);
  const poster = posterSrc || "/about-hero-poster.webp";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let duration = 0;
    let scrollTarget = 0;
    let smoothTime = 0;
    let seeking = false;
    let pendingSeek: number | null = null;
    let rafId = 0;
    let destroyed = false;
    let objectUrl: string | null = null;
    let abort: AbortController | null = null;
    let ready = false;

    const LERP = 0.12;
    const SEEK_MIN = 1 / 48;

    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const maxTime = () =>
      Number.isFinite(duration) && duration > 0 ? Math.max(duration - 0.04, 0) : 0;

    const clamp = (t: number) => {
      const end = maxTime();
      return end > 0 ? Math.min(Math.max(t, 0), end) : 0;
    };

    const updateScrollTarget = () => {
      if (prefersReduced()) {
        scrollTarget = 0;
        return;
      }
      const range = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      scrollTarget = clamp(progress * maxTime());
    };

    const applySeek = (time: number) => {
      if (destroyed || !ready) return;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

      const next = clamp(time);
      if (Math.abs(next - video.currentTime) < SEEK_MIN) {
        pendingSeek = null;
        return;
      }

      if (seeking) {
        pendingSeek = next;
        return;
      }

      seeking = true;
      pendingSeek = null;
      try {
        video.currentTime = next;
      } catch {
        seeking = false;
      }
    };

    const onSeeked = () => {
      seeking = false;
      if (pendingSeek !== null) {
        const next = pendingSeek;
        pendingSeek = null;
        applySeek(next);
      }
    };

    const tick = () => {
      if (destroyed) return;
      rafId = window.requestAnimationFrame(tick);
      if (!ready || prefersReduced()) return;

      updateScrollTarget();

      const delta = scrollTarget - smoothTime;
      if (Math.abs(delta) < 0.004) {
        smoothTime = scrollTarget;
      } else {
        smoothTime += delta * LERP;
      }

      applySeek(smoothTime);
    };

    const onReady = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      duration = video.duration;
      ready = true;
      updateScrollTarget();
      smoothTime = scrollTarget;
      setShowPoster(false);
      void (async () => {
        try {
          video.muted = true;
          await video.play();
          video.pause();
        } catch {
          /* ignore */
        }
      })();
    };

    const loadBlob = async () => {
      abort = new AbortController();
      try {
        const res = await fetch(videoSrc, {
          signal: abort.signal,
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (destroyed) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      } catch (err) {
        if (destroyed || (err as Error)?.name === "AbortError") return;
        video.src = videoSrc;
        video.load();
      }
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.pause();

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("durationchange", onReady);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", updateScrollTarget);

    rafId = window.requestAnimationFrame(tick);
    void loadBlob();

    return () => {
      destroyed = true;
      abort?.abort();
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("durationchange", onReady);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", updateScrollTarget);
      window.cancelAnimationFrame(rafId);
      video.removeAttribute("src");
      video.load();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc]);

  return (
    <div className="about-page-video" aria-hidden="true">
      {showPoster ? (
        <Image
          src={poster}
          alt=""
          fill
          priority
          className="about-page-video__media object-cover"
        />
      ) : null}
      <video
        ref={videoRef}
        className="about-page-video__media"
        poster={poster}
        muted
        playsInline
        preload="auto"
      />
      <div className="about-page-video__tint" />
    </div>
  );
}
