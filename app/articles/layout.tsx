import { Archivo } from "next/font/google";

import { ArticlesFooter } from "../components/articles/ArticlesFooter";
import { ARTICLES_THEME_SCRIPT } from "../components/articles/articles-theme";
import { ArticlesNav } from "../components/articles/ArticlesNav";
import { ARTICLES, toSummary } from "../lib/articles";
import "./articles.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export default function ArticlesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The inline script sets the theme attribute before hydration.
    <div className={`${archivo.variable} articles-root`} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: ARTICLES_THEME_SCRIPT }} />
      <a
        href="#articles-main"
        className="a-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-(--a-purple) focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <ArticlesNav searchIndex={ARTICLES.map(toSummary)} />
      <main id="articles-main">{children}</main>
      <ArticlesFooter />
    </div>
  );
}
