import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../../works-theme.css";
import { JsonLd } from "../../../components/seo/JsonLd";
import { WorksPageShell } from "../../../components/works/WorksPageShell";
import { WorksThemeScript } from "../../../components/works/WorksThemeScript";
import { buildWebsiteProjectJsonLd, buildWebsiteProjectMetadata } from "../../../lib/seo";
import {
  WEB_PROJECT_SLUGS,
  getWebsiteProject,
  getWorkCategory,
} from "../../../lib/works-categories";

type PageProps = {
  params: Promise<{ slug: string; project: string }>;
};

/** Only website projects have detail pages. */
export const dynamicParams = false;

export function generateStaticParams() {
  return WEB_PROJECT_SLUGS.map((project) => ({ slug: "websites", project }));
}

function resolve(slug: string, projectSlug: string) {
  if (slug !== "websites") return undefined;
  return getWebsiteProject(projectSlug, "en");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, project } = await params;
  const entry = resolve(slug, project);
  if (!entry) return { title: "Not found" };
  return buildWebsiteProjectMetadata(entry.project);
}

export default async function WebsiteProjectRoute({ params }: PageProps) {
  const { slug, project } = await params;
  const entry = resolve(slug, project);
  const category = getWorkCategory(slug);
  if (!entry || !category) notFound();

  return (
    <div className="works-theme-root" suppressHydrationWarning>
      <WorksThemeScript />
      <JsonLd data={buildWebsiteProjectJsonLd(entry.project)} />
      <WorksPageShell category={category} projectSlug={entry.project.slug} />
    </div>
  );
}
