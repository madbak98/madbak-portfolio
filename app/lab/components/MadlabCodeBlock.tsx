"use client";

import { useState } from "react";

export function MadlabCodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        didCopy = document.execCommand("copy");
        textarea.remove();
      } catch {
        didCopy = false;
      }
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div id="implementation-code" className="my-5 overflow-hidden border border-white/15 bg-[#111111]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
        <span>{language}</span>
        <button
          type="button"
          onClick={copyCode}
          className="text-[#ff2a2a] transition-colors hover:text-[#ebe8e1] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#ff2a2a]"
          aria-label="Copy code to clipboard"
        >
          {copied ? "copied" : "copy code"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-[#ebe8e1] sm:p-5"><code>{code}</code></pre>
    </div>
  );
}
