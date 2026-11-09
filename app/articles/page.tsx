import type { Metadata } from "next";

import { ArticlesBrowser } from "../components/articles/ArticlesBrowser";
import { ArticlesHero } from "../components/articles/ArticlesHero";
import { SubscribeBand } from "../components/articles/SubscribeBand";
import { JsonLd } from "../components/seo/JsonLd";
import {
  ARTICLE_TOPICS,
  ARTICLES,
  getArticleNumber,
  getFeaturedArticle,
  toSummary,
} from "../lib/articles";
import { buildArticlesIndexJsonLd, buildArticlesIndexMetadata } from "../lib/articles-seo";

export const metadata: Metadata = buildArticlesIndexMetadata();

export default function ArticlesPage() {
  const featured = getFeaturedArticle();

  return (
    <>
      <JsonLd data={buildArticlesIndexJsonLd(ARTICLES)} />
      <ArticlesHero
        featured={featured}
        featuredNumber={getArticleNumber(featured.slug)}
        total={ARTICLES.length}
        topicCount={ARTICLE_TOPICS.length}
      />
      <ArticlesBrowser articles={ARTICLES.map(toSummary)} />
      <SubscribeBand />
    </>
  );
}
