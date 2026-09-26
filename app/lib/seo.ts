import type { Metadata } from "next";

import type { LangKey } from "./portfolio-data";
import type { WorkCategorySlug } from "./works-categories";
import {
  absoluteUrl,
  CONTENT_UPDATED_AT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  getProfileImageUrl,
  getSameAsProfiles,
  PERSON_ALTERNATE_NAME,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
} from "./site";

export type PageSeoCopy = {
  /** Segment used with the root title template (`%s — Madbak`). Home uses absolute instead. */
  title: string;
  description: string;
  keywords?: string[];
};

/** Full document titles including brand — used for absolute metadata + client updates. */
export const HOME_SEO: Record<LangKey, PageSeoCopy> = {
  en: {
    title: "MADBAK — Creative Developer & Web Designer",
    description:
      "Babak Ravanbakhsh is a creative developer and web designer based in Istanbul, building interactive websites, digital experiences and creative technology projects.",
    keywords: [
      "creative developer",
      "frontend developer",
      "web designer",
      "interactive websites",
      "Next.js developer",
      "digital experiences",
      "MADBAK",
      "Babak Ravanbakhsh",
      "Istanbul",
    ],
  },
  fa: {
    title: "MADBAK — توسعه‌دهنده خلاق و طراح وب",
    description:
      "بابک روان‌بخش، توسعه‌دهنده خلاق و طراح وب مستقر در استانبول؛ ساخت وب‌سایت‌های تعاملی، تجربه‌های دیجیتال و پروژه‌های فناوری خلاق.",
  },
};

/**
 * Category title segments WITHOUT the brand suffix.
 * Root layout template renders: `${title} — Madbak`
 */
export const CATEGORY_SEO: Record<
  WorkCategorySlug,
  Record<LangKey, PageSeoCopy>
> = {
  websites: {
    en: {
      title: "Web Design Projects",
      description:
        "Selected websites and interactive digital products designed and developed by Madbak using modern frontend technologies, motion, visual identity, and creative direction.",
    },
    fa: {
      title: "پروژه‌های طراحی وب",
      description:
        "مجموعه‌ای از پروژه‌های طراحی وب‌سایت و توسعه فرانت‌اند MADBAK با تمرکز بر تجربه تعاملی، موشن، هویت بصری و فناوری‌های مدرن وب.",
    },
  },
  "character-design": {
    en: {
      title: "Character Design Projects",
      description:
        "Character design and visual development by Madbak — exploration of styling, silhouettes, identity systems, and narrative illustration for digital characters.",
    },
    fa: {
      title: "پروژه‌های طراحی کاراکتر",
      description:
        "طراحی کاراکتر و توسعه بصری MADBAK؛ کاوش استایل، سیلوئت، سیستم هویت و تصویرسازی روایی برای شخصیت‌های دیجیتال.",
    },
  },
  "ai-influencer": {
    en: {
      title: "AI Influencer Projects",
      description:
        "Pink Army and related AI influencer work by Madbak — digital persona design, generative look development, and campaign imagery for synthetic talent.",
    },
    fa: {
      title: "پروژه‌های اینفلوئنسر هوش مصنوعی",
      description:
        "پروژه Pink Army و کارهای مرتبط اینفلوئنسر هوش مصنوعی MADBAK؛ طراحی پرسونای دیجیتال، توسعه ظاهر مولد و تصویرسازی کمپین.",
    },
  },
  "nft-collection": {
    en: {
      title: "NFT Collection Projects",
      description:
        "Madbak’s NFT art collection on Foundation — independent 1/1 digital editions spanning character-led collectible artwork and experimental on-chain visuals.",
    },
    fa: {
      title: "پروژه‌های مجموعه NFT",
      description:
        "مجموعه هنر NFT MADBAK در Foundation؛ نسخه‌های دیجیتال ۱/۱ مستقل با تمرکز بر آثار کلکسیونی کاراکترمحور و تصویرسازی آن‌چین.",
    },
  },
};

