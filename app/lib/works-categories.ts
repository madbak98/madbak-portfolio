import { NFT_ITEMS, PROJECTS, type LangKey } from "./portfolio-data";

export type WorkCategorySlug =
  | "websites"
  | "character-design"
  | "ai-influencer"
  | "nft-collection";

export type LocalizedText = Record<LangKey, string>;

export type WorkCategory = {
  slug: WorkCategorySlug;
  index: string;
  href: string;
  accent: string;
  foreground: string;
  muted: string;
  marqueeText: LocalizedText;
  marqueeBackground: string;
  marqueeTextColor: string;
  dividerColor: string;
  eyebrow: LocalizedText;
  titleLines: Record<LangKey, string[]>;
  shortTitle: LocalizedText;
  menuLabel: LocalizedText;
  menuDescriptor: LocalizedText;
  description: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
};

export const WEB_PROJECTS = [
  {
    title: "SIGMAA.PRO",
    href: "https://sigmaa.pro",
    images: [
      "/projects/sigmaa/home-hero.jpg",
      "/projects/sigmaa/capabilities.jpg",
      "/projects/sigmaa/system.jpg",
      "/projects/sigmaa/network.jpg",
    ],
    imageAlts: [
      "SIGMAA.PRO homepage — finance and Web3 growth infrastructure hero",
      "SIGMAA.PRO capabilities — service routes for growth, KOLs, and marketing",
      "SIGMAA.PRO system overview — growth infrastructure network",
      "SIGMAA.PRO network — the people and operators behind Sigma",
    ],
    label: {
      en: "Website in development",
      fa: "وب‌سایت در حال توسعه",
    },
    liveLabel: {
      en: "Live Website",
      fa: "وب‌سایت زنده",
    },
    platformLabel: {
      en: "Web3 growth platform",
      fa: "پلتفرم رشد Web3",
    },
    description: {
      en: "A future web direction — calm, tactile, and built for immersive storytelling.",
      fa: "یک مسیر وب‌محور برای آینده — آرام، لمسی و ساخته‌شده برای روایت غوطه‌ور.",
    },
  },
  {
    title: "ART GALLERY",
    href: "https://muse-24-art-gallery.vercel.app/",
    featured: true as const,
    year: "2026",
    images: [
      "/projects/art-gallery/art-gallery-home.png",
      "/projects/art-gallery/art-gallery-selected-works.png",
      "/projects/art-gallery/art-gallery-exhibition.png",
      "/projects/art-gallery/art-gallery-about.png",
      "/projects/art-gallery/art-gallery-visit.png",
    ],
    imageAlts: [
      "Art Gallery homepage with editorial typography and featured abstract artwork",
      "Art Gallery selected works section",
      "Art Gallery full-screen exhibition page",
      "Art Gallery about section",
      "Art Gallery visit and location section",
    ],
    label: {
      en: "Art Gallery / Cultural Website",
      fa: "گالری هنری / وب‌سایت فرهنگی",
    },
    liveLabel: {
      en: "Live Website",
      fa: "وب‌سایت زنده",
    },
    description: {
      en: "An editorial cultural website for MUSE / 24 — quiet typography, living archive, and present-tense looking.",
      fa: "وب‌سایت فرهنگی ادیتوریال برای MUSE / 24 — تایپوگرافی آرام، آرشیو زنده و نگاه در زمان حال.",
    },
  },
] as const;

