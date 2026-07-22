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
    title: "Madbak — Creative Frontend Developer & Web Designer",
    description:
      "Portfolio of Madbak, a creative frontend developer and web designer creating interactive websites, digital experiences, and motion-led projects.",
    keywords: [
      "frontend developer",
      "creative frontend developer",
      "web designer",
      "website developer",
      "frontend portfolio",
      "interactive websites",
      "Next.js developer",
      "UI UX designer",
      "digital experiences",
      "Madbak",
      "Babak Ravanbakhsh",
    ],
  },
  fa: {
    title: "مدبک — توسعه‌دهنده فرانت‌اند و طراح وب خلاق",
    description:
      "پورتفولیوی مدبک؛ توسعه‌دهنده فرانت‌اند و طراح وب با تمرکز بر وب‌سایت‌های تعاملی، تجربه‌های دیجیتال، هویت بصری و موشن.",
  },
  tr: {
    title: "Madbak — Yaratıcı Frontend Geliştirici ve Web Tasarımcısı",
    description:
      "Etkileşimli web siteleri, dijital deneyimler, görsel kimlikler ve hareket odaklı projeler geliştiren Madbak’ın frontend geliştirme ve web tasarım portfolyosu.",
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
      title: "Web Design & Frontend Development Projects",
      description:
        "Selected websites and interactive digital products designed and developed by Madbak using modern frontend technologies, motion, visual identity, and creative direction.",
    },
    fa: {
      title: "پروژه‌های طراحی وب و توسعه فرانت‌اند",
      description:
        "مجموعه‌ای از پروژه‌های طراحی وب‌سایت و توسعه فرانت‌اند مدبک با تمرکز بر تجربه تعاملی، موشن، هویت بصری و فناوری‌های مدرن وب.",
    },
    tr: {
      title: "Web Tasarım ve Frontend Geliştirme Projeleri",
      description:
        "Madbak tarafından modern frontend teknolojileri, hareket tasarımı, görsel kimlik ve yaratıcı yön ile geliştirilen seçili web projeleri.",
    },
  },
  "character-design": {
    en: {
      title: "Character Design & Visual Development",
      description:
        "Character design and visual development by Madbak — exploration of styling, silhouettes, identity systems, and narrative illustration for digital characters.",
    },
    fa: {
      title: "طراحی کاراکتر و توسعه بصری",
      description:
        "طراحی کاراکتر و توسعه بصری مدبک؛ کاوش استایل، سیلوئت، سیستم هویت و تصویرسازی روایی برای شخصیت‌های دیجیتال.",
    },
    tr: {
      title: "Karakter Tasarımı ve Görsel Geliştirme",
      description:
        "Madbak’ın karakter tasarımı ve görsel geliştirme çalışmaları — stil, siluet, kimlik sistemleri ve dijital karakterler için anlatısal illüstrasyon.",
    },
  },
  "ai-influencer": {
    en: {
      title: "AI Influencer & Digital Persona Design",
      description:
        "Pink Army and related AI influencer work by Madbak — digital persona design, generative look development, and campaign imagery for synthetic talent.",
    },
    fa: {
      title: "اینفلوئنسر هوش مصنوعی و طراحی پرسونای دیجیتال",
      description:
        "پروژه Pink Army و کارهای مرتبط اینفلوئنسر هوش مصنوعی مدبک؛ طراحی پرسونای دیجیتال، توسعه ظاهر مولد و تصویرسازی کمپین.",
    },
    tr: {
      title: "YZ Influencer ve Dijital Persona Tasarımı",
      description:
        "Madbak’ın Pink Army ve ilgili YZ influencer çalışmaları — dijital persona tasarımı, üretken görünüm geliştirme ve kampanya görselleri.",
    },
  },
  "nft-collection": {
    en: {
      title: "NFT Art & Digital Collection",
      description:
        "Madbak’s NFT art collection on Foundation — independent 1/1 digital editions spanning character-led collectible artwork and experimental on-chain visuals.",
    },
    fa: {
      title: "هنر NFT و مجموعه دیجیتال",
      description:
        "مجموعه هنر NFT مدبک در Foundation؛ نسخه‌های دیجیتال ۱/۱ مستقل با تمرکز بر آثار کلکسیونی کاراکترمحور و تصویرسازی آن‌چین.",
    },
    tr: {
      title: "NFT Sanatı ve Dijital Koleksiyon",
      description:
        "Madbak’ın Foundation üzerindeki NFT sanat koleksiyonu — karakter odaklı koleksiyonluk eserler ve deneysel zincir üstü görsellerden oluşan 1/1 edisyonlar.",
    },
  },
};

