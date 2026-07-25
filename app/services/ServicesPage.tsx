"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { SOCIAL_LINKS, TRANSLATIONS, type LangKey } from "../lib/portfolio-data";
import { usePreferredLang } from "../lib/locale-preference";
import { htmlLangAttr, localeCase, rootLocaleClasses, trackHeading, trackMeta } from "../lib/locale-ui";
import { MobileNavOverlay, SiteNav } from "../components/SiteNav";

type TFn = (key: keyof (typeof TRANSLATIONS)["en"]) => string;

type ServicePackage = {
  index: string;
  title: string;
  price: string;
  discountPrice?: string;
  description: string;
  includesLabel: string;
  includes: string[];
  suitableLabel: string;
  suitableFor: string;
  featured?: boolean;
};

const SERVICES: Record<LangKey, ServicePackage[]> = {
  en: [
    {
      index: "01",
      title: "Landing Page Package",
      price: "$900 – $1,400",
      description: "A focused one-page launch experience with a sharp visual direction and everything needed to go live.",
      includesLabel: "Includes",
      includes: [
        "One-page landing page design and development",
        "Modern, custom UI design",
        "Fully responsive mobile and desktop layout",
        "Simple animations and micro-interactions",
        "Contact form",
        "Vercel deployment and domain connection",
      ],
      suitableLabel: "Best for",
      suitableFor: "Startups, product launches, and advertising campaigns",
    },
    {
      index: "02",
      title: "Personal / Portfolio Website",
      price: "$1,500 – $2,200",
      description: "A personal digital home that turns your work, story, and point of view into a polished portfolio.",
      includesLabel: "Includes",
      includes: [
        "Personal or portfolio website, 4–6 pages",
        "Light visual identity direction",
        "Animation and scroll interactions",
        "Fully responsive layout",
        "Contact form",
        "Initial SEO and performance optimization",
        "Deployment and domain connection",
      ],
      suitableLabel: "Best for",
      suitableFor: "Freelancers, designers, developers, and artists",
    },
    {
      index: "03",
      title: "Business / Corporate Website",
      price: "$2,400 – $3,500",
      description: "A complete, credible website system for businesses that need clarity, trust, and room to grow.",
      includesLabel: "Includes",
      includes: [
        "Corporate website, 6–10 pages",
        "Complete UI / UX design",
        "Typography and color system",
        "Scroll animations and transitions",
        "Multilingual setup if needed",
        "Advanced forms",
        "Basic technical SEO",
        "Deployment and performance optimization",
      ],
      suitableLabel: "Best for",
      suitableFor: "Companies, agencies, clinics, and service businesses",
    },
    {
      index: "04",
      title: "Creative / Cinematic Website",
      price: "$3,800 – $5,500",
      description: "A premium, cinematic website where art direction, motion, and scroll-based storytelling work as one.",
      includesLabel: "Includes",
      includes: [
        "Cinematic and interactive website design and development",
        "Full art direction",
        "Advanced animation with GSAP / Framer Motion",
        "Scroll-based storytelling",
        "Interactive and motion-driven elements",
        "Custom, premium visual direction",
        "Performance optimization and precise responsiveness",
        "Professional deployment",
      ],
      suitableLabel: "Best for",
      suitableFor: "Creative brands, fashion, art, luxury, and advertising agencies",
      featured: true,
    },
    {
      index: "05",
      title: "Advanced Interactive / Web3 Website",
      price: "$5,800 – $8,500",
      description: "A complex interactive experience for ambitious products that need depth, motion, and a scalable technical foundation.",
      includesLabel: "Includes",
      includes: [
        "Complete design and development of a complex website",
        "Strong interactive experience with 3D / WebGL elements where appropriate",
        "Advanced art direction and motion design",
        "Multilingual and RTL support",
        "Scalable component system and structure",
        "Performance, SEO, and accessibility optimization",
        "Initial post-launch support",
      ],
      suitableLabel: "Best for",
      suitableFor: "Web3, crypto, fintech, and premium brand projects",
      featured: true,
    },
    {
      index: "06",
      title: "Full Creative Product Package",
      price: "$9,000 – $14,000",
      discountPrice: "$5,850 – $9,100",
      description: "An end-to-end creative product partnership, from the first idea to a differentiated and documented digital product.",
      includesLabel: "Includes",
      includes: [
        "From concept to complete product",
        "Creative direction and brand visual direction",
        "Complete UI / UX design and design system",
        "Full frontend development with Next.js",
        "Advanced animation and interactive experience",
        "MVP or first product version",
        "Full optimization, deployment, and documentation",
        "Initial support and revisions",
      ],
      suitableLabel: "Best for",
      suitableFor: "Startups building a real, differentiated digital product",
      featured: true,
    },
  ],
  fa: [
    {
      index: "۰۱",
      title: "پکیج لندینگ پیج",
      price: "$900 – $1,400",
      description: "یک تجربه‌ی تک‌صفحه‌ای متمرکز برای لانچ، با مسیر بصری دقیق و همه‌چیز برای آنلاین شدن.",
      includesLabel: "شامل",
      includes: [
        "طراحی و توسعه یک لندینگ پیج تک‌صفحه‌ای",
        "طراحی UI مدرن و غیرقالبی",
        "ریسپانسیو کامل موبایل و دسکتاپ",
        "انیمیشن‌های ساده و micro-interaction",
        "فرم تماس",
        "دیپلوی روی Vercel و اتصال دامنه",
      ],
      suitableLabel: "مناسب برای",
      suitableFor: "استارتاپ‌ها، معرفی محصول و کمپین‌های تبلیغاتی",
    },
    {
      index: "۰۲",
      title: "سایت شخصی / پورتفولیو",
      price: "$1,500 – $2,200",
      description: "خانه‌ی دیجیتال شخصی برای تبدیل کارها، داستان و نگاه شما به یک پورتفولیوی حرفه‌ای.",
      includesLabel: "شامل",
      includes: [
        "طراحی و توسعه سایت شخصی یا پورتفولیو، ۴ تا ۶ صفحه",
        "طراحی هویت بصری سبک",
        "انیمیشن و اسکرول اینتراکشن",
        "ریسپانسیو کامل",
        "فرم تماس",
        "بهینه‌سازی اولیه SEO و سرعت",
        "دیپلوی و اتصال دامنه",
      ],
      suitableLabel: "مناسب برای",
      suitableFor: "فریلنسرها، طراحان، دولوپرها و هنرمندان",
    },
    {
      index: "۰۳",
      title: "سایت شرکتی / سازمانی",
      price: "$2,400 – $3,500",
      description: "یک سیستم کامل و قابل‌اعتماد برای کسب‌وکارهایی که به وضوح، اعتماد و فضای رشد نیاز دارند.",
      includesLabel: "شامل",
      includes: [
        "طراحی و توسعه سایت شرکتی، ۶ تا ۱۰ صفحه",
        "طراحی UI/UX کامل",
        "سیستم تایپوگرافی و رنگ",
        "انیمیشن‌های اسکرول و ترنزیشن",
        "چندزبانه در صورت نیاز",
        "فرم‌های پیشرفته",
        "Technical SEO پایه",
        "دیپلوی و بهینه‌سازی عملکرد",
      ],
      suitableLabel: "مناسب برای",
      suitableFor: "شرکت‌ها، آژانس‌ها، کلینیک‌ها و کسب‌وکارهای خدماتی",
    },
    {
      index: "۰۴",
      title: "سایت خلاق / سینمایی",
      price: "$3,800 – $5,500",
      description: "یک سایت پریمیوم و سینمایی که آرت‌دایرکشن، موشن و روایت مبتنی بر اسکرول را یکپارچه می‌کند.",
      includesLabel: "شامل",
      includes: [
        "طراحی و توسعه سایت با سبک سینمایی و تعاملی",
        "Art Direction کامل",
        "انیمیشن‌های پیشرفته با GSAP / Framer Motion",
        "Scroll-based storytelling",
        "المان‌های تعاملی و motion-driven",
        "طراحی غیرقالبی و پرمیوم",
        "بهینه‌سازی عملکرد و ریسپانسیو دقیق",
        "دیپلوی حرفه‌ای",
      ],
      suitableLabel: "مناسب برای",
      suitableFor: "برندهای خلاق، فشن، هنر، لوکس و آژانس‌های تبلیغاتی",
      featured: true,
    },
    {
      index: "۰۵",
      title: "سایت پیشرفته تعاملی / Web3",
      price: "$5,800 – $8,500",
      description: "تجربه‌ای پیچیده و تعاملی برای محصولاتی که به عمق، موشن و یک پایه فنی مقیاس‌پذیر نیاز دارند.",
      includesLabel: "شامل",
      includes: [
        "طراحی و توسعه کامل سایت پیچیده",
        "تجربه تعاملی قوی با المان‌های 3D / WebGL در حد نیاز پروژه",
        "Art Direction و Motion Design پیشرفته",
        "چندزبانه و پشتیبانی RTL",
        "سیستم کامپوننت و ساختار مقیاس‌پذیر",
        "بهینه‌سازی عملکرد، SEO و Accessibility",
        "پشتیبانی اولیه بعد از لانچ",
      ],
      suitableLabel: "مناسب برای",
      suitableFor: "پروژه‌های Web3، Crypto، فین‌تک و برندهای پریمیوم",
      featured: true,
    },
    {
      index: "۰۶",
      title: "پکیج کامل محصول خلاق",
      price: "$9,000 – $14,000",
      discountPrice: "$5,850 – $9,100",
      description: "همکاری خلاقانه از ایده اولیه تا محصول دیجیتال متمایز، کامل و مستندسازی‌شده.",
      includesLabel: "شامل",
      includes: [
        "از ایده تا محصول کامل",
        "Creative Direction و Brand Visual Direction",
        "طراحی کامل UI/UX و Design System",
        "توسعه فرانت‌اند کامل با Next.js",
        "انیمیشن و تجربه تعاملی پیشرفته",
        "ساخت MVP یا نسخه اول محصول",
        "بهینه‌سازی کامل، دیپلوی و مستندسازی",
        "پشتیبانی و اصلاحات اولیه",
      ],
      suitableLabel: "مناسب برای",
      suitableFor: "استارتاپ‌هایی که می‌خواهند محصول دیجیتال واقعی و متمایز بسازند",
      featured: true,
    },
  ],
  tr: [
    {
      index: "01",
      title: "Landing Page Paketi",
      price: "$900 – $1,400",
      description: "Keskin bir görsel yön ve yayına çıkmak için gereken her şeyi içeren odaklı tek sayfalık lansman deneyimi.",
      includesLabel: "İçerik",
      includes: [
        "Tek sayfalık landing page tasarımı ve geliştirmesi",
        "Modern, özgün UI tasarımı",
        "Mobil ve masaüstü için tam responsive yapı",
        "Basit animasyonlar ve mikro etkileşimler",
        "İletişim formu",
        "Vercel deployment ve domain bağlantısı",
      ],
      suitableLabel: "Uygun olduğu projeler",
      suitableFor: "Startup’lar, ürün tanıtımları ve reklam kampanyaları",
    },
    {
      index: "02",
      title: "Kişisel / Portfolyo Sitesi",
      price: "$1,500 – $2,200",
      description: "Çalışmalarınızı, hikâyenizi ve bakış açınızı güçlü bir portfolyoya dönüştüren kişisel dijital alan.",
      includesLabel: "İçerik",
      includes: [
        "4–6 sayfalık kişisel veya portfolyo sitesi",
        "Hafif görsel kimlik yönü",
        "Animasyon ve scroll etkileşimleri",
        "Tam responsive yapı",
        "İletişim formu",
        "İlk SEO ve performans optimizasyonu",
        "Deployment ve domain bağlantısı",
      ],
      suitableLabel: "Uygun olduğu projeler",
      suitableFor: "Freelancer’lar, tasarımcılar, geliştiriciler ve sanatçılar",
    },
    {
      index: "03",
      title: "Kurumsal / Şirket Sitesi",
      price: "$2,400 – $3,500",
      description: "Netlik, güven ve büyüme alanına ihtiyaç duyan işletmeler için eksiksiz ve güvenilir bir web sistemi.",
      includesLabel: "İçerik",
      includes: [
        "6–10 sayfalık kurumsal web sitesi",
        "Tam UI / UX tasarımı",
        "Tipografi ve renk sistemi",
        "Scroll animasyonları ve geçişler",
        "İhtiyaca göre çoklu dil",
        "Gelişmiş formlar",
        "Temel teknik SEO",
        "Deployment ve performans optimizasyonu",
      ],
      suitableLabel: "Uygun olduğu projeler",
      suitableFor: "Şirketler, ajanslar, klinikler ve hizmet işletmeleri",
    },
    {
      index: "04",
      title: "Yaratıcı / Sinematik Web Sitesi",
      price: "$3,800 – $5,500",
      description: "Sanat yönetimi, hareket ve scroll tabanlı hikâye anlatımını tek bir premium deneyimde buluşturan site.",
      includesLabel: "İçerik",
      includes: [
        "Sinematik ve interaktif web sitesi tasarımı ve geliştirmesi",
        "Tam sanat yönetimi",
        "GSAP / Framer Motion ile gelişmiş animasyonlar",
        "Scroll tabanlı hikâye anlatımı",
        "İnteraktif ve motion-driven öğeler",
        "Özgün ve premium görsel yön",
        "Performans optimizasyonu ve hassas responsive yapı",
        "Profesyonel deployment",
      ],
      suitableLabel: "Uygun olduğu projeler",
      suitableFor: "Yaratıcı markalar, moda, sanat, lüks ve reklam ajansları",
      featured: true,
    },
    {
      index: "05",
      title: "İleri Etkileşimli / Web3 Sitesi",
      price: "$5,800 – $8,500",
      description: "Derinlik, hareket ve ölçeklenebilir teknik altyapı isteyen iddialı ürünler için karmaşık interaktif deneyim.",
      includesLabel: "İçerik",
      includes: [
        "Karmaşık web sitesinin tam tasarım ve geliştirmesi",
        "Uygun olduğunda 3D / WebGL öğeleriyle güçlü etkileşim",
        "İleri sanat yönetimi ve motion design",
        "Çoklu dil ve RTL desteği",
        "Ölçeklenebilir component sistemi ve yapı",
        "Performans, SEO ve erişilebilirlik optimizasyonu",
        "Lansman sonrası ilk destek",
      ],
      suitableLabel: "Uygun olduğu projeler",
      suitableFor: "Web3, crypto, fintech ve premium marka projeleri",
      featured: true,
    },
    {
      index: "06",
      title: "Tam Yaratıcı Ürün Paketi",
      price: "$9,000 – $14,000",
      discountPrice: "$5,850 – $9,100",
      description: "İlk fikirden farklılaşan, tamamlanmış ve dokümante edilmiş dijital ürüne kadar uçtan uca yaratıcı ortaklık.",
      includesLabel: "İçerik",
      includes: [
        "Konseptten tamamlanmış ürüne",
        "Creative direction ve brand visual direction",
        "Tam UI / UX tasarımı ve design system",
        "Next.js ile full frontend geliştirme",
        "İleri animasyon ve interaktif deneyim",
        "MVP veya ürünün ilk versiyonu",
        "Tam optimizasyon, deployment ve dokümantasyon",
        "İlk destek ve revizyonlar",
      ],
      suitableLabel: "Uygun olduğu projeler",
      suitableFor: "Gerçek ve farklılaşan dijital ürün kurmak isteyen startup’lar",
      featured: true,
    },
  ],
};

