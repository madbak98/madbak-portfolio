import type { Metadata } from "next";

import { JsonLd } from "../components/seo/JsonLd";
import { buildAboutMetadata, buildAboutPageJsonLd } from "../lib/seo";
import AboutPage from "./AboutPage";

export const metadata: Metadata = buildAboutMetadata("en");

export default function Page() {
  return (
    <>
      <JsonLd data={buildAboutPageJsonLd("en")} />
      <AboutPage />
    </>
  );
}
