import type { Checkpoint } from "@/types";

// ════════════════════════════════════════════════════════════════
//  FUTURE WORLD MAP — checkpoint positions (persen 0-100 pada SVG)
//  Urutan unlock: karakter → 2 misi pertama → hub story →
//  sisanya terbuka berpasangan per distrik.
// ════════════════════════════════════════════════════════════════

export const checkpoints: Checkpoint[] = [
  // Character District (tengah bawah — pintu masuk)
  { id: "cp-characters", label: "Meet the Guides", district: "character", x: 50, y: 82, kind: "hub" },

  // Technology & Digital District (kiri atas) — PPTI
  { id: "cp-anomaly", label: "Security Ops", district: "technology", x: 16, y: 24, missionId: "m-anomaly", kind: "mission" },
  { id: "cp-data", label: "Data Lab", district: "technology", x: 30, y: 13, missionId: "m-dashboard", kind: "mission" },
  { id: "cp-ux", label: "Design Studio", district: "technology", x: 42, y: 27, missionId: "m-uxfix", kind: "mission" },

  // Business & Banking District (kanan atas) — PPBP
  { id: "cp-customer", label: "Customer Hall", district: "business", x: 58, y: 27, missionId: "m-customer", kind: "mission" },
  { id: "cp-strategy", label: "Strategy Room", district: "business", x: 70, y: 13, missionId: "m-bizcase", kind: "mission" },
  { id: "cp-invest", label: "Investment Desk", district: "business", x: 84, y: 24, missionId: "m-invest", kind: "mission" },

  // Story District (kanan tengah)
  { id: "cp-stories", label: "Story Quarter", district: "story", x: 82, y: 62, kind: "hub" },

  // FuturePath District (kiri tengah)
  { id: "cp-futurepath", label: "FuturePath Gate", district: "futurepath", x: 18, y: 62, kind: "hub" },
];

// Jalur antar checkpoint ( utk garis jalan di peta )
export const mapPaths: [string, string][] = [
  ["cp-characters", "cp-anomaly"],
  ["cp-characters", "cp-customer"],
  ["cp-anomaly", "cp-data"],
  ["cp-data", "cp-ux"],
  ["cp-customer", "cp-strategy"],
  ["cp-strategy", "cp-invest"],
  ["cp-characters", "cp-stories"],
  ["cp-characters", "cp-futurepath"],
];

// Urutan unlock misi: index naik = makin akhir. Hub selalu available
// (tidak memblokir navigasi), misi mengikuti urutan ini.
export const missionUnlockOrder = [
  "m-anomaly",   // PPTI pertama
  "m-customer",  // PPBP pertama
  "m-dashboard",
  "m-bizcase",
  "m-uxfix",
  "m-invest",
];

export const districtMeta: Record<string, { name: string; program: string; color: string; desc: string }> = {
  technology: { name: "Technology & Digital", program: "PPTI", color: "#08BBD4", desc: "Security, data, dan produk digital" },
  business: { name: "Business & Banking", program: "PPBP", color: "#0D70B4", desc: "Nasabah, strategi, dan investasi" },
  character: { name: "Character Plaza", program: "", color: "#F467B0", desc: "Kenali lima pemandumu" },
  story: { name: "Story Quarter", program: "", color: "#8CDDE7", desc: "Cerita nyata para awardee" },
  futurepath: { name: "FuturePath Gate", program: "", color: "#2CC7DD", desc: "Informasi resmi & langkah berikutnya" },
};
