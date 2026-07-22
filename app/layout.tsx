import type { Metadata } from "next";
import { Bevan, Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import { SiteCursor } from "./components/SiteCursor";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "./lib/site";
import { HOME_SEO } from "./lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const bevan = Bevan({
  variable: "--font-bevan-family",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

/**
 * Persian UI: Vazirmatn via next/font (production-ready, full Arabic + Latin glyphs).
 * Peyda is not available in next/font/google; local Peyda could be added later under /public/fonts.
 */
const vazirmatn = Vazirmatn({
  variable: "--font-fa",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const home = HOME_SEO.en;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: home.title,
    template: "%s — Madbak",
  },
  description: home.description,
  applicationName: SITE_NAME,
  authors: [{ name: "Babak Ravanbakhsh", url: SITE_URL }],
  creator: "Babak Ravanbakhsh",
  publisher: SITE_NAME,
  keywords: home.keywords,
  category: "portfolio",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fa_IR", "tr_TR"],
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: home.title,
    description: home.description,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        width: DEFAULT_OG_IMAGE_WIDTH,
        height: DEFAULT_OG_IMAGE_HEIGHT,
        alt: "Madbak portfolio — creative frontend developer and web designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: home.title,
    description: home.description,
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bevan.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden">
        {children}
        <SiteCursor />
      </body>
    </html>
  );
}
