import type { LangKey } from "../../lib/portfolio-data";
import type { WorkCategory } from "../../lib/works-categories";
import { CategoryNextNav, WorksCategoryHero } from "./WorksCategoryChrome";
import { WorksCategoryShowcase } from "./WorksCategoryShowcase";

export function WorksCategoryPage({
  category,
  lang = "en",
}: {
  category: WorkCategory;
  lang?: LangKey;
}) {
  return (
    <main style={{ backgroundColor: category.accent, color: category.foreground }}>
      <WorksCategoryHero category={category} lang={lang} />
      <WorksCategoryShowcase slug={category.slug} category={category} lang={lang} />
      <CategoryNextNav category={category} lang={lang} />
    </main>
  );
}
