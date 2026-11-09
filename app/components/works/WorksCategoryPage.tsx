import { TRANSLATIONS, type LangKey } from "../../lib/portfolio-data";
import type { WorkCategory } from "../../lib/works-categories";
import { CategoryNextNav, WorksCategoryHero } from "./WorksCategoryChrome";
import { WorksCategoryShowcase } from "./WorksCategoryShowcase";
import { WorksThemeToggle } from "./WorksThemeToggle";
import { isThemedCategory } from "./works-theme";

export function WorksCategoryPage({
  category,
  lang = "en",
}: {
  category: WorkCategory;
  lang?: LangKey;
}) {
  const t = (key: keyof (typeof TRANSLATIONS)["en"]) =>
    TRANSLATIONS[lang][key] ?? String(key);

  return (
    <main style={{ backgroundColor: category.accent, color: category.foreground }}>
      <WorksCategoryHero
        category={category}
        lang={lang}
        t={t}
        actions={isThemedCategory(category) ? <WorksThemeToggle lang={lang} /> : null}
      />
      <WorksCategoryShowcase slug={category.slug} category={category} lang={lang} t={t} />
      <CategoryNextNav category={category} lang={lang} t={t} />
    </main>
  );
}
