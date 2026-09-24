import type { Metadata } from "next";

import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About — Madbak",
  description: "About Madbak — creative frontend developer and web designer.",
};

export default function Page() {
  return <AboutPage />;
}
