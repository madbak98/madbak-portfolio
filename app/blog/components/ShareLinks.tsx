export function ShareLinks({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-4 border-y border-white/12 py-5 font-mono text-[10px] uppercase tracking-[0.18em]">
      <span className="text-white/35">Share</span>
      <a href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer" className="text-white/55 transition-colors hover:text-[#ff2a2a]">X ↗</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" className="text-white/55 transition-colors hover:text-[#ff2a2a]">LinkedIn ↗</a>
    </div>
  );
}
