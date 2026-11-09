import { permanentRedirect } from "next/navigation";

import { getArticle } from "../../lib/articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Preserve published Blog post URLs: matching slugs land on the article, the rest on the index. */
export default async function BlogPostRedirect({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(getArticle(slug) ? `/articles/${slug}` : "/articles");
}
