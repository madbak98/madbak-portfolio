import Image from "next/image";
import type { CSSProperties } from "react";

import type { ArticleImage, ArtworkVariant } from "../../lib/articles";

/**
 * Hard-cropped grayscale statue photograph with solid purple geometry.
 * Overlays are pure CSS so they stay crisp at every size. Images with the
 * "original" treatment are already art-directed and render untouched.
 */
export function EditorialArtwork({
  image,
  variant,
  sizes,
  preload = false,
  eager = false,
  className = "",
  imageClassName = "",
  style,
}: {
  image: ArticleImage;
  variant: ArtworkVariant;
  sizes: string;
  preload?: boolean;
  eager?: boolean;
  className?: string;
  imageClassName?: string;
  style?: CSSProperties;
}) {
  const original = image.treatment === "original";
  return (
    <div className={`relative isolate overflow-hidden bg-[#d8d6db] ${className}`} style={style}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={preload || eager ? "eager" : undefined}
        className={`object-cover ${original ? "" : "contrast-[1.08] grayscale"} ${imageClassName}`}
        style={{ objectPosition: image.focus ?? "50% 30%" }}
      />
      {!original && <ArtworkOverlay variant={variant} />}
    </div>
  );
}

function ArtworkOverlay({ variant }: { variant: ArtworkVariant }) {
  const block = "pointer-events-none absolute bg-(--a-purple) mix-blend-multiply";
  const solid = "pointer-events-none absolute bg-(--a-purple)";

  switch (variant) {
    case "monolith":
      return (
        <>
          <span className={`${block} bottom-0 right-0 top-[22%] w-[36%]`} />
          <span className={`${solid} bottom-[8%] left-0 h-[6px] w-[48%]`} />
        </>
      );
    case "orbit":
      return (
        <>
          <span className={`${block} -right-[14%] top-[12%] aspect-square w-[56%] rounded-full`} />
          <span className={`${solid} bottom-0 left-[8%] h-[18%] w-[10%]`} />
        </>
      );
    case "grid":
      return (
        <>
          <span
            className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--a-purple) 2px, transparent 2px), linear-gradient(to bottom, var(--a-purple) 2px, transparent 2px)",
              backgroundSize: "20% 25%",
            }}
          />
          <span className={`${block} bottom-0 left-[20%] h-[50%] w-[40%]`} />
        </>
      );
    case "split":
      return (
        <span
          className={`${block} inset-0`}
          style={{ clipPath: "polygon(58% 0, 100% 0, 100% 100%, 34% 100%)" }}
        />
      );
    case "frame":
      return (
        <>
          <span className="pointer-events-none absolute inset-[7%] border-[6px] border-(--a-purple)" />
          <span className={`${solid} left-[7%] top-[7%] h-[24%] w-[20%]`} />
        </>
      );
    case "beam":
      return (
        <>
          <span className={`${block} inset-x-0 top-[54%] h-[22%]`} />
          <span className={`${solid} right-[6%] top-0 h-[54%] w-[6px]`} />
        </>
      );
  }
}