export const WORK_CATEGORIES: WorkCategory[] = [
  {
    slug: "websites",
    index: "01",
    href: "/works/websites",
    accent: "#F4F0E8",
    foreground: "#1C1A17",
    muted: "#6E6A63",
    marqueeText: {
      en: "WEBSITES",
      fa: "وب‌سایت‌ها",
    },
    marqueeBackground: "rgba(28, 26, 23, 0.08)",
    marqueeTextColor: "#1C1A17",
    dividerColor: "rgba(28, 26, 23, 0.28)",
    eyebrow: {
      en: "01 / DIGITAL EXPERIENCES",
      fa: "۰۱ / تجربه‌های دیجیتال",
    },
    titleLines: {
      en: ["WEBSITES"],
      fa: ["وب‌سایت‌ها"],
    },
    shortTitle: {
      en: "WEBSITES",
      fa: "وب‌سایت‌ها",
    },
    menuLabel: {
      en: "WEBSITES",
      fa: "وب‌سایت‌ها",
    },
    menuDescriptor: {
      en: "Digital products and interactive experiences",
      fa: "محصولات دیجیتال و تجربه‌های تعاملی",
    },
    description: {
      en: "Selected digital products, interactive experiences, and web platforms designed through strategy, identity, motion, and code.",
      fa: "مجموعه‌ای منتخب از محصولات دیجیتال، تجربه‌های تعاملی و پلتفرم‌های وب که با ترکیب استراتژی، هویت بصری، موشن و کدنویسی طراحی شده‌اند.",
    },
    metaTitle: {
      en: "Web Design & Frontend Development Projects",
      fa: "پروژه‌های طراحی وب و توسعه فرانت‌اند",
    },
    metaDescription: {
      en: "Selected websites and interactive digital products designed and developed by Madbak using modern frontend technologies, motion, visual identity, and creative direction.",
      fa: "مجموعه‌ای از پروژه‌های طراحی وب‌سایت و توسعه فرانت‌اند MADBAK با تمرکز بر تجربه تعاملی، موشن، هویت بصری و فناوری‌های مدرن وب.",
    },
  },
  {
    slug: "character-design",
    index: "02",
    href: "/works/character-design",
    accent: "#33FF00",
    foreground: "#0A0A0A",
    muted: "rgba(0, 0, 0, 0.68)",
    marqueeText: {
      en: "CHARACTER DESIGN",
      fa: "طراحی کاراکتر",
    },
    marqueeBackground: "rgba(22, 125, 0, 0.38)",
    marqueeTextColor: "#d9ffcc",
    dividerColor: "rgba(0, 0, 0, 0.42)",
    eyebrow: {
      en: "02 / CHARACTER SYSTEMS",
      fa: "۰۲ / سیستم‌های کاراکتر",
    },
    titleLines: {
      en: ["CHARACTER", "DESIGN"],
      fa: ["طراحی", "کاراکتر"],
    },
    shortTitle: {
      en: "CHARACTER DESIGN",
      fa: "طراحی کاراکتر",
    },
    menuLabel: {
      en: "CHARACTER DESIGN",
      fa: "طراحی کاراکتر",
    },
    menuDescriptor: {
      en: "Characters and visual systems",
      fa: "کاراکترها و سیستم‌های بصری",
    },
    description: {
      en: "Character exploration, styling, silhouettes, visual identity, and narrative development.",
      fa: "کاوش شخصیت، استایل‌پردازی، طراحی سیلوئت، هویت بصری و توسعه روایت.",
    },
    metaTitle: {
      en: "Character Design & Visual Development",
      fa: "طراحی کاراکتر و توسعه بصری",
    },
    metaDescription: {
      en: "Character design and visual development by Madbak — exploration of styling, silhouettes, identity systems, and narrative illustration for digital characters.",
      fa: "طراحی کاراکتر و توسعه بصری MADBAK؛ کاوش استایل، سیلوئت، سیستم هویت و تصویرسازی روایی برای شخصیت‌های دیجیتال.",
    },
  },
  {
    slug: "ai-influencer",
    index: "03",
    href: "/works/ai-influencer",
    accent: "#ff00cc",
    foreground: "#0A0A0A",
    muted: "rgba(0, 0, 0, 0.68)",
    marqueeText: {
      en: "PINK ARMY",
      fa: "PINK ARMY",
    },
    marqueeBackground: "rgba(180, 0, 95, 0.28)",
    marqueeTextColor: "#ff9bd5",
    dividerColor: "rgba(0, 0, 0, 0.2)",
    eyebrow: {
      en: "03 / SYNTHETIC PERSONA",
      fa: "۰۳ / پرسونای مصنوعی",
    },
    titleLines: {
      en: ["AI", "INFLUENCER"],
      fa: ["اینفلوئنسر", "هوش مصنوعی"],
    },
    shortTitle: {
      en: "AI INFLUENCER",
      fa: "اینفلوئنسر هوش مصنوعی",
    },
    menuLabel: {
      en: "AI INFLUENCER",
      fa: "اینفلوئنسر هوش مصنوعی",
    },
    menuDescriptor: {
      en: "Synthetic personas and digital identities",
      fa: "پرسوناهای مصنوعی و هویت‌های دیجیتال",
    },
    description: {
      en: "Digital persona design, generative visual direction, character consistency, and identity systems for synthetic talent.",
      fa: "طراحی پرسونای دیجیتال، هدایت بصری مولد، حفظ انسجام کاراکتر و ساخت سیستم هویت برای استعدادهای مصنوعی.",
    },
    metaTitle: {
      en: "AI Influencer & Digital Persona Design",
      fa: "اینفلوئنسر هوش مصنوعی و طراحی پرسونای دیجیتال",
    },
    metaDescription: {
      en: "Pink Army and related AI influencer work by Madbak — digital persona design, generative look development, and campaign imagery for synthetic talent.",
      fa: "پروژه Pink Army و کارهای مرتبط اینفلوئنسر هوش مصنوعی MADBAK؛ طراحی پرسونای دیجیتال، توسعه ظاهر مولد و تصویرسازی کمپین.",
    },
  },
  {
    slug: "nft-collection",
    index: "04",
    href: "/works/nft-collection",
    accent: "#00CCFF",
    foreground: "#050505",
    muted: "rgba(0, 0, 0, 0.68)",
    marqueeText: {
      en: "NFT COLLECTION",
      fa: "مجموعه NFT",
    },
    marqueeBackground: "rgba(0, 105, 135, 0.34)",
    marqueeTextColor: "#c9f7ff",
    dividerColor: "rgba(0, 0, 0, 0.42)",
    eyebrow: {
      en: "04 / ON-CHAIN EDITIONS",
      fa: "۰۴ / نسخه‌های آن‌چین",
    },
    titleLines: {
      en: ["NFT", "COLLECTION"],
      fa: ["مجموعه", "NFT"],
    },
    shortTitle: {
      en: "NFT COLLECTION",
      fa: "مجموعه NFT",
    },
    menuLabel: {
      en: "NFT COLLECTION",
      fa: "مجموعه NFT",
    },
    menuDescriptor: {
      en: "On-chain digital editions",
      fa: "نسخه‌های دیجیتال آن‌چین",
    },
    description: {
      en: "Digital editions, collectible visual systems, and experimental on-chain artwork.",
      fa: "نسخه‌های دیجیتال، سیستم‌های بصری کلکسیونی و آثار هنری تجربی مبتنی بر بلاکچین.",
    },
    metaTitle: {
      en: "NFT Art & Digital Collection",
      fa: "هنر NFT و مجموعه دیجیتال",
    },
    metaDescription: {
      en: "Madbak’s NFT art collection on Foundation — independent 1/1 digital editions spanning character-led collectible artwork and experimental on-chain visuals.",
      fa: "مجموعه هنر NFT MADBAK در Foundation؛ نسخه‌های دیجیتال ۱/۱ مستقل با تمرکز بر آثار کلکسیونی کاراکترمحور و تصویرسازی آن‌چین.",
    },
  },
];

