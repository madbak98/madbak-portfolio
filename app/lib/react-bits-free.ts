export type ReactBitsFreeCategory = "ANIMATIONS" | "BACKGROUNDS" | "COMPONENTS" | "TEXT ANIMATIONS";

export type ReactBitsFreeItem = {
  title: string;
  slug: string;
  category: ReactBitsFreeCategory;
  sourceName: string;
  sourcePath: string;
  featured?: boolean;
};

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const items = (category: ReactBitsFreeCategory, titles: string[]): ReactBitsFreeItem[] =>
  titles.map((title) => {
    const slug = `catalog-${slugify(title)}`;
    const sourceName = title === "ASCIIText"
      ? "ASCIIText"
      : title.split(/\s+/).map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join("");
    const sourceCategory = category === "TEXT ANIMATIONS" ? "TextAnimations" : `${category.charAt(0)}${category.slice(1).toLowerCase()}`;
    return {
      title,
      slug,
      category,
      sourceName,
      sourcePath: `src/ts-tailwind/${sourceCategory}/${sourceName}/${sourceName}.tsx`,
      featured: ["Cursor Grid", "Specular Button", "Lightfall", "Ferrofluid", "Magic Bento", "Shiny Text"].includes(title),
    };
  });

// The catalog below contains the free component references only; paid blocks
// and templates are intentionally not included here.
export const REACT_BITS_FREE_ITEMS: ReactBitsFreeItem[] = [
  ...items("ANIMATIONS", [
    "Cursor Grid", "Strands", "Animated Content", "Antigravity", "Blob Cursor", "Click Spark",
    "Crosshair", "Cubes", "Electric Border", "Logo Loop", "Magic Rings", "Magnet",
  ]),
  ...items("BACKGROUNDS", [
    "Letter Glitch", "Shape Grid", "Waves",
  ]),
  ...items("COMPONENTS", [
    "Animated List", "Counter", "Folder", "Spotlight Card",
  ]),
  ...items("TEXT ANIMATIONS", [
    "Blur Text", "Circular Text", "Count Up", "Gradient Text", "Shiny Text", "True Focus",
  ]),
];

export const REACT_BITS_FREE_GROUPS = (['ANIMATIONS', 'BACKGROUNDS', 'COMPONENTS', 'TEXT ANIMATIONS'] as const).map((category) => ({
  title: category,
  items: REACT_BITS_FREE_ITEMS.filter((item) => item.category === category),
}));

export function getReactBitsFreeItem(slug: string): ReactBitsFreeItem | undefined {
  return REACT_BITS_FREE_ITEMS.find((item) => item.slug === slug);
}
