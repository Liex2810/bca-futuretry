import type { Checkpoint } from "@/types";

// ════════════════════════════════════════════════════════════════
//  FUTURE WORLD MAP — checkpoint positions (persen 0-100 pada SVG)
//  Urutan unlock: karakter → 2 misi pertama → hub story →
//  sisanya terbuka berpasangan per distrik.
// ════════════════════════════════════════════════════════════════

export const checkpoints: Checkpoint[] = [
  // Pintu masuk di tengah; dua jalur program bergerak ke atas secara paralel.
  { id: "cp-characters", label: "Meet the Guides", district: "character", x: 50, y: 86, kind: "hub" },

  // Jalur PPTI — Data Lab, Security Operations, lalu Design Studio.
  { id: "cp-data", label: "Data Lab", district: "technology", x: 27, y: 67, missionId: "m-dashboard", kind: "mission" },
  { id: "cp-anomaly", label: "Security Ops", district: "technology", x: 27, y: 49, missionId: "m-anomaly", kind: "mission" },
  { id: "cp-ux", label: "Design Studio", district: "technology", x: 27, y: 31, missionId: "m-uxfix", kind: "mission" },

  // Jalur PPBP — Strategy Room lalu Investment Desk.
  { id: "cp-strategy", label: "Strategy Room", district: "business", x: 73, y: 58, missionId: "m-bizcase", kind: "mission" },
  { id: "cp-invest", label: "Investment Desk", district: "business", x: 73, y: 31, missionId: "m-invest", kind: "mission" },

  // Resource hub ditempatkan di sisi pintu masuk; bukan bagian urutan misi.
  { id: "cp-stories", label: "Story Quarter", district: "story", x: 87, y: 84, kind: "hub" },
  { id: "cp-futurepath", label: "FuturePath Gate", district: "futurepath", x: 13, y: 84, kind: "hub" },
];

export const mapPaths: [string, string][] = [
  ["cp-characters", "cp-data"],
  ["cp-data", "cp-anomaly"],
  ["cp-anomaly", "cp-ux"],
  ["cp-characters", "cp-strategy"],
  ["cp-strategy", "cp-invest"],
  ["cp-characters", "cp-stories"],
  ["cp-characters", "cp-futurepath"],
];

// Urutan unlock misi: index naik = makin akhir. Hub selalu available
// (tidak memblokir navigasi), misi mengikuti urutan ini.
export const missionUnlockOrder = [
  "m-dashboard", // PPTI pertama
  "m-bizcase",   // PPBP pertama
  "m-anomaly",
  "m-uxfix",
  "m-invest",
];

export const districtMeta: Record<string, { name: string; program: string; color: string; desc: string }> = {
  technology: { name: "Technology & Digital", program: "PPTI", color: "#08BBD4", desc: "Security, data, dan produk digital" },
  business: { name: "Business & Banking", program: "PPBP", color: "#0D70B4", desc: "Nasabah, strategi, dan investasi" },
  character: { name: "Character Plaza", program: "", color: "#F467B0", desc: "Kenali lima pemandumu" },
  story: { name: "Story Quarter", program: "", color: "#8CDDE7", desc: "Template cerita ilustratif" },
  futurepath: { name: "FuturePath Gate", program: "", color: "#2CC7DD", desc: "Placeholder informasi program" },
};
