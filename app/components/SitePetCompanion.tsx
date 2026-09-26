"use client";

import { useEffect, useState } from "react";

import { AboutPetCompanion } from "../about/components/AboutPetCompanion";
import { aboutText } from "../lib/about-i18n";
import { usePreferredLang } from "../lib/locale-preference";
import "./madbak-pet.css";

/**
 * Site-wide fixed Madbak pet — mounted once in the root layout.
 */
export function SitePetCompanion() {
  const [lang] = usePreferredLang();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <AboutPetCompanion
      lang={lang}
      portraitAlt={aboutText(lang, "portraitAlt")}
      reducedMotion={reducedMotion}
    />
  );
}