const CATEGORY_OG_IMAGE: Record<WorkCategorySlug, string> = {
  websites: "/projects/art-gallery/art-gallery-home.png",
  "character-design":
    "https://pbs.twimg.com/media/GdN7WSoXQAAgQO0?format=jpg&name=large",
  "ai-influencer":
    "https://github.com/madbak98/My-image/blob/main/6fe54cd9-9cce-492c-ba0c-e6438d486fff.png?raw=true",
  "nft-collection":
    "https://ipfs.foundation.app/ipfs/QmSawSnoD6YG6jP1ot8WhoZFcaS12tjE587y9QSJK2F1XD/nft.jpg",
};

const OG_LOCALE: Record<LangKey, string> = {
  en: "en_US",
  fa: "fa_IR",
  tr: "tr_TR",
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
  return lang === "fa" ? " — مدبک" : ` — ${SITE_NAME}`;
}

export function withBrandTitle(segment: string, lang: LangKey): string {
  if (
    segment.includes("— Madbak") ||
    segment.includes("— مدبک") ||
    segment.startsWith("Madbak —") ||
    segment.startsWith("مدبک —")
  ) {
    return segment;
  }
  return `${segment}${brandSuffix(lang)}`;
}

export function languageAlternates(path: string): Metadata["alternates"] {
  const url = absoluteUrl(path);
  return {
    canonical: url,
    languages: {
      en: url,
      fa: url,
      tr: url,
      "x-default": url,
    },
  };
}

export function buildHomeMetadata(lang: LangKey = "en"): Metadata {
  const copy = HOME_SEO[lang];
  const url = absoluteUrl("/");
  const imageUrl = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    // Absolute prevents the root template from appending " — Madbak" again.
    title: {
      absolute: copy.title,
    },
    description: copy.description,
    keywords: copy.keywords,
    alternates: languageAlternates("/"),
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.description,
      locale: OG_LOCALE[lang],
      alternateLocale: (["en", "fa", "tr"] as LangKey[])
        .filter((code) => code !== lang)
        .map((code) => OG_LOCALE[code]),
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: "Madbak portfolio — creative frontend developer and web designer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [imageUrl],
    },
    robots: INDEXABLE_ROBOTS,
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
  const imageUrl = absoluteUrl(CATEGORY_OG_IMAGE[slug]);

  return {
    // String title → root template renders `${title} — Madbak` for English SSR.
    // Absolute used for FA/TR so the localized brand suffix is preserved.
    title: lang === "en" ? copy.title : { absolute: fullTitle },
    description: copy.description,
    keywords: copy.keywords,
    alternates: languageAlternates(path),
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: copy.description,
      locale: OG_LOCALE[lang],
      alternateLocale: (["en", "fa", "tr"] as LangKey[])
        .filter((code) => code !== lang)
        .map((code) => OG_LOCALE[code]),
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: copy.description,
      images: [imageUrl],
    },
    robots: INDEXABLE_ROBOTS,
  };
}

export function documentTitleForPath(path: string, lang: LangKey): string {
  if (path === "/" || path === "") return HOME_SEO[lang].title;
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
    alternateName: "Madbak Portfolio",
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: ["en", "fa", "tr"],
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
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PERSON_NAME,
      alternateName: PERSON_ALTERNATE_NAME,
      url: `${SITE_URL}/`,
      jobTitle: [
        "Frontend Developer",
        "Web Designer",
        "Creative Developer",
      ],
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
        name: "Istanbul",
      },
    },
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
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#collection`,
    url: absoluteUrl(path),
    name: fullTitle,
    description: copy.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    inLanguage: lang,
  };
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