export function getWorkCategory(slug: string): WorkCategory | undefined {
  return WORK_CATEGORIES.find((category) => category.slug === slug);
}

export function getNextWorkCategory(slug: WorkCategorySlug): WorkCategory {
  const index = WORK_CATEGORIES.findIndex((category) => category.slug === slug);
  return WORK_CATEGORIES[(index + 1) % WORK_CATEGORIES.length]!;
}

export function getCharacterProject() {
  return PROJECTS.find((project) => project.id === "01")!;
}

export function getInfluencerProject() {
  return PROJECTS.find((project) => project.id === "02")!;
}

export function getNftItems() {
  return NFT_ITEMS;
}

export const WORK_CATEGORY_SLUGS = WORK_CATEGORIES.map((category) => category.slug);

export type ArchiveLayout =
  | "lead-grid"
  | "art-board"
  | "editorial-five"
  | "collection-wall";

export type ArchiveProject = {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
  category: string;
  year: string;
  status: string;
  href?: string;
  description?: string;
  images: readonly string[];
  imageAlts?: readonly string[];
  external?: boolean;
  layout: ArchiveLayout;
  fit?: "contain" | "cover";
  featured?: boolean;
};

export function getArchiveProjects(
  slug: WorkCategorySlug,
  lang: LangKey,
): ArchiveProject[] {
  if (slug === "websites") {
    return WEB_PROJECTS.map((project, i) => ({
      id: `web-${i + 1}`,
      index: String(i + 1).padStart(2, "0"),
      title: project.title,
      category:
        "platformLabel" in project
          ? project.platformLabel[lang]
          : project.label[lang],
      year: "year" in project && project.year ? project.year : "2026",
      status:
        "featured" in project && project.featured
          ? project.liveLabel[lang]
          : project.label[lang],
      href: project.href,
      description: project.description[lang],
      images: project.images,
      imageAlts: "imageAlts" in project ? project.imageAlts : undefined,
      external: true,
      layout: "lead-grid" as const,
      fit: "cover" as const,
    }));
  }

  if (slug === "character-design") {
    const project = getCharacterProject();
    const images = project.images?.length ? project.images : [project.image];
    return [
      {
        id: project.id,
        index: "01",
        title: project.langs[lang]?.title ?? "YOUNG MI",
        category: project.langs[lang]?.cat ?? "Character series",
        year: project.year,
        status:
          lang === "fa" ? "مطالعه کاراکتر" : "Character study",
        description: project.langs[lang]?.desc,
        images,
        external: false,
        layout: "art-board",
        fit: "cover",
      },
    ];
  }

  if (slug === "ai-influencer") {
    const project = getInfluencerProject();
    const images = project.images?.length ? project.images : [project.image];
    return [
      {
        id: project.id,
        index: "01",
        title: project.langs[lang]?.title ?? "PINK ARMY",
        category: project.langs[lang]?.cat ?? "AI influencer",
        year: project.year,
        status:
          lang === "fa" ? "هویت متحرک" : "Moving identity",
        description: project.langs[lang]?.desc,
        images,
        external: false,
        layout: "editorial-five",
        fit: "cover",
      },
    ];
  }

  // Featured NFT: Puffer Hustler (first edition) — remaining form the wall
  return getNftItems().map((nft, i) => ({
    id: nft.id,
    index: String(i + 1).padStart(2, "0"),
    title: nft.langs[lang]?.title ?? nft.sys,
    category: nft.langs[lang]?.cat ?? "1/1 Edition",
    year: nft.year,
    status: nft.platform,
    href: nft.href,
    images: [nft.image],
    external: true,
    layout: "collection-wall" as const,
    fit: "cover" as const,
    featured: i === 0,
  }));
}

export function getArchiveIntro(
  slug: WorkCategorySlug,
  lang: LangKey,
  t: (key: keyof (typeof import("./portfolio-data").TRANSLATIONS)["en"]) => string,
): { heading: [string, string]; description: string } {
  switch (slug) {
    case "websites":
      return {
        heading: [t("works_selected_digital"), t("works_digital_works")],
        description: t("works_archive_websites_desc"),
      };
    case "character-design":
      return {
        heading: [
          t("works_archive_character_heading_1"),
          t("works_archive_character_heading_2"),
        ],
        description: t("works_archive_character_desc"),
      };
    case "ai-influencer":
      return {
        heading: [
          t("works_archive_influencer_heading_1"),
          t("works_archive_influencer_heading_2"),
        ],
        description: t("works_archive_influencer_desc"),
      };
    case "nft-collection":
    default:
      return {
        heading: [t("works_archive_nft_heading_1"), t("works_archive_nft_heading_2")],
        description: t("works_archive_nft_desc"),
      };
  }
}
