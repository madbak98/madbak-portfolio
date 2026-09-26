import { redirect } from "next/navigation";

/** /works has no archive index — land on the primary category. */
export default function WorksIndexPage() {
  redirect("/works/websites");
}
