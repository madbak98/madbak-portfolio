import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogShell } from "../BlogShell";
import { PostLayout } from "../components/PostLayout";
import { JsonLd } from "../../components/seo/JsonLd";
import { getAllBlogPosts, getBlogPostBySlug, getBlogPostMeta } from "../../lib/blog";
import { buildBlogPostJsonLd, buildBlogPostMetadata } from "../../lib/blog-seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostMeta(slug);
  return post ? buildBlogPostMetadata(post) : { title: "Post not found" };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <BlogShell>
      <JsonLd data={buildBlogPostJsonLd(post)} />
      <PostLayout post={post} />
    </BlogShell>
  );
}
