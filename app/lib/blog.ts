import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { ComponentType } from "react";

import { slugify } from "./blog-utils";

export const BLOG_CATEGORIES = [
  "Tutorial",
  "Case Study",
  "Opinion/Trends",
  "Notes",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPostMeta = {
  title: string;
  slug: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  excerpt: string;
  coverImage: string;
  readingTime: string;
  headings: BlogHeading[];
  fileName: string;
};

export type BlogPostEntry = BlogPostMeta & {
  Content: ComponentType;
};

const BLOG_CONTENT_DIR = join(process.cwd(), "content", "blog");

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function tagsValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
}

function categoryValue(value: unknown): BlogCategory {
  return BLOG_CATEGORIES.includes(value as BlogCategory)
    ? (value as BlogCategory)
    : "Notes";
}

function extractHeadings(source: string): BlogHeading[] {
  return source
    .split("\n")
    .map((line) => line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const text = match[2]!.replace(/[*_`]/g, "").trim();
      return {
        id: slugify(text),
        text,
        level: match[1]!.length as 2 | 3,
      };
    });
}

function readPost(fileName: string): BlogPostMeta {
  const source = readFileSync(join(BLOG_CONTENT_DIR, fileName), "utf8");
  const parsed = matter(source);
  const data = parsed.data as Record<string, unknown>;
  const fallbackSlug = fileName.replace(/\.mdx$/, "");

  return {
    title: stringValue(data.title, fallbackSlug),
    slug: stringValue(data.slug, fallbackSlug),
    date: stringValue(data.date, "2026-01-01"),
    category: categoryValue(data.category),
    tags: tagsValue(data.tags),
    excerpt: stringValue(data.excerpt, "A note from the Madbak journal."),
    coverImage: stringValue(data.coverImage, "/og-default.png"),
    readingTime: stringValue(data.readingTime, "3 min read"),
    headings: extractHeadings(parsed.content),
    fileName,
  };
}

export function getAllBlogPosts(): BlogPostMeta[] {
  if (!existsSync(BLOG_CONTENT_DIR)) return [];

  return readdirSync(BLOG_CONTENT_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPostMeta(slug: string): BlogPostMeta | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostEntry | undefined> {
  const meta = getBlogPostMeta(slug);
  if (!meta) return undefined;

  const mdxModule = await import(`../../content/blog/${meta.fileName}`);
  return { ...meta, Content: mdxModule.default as ComponentType };
}

export function getBlogPostsPage({
  category,
  page,
  pageSize = 6,
}: {
  category?: BlogCategory;
  page: number;
  pageSize?: number;
}) {
  const filtered = category
    ? getAllBlogPosts().filter((post) => post.category === category)
    : getAllBlogPosts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return {
    posts: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    currentPage,
    totalPages,
    totalPosts: filtered.length,
  };
}

export function getRelatedBlogPosts(post: BlogPostMeta, limit = 3): BlogPostMeta[] {
  return getAllBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === post.category ? 3 : 0) +
        candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
