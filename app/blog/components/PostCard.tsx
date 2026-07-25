import Image from "next/image";
import Link from "next/link";

import type { BlogPostMeta } from "../../lib/blog";
import { formatBlogDate } from "../../lib/blog";

export function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="group flex h-full flex-col border border-white/12 bg-[#111] transition-colors duration-500 hover:border-[#ff2a2a]/55 hover:bg-[#151515]">
      <Link href={`/blog/${post.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-white/12 bg-[#171717]">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
          <span className="text-[#ff2a2a]">{post.category}</span>
          <span aria-hidden>/</span>
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          <span aria-hidden>/</span>
          <span>{post.readingTime}</span>
        </div>
        <h2 className="mt-5 text-2xl font-black leading-[0.94] tracking-[-0.05em] sm:text-3xl">
          <Link href={`/blog/${post.slug}`} className="outline-none transition-colors group-hover:text-[#ff2a2a] focus-visible:text-[#ff2a2a]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-white/55 sm:text-base">{post.excerpt}</p>
        <div className="mt-7 flex items-center justify-between border-t border-white/12 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <span>{post.tags.slice(0, 2).join(" · ")}</span>
          <Link href={`/blog/${post.slug}`} className="text-[#ff2a2a] transition-transform group-hover:translate-x-1" aria-label={`Read ${post.title}`}>
            ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
