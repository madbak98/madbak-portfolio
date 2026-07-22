import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Apex-preferred domain strategy:
 * https://www.madbak.art/* → 308 → https://madbak.art/*
 * Pathname and query string are preserved. No redirect loop on apex.
 */
export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  if (hostname === "www.madbak.art") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "madbak.art";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all paths except Next internals and common static assets.
     * Domain redirect still applies to pages and SEO endpoints.
     */
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|txt|xml)$).*)",
  ],
};
