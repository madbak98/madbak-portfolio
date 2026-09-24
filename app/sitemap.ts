import type { MetadataRoute } from "next";

import { SITEMAP_ROUTES } from "./lib/seo";
import { MADLAB_ENTRIES } from "./lib/madlab";
import { REACT_BITS_FREE_ITEMS } from "./lib/react-bits-free";
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

  const catalogItems = REACT_BITS_FREE_ITEMS.map((item) =>
    entry(`/lab/${item.slug}`, {
      changeFrequency: "monthly",
      priority: item.featured ? 0.8 : 0.7,
    }),
  );

  const tutorials = REACT_BITS_FREE_ITEMS.map((item) => {
    const tutorialSlug = item.slug.replace(/^catalog-/, "");
    return entry(`/lab/tutorials/${tutorialSlug}`, {
      changeFrequency: "monthly",
      priority: 0.65,
    });
  });

  const byUrl = new Map<string, SitemapEntry>();
  for (const item of [...core, ...madlabExperiments, ...catalogItems, ...tutorials]) {
    byUrl.set(item.url, item);
  }

  return [...byUrl.values()];
}
