"use client";

import dynamic from "next/dynamic";

/**
 * Layout-level Guardians host.
 * Loads independently — never blocks Pet / nav / dialogue.
 */
const GuardianSystem = dynamic(
  () => import("./GuardianSystem").then((m) => m.GuardianSystem),
  { ssr: false, loading: () => null },
);

export function SiteGuardians() {
  return <GuardianSystem />;
}
