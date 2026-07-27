import { permanentRedirect } from "next/navigation";

/** Preserve published Blog post URLs while moving the public destination to MADLAB. */
export default function BlogPostRedirect() {
  permanentRedirect("/lab");
}
