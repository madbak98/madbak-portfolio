import { permanentRedirect } from "next/navigation";

/** Preserve published Blog URLs while moving the public destination to Articles. */
export default function BlogRedirect() {
  permanentRedirect("/articles");
}
