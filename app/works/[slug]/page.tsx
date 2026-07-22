import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorksPageShell } from "../../components/works/WorksPageShell";
import {
  WORK_CATEGORY_SLUGS,
  getWorkCategory,
} from "../../lib/works-categories";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return WORK_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) {
    return { title: "Works — MADBAK" };
  }

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
    },
  };
}

export default async function WorkCategoryRoute({ params }: PageProps) {
  const { slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) notFound();

  return <WorksPageShell category={category} />;
}
