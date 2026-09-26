import { MathUtils } from "three";

/** Exponential damp toward target (frame-rate independent). */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number {
  return MathUtils.damp(current, target, lambda, dt);
}

export function clamp(n: number, min: number, max: number) {
  return MathUtils.clamp(n, min, max);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / Math.max(edge1 - edge0, 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Low-frequency pseudo-noise — deterministic, no Math.random per frame. */
export function softNoise(t: number, seed: number) {
  const s = seed * 12.9898;
  return (
    Math.sin(t * 0.7 + s) * 0.55 +
    Math.sin(t * 1.27 + s * 1.3) * 0.3 +
    Math.sin(t * 0.31 + s * 0.7) * 0.15
  );
}

/** Seeded 0–1 value (call only on state transitions). */
export function seededUnit(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function seededRange(seed: number, min: number, max: number) {
  return min + seededUnit(seed) * (max - min);
}

export type SectionMood = {
  yawBias: number;
  attention: number;
  idle: number;
  alert: number;
};

export const SECTION_MOODS: Record<string, SectionMood> = {
  home: { yawBias: 0, attention: 0.65, idle: 0.9, alert: 0.3 },
  about: { yawBias: 0.12, attention: 0.85, idle: 0.75, alert: 0.5 },
  works: { yawBias: -0.08, attention: 0.8, idle: 0.8, alert: 0.45 },
  services: { yawBias: 0.05, attention: 0.9, idle: 0.7, alert: 0.55 },
  lab: { yawBias: -0.15, attention: 0.95, idle: 0.9, alert: 0.7 },
  contact: { yawBias: 0, attention: 0.5, idle: 0.7, alert: 0.22 },
  default: { yawBias: 0, attention: 0.7, idle: 0.8, alert: 0.35 },
};

export function moodForRoute(
  pathname: string,
  sectionId: string | null,
): SectionMood {
  if (pathname.startsWith("/lab")) return SECTION_MOODS.lab;
  if (pathname.startsWith("/services")) return SECTION_MOODS.services;
  if (pathname.startsWith("/works")) return SECTION_MOODS.works;
  if (pathname.startsWith("/about")) return SECTION_MOODS.about;
  if (pathname === "/" || pathname === "") {
    if (sectionId && SECTION_MOODS[sectionId]) return SECTION_MOODS[sectionId];
    return SECTION_MOODS.home;
  }
  return SECTION_MOODS.default;
}

export type PatrolZone = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
};

/**
 * Calm / curious / watchful sentry — single Guardian on the right Hero edge.
 * Camera [0, 0.35, 5.6] fov 36.
 */
export type GuardianConfig = {
  home: [number, number, number];
  zone: PatrolZone;
  /** Temporary scroll-retreat zone (further edge / up). */
  retreatZone: PatrolZone;
  baseYaw: number;
  idlePhase: number;
  attentionStrength: number;
  reactionDelay: number;
  idleAmplitude: number;
  trackingStrength: number;
  ambientSide: number;
  moveDuration: [number, number];
  hoverDuration: [number, number];
  maxStep: number;
};

export const GUARDIAN: GuardianConfig = {
  home: [2.55, 0.38, 0.14],
  zone: {
    xMin: 2.15,
    xMax: 2.95,
    yMin: 0.0,
    yMax: 0.95,
    zMin: -0.08,
    zMax: 0.32,
  },
  retreatZone: {
    xMin: 2.55,
    xMax: 3.15,
    yMin: 0.35,
    yMax: 1.15,
    zMin: -0.15,
    zMax: 0.2,
  },
  baseYaw: -0.4,
  idlePhase: 1.1,
  attentionStrength: 0.72,
  reactionDelay: 0.22,
  idleAmplitude: 0.85,
  trackingStrength: 0.7,
  ambientSide: 0.7,
  moveDuration: [2.8, 4.8],
  hoverDuration: [1.2, 3.0],
  maxStep: 0.45,
};

/** Flight-facing / lean clamps (radians). */
export const MOVE_YAW_MAX = 0.2;
export const MOVE_PITCH_MAX = 0.09;
export const MOVE_ROLL_MAX = 0.065;
export const LEAN_ROLL_MAX = 0.08;
export const LEAN_PITCH_MAX = 0.07;

/** Cursor look clamps. */
export const LOOK_YAW_MAX = 0.18;
export const LOOK_PITCH_MAX = 0.08;

export type BehaviorPhase =
  | "idle"
  | "hover"
  | "patrol"
  | "attention"
  | "scan"
  | "reaction"
  | "settle"
  | "retreat"
  | "micro";

export type MicroAction =
  | "look_left"
  | "look_right"
  | "look_center"
  | "head_adjust"
  | "body_shift"
  | "posture_reset"
  | "pause"
  | "flight_correction";

export function clampToZone(
  x: number,
  y: number,
  z: number,
  zone: PatrolZone,
): [number, number, number] {
  return [
    clamp(x, zone.xMin, zone.xMax),
    clamp(y, zone.yMin, zone.yMax),
    clamp(z, zone.zMin, zone.zMax),
  ];
}

/** Pick a nearby patrol target inside the zone (transition-only). */
export function pickNearbyTarget(
  from: [number, number, number],
  zone: PatrolZone,
  maxStep: number,
  seed: number,
): [number, number, number] {
  const step = seededRange(seed, maxStep * 0.3, maxStep);
  const ang = seededRange(seed + 1.7, 0, Math.PI * 2);
  const elev = seededRange(seed + 3.1, -0.55, 0.7);
  const dx = Math.cos(ang) * step;
  const dy = Math.sin(elev) * step * 0.85;
  const dz = Math.sin(ang) * step * 0.32;
  return clampToZone(from[0] + dx, from[1] + dy, from[2] + dz, zone);
}

/**
 * Weighted micro-action picker (transition-only).
 * Weights: idle/pause common → glance medium → body rare.
 */
export function pickMicroAction(seed: number): MicroAction {
  const r = seededUnit(seed);
  if (r < 0.22) return "pause";
  if (r < 0.4) return "head_adjust";
  if (r < 0.55) return "look_center";
  if (r < 0.68) return "look_left";
  if (r < 0.81) return "look_right";
  if (r < 0.9) return "body_shift";
  if (r < 0.96) return "flight_correction";
  return "posture_reset";
}
