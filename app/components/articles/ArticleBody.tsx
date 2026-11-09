import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { formatIndex, INLINE_MARKUP, type ArticleBlock } from "../../lib/articles";
import { ArrowRightIcon } from "./icons";

const inlineLink =
  "font-semibold text-(--a-ink) underline decoration-(--a-purple) decoration-2 underline-offset-4 transition-colors hover:bg-(--a-purple) hover:text-white hover:decoration-transparent";

/** Renders the `**bold**` / `[label](href)` subset described by `INLINE_MARKUP`. */
function Inline({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_MARKUP)) {
    const [whole, bold, label, href] = match;
    const start = match.index;
    if (start > last) nodes.push(text.slice(last, start));
    if (bold !== undefined) {
      nodes.push(
        <strong key={start} className="font-semibold text-(--a-ink)">
          {bold}
        </strong>,
      );
    } else if (/^https?:\/\//.test(href)) {
      nodes.push(
        <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={inlineLink}>
          {label}
        </a>,
      );
    } else {
      nodes.push(
        <Link key={start} href={href} className={inlineLink}>
          {label}
        </Link>,
      );
    }
    last = start + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="a-prose text-[1.1rem] leading-[1.8] text-(--a-body) sm:text-[1.16rem]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return (
              <p key={index}>
                <Inline text={block.text} />
              </p>
            );
          case "h2": {
            const section = blocks.slice(0, index + 1).filter((b) => b.type === "h2").length;
            return (
              <h2 key={index} id={block.id} className="border-t-[6px] border-(--a-ink) pt-5">
                <span
                  aria-hidden
                  className="a-display mb-4 flex items-baseline gap-3 text-[3.6rem] leading-[0.8] text-(--a-purple)"
                >
                  {formatIndex(section)}
                  <span className="a-label font-semibold tracking-[0.14em]">Section</span>
                </span>
                <span className="a-display block text-[2.5rem] leading-[0.88] text-(--a-ink) sm:text-[3.1rem]">
                  {block.text}
                </span>
              </h2>
            );
          }
          case "h3":
            return (
              <h3 key={index} className="text-[1.35rem] font-bold tracking-[-0.01em] text-(--a-ink)">
                {block.text}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="relative border-l-[10px] border-(--a-purple) py-2 pl-6 sm:-mr-16 sm:pl-10 lg:-mr-[14vw]"
              >
                <span
                  aria-hidden
                  className="a-display block h-[0.42em] overflow-hidden text-[8rem] leading-[0.9] text-(--a-purple)"
                >
                  “
                </span>
                <p className="a-display text-[2.6rem] leading-[0.92] text-(--a-ink) sm:text-[3.4rem] lg:text-[4rem]">
                  {block.text}
                </p>
                {block.cite && (
                  <footer className="a-label mt-5 font-semibold text-(--a-purple)">
                    — {block.cite}
                  </footer>
                )}
              </blockquote>
            );
          case "image": {
            const original = block.image.treatment === "original";
            return (
              <figure key={index} className="sm:-mx-10 lg:-mx-[8vw]">
                <div
                  className={`relative overflow-hidden bg-(--a-purple) ${original ? "" : "aspect-[16/10]"}`}
                  style={
                    original
                      ? { aspectRatio: `${block.image.width} / ${block.image.height}` }
                      : undefined
                  }
                >
                  <Image
                    src={block.image.src}
                    alt={block.image.alt}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className={original ? "object-cover" : "object-cover contrast-[1.08] grayscale"}
                    style={{ objectPosition: block.image.focus ?? "50% 30%" }}
                  />
                  {!original && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[6px] w-[40%] bg-(--a-purple)"
                    />
                  )}
                </div>
                <figcaption className="mt-3 flex flex-col gap-1 border-b-2 border-(--a-ink) pb-3 text-[0.88rem] leading-snug sm:flex-row sm:justify-between sm:gap-6">
                  <span className="font-medium text-(--a-ink)">{block.caption}</span>
                  {block.image.credit && (
                    <span className="a-label shrink-0 text-(--a-muted)">{block.image.credit}</span>
                  )}
                </figcaption>
              </figure>
            );
          }
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`space-y-3 pl-6 marker:text-(--a-purple) ${block.ordered ? "list-decimal marker:font-bold" : "list-[square]"}`}
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-2">
                    <Inline text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }
          case "callout":
            return (
              <aside key={index} className="bg-(--a-purple) px-6 py-7 text-white sm:px-9">
                <p className="a-label font-semibold text-white/80">{block.title}</p>
                <p className="mt-3 text-[1.1rem] font-medium leading-relaxed">{block.text}</p>
              </aside>
            );
          case "table":
            return <ArticleTable key={index} block={block} />;
          case "faq":
            return (
              <div key={index} className="border-b-2 border-(--a-ink)">
                {block.items.map((item, itemIndex) => (
                  <div
                    key={item.question}
                    className="grid grid-cols-[3.2rem_minmax(0,1fr)] gap-x-3 border-t-2 border-(--a-ink) py-6 sm:grid-cols-[4.2rem_minmax(0,1fr)]"
                  >
                    <span
                      aria-hidden
                      className="a-display text-[2.4rem] leading-[0.8] text-(--a-purple) sm:text-[3rem]"
                    >
                      {formatIndex(itemIndex + 1)}
                    </span>
                    <div>
                      <h3 className="a-display text-[1.75rem] leading-[0.92] text-(--a-ink) sm:text-[2.1rem]">
                        {item.question}
                      </h3>
                      <p className="mt-3">
                        <Inline text={item.answer} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          case "cta": {
            const titleId = `cta-${index}`;
            return (
              <section
                key={index}
                aria-labelledby={titleId}
                className="bg-(--a-purple) px-6 py-9 text-white sm:px-10 sm:py-12 lg:-mr-[14vw]"
              >
                <h2
                  id={titleId}
                  className="a-display text-[2.8rem] leading-[0.86] sm:text-[4rem] lg:text-[4.8rem]"
                >
                  {block.title}
                </h2>
                <p className="mt-6 max-w-2xl text-[1.1rem] font-medium leading-relaxed text-white/90">
                  {block.text}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {block.links.map((link, linkIndex) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`a-label group inline-flex h-12 items-center justify-between gap-3 px-5 font-semibold transition-colors ${
                        linkIndex === 0
                          ? "bg-white text-(--a-purple) hover:bg-(--a-purple-black) hover:text-white"
                          : "border-2 border-white text-white hover:bg-white hover:text-(--a-purple)"
                      }`}
                    >
                      {link.label}
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          }
        }
      })}
    </div>
  );
}

