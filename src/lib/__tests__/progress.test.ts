import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  availableMissions, checkpointState, completeMission, saveReflection,
  loadProgress, persistProgress, resetProgress, emptyProgress, progressSummary,
} from "@/lib/progress";

// Mock localStorage (vitest = node env)
const store = new Map<string, string>();
vi.stubGlobal("window", {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
});

describe("checkpoint unlocking", () => {
  it("misi pertama tiap distrik available sejak awal", () => {
    const avail = availableMissions(emptyProgress());
    expect(avail.has("m-anomaly")).toBe(true);
    expect(avail.has("m-customer")).toBe(true);
  });

  it("misi kedua & ketiga LOCKED di awal", () => {
    const avail = availableMissions(emptyProgress());
    expect(avail.has("m-dashboard")).toBe(false);
    expect(avail.has("m-uxfix")).toBe(false);
    expect(avail.has("m-bizcase")).toBe(false);
    expect(avail.has("m-invest")).toBe(false);
  });

  it("menyelesaikan misi 1 membuka misi 2 (distrik sama)", () => {
    let p = completeMission(emptyProgress(), "m-anomaly");
    const avail = availableMissions(p);
    expect(avail.has("m-dashboard")).toBe(true);
    expect(avail.has("m-uxfix")).toBe(false); // masih terkunci
  });

  it("menyelesaikan misi 2 membuka misi 3", () => {
    let p = completeMission(emptyProgress(), "m-anomaly");
    p = completeMission(p, "m-dashboard");
    expect(availableMissions(p).has("m-uxfix")).toBe(true);
  });

  it("cabang paralel: menyelesaikan PPTI tidak memblokir PPBP", () => {
    let p = completeMission(emptyProgress(), "m-anomaly");
    expect(availableMissions(p).has("m-customer")).toBe(true); // PPBP tetap terbuka
  });

  it("checkpoint state mengikuti progress", () => {
    const p = completeMission(emptyProgress(), "m-anomaly");
    expect(checkpointState("cp-anomaly", p)).toBe("completed");
    expect(checkpointState("cp-data", p)).toBe("available");
    expect(checkpointState("cp-ux", p)).toBe("locked");
  });

  it("hub selalu available (user bebas navigasi)", () => {
    const p = emptyProgress();
    expect(checkpointState("cp-characters", p)).toBe("available");
    expect(checkpointState("cp-stories", p)).toBe("available");
    expect(checkpointState("cp-futurepath", p)).toBe("available");
  });

  it("completeMission idempotent — tidak duplikat", () => {
    let p = completeMission(emptyProgress(), "m-anomaly");
    p = completeMission(p, "m-anomaly");
    expect(p.completedMissions).toEqual(["m-anomaly"]);
  });

  it("missionId tak dikenal ditolak", () => {
    const p = completeMission(emptyProgress(), "m-hack");
    expect(p.completedMissions).toEqual([]);
  });
});

describe("progress persistence (localStorage)", () => {
  beforeEach(() => store.clear());

  it("save → load round-trip utuh", () => {
    let p = completeMission(emptyProgress(), "m-customer");
    p = saveReflection(p, { missionId: "m-customer", enjoyed: ["Membantu orang"], challenged: ["Aturan ketat"], nextTry: "PPTI" });
    persistProgress(p);
    const q = loadProgress();
    expect(q.completedMissions).toEqual(["m-customer"]);
    expect(q.reflections["m-customer"].enjoyed).toEqual(["Membantu orang"]);
  });

  it("data korup → fallback empty, tidak crash", () => {
    store.set("futuretry.journey.v1", "{not json!!");
    expect(loadProgress()).toEqual(emptyProgress());
  });

  it("field hilang → dinormalisasi", () => {
    store.set("futuretry.journey.v1", JSON.stringify({ completedMissions: "bukan array" }));
    const p = loadProgress();
    expect(p.completedMissions).toEqual([]);
  });

  it("reset menghapus storage", () => {
    persistProgress(completeMission(emptyProgress(), "m-anomaly"));
    resetProgress();
    expect(store.size).toBe(0);
    expect(loadProgress().completedMissions).toEqual([]);
  });
});

describe("progress summary", () => {
  it("persentase benar", () => {
    let p = emptyProgress();
    expect(progressSummary(p).percent).toBe(0);
    p = completeMission(p, "m-anomaly");
    expect(progressSummary(p).done).toBe(1);
    expect(progressSummary(p).total).toBe(6);
    expect(progressSummary(p).percent).toBe(17);
  });
});
