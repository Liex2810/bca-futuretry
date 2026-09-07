import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { missionById } from "@/lib/content/missions";
import { MissionPlayer } from "@/components/MissionPlayer";

export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Metadata {
  return { title: "Misi — BCA FutureTry" };
}

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = missionById(id);
  if (!mission) notFound();
  return <MissionPlayer mission={mission} />;
}
