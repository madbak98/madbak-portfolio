import type { LangKey } from "./portfolio-data";
import type { ReactBitsFreeCategory } from "./react-bits-free";

export type MadlabLocalized = Record<LangKey, string>;

export const MADLAB_COPY = {
  index: { en: "MADLAB / index", fa: "مدلب / فهرست", tr: "MADLAB / DİZİN" },
  library: { en: "LIBRARY", fa: "کتابخانه", tr: "KÜTÜPHANE" },
  libraryAria: { en: "MADLAB component library", fa: "کتابخانه‌ی کامپوننت‌های مدلب", tr: "MADLAB bileşen kütüphanesi" },
  catalog: { en: "MADLAB / free catalog", fa: "مدلب / کاتالوگ رایگان", tr: "MADLAB / ücretsiz katalog" },
  components: { en: "COMPONENTS", fa: "کامپوننت‌ها", tr: "BİLEŞENLER" },
  catalogDescription: {
    en: "Free animated components, backgrounds, interactions, and text effects curated for the MADLAB library.",
    fa: "کامپوننت‌های متحرک، پس‌زمینه‌ها، تعامل‌ها و افکت‌های متنی رایگان برای کتابخانه‌ی مدلب.",
    tr: "MADLAB kütüphanesi için seçilmiş ücretsiz hareketli bileşenler, arka planlar, etkileşimler ve metin efektleri.",
  },
  freeReferences: { en: "free references", fa: "مرجع رایگان", tr: "ücretsiz referans" },
  noPro: { en: "no pro / no premium", fa: "بدون نسخه‌ی حرفه‌ای / بدون پریمیوم", tr: "pro yok / premium yok" },
  search: { en: "Search components...", fa: "جست‌وجوی کامپوننت‌ها...", tr: "Bileşenlerde ara..." },
  searchAria: { en: "Search free components", fa: "جست‌وجوی کامپوننت‌های رایگان", tr: "Ücretsiz bileşenlerde ara" },
  filterAria: { en: "Filter free components by category", fa: "فیلتر کامپوننت‌های رایگان بر اساس دسته‌بندی", tr: "Ücretsiz bileşenleri kategoriye göre filtrele" },
  freeReference: { en: "Free component references", fa: "مرجع‌های رایگان کامپوننت", tr: "Ücretsiz bileşen referansları" },
  shown: { en: "shown", fa: "نمایش داده شد", tr: "gösteriliyor" },
  noMatch: { en: "No free components match your search.", fa: "هیچ کامپوننت رایگانی با جست‌وجوی شما مطابقت ندارد.", tr: "Aramanızla eşleşen ücretsiz bileşen yok." },
  freeOpenSource: { en: "Free / open source", fa: "رایگان / متن‌باز", tr: "Ücretsiz / açık kaynak" },
  officialSource: { en: "Official source", fa: "سورس اصلی", tr: "Resmî kaynak" },
  built: { en: "MADLAB / built", fa: "مدلب / ساخته‌شده", tr: "MADLAB / üretilenler" },
  heroKicker: { en: "MADBAK experimental development lab", fa: "لابراتوار توسعه‌ی تجربی مدبک", tr: "MADBAK deneysel geliştirme laboratuvarı" },
  liveDisplay: { en: "Live creative-development display", fa: "نمایش زنده‌ی توسعه‌ی خلاقانه", tr: "Canlı yaratıcı geliştirme ekranı" },
  heroDescription: { en: "Components, interactions and visual experiments built from scratch.", fa: "کامپوننت‌ها، تعامل‌ها و آزمایش‌های بصری که از صفر ساخته شده‌اند.", tr: "Sıfırdan geliştirilen bileşenler, etkileşimler ve görsel deneyler." },
  heroSubcopy: { en: "Design, motion and code — broken down step by step.", fa: "طراحی، موشن و کد — قدم‌به‌قدم باز شده‌اند.", tr: "Tasarım, hareket ve kod — adım adım açıklanıyor." },
  exploreArchive: { en: "Explore archive", fa: "مشاهده‌ی آرشیو", tr: "Arşivi keşfet" },
  libraryBack: { en: "← MADLAB / library", fa: "← مدلب / کتابخانه", tr: "← MADLAB / kütüphane" },
  freeReferenceLabel: { en: "FREE REFERENCE", fa: "مرجع رایگان", tr: "ÜCRETSİZ REFERANS" },
  difficulty: { en: "Difficulty", fa: "سطح دشواری", tr: "Zorluk" },
  buildTime: { en: "Build time", fa: "زمان ساخت", tr: "Yapım süresi" },
  category: { en: "Category", fa: "دسته‌بندی", tr: "Kategori" },
  status: { en: "Status", fa: "وضعیت", tr: "Durum" },
  previewLocalSource: { en: "MADLAB preview + local source", fa: "پیش‌نمایش مدلب + سورس محلی", tr: "MADLAB önizlemesi + yerel kaynak" },
  workspace: { en: "MADLAB / WORKSPACE", fa: "مدلب / محیط کار", tr: "MADLAB / ÇALIŞMA ALANI" },
  buildTune: { en: "Build it, then tune it.", fa: "بسازش، بعد تنظیمش کن.", tr: "Önce kur, sonra ayarla." },
  detailView: { en: "Detail view", fa: "نمای جزئیات", tr: "Detay görünümü" },
  preview: { en: "Preview", fa: "پیش‌نمایش", tr: "Önizleme" },
  code: { en: "Code", fa: "کد", tr: "Kod" },
  replay: { en: "Replay ↻", fa: "اجرای دوباره ↻", tr: "Tekrar oynat ↻" },
  replayAria: { en: "Replay preview motion", fa: "اجرای دوباره‌ی حرکت پیش‌نمایش", tr: "Önizleme hareketini tekrar oynat" },
  livePreview: { en: "Live preview", fa: "پیش‌نمایش زنده", tr: "Canlı önizleme" },
  textControls: { en: "text controls enabled", fa: "کنترل‌های متن فعال است", tr: "metin kontrolleri açık" },
  customControls: { en: "custom controls enabled", fa: "کنترل‌های سفارشی فعال است", tr: "özel kontroller açık" },
  referencePreview: { en: "reference preview", fa: "پیش‌نمایش مرجع", tr: "referans önizlemesi" },
  moveInside: { en: "Move inside the preview to test the interaction. Open Code when you are ready to adapt the local source.", fa: "داخل پیش‌نمایش حرکت کن تا تعامل را تست کنی. وقتی آماده‌ی تغییر سورس محلی بودی، کد را باز کن.", tr: "Etkileşimi test etmek için önizlemenin içinde hareket et. Yerel kaynağı uyarlamaya hazır olduğunda kodu aç." },
  customize: { en: "Customize", fa: "شخصی‌سازی", tr: "Özelleştir" },
  textParameters: { en: "Text parameters", fa: "پارامترهای متن", tr: "Metin parametreleri" },
  palette: { en: "MADBAK palette", fa: "پالت مدبک", tr: "MADBAK paleti" },
  referenceSettings: { en: "Reference settings", fa: "تنظیمات مرجع", tr: "Referans ayarları" },
  reset: { en: "Reset", fa: "بازنشانی", tr: "Sıfırla" },
  textAnimation: { en: "Text animation", fa: "انیمیشن متن", tr: "Metin animasyonu" },
  text: { en: "Text", fa: "متن", tr: "Metin" },
  animateBy: { en: "Animate by", fa: "انیمیشن بر اساس", tr: "Animasyon birimi" },
  duration: { en: "Duration", fa: "مدت", tr: "Süre" },
  delay: { en: "Delay", fa: "تأخیر", tr: "Gecikme" },
  enableBlur: { en: "Enable blur", fa: "فعال‌سازی بلور", tr: "Bulanıklığı aç" },
  motionParameters: { en: "Motion parameters", fa: "پارامترهای حرکت", tr: "Hareket parametreleri" },
  speed: { en: "Speed", fa: "سرعت", tr: "Hız" },
  ringCount: { en: "Ring count", fa: "تعداد حلقه", tr: "Halka sayısı" },
  strandCount: { en: "Strand count", fa: "تعداد رشته", tr: "Şerit sayısı" },
  activeValues: { en: "Active values", fa: "مقادیر فعال", tr: "Aktif değerler" },
  noColor: { en: "No color override", fa: "بدون تغییر رنگ", tr: "Renk geçersiz kılma yok" },
  noControls: { en: "This reference has no exposed color or text controls.", fa: "این مرجع کنترل رنگ یا متن قابل تنظیم ندارد.", tr: "Bu referansta açık renk veya metin kontrolü yok." },
  sourceCopyReady: { en: "Local source / copy-ready", fa: "سورس محلی / آماده‌ی کپی", tr: "Yerel kaynak / kopyalamaya hazır" },
  sourceCopyDesc: { en: "This is the source stored inside MADLAB. Tune the preview first, then copy the implementation into your own project.", fa: "این سورسی است که داخل مدلب نگه‌داری می‌شود. اول پیش‌نمایش را تنظیم کن، بعد پیاده‌سازی را در پروژه‌ی خودت کپی کن.", tr: "Bu, MADLAB içinde saklanan kaynaktır. Önce önizlemeyi ayarla, sonra uygulamayı kendi projenize kopyala." },
  apiSurface: { en: "02 / API surface", fa: "۰۲ / سطح API", tr: "02 / API yüzeyi" },
  propsSource: { en: "Props & source.", fa: "پراپ‌ها و سورس.", tr: "Props ve kaynak." },
  propsSourceDesc: { en: "The useful details stay visible beside the experiment: what it is, where it lives, and which values are safe to change.", fa: "جزئیات کاربردی کنار آزمایش دیده می‌مانند: چیست، کجا قرار دارد و کدام مقادیر را می‌شود با خیال راحت تغییر داد.", tr: "Yararlı ayrıntılar deneyin yanında görünür kalır: nedir, nerede yaşar ve hangi değerler güvenle değiştirilebilir." },
  stack: { en: "Stack", fa: "استک", tr: "Stack" },
  controls: { en: "Controls", fa: "کنترل‌ها", tr: "Kontroller" },
  accessibility: { en: "Accessibility", fa: "دسترس‌پذیری", tr: "Erişilebilirlik" },
  integrationNotes: { en: "03 / Integration notes", fa: "۰۳ / نکات یکپارچه‌سازی", tr: "03 / Entegrasyon notları" },
  makeReference: { en: "Make the reference yours.", fa: "این مرجع را مال خودت کن.", tr: "Bu referansı kendine göre uyarlayın." },
  integrationDesc: { en: "Use the preview to understand the visual rule, then keep only the behavior that earns its place in your interface. The local source remains available for every catalog item.", fa: "از پیش‌نمایش برای فهم قانون بصری استفاده کن، سپس فقط رفتاری را نگه دار که در رابطت واقعاً کاربرد دارد. سورس محلی برای همه‌ی آیتم‌های کاتالوگ در دسترس است.", tr: "Görsel kuralı anlamak için önizlemeyi kullanın; sonra arayüzünüzde yerini hak eden davranışı koruyun. Yerel kaynak her katalog öğesi için kullanılabilir." },
  buildNote: { en: "Build note", fa: "یادداشت ساخت", tr: "Yapım notu" },
  buildNoteDesc: { en: "Start with a small surface area, preserve the palette contract, and add complexity only after the interaction is useful in context.", fa: "با یک سطح کوچک شروع کن، قرارداد پالت را حفظ کن و فقط وقتی تعامل در زمینه مفید بود پیچیدگی اضافه کن.", tr: "Küçük bir yüzeyle başlayın, palet sözleşmesini koruyun ve karmaşıklığı ancak etkileşim bağlamda işe yaradıktan sonra ekleyin." },
  tutorial: { en: "04 / Full tutorial", fa: "۰۴ / آموزش کامل", tr: "04 / Tam eğitim" },
  fullTutorial: { en: "Read the full tutorial ↗", fa: "آموزش کامل را بخوان ↗", tr: "Tam eğitimi oku ↗" },
  archive: { en: "MADLAB / archive", fa: "مدلب / آرشیو", tr: "MADLAB / arşiv" },
  keepExperimenting: { en: "Keep experimenting.", fa: "به آزمایش ادامه بده.", tr: "Denemeye devam edin." },
  backToLibrary: { en: "Back to library ↗", fa: "بازگشت به کتابخانه ↗", tr: "Kütüphaneye dön ↗" },
  tutorialSource: { en: "MADLAB / source", fa: "مدلب / سورس", tr: "MADLAB / kaynak" },
  readyToAdapt: { en: "Ready to adapt it?", fa: "آماده‌ای تغییرش بدهی؟", tr: "Uyarlamaya hazır mısın?" },
  openLocalSource: { en: "Open local source ↗", fa: "باز کردن سورس محلی ↗", tr: "Yerel kaynağı aç ↗" },
  primary: { en: "Primary", fa: "اصلی", tr: "Ana" },
  light: { en: "Light", fa: "روشن", tr: "Açık" },
  deep: { en: "Deep", fa: "تیره", tr: "Derin" },
  previewCustomization: { en: "Preview customization", fa: "شخصی‌سازی پیش‌نمایش", tr: "Önizleme özelleştirmesi" },
  primaryLightDeep: { en: "Primary, light, and deep values are mapped to MADLAB controls.", fa: "مقادیر اصلی، روشن و تیره به کنترل‌های مدلب متصل شده‌اند.", tr: "Ana, açık ve derin değerler MADLAB kontrollerine bağlandı." },
  textTiming: { en: "Text, timing, and animation behavior are mapped to MADLAB controls.", fa: "متن، زمان‌بندی و رفتار انیمیشن به کنترل‌های مدلب متصل شده‌اند.", tr: "Metin, zamanlama ve animasyon davranışı MADLAB kontrollerine bağlandı." },
  sourceDefaults: { en: "This reference keeps its source defaults.", fa: "این مرجع تنظیمات پیش‌فرض سورس را نگه می‌دارد.", tr: "Bu referans kaynak varsayılanlarını korur." },
  accessibilityDescription: { en: "Keep the surrounding label and non-motion fallback when integrating.", fa: "هنگام ادغام، برچسب اطراف و fallback بدون حرکت را حفظ کن.", tr: "Entegrasyon sırasında çevre etiketi ve hareketsiz yedeği koruyun." },
  catalogContinue: { en: "Continue exploring MADLAB", fa: "ادامه‌ی کاوش در مدلب", tr: "MADLAB'i keşfetmeye devam edin" },
} as const satisfies Record<string, MadlabLocalized>;

