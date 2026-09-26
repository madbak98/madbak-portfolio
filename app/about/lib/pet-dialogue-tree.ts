/**
 * MADBAK Pet v3 — connected bilingual conversation tree.
 * Simple nodes only. No AI. No API. Human-editable.
 */

import type { DialogueOption, PetDialogue, PetEmotion } from "./pet-dialogues";

type L = { en: string; fa: string };

const t = (en: string, fa: string): L => ({ en, fa });

const opt = (
  id: string,
  en: string,
  fa: string,
  nextDialogueId: string,
): DialogueOption => ({
  id,
  label: t(en, fa),
  nextDialogueId,
});

/** Special: MadbakPet pops the visit stack. */
export const BACK_ID = "__back";
/** Special: jump to root and clear stack. */
export const START_ID = "__start";

const back = (): DialogueOption =>
  opt("back", "← Go back", "← برگشت", BACK_ID);

const startOver = (): DialogueOption =>
  opt("start", "Start over", "از اول", START_ID);

const topics = (): DialogueOption =>
  opt("topics", "Explore another topic", "موضوع دیگه", "root");

function node(
  id: string,
  en: string,
  fa: string,
  emotion: PetEmotion,
  options: DialogueOption[],
): PetDialogue {
  return { id, text: t(en, fa), emotion, options };
}

/**
 * Main conversation tree — About CRT root + connected branches.
 * Route openings and click nodes live in pet-dialogues.ts helpers.
 */