const CATEGORY_OG_IMAGE: Record<WorkCategorySlug, string> = {
  websites: "/projects/sigmaa/home-hero.jpg",
  "character-design":
    "https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large",
  "ai-influencer":
    "https://github.com/madbak98/My-image/blob/main/6fe54cd9-9cce-492c-ba0c-e6438d486fff.png?raw=true",
  "nft-collection":
    "https://ipfs.foundation.app/ipfs/QmSawSnoD6YG6jP1ot8WhoZFcaS12tjE587y9QSJK2F1XD/nft.jpg",
};

export const ABOUT_SEO: Record<LangKey, PageSeoCopy> = {
  en: {
    title: "About — MADBAK",
    description:
      "About Babak Ravanbakhsh, a creative developer and frontend developer based in Istanbul, working across design, code, motion and interactive digital experiences.",
  },
  fa: {
    title: "درباره — MADBAK",
    description:
      "درباره بابک روان‌بخش؛ توسعه‌دهنده خلاق و فرانت‌اند مستقر در استانبول، فعال در طراحی، کد، موشن و تجربه‌های دیجیتال تعاملی.",
  },
};

export const SERVICES_SEO: Record<LangKey, PageSeoCopy> = {
  en: {
    title: "Services — Web Design & Creative Development | MADBAK",
    description:
      "Web design, frontend development, motion, interaction, and creative direction packages by Babak Ravanbakhsh (MADBAK), based in Istanbul.",
  },
  fa: {
    title: "خدمات — طراحی وب و توسعه خلاق | MADBAK",
    description:
      "بسته‌های طراحی وب، توسعه فرانت‌اند، موشن، تعامل و کارگردانی خلاق توسط بابک روان‌بخش (MADBAK)، مستقر در استانبول.",
  },
};

const OG_LOCALE: Record<LangKey, string> = {
  en: "en_US",
  fa: "fa_IR",
};

const INDEXABLE_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

function brandSuffix(lang: LangKey): string {
  return lang === "fa" ? " — MADBAK" : ` — ${SITE_NAME}`;
}

export function withBrandTitle(segment: string, lang: LangKey): string {
  if (
    segment.includes("— Madbak") ||
    segment.includes("— MADBAK") ||
    segment.includes("— MADBAK") ||
    segment.startsWith("Madbak —") ||
    segment.startsWith("MADBAK —") ||
    segment.startsWith("MADBAK —")
  ) {
    return segment;
  }
  return `${segment}${brandSuffix(lang)}`;
}

/**
 * Locales are client-preferred (EN/FA) with no distinct URL per language.
 * Emitting identical hreflang URLs confuses crawlers — canonical only.
 * When real locale paths exist, extend this to return languages + x-default.
 */
export function languageAlternates(path: string): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(path),
  };
}

function sharedSocialMetadata({
  title,
  description,
  url,
  lang,
  imagePath = DEFAULT_OG_IMAGE_PATH,
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  lang: LangKey;
  imagePath?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter" | "robots"> {
  const imageUrl = absoluteUrl(imagePath);
  return {
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: (["en", "fa"] as LangKey[])
        .filter((code) => code !== lang)
        .map((code) => OG_LOCALE[code]),
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: INDEXABLE_ROBOTS,
  };
}

export function buildHomeMetadata(lang: LangKey = "en"): Metadata {
  const copy = HOME_SEO[lang];
  const url = absoluteUrl("/");
  const social = sharedSocialMetadata({
    title: copy.title,
    description: copy.description,
    url,
    lang,
  });

  return {
    title: { absolute: copy.title },
    description: copy.description,
    keywords: copy.keywords,
    alternates: languageAlternates("/"),
    ...social,
  };
}

export function buildAboutMetadata(lang: LangKey = "en"): Metadata {
  const copy = ABOUT_SEO[lang];
  const path = "/about";
  const url = absoluteUrl(path);
  const social = sharedSocialMetadata({
    title: copy.title,
    description: copy.description,
    url,
    lang,
    imagePath: "/about-operator.png",
  });

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: languageAlternates(path),
    ...social,
  };
}

