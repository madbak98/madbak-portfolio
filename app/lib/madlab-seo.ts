import type { Metadata } from "next";

import type { MadlabEntry } from "./madlab";
import {
  isCatalogExperimentSlug,
  NOINDEX_FOLLOW,
  shouldIndexMadlabExperiment,
  shouldIndexMadlabTutorial,
} from "./madlab-indexability";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
} from "./site";
import { buildBreadcrumbJsonLd } from "./seo";

const INDEXABLE_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

function robotsForExperiment(slug: string): Metadata["robots"] {
  return shouldIndexMadlabExperiment(slug) ? INDEXABLE_ROBOTS : NOINDEX_FOLLOW;
}

export function buildMadlabMetadata(entry: MadlabEntry): Metadata {
  const url = absoluteUrl(`/lab/${entry.slug}`);
  const isCatalog = isCatalogExperimentSlug(entry.slug);
  const title = isCatalog
    ? `${entry.title} — MADLAB Experiment`
    : `${entry.title} — Interactive UI Experiment | MADBAK`;
  const image = absoluteUrl(entry.cover ?? DEFAULT_OG_IMAGE_PATH);

  return {
    title: { absolute: title },
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
      images: [{ url: image, alt: `${entry.title} — MADLAB` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.description,
      images: [image],
    },
    robots: robotsForExperiment(entry.slug),
  };
}

/** Full TechArticle + breadcrumbs only for indexable authored experiments. */
export function buildMadlabJsonLd(entry: MadlabEntry) {
  if (!shouldIndexMadlabExperiment(entry.slug)) {
    return null;
  }

  const url = absoluteUrl(`/lab/${entry.slug}`);
  const path = `/lab/${entry.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: entry.title,
      description: entry.description,
      image: [absoluteUrl(entry.cover ?? DEFAULT_OG_IMAGE_PATH)],
      datePublished: entry.publishedAt,
      dateModified: entry.updatedAt ?? entry.publishedAt,
      author: { "@type": "Person", name: PERSON_NAME, url: `${SITE_URL}/` },
      publisher: { "@type": "Person", name: PERSON_NAME, url: `${SITE_URL}/` },
      articleSection: entry.category,
      keywords: [entry.category, ...entry.technologies].join(", "),
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "MADLAB", path: "/lab" },
      { name: entry.title, path },
    ]),
  ];
}

export function buildMadlabTutorialMetadata(input: {
  slug: string;
  title: string;
}): Metadata {
  const path = `/lab/tutorials/${input.slug}`;
  const url = absoluteUrl(path);
  const title = `${input.title} — MADLAB Tutorial | MADBAK`;
  const description = `A MADLAB build guide for ${input.title}: component contract, static fallback, interaction rule, responsive layout, and reduced-motion notes.`;
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const indexable = shouldIndexMadlabTutorial();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: indexable ? INDEXABLE_ROBOTS : NOINDEX_FOLLOW,
  };
}
