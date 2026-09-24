import type { Metadata } from "next";

import ServicesPage from "./ServicesPage";

export const metadata: Metadata = {
  title: {
    absolute: "Services — MADBAK",
  },
  description:
    "Web design, frontend development, motion, interaction, and creative direction by Madbak.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services — MADBAK",
    description:
      "Web design, frontend development, motion, interaction, and creative direction by Madbak.",
    url: "/services",
    type: "website",
  },
};

export default function Page() {
  return <ServicesPage />;
}
