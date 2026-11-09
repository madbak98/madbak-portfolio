import type { Metadata } from "next";

import {
  ARTICLE_AUTHOR,
  getArticleHeadline,
  getFaqItems,
  toPlainText,
  type Article,
} from "./articles";
import { buildBreadcrumbJsonLd } from "./seo";
import { absoluteUrl, getSameAsProfiles, PERSON_NAME, SITE_NAME, SITE_URL } from "./site";

export const ARTICLES_INDEX_SEO = {
  title: "Articles — Design, Code & Security | MADBAK",
  description:
    "Articles, tutorials, and insights by MADBAK at the intersection of design, code, AI, vibe coding and cybersecurity.",
  image: "/articles/hero-augustus.webp",
};

export function buildArticlesIndexMetadata(): Metadata {
  const url = absoluteUrl("/articles");
  const { title, description, image } = ARTICLES_INDEX_SEO;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: [{ url: absoluteUrl(image), width: 1322, height: 1600, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export function buildArticleMetadata(article: Article): Metadata {
  const path = `/articles/${article.slug}`;
  const url = absoluteUrl(path);
  const title = article.seo?.title ?? `${article.title} | MADBAK Articles`;
  const description = article.seo?.description ?? article.description;
  const headline = getArticleHeadline(article);
  const image = absoluteUrl(article.cover.src);
  return {
    title: { absolute: title },
    description,
    authors: [{ name: article.author.name, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: headline,
      description,
      locale: "en_US",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: image,
          width: article.cover.width,
          height: article.cover.height,
          alt: article.cover.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      images: [image],
    },
  };
}

export function buildArticlesIndexJsonLd(articles: Article[]) {
  const url = absoluteUrl("/articles");
  return [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${url}#blog`,
      url,
      name: ARTICLES_INDEX_SEO.title,
      description: ARTICLES_INDEX_SEO.description,
      publisher: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      blogPost: articles.map((article) => ({
        "@type": "BlogPosting",
        headline: article.title,
        url: absoluteUrl(`/articles/${article.slug}`),
        datePublished: article.publishedAt,
      })),
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Articles", path: "/articles" },
    ]),
  ];
}

export function buildArticleJsonLd(article: Article) {
  const path = `/articles/${article.slug}`;
  const url = absoluteUrl(path);
  const faq = getFaqItems(article);
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      url,
      mainEntityOfPage: url,
      headline: getArticleHeadline(article),
      description: article.seo?.description ?? article.description,
      image: {
        "@type": "ImageObject",
        url: absoluteUrl(article.cover.src),
        width: article.cover.width,
        height: article.cover.height,
      },
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      timeRequired: `PT${article.readingMinutes}M`,
      inLanguage: "en",
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON_NAME,
        alternateName: ARTICLE_AUTHOR.name,
        url: `${SITE_URL}/`,
        sameAs: getSameAsProfiles(),
      },
      publisher: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${absoluteUrl("/articles")}#blog` },
    },
    ...(faq.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            url,
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: toPlainText(item.question),
              acceptedAnswer: { "@type": "Answer", text: toPlainText(item.answer) },
            })),
          },
        ]
      : []),
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Articles", path: "/articles" },
      { name: article.title, path },
    ]),
  ];
}
