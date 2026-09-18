"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Lightbulb,
  Sparkles,
  Swords,
  Shield,
  Trophy,
  Zap,
  RotateCcw,
  Compass,
} from "lucide-react";
import type { Mission } from "@/types";
import { Events } from "@/lib/analytics";
import { useJourney } from "./JourneyProvider";
import { checkpoints } from "@/lib/content/map";
import { FutureCard } from "./FutureCard";

type Phase = "intro" | "step" | "done" | "reflect" | "card";

function sessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ft.session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("ft.session", id);
  }
  return id;
}

const mentorTips: Record<string, string[]> = {
  PPTI: [
    "Fokus pada akar masalah sebelum mengambil tindakan. Analisis data yang akurat adalah kunci kehandalan sistem.",
    "Pertimbangkan trade-off antara kecepatan implementasi dan keamanan data nasabah BCA.",
    "Sistem perbankan modern mengutamakan stabilitas dan skalabilitas jangka panjang.",
    "Pilihan yang baik selalu didasari pengujian menyeluruh dan kolaborasi tim.",
  ],
  PPBP: [
    "Pahami profil dan kebutuhan nasabah sebelum merumuskan solusi perbankan.",
    "Setiap peluang bisnis harus diimbangi dengan mitigasi risiko yang matang.",
    "Komunikasi yang empatik dan transparan membangun kepercayaan jangka panjang.",
    "Integritas adalah prinsip tertinggi dalam setiap transaksi dan keputusan finansial.",
  ],
};

