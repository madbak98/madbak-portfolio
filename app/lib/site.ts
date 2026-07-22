import { ABOUT_OPERATOR_IMAGE_SRC, SOCIAL_LINKS } from "./portfolio-data";

/**
 * Preferred production origin (apex, non-www).
 * Env overrides are accepted only when they resolve to madbak.art;
 * www / localhost / Vercel preview hosts are never emitted in metadata.
 */
const PREFERRED_ORIGIN = "https://madbak.art" as const;

function resolveSiteUrl(): typeof PREFERRED_ORIGIN {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return PREFERRED_ORIGIN;

  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (host === "madbak.art") return PREFERRED_ORIGIN;
  } catch {
    /* ignore invalid env */
  }

  return PREFERRED_ORIGIN;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Madbak";
export const PERSON_NAME = "Babak Ravanbakhsh";
export const PERSON_ALTERNATE_NAME = "Madbak";

/** Stable content revision for sitemap lastmod (update when meaningful content ships). */
export const CONTENT_UPDATED_AT = new Date("2026-07-22T00:00:00.000Z");

export const DEFAULT_OG_IMAGE_PATH = "/og-default.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path === "/" || path === "") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/** Public profiles already configured — used for Person.sameAs only. */
export function getSameAsProfiles(): string[] {
  return [
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.x,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.telegram,
  ].filter(Boolean);
}

export function getProfileImageUrl(): string {
  return ABOUT_OPERATOR_IMAGE_SRC.startsWith("http")
    ? ABOUT_OPERATOR_IMAGE_SRC
    : absoluteUrl(ABOUT_OPERATOR_IMAGE_SRC);
}
