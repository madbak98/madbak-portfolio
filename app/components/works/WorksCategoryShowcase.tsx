"use client";

import { TRANSLATIONS, type LangKey } from "../../lib/portfolio-data";
import type { WorkCategory, WorkCategorySlug } from "../../lib/works-categories";
import { ProjectMarquee } from "../ProjectMarquee";
import { WorksArchiveIntro, WorksArchiveList } from "./WorksArchive";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

export function WorksCategoryShowcase({
  slug,
  category,
  lang,
  t,
}: {
  slug: WorkCategorySlug;
  category: WorkCategory;
  lang: LangKey;
  t: TFn;
}) {
  return (
    <section style={{ backgroundColor: category.accent, color: category.foreground }}>
      <WorksArchiveIntro category={category} lang={lang} t={t} />
      <WorksArchiveList slug={slug} category={category} lang={lang} t={t} />
      <div className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <ProjectMarquee
            text={category.marqueeText[lang]}
            accessibleLabel={category.shortTitle[lang]}
            stripBackground={category.marqueeBackground}
            textColor={category.marqueeTextColor}
            dividerColor={category.dividerColor}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}
