import Link from "next/link";

function pageHref(page: number, category?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function Pagination({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-16 flex items-center justify-between border-t border-white/12 pt-5 font-mono text-[10px] uppercase tracking-[0.18em]" aria-label="Blog pagination">
      {page > 1 ? (
        <Link href={pageHref(page - 1, category)} className="text-white/55 transition-colors hover:text-[#ff2a2a]">
          ← Previous
        </Link>
      ) : (
        <span className="text-white/20">← Previous</span>
      )}
      <span className="text-white/35">{page} / {totalPages}</span>
      {page < totalPages ? (
        <Link href={pageHref(page + 1, category)} className="text-white/55 transition-colors hover:text-[#ff2a2a]">
          Next →
        </Link>
      ) : (
        <span className="text-white/20">Next →</span>
      )}
    </nav>
  );
}
