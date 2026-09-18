import type { Metadata } from "next";
import { stories } from "@/lib/content/stories";
import { StoriesExplorer } from "@/components/StoriesExplorer";

export const metadata: Metadata = {
  title: "Stories — BCA FutureTry",
  description: "Cerita perjalanan dari berbagai divisi di jalur PPBP dan PPTI.",
};

export default function StoriesPage() {
  return <StoriesExplorer stories={stories} />;
}