export const PET_DIALOGUE_TREE: readonly PetDialogue[] = [
  // ═══════════════════════════════════════════
  // ROOT
  // ═══════════════════════════════════════════
  node(
    "root",
    "yo. you actually came to the About page?",
    "عه، جدی اومدی صفحهٔ About رو ببینی؟",
    "smile",
    [
      opt("r1", "What do you actually build?", "اصلاً چی می‌سازی؟", "build"),
      opt("r2", "Who is MADBAK?", "MADBAK کیه؟", "madbak"),
      opt("r3", "What tech do you use?", "با چه تکنولوژی‌هایی کار می‌کنی؟", "tech"),
      opt("r4", "Why are you inside a CRT?", "چرا داخل یه CRT هستی؟", "crt"),
      opt("r5", "Tell me something random.", "یه چیز الکی بگو.", "random"),
    ],
  ),

  // ═══════════════════════════════════════════
  // BUILD BRANCH
  // ═══════════════════════════════════════════
  node(
    "build",
    "Mostly websites.\nBut I don't really like websites that just sit there.",
    "بیشتر سایت می‌سازم.\nولی سایتایی که فقط همون‌جا وایسادن رو دوست ندارم.",
    "smile",
    [
      opt("b1", "Interactive ones?", "از مدل تعاملی؟", "build-interactive"),
      opt("b2", "What makes a website good?", "سایت خوب چه جوریه؟", "build-good"),
      opt("b3", "Landing pages?", "لندینگ؟", "build-landing"),
      opt("b4", "Web3 stuff?", "کارای Web3؟", "build-web3"),
      back(),
    ],
  ),
  node(
    "build-interactive",
    "Yeah. Interactive ones.\nThe kind where clicking something actually does something.",
    "آره. چیزای تعاملی.\nاز اونا که وقتی کلیک می‌کنی واقعاً یه اتفاقی می‌افته.",
    "smile",
    [
      opt("bi1", "Motion?", "حرکت و انیمیشن؟", "build-motion"),
      opt("bi2", "3D websites?", "سایت‌های 3D؟", "build-3d"),
      opt("bi3", "Show me your work.", "کاراتو نشون بده.", "build-work"),
      back(),
    ],
  ),
  node(
    "build-motion",
    "I like when the interface reacts.\nWhen things move for a reason.\nWhen the website feels like an actual experience.",
    "دوست دارم رابط واکنش نشون بده.\nحرکت بی‌دلیل نه.\nسایت حس یه تجربهٔ واقعی داشته باشه.",
    "smile",
    [
      opt("bm1", "Do you use GSAP?", "از GSAP استفاده می‌کنی؟", "dev-gsap"),
      opt("bm2", "What about Framer Motion?", "Framer Motion چی؟", "dev-framer"),
      opt("bm3", "Bad motion?", "حرکت بد؟", "design-motion-bad"),
      back(),
    ],
  ),
  node(
    "build-3d",
    "Sometimes.\nThat's where the laptop starts negotiating with me.",
    "گاهی.\nهمون‌جاست که لپ‌تاپ شروع می‌کنه باهام چونه زدن.",
    "smile",
    [
      opt("b3d1", "Three.js?", "Three.js؟", "dev-three"),
      opt("b3d2", "Is WebGL painful?", "WebGL دردناکه؟", "dev-webgl"),
      opt("b3d3", "Do you regret it?", "پشیمونی؟", "dev-three-regret"),
      back(),
    ],
  ),
  node(
    "build-good",
    "Honestly?\nClarity first.\nPersonality second.\nEverything else comes after.",
    "راستش؟\nاول وضوح.\nبعد شخصیت.\nبقیه بعدش.",
    "neutral",
    [
      opt("bg1", "What about animation?", "انیمیشن چی؟", "build-anim-reason"),
      opt("bg2", "Design talk?", "دربارهٔ طراحی بگو.", "design"),
      opt("bg3", "Tech side?", "سمت تکنیکال؟", "tech"),
      back(),
    ],
  ),
  node(
    "build-anim-reason",
    "Motion should have a reason.\nOtherwise it's just a website screaming for attention.",
    "حرکت باید دلیل داشته باشه.\nوگرنه فقط یه سایته که داد می‌زنه «به من نگاه کن».",
    "angry",
    [
      opt("bar1", "GSAP then?", "پس GSAP؟", "dev-gsap"),
      opt("bar2", "Design principles?", "اصول طراحی؟", "design"),
      back(),
    ],
  ),
  node(
    "build-landing",
    "Landing pages are cool when they convert AND don't look like oatmeal.\nMost of them fail the second part.",
    "لندینگ وقتی باحاله که هم تبدیل کنه، هم شبیه فرنی بی‌مزه نباشه.\nبیشترشون تو قسمت دوم می‌لنگن.",
    "smile",
    [
      opt("bl1", "Portfolio sites?", "سایت پورتفولیو؟", "build-portfolio"),
      opt("bl2", "Product interfaces?", "رابط محصول؟", "build-product"),
      back(),
    ],
  ),
  node(
    "build-portfolio",
    "A portfolio should feel like the person behind it.\nIf it looks like every other template... we have a problem.",
    "پورتفولیو باید حس آدم پشتش رو بده.\nاگه عین بقیهٔ تمپلیت‌ها باشه… مشکل داریم.",
    "angry",
    [
      opt("bp1", "Is this site that?", "این سایت همونطوریه؟", "build-this-site"),
      opt("bp2", "What do you build?", "چی می‌سازی؟", "build"),
      back(),
    ],
  ),
  node(
    "build-this-site",
    "Yeah.\nI built that.\nNo big deal.",
    "آره.\nاینو من ساختم.\nچیز خاصی نیست.",
    "smile",
    [
      opt("bts1", "Okay flex.", "باشه، فلکس کردی.", "confident-flex"),
      opt("bts2", "What's next?", "بعدش چی؟", "projects-current"),
      back(),
    ],
  ),
  node(
    "build-product",
    "Product UI is different.\nLess drama. More clarity.\nStill deserves personality though.",
    "UI محصول فرق داره.\nکمتر نمایش، بیشتر وضوح.\nولی باز هم باید شخصیت داشته باشه.",
    "neutral",
    [
      opt("bpr1", "UI / UX?", "UI / UX؟", "design-ui"),
      opt("bpr2", "Go back to build.", "برگرد به ساختن.", "build"),
      back(),
    ],
  ),
  node(
    "build-web3",
    "I've done Web3 work.\nNFTs, on-chain stuff, weird digital collectibles.\nChaotic good energy.",
    "کار Web3 هم کردم.\nNFT، چیزای آن‌چین، کالکتیبل‌های عجیب.\nانرژی آشوبِ مثبت.",
    "smile",
    [
      opt("bw1", "Still doing it?", "هنوزم می‌کنی؟", "build-web3-now"),
      opt("bw2", "More about projects.", "بیشتر دربارهٔ پروژه‌ها.", "projects"),
      back(),
    ],
  ),
  node(
    "build-web3-now",
    "Sometimes.\nDepends on whether the idea is interesting or just another boring mint page.",
    "گاهی.\nبستگی داره ایده جالب باشه یا فقط یه صفحهٔ مینتِ خسته‌کنندهٔ دیگه.",
    "neutral",
    [
      opt("bwn1", "Projects?", "پروژه‌ها؟", "projects"),
      back(),
    ],
  ),
  node(
    "build-work",
    "Check the Works section.\nThat's where the receipts live.",
    "برو بخش Works رو ببین.\nاون‌جا مدرک کاراست.",
    "smile",
    [
      opt("bw2a", "Favorite kind of project?", "چه پروژه‌ای رو بیشتر دوست داری؟", "projects-favorite"),
      opt("bw2b", "Hardest one?", "سخت‌ترینش؟", "projects-hard"),
      back(),
    ],
  ),

  // ═══════════════════════════════════════════
  // MADBAK / WHO
  // ═══════════════════════════════════════════
  node(
    "madbak",
    "MADBAK is basically the creative side of the whole thing.\nDesign, code, experiments, weird ideas... all under one roof.",
    "MADBAK در واقع سمت خلاق کل این ماجراست.\nطراحی، کد، آزمایش و ایده‌های عجیب… همه‌ش زیر یه سقف.",
    "smile",
    [
      opt("m1", "Is MADBAK a studio?", "MADBAK یه استودیوه؟", "madbak-studio"),
      opt("m2", "What does the name mean?", "اسمش یعنی چی؟", "madbak-name"),
      opt("m3", "Who is Babak?", "بابک کیه؟", "babak"),
      opt("m4", "What kind of work?", "چه جور کاری؟", "build"),
      back(),
    ],
  ),
  node(
    "madbak-studio",
    "Kind of.\nMore like one human with too many tabs open and a pixel version of himself for PR.",
    "یه جورهایی.\nبیشتر یه آدم با کلی تب باز و یه نسخهٔ پیکسلی از خودش برای روابط‌عمومی.",
    "smile",
    [
      opt("ms1", "So you're the PR?", "پس تو روابط‌عمومی‌ای؟", "madbak-pr"),
      opt("ms2", "Where based?", "کجا مستقره؟", "madbak-where"),
      back(),
    ],
  ),
  node(
    "madbak-pr",
    "Bro... that's literally me.\nWell — Babak is the human. MADBAK is the name. I'm the pixel department.",
    "داداش… خودمم دیگه.\nخب — بابک انسانه. MADBAK اسمشه. من بخش پیکسلی‌ام.",
    "smile",
    [
      opt("mp1", "Tell me about Babak.", "دربارهٔ بابک بگو.", "babak"),
      opt("mp2", "CRT story?", "داستان CRT؟", "crt"),
      back(),
    ],
  ),
  node(
    "madbak-name",
    "MADBAK comes from the last name.\nRavanbakhsh → MADBAK.\nShort. Sharp. Easy to shout across a room.",
    "MADBAK از فامیلی میاد.\nRavanbakhsh → MADBAK.\nکوتاه. تیز. راحت داد بزنی تو یه اتاق.",
    "neutral",
    [
      opt("mn1", "Who is Babak?", "بابک کیه؟", "babak"),
      opt("mn2", "Studio vibe?", "حس استودیو؟", "madbak-studio"),
      back(),
    ],
  ),
  node(
    "babak",
    "Babak Ravanbakhsh.\nDesigner-developer hybrid.\nStarted in graphic design, then code showed up like an uninvited co-founder.",
    "بابک روان‌بخش.\nنیمه‌طراح، نیمه‌توسعه‌دهنده.\nاز گرافیک شروع کرد؛ بعد کد اومد مثل همبنیان‌گذار ناخونده.",
    "smile",
    [
      opt("bb1", "Where is he based?", "کجا زندگی می‌کنه؟", "madbak-where"),
      opt("bb2", "Design background?", "پس‌زمینهٔ طراحی؟", "babak-design"),
      opt("bb3", "Does he freelance?", "فریلنس کار می‌کنه؟", "projects-freelance"),
      back(),
    ],
  ),
  node(
    "babak-design",
    "Typography. Composition. Visual hierarchy.\nThen frontend ate his free time and somehow that became the brand.",
    "تایپوگرافی. ترکیب‌بندی. سلسله‌مراتب بصری.\nبعد Frontend وقت آزادش رو خورد و یه جوری همون شد برند.",
    "smile",
    [
      opt("bd1", "Design talk.", "بریم سراغ طراحی.", "design"),
      opt("bd2", "Dev talk.", "بریم سراغ کد.", "tech"),
      back(),
    ],
  ),
  node(
    "madbak-where",
    "Istanbul base.\nGlobal chaos.\nTimezone: ambitious.",
    "پایه تو استانبول.\nآشوب جهانی.\nمنطقه‌زمانی: جاه‌طلب.",
    "smile",
    [
      opt("mw1", "Remote work?", "دورکاری؟", "madbak-remote"),
      opt("mw2", "Back to MADBAK.", "برگرد به MADBAK.", "madbak"),
      back(),
    ],
  ),
  node(
    "madbak-remote",
    "I'm technically inside a computer.\nSo yes, I'm working remotely.",
    "از نظر فنی من داخل یه کامپیوترم.\nپس آره، دورکاری می‌کنم.",
    "smile",
    [
      opt("mr1", "Something random.", "یه چیز الکی.", "random"),
      back(),
    ],
  ),

  // ═══════════════════════════════════════════
  // TECH / DEVELOPMENT
  // ═══════════════════════════════════════════
  node(
    "tech",
    "Mostly React, Next.js, TypeScript, Tailwind...\nand whatever else the project decides to demand.",
    "بیشتر React، Next.js، TypeScript، Tailwind…\nو هر چیزی که پروژه تصمیم بگیره طلب کنه.",
    "smile",
    [
      opt("t1", "Why React?", "چرا React؟", "dev-react"),
      opt("t2", "Next.js?", "Next.js؟", "dev-next"),
      opt("t3", "Three.js?", "Three.js؟", "dev-three"),
      opt("t4", "GSAP / animation?", "GSAP / انیمیشن؟", "dev-gsap"),
      opt("t5", "Do you code everything?", "همه‌چیز رو خودت کد می‌زنی؟", "dev-everything"),
      back(),
    ],
  ),
  node(
    "dev-react",
    "React?\nYeah.\nWe have a complicated relationship.",
    "React؟\nآره.\nرابطه‌مون یه کم پیچیده‌ست.",
    "smile",
    [
      opt("dr1", "Why React?", "چرا React؟", "dev-react-why"),
      opt("dr2", "What's annoying?", "چی اذیتت می‌کنه؟", "dev-react-annoy"),
      opt("dr3", "Next.js?", "Next.js؟", "dev-next"),
      back(),
    ],
  ),
  node(
    "dev-react-why",
    "Components. Ecosystem. Muscle memory.\nAlso because the alternative is reinventing buttons forever.",
    "کامپوننت. اکوسیستم. حافظهٔ عضلانی.\nضمن اینکه گزینه‌ش اینه تا ابد دکمه اختراع کنی.",
    "neutral",
    [
      opt("drw1", "TypeScript?", "TypeScript؟", "dev-ts"),
      opt("drw2", "Hooks drama?", "درامای Hook؟", "dev-hooks"),
      back(),
    ],
  ),
  node(
    "dev-react-annoy",
    "useEffect has entered the chat.\nAlso seventeen buttons named ButtonFinalFinal2.",
    "useEffect وارد چت شد.\nهمین‌طور هفده تا دکمه به اسم ButtonFinalFinal2.",
    "angry",
    [
      opt("dra1", "State management?", "مدیریت state؟", "dev-state"),
      opt("dra2", "Clean code?", "کد تمیز؟", "dev-clean"),
      back(),
    ],
  ),
  node(
    "dev-hooks",
    "If you don't understand your dependency array, just blink twice.\nI won't judge. Much.",
    "اگه dependency array رو نمی‌فهمی، فقط دوبار پلک بزن.\nقضاوت نمی‌کنم. زیاد.",
    "smile",
    [opt("dh1", "More React.", "بیشتر React.", "dev-react"), back()],
  ),
  node(
    "dev-next",
    "Next.js is basically where I go when a simple React project decides to become a government project.",
    "Next.js همون جاییه که وقتی یه پروژهٔ سادهٔ React تصمیم می‌گیره پروژهٔ دولتی بشه، می‌رم سراغش.",
    "neutral",
    [
      opt("dn1", "App Router?", "App Router؟", "dev-app-router"),
      opt("dn2", "Vercel?", "Vercel؟", "dev-vercel"),
      opt("dn3", "SEO?", "SEO؟", "dev-seo"),
      back(),
    ],
  ),
  node(
    "dev-app-router",
    "Powerful.\nAlso occasionally makes you question your life choices at 2 AM.",
    "قدرتمنده.\nگاهی هم ساعت ۲ صبح وادارت می‌کنه به انتخاب‌های زندگیت شک کنی.",
    "sleepy",
    [opt("dar1", "Back to Next.", "برگرد به Next.", "dev-next"), back()],
  ),
  node(
    "dev-vercel",
    "Deploy. Preview. Cry less.\nMostly.",
    "دیپلوی. پریویو. کمتر گریه کن.\nتقریباً.",
    "smile",
    [opt("dv1", "GitHub?", "GitHub؟", "dev-github"), back()],
  ),
  node(
    "dev-github",
    "git commit -m \"please work\"\ngit push and pray.",
    "git commit -m \"لطفاً کار کن\"\ngit push و دعا کن.",
    "smile",
    [
      opt("dg1", "Friday deploys?", "دیپلوی جمعه؟", "meme-friday"),
      back(),
    ],
  ),
  node(
    "dev-ts",
    "I use TypeScript because apparently finding bugs before production is considered a good thing.",
    "TypeScript استفاده می‌کنم چون ظاهراً پیدا کردن باگ قبل از Production چیز خوبیه.",
    "smile",
    [
      opt("dts1", "JavaScript without it?", "بدونش JavaScript؟", "dev-js"),
      back(),
    ],
  ),
  node(
    "dev-js",
    "JavaScript is fun until it isn't.\nTypeScript is the seatbelt.",
    "JavaScript تا وقتی که نیست باحاله.\nTypeScript همون کمربند ایمنیه.",
    "neutral",
    [back()],
  ),
  node(
    "dev-three",
    "Three.js is what happens when a website decides a normal rectangle isn't enough.",
    "Three.js همون چیزیه که وقتی یه سایت تصمیم می‌گیره یه مستطیل معمولی کافی نیست، اتفاق می‌افته.",
    "smile",
    [
      opt("dt1", "Do you like 3D?", "3D دوست داری؟", "dev-3d-like"),
      opt("dt2", "Isn't WebGL painful?", "WebGL دردناکه؟", "dev-webgl"),
      opt("dt3", "Do you regret it?", "پشیمونی؟", "dev-three-regret"),
      back(),
    ],
  ),
  node(
    "dev-3d-like",
    "When it works? Obsessed.\nWhen the GPU fans scream? Less so.",
    "وقتی کار می‌کنه؟ معتادم.\nوقتی فن‌های GPU جیغ می‌کشن؟ کمتر.",
    "smile",
    [opt("d3l1", "WebGL pain.", "درد WebGL.", "dev-webgl"), back()],
  ),
  node(
    "dev-webgl",
    "WebGL?\nYeah.\nThat's the part where your laptop starts negotiating with you.",
    "WebGL؟\nآره.\nهمون قسمتیه که لپ‌تاپت شروع می‌کنه باهات چونه زدن.",
    "angry",
    [
      opt("dw1", "Still worth it?", "ارزشش رو داره؟", "dev-three-worth"),
      back(),
    ],
  ),
  node(
    "dev-three-regret",
    "Every time.\nAnd then I do it again.",
    "هر بار.\nو بعد دوباره انجامش می‌دم.",
    "angry",
    [opt("dtr1", "Worth it though?", "ولی ارزشش رو داره؟", "dev-three-worth"), back()],
  ),
  node(
    "dev-three-worth",
    "When the scene looks sick?\nAbsolutely.\nOkay, I'll admit it. That animation kinda goes hard.",
    "وقتی صحنه خفن به نظر میاد؟\nقطعاً.\nباشه، اعتراف می‌کنم. اون انیمیشن واقعاً می‌ترکونه.",
    "smile",
    [topics(), back()],
  ),
  node(
    "dev-gsap",
    "Yeah.\nGSAP is basically how I convince pixels to move.\nMy bank account does not move. Just the pixels.",
    "آره.\nGSAP همون چیزیه که باهاش پیکسل‌ها رو قانع می‌کنم حرکت کنن.\nحساب بانکی‌م تکون نمی‌خوره. فقط پیکسل‌ها.",
    "smile",
    [
      opt("dg2", "Framer Motion?", "Framer Motion؟", "dev-framer"),
      opt("dg3", "CSS animation?", "انیمیشن با CSS؟", "dev-css-anim"),
      back(),
    ],
  ),
  node(
    "dev-framer",
    "Framer Motion is nice for React-native feeling motion.\nGSAP when I need full control and timeline drama.",
    "Framer Motion برای حرکتِ تو حسِ React خوبه.\nGSAP وقتی کنترل کامل و درامای تایم‌لاین می‌خوام.",
    "neutral",
    [back()],
  ),
  node(
    "dev-css-anim",
    "CSS is easy.\nSaid nobody after opening the inspector at 3 AM.",
    "CSS آسونه.\nاینو کسی نگفته که ساعت ۳ صبح Inspector رو باز کرده باشه.",
    "angry",
    [
      opt("dca1", "Safari?", "Safari؟", "dev-safari"),
      opt("dca2", "Responsive?", "ریسپانسیو؟", "dev-responsive"),
      back(),
    ],
  ),
  node(
    "dev-safari",
    "Mobile Safari has personally tested my character.",
    "Safari موبایل شخصاً شخصیتم رو به چالش کشیده.",
    "angry",
    [back()],
  ),
  node(
    "dev-responsive",
    "Responsive design means making your beautiful desktop idea survive a phone screen.",
    "ریسپانسیو یعنی کاری کنی ایدهٔ خوشگل دسکتاپت رو صفحهٔ موبایل هم زنده بمونه.",
    "neutral",
    [back()],
  ),
  node(
    "dev-state",
    "State management is just convincing your UI to remember what you told it five seconds ago.",
    "مدیریت state یعنی قانع کردن UI که چیزی که پنج ثانیه پیش بهش گفتی یادش بمونه.",
    "neutral",
    [back()],
  ),
  node(
    "dev-clean",
    "I like clean code.\nI also like pretending yesterday's code never happened.",
    "کد تمیز دوست دارم.\nهمین‌طور دوست دارم وانمود کنم کد دیروز اصلاً وجود نداشته.",
    "smile",
    [back()],
  ),
  node(
    "dev-everything",
    "Mostly yes.\nDesign + frontend + the weird middle.\nAI helps with the repetitive suffering.",
    "بیشتر وقتا آره.\nطراحی + فرانت + وسطِ عجیب ماجرا.\nAI کمک می‌کنه با عذاب‌های تکراری.",
    "smile",
    [
      opt("de1", "AI talk?", "دربارهٔ AI؟", "ai"),
      opt("de2", "Design side?", "سمت طراحی؟", "design"),
      back(),
    ],
  ),
  node(
    "dev-seo",
    "SEO isn't glamorous.\nBut neither is a beautiful site nobody finds.",
    "SEO خوشگل نیست.\nولی سایت خوشگلی که کسی پیداش نکنه هم خوشگل نیست.",
    "neutral",
    [
      opt("ds1", "Accessibility?", "دسترس‌پذیری؟", "dev-a11y"),
      opt("ds2", "Performance?", "پرفورمنس؟", "dev-perf"),
      back(),
    ],
  ),
  node(
    "dev-a11y",
    "If it only works with a mouse and perfect eyesight, it's not finished.",
    "اگه فقط با موس و بینایی کامل کار کنه، تموم نشده.",
    "neutral",
    [back()],
  ),
  node(
    "dev-perf",
    "Fast feels premium.\nSlow feels like the site is apologizing.",
    "سریع حس لوکس می‌ده.\nکند حس عذرخواهی سایت رو می‌ده.",
    "smile",
    [back()],
  ),

  // ═══════════════════════════════════════════
  // DESIGN
  // ═══════════════════════════════════════════
  node(
    "design",
    "I like websites that feel like experiences, not spreadsheets with rounded corners.",
    "من سایتایی رو دوست دارم که حس تجربه بدن، نه اکسل با گوشه‌های گرد.",
    "smile",
    [
      opt("d1", "What makes good design?", "طراحی خوب چیه؟", "design-good"),
      opt("d2", "Minimal?", "مینیمال؟", "design-minimal"),
      opt("d3", "Brutalist?", "بروتالیست؟", "design-brutal"),
      opt("d4", "Typography?", "تایپوگرافی؟", "design-type"),
      opt("d5", "UI / UX?", "UI / UX؟", "design-ui"),
      back(),
    ],
  ),
  node(
    "design-good",
    "Honestly?\nClarity first.\nPersonality second.\nEverything else comes after.",
    "راستش؟\nاول وضوح.\nبعد شخصیت.\nبقیه بعدش.",
    "neutral",
    [
      opt("dgd1", "Motion?", "حرکت؟", "design-motion"),
      opt("dgd2", "Spacing?", "فاصله‌گذاری؟", "design-spacing"),
      back(),
    ],
  ),
  node(
    "design-minimal",
    "Minimal doesn't mean empty.\nIt means every pixel has a job.",
    "مینیمال یعنی خالی نیست.\nیعنی هر پیکسل یه کاری داره.",
    "neutral",
    [opt("dm1", "Dark mode?", "دارک‌مود؟", "design-dark"), back()],
  ),
  node(
    "design-brutal",
    "Brutalist design?\nBig type. Strong grid. Zero corporate oatmeal.",
    "بروتالیست؟\nتایپ بزرگ. گرید قوی. صفر درصد فرنی شرکتی.",
    "smile",
    [back()],
  ),
  node(
    "design-type",
    "Typography is basically architecture, but the buildings are letters.",
    "تایپوگرافی در اصل معماریه؛ فقط ساختمون‌هاش حروفن.",
    "neutral",
    [
      opt("dtp1", "Grid systems?", "سیستم گرید؟", "design-grid"),
      back(),
    ],
  ),
  node(
    "design-grid",
    "A strong grid is freedom, not a cage.\nWeird take, I know.",
    "گرید قوی آزادی می‌ده، نه قفس.\nمی‌دونم حرف عجیبیه.",
    "smile",
    [back()],
  ),
  node(
    "design-ui",
    "UI is what you see.\nUX is whether you swear at it.\nI try to minimize the swearing.",
    "UI چیزیه که می‌بینی.\nUX اینه که سرش فحش می‌دی یا نه.\nسعی می‌کنم فحش رو کم کنم.",
    "smile",
    [
      opt("dui1", "Interaction design?", "طراحی تعامل؟", "design-ix"),
      back(),
    ],
  ),
  node(
    "design-ix",
    "Give me a boring brief and five minutes.\nI'll probably make it unnecessarily cinematic.",
    "یه بریف خسته‌کننده بهم بده و پنج دقیقه صبر کن.\nاحتمالاً بی‌خودی سینمایی‌ش می‌کنم.",
    "smile",
    [back()],
  ),
  node(
    "design-motion",
    "Good motion should explain something.\nBad motion just screams \"look at me.\"",
    "حرکت خوب باید یه چیزی رو توضیح بده.\nحرکت بد فقط داد می‌زنه «به من نگاه کن.»",
    "neutral",
    [
      opt("dmo1", "Bad examples?", "مثال بد؟", "design-motion-bad"),
      opt("dmo2", "GSAP?", "GSAP؟", "dev-gsap"),
      back(),
    ],
  ),
  node(
    "design-motion-bad",
    "If the homepage is bouncing for no reason, the homepage is lying.",
    "اگه صفحهٔ اول بی‌دلیل داره می‌پره بالا پایین، داره دروغ می‌گه.",
    "angry",
    [back()],
  ),
  node(
    "design-spacing",
    "That button is 4 pixels off.\nI can feel it.",
    "اون دکمه چهار پیکسل جاش اشتباهه.\nمن حسش می‌کنم.",
    "angry",
    [
      opt("dsp1", "Designers vs devs?", "طراح در برابر دولوپر؟", "design-vs-dev"),
      back(),
    ],
  ),
  node(
    "design-vs-dev",
    "Designers and developers arguing about 2 pixels.\nNature is healing.",
    "طراح‌ها و دولوپرها سر دو پیکسل دارن دعوا می‌کنن.\nطبیعت در حال بهبوده.",
    "angry",
    [back()],
  ),
  node(
    "design-dark",
    "Dark mode isn't a personality trait.\nBut it does look good.",
    "دارک‌مود ویژگی شخصیتی نیست.\nولی خب قشنگه.",
    "smile",
    [back()],
  ),

  // ═══════════════════════════════════════════
  // AI / VIBE CODING (topic only — no AI connected)
  // ═══════════════════════════════════════════
  node(
    "ai",
    "AI writes code.\nI write the prompt.\nTogether we create problems nobody asked for.",
    "AI کد می‌نویسه.\nمن پرامپت می‌نویسم.\nبا هم مشکلاتی می‌سازیم که هیچ‌کس نخواسته.",
    "smile",
    [
      opt("a1", "Vibe coding?", "وایب‌کدینگ؟", "ai-vibe"),
      opt("a2", "Cursor?", "Cursor؟", "ai-cursor"),
      opt("a3", "Does AI replace you?", "AI جایت رو می‌گیره؟", "ai-replace"),
      opt("a4", "AI mistakes?", "اشتباهات AI؟", "ai-mistakes"),
      back(),
    ],
  ),
  node(
    "ai-vibe",
    "Vibe coding is just software development with suspicious amounts of confidence.",
    "وایب‌کدینگ همون توسعهٔ نرم‌افزاره با یه مقدار مشکوک اعتمادبه‌نفس.",
    "smile",
    [
      opt("av1", "Best workflow?", "بهترین روش کار؟", "ai-workflow"),
      back(),
    ],
  ),
  node(
    "ai-cursor",
    "Cursor said \"I fixed it.\"\nI checked the code.\nIt absolutely did not.",
    "Cursor گفت «درستش کردم.»\nکد رو چک کردم.\nاصلاً درستش نکرده بود.",
    "angry",
    [
      opt("ac1", "Still useful?", "بازم مفیده؟", "ai-useful"),
      back(),
    ],
  ),
  node(
    "ai-replace",
    "I don't replace developers with AI.\nI replace repetitive suffering with AI.",
    "من دولوپرها رو با AI عوض نمی‌کنم.\nعذاب‌های تکراری رو با AI عوض می‌کنم.",
    "smile",
    [back()],
  ),
  node(
    "ai-mistakes",
    "AI is amazing until it confidently invents a package that has never existed.",
    "AI فوق‌العاده‌ست تا وقتی با اعتمادبه‌نفس یه پکیج اختراع کنه که هیچ‌وقت وجود نداشته.",
    "angry",
    [
      opt("am1", "Classic ones?", "کلاسیک‌ها؟", "ai-classic"),
      back(),
    ],
  ),
  node(
    "ai-classic",
    "Bro said \"simple implementation\" and generated twelve files.\nI asked for a button. It gave me a design system.",
    "داداش گفت «یه پیاده‌سازی ساده» و بعد دوازده تا فایل ساخت.\nمن یه دکمه خواستم. بهم Design System داد.",
    "angry",
    [back()],
  ),
  node(
    "ai-workflow",
    "The best AI workflow?\nKnow enough code to realize when the AI is lying.",
    "بهترین روش کار با AI؟\nاون‌قدر کد بلد باشی که بفهمی کی داره بهت دروغ می‌گه.",
    "neutral",
    [back()],
  ),
  node(
    "ai-useful",
    "I use AI as a tool.\nThe tool occasionally uses me as emotional support.",
    "من از AI به‌عنوان ابزار استفاده می‌کنم.\nالبته بعضی وقتا خود ابزار از من به‌عنوان تکیه‌گاه روحی استفاده می‌کنه.",
    "smile",
    [back()],
  ),

  // ═══════════════════════════════════════════
  // PROJECTS / WORK
  // ═══════════════════════════════════════════
  node(
    "projects",
    "Projects are where the theory gets punched in the face by reality.",
    "پروژه‌ها جایین که تئوری می‌خوره تو صورت واقعیت.",
    "smile",
    [
      opt("p1", "What are you working on?", "الان روی چی کار می‌کنی؟", "projects-current"),
      opt("p2", "Hardest website?", "سخت‌ترین سایت؟", "projects-hard"),
      opt("p3", "Proud of?", "به کدومش افتخار می‌کنی؟", "projects-proud"),
      opt("p4", "Client work?", "کار با مشتری؟", "projects-freelance"),
      opt("p5", "Favorite kind?", "چه نوعی رو دوست داری؟", "projects-favorite"),
      back(),
    ],
  ),
  node(
    "projects-current",
    "This site. Experiments in MADLAB. Client work that actually needs personality.\nAlways a few tabs too many.",
    "همین سایت. آزمایش‌های MADLAB. کارهایی که واقعاً شخصیت می‌خوان.\nهمیشه چند تا تب زیادی بازه.",
    "smile",
    [
      opt("pc1", "MADLAB?", "MADLAB؟", "madlab"),
      back(),
    ],
  ),
  node(
    "projects-hard",
    "Usually the ones that look simple.\nSimple is expensive.",
    "معمولاً همونا که ساده به نظر میان.\nساده گرونه.",
    "neutral",
    [back()],
  ),
  node(
    "projects-proud",
    "Anything where the motion earned its place.\nAnd this weird CRT situation, honestly.",
    "هر چیزی که حرکتش جاش رو دربیاره.\nو صادقانه، همین وضعیت عجیب CRT.",
    "smile",
    [
      opt("pp1", "CRT story.", "داستان CRT.", "crt"),
      back(),
    ],
  ),
  node(
    "projects-freelance",
    "Yes. Freelance / project-based.\nIf the brief is boring, I'll probably make it unnecessarily cinematic anyway.",
    "آره. فریلنس / پروژه‌ای.\nاگه بریف خسته‌کننده باشه، احتمالاً باز هم بی‌خودی سینمایی‌ش می‌کنم.",
    "smile",
    [
      opt("pf1", "What projects do you take?", "چه پروژه‌هایی قبول می‌کنی؟", "projects-take"),
      back(),
    ],
  ),
  node(
    "projects-take",
    "Websites with personality.\nInterfaces that react.\nCreative tech that's allowed to be a little weird.",
    "سایتایی با شخصیت.\nرابط‌هایی که واکنش دارن.\nتک خلاقانه‌ای که اجازه داره یه کم عجیب باشه.",
    "smile",
    [topics(), back()],
  ),
  node(
    "projects-favorite",
    "Interactive websites.\nThe kind that make normal websites look unemployed.",
    "سایت‌های تعاملی.\nاز اونا که سایتای معمولی کنارشون بیکار به نظر می‌رسن.",
    "smile",
    [opt("pfv1", "More about build.", "بیشتر دربارهٔ ساختن.", "build"), back()],
  ),
  node(
    "madlab",
    "MADLAB is the personal lab.\nComponents, interactions, visual experiments that may or may not escape containment.",
    "MADLAB همون آزمایشگاه شخصیه.\nکامپوننت، تعامل، آزمایش بصری که ممکنه از قرنطینه فرار کنن یا نکنن.",
    "smile",
    [
      opt("ml1", "Can I poke around?", "می‌تونم بچرخم؟", "madlab-poke"),
      back(),
    ],
  ),
  node(
    "madlab-poke",
    "Welcome to the lab.\nDon't touch anything.\n...okay fine, touch things.",
    "به آزمایشگاه خوش اومدی.\nبه هیچی دست نزن.\n…باشه، دست بزن.",
    "smile",
    [topics(), back()],
  ),

  // ═══════════════════════════════════════════
  // CRT / PET
  // ═══════════════════════════════════════════
  node(
    "crt",
    "Because apparently a normal profile picture wasn't weird enough.",
    "چون ظاهراً یه عکس پروفایل معمولی به اندازهٔ کافی عجیب نبود.",
    "smile",
    [
      opt("c1", "How did you get in there?", "چطوری اومدی داخلش؟", "crt-how"),
      opt("c2", "Is it cozy?", "راحتی؟", "crt-cozy"),
      opt("c3", "Who built this?", "کی اینو ساخته؟", "crt-built"),
      back(),
    ],
  ),
  node(
    "crt-how",
    "Classified.",
    "محرمانه‌ست.",
    "neutral",
    [
      opt("ch1", "Come on.", "بیا دیگه.", "crt-how-2"),
      opt("ch2", "Seriously?", "جدی؟", "crt-how-3"),
      opt("ch3", "Okay, fair.", "باشه، منطقیه.", "crt-fair"),
    ],
  ),
  node(
    "crt-how-2",
    "Fine.\nThere was coffee, a bad idea, and an Old PC PNG.\nThe rest is history.",
    "باشه.\nقهوه بود، یه ایدهٔ بد، و یه PNG از یه کامپیوتر قدیمی.\nبقیه‌ش تاریخه.",
    "smile",
    [opt("ch2a", "Snacks?", "اسنک؟", "random-snacks"), back()],
  ),
  node(
    "crt-how-3",
    "Dead serious.\nDon't ask me how I got inside this monitor.",
    "کاملاً جدی.\nنپرس چطوری اومدم داخل این مانیتور.",
    "angry",
    [opt("ch3a", "Okay, fair.", "باشه، منطقیه.", "crt-fair"), back()],
  ),
  node(
    "crt-fair",
    "Honestly?\nThis CRT is doing most of the work around here.",
    "راستش؟\nبیشتر کار اینجا رو همین CRT انجام می‌ده.",
    "smile",
    [topics(), back()],
  ),
  node(
    "crt-cozy",
    "My office is a 90s computer.\nThe rent is surprisingly reasonable.",
    "دفتر کار من یه کامپیوتر دههٔ نوده.\nاجاره‌ش برخلاف انتظار خیلی مناسبه.",
    "smile",
    [back()],
  ),
  node(
    "crt-built",
    "Yeah. I built that.\nThe pixel guy. The CRT. The whole bit.",
    "آره. اینو من ساختم.\nآدمک پیکسلی. CRT. کل ماجرا.",
    "smile",
    [opt("cb1", "Confident much?", "یه کم اعتمادبه‌نفس؟", "confident-flex"), back()],
  ),

  // ═══════════════════════════════════════════
  // RANDOM
  // ═══════════════════════════════════════════
  node(
    "random",
    "You came all the way here just to talk to a pixelated version of me.\nRespect.",
    "تا اینجا اومدی فقط که با نسخهٔ پیکسلی من حرف بزنی.\nاحترام.",
    "smile",
    [
      opt("rn1", "Another random.", "یکی دیگه الکی.", "random-2"),
      opt("rn2", "Are you sleepy?", "خواب‌آلودی؟", "sleepy"),
      opt("rn3", "Developer meme.", "میم دولوپر.", "meme"),
      back(),
    ],
  ),
  node(
    "random-2",
    "I'm technically inside a computer.\nSo yes, I'm working remotely.",
    "از نظر فنی من داخل یه کامپیوترم.\nپس آره، دورکاری می‌کنم.",
    "smile",
    [opt("r2a", "More.", "بیشتر.", "random-3"), back()],
  ),
  node(
    "random-3",
    "This computer has more personality than some websites I've seen.",
    "این کامپیوتر از بعضی سایتایی که دیدم شخصیت بیشتری داره.",
    "smile",
    [opt("r3a", "More.", "بیشتر.", "random-4"), back()],
  ),
  node(
    "random-4",
    "You found the secret little guy.\nCongratulations.",
    "آدمک کوچیک مخفی رو پیدا کردی.\nتبریک.",
    "smile",
    [opt("r4a", "More.", "بیشتر.", "random-5"), back()],
  ),
  node(
    "random-5",
    "I have absolutely no idea what I'm doing.\nBut the animation looks sick.",
    "اصلاً نمی‌دونم دارم چی کار می‌کنم.\nولی انیمیشن خیلی خفنه.",
    "smile",
    [opt("r5a", "More.", "بیشتر.", "random-snacks"), back()],
  ),
  node(
    "random-snacks",
    "I was promised snacks.\nThere are no snacks.",
    "به من قول اسنک داده بودن.\nهیچ اسنکی وجود نداره.",
    "angry",
    [opt("rs1", "Salary in pixels?", "حقوق با پیکسل؟", "random-salary"), back()],
  ),
  node(
    "random-salary",
    "Do pixels count as a salary?\nAsking for myself.",
    "پیکسل‌ها به‌عنوان حقوق حساب می‌شن؟\nبرای خودم می‌پرسم.",
    "smile",
    [opt("rsa1", "More chaos.", "آشوب بیشتر.", "random-chaos"), back()],
  ),
  node(
    "random-chaos",
    "Anyway... welcome to the weird side of the portfolio.",
    "به هر حال… به قسمت عجیب پورتفولیو خوش اومدی.",
    "smile",
    [opt("rc1", "End this?", "تمومش کنیم؟", "end"), topics(), back()],
  ),

  // ═══════════════════════════════════════════
  // MEMES
  // ═══════════════════════════════════════════
  node(
    "meme",
    "It works on my machine.\nTherefore, the problem is your machine.",
    "روی سیستم من کار می‌کنه.\nپس مشکل از سیستم توئه.",
    "smile",
    [
      opt("mm1", "Another.", "یکی دیگه.", "meme-2"),
      back(),
    ],
  ),
  node(
    "meme-2",
    "404: motivation not found.",
    "۴۰۴: انگیزه پیدا نشد.",
    "sleepy",
    [opt("mm2", "Another.", "یکی دیگه.", "meme-3"), back()],
  ),
  node(
    "meme-3",
    "npm install.\nnpm regret.",
    "npm install.\nnpm پشیمونی.",
    "angry",
    [opt("mm3", "Another.", "یکی دیگه.", "meme-4"), back()],
  ),
  node(
    "meme-4",
    "Production is just localhost with consequences.",
    "Production فقط localhostـه، با عواقب.",
    "smile",
    [opt("mm4", "Friday deploys?", "دیپلوی جمعه؟", "meme-friday"), back()],
  ),
  node(
    "meme-friday",
    "Never deploy on Friday.\nUnless you enjoy character development.",
    "جمعه هیچ‌وقت دیپلوی نکن.\nمگر اینکه از رشد شخصیتی لذت ببری.",
    "angry",
    [opt("mm5", "Console.log?", "Console.log؟", "meme-console"), back()],
  ),
  node(
    "meme-console",
    "Console.log is my therapist.",
    "Console.log روان‌شناس منه.",
    "smile",
    [topics(), back()],
  ),

  // ═══════════════════════════════════════════
  // SLEEPY
  // ═══════════════════════════════════════════
  node(
    "sleepy",
    "It's not a bug.\nI'm just tired.",
    "این باگ نیست.\nفقط خسته‌ام.",
    "sleepy",
    [
      opt("sl1", "Five more minutes?", "پنج دقیقه دیگه؟", "sleepy-2"),
      opt("sl2", "Battery status?", "وضعیت باتری؟", "sleepy-3"),
      back(),
    ],
  ),
  node(
    "sleepy-2",
    "Five more minutes...\nthen I'll refactor everything.",
    "پنج دقیقه دیگه…\nبعدش همه‌چیز رو ریفکتور می‌کنم.",
    "sleepy",
    [opt("sl2a", "And if you fall asleep?", "اگه خوابت ببره؟", "sleepy-4"), back()],
  ),
  node(
    "sleepy-3",
    "My brain is currently running on 2% battery.",
    "مغزم الان با ۲٪ باتری داره کار می‌کنه.",
    "sleepy",
    [back()],
  ),
  node(
    "sleepy-4",
    "If I fall asleep, just tell the client it's an animation.",
    "اگه خوابم برد، فقط به مشتری بگو یه انیمیشن بوده.",
    "sleepy",
    [topics(), back()],
  ),
  node(
    "sleepy-idle",
    "Can we talk tomorrow?\nI have... absolutely nothing scheduled.",
    "می‌شه فردا حرف بزنیم؟\nمن… اصلاً هیچ برنامه‌ای ندارم.",
    "sleepy",
    [startOver(), topics(), back()],
  ),

  // ═══════════════════════════════════════════
  // CONFIDENT
  // ═══════════════════════════════════════════
  node(
    "confident-flex",
    "Okay, I'll admit it.\nThat animation kinda goes hard.",
    "باشه، اعتراف می‌کنم.\nاون انیمیشن واقعاً می‌ترکونه.",
    "smile",
    [
      opt("cf1", "This site looks good.", "این سایت خوب شده.", "confident-site"),
      back(),
    ],
  ),
  node(
    "confident-site",
    "You know what?\nThis site actually looks pretty damn good.",
    "می‌دونی چیه؟\nاین سایت واقعاً خیلی خوب شده.",
    "smile",
    [opt("cs1", "MADBAK lore?", "داستان MADBAK؟", "madbak"), topics(), back()],
  ),

  // ═══════════════════════════════════════════
  // ENDINGS
  // ═══════════════════════════════════════════
  node(
    "end",
    "Okay, I think you know enough about me now.",
    "باشه، فکر کنم دیگه به اندازهٔ کافی درباره‌م می‌دونی.",
    "smile",
    [
      startOver(),
      topics(),
      opt("e1", "Bye", "خداحافظ", "end-bye"),
    ],
  ),
  node(
    "end-lore",
    "That's all the lore I can reveal for now.",
    "فعلاً بیشتر از این نمی‌تونم از پشت صحنه لو بدم.",
    "neutral",
    [startOver(), topics()],
  ),
  node(
    "end-bye",
    "Alright.\nGo explore the rest of the site.",
    "خب.\nبرو بقیهٔ سایت رو هم بگرد.",
    "smile",
    [startOver(), opt("eb1", "One more thing.", "یه چیز دیگه.", "root")],
  ),
  node(
    "end-enough",
    "Anyway — you've got the gist.\nI'm a tiny MADBAK living in a CRT. Weird is the point.",
    "به هر حال — کلیت دستته.\nمن یه MADBAK کوچیکم داخل یه CRT. عجیب بودن همون اصل ماجراست.",
    "smile",
    [startOver(), topics()],
  ),

  // ═══════════════════════════════════════════
  // CLICK SEQUENCE
  // ═══════════════════════════════════════════
  node("click-1", "hey.", "هی.", "smile", [
    opt("ck1", "Continue talking", "ادامه بده", "root"),
    back(),
  ]),
  node("click-2", "bro.", "داداش.", "neutral", [
    opt("ck2", "Continue talking", "ادامه بده", "root"),
    back(),
  ]),
  node("click-3", "you good?", "خوبی؟", "angry", [
    opt("ck3", "Sorry", "ببخشید", "root"),
    back(),
  ]),
  node("click-4", "seriously?", "جدی؟", "angry", [
    opt("ck4", "I'll stop", "دیگه نمی‌کنم", "root"),
    back(),
  ]),
  node("click-5", "STOP CLICKING ME.", "دیگه منو کلیک نکن.", "angry", [
    opt("ck5", "Okay okay", "باشه باشه", "root"),
    back(),
  ]),
  node(
    "click-angry-1",
    "I'm a developer, not a button.",
    "من دولوپرم، دکمه نیستم.",
    "angry",
    [opt("ca1", "Sorry", "ببخشید", "root"), back()],
  ),
  node(
    "click-angry-2",
    "Why are you bullying the pixel guy?",
    "چرا داری این پسر پیکسلی رو اذیت می‌کنی؟",
    "angry",
    [opt("ca2", "Sorry", "ببخشید", "root"), back()],
  ),
  node(
    "click-angry-3",
    "One more click and I'm blaming React.",
    "یه کلیک دیگه بکنی، تقصیر رو می‌ندازم گردن React.",
    "angry",
    [opt("ca3", "Sorry", "ببخشید", "root"), back()],
  ),
  node(
    "click-angry-4",
    "I know where the CSS lives.\nDon't test me.",
    "من می‌دونم CSS کجاست.\nامتحانم نکن.",
    "angry",
    [opt("ca4", "Sorry", "ببخشید", "root"), back()],
  ),
  node(
    "click-angry-5",
    "Okay. One more click and we're fighting.",
    "باشه. یه کلیک دیگه بکنی دعوامون می‌شه.",
    "angry",
    [opt("ca5", "Truce", "صلح", "root"), back()],
  ),
  node(
    "click-angry-6",
    "This is harassment.\nPixel harassment.",
    "این دیگه آزاره.\nآزار پیکسلی.",
    "angry",
    [opt("ca6", "I'll stop", "دیگه نمی‌کنم", "root"), back()],
  ),
  node(
    "click-angry-7",
    "You are dangerously close to becoming a bug report.",
    "داری خطرناک نزدیک می‌شی که تبدیل به گزارش باگ بشی.",
    "angry",
    [opt("ca7", "Sorry", "ببخشید", "root"), back()],
  ),
  node(
    "click-angry-8",
    "Can I have five seconds of peace?",
    "می‌شه فقط پنج ثانیه آروم باشم؟",
    "angry",
    [opt("ca8", "Okay", "باشه", "root"), back()],
  ),

  // ═══════════════════════════════════════════
  // ROUTE ENTRY POINTS (same tree, different openers)
  // ═══════════════════════════════════════════
  node(
    "open-works",
    "What are you looking at?\nPick a project.",
    "داری به چی نگاه می‌کنی؟\nیه پروژه انتخاب کن.",
    "smile",
    [
      opt("ow1", "What do you build?", "چی می‌سازی؟", "build"),
      opt("ow2", "Favorite projects?", "پروژه‌های مورد علاقه؟", "projects-favorite"),
      opt("ow3", "Tech stack?", "تک استک؟", "tech"),
      opt("ow4", "Something random.", "یه چیز الکی.", "random"),
    ],
  ),
  node(
    "open-services",
    "so... you might actually need something built?",
    "پس… ممکنه واقعاً یه چیزی لازم داشته باشی که ساخته بشه؟",
    "smile",
    [
      opt("os1", "What do you build?", "چی می‌سازی؟", "build"),
      opt("os2", "Freelance?", "فریلنس؟", "projects-freelance"),
      opt("os3", "Who is MADBAK?", "MADBAK کیه؟", "madbak"),
      opt("os4", "Something random.", "یه چیز الکی.", "random"),
    ],
  ),
  node(
    "open-lab",
    "welcome to the lab.\ndon't touch anything.",
    "به آزمایشگاه خوش اومدی.\nبه هیچی دست نزن.",
    "smile",
    [
      opt("ol1", "What's MADLAB?", "MADLAB چیه؟", "madlab"),
      opt("ol2", "Tech experiments?", "آزمایش‌های فنی؟", "tech"),
      opt("ol3", "Something weird.", "یه چیز عجیب.", "random"),
      opt("ol4", "Who is MADBAK?", "MADBAK کیه؟", "madbak"),
    ],
  ),
  node(
    "open-contact",
    "okay... this is the part where things get serious.",
    "باشه… این همون جاییه که اوضاع جدی می‌شه.",
    "sleepy",
    [
      opt("oc1", "Freelance work?", "کار فریلنس؟", "projects-freelance"),
      opt("oc2", "Where based?", "کجا مستقره؟", "madbak-where"),
      opt("oc3", "What do you build?", "چی می‌سازی؟", "build"),
      opt("oc4", "Something random.", "یه چیز الکی.", "random"),
    ],
  ),
  node(
    "open-other",
    "yo. still exploring?",
    "هی. هنوز داری می‌گردی؟",
    "smile",
    [
      opt("oo1", "Who is MADBAK?", "MADBAK کیه؟", "madbak"),
      opt("oo2", "What do you build?", "چی می‌سازی؟", "build"),
      opt("oo3", "Something random.", "یه چیز الکی.", "random"),
    ],
  ),
  node(
    "open-home-about",
    "scrolling the homepage?\nI'll be in the About CRT when you're ready.",
    "داری صفحهٔ اصلی رو اسکرول می‌کنی؟\nوقتی آماده بودی تو CRT بخش About هستم.",
    "sleepy",
    [
      opt("oha1", "Who is MADBAK?", "MADBAK کیه؟", "madbak"),
      opt("oha2", "What do you build?", "چی می‌سازی؟", "build"),
      opt("oha3", "Something random.", "یه چیز الکی.", "random"),
    ],
  ),
];

/** Alias: About root opener (same node as root). */
export const ABOUT_ROOT_ID = "root";

export const CLICK_SEQUENCE_IDS = [
  "click-1",
  "click-2",
  "click-3",
  "click-4",
  "click-5",
] as const;

export const CLICK_ANGRY_IDS = [
  "click-angry-1",
  "click-angry-2",
  "click-angry-3",
  "click-angry-4",
  "click-angry-5",
  "click-angry-6",
  "click-angry-7",
  "click-angry-8",
] as const;