export function buildServicesMetadata(lang: LangKey = "en"): Metadata {
  const copy = SERVICES_SEO[lang];
  const path = "/services";
  const url = absoluteUrl(path);
  const social = sharedSocialMetadata({
    title: copy.title,
    description: copy.description,
    url,
    lang,
  });

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: languageAlternates(path),
    ...social,
  };
}

export function buildCategoryMetadata(
  slug: WorkCategorySlug,
  lang: LangKey = "en",
): Metadata {
  const copy = CATEGORY_SEO[slug][lang];
  const path = `/works/${slug}`;
  const url = absoluteUrl(path);
  const fullTitle = withBrandTitle(copy.title, lang);
  const social = sharedSocialMetadata({
    title: fullTitle,
    description: copy.description,
    url,
    lang,
    imagePath: CATEGORY_OG_IMAGE[slug],
  });

  return {
    title: lang === "en" ? copy.title : { absolute: fullTitle },
    description: copy.description,
    keywords: copy.keywords,
    alternates: languageAlternates(path),
    ...social,
  };
}

export function documentTitleForPath(path: string, lang: LangKey): string {
  if (path === "/" || path === "") return HOME_SEO[lang].title;
  if (path === "/about") return ABOUT_SEO[lang].title;
  if (path === "/services") return SERVICES_SEO[lang].title;
  const match = path.match(/^\/works\/([^/?#]+)/);
  if (match?.[1] && match[1] in CATEGORY_SEO) {
    return withBrandTitle(
      CATEGORY_SEO[match[1] as WorkCategorySlug][lang].title,
      lang,
    );
  }
  return HOME_SEO[lang].title;
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: ["MADBAK", "Madbak Portfolio"],
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: ["en", "fa"],
  };
}

export function buildPersonJsonLd() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON_NAME,
    alternateName: PERSON_ALTERNATE_NAME,
    url: `${SITE_URL}/`,
    jobTitle: ["Creative Developer", "Frontend Developer", "Web Designer"],
    image: getProfileImageUrl(),
    sameAs: getSameAsProfiles(),
    knowsAbout: [
      "Frontend Development",
      "Web Design",
      "Next.js",
      "React",
      "TypeScript",
      "UI/UX Design",
      "Creative Direction",
      "Motion Design",
      "Interactive Web Experiences",
    ],
    homeLocation: {
      "@type": "Place",
      name: "Istanbul, Türkiye",
    },
  };
}

export function buildProfilePageJsonLd() {
  const copy = HOME_SEO.en;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: `${SITE_URL}/`,
    name: copy.title,
    dateModified: CONTENT_UPDATED_AT.toISOString(),
    mainEntity: buildPersonJsonLd(),
  };
}

export function buildAboutPageJsonLd(lang: LangKey = "en") {
  const copy = ABOUT_SEO[lang];
  const url = absoluteUrl("/about");
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#about`,
    url,
    name: copy.title,
    description: copy.description,
    inLanguage: lang,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export function buildServicesPageJsonLd(lang: LangKey = "en") {
  const copy = SERVICES_SEO[lang];
  const url = absoluteUrl("/services");
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: copy.title,
    description: copy.description,
    inLanguage: lang,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildCollectionPageJsonLd({
  slug,
  lang = "en",
}: {
  slug: WorkCategorySlug;
  lang?: LangKey;
}) {
  const copy = CATEGORY_SEO[slug][lang];
  const path = `/works/${slug}`;
  const fullTitle = withBrandTitle(copy.title, lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(path)}#collection`,
      url: absoluteUrl(path),
      name: fullTitle,
      description: copy.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      inLanguage: lang,
    },
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: fullTitle, path },
    ]),
  ];
}

export function homeJsonLdGraph() {
  return [buildWebsiteJsonLd(), buildProfilePageJsonLd()];
}

export const SITEMAP_ROUTES: {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/lab", changeFrequency: "weekly", priority: 0.95 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/works/websites", changeFrequency: "monthly", priority: 0.9 },
  {
    path: "/works/character-design",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/works/ai-influencer",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/works/nft-collection",
    changeFrequency: "monthly",
    priority: 0.85,
  },
];