const INTRO: Record<LangKey, { eyebrow: string; title: string; description: string; cta: string }> = {
  en: {
    eyebrow: "[005] SERVICES",
    title: "BUILD SOMETHING WITH A POINT OF VIEW.",
    description: "From the first visual direction to the final line of code, I help ambitious ideas become clear, tactile, and ready for the real world.",
    cta: "Start a conversation",
  },
  fa: {
    eyebrow: "[۰۰۵] خدمات",
    title: "چیزی با نگاه و هویت بسازیم.",
    description: "از اولین مسیر بصری تا آخرین خط کد، به ایده‌های بلندپروازانه کمک می‌کنم شفاف، ملموس و آماده دنیای واقعی شوند.",
    cta: "شروع گفتگو",
  },
  tr: {
    eyebrow: "[005] HİZMETLER",
    title: "BAKIŞ AÇISI OLAN BİR ŞEY ÜRETELİM.",
    description: "İlk görsel yönden son kod satırına kadar iddialı fikirlerin net, dokunsal ve gerçek dünyaya hazır deneyimlere dönüşmesine yardımcı oluyorum.",
    cta: "Konuşmaya başlayalım",
  },
};

const WEEKLY_OFFER: Record<LangKey, { label: string; days: string }> = {
  en: { label: "35% OFF", days: "THU–FRI" },
  fa: { label: "۳۵٪ تخفیف", days: "پنج‌شنبه و جمعه" },
  tr: { label: "%35 İNDİRİM", days: "PERŞ–CUMA" },
};

