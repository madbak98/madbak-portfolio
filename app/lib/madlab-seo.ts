import type { Metadata } from "next";

import type { MadlabEntry } from "./madlab";
import { absoluteUrl, PERSON_NAME, SITE_NAME, SITE_URL } from "./site";

export function buildMadlabMetadata(entry: MadlabEntry): Metadata {
  const url = absoluteUrl(`/lab/${entry.slug}`);
  const title = `${entry.title} — MADLAB`;

  return {
    title,
    description: entry.description,
    keywords: ["MADLAB", "Madbak", entry.category, ...entry.technologies],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title,
      description: entry.description,
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt ?? entry.publishedAt,
      authors: [PERSON_NAME],
      tags: [entry.category, ...entry.technologies],
      images: [{ url: absoluteUrl(entry.cover ?? "/og-default.png"), alt: `${entry.title} — MADLAB` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.description,
      images: [absoluteUrl(entry.cover ?? "/og-default.png")],
    },
  };
}

export function buildMadlabJsonLd(entry: MadlabEntry) {
  const url = absoluteUrl(`/lab/${entry.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: entry.title,
    description: entry.description,
    image: [absoluteUrl(entry.cover ?? "/og-default.png")],
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt ?? entry.publishedAt,
    author: { "@type": "Person", name: PERSON_NAME, url: `${SITE_URL}/` },
    publisher: { "@type": "Person", name: PERSON_NAME, url: `${SITE_URL}/` },
    articleSection: entry.category,
    keywords: [entry.category, ...entry.technologies].join(", "),
    inLanguage: "en-US",
  };
}
