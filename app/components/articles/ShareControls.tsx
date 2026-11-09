"use client";

import { useEffect, useState } from "react";

import { CheckIcon, LinkedInIcon, LinkIcon, ShareIcon, XLogoIcon } from "./icons";

const buttonClass =
  "flex h-11 w-11 items-center justify-center border-2 border-(--a-ink) text-(--a-ink) transition-colors hover:border-(--a-purple) hover:bg-(--a-purple) hover:text-white";

export function ShareControls({ title, path }: { title: string; path: string }) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only values after hydration
    setUrl(new URL(path, window.location.origin).toString());
    setCanNativeShare(typeof navigator.share === "function");
  }, [path]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      <span className="a-label mr-1 font-semibold text-(--a-muted)">
        Share
      </span>
      <a
        href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={buttonClass}
      >
        <XLogoIcon />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClass}
      >
        <LinkedInIcon />
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={buttonClass}
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
      </button>
      {canNativeShare && (
        <button
          type="button"
          onClick={() => navigator.share({ title, url }).catch(() => undefined)}
          aria-label="Share via device"
          className={`${buttonClass} sm:hidden`}
        >
          <ShareIcon />
        </button>
      )}
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