const PACKAGE_CONTACT_CTA: Record<LangKey, string> = {
  en: "Ask about this package",
  fa: "درخواست این پکیج",
  tr: "Bu paket hakkında konuş",
};

function telegramServiceHref(
  service: ServicePackage,
  lang: LangKey,
  isOfferActive: boolean,
): string {
  const price = isOfferActive && service.discountPrice
    ? service.discountPrice
    : service.price;
  const offerNote = isOfferActive && service.discountPrice
    ? lang === "fa"
      ? " (با ۳۵٪ تخفیف پنج‌شنبه و جمعه)"
      : lang === "tr"
        ? " (%35 Perşembe–Cuma indirimiyle)"
        : " (with the 35% Thursday–Friday offer)"
    : "";
  const message =
    lang === "fa"
      ? `سلام بابک، درباره «${service.title}» با قیمت ${price}${offerNote} علاقه‌مندم. می‌خواهم درباره پروژه‌ام صحبت کنم.`
      : lang === "tr"
        ? `Merhaba Babak, ${service.title} paketiyle (${price}${offerNote}) ilgileniyorum. Projem hakkında konuşmak istiyorum.`
        : `Hi Babak, I’m interested in the ${service.title} package (${price}${offerNote}). I’d like to discuss my project.`;

  const telegramUrl = new URL(SOCIAL_LINKS.telegram);
  telegramUrl.searchParams.set("text", message);
  return telegramUrl.toString();
}

