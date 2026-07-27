import type { LangKey } from "../../lib/portfolio-data";
import { REACT_BITS_FREE_ITEMS, type ReactBitsFreeItem } from "../../lib/react-bits-free";
import type { MadlabLocalized } from "../../lib/madlab-i18n";

export type TutorialStepCopy = {
  title: MadlabLocalized;
  copy: MadlabLocalized;
  code?: string;
};

export type MadlabTutorial = {
  title: MadlabLocalized;
  summary: MadlabLocalized;
  mentalModel: MadlabLocalized[];
  level: MadlabLocalized;
  time: MadlabLocalized;
  stack: MadlabLocalized;
  steps: TutorialStepCopy[];
  debug: MadlabLocalized[];
};

type FocusCopy = {
  en: string;
  fa: string;
  tr: string;
};

const FOCUS: Record<string, FocusCopy> = {
  CursorGrid: { en: "pointer distance and cell energy", fa: "فاصله‌ی نشانگر و انرژی سلول‌ها", tr: "işaretçi mesafesi ve hücre enerjisi" },
  Strands: { en: "layered strands, glow, and controlled wave motion", fa: "رشته‌های لایه‌ای، درخشش و حرکت موجی کنترل‌شده", tr: "katmanlı şeritler, parıltı ve kontrollü dalga hareketi" },
  AnimatedContent: { en: "enter and exit states for content blocks", fa: "وضعیت‌های ورود و خروج بلوک‌های محتوا", tr: "içerik blokları için giriş ve çıkış durumları" },
  Antigravity: { en: "floating elements that respond to pointer movement", fa: "المان‌های شناوری که به حرکت نشانگر پاسخ می‌دهند", tr: "işaretçi hareketine tepki veren yüzen öğeler" },
  BlobCursor: { en: "a soft cursor follower with bounded motion", fa: "دنبال‌کننده‌ی نرم نشانگر با حرکت محدود", tr: "sınırlandırılmış hareketli yumuşak imleç takipçisi" },
  ClickSpark: { en: "short-lived particles emitted at a click point", fa: "ذرات کوتاه‌عمری که از نقطه‌ی کلیک منتشر می‌شوند", tr: "tıklama noktasından yayılan kısa ömürlü parçacıklar" },
  Crosshair: { en: "crosshair lines anchored to pointer coordinates", fa: "خطوط کراس‌هِیر متصل به مختصات نشانگر", tr: "işaretçi koordinatlarına bağlı nişangâh çizgileri" },
  Cubes: { en: "a small 3D-like grid with stable transforms", fa: "شبکه‌ی کوچک شبه‌سه‌بعدی با ترنسفورم‌های پایدار", tr: "kararlı dönüşümlere sahip küçük bir 3D benzeri ızgara" },
  ElectricBorder: { en: "a noisy border that stays inside a card", fa: "حاشیه‌ی نویزی که داخل کارت باقی می‌ماند", tr: "kartın içinde kalan gürültülü bir kenarlık" },
  LogoLoop: { en: "a continuous logo track with predictable speed", fa: "نوار پیوسته‌ی لوگو با سرعت قابل پیش‌بینی", tr: "öngörülebilir hızlı sürekli bir logo şeridi" },
  MagicRings: { en: "concentric rings with independent timing", fa: "حلقه‌های متحدالمرکز با زمان‌بندی مستقل", tr: "bağımsız zamanlamalı eşmerkezli halkalar" },
  Magnet: { en: "a proximity field that pulls an element toward the pointer", fa: "میدان مجاورت که المان را به سمت نشانگر می‌کشد", tr: "öğeyi işaretçiye çeken bir yakınlık alanı" },
  LetterGlitch: { en: "characters that settle from noise into readable text", fa: "کاراکترهایی که از نویز به متن خوانا می‌رسند", tr: "gürültüden okunabilir metne yerleşen karakterler" },
  ShapeGrid: { en: "repeated shapes positioned on a responsive grid", fa: "شکل‌های تکرارشونده روی یک شبکه‌ی واکنش‌گرا", tr: "duyarlı bir ızgaraya yerleştirilen tekrarlı şekiller" },
  Waves: { en: "a fluid background built from layered wave paths", fa: "پس‌زمینه‌ی سیال ساخته‌شده از مسیرهای موجی لایه‌ای", tr: "katmanlı dalga yollarından oluşan akışkan bir arka plan" },
  AnimatedList: { en: "staggered list items that enter without layout jumps", fa: "آیتم‌های لیست با ورود ترتیبی و بدون پرش چیدمان", tr: "düzeni bozmadan sırayla giren liste öğeleri" },
  Counter: { en: "a number that changes through a deliberate transition", fa: "عددی که با یک انتقال حساب‌شده تغییر می‌کند", tr: "kontrollü bir geçişle değişen sayı" },
  Folder: { en: "a tactile open and close state for a folder", fa: "وضعیت لمسی باز و بسته شدن پوشه", tr: "klasör için dokunsal açılma ve kapanma durumu" },
  SpotlightCard: { en: "a card whose highlight follows the pointer", fa: "کارتی که هایلایت آن دنبال‌کننده‌ی نشانگر است", tr: "vurgusu işaretçiyi takip eden kart" },
  BlurText: { en: "blur and opacity as a readable text entrance", fa: "بلور و شفافیت برای ورود خوانای متن", tr: "okunaklı metin girişi için bulanıklık ve opaklık" },
  CircularText: { en: "letters arranged around a stable circular path", fa: "حروف چیده‌شده روی یک مسیر دایره‌ای پایدار", tr: "kararlı dairesel bir yol üzerine dizilen harfler" },
  CountUp: { en: "a value interpolated from zero to its target", fa: "مقداری که از صفر تا هدف درون‌یابی می‌شود", tr: "sıfırdan hedefe enterpole edilen değer" },
  GradientText: { en: "a moving gradient clipped to text", fa: "گرادیان متحرک برش‌خورده داخل متن", tr: "metne kırpılmış hareketli gradyan" },
  ShinyText: { en: "a restrained light sweep across a label", fa: "عبور کنترل‌شده‌ی نور از روی یک برچسب", tr: "etiket üzerinde ölçülü bir ışık geçişi" },
  TrueFocus: { en: "focus and blur states that preserve reading order", fa: "وضعیت‌های فوکوس و بلور با حفظ ترتیب خواندن", tr: "okuma sırasını koruyan odak ve bulanıklık durumları" },
};

