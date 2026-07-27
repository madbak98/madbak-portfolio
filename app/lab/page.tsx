import type { Metadata } from "next";

import { JsonLd } from "../components/seo/JsonLd";
import { MadlabShell } from "./MadlabShell";
import { MadlabComponentGallery } from "./components/MadlabComponentGallery";
import { MadlabHero } from "./components/MadlabHero";
import { MadlabLibrarySidebar } from "./components/MadlabLibrarySidebar";
import { MadlabManifesto } from "./components/MadlabManifesto";
import {
  MADLAB_CATEGORIES,
  getMadlabEntries,
  type MadlabCategory,
} from "../lib/madlab";
import { absoluteUrl } from "../lib/site";

export const metadata: Metadata = {
  title: "MADLAB — Interactive Components & Creative Development Experiments",
  description: "Explore interactive React, Next.js, GSAP, Three.js and WebGL components built and explained by MADBAK.",
  alternates: { canonical: absoluteUrl("/lab") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/lab"),
    title: "MADLAB — Interactive Components & Creative Development Experiments",
    description: "Explore interactive React, Next.js, GSAP, Three.js and WebGL components built and explained by MADBAK.",
    images: [{ url: absoluteUrl("/og-default.png"), alt: "MADLAB — MADBAK Experimental Development Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MADLAB — Interactive Components & Creative Development Experiments",
    description: "Explore interactive React, Next.js, GSAP, Three.js and WebGL components built and explained by MADBAK.",
    images: [absoluteUrl("/og-default.png")],
  },
};

type MadlabPageProps = {
  searchParams: Promise<{ category?: string }>;
};

function validCategory(value?: string): MadlabCategory {
  return MADLAB_CATEGORIES.includes(value as MadlabCategory)
    ? (value as MadlabCategory)
    : "ALL";
}

function madlabJsonLd(entries: ReturnType<typeof getMadlabEntries>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/lab")}#collection`,
    name: "MADLAB — MADBAK Experimental Development Lab",
    description: "Interactive React, Next.js, GSAP, Three.js and WebGL components built and explained by MADBAK.",
    url: absoluteUrl("/lab"),
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: entries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: absoluteUrl(`/lab/${entry.slug}`),
      })),
    },
  };
}

export default async function MadlabPage({ searchParams }: MadlabPageProps) {
  const category = validCategory((await searchParams).category);
  const entries = getMadlabEntries(category);

  return (
    <MadlabShell>
      <JsonLd data={madlabJsonLd(entries)} />
      <main>
        <MadlabHero />
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
          <MadlabLibrarySidebar />
          <div className="min-w-0">
            <MadlabComponentGallery />
            <MadlabManifesto />
          </div>
        </div>
      </main>
    </MadlabShell>
  );
}
