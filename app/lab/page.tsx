import type { Metadata } from "next";

import { JsonLd } from "../components/seo/JsonLd";
import { MadlabShell } from "./MadlabShell";
import { MadlabComponentGallery } from "./components/MadlabComponentGallery";
import { MadlabFeaturedExperiments } from "./components/MadlabFeaturedExperiments";
import { MadlabHero } from "./components/MadlabHero";
import { MadlabLibrarySidebar } from "./components/MadlabLibrarySidebar";
import { MadlabManifesto } from "./components/MadlabManifesto";
import {
  MADLAB_CATEGORIES,
  getMadlabEntries,
  type MadlabCategory,
} from "../lib/madlab";
import { absoluteUrl, DEFAULT_OG_IMAGE_PATH, SITE_NAME } from "../lib/site";

const LAB_TITLE = "MADLAB — Creative Development Experiments | MADBAK";
const LAB_DESCRIPTION =
  "MADLAB is MADBAK’s creative development lab: interactive React, Next.js, GSAP, Three.js and WebGL experiments with working previews and implementation notes.";

export const metadata: Metadata = {
  title: { absolute: LAB_TITLE },
  description: LAB_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/lab") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/lab"),
    siteName: SITE_NAME,
    title: LAB_TITLE,
    description: LAB_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        alt: "MADLAB — MADBAK Experimental Development Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: LAB_TITLE,
    description: LAB_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
            <MadlabFeaturedExperiments />
            <MadlabComponentGallery />
            <MadlabManifesto />
          </div>
        </div>
      </main>
    </MadlabShell>
  );
}
