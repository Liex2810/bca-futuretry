// ════════════════════════════════════════════════════════════════
//  BCA FutureTry — shared types
// ════════════════════════════════════════════════════════════════

export type Program = "PPBP" | "PPTI";

export type District =
  | "business"      // Business & Banking District  (PPBP)
  | "technology"    // Technology & Digital District (PPTI)
  | "character"     // Character District
  | "story"         // Story District
  | "futurepath";   // FuturePath District

// ── Characters (FESEA) ──────────────────────────────────────────
export interface Character {
  id: string;            // fino | elia | seno | esha | adit
  name: string;
  fesea: "Functional" | "Emotional" | "Social" | "Experiential" | "Action";
  program: Program;
  field: string;
  message: string;       // quote (Bahasa, sesuai brief)
  answers: string;       // pertanyaan user yang dijawab
  accent: string;        // hex warna aksen
  emojiSeed: string;     // inisial utk avatar SVG
}

// ── Missions ────────────────────────────────────────────────────
export interface MissionChoice {
  id: string;
  label: string;
  detail?: string;
  consequence: string;   // narasi hasil pilihan (tanpa benar/salah)
  skills: string[];      // skill yang dirasakan
}

export interface MissionStep {
  id: string;
  narration: string;     // konteks cerita
  prompt: string;        // pertanyaan / situasi
  choices: MissionChoice[];
}

export interface Mission {
  id: string;
  title: string;
  program: Program;
  district: District;
  role: string;          // role yang dicoba
  duration: string;      // perkiraan durasi
  summary: string;       // deskripsi pendek utk popover checkpoint
  intro: string;         // paragraf pembuka misi
  steps: MissionStep[];
  reflectionHints: { enjoy: string[]; challenge: string[] };
}

// ── Checkpoints (peta Future World) ─────────────────────────────
export type CheckpointState = "completed" | "available" | "locked" | "current";

export interface Checkpoint {
  id: string;            // sama dgn missionId utk checkpoint misi
  label: string;
  district: District;
  x: number;             // posisi % pada peta (0-100)
  y: number;
  missionId?: string;    // undefined = checkpoint non-misi (character/story/futurepath)
  kind: "mission" | "hub";
}

// ── Stories ─────────────────────────────────────────────────────
export interface Story {
  id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  program: Program;
  role: string;
  title: string;
  excerpt: string;
  dayInLife: { time: string; activity: string }[];
  expectationVsReality: { expectation: string; reality: string };
  hardestPart: string;
  favoriteMoment: string;
  tools: string[];
}

// ── FuturePath ──────────────────────────────────────────────────
export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  source: string;        // sumber resmi / tanggal update
  tags: string[];
}

export interface EligibilityRule {
  id: string;
  program: Program;
  requirement: string;
  explanation: string;
  source: string;
}

// ── Progress & Future Card ──────────────────────────────────────
export interface Reflection {
  missionId: string;
  enjoyed: string[];     // chip pilihan
  challenged: string[];
  nextTry: string;
  note?: string;
}

export interface JourneyProgress {
  completedMissions: string[];
  unlocked: string[];
  reflections: Record<string, Reflection>;
  startedAt?: string;
  /** waktu selesai per misi ( utk Journey Log ) */
  completedAt?: Record<string, string>;
}
