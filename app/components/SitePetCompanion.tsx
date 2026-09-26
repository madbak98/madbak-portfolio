"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { aboutText } from "../lib/about-i18n";
import { usePreferredLang } from "../lib/locale-preference";
import {
  petPresentationForContext,
  resolvePetPageContext,
} from "../lib/pet-page-context";
import { FloatingPetComputer } from "./FloatingPetComputer";

/**
 * Layout-level Pet host — persistent floating Old PC + Pet companion.
 *
 * /       → floating (hidden while homepage #about is in view)
 * /about  → none here (AboutPage owns the dedicated CRT installation)
 * others  → floating companion with route-aware dialogue
 */
export function SitePetCompanion() {
  const pathname = usePathname();
  const [lang] = usePreferredLang();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);

  const pageContext = useMemo(
    () => resolvePetPageContext(pathname),
    [pathname],
  );
  const presentation = petPresentationForContext(pageContext);
  const isHome = pageContext.pageType === "home";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Homepage only: hide floating installation while #about is the focus section
  useEffect(() => {
    if (!isHome) return;

    const el = document.getElementById("about");
    if (!el) return;

    const sync = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const ratio = visible / Math.max(r.height, 1);
      // Match prior IO intent: about is the focus when meaningfully on screen
      setAboutInView(ratio >= 0.18 && r.top < vh * 0.92 && r.bottom > vh * 0.08);
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          setAboutInView(
            Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.18),
          );
        },
        {
          threshold: [0, 0.18, 0.35, 0.55],
          rootMargin: "-8% 0px -12% 0px",
        },
      );
      io.observe(el);
    }

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    sync();

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [isHome]);

  // /about CRT is owned by AboutPage — do not mount a second Pet
  if (presentation !== "floating") return null;

  const suppressed = isHome && aboutInView;

  return (
    <FloatingPetComputer
      pageContext={pageContext}
      lang={lang}
      portraitAlt={aboutText(lang, "portraitAlt")}
      reducedMotion={reducedMotion}
      suppressed={suppressed}
    />
  );
}
