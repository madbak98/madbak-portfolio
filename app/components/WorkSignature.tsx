import Image from "next/image";
import type { CSSProperties } from "react";

/** Holographic "Developed by MADBAK" badge used as the work signature in site footers. */
export function WorkSignature({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src="/signature/developed-by-madbak.png"
      alt="Developed by MADBAK"
      width={826}
      height={619}
      className={`h-24 w-auto sm:h-28 ${className}`}
      style={style}
    />
  );
}
