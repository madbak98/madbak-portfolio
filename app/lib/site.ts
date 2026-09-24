import { ABOUT_OPERATOR_IMAGE_SRC, SOCIAL_LINKS } from "./portfolio-data";

/**
 * Production canonical origin (www).
 * Apex madbak.art is not attached to this Vercel project yet — do not emit it.
 *
 * Resolution rules:
 * - Vercel production → always https://www.madbak.art
 * - `next dev` → http://localhost:<port> (avoids local URL / production-canonical mismatch)
 * - Preview / `next start` / unknown → www (never emit localhost or *.vercel.app)
 *
 * NEXT_PUBLIC_SITE_URL may force www when it resolves to madbak.art.
 * Localhost / preview hosts in that env var are ignored outside development.
 */
const PREFERRED_ORIGIN = "https://www.madbak.art" as const;

function isMadbakHost(hostname: string): boolean {
  return hostname.replace(/^www\./i, "").toLowerCase() === "madbak.art";
}

function isLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

function resolveSiteUrl(): string {
  if (process.env.VERCEL_ENV === "production") {
    return PREFERRED_ORIGIN;
  }

  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (process.env.NODE_ENV === "development") {
    if (raw) {
      try {
        const url = new URL(raw.includes("://") ? raw : `http://${raw}`);
        if (isLocalHost(url.hostname)) {
          return `${url.protocol}//${url.host}`;
        }
        if (isMadbakHost(url.hostname)) {
          return PREFERRED_ORIGIN;
        }
      } catch {
        /* fall through to localhost default */
      }
    }
    const port = process.env.PORT?.trim() || "3000";
    return `http://localhost:${port}`;
  }

  // Preview deploys + production-mode local serves: consolidate to www.
  if (raw) {
    try {
      const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
      if (isMadbakHost(url.hostname)) return PREFERRED_ORIGIN;
    } catch {
      /* ignore invalid env */
    }
  }

  return PREFERRED_ORIGIN;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Madbak";
export const PERSON_NAME = "Babak Ravanbakhsh";
export const PERSON_ALTERNATE_NAME = "MADBAK";

/** Stable content revision for sitemap lastmod (update when meaningful content ships). */
export const CONTENT_UPDATED_AT = new Date("2026-09-24T22:00:00.000Z");

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
