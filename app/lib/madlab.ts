export const MADLAB_CATEGORIES = [
  "ALL",
  "COMPONENTS",
  "MOTION",
  "GSAP",
  "THREE.JS",
  "WEBGL",
  "INTERACTIONS",
  "NEXT.JS",
  "EXPERIMENTS",
] as const;

export type MadlabCategory = (typeof MADLAB_CATEGORIES)[number];
export type MadlabDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type MadlabStatus = "Coming Soon" | "Draft" | "Preview" | "Published" | "Updated";

export type MadlabEntry = {
  slug: string;
  number: string;
  title: string;
  description: string;
  category: Exclude<MadlabCategory, "ALL">;
  technologies: string[];
  difficulty: MadlabDifficulty;
  estimatedTime?: string;
  publishedAt: string;
  updatedAt?: string;
  status: MadlabStatus;
  featured?: boolean;
  premium?: boolean;
  cover?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  sourceAvailable: boolean;
};

export const MADLAB_ENTRIES: MadlabEntry[] = [
  {
    slug: "cursor-grid",
    number: "001",
    title: "Cursor Grid",
    description: "A pointer-led grid study about proximity, response, and the quiet choreography between a cursor and a layout.",
    category: "COMPONENTS",
    technologies: ["React", "Pointer Events", "CSS"],
    difficulty: "Intermediate",
    estimatedTime: "2–3 hours",
    publishedAt: "2026-07-27",
    status: "Preview",
    featured: true,
    sourceAvailable: true,
  },
  {
    slug: "magnetic-button",
    number: "002",
    title: "Magnetic Button",
    description: "A restrained interaction experiment exploring attraction, release, and the feeling of weight in a small interface object.",
    category: "INTERACTIONS",
    technologies: ["React", "Motion", "Pointer Events"],
    difficulty: "Beginner",
    estimatedTime: "60–90 minutes",
    publishedAt: "2026-07-27",
    status: "Preview",
    sourceAvailable: true,
  },
  {
    slug: "infinite-marquee",
    number: "003",
    title: "Infinite Marquee",
    description: "A looping text system for building rhythm, continuity, and controlled movement without losing typographic clarity.",
    category: "MOTION",
    technologies: ["React", "CSS Motion", "Accessibility"],
    difficulty: "Beginner",
    estimatedTime: "90 minutes",
    publishedAt: "2026-07-27",
    status: "Preview",
    sourceAvailable: true,
  },
];

export function getMadlabEntry(slug: string): MadlabEntry | undefined {
  return MADLAB_ENTRIES.find((entry) => entry.slug === slug);
}

export function getMadlabEntries(category?: MadlabCategory): MadlabEntry[] {
  if (!category || category === "ALL") return MADLAB_ENTRIES;
  return MADLAB_ENTRIES.filter((entry) => entry.category === category);
}

export function getRelatedMadlabEntries(entry: MadlabEntry, limit = 2): MadlabEntry[] {
  return MADLAB_ENTRIES.filter((candidate) => candidate.slug !== entry.slug)
    .sort((first, second) => {
      const firstScore = first.category === entry.category ? 1 : 0;
      const secondScore = second.category === entry.category ? 1 : 0;
      return secondScore - firstScore || first.number.localeCompare(second.number);
    })
    .slice(0, limit);
}

export function formatMadlabDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