const localized = (en: string, fa: string, tr: string): MadlabLocalized => ({ en, fa, tr });

function makeTutorial(item: ReactBitsFreeItem): MadlabTutorial {
  const focus = FOCUS[item.sourceName] ?? localized(item.title, item.title, item.title);
  const sourceComment = `// Local source: ${item.sourcePath}\n// Start with the smallest visible version of ${item.sourceName}.`;
  const exampleCode = `${sourceComment}\n\ntype ${item.sourceName}Props = {\n  className?: string;\n  color?: string;\n};\n\nexport function Example({ className, color = "#ff2a2a" }: ${item.sourceName}Props) {\n  return (\n    <div className={className} style={{ color }}>\n      {/* Add the ${item.title} behavior here. */}\n    </div>\n  );\n}`;

  const steps: TutorialStepCopy[] = [
    {
      title: localized("Define the component contract.", "قرارداد کامپوننت را تعریف کن.", "Bileşen sözleşmesini tanımlayın."),
      copy: localized(`Write down the smallest public API for ${item.title}. Keep visual decisions in props so the ${focus.en} can be reused without rewriting the component.`, `کوچک‌ترین API عمومی ${item.title} را بنویس. تصمیم‌های بصری را در propها نگه دار تا ${focus.fa} بدون بازنویسی کامپوننت قابل استفاده باشد.`, `${item.title} için en küçük herkese açık API'yi yazın. Görsel kararları prop'larda tutarak ${focus.tr} davranışını bileşeni yeniden yazmadan tekrar kullanın.`),
      code: exampleCode,
    },
    {
      title: localized("Build the quiet static state first.", "اول وضعیت ثابت و آرام را بساز.", "Önce sakin statik durumu oluşturun."),
      copy: localized(`Render the readable fallback before adding motion. The component should still communicate its purpose when JavaScript is delayed or motion is reduced.`, `قبل از اضافه کردن حرکت، fallback خوانا را رندر کن. کامپوننت باید با تأخیر جاوااسکریپت یا کاهش حرکت هم هدفش را منتقل کند.`, `Hareket eklemeden önce okunabilir yedek görünümü oluşturun. JavaScript gecikse veya hareket azaltılsa bile bileşen amacını anlatmalıdır.`),
    },
    {
      title: localized("Normalize the input and measurements.", "ورودی‌ها و اندازه‌گیری‌ها را نرمال کن.", "Girdileri ve ölçümleri normalleştirin."),
      copy: localized(`Clamp numbers, handle an empty value, and measure the real container instead of assuming the viewport. This removes most edge-case bugs before the animation starts.`, `اعداد را محدود کن، مقدار خالی را مدیریت کن و به‌جای فرض گرفتن viewport، کانتینر واقعی را اندازه بگیر. این کار بیشتر باگ‌های لبه‌ای را قبل از شروع انیمیشن حذف می‌کند.`, `Sayıları sınırlandırın, boş değerleri yönetin ve viewport'u varsaymak yerine gerçek kapsayıcıyı ölçün. Bu, animasyon başlamadan çoğu uç durum hatasını giderir.`),
    },
    {
      title: localized("Separate structure from motion.", "ساختار را از حرکت جدا کن.", "Yapıyı hareketten ayırın."),
      copy: localized(`Keep markup, state, and animation calculations in separate layers. For ${item.title}, the visual structure should remain stable while ${focus.en} changes over time.`, `مارکاپ، state و محاسبات انیمیشن را در لایه‌های جدا نگه دار. در ${item.title} ساختار بصری باید ثابت بماند و ${focus.fa} در طول زمان تغییر کند.`, `${item.title} için işaretleme, state ve animasyon hesaplarını ayrı katmanlarda tutun. Görsel yapı sabit kalırken ${focus.tr} zamanla değişmelidir.`),
    },
    {
      title: localized("Implement the one useful interaction.", "یک تعامل کاربردی را پیاده کن.", "Tek faydalı etkileşimi uygulayın."),
      copy: localized(`Add the core rule only: ${focus.en}. Use one source of truth for the active value and keep pointer, scroll, or timer listeners passive where possible.`, `فقط قانون اصلی را اضافه کن: ${focus.fa}. برای مقدار فعال یک منبع حقیقت داشته باش و listenerهای نشانگر، اسکرول یا تایمر را تا جای ممکن passive نگه دار.`, `Sadece temel kuralı ekleyin: ${focus.tr}. Aktif değer için tek bir doğruluk kaynağı kullanın; işaretçi, scroll ve zamanlayıcı dinleyicilerini mümkün olduğunda pasif tutun.`),
    },
    {
      title: localized("Use one animation loop with a clear exit.", "یک loop انیمیشن با خروج مشخص استفاده کن.", "Çıkışı net tek bir animasyon döngüsü kullanın."),
      copy: localized(`Start requestAnimationFrame only when a value changes. Keep the frame id in a ref, interpolate toward the target, and stop when the difference is below a small threshold.`, `requestAnimationFrame را فقط وقتی مقداری تغییر می‌کند شروع کن. شناسه‌ی frame را در ref نگه دار، به سمت هدف درون‌یابی کن و وقتی اختلاف از آستانه کمتر شد متوقف شو.`, `requestAnimationFrame'i yalnızca bir değer değiştiğinde başlatın. Frame kimliğini ref'te tutun, hedefe doğru enterpole edin ve fark küçük bir eşikten aşağı indiğinde durun.`),
    },
    {
      title: localized("Make the layout responsive.", "چیدمان را واکنش‌گرا کن.", "Yerleşimi duyarlı hâle getirin."),
      copy: localized(`Test narrow mobile widths, wide desktop containers, and text wrapping. Prefer CSS dimensions and ResizeObserver over hard-coded pixels tied to one screenshot.`, `عرض‌های باریک موبایل، کانتینرهای عریض دسکتاپ و شکستن متن را تست کن. به‌جای پیکسل‌های وابسته به یک اسکرین‌شات، از ابعاد CSS و ResizeObserver استفاده کن.`, `Dar mobil genişlikleri, geniş masaüstü kapsayıcılarını ve metin kırılmasını test edin. Tek bir ekran görüntüsüne bağlı sabit pikseller yerine CSS ölçüleri ve ResizeObserver kullanın.`),
    },
    {
      title: localized("Add reduced-motion and interaction fallbacks.", "fallback کاهش حرکت و تعامل را اضافه کن.", "Azaltılmış hareket ve etkileşim yedeklerini ekleyin."),
      copy: localized(`Respect prefers-reduced-motion and keep a non-motion state. Keyboard focus, readable labels, and a useful static result matter more than a decorative effect.`, `به prefers-reduced-motion احترام بگذار و وضعیت بدون حرکت داشته باش. فوکوس کیبورد، برچسب‌های خوانا و نتیجه‌ی ثابتِ کاربردی از افکت تزئینی مهم‌ترند.`, `prefers-reduced-motion ayarına uyun ve hareketsiz bir durum bırakın. Klavye odağı, okunabilir etiketler ve faydalı statik sonuç dekoratif efektten önemlidir.`),
    },
    {
      title: localized("Integrate it into a real section.", "آن را در یک سکشن واقعی ادغام کن.", "Gerçek bir bölüme entegre edin."),
      copy: localized(`Place ${item.title} behind a real message, card, or control. Keep content above decorative layers, preserve the MADBAK palette, and avoid letting motion compete with the hierarchy.`, `${item.title} را پشت یک پیام، کارت یا کنترل واقعی قرار بده. محتوا را بالای لایه‌های تزئینی نگه دار، پالت مدبک را حفظ کن و نگذار حرکت با سلسله‌مراتب رقابت کند.`, `${item.title} öğesini gerçek bir mesajın, kartın veya kontrolün içine yerleştirin. İçeriği dekoratif katmanların üstünde tutun, MADBAK paletini koruyun ve hareketin hiyerarşiyle yarışmasına izin vermeyin.`),
    },
    {
      title: localized("Tune, profile, and ship the smallest good version.", "تنظیم، پروفایل و انتشار کوچک‌ترین نسخه‌ی خوب.", "En küçük iyi sürümü ayarlayın, profilleyin ve yayınlayın."),
      copy: localized(`Check the effect on a mid-range device, remove unnecessary listeners, and keep the first release focused. Once the behavior is useful, expose only the controls that future projects really need.`, `افکت را روی یک دستگاه میان‌رده بررسی کن، listenerهای غیرضروری را حذف کن و انتشار اول را متمرکز نگه دار. وقتی رفتار مفید شد، فقط کنترل‌هایی را expose کن که پروژه‌های بعدی واقعاً لازم دارند.`, `Efekti orta seviye bir cihazda kontrol edin, gereksiz dinleyicileri kaldırın ve ilk sürümü odaklı tutun. Davranış faydalı olduğunda yalnızca gelecek projelerin gerçekten ihtiyaç duyacağı kontrolleri açın.`),
    },
  ];

  return {
    title: localized(`Build ${item.title} from zero.`, `${item.title} را از صفر بساز.`, `${item.title}’ı sıfırdan oluşturun.`),
    summary: localized(`A complete, step-by-step breakdown of ${item.title}: from the static contract to ${focus.en}, responsive behavior, accessibility, and production tuning.`, `یک راهنمای کامل و قدم‌به‌قدم برای ${item.title}؛ از قرارداد ثابت تا ${focus.fa}، رفتار واکنش‌گرا، دسترس‌پذیری و تنظیمات نهایی.`, `${item.title} için statik sözleşmeden ${focus.tr} davranışına, duyarlı tasarımdan erişilebilirlik ve üretim ayarlarına kadar eksiksiz bir adım adım rehber.`),
    mentalModel: [
      localized(`${item.title} is a small system: stable structure, explicit state, and one visual rule.`, `${item.title} یک سیستم کوچک است: ساختار پایدار، state صریح و یک قانون بصری.`, `${item.title} küçük bir sistemdir: kararlı yapı, açık state ve tek bir görsel kural.`),
      localized(`The interaction should earn its cost. If ${focus.en} is removed, the interface should remain understandable.`, `تعامل باید ارزش هزینه‌اش را داشته باشد. اگر ${focus.fa} حذف شود، رابط باید همچنان قابل فهم بماند.`, `Etkileşim maliyetini hak etmelidir. ${focus.tr} kaldırıldığında arayüz hâlâ anlaşılır kalmalıdır.`),
    ],
    level: localized("INTERMEDIATE", "متوسط", "ORTA"),
    time: localized("2–3 HOURS", "۲ تا ۳ ساعت", "2–3 SAAT"),
    stack: localized("REACT + TYPESCRIPT + CSS", "ری‌اکت + تایپ‌اسکریپت + CSS", "REACT + TYPESCRIPT + CSS"),
    steps,
    debug: [
      localized("The preview is blank: confirm the container has a real height and the client component mounted.", "پیش‌نمایش خالی است: مطمئن شو کانتینر ارتفاع واقعی دارد و کامپوننت client mount شده است.", "Önizleme boş: kapsayıcının gerçek yüksekliği olduğunu ve client bileşeninin mount edildiğini doğrulayın."),
      localized("It jumps on resize: keep one measured source of truth and cancel stale animation frames.", "هنگام resize می‌پرد: یک منبع حقیقت برای اندازه‌گیری نگه دار و frameهای قدیمی را لغو کن.", "Resize sırasında sıçrıyor: tek bir ölçüm doğruluk kaynağı kullanın ve eski animasyon framelerini iptal edin."),
      localized("It feels heavy: reduce work per frame, remove duplicate listeners, and stop the loop when idle.", "سنگین است: کار هر frame را کم کن، listenerهای تکراری را حذف کن و هنگام بیکاری loop را متوقف کن.", "Ağır hissettiriyor: frame başına işi azaltın, yinelenen dinleyicileri kaldırın ve boşta döngüyü durdurun."),
      localized("It is inaccessible: keep a readable static state, visible focus, and a reduced-motion path.", "دسترس‌پذیر نیست: وضعیت ثابت خوانا، فوکوس قابل مشاهده و مسیر کاهش حرکت را حفظ کن.", "Erişilebilir değil: okunabilir statik durumu, görünür odağı ve azaltılmış hareket yolunu koruyun."),
    ],
  };
}

export const MADLAB_TUTORIALS = Object.fromEntries(
  REACT_BITS_FREE_ITEMS.map((item) => [item.slug, makeTutorial(item)]),
) as Record<string, MadlabTutorial>;

export function getTutorialForItem(item: ReactBitsFreeItem): MadlabTutorial {
  return MADLAB_TUTORIALS[item.slug] ?? makeTutorial(item);
}

export function tutorialText(copy: MadlabLocalized, lang: LangKey): string {
  return copy[lang];
}