export function MissionPlayer({ mission }: { mission: Mission }) {
  const { progress, ready, finishMission, saveReflect, stateOf } = useJourney();
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [picks, setPicks] = useState<{ stepId: string; choiceId: string }[]>([]);
  const [lastChoice, setLastChoice] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [reopened, setReopened] = useState(false);
  const draftKey = `ft.mission-draft.v1.${mission.id}`;

  const heroImg = mission.program === "PPTI" ? "/character-ppti.png" : "/character-ppbp.png";
  const mentorTitle = mission.program === "PPTI" ? "PPTI Tech Mentor" : "PPBP Business Mentor";
  const tips = mentorTips[mission.program] || mentorTips.PPTI;
  const currentTip = tips[stepIdx % tips.length];

  useEffect(() => {
    if (!ready) return;
    try {
      const raw = localStorage.getItem(draftKey);
      const d = raw ? JSON.parse(raw) : null;
      if (
        d &&
        ["intro", "step", "done", "reflect", "card"].includes(d.phase) &&
        Number.isInteger(d.stepIdx) &&
        d.stepIdx >= 0 &&
        d.stepIdx < mission.steps.length &&
        Array.isArray(d.picks) &&
        d.picks.every((p: { stepId: string; choiceId: string }) =>
          mission.steps.some((s) => s.id === p.stepId && s.choices.some((c) => c.id === p.choiceId))
        ) &&
        new Set(d.picks.map((p: { stepId: string }) => p.stepId)).size === d.picks.length
      ) {
        setPhase(d.phase);
        setStepIdx(d.stepIdx);
        setPicks(d.picks);
        setLastChoice(
          d.picks.find((p: { stepId: string }) => p.stepId === mission.steps[d.stepIdx].id)?.choiceId ?? null
        );
        setReopened(progress.completedMissions.includes(mission.id));
      } else {
        setReopened(progress.completedMissions.includes(mission.id));
      }
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, [ready, draftKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ phase, stepIdx, picks }));
    } catch {
      setStorageError(true);
    }
  }, [loaded, draftKey, phase, stepIdx, picks]);

  const replay = () => {
    setPicks([]);
    setLastChoice(null);
    setStepIdx(0);
    setPhase("intro");
    setReopened(false);
  };

  const cpId = checkpoints.find((c) => c.missionId === mission.id)?.id;
  const locked = cpId ? stateOf(cpId) === "locked" : false;
  const step = mission.steps[stepIdx];
  const choice = lastChoice ? step?.choices.find((c) => c.id === lastChoice) : null;

  const pick = (choiceId: string) => {
    setLastChoice(choiceId);
    setPicks((p) => [...p.filter((v) => v.stepId !== step.id), { stepId: step.id, choiceId }]);
  };

  const next = () => {
    setLastChoice(null);
    if (stepIdx + 1 < mission.steps.length) {
      setStepIdx(stepIdx + 1);
    } else {
      finishMission(mission.id);
      Events.missionComplete(mission.id, mission.program ?? mission.id);
      setPhase("done");
    }
  };

  const submitReflection = async (r: {
    enjoyed: string[];
    challenged: string[];
    nextTry: string;
    note?: string;
  }) => {
    saveReflect({ missionId: mission.id, ...r });
    Events.reflectionSave(mission.id);
    setPhase("card");
    try {
      await fetch("/api/mission/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: mission.id,
          choices: picks,
          reflection: r,
          sessionId: sessionId(),
        }),
      });
    } catch {
      // offline/demo: localStorage sudah menyimpan
    }
  };

  if (!ready || !loaded) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-3 shadow-sm text-sm font-bold text-[#063b66]">
          <Sparkles className="size-4 text-[#0066ae] animate-spin" />
          <span>Menyiapkan ruang misi…</span>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 mb-4">
          <Shield className="size-8 text-slate-400" />
        </div>
        <p className="font-bold text-xs uppercase tracking-widest text-[#005baa] mb-1">CHECKPOINT TERKUNCI</p>
        <h1 className="text-2xl font-black text-[#063b66]">Misi ini belum terbuka</h1>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          Selesaikan checkpoint sebelumnya pada jalur <strong>{mission.program}</strong> untuk membuka quest ini.
        </p>
        <Link
          href="/world"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#005baa] text-white font-bold text-sm hover:bg-[#004b8d] transition"
        >
          <ArrowLeft size={16} /> Kembali ke Peta
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#f8fafc] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Status Penyimpanan */}
        <p role="status" className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          {storageError
            ? "Penyimpanan browser tidak tersedia. Progres sesi ini bisa hilang saat refresh."
            : "Draft otomatis tersimpan di browser ini. Refresh untuk melanjutkan tidak menghapus pilihanmu."}
        </p>

        {reopened && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <Check className="size-4 stroke-[3]" />
              <span>Quest Selesai Sebelumnya</span>
            </div>
            <h2 className="font-black text-lg text-[#063b66]">Misi ini sudah kamu selesaikan!</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Kamu bisa melihat hasil kartu refleksi sebelumnya atau mencoba kembali untuk bereksplorasi dengan pilihan berbeda.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                className="px-5 py-2.5 rounded-xl bg-[#005baa] text-white font-bold text-xs hover:bg-[#004b8d] transition"
                onClick={() => {
                  setPhase("card");
                  setReopened(false);
                }}
              >
                Lihat Kartu Refleksi
              </button>
              <button
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition"
                onClick={replay}
              >
                Ulangi Misi
              </button>
              {phase !== "card" && phase !== "intro" && (
                <button
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => setReopened(false)}
                >
                  Lanjutkan Draft
                </button>
              )}
            </div>
          </section>
        )}

        {/* Game Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/world"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#063b66] shadow-sm hover:border-[#005baa] hover:text-[#005baa] transition"
          >
            <Compass className="size-4 text-[#005baa]" />
            <span>← Kembali ke Peta</span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                mission.program === "PPTI"
                  ? "bg-sky-50 text-[#005baa] border border-sky-200"
                  : "bg-blue-50 text-[#063b66] border border-blue-200"
              }`}
            >
              Jalur {mission.program} · {mission.role}
            </span>
          </div>
        </div>

        {/* Progress Tracker (Saat masuk ke tahap step) */}
        {phase !== "intro" && phase !== "card" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#063b66] mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-[#005baa]" />
                Tahap {stepIdx + 1} dari {mission.steps.length}
              </span>
              <span className="text-[#005baa]">
                {Math.round(((stepIdx + 1) / mission.steps.length) * 100)}% Selesai
              </span>
            </div>
            <div className="flex items-center gap-2" aria-label={`Langkah ${stepIdx + 1} dari ${mission.steps.length}`}>
              {mission.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-200 ${
                    i < stepIdx
                      ? "bg-emerald-500"
                      : i === stepIdx
                      ? "bg-[#005baa]"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {!reopened && (
          <AnimatePresence mode="wait">
            {/* ══════════════════════════════════════════════════════════════
                1. INTRO / MISSION BRIEFING (SOLID GAME HUD)
                ══════════════════════════════════════════════════════════════ */}
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start"
              >
                {/* Left Column: Tactical Briefing Dossier */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#005baa]">
                    <Swords className="size-3.5 text-[#005baa]" />
                    <span>Tactical Quest Brief</span>
                  </div>

                  <h1 className="mt-3 text-2xl sm:text-3xl font-black text-[#063b66] tracking-tight">
                    {mission.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 text-[#063b66]">
                      <Clock size={14} className="text-[#005baa]" /> {mission.duration}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Tanpa Jawaban Salah
                    </span>
                    <span>•</span>
                    <span className="text-[#005baa] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      +250 EXP Bounty
                    </span>
                  </div>

                  {/* Narasi Briefing Misi */}
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 leading-relaxed text-slate-700 text-sm whitespace-pre-line">
                      {mission.intro}
                    </div>

                    {/* Highlight Box: Yang akan kamu rasakan */}
                    <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-5">
                      <p className="flex items-center gap-2 text-sm font-bold text-[#005baa]">
                        <Lightbulb size={17} className="text-[#005baa]" />
                        <span>Yang akan kamu rasakan di misi ini</span>
                      </p>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {mission.steps[0]?.narration ?? mission.summary}
                      </p>
                    </div>
                  </div>

                  {/* Clean Solid Gaming CTA Button */}
                  <button
                    onClick={() => setPhase("step")}
                    className="group mt-7 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#005baa] hover:bg-[#004b8d] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-sm transition active:scale-[0.99]"
                  >
                    <Swords className="size-4 text-white" />
                    <span>MULAI MISI SEKARANG</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Right Column: 3D Mentor Character Stage */}
                <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                  <div className="relative w-44 h-56 flex items-center justify-center">
                    <img
                      src={heroImg}
                      alt={mentorTitle}
                      className="relative z-10 w-full h-full object-contain object-bottom filter drop-shadow-[0_8px_14px_rgba(0,91,170,0.2)]"
                    />
                    <div className="absolute bottom-1 w-32 h-4 rounded-full bg-slate-900/10 blur-xs" />
                  </div>

                  <div className="mt-4 w-full">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-800">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>SENIOR MENTOR ONLINE</span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-[#063b66]">{mentorTitle}</h3>
                    <p className="text-xs text-slate-500">{mission.program} Core Division</p>

                    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs leading-relaxed text-[#063b66]">
                      <p className="font-bold text-[11px] text-[#005baa] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="size-3 text-[#005baa]" />
                        Petunjuk Mentor:
                      </p>
                      <p className="text-slate-600">
                        {mission.program === "PPTI"
                          ? "“Selamat datang di simulasi teknologi BCA! Di sini setiap keputusan teknis berdampak pada sistem perbankan. Pilih opsi yang paling tepat menurutmu!”"
                          : "“Selamat datang di simulasi bisnis perbankan BCA! Analisis setiap peluang dan kelola risiko dengan cermat untuk hasil terbaik!”"}
                      </p>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                2. STEP / DILEMA KEPUTUSAN (2-COLUMN DENGAN MENTOR PENDAMPING)
                ══════════════════════════════════════════════════════════════ */}
            {phase === "step" && step && !choice && (
              <motion.div
                key={`s${stepIdx}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start"
              >
                {/* Left Column: Decision Dilemma */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  {/* Dilemma Prompt Box (Solid Navy) */}
                  <div className="rounded-xl bg-[#063b66] p-5 text-white shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                      DILEMA KEPUTUSAN · TAHAP {stepIdx + 1}
                    </span>
                    <h2 className="mt-1.5 text-lg sm:text-xl font-bold leading-snug">
                      {step.prompt}
                    </h2>
                  </div>

                  {/* Choice Cards (Solid White with Clean Borders) */}
                  <div className="mt-6 space-y-3">
                    {step.choices.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => pick(c.id)}
                        className="group flex w-full items-start gap-3.5 rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-[#005baa] hover:bg-slate-50 active:scale-[0.99]"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 font-bold text-xs text-[#063b66] group-hover:bg-[#005baa] group-hover:text-white transition">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-[#063b66] group-hover:text-[#005baa] transition">
                            {c.label}
                          </p>
                          {c.detail && (
                            <p className="mt-1 text-xs text-slate-500 leading-relaxed font-normal">
                              {c.detail}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column: Dynamic Mentor Companion Guide */}
                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center text-center">
                  <div className="relative w-36 h-48 flex items-center justify-center">
                    <img
                      src={heroImg}
                      alt={mentorTitle}
                      className="relative z-10 w-full h-full object-contain object-bottom filter drop-shadow-[0_6px_10px_rgba(0,91,170,0.18)]"
                    />
                  </div>

                  <div className="mt-3 w-full">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-0.5 text-[11px] font-bold text-[#005baa]">
                      <span>STAGE {stepIdx + 1}/{mission.steps.length} GUIDE</span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-[#063b66]">{mentorTitle}</h3>

                    {/* Speech Box from Mentor for Current Step */}
                    <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-left text-xs leading-relaxed text-[#063b66]">
                      <p className="font-bold text-[11px] text-[#005baa] uppercase tracking-wider mb-1">
                        Catatan Situasi:
                      </p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {step.narration}
                      </p>
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200/80">
                        <p className="text-[11px] font-semibold text-[#005baa]">
                          💡 Tips: {currentTip}
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                3. CONSEQUENCE / HASIL KEPUTUSAN (2-COLUMN DENGAN MENTOR)
                ══════════════════════════════════════════════════════════════ */}
            {phase === "step" && step && choice && (
              <motion.div
                key={`c${stepIdx}-${choice.id}`}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start"
              >
                {/* Left Column: Consequence Debrief */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#005baa]">
                    <Zap className="size-3.5 text-[#005baa]" />
                    <span>Dampak & Konsekuensi Keputusan</span>
                  </div>

                  <div className="rounded-xl border-l-4 border-[#005baa] bg-slate-50 p-5 sm:p-6">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium">
                      {choice.consequence}
                    </p>
                  </div>

                  {/* Acquired Skills Experience */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Skill Experience Acquired:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {choice.skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-[#005baa]"
                        >
                          <Sparkles className="size-3 text-[#005baa]" />
                          <span>+ {s}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={next}
                    className="mt-6 group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#005baa] hover:bg-[#004b8d] px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-sm transition active:scale-[0.99]"
                  >
                    <span>
                      {stepIdx + 1 < mission.steps.length ? "Lanjut ke Tahap Berikutnya" : "Selesaikan Quest Misi"}
                    </span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Right Column: Mentor Debrief Reaction */}
                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center text-center">
                  <div className="relative w-36 h-48 flex items-center justify-center">
                    <img
                      src={heroImg}
                      alt={mentorTitle}
                      className="relative z-10 w-full h-full object-contain object-bottom filter drop-shadow-[0_6px_10px_rgba(0,91,170,0.18)]"
                    />
                  </div>

                  <div className="mt-3 w-full">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold text-emerald-800">
                      <span>EVALUASI MENTOR</span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-[#063b66]">{mentorTitle}</h3>

                    <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-left text-xs leading-relaxed text-slate-700">
                      <p className="font-bold text-[11px] text-[#005baa] uppercase tracking-wider mb-1">
                        Refleksi Pilihanmu:
                      </p>
                      <p>
                        Pilihanmu menunjukkan kecenderungan analisis praktis. Di dunia perbankan BCA, setiap skenario membentuk cara berpikir terstrukturmu.
                      </p>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                4. DONE / VICTORY SCREEN (CLEAN SOLID STYLING)
                ══════════════════════════════════════════════════════════════ */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-sm"
              >
                <div className="mx-auto flex items-center justify-center gap-4 mb-5">
                  <div className="w-24 h-32 relative">
                    <img
                      src={heroImg}
                      alt="Mentor"
                      className="w-full h-full object-contain object-bottom filter drop-shadow-[0_6px_10px_rgba(0,91,170,0.2)]"
                    />
                  </div>
                  <div className="grid size-16 place-items-center rounded-2xl bg-[#005baa] text-white shadow-sm">
                    <Trophy className="size-8 text-amber-300" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>Quest Selesai · +250 EXP Terkumpul</span>
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#063b66]">
                  Misi Berhasil Diselesaikan!
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Keputusanmu telah dicatat dalam log petualangan. Ambil 30 detik untuk mengisi refleksi singkat dan membuka <strong>Future Card</strong> eksklusifmu!
                </p>

                <button
                  onClick={() => setPhase("reflect")}
                  className="mt-6 group inline-flex items-center gap-2 rounded-xl bg-[#005baa] hover:bg-[#004b8d] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition"
                >
                  <span>Lanjut ke Refleksi & Kartu Karakter</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                5. REFLECTION FORM (CLEAN SOLID CHIPS)
                ══════════════════════════════════════════════════════════════ */}
            {phase === "reflect" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <ReflectionForm key="reflect" mission={mission} onSubmit={submitReflection} />
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                6. FUTURE CARD HASIL
                ══════════════════════════════════════════════════════════════ */}
            {phase === "card" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <FutureCard key="card" mission={mission} progress={progress} />
              </div>
            )}
          </AnimatePresence>
        )}

        {!reopened && phase === "card" && (
          <div className="mt-5 text-center">
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <RotateCcw size={14} />
              <span>Ulangi Misi Ini</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reflection Form (Clean Solid Chips, No Gradients) ────────────────
function ReflectionForm({
  mission,
  onSubmit,
}: {
  mission: Mission;
  onSubmit: (r: { enjoyed: string[]; challenged: string[]; nextTry: string; note?: string }) => void;
}) {
  const [enjoyed, setEnjoyed] = useState<string[]>([]);
  const [challenged, setChallenged] = useState<string[]>([]);
  const [nextTry, setNextTry] = useState("");
  const [note, setNote] = useState("");
  const hints = mission.reflectionHints;

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <motion.form
      key="rf"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ enjoyed, challenged, nextTry, note: note || undefined });
      }}
      className="space-y-7"
    >
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#005baa]">
          REFLEKSI PETUALANGAN
        </span>
        <h2 className="mt-1 text-2xl font-black text-[#063b66]">
          Apa yang kamu temukan dari simulasi ini?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Tidak ada penilaian benar atau salah. Ini dirancang untuk memetakan minat dan kecenderungan peranmu.
        </p>
      </div>

      {[
        { q: "Bagian mana yang paling kamu nikmati?", opts: hints.enjoy, val: enjoyed, set: (v: string[]) => setEnjoyed(v) },
        { q: "Apa yang terasa menantang?", opts: hints.challenge, val: challenged, set: (v: string[]) => setChallenged(v) },
      ].map((blk) => (
        <fieldset key={blk.q}>
          <legend className="font-bold text-sm text-[#063b66] mb-3">{blk.q}</legend>
          <div className="flex flex-wrap gap-2">
            {blk.opts.map((o) => (
              <button
                type="button"
                key={o}
                onClick={() => toggle(blk.val, blk.set, o)}
                aria-pressed={blk.val.includes(o)}
                className={`min-h-10 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  blk.val.includes(o)
                    ? "bg-[#005baa] text-white border-[#005baa] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#005baa]"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <div>
        <label htmlFor="nextTry" className="block font-bold text-sm text-[#063b66] mb-2">
          Apa yang ingin kamu coba berikutnya?
        </label>
        <input
          id="nextTry"
          value={nextTry}
          onChange={(e) => setNextTry(e.target.value)}
          required
          maxLength={200}
          placeholder="misal: eksplorasi security, cerita awardee PPTI, kurikulum data…"
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#005baa]"
        />
      </div>

      <div>
        <label htmlFor="note" className="block font-bold text-sm text-[#063b66] mb-2">
          Catatan singkat untuk dirimu (opsional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Satu kalimat pengalamanmu…"
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#005baa] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={enjoyed.length === 0 && challenged.length === 0}
        className="w-full px-6 py-3.5 rounded-xl bg-[#005baa] hover:bg-[#004b8d] text-white font-bold text-sm uppercase tracking-wider shadow-sm disabled:opacity-40 transition"
      >
        <span>BUAT FUTURE CARD SEKARANG</span>
        <Sparkles size={15} className="inline ml-2" />
      </button>
    </motion.form>
  );
}
