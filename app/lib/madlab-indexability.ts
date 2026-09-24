import { getMadlabEntry } from "./madlab";

/**
 * MADLAB indexing policy (quality over quantity).
 *
 * INDEX:
 * - /lab hub
 * - Author-written MADLAB_ENTRIES (/lab/cursor-grid, magnetic-button, infinite-marquee)
 *
 * NOINDEX, FOLLOW (public demos / template pages — keep crawlable, not sitemap):
 * - /lab/catalog-* React Bits reference demos
 * - /lab/tutorials/* until each has unique non-templated educational copy
 */
export const NOINDEX_FOLLOW = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const;

export function isCatalogExperimentSlug(slug: string): boolean {
  return slug.startsWith("catalog-");
}

/** Only hand-authored MADLAB experiments deserve indexing today. */
export function shouldIndexMadlabExperiment(slug: string): boolean {
  return Boolean(getMadlabEntry(slug));
}

/**
 * Tutorials share the same 10-step template with a swapped focus phrase.
 * That is not enough unique educational value for indexing yet.
 */
export function shouldIndexMadlabTutorial(): boolean {
  return false;
}
