import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../works-theme.css";
import { JsonLd } from "../../components/seo/JsonLd";
import { WorksPageShell } from "../../components/works/WorksPageShell";
import { WorksThemeScript } from "../../components/works/WorksThemeScript";
import { isThemedCategory } from "../../components/works/works-theme";
import {
  buildCategoryMetadata,
  buildCollectionPageJsonLd,
} from "../../lib/seo";
import {
  WORK_CATEGORY_SLUGS,
  getWorkCategory,
  type WorkCategorySlug,
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
    return { title: "Not found" };
  }

  return buildCategoryMetadata(category.slug, "en");
}

export default async function WorkCategoryRoute({ params }: PageProps) {
  const { slug } = await params;
  const category = getWorkCategory(slug);
  if (!category) notFound();

  const content = (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          slug: category.slug as WorkCategorySlug,
          lang: "en",
        })}
      />
      <WorksPageShell category={category} />
    </>
  );

  if (!isThemedCategory(category)) return content;

  return (
    <div className="works-theme-root" suppressHydrationWarning>
      <WorksThemeScript />
      {content}
    </div>
  );
}
