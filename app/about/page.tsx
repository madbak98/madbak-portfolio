import type { Metadata } from "next";

import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About — MADBAK",
  description:
    "Babak Ravanbakhsh — Creative Developer and Frontend Developer based in Istanbul, working across design, code, motion and interactive digital experiences.",
  openGraph: {
    title: "About — MADBAK",
    description:
      "Babak Ravanbakhsh — Creative Developer and Frontend Developer based in Istanbul, working across design, code, motion and interactive digital experiences.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — MADBAK",
    description:
      "Babak Ravanbakhsh — Creative Developer and Frontend Developer based in Istanbul, working across design, code, motion and interactive digital experiences.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
