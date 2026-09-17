import type { Metadata } from "next";
import { stories } from "@/lib/content/stories";
import { StoriesExplorer } from "@/components/StoriesExplorer";

export const metadata: Metadata = {
  title: "Stories — BCA FutureTry",
  description: "Kumpulan cerita ilustratif PPBP & PPTI untuk demonstrasi tampilan FutureTry.",
};

export default function StoriesPage() {
  return <StoriesExplorer stories={stories} />;
}
