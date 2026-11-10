/* Kept free of three.js imports: the always-loaded SiteGuardians reads CURSOR_MEDIA. */

/** Exponential damp toward target (frame-rate independent). */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / Math.max(edge1 - edge0, 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Pointer state shared between DOM listeners and the render loop (no React state). */
export type CursorInput = {
  /** Pointer position in CSS px (viewport). */
  x: number;
  y: number;
  /** Jump straight to the pointer on the next frame (first move / re-entry). */
  snap: boolean;
  hover: boolean;
  pressed: boolean;
  /** Set on release; consumed by the render loop to start the tap. */
  released: boolean;
};

/** Desktop-only: real mouse, hover capable, not a small viewport. */
export const CURSOR_MEDIA = "(hover: hover) and (pointer: fine) and (min-width: 768px)";

export const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "summary",
  "select",
  "label[for]",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
  "[role='switch']",
  "[role='checkbox']",
  "input[type='submit']",
  "input[type='button']",
  "input[type='checkbox']",
  "input[type='radio']",
  ".cursor-pointer",
].join(",");

/** Fields that need the native text cursor for caret placement. */
export const EDITABLE_SELECTOR = [
  "textarea",
  "[contenteditable='']",
  "[contenteditable='true']",
  "input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio']):not([type='range']):not([type='color']):not([type='file']):not([type='hidden'])",
].join(",");

/** Follow speed toward the pointer; high enough that the fist never feels late. */
export const FOLLOW_LAMBDA = 26;
/** Rendered height of the figure, in CSS px. */
export const FIGURE_PX = 76;
