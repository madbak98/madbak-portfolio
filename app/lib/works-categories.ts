import { NFT_ITEMS, PROJECTS, type LangKey } from "./portfolio-data";

export type WorkCategorySlug =
  | "websites"
  | "character-design"
  | "ai-influencer"
  | "nft-collection";

export type WorkCategory = {
  slug: WorkCategorySlug;
  index: string;
  href: string;
  accent: string;
  foreground: string;
  muted: string;
  marqueeText: string;
  marqueeBackground: string;
  marqueeTextColor: string;
  dividerColor: string;
  eyebrow: Record<LangKey, string>;
  titleLines: Record<LangKey, string[]>;
  shortTitle: Record<LangKey, string>;
  menuLabel: Record<LangKey, string>;
  menuDescriptor: Record<LangKey, string>;
  description: Record<LangKey, string>;
  metaTitle: string;
  metaDescription: string;
};

export const WEB_PROJECTS = [
  {
    title: "SIGMAA.PRO",
    href: "https://sigmaa.pro",
    images: [
      "/projects/sigmaa/home.png",
      "/projects/sigmaa/regions.png",
      "/projects/sigmaa/system.png",
      "/projects/sigmaa/insights.png",
    ],
    label: {
      en: "Website in development",
      fa: "نمونه وب‌سایت در حال ساخت",
      tr: "Geliştirme aşamasındaki web sitesi",
    },
    description: {
      en: "A future web direction — calm, tactile, and built for immersive storytelling.",
      fa: "یک مسیر وب‌محور برای آینده — آرام، لمسی و ساخته‌شده برای روایت غوطه‌ور.",
      tr: "Gelecekteki web yönü — sakin, dokunsal ve sürükleyici anlatı için tasarlandı.",
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
      tr: "Sanat Galerisi / Kültürel Web Sitesi",
    },
    liveLabel: {
      en: "Live Website",
      fa: "وب‌سایت زنده",
      tr: "Canlı Site",
    },
    description: {
      en: "An editorial cultural website for MUSE / 24 — quiet typography, living archive, and present-tense looking.",
      fa: "وب‌سایت فرهنگی ادیتوریال برای MUSE / 24 — تایپوگرافی آرام، آرشیو زنده و نگاه در زمان حال.",
      tr: "MUSE / 24 için editoryal bir kültürel site — sakin tipografi, yaşayan arşiv ve şimdiki zamana bakış.",
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
    marqueeText: "WEBSITES",
    marqueeBackground: "rgba(28, 26, 23, 0.08)",
    marqueeTextColor: "#1C1A17",
    dividerColor: "rgba(28, 26, 23, 0.28)",
    eyebrow: {
      en: "01 / DIGITAL EXPERIENCES",
      fa: "۰۱ / تجربه‌های دیجیتال",
      tr: "01 / DİJİTAL DENEYİMLER",
    },
    titleLines: {
      en: ["WEBSITES"],
      fa: ["وب‌سایت‌ها"],
      tr: ["WEBSITES"],
    },
    shortTitle: {
      en: "WEBSITES",
      fa: "وب‌سایت‌ها",
      tr: "WEBSITES",
    },
    menuLabel: {
      en: "WEBSITES",
      fa: "وب‌سایت‌ها",
      tr: "WEBSITES",
    },
    menuDescriptor: {
      en: "Interactive products & platforms",
      fa: "محصولات و پلتفرم‌های تعاملی",
      tr: "Etkileşimli ürünler ve platformlar",
    },
    description: {
      en: "Selected digital products, interactive experiences, and web platforms designed through strategy, identity, motion, and code.",
      fa: "محصولات دیجیتال منتخب، تجربه‌های تعاملی و پلتفرم‌های وب؛ طراحی‌شده با استراتژی، هویت، موشن و کد.",
      tr: "Strateji, kimlik, hareket ve kod ile tasarlanmış seçili dijital ürünler, etkileşimli deneyimler ve web platformları.",
    },
    metaTitle: "Websites — MADBAK",
    metaDescription:
      "Selected digital products, interactive experiences, and web platforms by MADBAK.",
  },
  {
    slug: "character-design",
    index: "02",
    href: "/works/character-design",
    accent: "#33FF00",
    foreground: "#0A0A0A",
    muted: "rgba(0, 0, 0, 0.68)",
    marqueeText: "CHARACTER DESIGN",
    marqueeBackground: "rgba(22, 125, 0, 0.38)",
    marqueeTextColor: "#d9ffcc",
    dividerColor: "rgba(0, 0, 0, 0.42)",
    eyebrow: {
      en: "02 / CHARACTER SYSTEMS",
      fa: "۰۲ / سیستم‌های کاراکتر",
      tr: "02 / KARAKTER SİSTEMLERİ",
    },
    titleLines: {
      en: ["CHARACTER", "DESIGN"],
      fa: ["طراحی", "کاراکتر"],
      tr: ["KARAKTER", "TASARIMI"],
    },
    shortTitle: {
      en: "CHARACTER DESIGN",
      fa: "طراحی کاراکتر",
      tr: "KARAKTER TASARIMI",
    },
    menuLabel: {
      en: "CHARACTER DESIGN",
      fa: "طراحی کاراکتر",
      tr: "KARAKTER TASARIMI",
    },
    menuDescriptor: {
      en: "Silhouettes, styling & narrative form",
      fa: "سیلوئت، استایل و فرم روایی",
      tr: "Siluet, stil ve anlatı formu",
    },
    description: {
      en: "Character exploration, styling, silhouettes, visual identity, and narrative development.",
      fa: "کاوش کاراکتر، استایل، سیلوئت، هویت بصری و توسعهٔ روایی.",
      tr: "Karakter keşfi, stil, siluet, görsel kimlik ve anlatı geliştirme.",
    },
    metaTitle: "Character Design — MADBAK",
    metaDescription:
      "Character exploration, styling, and visual identity systems by MADBAK.",
  },
  {
    slug: "ai-influencer",
    index: "03",
    href: "/works/ai-influencer",
    accent: "#ff00cc",
    foreground: "#0A0A0A",
    muted: "rgba(0, 0, 0, 0.68)",
    marqueeText: "PINK ARMY",
    marqueeBackground: "rgba(180, 0, 95, 0.28)",
    marqueeTextColor: "#ff9bd5",
    dividerColor: "rgba(0, 0, 0, 0.2)",
    eyebrow: {
      en: "03 / SYNTHETIC PERSONA",
      fa: "۰۳ / پرسونای مصنوعی",
      tr: "03 / SENTETİK PERSONA",
    },
    titleLines: {
      en: ["AI", "INFLUENCER"],
      fa: ["اینفلوئنسر", "هوش مصنوعی"],
      tr: ["YZ", "INFLUENCER"],
    },
    shortTitle: {
      en: "AI INFLUENCER",
      fa: "اینفلوئنسر AI",
      tr: "YZ INFLUENCER",
    },
    menuLabel: {
      en: "AI INFLUENCER",
      fa: "اینفلوئنسر هوش مصنوعی",
      tr: "YZ INFLUENCER",
    },
    menuDescriptor: {
      en: "Synthetic talent & digital identity",
      fa: "استعداد مصنوعی و هویت دیجیتال",
      tr: "Sentetik yetenek ve dijital kimlik",
    },
    description: {
      en: "Digital persona design, generative visual direction, character consistency, and identity systems for synthetic talent.",
      fa: "طراحی پرسونای دیجیتال، جهت‌گیری بصری تولیدی، ثبات کاراکتر و سیستم هویت برای استعداد مصنوعی.",
      tr: "Sentetik yetenek için dijital persona tasarımı, üretken görsel yön, karakter tutarlılığı ve kimlik sistemleri.",
    },
    metaTitle: "AI Influencer — MADBAK",
    metaDescription:
      "Digital persona design and generative identity systems by MADBAK.",
  },
  {
    slug: "nft-collection",
    index: "04",
    href: "/works/nft-collection",
    accent: "#00CCFF",
    foreground: "#050505",
    muted: "rgba(0, 0, 0, 0.68)",
    marqueeText: "NFT COLLECTION",
    marqueeBackground: "rgba(0, 105, 135, 0.34)",
    marqueeTextColor: "#c9f7ff",
    dividerColor: "rgba(0, 0, 0, 0.42)",
    eyebrow: {
      en: "04 / ON-CHAIN EDITIONS",
      fa: "۰۴ / نسخه‌های آن‌چین",
      tr: "04 / ZİNCİR ÜZERİ SÜRÜMLER",
    },
    titleLines: {
      en: ["NFT", "COLLECTION"],
      fa: ["کالکشن", "NFT"],
      tr: ["NFT", "COLLECTION"],
    },
    shortTitle: {
      en: "NFT COLLECTION",
      fa: "کالکشن NFT",
      tr: "NFT COLLECTION",
    },
    menuLabel: {
      en: "NFT COLLECTION",
      fa: "کالکشن NFT",
      tr: "NFT COLLECTION",
    },
    menuDescriptor: {
      en: "On-chain editions & digital art",
      fa: "نسخه‌های آن‌چین و هنر دیجیتال",
      tr: "Zincir üzeri sürümler ve dijital sanat",
    },
    description: {
      en: "Digital editions, collectible visual systems, and experimental on-chain artwork.",
      fa: "نسخه‌های دیجیتال، سیستم‌های بصری کلکسیونی و آثار آزمایشی آن‌چین.",
      tr: "Dijital sürümler, koleksiyonel görsel sistemler ve deneysel zincir üzeri sanat.",
    },
    metaTitle: "NFT Collection — MADBAK",
    metaDescription:
      "Digital editions and experimental on-chain artwork by MADBAK.",
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
