"use client";

import { track } from "@vercel/analytics";

// Event funnel: landing -> masuk world -> selesai misi -> refleksi -> futurepath -> klik apply
export const Events = {
  worldOpen: (from?: string) => track("world_open", { from }),
  missionStart: (id: string, program: string) => track("mission_start", { mission: id, program }),
  missionComplete: (id: string, program: string) => track("mission_complete", { mission: id, program }),
  reflectionSave: (id: string) => track("reflection_save", { mission: id }),
  cardDownload: (id: string, format: "png" | "txt") => track("card_download", { mission: id, format }),
  futurepathOpen: () => track("futurepath_open"),
  applyClick: (program: string) => track("apply_click", { program }),
  chatAsk: (len: number) => track("chat_ask", { len }),
} as const;
