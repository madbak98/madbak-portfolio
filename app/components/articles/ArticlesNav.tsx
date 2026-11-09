"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ArticleSummary } from "../../lib/articles";
import { ArticleSearch } from "./ArticleSearch";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { SubscribeForm } from "./SubscribeForm";
import { ThemeToggle } from "./ThemeToggle";
import { useDialogBehaviour } from "./useDialogBehaviour";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/works/websites" },
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/#contact" },
] as const;

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(
    el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)),
  );
}

export function ArticlesNav({ searchIndex }: { searchIndex: ArticleSummary[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeSubscribe = useCallback(() => setSubscribeOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const shortcut =
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !isTypingTarget(event.target));
      if (shortcut) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === "/articles" ? pathname.startsWith("/articles") : false;

  return (
    <>
      <header
        className={`sticky top-0 z-[90] border-b-2 border-(--a-ink) transition-[background-color] duration-300 ${
          scrolled || menuOpen ? "bg-(--a-bg)/92 backdrop-blur-md" : "bg-(--a-bg)"
        }`}
      >
        <nav
          aria-label="Articles navigation"
          className="a-wrap grid h-16 grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]"
        >
          <Link
            href="/"
            className="flex items-baseline gap-3 justify-self-start text-(--a-ink)"
            aria-label="MADBAK home"
          >
            <span className="a-display text-[2.1rem] leading-none tracking-[-0.01em]">
              MADBAK<span className="ml-0.5 align-top text-[0.45em] text-(--a-purple)">®</span>
            </span>
            <span className="a-label hidden text-(--a-muted) sm:inline">Journal</span>
          </Link>

          <ul className="hidden items-center lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`a-label block px-4 py-2 font-semibold transition-colors ${
                      active
                        ? "bg-(--a-purple) text-white"
                        : "text-(--a-ink) hover:bg-(--a-ink) hover:text-(--a-on-ink)"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-self-end gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search articles (press /)"
              className="group flex h-11 items-center gap-3 border-2 border-(--a-ink) px-3 text-(--a-ink) transition-colors hover:bg-(--a-ink) hover:text-(--a-on-ink)"
            >
              <SearchIcon />
              <kbd className="a-label hidden text-(--a-muted) group-hover:text-(--a-on-ink)/70 xl:inline">/</kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="a-label hidden h-11 items-center gap-2.5 bg-(--a-purple) px-5 font-semibold text-white transition-colors hover:bg-(--a-ink) hover:text-(--a-on-ink) sm:inline-flex"
            >
              Subscribe
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="articles-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center bg-(--a-ink) text-(--a-on-ink) transition-colors hover:bg-(--a-purple) hover:text-white lg:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="articles-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t-2 border-(--a-ink) lg:hidden"
            >
              <ul className="a-wrap py-3">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-baseline justify-between border-b-2 border-(--a-ink) py-3 ${
                          active ? "text-(--a-purple)" : "text-(--a-ink)"
                        }`}
                      >
                        <span className="a-display text-[3.4rem]">{link.label}</span>
                        <span className="a-label">{String(index + 1).padStart(2, "0")}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="a-wrap pb-6 sm:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSubscribeOpen(true);
                  }}
                  className="a-label flex h-14 w-full items-center justify-center bg-(--a-purple) font-semibold text-white"
                >
                  Subscribe to the newsletter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ArticleSearch open={searchOpen} onClose={closeSearch} articles={searchIndex} />
      <SubscribeDialog open={subscribeOpen} onClose={closeSubscribe} />
    </>
  );
}

function SubscribeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && <SubscribePanel onClose={onClose} />}
    </AnimatePresence>
  );
}

function SubscribePanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehaviour(true, onClose, panelRef);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-(--a-scrim) p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl border-2 border-(--a-ink) bg-(--a-surface) p-7 shadow-[12px_12px_0_var(--a-purple)] sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-(--a-ink) text-(--a-on-ink) transition-colors hover:bg-(--a-purple) hover:text-white"
        >
          <CloseIcon />
        </button>
        <p className="a-label font-semibold text-(--a-purple)">The MADBAK Letter</p>
        <h2 id="subscribe-title" className="a-display mt-4 text-[3.2rem] text-(--a-ink) sm:text-[4rem]">
          New essays on design, code <span className="text-(--a-purple)">&amp; security.</span>
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-(--a-muted)">
          One considered email when a new story is published. No noise, unsubscribe anytime.
        </p>
        <div className="mt-6">
          <SubscribeForm autoFocus />
        </div>
      </motion.div>
    </motion.div>
  );
}
