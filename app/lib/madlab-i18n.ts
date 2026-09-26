import type { LangKey } from "./portfolio-data";
import type { ReactBitsFreeCategory } from "./react-bits-free";

export type MadlabLocalized = Record<LangKey, string>;

export const MADLAB_COPY = {
  index: { en: "MADLAB / index", fa: "MADLAB / فهرست" },
  library: { en: "LIBRARY", fa: "کتابخانه" },
  libraryAria: { en: "MADLAB component library", fa: "کتابخانه‌ی کامپوننت‌های MADLAB" },
  catalog: { en: "MADLAB / free catalog", fa: "MADLAB / کاتالوگ رایگان" },
  components: { en: "COMPONENTS", fa: "کامپوننت‌ها" },
  catalogDescription: {
    en: "Free animated components, backgrounds, interactions, and text effects curated for the MADLAB library.",
    fa: "کامپوننت‌های متحرک، پس‌زمینه‌ها، تعامل‌ها و افکت‌های متنی رایگان برای کتابخانه‌ی MADLAB.",
  },
  freeReferences: { en: "free references", fa: "مرجع رایگان" },
  noPro: { en: "no pro / no premium", fa: "بدون نسخه‌ی حرفه‌ای / بدون پریمیوم" },
  search: { en: "Search components...", fa: "جست‌وجوی کامپوننت‌ها..." },
  searchAria: { en: "Search free components", fa: "جست‌وجوی کامپوننت‌های رایگان" },
  filterAria: { en: "Filter free components by category", fa: "فیلتر کامپوننت‌های رایگان بر اساس دسته‌بندی" },
  freeReference: { en: "Free component references", fa: "مرجع‌های رایگان کامپوننت" },
  shown: { en: "shown", fa: "نمایش داده شد" },
  noMatch: { en: "No free components match your search.", fa: "هیچ کامپوننت رایگانی با جست‌وجوی شما مطابقت ندارد." },
  freeOpenSource: { en: "Free / open source", fa: "رایگان / متن‌باز" },
  officialSource: { en: "Official source", fa: "سورس اصلی" },
  built: { en: "MADLAB / built", fa: "MADLAB / ساخته‌شده" },
  heroKicker: { en: "MADBAK experimental development lab", fa: "لابراتوار توسعه‌ی تجربی MADBAK" },
  liveDisplay: { en: "Live creative-development display", fa: "نمایش زنده‌ی توسعه‌ی خلاقانه" },
  heroDescription: { en: "Components, interactions and visual experiments built from scratch.", fa: "کامپوننت‌ها، تعامل‌ها و آزمایش‌های بصری که از صفر ساخته شده‌اند." },
  heroSubcopy: { en: "Design, motion and code — broken down step by step.", fa: "طراحی، موشن و کد — قدم‌به‌قدم باز شده‌اند." },
  exploreArchive: { en: "Explore archive", fa: "مشاهده‌ی آرشیو" },
  libraryBack: { en: "← MADLAB / library", fa: "← MADLAB / کتابخانه" },
  freeReferenceLabel: { en: "FREE REFERENCE", fa: "مرجع رایگان" },
  difficulty: { en: "Difficulty", fa: "سطح دشواری" },
  buildTime: { en: "Build time", fa: "زمان ساخت" },
  category: { en: "Category", fa: "دسته‌بندی" },
  status: { en: "Status", fa: "وضعیت" },
  previewLocalSource: { en: "MADLAB preview + local source", fa: "پیش‌نمایش MADLAB + سورس محلی" },
  workspace: { en: "MADLAB / WORKSPACE", fa: "MADLAB / محیط کار" },
  buildTune: { en: "Build it, then tune it.", fa: "بسازش، بعد تنظیمش کن." },
  detailView: { en: "Detail view", fa: "نمای جزئیات" },
  preview: { en: "Preview", fa: "پیش‌نمایش" },
  code: { en: "Code", fa: "کد" },
  replay: { en: "Replay ↻", fa: "اجرای دوباره ↻" },
  replayAria: { en: "Replay preview motion", fa: "اجرای دوباره‌ی حرکت پیش‌نمایش" },
  livePreview: { en: "Live preview", fa: "پیش‌نمایش زنده" },
  textControls: { en: "text controls enabled", fa: "کنترل‌های متن فعال است" },
  customControls: { en: "custom controls enabled", fa: "کنترل‌های سفارشی فعال است" },
  referencePreview: { en: "reference preview", fa: "پیش‌نمایش مرجع" },
  moveInside: { en: "Move inside the preview to test the interaction. Open Code when you are ready to adapt the local source.", fa: "داخل پیش‌نمایش حرکت کن تا تعامل را تست کنی. وقتی آماده‌ی تغییر سورس محلی بودی، کد را باز کن." },
  customize: { en: "Customize", fa: "شخصی‌سازی" },
  textParameters: { en: "Text parameters", fa: "پارامترهای متن" },
  palette: { en: "MADBAK palette", fa: "پالت MADBAK" },
  referenceSettings: { en: "Reference settings", fa: "تنظیمات مرجع" },
  reset: { en: "Reset", fa: "بازنشانی" },
  textAnimation: { en: "Text animation", fa: "انیمیشن متن" },
  text: { en: "Text", fa: "متن" },
  animateBy: { en: "Animate by", fa: "انیمیشن بر اساس" },
  duration: { en: "Duration", fa: "مدت" },
  delay: { en: "Delay", fa: "تأخیر" },
  enableBlur: { en: "Enable blur", fa: "فعال‌سازی بلور" },
  motionParameters: { en: "Motion parameters", fa: "پارامترهای حرکت" },
  speed: { en: "Speed", fa: "سرعت" },
  ringCount: { en: "Ring count", fa: "تعداد حلقه" },
  strandCount: { en: "Strand count", fa: "تعداد رشته" },
  activeValues: { en: "Active values", fa: "مقادیر فعال" },
  noColor: { en: "No color override", fa: "بدون تغییر رنگ" },
  noControls: { en: "This reference has no exposed color or text controls.", fa: "این مرجع کنترل رنگ یا متن قابل تنظیم ندارد." },
  sourceCopyReady: { en: "Local source / copy-ready", fa: "سورس محلی / آماده‌ی کپی" },
  sourceCopyDesc: { en: "This is the source stored inside MADLAB. Tune the preview first, then copy the implementation into your own project.", fa: "این سورسی است که داخل MADLAB نگه‌داری می‌شود. اول پیش‌نمایش را تنظیم کن، بعد پیاده‌سازی را در پروژه‌ی خودت کپی کن." },
  apiSurface: { en: "02 / API surface", fa: "۰۲ / سطح API" },
  propsSource: { en: "Props & source.", fa: "پراپ‌ها و سورس." },
  propsSourceDesc: { en: "The useful details stay visible beside the experiment: what it is, where it lives, and which values are safe to change.", fa: "جزئیات کاربردی کنار آزمایش دیده می‌مانند: چیست، کجا قرار دارد و کدام مقادیر را می‌شود با خیال راحت تغییر داد." },
  stack: { en: "Stack", fa: "استک" },
  controls: { en: "Controls", fa: "کنترل‌ها" },
  accessibility: { en: "Accessibility", fa: "دسترس‌پذیری" },
  integrationNotes: { en: "03 / Integration notes", fa: "۰۳ / نکات یکپارچه‌سازی" },
  makeReference: { en: "Make the reference yours.", fa: "این مرجع را مال خودت کن." },
  integrationDesc: { en: "Use the preview to understand the visual rule, then keep only the behavior that earns its place in your interface. The local source remains available for every catalog item.", fa: "از پیش‌نمایش برای فهم قانون بصری استفاده کن، سپس فقط رفتاری را نگه دار که در رابطت واقعاً کاربرد دارد. سورس محلی برای همه‌ی آیتم‌های کاتالوگ در دسترس است." },
  buildNote: { en: "Build note", fa: "یادداشت ساخت" },
  buildNoteDesc: { en: "Start with a small surface area, preserve the palette contract, and add complexity only after the interaction is useful in context.", fa: "با یک سطح کوچک شروع کن، قرارداد پالت را حفظ کن و فقط وقتی تعامل در زمینه مفید بود پیچیدگی اضافه کن." },
  tutorial: { en: "04 / Full tutorial", fa: "۰۴ / آموزش کامل" },
  fullTutorial: { en: "Read the full tutorial ↗", fa: "آموزش کامل را بخوان ↗" },
  archive: { en: "MADLAB / archive", fa: "MADLAB / آرشیو" },
  keepExperimenting: { en: "Keep experimenting.", fa: "به آزمایش ادامه بده." },
  backToLibrary: { en: "Back to library ↗", fa: "بازگشت به کتابخانه ↗" },
  tutorialSource: { en: "MADLAB / source", fa: "MADLAB / سورس" },
  readyToAdapt: { en: "Ready to adapt it?", fa: "آماده‌ای تغییرش بدهی؟" },
  openLocalSource: { en: "Open local source ↗", fa: "باز کردن سورس محلی ↗" },
  primary: { en: "Primary", fa: "اصلی" },
  light: { en: "Light", fa: "روشن" },
  deep: { en: "Deep", fa: "تیره" },
  previewCustomization: { en: "Preview customization", fa: "شخصی‌سازی پیش‌نمایش" },
  primaryLightDeep: { en: "Primary, light, and deep values are mapped to MADLAB controls.", fa: "مقادیر اصلی، روشن و تیره به کنترل‌های MADLAB متصل شده‌اند." },
  textTiming: { en: "Text, timing, and animation behavior are mapped to MADLAB controls.", fa: "متن، زمان‌بندی و رفتار انیمیشن به کنترل‌های MADLAB متصل شده‌اند." },
  sourceDefaults: { en: "This reference keeps its source defaults.", fa: "این مرجع تنظیمات پیش‌فرض سورس را نگه می‌دارد." },
  accessibilityDescription: { en: "Keep the surrounding label and non-motion fallback when integrating.", fa: "هنگام ادغام، برچسب اطراف و fallback بدون حرکت را حفظ کن." },
  catalogContinue: { en: "Continue exploring MADLAB", fa: "ادامه‌ی کاوش در MADLAB" },
} as const satisfies Record<string, MadlabLocalized>;

export type MadlabCopyKey = keyof typeof MADLAB_COPY;

export function madlabText(lang: LangKey, key: MadlabCopyKey): string {
  return MADLAB_COPY[key][lang];
}

const CATEGORY_LABELS: Record<"ALL" | ReactBitsFreeCategory, MadlabLocalized> = {
  ALL: { en: "ALL", fa: "همه" },
  ANIMATIONS: { en: "ANIMATIONS", fa: "انیمیشن‌ها" },
  BACKGROUNDS: { en: "BACKGROUNDS", fa: "پس‌زمینه‌ها" },
  COMPONENTS: { en: "COMPONENTS", fa: "کامپوننت‌ها" },
  "TEXT ANIMATIONS": { en: "TEXT ANIMATIONS", fa: "انیمیشن‌های متن" },
};

export function madlabCategoryLabel(lang: LangKey, category: "ALL" | ReactBitsFreeCategory | string): string {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]?.[lang] ?? category;
}

export function madlabTutorialPath(slug: string): string {
  return `/lab/tutorials/${slug.replace(/^catalog-/, "")}`;
}
