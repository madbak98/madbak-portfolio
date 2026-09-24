import type { HTMLAttributes, ReactNode } from "react";

type GlassCardTag = "div" | "article" | "section" | "figure" | "aside";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: GlassCardTag;
  interactive?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, "as" | "children" | "className">;

export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
  interactive = false,
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={`about-glass ${interactive ? "about-glass--interactive" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
