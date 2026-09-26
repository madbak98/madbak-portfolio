"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { aboutText } from "../lib/about-i18n";
import { usePreferredLang } from "../lib/locale-preference";
import {
  petPresentationForContext,
  resolvePetPageContext,
} from "../lib/pet-page-context";
import { MadbakPet } from "./MadbakPet";
import "./madbak-pet.css";

/**
 * Layout-level Pet host.
 *
 * /        → none (homepage stays clean)
 * /about   → none here (About page embeds MadbakPet mode="full")
 * others   → compact fixed companion
 */
export function SitePetCompanion() {
  const pathname = usePathname();
  const [lang] = usePreferredLang();
  const [reducedMotion, setReducedMotion] = useState(false);

  const pageContext = useMemo(
    () => resolvePetPageContext(pathname),
    [pathname],
  );
  const presentation = petPresentationForContext(pageContext);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (presentation !== "compact") return null;

  return (
    <MadbakPet
      mode="compact"
      pageContext={pageContext}
      lang={lang}
      portraitAlt={aboutText(lang, "portraitAlt")}
      reducedMotion={reducedMotion}
    />
  );
}