const stackedLabel =
  "max-sm:before:mb-1 max-sm:before:block max-sm:before:font-[family-name:var(--font-geist-mono)] max-sm:before:text-[0.62rem] max-sm:before:font-semibold max-sm:before:uppercase max-sm:before:tracking-[0.14em] max-sm:before:text-(--a-muted) max-sm:before:content-[attr(data-label)]";

/** Bordered data table; below `sm` each row stacks into a labelled block so nothing scrolls sideways. */
function ArticleTable({ block }: { block: Extract<ArticleBlock, { type: "table" }> }) {
  return (
    <figure className="lg:-mr-[12vw]">
      {block.caption && (
        <figcaption className="a-label mb-3 font-semibold text-(--a-purple)">{block.caption}</figcaption>
      )}
      <table className="w-full border-collapse border-y-[3px] border-(--a-ink) text-left text-[0.95rem] leading-snug max-sm:block">
        <thead className="max-sm:sr-only">
          <tr className="bg-(--a-ink) text-(--a-on-ink)">
            {block.columns.map((column, columnIndex) => (
              <th
                key={columnIndex}
                scope="col"
                className="a-label px-3 py-3 align-bottom font-semibold first:pl-4"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-sm:block">
          {block.rows.map((row) => (
            <tr
              key={row[0]}
              className="border-t border-(--a-ink)/25 first:border-t-0 max-sm:block max-sm:border-t-2 max-sm:border-(--a-ink) max-sm:py-4 max-sm:first:border-t-0"
            >
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th
                    key={cellIndex}
                    scope="row"
                    className="px-3 py-3.5 pl-4 align-top font-bold text-(--a-ink) max-sm:block max-sm:p-0 max-sm:text-[1.05rem]"
                  >
                    <Inline text={cell} />
                  </th>
                ) : (
                  <td
                    key={cellIndex}
                    data-label={block.columns[cellIndex]}
                    className={`px-3 py-3.5 align-top max-sm:mt-3 max-sm:block max-sm:p-0 ${stackedLabel}`}
                  >
                    <Inline text={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
