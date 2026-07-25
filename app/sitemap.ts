import type { MetadataRoute } from "next";

import { getAllBlogPosts } from "./lib/blog";
import { languageAlternates, SITEMAP_ROUTES } from "./lib/seo";
import { absoluteUrl, CONTENT_UPDATED_AT } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = SITEMAP_ROUTES.map((route) => {
    const alternates = languageAlternates(route.path)?.languages;
    return {
      url: absoluteUrl(route.path),
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: alternates
        ? {
            languages: Object.fromEntries(
              Object.entries(alternates).map(([lang, href]) => [
                lang,
                typeof href === "string" ? href : absoluteUrl(route.path),
              ]),
            ),
          }
      : undefined,
    };
  });

  const blogRoutes = getAllBlogPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...coreRoutes, ...blogRoutes];
}
