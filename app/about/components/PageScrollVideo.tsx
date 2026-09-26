"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PageScrollVideoProps = {
  /** Kept for API compatibility; sequence scrub no longer seeks the mp4. */
  videoSrc?: string;
  posterSrc?: string;
  framesManifestSrc?: string;
};

type FramesManifest = {
  count: number;
  fps: number;
  pad: number;
  ext: string;
  basePath: string;
};

function frameUrl(manifest: FramesManifest, index1Based: number) {
  const n = String(index1Based).padStart(manifest.pad, "0");
  return `${manifest.basePath}/frame-${n}.${manifest.ext}`;
}

/**
 * Full-viewport scroll scrub via preloaded image sequence + canvas.
 * No H.264 seeking — forward/reverse are equally smooth after preload.
 */
export function PageScrollVideo({
  posterSrc,
  framesManifestSrc = "/about-hero-frames/manifest.json",
}: PageScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPoster, setShowPoster] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const poster = posterSrc || "/about-hero-poster.webp";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let destroyed = false;
    let rafId = 0;
    let frames: HTMLImageElement[] = [];
    let ready = false;
    let targetProgress = 0;
    let smoothProgress = 0;

    const LERP = 0.18;

    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readProgress = () => {
      if (prefersReduced()) {
        targetProgress = 0;
        return;
      }
      const range = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      targetProgress = Math.min(1, Math.max(0, window.scrollY / range));
    };

    const coverDraw = (img: CanvasImageSource, w: number, h: number, alpha: number) => {
      const iw =
        "naturalWidth" in (img as HTMLImageElement)
          ? (img as HTMLImageElement).naturalWidth || w
          : w;
      const ih =
        "naturalHeight" in (img as HTMLImageElement)
          ? (img as HTMLImageElement).naturalHeight || h
          : h;
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!ready || frames.length === 0 || w < 2 || h < 2) return;

      const maxIndex = frames.length - 1;
      const exact = smoothProgress * maxIndex;
      const i0 = Math.min(maxIndex, Math.max(0, Math.floor(exact)));
      const i1 = Math.min(maxIndex, i0 + 1);
      const blend = exact - i0;

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      const a = frames[i0];
      const b = frames[i1];
      if (!a?.complete) return;

      coverDraw(a, w, h, 1);
      if (b && b !== a && b.complete && blend > 0.001) {
        coverDraw(b, w, h, blend);
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      draw();
    };

    const tick = () => {
      if (destroyed) return;
      rafId = window.requestAnimationFrame(tick);
      readProgress();
      const delta = targetProgress - smoothProgress;
      if (Math.abs(delta) < 0.0004) {
        smoothProgress = targetProgress;
      } else {
        smoothProgress += delta * LERP;
      }
      if (ready) draw();
    };

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(src));
        img.src = src;
      });

    const loadFrames = async () => {
      try {
        const res = await fetch(framesManifestSrc, { cache: "force-cache" });
        if (!res.ok) throw new Error("manifest");
        const manifest = (await res.json()) as FramesManifest;
        const urls = Array.from({ length: manifest.count }, (_, i) =>
          frameUrl(manifest, i + 1),
        );

        // Parallel preload — keep concurrency moderate for mobile
        const loaded: HTMLImageElement[] = new Array(urls.length);
        const concurrency = 8;
        let cursor = 0;

        const worker = async () => {
          while (cursor < urls.length) {
            const i = cursor++;
            loaded[i] = await loadImage(urls[i]);
            if (destroyed) return;
          }
        };

        await Promise.all(
          Array.from({ length: Math.min(concurrency, urls.length) }, () =>
            worker(),
          ),
        );

        if (destroyed) return;
        frames = loaded;
        ready = true;
        setShowPoster(false);
        readProgress();
        smoothProgress = targetProgress;
        resize();
        draw();
      } catch {
        if (!destroyed) setLoadError(true);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", readProgress, { passive: true });
    rafId = window.requestAnimationFrame(tick);
    void loadFrames();

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readProgress);
      frames = [];
    };
  }, [framesManifestSrc]);

  return (
    <div className="about-page-video" aria-hidden="true">
      {(showPoster || loadError) && (
        <Image
          src={poster}
          alt=""
          fill
          priority
          className="about-page-video__media object-cover"
        />
      )}
      {!loadError && (
        <canvas ref={canvasRef} className="about-page-video__media" />
      )}
      <div className="about-page-video__tint" />
    </div>
  );
}