export type MadlabCopyKey = keyof typeof MADLAB_COPY;

export function madlabText(lang: LangKey, key: MadlabCopyKey): string {
  return MADLAB_COPY[key][lang];
}

const CATEGORY_LABELS: Record<"ALL" | ReactBitsFreeCategory, MadlabLocalized> = {
  ALL: { en: "ALL", fa: "همه", tr: "TÜMÜ" },
  ANIMATIONS: { en: "ANIMATIONS", fa: "انیمیشن‌ها", tr: "ANİMASYONLAR" },
  BACKGROUNDS: { en: "BACKGROUNDS", fa: "پس‌زمینه‌ها", tr: "ARKA PLANLAR" },
  COMPONENTS: { en: "COMPONENTS", fa: "کامپوننت‌ها", tr: "BİLEŞENLER" },
  "TEXT ANIMATIONS": { en: "TEXT ANIMATIONS", fa: "انیمیشن‌های متن", tr: "METİN ANİMASYONLARI" },
};

export function madlabCategoryLabel(lang: LangKey, category: "ALL" | ReactBitsFreeCategory | string): string {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]?.[lang] ?? category;
}

export function madlabTutorialPath(slug: string): string {
  return `/lab/tutorials/${slug.replace(/^catalog-/, "")}`;
}
