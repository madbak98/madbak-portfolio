import type { Metadata } from "next";

import { JsonLd } from "../components/seo/JsonLd";
import { buildServicesMetadata, buildServicesPageJsonLd } from "../lib/seo";
import ServicesPage from "./ServicesPage";

export const metadata: Metadata = buildServicesMetadata("en");

export default function Page() {
  return (
    <>
      <JsonLd data={buildServicesPageJsonLd("en")} />
      <ServicesPage />
    </>
  );
}
