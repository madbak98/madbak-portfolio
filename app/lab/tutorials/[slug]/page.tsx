import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MadlabShell } from "../../MadlabShell";
import { REACT_BITS_FREE_ITEMS, getReactBitsFreeItem } from "../../../lib/react-bits-free";
import MadlabTutorialClient from "../MadlabTutorialClient";

type TutorialPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return REACT_BITS_FREE_ITEMS.map((item) => ({ slug: item.slug.replace(/^catalog-/, "") }));
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getReactBitsFreeItem(`catalog-${slug}`);

  if (!item) return {};

  return {
    title: `Build ${item.title} from zero. — MADLAB`,
    description: `A complete step-by-step MADLAB tutorial for building ${item.title} with React, TypeScript, and CSS.`,
  };
}

export default async function MadlabTutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const item = getReactBitsFreeItem(`catalog-${slug}`);

  if (!item) notFound();

  return (
    <MadlabShell>
      <MadlabTutorialClient item={item} />
    </MadlabShell>
  );
}