export default function ServicesPage() {
  const [lang, setLang] = usePreferredLang();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [worksMenuOpen, setWorksMenuOpen] = useState(false);
  const [worksAccordionOpen, setWorksAccordionOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isOfferActive, setIsOfferActive] = useState(false);
  const copy = INTRO[lang];
  const services = SERVICES[lang];
  const offerCopy = WEEKLY_OFFER[lang];
  const prefersReducedMotion = false;

  const t: TFn = (key) => TRANSLATIONS[lang][key] ?? String(key);

  useEffect(() => {
    document.title = `${copy.eyebrow.replace(/[\[\]۰-۹0-9]/g, "").trim()} — MADBAK`;
    document.documentElement.lang = htmlLangAttr(lang);
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [copy.eyebrow, lang]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncOfferStatus = () => {
      const weekday = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Istanbul",
        weekday: "short",
      }).format(new Date());

      setIsOfferActive(weekday === "Thu" || weekday === "Fri");
    };

    syncOfferStatus();
    const timer = window.setInterval(syncOfferStatus, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const onNavigate = (hash: string) => {
    if (hash === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileNavOpen(false);
    setWorksMenuOpen(false);
  };

  return (
    <div
      lang={htmlLangAttr(lang)}
      dir={lang === "fa" ? "rtl" : "ltr"}
      className={`min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#EBE8E1] selection:bg-[#ff2a2a] selection:text-[#EBE8E1] ${rootLocaleClasses(lang)} ${lang !== "fa" ? "font-sans" : ""}`}
    >
      <SiteNav
        lang={lang}
        setLang={setLang}
        t={t}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        scrolled={navScrolled}
        onNavigate={onNavigate}
        worksMenuOpen={worksMenuOpen}
        setWorksMenuOpen={setWorksMenuOpen}
        homeLinks={false}
      />
      <MobileNavOverlay
        lang={lang}
        t={t}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        setLang={setLang}
        prefersReducedMotion={prefersReducedMotion}
        onNavigate={onNavigate}
        homeLinks={false}
        worksAccordionOpen={worksAccordionOpen}
        setWorksAccordionOpen={setWorksAccordionOpen}
      />

      <main className="pt-14 sm:pt-[3.75rem]">
        <section className="relative overflow-hidden border-b border-white/12 px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-12 lg:pb-40">
          <div className="pointer-events-none absolute -end-8 top-8 select-none font-black text-[clamp(12rem,30vw,34rem)] leading-none tracking-[-0.15em] text-white/[0.035]" aria-hidden>
            05
          </div>
          <div className="relative mx-auto max-w-[1400px]">
            <p className={`font-mono text-[10px] text-[#ff2a2a] ${localeCase(lang)} ${trackMeta(lang)}`}>{copy.eyebrow}</p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end lg:gap-16">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`max-w-5xl text-[clamp(3.4rem,10vw,10.5rem)] font-black leading-[0.82] ${localeCase(lang)} ${trackHeading(lang)}`}
              >
                {copy.title}
              </motion.h1>
              <div className="lg:pb-2">
                <p className={`max-w-md text-base leading-relaxed text-white/60 sm:text-lg ${localeCase(lang)}`}>{copy.description}</p>
                <Link href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className={`mt-8 inline-flex min-h-[44px] items-center border-b border-[#ff2a2a] pb-2 font-mono text-[10px] text-[#EBE8E1] transition-colors hover:text-[#ff2a2a] ${localeCase(lang)} ${trackMeta(lang)}`}>
                  {copy.cta}<span className="ms-3" aria-hidden>{lang === "fa" ? "←" : "→"}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid items-stretch gap-px border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.index}
                  className={`group flex h-full min-h-[38rem] flex-col p-6 transition-colors duration-500 sm:p-8 lg:min-h-[42rem] lg:p-9 ${service.featured ? "bg-[#17110F] hover:bg-[#211512]" : "bg-[#0A0A0A] hover:bg-[#151515]"}`}
                >
                  <div className="flex min-h-[21rem] flex-col border-b border-white/12 pb-7 sm:min-h-[22rem]">
                    <div className="flex min-h-5 items-start justify-between gap-3">
                      <span className="font-mono text-[10px] text-[#ff2a2a]">{service.index}</span>
                      <div className="flex items-center gap-3">
                        {isOfferActive && service.discountPrice ? (
                          <span className={`font-mono text-[8px] text-[#ff2a2a] ${localeCase(lang)} ${trackMeta(lang)}`}>
                            {offerCopy.label} · {offerCopy.days}
                          </span>
                        ) : null}
                        <span className={`h-2 w-2 transition-transform duration-500 group-hover:scale-150 ${service.featured ? "bg-[#ff2a2a]" : "bg-white/30"}`} aria-hidden />
                      </div>
                    </div>
                    <h2 className={`mt-14 min-h-[8.5rem] max-w-[13ch] text-[clamp(2rem,3.5vw,3.25rem)] font-black leading-[0.88] ${localeCase(lang)} ${trackHeading(lang)}`}>{service.title}</h2>
                    <div className="mt-2 min-h-[4.25rem] font-mono font-semibold leading-none tracking-[-0.04em] text-[#ff2a2a]">
                      {isOfferActive && service.discountPrice ? (
                        <>
                          <span className="block text-sm text-white/30 line-through">{service.price}</span>
                          <span className="mt-2 block text-[clamp(1.35rem,2.2vw,2rem)]">{service.discountPrice}</span>
                        </>
                      ) : (
                        <span className="block text-[clamp(1.35rem,2.2vw,2rem)]">{service.price}</span>
                      )}
                    </div>
                    <p className={`mt-5 min-h-[4.5rem] text-sm leading-relaxed text-white/55 sm:text-base ${localeCase(lang)}`}>{service.description}</p>
                  </div>
                  <div className="flex flex-1 flex-col pt-5">
                    <p className={`font-mono text-[9px] text-white/40 ${localeCase(lang)} ${trackMeta(lang)}`}>{service.includesLabel}</p>
                    <ul className={`mt-4 space-y-3 text-sm leading-relaxed text-white/75 ${localeCase(lang)}`}>
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-[0.55em] h-1 w-1 shrink-0 bg-[#ff2a2a]" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`mt-8 border-t border-white/12 pt-5 ${localeCase(lang)}`}>
                    <p className={`font-mono text-[9px] text-white/40 ${trackMeta(lang)}`}>{service.suitableLabel}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{service.suitableFor}</p>
                  </div>
                  <a
                    href={telegramServiceHref(service, lang, isOfferActive)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex min-h-[46px] w-full items-center justify-between rounded-full border border-[#ff2a2a]/70 px-5 font-mono text-[10px] text-[#EBE8E1] transition-[background-color,border-color,color,transform] hover:-translate-y-0.5 hover:border-[#ff2a2a] hover:bg-[#ff2a2a] hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a] ${localeCase(lang)} ${trackMeta(lang)}`}
                  >
                    <span>{PACKAGE_CONTACT_CTA[lang]}</span>
                    <span aria-hidden>{lang === "fa" ? "↖" : "↗"}</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/12 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-[clamp(1.7rem,4vw,4rem)] font-black leading-[0.95] tracking-[-0.06em]">{lang === "fa" ? "هر پروژه از یک گفت‌وگوی خوب شروع می‌شود." : lang === "tr" ? "Her proje iyi bir konuşmayla başlar." : "Every project starts with a good conversation."}</p>
            <Link href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] w-fit items-center rounded-full bg-[#ff2a2a] px-6 font-mono text-[10px] text-[#0A0A0A] transition-transform hover:scale-[1.03]">{copy.cta}<span className="ms-3" aria-hidden>→</span></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
