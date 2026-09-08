"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { JourneyProgress, Reflection } from "@/types";
import {
  checkpointState, completeMission, emptyProgress, loadProgress,
  persistProgress, resetProgress as resetStore, saveReflection,
} from "@/lib/progress";
import { missionById } from "@/lib/content/missions";
import { Events } from "@/lib/analytics";

interface JourneyCtx {
  progress: JourneyProgress;
  ready: boolean;
  finishMission: (missionId: string) => void;
  saveReflect: (r: Reflection) => void;
  reset: () => void;
  stateOf: (checkpointId: string) => ReturnType<typeof checkpointState>;
}

const Ctx = createContext<JourneyCtx | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<JourneyProgress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => { setProgress(loadProgress()); setReady(true); }, []);

  const finishMission = useCallback((missionId: string) => {
    setProgress((p) => { const n = completeMission(p, missionId); persistProgress(n); return n; });
    const m = missionById(missionId);
    if (m) Events.missionComplete(m.id, m.program);
  }, []);

  const saveReflect = useCallback((r: Reflection) => {
    setProgress((p) => { const n = saveReflection(p, r); persistProgress(n); return n; });
    Events.reflectionSave(r.missionId);
  }, []);

  const reset = useCallback(() => { setProgress(resetStore()); }, []);

  const value = useMemo(() => ({
    progress, ready, finishMission, saveReflect, reset,
    stateOf: (id: string) => checkpointState(id, progress),
  }), [progress, ready, finishMission, saveReflect, reset]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useJourney() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useJourney harus di dalam JourneyProvider");
  return ctx;
}
