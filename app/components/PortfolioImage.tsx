import Image from "next/image";

type PortfolioImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** e.g. (max-width: 768px) 100vw, 50vw */
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

/**
 * Remote portfolio assets with responsive sizing and lazy loading by default.
 */
export function PortfolioImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
  fill,
  width = 1200,
  height = 800,
}: PortfolioImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        draggable={false}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      draggable={false}
    />
  );
}
