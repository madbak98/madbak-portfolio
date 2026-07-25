import type { Metadata } from "next";

import ServicesPage from "./ServicesPage";

export const metadata: Metadata = {
  title: "Services — Madbak",
  description: "Web design, frontend development, motion, interaction, and creative direction by Madbak.",
};

export default function Page() {
  return <ServicesPage />;
}
