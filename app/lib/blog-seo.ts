import type { Metadata } from "next";

import type { BlogPostMeta } from "./blog";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
} from "./site";

export function buildBlogPostMetadata(post: BlogPostMeta): Metadata {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.coverImage || DEFAULT_OG_IMAGE_PATH);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [PERSON_NAME],
      tags: post.tags,
      images: [{ url: imageUrl, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export function buildBlogPostJsonLd(post: BlogPostMeta) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.coverImage || DEFAULT_OG_IMAGE_PATH);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: PERSON_NAME,
      url: `${SITE_URL}/`,
    },
    publisher: {
      "@type": "Person",
      name: PERSON_NAME,
      url: `${SITE_URL}/`,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
  };
}
