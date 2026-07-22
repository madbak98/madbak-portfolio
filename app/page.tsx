import type { Metadata } from "next";

import { JsonLd } from "./components/seo/JsonLd";
import HomePage from "./HomePage";
import { buildHomeMetadata, homeJsonLdGraph } from "./lib/seo";

export const metadata: Metadata = buildHomeMetadata("en");

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLdGraph()} />
      <HomePage />
    </>
  );
}
