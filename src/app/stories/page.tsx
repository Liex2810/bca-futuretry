import type { Metadata } from "next";
import { stories } from "@/lib/content/stories";
import { StoriesExplorer } from "@/components/StoriesExplorer";

export const metadata: Metadata = {
  title: "Stories — BCA FutureTry",
  description: "Cerita nyata awardee PPBP & PPTI: ekspektasi vs realita, keseharian, dan pelajaran mereka.",
};

export default function StoriesPage() {
  return <StoriesExplorer stories={stories} />;
}
