import type { MadlabEntry } from "../../lib/madlab";
import type { ReactBitsFreeItem } from "../../lib/react-bits-free";
import { MadlabCatalogDetailClient } from "./MadlabCatalogDetailClient";

export function catalogEntry(item: ReactBitsFreeItem) {
  const category: MadlabEntry["category"] = item.category === "COMPONENTS" ? "COMPONENTS" : item.category === "ANIMATIONS" ? "MOTION" : item.category === "BACKGROUNDS" ? "WEBGL" : "MOTION";

  return {
    slug: item.slug,
    number: "FREE",
    title: item.title,
    description: `${item.title} is a reusable ${item.category.toLowerCase()} reference prepared for the MADLAB library. Explore the live behavior, understand the implementation, and take the source into your own project.`,
    category,
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    difficulty: "Intermediate" as const,
    estimatedTime: "30–90 minutes",
    publishedAt: "2026-07-27",
    status: "Preview" as const,
    sourceAvailable: true,
  };
}

export function MadlabCatalogDetail({ item }: { item: ReactBitsFreeItem }) {
  const entry = catalogEntry(item);
  return <MadlabCatalogDetailClient item={item} entry={entry} />;
}
