import type { Metadata } from "next";
import Link from "next/link";

import { BlogShell } from "./BlogShell";
import { Pagination } from "./components/Pagination";
import { PostCard } from "./components/PostCard";
import {
  BLOG_CATEGORIES,
  getBlogPostsPage,
  type BlogCategory,
} from "../lib/blog";
import { absoluteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tutorials, case studies, opinions, and notes from Madbak’s frontend and creative web practice.",
  alternates: { canonical: absoluteUrl("/blog") },
};

type BlogIndexProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

function validCategory(value?: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.includes(value as BlogCategory)
    ? (value as BlogCategory)
    : undefined;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const params = await searchParams;
  const category = validCategory(params.category);
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const result = getBlogPostsPage({
    category,
    page: Number.isFinite(requestedPage) ? requestedPage : 1,
  });

  return (
    <BlogShell>
      <main>
        <section className="border-b border-white/12 px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:px-12">
          <div className="mx-auto max-w-[1400px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2a2a]">[006] Journal</p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-16">
              <h1 className="max-w-5xl text-[clamp(4rem,12vw,12rem)] font-black leading-[0.78] tracking-[-0.11em]">BLOG</h1>
              <p className="max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                Notes on frontend development, interactive websites, motion systems, design decisions, and the work behind the work.
              </p>
            </div>
            <nav className="mt-12 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/12 pt-5 font-mono text-[10px] uppercase tracking-[0.18em]" aria-label="Filter blog posts by category">
              <Link href="/blog" className={`transition-colors ${!category ? "text-[#ff2a2a]" : "text-white/45 hover:text-white"}`}>All posts</Link>
              {BLOG_CATEGORIES.map((item) => (
                <Link key={item} href={`/blog?category=${encodeURIComponent(item)}`} className={`transition-colors ${category === item ? "text-[#ff2a2a]" : "text-white/45 hover:text-white"}`}>
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12" aria-labelledby="blog-posts-heading">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-end justify-between gap-6">
              <h2 id="blog-posts-heading" className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                {category ?? "Latest posts"}
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">{result.totalPosts} {result.totalPosts === 1 ? "entry" : "entries"}</span>
            </div>
            {result.posts.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {result.posts.map((post) => <PostCard key={post.slug} post={post} />)}
              </div>
            ) : (
              <p className="mt-8 border border-white/12 p-8 text-white/55">No posts in this category yet.</p>
            )}
            <Pagination page={result.currentPage} totalPages={result.totalPages} category={category} />
          </div>
        </section>
      </main>
    </BlogShell>
  );
}
