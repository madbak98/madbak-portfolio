import type { MetadataRoute } from "next";

import { SITEMAP_ROUTES } from "./lib/seo";
import { MADLAB_ENTRIES } from "./lib/madlab";
import { absoluteUrl, CONTENT_UPDATED_AT } from "./lib/site";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  options: {
    changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
    priority: number;
    lastModified?: Date | string;
  },
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified: options.lastModified ?? CONTENT_UPDATED_AT,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

/**
 * Sitemap = indexable URLs only.
 * Catalog demos (/lab/catalog-*) and templated tutorials (/lab/tutorials/*)
 * are public + noindex and intentionally omitted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const core = SITEMAP_ROUTES.map((route) =>
    entry(route.path, {
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }),
  );

  const madlabExperiments = MADLAB_ENTRIES.map((item) =>
    entry(`/lab/${item.slug}`, {
      changeFrequency: "monthly",
      priority: item.featured ? 0.85 : 0.75,
      lastModified: item.updatedAt ?? item.publishedAt,
    }),
  );

  const byUrl = new Map<string, SitemapEntry>();
  for (const item of [...core, ...madlabExperiments]) {
    byUrl.set(item.url, item);
  }

  return [...byUrl.values()];
}
