/**
 * MADBAK Articles — local editorial content.
 * Structured so a CMS / MDX source can replace `ARTICLES` without touching UI.
 */

export type ArticleTopicSlug =
  | "cybersecurity"
  | "ai-technology"
  | "web-development"
  | "vibe-coding"
  | "design-creative-tech";

export type ArticleTopicFilter = ArticleTopicSlug | "all";

export type ArticleTopic = {
  slug: ArticleTopicSlug;
  label: string;
  /** Compact label for the horizontal topic bar. */
  short: string;
};

export type ArticleImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Only set when the source is known; never invented. */
  credit?: string;
  /** CSS object-position used when the image is cropped. */
  focus?: string;
  /**
   * "editorial" (default): grayscale photograph with purple overlays applied in CSS.
   * "original": an art-directed file shown exactly as supplied — no filters or overlays,
   * and uncropped where the layout allows.
   */
  treatment?: "editorial" | "original";
};

/** Purple geometric overlay composition drawn on top of a cover. */
export type ArtworkVariant =
  | "monolith"
  | "orbit"
  | "grid"
  | "split"
  | "frame"
  | "beam";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: ArticleImage; caption: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; caption?: string; columns: string[]; rows: string[][] }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "cta"; title: string; text: string; links: { label: string; href: string }[] };

/**
 * Inline markup allowed inside paragraph, list, table and FAQ text:
 * `**bold**` and `[label](href)`.
 */
export const INLINE_MARKUP = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

export function toPlainText(text: string): string {
  return text.replace(INLINE_MARKUP, (_, bold, label) => bold ?? label);
}

export type ArticleAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type Article = {
  slug: string;
  title: string;
  /** Second line of the headline on the article page; the full headline is `title: subtitle`. */
  subtitle?: string;
  description: string;
  /** Search-result overrides when they should differ from the on-page title and standfirst. */
  seo?: { title: string; description: string };
  topic: ArticleTopicSlug;
  author: ArticleAuthor;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  cover: ArticleImage;
  artwork: ArtworkVariant;
  body: ArticleBlock[];
};

export type ArticleSummary = Pick<
  Article,
  | "slug"
  | "title"
  | "description"
  | "topic"
  | "publishedAt"
  | "readingMinutes"
  | "cover"
  | "artwork"
> & { authorName: string };

export const ARTICLE_TOPICS: ArticleTopic[] = [
  { slug: "cybersecurity", label: "Cybersecurity", short: "Cybersecurity" },
  { slug: "ai-technology", label: "AI & Technology", short: "AI" },
  { slug: "web-development", label: "Web Development", short: "Web Development" },
  { slug: "vibe-coding", label: "Vibe Coding", short: "Vibe Coding" },
  { slug: "design-creative-tech", label: "Design & Creative Tech", short: "Design" },
];

export const ARTICLE_AUTHOR: ArticleAuthor = {
  name: "MADBAK",
  role: "Creative technologist · Istanbul",
  avatar: "/about-operator.png",
};

const GETTY = "J. Paul Getty Museum · CC0";

function statue(
  src: string,
  alt: string,
  width: number,
  credit: string,
  focus = "50% 30%",
): ArticleImage {
  return { src: `/articles/${src}.webp`, alt, width, height: 1600, credit, focus };
}

export const ARTICLES_HERO_IMAGE = statue(
  "hero-augustus",
  "Grayscale marble portrait head of the Roman emperor Augustus, seen from the left front.",
  1322,
  `Portrait Head of Augustus — ${GETTY}`,
  "50% 35%",
);

