import Image from "next/image";
import Link from "next/link";

import { absoluteUrl } from "../../lib/site";
import { formatBlogDate, getRelatedBlogPosts, type BlogPostEntry } from "../../lib/blog";
import { PostCard } from "./PostCard";
import { ReadingProgress } from "./ReadingProgress";
import { ShareLinks } from "./ShareLinks";
import { TableOfContents } from "./TableOfContents";

export function PostLayout({ post }: { post: BlogPostEntry }) {
  const relatedPosts = getRelatedBlogPosts(post);
  const PostContent = post.Content;

  return (
    <main>
      <ReadingProgress />
      <article>
        <header className="border-b border-white/12 px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-12 lg:pb-28">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span className="text-[#ff2a2a]">{post.category}</span>
              <span aria-hidden>/</span>
              <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <span aria-hidden>/</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="mt-8 max-w-5xl text-[clamp(3rem,8vw,8.5rem)] font-black leading-[0.82] tracking-[-0.09em]">{post.title}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/55 sm:text-xl">{post.excerpt}</p>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
              {post.tags.map((tag) => <span key={tag} className="border border-white/12 px-3 py-2">{tag}</span>)}
            </div>
            <div className="relative mt-12 aspect-[16/8] overflow-hidden border border-white/12 bg-[#151515]">
              <Image src={post.coverImage} alt="" fill priority sizes="(max-width: 1200px) 100vw, 1100px" className="object-cover" />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(12rem,0.35fr)_minmax(0,1fr)] lg:gap-16 lg:px-12">
          <TableOfContents headings={post.headings} />
          <div className="min-w-0">
            <div className="blog-prose space-y-7">
              <PostContent />
            </div>
            <div className="mt-14">
              <ShareLinks title={post.title} url={absoluteUrl(`/blog/${post.slug}`)} />
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-white/12 px-5 py-14 sm:px-8 sm:py-20 lg:px-12" aria-labelledby="related-posts">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff2a2a]">Continue reading</p>
                <h2 id="related-posts" className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Related posts</h2>
              </div>
              <Link href="/blog" className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-[#ff2a2a]">All posts ↗</Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((related) => <PostCard key={related.slug} post={related} />)}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
