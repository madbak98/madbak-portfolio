import { WORK_CATEGORIES } from "./works-categories";

export type PetPageType =
  | "home"
  | "about"
  | "works"
  | "services"
  | "service-detail"
  | "contact"
  | "madlab"
  | "other";

export type PetPageContext = {
  route: string;
  pageType: PetPageType;
  title?: string;
  serviceSlug?: string;
  workSlug?: string;
};

/** Known service packages — used when /services/[slug] exists or is inferred. */
export const PET_SERVICE_META: Record<
  string,
  { title: string; kind: "web" | "ai" | "creative" | "general" }
> = {
  "landing-page": { title: "Landing Page Package", kind: "web" },
  portfolio: { title: "Personal / Portfolio Website", kind: "web" },
  business: { title: "Business / Corporate Website", kind: "web" },
  cinematic: { title: "Creative / Cinematic Website", kind: "creative" },
  "ai-automation": { title: "AI / Automation", kind: "ai" },
};

/**
 * Resolve lightweight Pet route context from the App Router pathname.
 * Keep pathname branching here — not scattered through JSX.
 */
export function resolvePetPageContext(pathname: string | null): PetPageContext {
  const route = pathname || "/";

  if (route === "/") {
    return { route, pageType: "home" };
  }

  if (route === "/about" || route.startsWith("/about/")) {
    return { route, pageType: "about", title: "About" };
  }

  if (route === "/contact" || route.startsWith("/contact/")) {
    return { route, pageType: "contact", title: "Contact" };
  }

  if (route === "/services") {
    return { route, pageType: "services", title: "Services" };
  }

  if (route.startsWith("/services/")) {
    const serviceSlug = route.replace("/services/", "").split("/")[0] || undefined;
    const meta = serviceSlug ? PET_SERVICE_META[serviceSlug] : undefined;
    return {
      route,
      pageType: "service-detail",
      serviceSlug,
      title: meta?.title ?? humanizeSlug(serviceSlug),
    };
  }

  if (route === "/lab" || route.startsWith("/lab/") || route === "/madlab") {
    return { route, pageType: "madlab", title: "MADLAB" };
  }

  if (route === "/works" || route.startsWith("/works/")) {
    const workSlug = route.replace(/^\/works\/?/, "").split("/")[0] || undefined;
    const category = WORK_CATEGORIES.find((c) => c.slug === workSlug);
    return {
      route,
      pageType: "works",
      workSlug,
      title: category?.shortTitle.en ?? (workSlug ? humanizeSlug(workSlug) : "Works"),
    };
  }

  return { route, pageType: "other" };
}

export type PetPresentation = "none" | "installation" | "floating";

/**
 * Visual presentation only — conversation always uses the shared MadbakPet engine.
 * installation = dedicated /about CRT (AboutPage owns it)
 * floating = persistent compact Old PC companion (homepage + other routes)
 */
export function petPresentationForContext(ctx: PetPageContext): PetPresentation {
  if (ctx.pageType === "about") return "installation";
  return "floating";
}

function humanizeSlug(slug?: string): string | undefined {
  if (!slug) return undefined;
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
