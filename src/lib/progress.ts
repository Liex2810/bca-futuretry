import type { CheckpointState, JourneyProgress, Reflection } from "@/types";
import { checkpoints, missions } from "./content/map-re-export";

// ════════════════════════════════════════════════════════════════
//  PROGRESS LOGIC — aturan unlock checkpoint.
//
//  - Hub (character/story/futurepath) SELALU available → user bebas
//    navigasi, tidak dihukum.
//  - Tiap distrik punya 3 misi berurutan. Misi pertama available
//    dari awal; menyelesaikan misi N membuka misi N+1 (distrik
//    yang sama). Dua cabang (PPBP & PPTI) paralel → user tidak
//    dipaksa memilih di awal.
//  - Completed tetap completed.
//  - Persistensi: localStorage (demo, no-login).
// ════════════════════════════════════════════════════════════════

export const STORAGE_KEY = "futuretry.journe…t.v1";

// Urutan misi per distrik (index 0 = terbuka sejak awal)
export const districtMissionOrder: Record<string, string[]> = {
  technology: ["m-anomaly", "m-dashboard", "m-uxfix"],
  business: ["m-customer", "m-bizcase", "m-invest"],
};

export const emptyProgress = (): JourneyProgress => ({
  completedMissions: [],
  unlocked: [],
  reflections: {},
  completedAt: {},
});

/** Misi mana yang boleh dimulai, diberikan progress saat ini. */
export function availableMissions(progress: JourneyProgress): Set<string> {
  const done = new Set(progress.completedMissions);
  const avail = new Set<string>();
  for (const order of Object.values(districtMissionOrder)) {
    for (let i = 0; i < order.length; i++) {
      if (i === 0 || done.has(order[i - 1])) avail.add(order[i]);
    }
  }
  return avail;
}

/** State sebuah checkpoint utk user dengan progress tsb. */
export function checkpointState(cpId: string, progress: JourneyProgress): CheckpointState {
  const cp = checkpoints.find((c) => c.id === cpId);
  if (!cp) return "locked";
  if (cp.kind === "hub") return "available";
  const mid = cp.missionId!;
  if (progress.completedMissions.includes(mid)) return "completed";
  return availableMissions(progress).has(mid) ? "available" : "locked";
}

/** Selesaikan misi → kembalikan progress baru (idempotent). */
export function completeMission(progress: JourneyProgress, missionId: string): JourneyProgress {
  if (progress.completedMissions.includes(missionId)) return progress;
  if (!missions.some((m) => m.id === missionId)) return progress;
  const completedMissions = [...progress.completedMissions, missionId];
  const next = {
    ...progress,
    startedAt: progress.startedAt ?? new Date().toISOString(),
    completedMissions,
    completedAt: { ...progress.completedAt, [missionId]: new Date().toISOString() },
  };
  return { ...next, unlocked: Array.from(new Set([...progress.unlocked, ...availableMissions(next)])) };
}

export function saveReflection(progress: JourneyProgress, reflection: Reflection): JourneyProgress {
  return { ...progress, reflections: { ...progress.reflections, [reflection.missionId]: reflection } };
}

export function resetProgress(): JourneyProgress {
  if (typeof window !== "undefined") {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* private mode */ }
  }
  return emptyProgress();
}

/** Ringkasan utk progress indicator. */
export function progressSummary(progress: JourneyProgress) {
  const total = missions.length;
  const done = progress.completedMissions.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

/** Entri Journey Log: misi selesai + waktu, terbaru di atas. */
export function journeyLog(progress: JourneyProgress) {
  return progress.completedMissions
    .flatMap((id) => {
      const mission = missions.find((m) => m.id === id);
      return mission ? [{ mission, at: progress.completedAt?.[id] }] : [];
    })
    .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
}

/** Pemandu aktif = karakter dari program yang paling sering dijelajahi; default: Fino. */
export function guideForDistrict(district: string | undefined, characters: { program: string }[]) {
  const program = district === "business" ? "PPBP" : district === "technology" ? "PPTI" : undefined;
  return characters.find((c) => c.program === program) ?? null;
}

// ── Persistensi (client-side only) ──────────────────────────────
export function loadProgress(): JourneyProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<JourneyProgress>;
    return {
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
      reflections: parsed.reflections && typeof parsed.reflections === "object" ? parsed.reflections : {},
      startedAt: parsed.startedAt,
      completedAt: parsed.completedAt && typeof parsed.completedAt === "object" ? parsed.completedAt : {},
    };
  } catch {
    return emptyProgress();
  }
}

export function persistProgress(progress: JourneyProgress) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* quota/private */ }
}