const ARTICLE_LIST: Article[] = [
  {
    slug: "creative-website-design",
    title: "Creative Website Design",
    subtitle: "The Complete Guide to Building a Website People Actually Remember",
    description:
      "What creative website design really is, when it's worth it, what it costs, and how to build one that stays fast and SEO-friendly.",
    seo: {
      title: "Creative Website Design: The Complete 2026 Guide | MADBAK",
      description:
        "What creative website design really is, when it's worth it, what it costs, and how to build one that stays fast and SEO-friendly. By creative developer Babak Ravanbakhsh.",
    },
    topic: "design-creative-tech",
    author: {
      name: "Babak Ravanbakhsh",
      role: "Creative developer & web designer · Istanbul / Global",
      avatar: ARTICLE_AUTHOR.avatar,
    },
    publishedAt: "2026-11-09",
    readingMinutes: 21,
    featured: true,
    artwork: "frame",
    cover: {
      src: "/articles/creative-website-design-cover-v2.jpg",
      alt: "MADBAK Journal cover for “Creative Website Design — The complete guide to building a website people actually remember”: on an off-white background, a grayscale classical statue head looking upward, crossed by an electric-purple band over the eyes, with a browser window showing a mountain landscape, a cursor, a wireframe globe and diagonal purple shapes.",
      width: 1024,
      height: 576,
      focus: "0% 50%",
      treatment: "original",
    },
    body: [
      {
        type: "p",
        text: `A creative website is not a website with "more animation." It's a site where art direction, motion, interaction and content are designed together around one idea — so visitors understand your brand faster and remember it longer. Done well, it is still fast, readable by Google and AI search, and accessible. Done badly, it's a slow, pretty puzzle nobody finishes. This guide shows you the difference, what it costs, and how to decide whether you need one at all.`,
      },
      {
        type: "p",
        text: "Most websites today look like they came out of the same box. Same hero, same three feature cards, same stock gradient. That's not a crime — templates exist for good reasons. But if your brand lives on attention (a launch, a creative studio, a fashion label, a Web3 project, a personal brand), looking like everyone else is expensive. People don't scroll past what they can't forget.",
      },
      {
        type: "p",
        text: "[I build websites, digital products and interactive experiences](/about) with a point of view. Below is everything I'd tell a client before we start — including when not to hire someone like me.",
      },

      { type: "h2", id: "what-is-creative-website-design", text: "What is creative website design?" },
      {
        type: "p",
        text: "Creative website design is an approach where the visual direction, motion and interaction are part of the message, not decoration added at the end.",
      },
      {
        type: "p",
        text: `A standard website answers: "What do you do?" A creative website answers that too — and also: "How should this feel?"`,
      },
      { type: "p", text: "In practice that means:" },
      {
        type: "list",
        items: [
          "Art direction — a clear visual concept (typography, colour, composition, imagery) that belongs to your brand and couldn't be swapped onto a competitor.",
          "Motion with a job — animation that guides attention, explains a product or creates rhythm, instead of things flying in for no reason.",
          "Scroll storytelling — the page unfolds like a sequence, revealing your story in the order a visitor needs it.",
          "Micro-interactions — small responses to hover, click and scroll that make the interface feel alive and considered.",
          "Custom UI — layouts and components built for your content, not your content squeezed into a theme.",
          "Optional depth — 3D, WebGL or shader effects where they serve the idea.",
        ],
      },
      { type: "h3", text: "Creative vs. template website" },
      {
        type: "table",
        columns: ["", "Template / theme site", "Creative website"],
        rows: [
          ["Starting point", "A layout that exists already", "Your brand, audience and goal"],
          ["Visual identity", "Shared with thousands of sites", "Built around one concept"],
          ["Motion", "Default fade-ins (or none)", "Choreographed, purposeful"],
          ["Content", "Fitted into fixed blocks", "Structure designed around it"],
          ["Best at", "Speed to launch, low budget", "Attention, memorability, positioning"],
          ["Risk", "Looks generic", "Can get slow or confusing if built carelessly"],
        ],
      },
      {
        type: "p",
        text: "That last row matters. The craft isn't in adding effects — it's in adding them without paying for them in speed, clarity or search visibility.",
      },

      {
        type: "h2",
        id: "do-you-need-a-creative-website",
        text: "Do you actually need a creative website? (An honest checklist)",
      },
      { type: "h3", text: "You probably do if:" },
      {
        type: "list",
        items: [
          "Your audience judges you on taste — creative studios, fashion, art, luxury, agencies, designers.",
          "You're launching something and need a moment: a product drop, an event, a token, a campaign.",
          "You compete in a crowded market where every competitor's site looks the same (hello, crypto and fintech).",
          "You're a person, not just a company — a personal brand site is where your point of view either shows or disappears.",
          "You need to explain something complex (a platform, an infrastructure product) and words alone aren't doing it.",
        ],
      },
      { type: "h3", text: "You probably don't (yet) if:" },
      {
        type: "list",
        items: [
          "You need a site live this week with minimal budget.",
          "Your buyers only want a price list and a phone number.",
          "You don't have your positioning or content figured out. Motion can't fix an unclear message — it amplifies whatever message is there.",
        ],
      },
      {
        type: "p",
        text: "If you're in the second group, a clean, fast, well-structured site is the right move. You can add the cinematic layer later, once there's a story worth staging.",
      },

      { type: "h2", id: "building-blocks", text: "The building blocks of a creative website" },
      { type: "h3", text: "Art direction" },
      {
        type: "p",
        text: "Everything starts here. Before a single line of code, I want to know what the site should feel like — calm and tactile? Loud and editorial? Quiet and museum-like? That decision drives typography, spacing, colour, image treatment and how things move. For example, the MUSE / 24 art-gallery site I built uses quiet typography and a \"living archive\" structure, because a gallery should let the work breathe. A Web3 growth platform needs a very different energy.",
      },
      { type: "h3", text: "Motion design" },
      { type: "p", text: "Good web motion has three jobs:" },
      {
        type: "list",
        items: [
          "Direct attention — tell the eye where to go next.",
          "Explain — show how a product, process or system works.",
          "Create rhythm — give the page pacing, so scrolling feels like reading a story, not wading through a wall.",
        ],
      },
      { type: "p", text: "If an animation does none of those, it's a candidate for deletion." },
      { type: "h3", text: "Scroll storytelling" },
      {
        type: "p",
        text: "Instead of a stack of unrelated sections, the page is written like a sequence: hook → context → proof → detail → action. Scroll-linked animation then reveals each beat at the right moment. This is especially powerful for launches, events and premium brands — the formats I design my [Creative / Cinematic package](/services) around.",
      },
      { type: "h3", text: "Micro-interactions" },
      {
        type: "p",
        text: `Buttons that respond, cursors that react, cards that tilt slightly, menus that open with intent. Individually small; together they signal "someone cared about this."`,
      },
      { type: "h3", text: "3D and WebGL (when appropriate)" },
      {
        type: "p",
        text: "Three.js, shaders and WebGL can create depth no static layout can. They're also the fastest way to make a site heavy. I use them when they carry the concept — a product you can rotate, an atmosphere that is the brand — and skip them when a well-designed 2D layout says it better.",
      },
      { type: "h3", text: "Typography and layout systems" },
      {
        type: "p",
        text: "The least flashy part and often the most important. A strong type scale and grid make a site look intentional even with zero animation. Motion sits on top of a solid system — never in place of one.",
      },

      {
        type: "h2",
        id: "website-design-styles",
        text: "Website design styles: the main creative directions explained",
      },
      {
        type: "p",
        text: `"Creative" isn't one look. It's a family of design directions, each with its own mood, strengths and trade-offs. Knowing them helps you brief a designer clearly — instead of "make it cool," you can say "editorial, quiet, with cinematic scroll moments." Here are the styles I get asked about most, what they feel like, and who they suit.`,
      },
      { type: "h3", text: "Minimalist & Swiss (grid-based) design" },
      {
        type: "p",
        text: "Clean grids, generous white space, strict typography and very few colours. Everything has a reason to be there.",
      },
      { type: "h3", text: "Editorial / magazine design" },
      {
        type: "p",
        text: "Large headlines, expressive type pairings, asymmetric layouts and image-led storytelling — borrowed from print magazines.",
      },
      { type: "h3", text: "Brutalist & neo-brutalist design" },
      {
        type: "p",
        text: `Raw, honest, deliberately "unpolished": thick borders, hard shadows, system fonts, clashing blocks of colour. Neo-brutalism softens it with friendlier colours and rounded energy.`,
      },
      { type: "h3", text: "Maximalist & bold-colour design" },
      {
        type: "p",
        text: "More is more: saturated colour, layered imagery, big patterns, loud type, lots happening at once — but orchestrated.",
      },
      { type: "h3", text: "Cinematic & scroll-storytelling design" },
      {
        type: "p",
        text: "The page behaves like a film: scenes, pacing, transitions and reveals tied to the scroll. Often full-screen visuals and pinned sections.",
      },
      { type: "h3", text: "3D, WebGL & immersive design" },
      {
        type: "p",
        text: "Real-time 3D scenes, interactive objects, shaders, particles and depth you can move through.",
      },
      { type: "h3", text: "Kinetic typography (type-led design)" },
      {
        type: "p",
        text: "The type is the visual. Letters move, stretch, split, scroll and react — often with very few images.",
      },
      { type: "h3", text: "Retro, Y2K, pixel & terminal-inspired design" },
      {
        type: "p",
        text: `Nostalgic interfaces: old operating systems, pixel art, CRT glow, terminal windows, chrome gradients. My own site leans into this — the "talk to the machine" section and system-boot labels are a playful nod to it.`,
      },
      { type: "h3", text: "Dark tech & futuristic design" },
      {
        type: "p",
        text: "Dark backgrounds, glowing accents, data-style visuals, grids and precise motion.",
      },
      { type: "h3", text: "Glassmorphism & soft-gradient design" },
      {
        type: "p",
        text: "Frosted-glass panels, blur, light transparency and smooth gradient backgrounds.",
      },
      { type: "h3", text: "Bento-grid design" },
      {
        type: "p",
        text: "Content arranged in a grid of tiles of different sizes — each tile a feature, stat, image or micro-animation.",
      },
      { type: "h3", text: "Organic, tactile & natural design" },
      {
        type: "p",
        text: "Soft shapes, textures, paper and grain, earthy colours, hand-drawn details, gentle motion.",
      },
      { type: "h3", text: "Illustration & character-led design" },
      {
        type: "p",
        text: "A custom illustration world or a recurring character becomes the face of the brand. This connects closely to my character-design and AI-persona work.",
      },
      { type: "h3", text: "Luxury & quiet-elegance design" },
      {
        type: "p",
        text: "Restraint as a signal: refined serif type, slow transitions, high-end photography, lots of space and very little noise.",
      },
      { type: "h3", text: "Experimental & interactive-playground design" },
      {
        type: "p",
        text: "The site is an experience to explore: unusual navigation, games, generative visuals, cursor-driven worlds.",
      },
      { type: "h3", text: "Design styles at a glance" },
      {
        type: "table",
        columns: ["Style", "Mood", "Best for", "Build weight"],
        rows: [
          ["Minimalist / Swiss", "Calm, precise", "SaaS, architecture, professional services", "Light"],
          ["Editorial", "Cultured, story-led", "Galleries, fashion, studios, events", "Light–medium"],
          ["Brutalist / neo-brutalist", "Bold, raw", "Agencies, indie products, music", "Light"],
          ["Maximalist", "Loud, joyful", "Fashion drops, entertainment, food brands", "Medium"],
          ["Cinematic scroll", "Immersive, premium", "Launches, luxury, hotels, real estate", "Heavy"],
          ["3D / WebGL", "Futuristic, tactile", "Web3, tech, gaming, products", "Heavy"],
          ["Kinetic typography", "Sharp, modern", "Agencies, personal brands, campaigns", "Medium"],
          ["Retro / Y2K / terminal", "Playful, nerdy", "Personal brands, gaming, digital art", "Light–medium"],
          ["Dark tech", "Powerful, technical", "Web3, fintech, AI, dev tools", "Medium"],
          ["Glassmorphism", "Light, app-like", "SaaS, apps, fintech", "Medium"],
          ["Bento grid", "Organised, scannable", "SaaS, startups, portfolios", "Light"],
          ["Organic / tactile", "Warm, human", "Restaurants, wellness, hospitality", "Light–medium"],
          ["Illustration / character-led", "Friendly, distinctive", "Education, apps, communities, NFTs", "Medium"],
          ["Luxury / quiet elegance", "Exclusive, timeless", "Luxury, hotels, jewellery, fashion", "Medium"],
          ["Experimental playground", "Surprising, artistic", "Studios, art, campaign microsites", "Heavy"],
        ],
      },
      {
        type: "p",
        text: `"Build weight" is a rough guide to how much design, animation and performance work a style usually needs — which is one of the biggest factors in price.`,
      },
      { type: "h3", text: "Can you mix styles?" },
      {
        type: "p",
        text: "Yes — most strong websites do. A common recipe is a calm base (minimalist or editorial) with one or two signature moments (a cinematic hero, a 3D object, a kinetic headline). The base keeps the site usable and fast; the signature moments make it memorable. The mistake is trying to use five styles at once.",
      },

      {
        type: "h2",
        id: "performance-seo-accessibility",
        text: "Creative doesn't have to mean slow: performance, SEO and accessibility",
      },
      {
        type: "p",
        text: `This is where many "award-style" sites fail and where clients get burned. A beautiful site that loads slowly, can't be indexed or makes people dizzy is a liability. Here's how I keep the creative layer from costing you traffic.`,
      },
      { type: "h3", text: "Performance" },
      {
        type: "p",
        text: `Google's Core Web Vitals are a useful baseline. A "good" experience means roughly:`,
      },
      {
        type: "list",
        items: [
          "LCP (Largest Contentful Paint) — main content visible within 2.5 seconds",
          "INP (Interaction to Next Paint) — the page responds to input within 200 ms",
          "CLS (Cumulative Layout Shift) — layout stays stable (score 0.1 or less)",
        ],
      },
      {
        type: "p",
        text: "To hit these on motion-heavy pages I typically: render content on the server with Next.js, lazy-load heavy assets and 3D scenes, animate GPU-friendly properties (transform, opacity) instead of layout, compress and size images properly, and load WebGL only when it's on screen.",
      },
      { type: "h3", text: "SEO and AI search visibility" },
      {
        type: "p",
        text: "Search engines and AI assistants read text in HTML, not pixels in a canvas. So on every creative build:",
      },
      {
        type: "list",
        items: [
          "Real headings and copy live in the HTML — animation reveals content, it doesn't replace it.",
          "Each page has proper titles, meta descriptions, semantic structure and clean URLs.",
          "Pages are server-rendered or statically generated, so crawlers see the full content.",
          "Multilingual sites get correct language setup (including RTL for Persian and Arabic).",
        ],
      },
      { type: "h3", text: "Accessibility" },
      {
        type: "p",
        text: `Motion can trigger discomfort for some people. Creative sites should respect the operating-system "reduce motion" setting (prefers-reduced-motion), keep text contrast readable, stay keyboard-navigable and never hide essential information behind an animation. A site that works for more people is simply a better site.`,
      },

      { type: "h2", id: "tech-stack", text: "The tech stack behind my creative websites" },
      {
        type: "p",
        text: "I build on a modern frontend stack chosen for flexibility and speed:",
      },
      {
        type: "table",
        columns: ["Tool", "What it does for your site"],
        rows: [
          ["Next.js", "Fast, SEO-friendly React framework with server rendering — the foundation"],
          ["TypeScript", "Fewer bugs, easier to maintain and extend later"],
          ["Tailwind CSS", "Consistent design system in code, quick iteration"],
          ["GSAP & Framer Motion", "Smooth, precise animation and scroll-based storytelling"],
          ["Three.js / WebGL / shaders", "3D and visual depth, used only where it earns its place"],
          ["Vercel", "Global deployment, fast hosting, easy previews"],
        ],
      },
      {
        type: "p",
        text: "Why not a page builder? Builders are great for simple sites. But for custom motion, unusual layouts or a site that needs to grow into a product, hand-built code gives you full control over both the experience and the performance. Curious what that looks like? I share experiments and free source code in [MADLAB](/lab) — take the code, make it yours.",
      },

      { type: "h2", id: "by-type-of-business", text: "Creative website design by type of business" },
      {
        type: "p",
        text: `Every business needs a different kind of "creative." A restaurant needs appetite and atmosphere; a SaaS product needs clarity; a Web3 project needs trust and differentiation. Below is how I think about each type — what the site has to achieve, the design directions that usually fit, and the features that matter most.`,
      },
      { type: "h3", text: "Startup launches and campaigns" },
      {
        type: "p",
        text: "You have one shot at a first impression. A focused one-page site with a strong visual direction and a clear call-to-action often beats a ten-page site nobody reads.",
      },
      { type: "h3", text: "Personal brands and portfolios" },
      {
        type: "p",
        text: "For freelancers, designers, developers and artists, your site is the portfolio. It should show your work, your story and — most importantly — how you think.",
      },
      { type: "h3", text: "Business and corporate websites" },
      {
        type: "p",
        text: `"Creative" here means clarity with character: a full design system, considered transitions and multilingual support, so the company looks trustworthy and distinctive at the same time.`,
      },
      { type: "h3", text: "Fashion, art, luxury and creative agencies" },
      {
        type: "p",
        text: "The audience is visually literate. Art direction, editorial typography and cinematic scroll experiences are expected, not extra.",
      },
      { type: "h3", text: "Web3, crypto and fintech" },
      {
        type: "p",
        text: "This is a space where trust and differentiation both matter, and where many sites look interchangeable. Good Web3 design balances bold visuals with clarity, works across languages (often including RTL), and stays fast for a global audience. I've worked on this directly — [see below](#selected-work).",
      },
      { type: "h3", text: "SaaS, AI and tech products" },
      {
        type: "p",
        text: "Visitors want to understand what it does in seconds. Motion is a teaching tool here: animated product walkthroughs, interactive feature demos and bento-grid overviews.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: minimalist, bento grid, dark tech, glassmorphism.",
          "Must-haves: clear value proposition above the fold, product visuals, pricing clarity, fast load, strong CTAs.",
        ],
      },
      { type: "h3", text: "E-commerce and DTC brands" },
      {
        type: "p",
        text: "A brand site sells the feeling before the product. Editorial layouts, bold product storytelling and 3D product views make a launch or a hero collection stand out.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: editorial, maximalist, 3D product showcase, luxury.",
          "Must-haves: product storytelling, fast images, mobile-first layout. A full online store with cart, checkout and inventory is a separate scope — we'd discuss it individually.",
        ],
      },
      { type: "h3", text: "Restaurants, cafés and food brands" },
      {
        type: "p",
        text: "People decide with their eyes and their stomach. Atmosphere, food photography and a quick path to the menu, location and reservation matter more than anything else.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: organic / tactile, editorial, maximalist (for bold food brands).",
          "Must-haves: menu that's easy to read on a phone, opening hours, map, booking or ordering link.",
        ],
      },
      { type: "h3", text: "Hotels, travel and tourism" },
      {
        type: "p",
        text: "You're selling an experience someone hasn't had yet. Cinematic scroll, full-screen imagery and slow, elegant transitions help visitors imagine being there.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: cinematic, luxury / quiet elegance, organic.",
          "Must-haves: room or experience showcases, booking integration, multilingual content for international guests.",
        ],
      },
      { type: "h3", text: "Real estate, architecture and interior design" },
      {
        type: "p",
        text: "Space, light and materials are the product. Large visuals, precise grids and immersive project pages do the selling; 3D can show a space before it exists.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: minimalist / Swiss, cinematic, 3D, luxury.",
          "Must-haves: project galleries, floor plans or specs, location info, enquiry forms, multilingual support for international buyers.",
        ],
      },
      { type: "h3", text: "Clinics, healthcare, beauty and wellness" },
      {
        type: "p",
        text: "Trust comes first. The design should feel calm, clean and reassuring; motion stays gentle. Clarity about services, practitioners and how to book is essential.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: minimalist, organic, soft gradients.",
          "Must-haves: clear service pages, team profiles, easy booking, accessibility, and accurate, responsible wording about treatments.",
        ],
      },
      { type: "h3", text: "Education, online courses and coaches" },
      {
        type: "p",
        text: "The site has to explain a transformation — from where students are to where they'll be. Illustration, structured layouts and friendly micro-interactions make learning feel approachable.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: illustration / character-led, bento grid, editorial.",
          "Must-haves: course or program overviews, outcomes, instructor credibility, simple sign-up flow, often multilingual.",
        ],
      },
      { type: "h3", text: "Events, conferences and festivals" },
      {
        type: "p",
        text: "Event sites live on hype and deadlines. A strong visual concept, a countdown-to-launch energy and instant access to dates, venue, speakers and tickets. The TOKEN2049 Singapore site I built for Sigma is a good example of an editorial event site.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: cinematic, kinetic typography, maximalist, dark tech.",
          "Must-haves: date and venue up front, schedule, speakers or partners, registration or meeting-booking CTA.",
        ],
      },
      { type: "h3", text: "Music, film, gaming and entertainment" },
      {
        type: "p",
        text: "This audience expects to be impressed. Experimental interactions, 3D worlds, bold type and media-rich pages turn a release into an event.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: maximalist, 3D / WebGL, brutalist, experimental, retro.",
          "Must-haves: video and audio that load smartly, release or tour info, social links, press kit.",
        ],
      },
      { type: "h3", text: "Museums, galleries and cultural organisations" },
      {
        type: "p",
        text: "The work should be the hero, not the interface. Quiet typography, editorial structure and a well-organised archive — like the MUSE / 24 gallery site.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: editorial, minimalist, luxury.",
          "Must-haves: exhibitions and archive, artist pages, visit info, multilingual content.",
        ],
      },
      { type: "h3", text: "Professional services: law, consulting, finance" },
      {
        type: "p",
        text: `Credibility and clarity. "Creative" here means refined type, considered details and subtle motion that make the firm look sharper than competitors — never flashy.`,
      },
      {
        type: "list",
        items: [
          "Styles that fit: minimalist / Swiss, luxury / quiet elegance, editorial.",
          "Must-haves: clear service areas, team and expertise, insights or articles, simple contact path.",
        ],
      },
      { type: "h3", text: "Product, hardware and automotive brands" },
      {
        type: "p",
        text: "When the product is physical, 3D and interactive viewers let people explore it from every angle before they ever touch it.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: 3D / WebGL, cinematic, dark tech, minimalist.",
          "Must-haves: product views, specs, comparisons, dealer or purchase links.",
        ],
      },
      { type: "h3", text: "Nonprofits and social-impact organisations" },
      {
        type: "p",
        text: "The story is the product. Scroll storytelling and illustration turn data and missions into something people feel — and act on.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: editorial, illustration / character-led, cinematic.",
          "Must-haves: clear mission, impact stories, donation or volunteer CTA, accessibility.",
        ],
      },
      { type: "h3", text: "NFT, digital-art and creator projects" },
      {
        type: "p",
        text: "Community, identity and collectability. Character-led and retro-digital styles fit naturally — it's a world I work in myself, with 1/1 NFT editions and character-design projects.",
      },
      {
        type: "list",
        items: [
          "Styles that fit: illustration / character-led, retro / pixel, experimental, 3D.",
          "Must-haves: collection showcase, artist story, links to marketplaces and community channels.",
        ],
      },
      { type: "h3", text: "Quick match: business type → style → package" },
      {
        type: "table",
        columns: ["Business type", "Styles that usually fit", "Typical starting package"],
        rows: [
          ["Startup launch / campaign", "Cinematic, kinetic type, bento", "Landing Page"],
          ["Freelancer, designer, artist", "Retro, experimental, editorial, type-led", "Personal / Portfolio"],
          ["SaaS, AI, tech product", "Minimalist, bento, dark tech, glass", "Business / Corporate or Advanced Interactive"],
          ["E-commerce / DTC brand site", "Editorial, maximalist, 3D, luxury", "Creative / Cinematic (store scope separate)"],
          ["Restaurant, café, food brand", "Organic, editorial, maximalist", "Landing Page or Business / Corporate"],
          ["Hotel, travel, tourism", "Cinematic, luxury, organic", "Creative / Cinematic"],
          ["Real estate, architecture, interiors", "Minimalist, cinematic, 3D", "Business / Corporate or Creative / Cinematic"],
          ["Clinic, beauty, wellness", "Minimalist, organic, soft gradients", "Business / Corporate"],
          ["Education, courses, coaches", "Illustration, bento, editorial", "Business / Corporate"],
          ["Event, conference, festival", "Cinematic, kinetic type, dark tech", "Landing Page or Creative / Cinematic"],
          ["Music, film, gaming", "Maximalist, 3D, experimental", "Creative / Cinematic or Advanced Interactive"],
          ["Gallery, museum, culture", "Editorial, minimalist, luxury", "Business / Corporate or Creative / Cinematic"],
          ["Law, consulting, finance", "Minimalist, luxury, editorial", "Business / Corporate"],
          ["Product, hardware, automotive", "3D, cinematic, dark tech", "Advanced Interactive"],
          ["Nonprofit, social impact", "Editorial, illustration, cinematic", "Business / Corporate"],
          ["Fashion, luxury, agencies", "Editorial, luxury, cinematic, brutalist", "Creative / Cinematic"],
          ["Web3, crypto, fintech", "Dark tech, 3D, minimalist", "Advanced Interactive / Web3"],
          ["NFT, digital art, creators", "Character-led, retro, experimental", "Personal / Portfolio or Creative / Cinematic"],
          ["Startup building a full product", "Depends on the brand", "Full Creative Product"],
        ],
      },
      {
        type: "p",
        text: "This table is a starting point, not a rule. The right answer comes from your goal and audience — which is exactly what we figure out in the first conversation.",
      },

      { type: "h2", id: "selected-work", text: "Selected work" },
      {
        type: "list",
        items: [
          "TOKEN2049 Singapore event site for Sigma — an editorial event website for Sigma's presence at TOKEN2049 Singapore (Marina Bay Sands, 7–8 October 2026).",
          "SIGMAA.PRO — a premium multilingual website for a Web3 and finance growth company, with RTL support, animated interfaces, responsive layouts, SEO foundations and custom interactive visuals. Direction: calm, tactile and built for immersive storytelling. (Live website, ongoing project.)",
          "MUSE / 24 Art Gallery — an editorial cultural website with quiet typography and a living archive.",
        ],
      },
      { type: "p", text: "See the full list in [Works → Websites](/works/websites)." },

      { type: "h2", id: "creative-website-cost", text: "How much does a creative website cost?" },
      {
        type: "p",
        text: "It depends on scope, number of pages, motion complexity and whether 3D or multilingual support is needed. To make it transparent, I work with fixed-scope packages (current ranges, USD):",
      },
      {
        type: "table",
        columns: ["Package", "Typical range", "Best for"],
        rows: [
          ["Landing Page", "$900 – $1,400", "Launches, startups, ad campaigns"],
          ["Personal / Portfolio Website (4–6 pages)", "$1,500 – $2,200", "Freelancers, designers, developers, artists"],
          ["Business / Corporate Website (6–10 pages)", "$2,400 – $3,500", "Companies, agencies, clinics, service businesses"],
          ["Creative / Cinematic Website", "$3,800 – $5,500", "Creative brands, fashion, art, luxury, agencies"],
          ["Advanced Interactive / Web3 Website", "$5,800 – $8,500", "Web3, crypto, fintech, premium brands"],
          ["Full Creative Product Package", "$9,000 – $14,000", "Startups building a real digital product"],
        ],
      },
      { type: "h3", text: "What moves the price up or down" },
      {
        type: "list",
        items: [
          "Motion complexity — simple micro-interactions vs. full scroll-choreographed storytelling.",
          "3D / WebGL — custom scenes and shaders take significant design and optimisation time.",
          "Number of unique layouts — ten pages built from one template cost less than ten unique pages.",
          "Languages — each language (especially RTL) adds design and QA work.",
          "Content readiness — if copy and assets are ready, projects move faster.",
          "Product features — an MVP with logic and data is a different job from a marketing site.",
        ],
      },
      {
        type: "p",
        text: "Full details of every package are on the [Services page](/services).",
      },

      { type: "h2", id: "project-process", text: "How a creative website project runs" },
      {
        type: "list",
        ordered: true,
        items: [
          "Conversation — we talk about your goal, audience and what success looks like. Every project starts with a good conversation.",
          "Direction — I propose a creative concept: references, type, colour and motion ideas.",
          `Structure — the page flow and content order (the "story" of the site).`,
          "Design — key screens and the motion language.",
          "Build — development in Next.js with animation, responsive layouts and performance work.",
          "Polish & QA — testing across devices, speed checks, SEO basics, reduced-motion support.",
          "Launch — deployment, domain connection, and handover.",
        ],
      },

      {
        type: "h2",
        id: "choosing-a-creative-web-developer",
        text: "How to choose a creative web developer (checklist)",
      },
      { type: "p", text: "Whoever you hire, ask these questions:" },
      {
        type: "list",
        items: [
          "Can I see live sites, not just screenshots? Motion and performance only show in the browser.",
          "Do the live sites load fast on my phone? Test them yourself on mobile data.",
          "Do they design and build? Hand-offs between a designer and a separate developer are where motion ideas often get lost.",
          "How do they handle SEO and accessibility on animated pages? If the answer is vague, expect problems later.",
          "Can they work in my languages? Especially if you need RTL (Persian, Arabic).",
          "Is the scope and price clear up front? Fixed scopes protect both sides.",
          "Do they have a point of view? You're hiring taste, not just hands.",
        ],
      },

      { type: "h2", id: "mini-brief", text: "Before our first call: a mini brief" },
      { type: "p", text: "You don't need a perfect brief. Sending these speeds everything up:" },
      {
        type: "list",
        items: [
          "What you do, in one or two sentences",
          "Who the site is for, and the one action you want them to take",
          "3 sites you like (and why) — and 1 you don't",
          "Your deadline and budget range",
          "What content and assets you already have (logo, copy, photos, video)",
          "Languages needed",
        ],
      },

      { type: "h2", id: "faq", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          {
            question: "What is the difference between a web designer and a creative developer?",
            answer:
              "A web designer focuses on how the site looks and is structured. A creative developer also builds it — including the animation, interaction and technical details that make the design work in a real browser. I do both, which keeps the idea intact from concept to launch.",
          },
          {
            question: "Will animations hurt my SEO?",
            answer:
              "Not when they're built correctly. Content stays in the HTML, pages are server-rendered, and heavy effects load only when needed. Problems come from sites that put text inside canvases or ship huge, unoptimised scripts.",
          },
          {
            question: "How long does a creative website take?",
            answer:
              "It depends on the package and how ready your content is. A landing page is a much shorter project than a cinematic multi-page site or a Web3 platform with 3D and multiple languages. We agree on a timeline before starting.",
          },
          {
            question: "Can you build multilingual and RTL websites?",
            answer:
              "Yes. Multilingual setup and RTL support (for languages like Persian and Arabic) are part of the business, Web3 and advanced packages.",
          },
          {
            question: "Do you work with clients outside Istanbul?",
            answer: "Yes. I'm based in Istanbul and work with clients globally.",
          },
          {
            question: "Can I update the website myself after launch?",
            answer:
              "That depends on the project. Tell me early how often you'll update content, and we'll plan the right setup for it.",
          },
          {
            question: "Do you build Web3 and crypto websites?",
            answer:
              "Yes — the Advanced Interactive / Web3 package is designed for crypto, Web3, fintech and premium brand projects, including 3D/WebGL elements where appropriate, multilingual and RTL support, and a scalable component system.",
          },
          {
            question: "Which website design style is right for my business?",
            answer:
              "Start with your audience and goal, not with a trend. If trust and clarity matter most (clinics, law, finance, SaaS), start from minimalist or editorial. If attention and emotion matter most (launches, fashion, events, entertainment), cinematic, maximalist or 3D styles earn their place. The style table and business table above are a good shortcut.",
          },
          {
            question: "Can one website combine several design styles?",
            answer:
              "Yes. The strongest sites usually pair one calm base style with one or two signature moments — for example, a minimalist layout with a cinematic hero and a 3D product section.",
          },
          {
            question: "Are trendy styles like glassmorphism or brutalism a risk?",
            answer:
              "Any style becomes dated if it's used as decoration. Used for a reason — because it fits your brand's personality — it ages much better. A good structure underneath also makes it easy to refresh the visual layer later.",
          },
        ],
      },

      {
        type: "cta",
        title: "Let's build something with a point of view",
        text: "If your brand deserves more than a template, let's talk. Tell me what you're building, who it's for and what it should feel like — I'll tell you honestly which approach fits.",
        links: [
          { label: "Start a conversation", href: "/#contact" },
          { label: "See the packages", href: "/services" },
          { label: "Explore the work", href: "/works/websites" },
        ],
      },
    ],
  },
  {
    slug: "building-a-personal-cybersecurity-stack-in-2026",
    title: "Building a Personal Cybersecurity Stack in 2026",
    description:
      "A practical, modern setup to protect your data, identity, devices, and digital life.",
    topic: "cybersecurity",
    author: ARTICLE_AUTHOR,
    publishedAt: "2026-10-26",
    readingMinutes: 10,
    artwork: "orbit",
    cover: statue(
      "cybersecurity-stack",
      "Close-up of a weathered marble head of the emperor Diocletian.",
      1201,
      `Head of Diocletian — ${GETTY}`,
      "50% 35%",
    ),
    body: [
      {
        type: "p",
        text: "Personal security used to mean a good antivirus and a password you did not reuse. In 2026, your identity is spread across dozens of services, your phone is a hardware wallet for your entire life, and phishing emails are written by models that never make spelling mistakes. The stack has to evolve.",
      },
      { type: "h2", id: "identity-first", text: "Start with identity, not devices" },
      {
        type: "p",
        text: "Attackers rarely break encryption. They log in. That makes identity the most important layer of your stack. Move every important account to passkeys where supported, and to a hardware security key everywhere else. SMS codes are better than nothing, but SIM-swap attacks make them the weakest second factor available.",
      },
      {
        type: "list",
        items: [
          "A password manager with a long, unique master passphrase.",
          "Two hardware security keys — one daily, one stored safely as backup.",
          "Passkeys enabled on email, cloud storage, banking and code hosting.",
          "Recovery codes printed and stored offline, not in your notes app.",
        ],
      },
      {
        type: "quote",
        text: "Your email account is the master key to everything else. Protect it like one.",
      },
      { type: "h2", id: "devices", text: "Harden the devices you actually use" },
      {
        type: "p",
        text: "Turn on full-disk encryption, automatic updates and a short auto-lock timer on every device. Remove apps you have not opened in months; each one is an attack surface with permissions you probably forgot granting.",
      },
      {
        type: "image",
        image: statue(
          "cybersecurity-stack-inline",
          "Marble portrait head of a Ptolemaic ruler with a curly beard.",
          1227,
          `Head of a Ptolemy — ${GETTY}`,
        ),
        caption: "Durable systems are built from simple, boring, well-maintained layers.",
      },
      { type: "h2", id: "network-and-data", text: "Network, data and backups" },
      {
        type: "p",
        text: "Use encrypted DNS, a reputable VPN on untrusted networks, and keep your router firmware current. Most importantly, follow a 3-2-1 backup rule: three copies of anything important, on two different media, with one stored off-site. Ransomware is only a disaster when you cannot restore.",
      },
      {
        type: "callout",
        title: "Weekend checklist",
        text: "Audit connected apps on your Google, Apple and GitHub accounts. Revoke anything you do not recognise. It takes twenty minutes and removes years of accumulated risk.",
      },
    ],
  },
  {
    slug: "inside-the-next-generation-of-ai-coding-tools",
    title: "Inside the Next Generation of AI Coding Tools",
    description:
      "Exploring how AI-powered development tools are changing the way developers think, build, and ship software.",
    topic: "ai-technology",
    author: ARTICLE_AUTHOR,
    publishedAt: "2026-10-24",
    readingMinutes: 8,
    artwork: "grid",
    cover: statue(
      "ai-coding-tools",
      "Marble bust of Germanicus with short cropped hair, facing forward.",
      1285,
      `Bust of Germanicus — ${GETTY}`,
      "50% 30%",
    ),
    body: [
      {
        type: "p",
        text: "Autocomplete was the first wave. Chat in the editor was the second. The third wave — agents that read your repository, run commands and open pull requests — changes the job itself. The interesting question is no longer whether these tools write good code, but how they change the way we think about building.",
      },
      { type: "h2", id: "from-typing-to-directing", text: "From typing to directing" },
      {
        type: "p",
        text: "Modern coding agents work best when you describe intent, constraints and acceptance criteria, then step back. The developer's role shifts from producing every line to designing the problem clearly enough that a fast collaborator can solve it.",
      },
      {
        type: "quote",
        text: "The new senior skill is not writing code faster. It is writing specifications precise enough to delegate.",
      },
      { type: "h2", id: "context-is-the-product", text: "Context is the product" },
      {
        type: "p",
        text: "The quality gap between tools now comes down to context: how well they index your codebase, follow project conventions and remember decisions. Teams that document architecture, write project rules and keep tests meaningful get dramatically better results from the same model.",
      },
      {
        type: "image",
        image: statue(
          "ai-coding-tools-inline",
          "Frontal view of a marble head of Salus with ornate curls.",
          1431,
          `Salus, frontal view — ${GETTY}`,
        ),
        caption: "Tools amplify whatever structure already exists in a codebase.",
      },
      { type: "h2", id: "what-changes-next", text: "What changes next" },
      {
        type: "list",
        items: [
          "Review becomes the bottleneck, so diff summarisation and automated review grow in importance.",
          "Tests turn into the contract between humans and agents.",
          "Small teams ship products that used to need departments.",
        ],
      },
      {
        type: "p",
        text: "The developers who thrive will be the ones who stay curious about the fundamentals. Agents are extraordinary accelerators, but only for people who know where they want to go.",
      },
    ],
  },
  {
    slug: "vibe-coding-the-future-of-development",
    title: "Vibe Coding: The Future of Development?",
    description:
      "How AI is changing the software development process and what this means for the next generation of builders.",
    topic: "vibe-coding",
    author: ARTICLE_AUTHOR,
    publishedAt: "2026-10-22",
    readingMinutes: 7,
    artwork: "split",
    cover: statue(
      "vibe-coding-future",
      "Marble head of the emperor Maxentius in left profile.",
      1154,
      "Head of Maxentius, Rome · CC0",
      "45% 30%",
    ),
    body: [
      {
        type: "p",
        text: "“Vibe coding” started as a joke: describe what you want, accept whatever the model writes, and keep going until it works. A year later it is how a surprising amount of real software gets built. So is it the future, or a phase?",
      },
      { type: "h2", id: "what-it-really-is", text: "What vibe coding really is" },
      {
        type: "p",
        text: "At its core, vibe coding is programming in natural language with fast feedback. You steer by outcome rather than by syntax. For prototypes, internal tools and creative experiments, it is genuinely transformative — it lets designers, founders and artists build things they could only sketch before.",
      },
      {
        type: "quote",
        text: "The barrier to building has never been lower. The barrier to building well has not moved.",
      },
      { type: "h2", id: "new-builders", text: "A new generation of builders" },
      {
        type: "p",
        text: "The most exciting effect is who gets to participate. People with taste and domain knowledge but no formal engineering training can now ship. That will change what software looks like, because it changes who makes it.",
      },
      {
        type: "image",
        image: statue(
          "vibe-coding-future-inline",
          "Marble bust of Marcus Aurelius in armour against a black background.",
          1154,
          "Marc-Aurèle, Château de Hautefort · CC0",
          "50% 25%",
        ),
        caption: "Every era of tooling produces a new kind of author.",
      },
      { type: "h2", id: "where-it-goes", text: "Where it goes from here" },
      {
        type: "p",
        text: "Vibe coding will not replace engineering; it will absorb the easy half of it. The hard half — architecture, security, performance and long-term maintenance — becomes more valuable, not less. The future belongs to people who can do both: move at the speed of a prompt and think at the depth of a system.",
      },
    ],
  },
  {
    slug: "beyond-the-framework-building-better-digital-experiences",
    title: "Beyond the Framework: Building Better Digital Experiences",
    description:
      "A look at modern frontend architecture, interaction design, performance, and the details that make digital products feel exceptional.",
    topic: "web-development",
    author: ARTICLE_AUTHOR,
    publishedAt: "2026-10-19",
    readingMinutes: 9,
    artwork: "frame",
    cover: statue(
      "beyond-the-framework",
      "Marble portrait head of Aelius Verus with deeply carved curls and beard.",
      1245,
      "Aelius Verus, Ancient Agora Museum, Athens · CC0",
      "50% 35%",
    ),
    body: [
      {
        type: "p",
        text: "Frameworks are solved problems. Routing, rendering and data fetching are commodities now. What separates a forgettable site from one people remember is everything the framework does not decide for you.",
      },
      { type: "h2", id: "architecture-for-feel", text: "Architecture for feel" },
      {
        type: "p",
        text: "Good frontend architecture is invisible to users but obvious in how a product feels. Server-render what can be static, stream what is slow, and keep client JavaScript for the moments that truly need interaction. Every kilobyte you do not ship is a millisecond of attention you keep.",
      },
      {
        type: "quote",
        text: "Performance is not a metric. It is the first impression of your design.",
      },
      { type: "h2", id: "interaction-details", text: "The details people feel" },
      {
        type: "list",
        items: [
          "Motion that explains state changes instead of decorating them.",
          "Hover and focus states designed with the same care as default states.",
          "Typography that holds up at every breakpoint, not just the hero.",
          "Loading states that preserve layout, so nothing jumps.",
        ],
      },
      {
        type: "image",
        image: statue(
          "beyond-the-framework-inline",
          "Close-up of a marble head of Diocletian with a short beard.",
          1098,
          `Head of Diocletian (detail) — ${GETTY}`,
        ),
        caption: "Craft lives in the details most people will never consciously notice.",
      },
      { type: "h2", id: "ship-the-whole-thing", text: "Ship the whole experience" },
      {
        type: "p",
        text: "Exceptional products are built by people who refuse to separate design from engineering. Prototype interactions in code early, measure on real devices, and treat accessibility as part of the craft rather than a checklist at the end.",
      },
    ],
  },
  {
    slug: "the-intersection-of-design-code-and-creative-technology",
    title: "The Intersection of Design, Code, and Creative Technology",
    description:
      "Why the future of digital creation belongs to people who understand both visual language and technical systems.",
    topic: "design-creative-tech",
    author: ARTICLE_AUTHOR,
    publishedAt: "2026-10-16",
    readingMinutes: 6,
    artwork: "beam",
    cover: statue(
      "design-code-creative",
      "Marble portrait head of Julia Titi with a tall crown of carved curls.",
      1374,
      `Portrait Head of Julia Titi — ${GETTY}`,
      "50% 30%",
    ),
    body: [
      {
        type: "p",
        text: "For a long time the industry split people into designers and developers, and built handoff processes to translate between them. The most interesting work today happens where that line disappears.",
      },
      { type: "h2", id: "two-languages", text: "Fluent in two languages" },
      {
        type: "p",
        text: "Visual language is about hierarchy, rhythm, contrast and emotion. Technical systems are about state, constraints and performance. A creative technologist reads both, which means ideas survive the trip from concept to production without losing their character.",
      },
      {
        type: "quote",
        text: "The handoff is where great ideas go to become average products.",
      },
      { type: "h2", id: "tools-as-medium", text: "Code as a creative medium" },
      {
        type: "p",
        text: "Shaders, generative systems, real-time 3D and AI models are not just engineering tools; they are materials. Understanding their limits is what lets you design with them instead of around them.",
      },
      {
        type: "image",
        image: statue(
          "design-code-creative-inline",
          "Marble head of Salus seen in left profile.",
          1431,
          `Salus, left profile — ${GETTY}`,
        ),
        caption: "Form and system, observed from the same position.",
      },
      { type: "h2", id: "the-future-builder", text: "The future builder" },
      {
        type: "p",
        text: "As AI handles more of the routine production work, taste and systems thinking become the differentiators. The people who can imagine something new and also understand how to make it real will define the next decade of digital culture.",
      },
    ],
  },
];

