import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import { slugify } from "./app/lib/blog-utils";

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }

  return "section";
}

const components: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl lg:text-6xl" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 id={slugify(headingText(children))} className="mt-14 text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={slugify(headingText(children))} className="mt-10 text-xl font-black leading-tight sm:text-2xl" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-base leading-[1.85] text-white/68 sm:text-lg" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-[#ff2a2a] underline decoration-[#ff2a2a]/35 underline-offset-4 transition-colors hover:text-[#EBE8E1]"
      {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="space-y-3 text-base leading-relaxed text-white/68 sm:text-lg" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="space-y-3 ps-6 text-base leading-relaxed text-white/68 sm:text-lg" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="relative ps-5 before:absolute before:start-0 before:top-[0.7em] before:h-1 before:w-1 before:bg-[#ff2a2a]" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-s-2 border-[#ff2a2a] ps-5 text-xl italic leading-relaxed text-white/75 sm:text-2xl" {...props}>
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }) => (
    <pre className="overflow-x-auto border border-white/12 bg-[#111] p-4 text-sm leading-relaxed sm:p-6" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => (
    <code className="font-mono text-[0.9em]" {...props}>
      {children}
    </code>
  ),
  hr: (props) => <hr className="my-12 border-white/12" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
