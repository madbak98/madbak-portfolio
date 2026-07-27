import { readFile } from "node:fs/promises";
import path from "node:path";

import { getReactBitsFreeItem } from "../../../lib/react-bits-free";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const item = getReactBitsFreeItem(slug);

  if (!item) {
    return Response.json({ error: "MADLAB item not found." }, { status: 404 });
  }

  try {
    const code = await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), item.localSourcePath), "utf8");
    return Response.json({
      title: item.title,
      variant: "TS + Tailwind",
      sourcePath: item.sourcePath,
      code,
    });
  } catch {
    return Response.json({ error: "Source is not available locally for this item yet." }, { status: 404 });
  }
}