/** Newest first. */
export const ARTICLES: Article[] = [...ARTICLE_LIST].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getFeaturedArticle(): Article {
  return ARTICLES.find((article) => article.featured) ?? ARTICLES[0];
}

/** Two-digit editorial index, e.g. 3 → "03". */
export function formatIndex(position: number): string {
  return String(position).padStart(2, "0");
}

/** A story's number in the journal index (newest first), matching the listing. */
export function getArticleNumber(slug: string): string {
  return formatIndex(ARTICLES.findIndex((article) => article.slug === slug) + 1);
}

export function getArticleHeadline(article: Pick<Article, "title" | "subtitle">): string {
  return article.subtitle ? `${article.title}: ${article.subtitle}` : article.title;
}

export function getFaqItems(article: Article): { question: string; answer: string }[] {
  return article.body.flatMap((block) => (block.type === "faq" ? block.items : []));
}

export function getTopic(slug: ArticleTopicSlug): ArticleTopic {
  return ARTICLE_TOPICS.find((topic) => topic.slug === slug)!;
}

export function isTopicFilter(value: string | null): value is ArticleTopicFilter {
  return value === "all" || ARTICLE_TOPICS.some((topic) => topic.slug === value);
}

export function toSummary(article: Article): ArticleSummary {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    topic: article.topic,
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
    cover: article.cover,
    artwork: article.artwork,
    authorName: article.author.name,
  };
}

export function getTopicCounts(
  articles: Pick<Article, "topic">[] = ARTICLES,
): Record<ArticleTopicFilter, number> {
  const counts = { all: articles.length } as Record<ArticleTopicFilter, number>;
  for (const topic of ARTICLE_TOPICS) {
    counts[topic.slug] = articles.filter((a) => a.topic === topic.slug).length;
  }
  return counts;
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const sameTopic = others.filter((a) => a.topic === article.topic);
  const rest = others.filter((a) => a.topic !== article.topic);
  return [...sameTopic, ...rest].slice(0, limit);
}

/** `previous` is the older story, `next` the newer one. */
export function getAdjacentArticles(slug: string): {
  previous?: Article;
  next?: Article;
} {
  const index = ARTICLES.findIndex((a) => a.slug === slug);
  if (index === -1) return {};
  return { previous: ARTICLES[index + 1], next: ARTICLES[index - 1] };
}

export function getTableOfContents(article: Article): { id: string; text: string }[] {
  return article.body.flatMap((block) =>
    block.type === "h2" ? [{ id: block.id, text: block.text }] : [],
  );
}

export function formatArticleDate(
  iso: string,
  style: "short" | "long" = "short",
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
