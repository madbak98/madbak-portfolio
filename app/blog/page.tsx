import { permanentRedirect } from "next/navigation";

/** Preserve published Blog URLs while moving the public destination to MADLAB. */
export default function BlogRedirect() {
  permanentRedirect("/lab");
}
