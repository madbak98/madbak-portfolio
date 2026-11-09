import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetail } from "../../components/articles/ArticleDetail";
import { JsonLd } from "../../components/seo/JsonLd";
import { ARTICLES, getArticle } from "../../lib/articles";
import { buildArticleJsonLd, buildArticleMetadata } from "../../lib/articles-seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found" };
  return buildArticleMetadata(article);
}

export default async function ArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd data={buildArticleJsonLd(article)} />
      <ArticleDetail article={article} />
    </>
  );
}
