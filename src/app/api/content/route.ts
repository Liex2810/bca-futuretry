import { NextResponse } from "next/server";
import { missions } from "@/lib/content/missions";
import { checkpoints } from "@/lib/content/map";
import { stories } from "@/lib/content/stories";
import { faqs, eligibilityRules, programInfo } from "@/lib/content/futurepath";
import { characters } from "@/lib/content/characters";

// GET /api/content — satu endpoint utk semua data statis (mission data,
// checkpoints, stories, futurepath). Client fetch sekali lalu cache.
export async function GET() {
  return NextResponse.json({
    missions,
    checkpoints,
    stories,
    characters,
    faqs,
    eligibilityRules,
    programInfo,
  });
}
