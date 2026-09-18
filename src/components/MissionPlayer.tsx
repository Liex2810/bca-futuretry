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
  const mentorTitle = mission.program === "PPTI" ? "PPTI Senior Mentor" : "PPBP Strategic Mentor";

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
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-lg text-sm font-bold text-[#063b66]">
          <Sparkles className="size-4 text-[#00a9d6] animate-spin" />
          <span>Menyiapkan ruang misi petualangan…</span>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-slate-200 text-slate-500 shadow-md mb-4">
          <Shield className="size-10 text-slate-400" />
        </div>
        <p className="font-black text-xs uppercase tracking-widest text-[#0066ae] mb-2">CHECKPOINT LOCKED</p>
        <h1 className="text-2xl font-black text-[#063b66]">Misi ini belum terbuka</h1>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          Selesaikan checkpoint sebelumnya pada jalur <strong>{mission.program}</strong> untuk membuka quest ini.
        </p>
        <Link
          href="/world"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 rounded-2xl bg-[#0066ae] text-white font-extrabold shadow-lg shadow-sky-500/20 hover:bg-[#063b66] transition"
        >
          <ArrowLeft size={16} /> Kembali ke Peta Petualangan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-[#eaf2f8] via-[#f4f7fa] to-[#e4eef6] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Status Penyimpanan */}
        <p role="status" className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          {storageError
            ? "Penyimpanan browser tidak tersedia. Progres sesi ini bisa hilang saat refresh."
            : "Draft otomatis tersimpan di browser ini. Refresh untuk melanjutkan tidak menghapus pilihanmu."}
        </p>

        {reopened && (
          <section className="rounded-3xl border-2 border-white bg-white/90 p-5 sm:p-6 mb-6 shadow-xl shadow-sky-900/5 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 mb-1">
              <Check className="size-4 stroke-[3]" />
              <span>Quest Selesai Sebelumnya</span>
            </div>
            <h2 className="font-black text-xl text-[#063b66]">Misi ini sudah kamu selesaikan!</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Kamu bisa melihat hasil kartu refleksi sebelumnya atau mencoba kembali untuk bereksplorasi dengan pilihan berbeda.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                className="min-h-11 px-5 rounded-xl bg-[#0066ae] text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:bg-[#063b66] transition"
                onClick={() => {
                  setPhase("card");
                  setReopened(false);
                }}
              >
                Lihat Kartu Refleksi
              </button>
              <button
                className="min-h-11 px-5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition"
                onClick={replay}
              >
                Ulangi Misi
              </button>
              {phase !== "card" && phase !== "intro" && (
                <button
                  className="min-h-11 px-5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-700 hover:bg-slate-50 transition"
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
            className="inline-flex items-center gap-2 rounded-2xl border border-white bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#063b66] shadow-sm backdrop-blur hover:bg-white hover:text-[#0066ae] transition"
          >
            <Compass className="size-4 text-[#00a9d6]" />
            <span>← Kembali ke Peta</span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                mission.program === "PPTI"
                  ? "bg-cyan-100 text-cyan-900 border border-cyan-200"
                  : "bg-blue-100 text-blue-900 border border-blue-200"
              }`}
            >
              Jalur {mission.program} · {mission.role}
            </span>
          </div>
        </div>

        {/* Progress Tracker (Saat masuk ke tahap step) */}
        {phase !== "intro" && phase !== "card" && (
          <div className="mb-6 rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-[#063b66] mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500 fill-amber-400" />
                Tahap {stepIdx + 1} dari {mission.steps.length}
              </span>
              <span className="text-[#0066ae]">
                {Math.round(((stepIdx + 1) / mission.steps.length) * 100)}% Selesai
              </span>
            </div>
            <div className="flex items-center gap-2" aria-label={`Langkah ${stepIdx + 1} dari ${mission.steps.length}`}>
              {mission.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i < stepIdx
                      ? "bg-emerald-500 shadow-sm"
                      : i === stepIdx
                      ? "bg-gradient-to-r from-[#0066ae] to-[#00a9d6] shadow-sm shadow-sky-500/30"
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
                1. INTRO / MISSION BRIEFING (GAME HUD STYLE)
                ══════════════════════════════════════════════════════════════ */}
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] items-start"
              >
                {/* Left Column: Tactical Briefing Dossier */}
                <div className="rounded-3xl border-2 border-white bg-white/95 p-6 sm:p-8 shadow-xl shadow-sky-900/10 backdrop-blur">
                  <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0066ae]">
                    <Swords className="size-3.5 text-[#00a9d6]" />
                    <span>Tactical Quest Brief</span>
                  </div>

                  <h1 className="mt-3 text-2xl sm:text-3xl font-black text-[#063b66] tracking-tight">
                    {mission.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-extrabold text-slate-500">
                    <span className="flex items-center gap-1.5 text-[#063b66]">
                      <Clock size={14} className="text-[#00a9d6]" /> {mission.duration}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ⚡ Tanpa Jawaban Salah
                    </span>
                    <span>•</span>
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      🏆 +250 EXP Bounty
                    </span>
                  </div>

                  {/* Narasi Briefing Misi */}
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-[#f8fbfe] p-5 leading-relaxed text-slate-700 text-sm whitespace-pre-line">
                      {mission.intro}
                    </div>

                    {/* Highlight Box: Yang akan kamu rasakan */}
                    <div className="rounded-2xl border-2 border-[#00a9d6]/30 bg-gradient-to-br from-cyan-50/70 via-white to-sky-50/70 p-5 shadow-sm">
                      <p className="flex items-center gap-2 text-sm font-black text-[#0066ae]">
                        <Lightbulb size={18} className="text-[#00a9d6]" />
                        <span>Yang akan kamu rasakan di misi ini</span>
                      </p>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {mission.steps[0]?.narration ?? mission.summary}
                      </p>
                    </div>
                  </div>

                  {/* Epic Gaming CTA Button */}
                  <button
                    onClick={() => setPhase("step")}
                    className="group relative mt-7 w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0066ae] via-[#008caf] to-[#00c2ff] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-sky-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-sky-500/50 hover:brightness-110 active:scale-[0.98]"
                  >
                    <Swords className="size-5 text-cyan-200 transition-transform group-hover:rotate-12" />
                    <span>MULAI PETUALANGAN MISI</span>
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" />
                  </button>
                </div>

                {/* Right Column: 3D Mentor Character Stage */}
                <aside className="rounded-3xl border-2 border-white bg-gradient-to-b from-white/95 via-[#f0f7fc] to-white/90 p-6 shadow-xl shadow-sky-900/10 backdrop-blur flex flex-col items-center text-center">
                  <div className="relative w-48 h-60 flex items-center justify-center">
                    {/* Glowing Aura Ring */}
                    <div className="absolute inset-4 rounded-full bg-cyan-400/25 blur-2xl animate-pulse" />

                    {/* 3D Character Avatar */}
                    <img
                      src={heroImg}
                      alt={mentorTitle}
                      className="relative z-10 w-full h-full object-contain object-bottom filter drop-shadow-[0_12px_20px_rgba(0,102,174,0.38)] animate-bounce"
                      style={{ animationDuration: "3.2s" }}
                    />

                    {/* Floor Shadow */}
                    <div className="absolute bottom-1 w-36 h-5 rounded-full bg-slate-900/20 blur-sm" />
                  </div>

                  <div className="mt-4 w-full">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-[11px] font-black text-emerald-800">
                      <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>SENIOR MENTOR ONLINE</span>
                    </div>

                    <h3 className="mt-2 text-base font-black text-[#063b66]">{mentorTitle}</h3>
                    <p className="text-xs font-semibold text-slate-500">{mission.program} Core Division</p>

                    <div className="mt-4 rounded-2xl bg-white border border-sky-100 p-4 text-left text-xs leading-relaxed text-[#063b66] shadow-sm">
                      <p className="font-extrabold text-[11px] text-[#0066ae] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="size-3 text-[#00a9d6]" />
                        Petunjuk Mentor:
                      </p>
                      <p className="text-slate-600">
                        {mission.program === "PPTI"
                          ? "“Selamat datang di simulasi teknologi BCA! Di sini setiap keputusan arsitektur & codingmu akan menentukan kehandalan sistem. Pilih opsi yang paling sesuai prinsipmu!”"
                          : "“Selamat datang di simulasi bisnis & perbankan BCA! Analisis setiap peluang dan kelola risiko dengan cermat untuk memberikan solusi terbaik!”"}
                      </p>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                2. STEP / DILEMA KEPUTUSAN
                ══════════════════════════════════════════════════════════════ */}
            {phase === "step" && step && !choice && (
              <motion.div
                key={`s${stepIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-3xl border-2 border-white bg-white/95 p-6 sm:p-8 shadow-xl shadow-sky-900/10 backdrop-blur"
              >
                {/* NPC Speech Box */}
                <div className="mb-5 flex items-start gap-3.5 rounded-2xl border border-sky-100 bg-[#f8fbfe] p-4 shadow-sm">
                  <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-cyan-400 bg-white shadow-sm">
                    <img src={heroImg} alt="Mentor" className="h-full w-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-[#0066ae]">
                      [MENTOR PANDUAN · {mission.program}]
                    </p>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                      {step.narration}
                    </p>
                  </div>
                </div>

                {/* Dilemma Prompt Box */}
                <div className="rounded-2xl border-2 border-white bg-gradient-to-br from-[#063b66] to-[#005baa] p-5 sm:p-6 text-white shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200">
                    DILEMA KEPUTUSAN · TAHAP {stepIdx + 1}
                  </span>
                  <h2 className="mt-1.5 text-lg sm:text-2xl font-black leading-snug">
                    {step.prompt}
                  </h2>
                </div>

                {/* Choice Cards */}
                <div className="mt-6 space-y-3">
                  {step.choices.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => pick(c.id)}
                      className="group relative flex w-full items-start gap-3.5 rounded-2xl border-2 border-slate-200/80 bg-white p-4 sm:p-5 text-left shadow-sm transition-all duration-200 hover:border-[#00a9d6] hover:bg-sky-50/70 hover:shadow-md hover:shadow-sky-500/15 hover:scale-[1.01]"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 font-black text-xs text-[#063b66] group-hover:bg-[#0066ae] group-hover:text-white transition-colors shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-sm sm:text-base text-[#063b66] group-hover:text-[#0066ae] transition-colors">
                          {c.label}
                        </p>
                        {c.detail && (
                          <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
                            {c.detail}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                3. CONSEQUENCE / HASIL KEPUTUSAN
                ══════════════════════════════════════════════════════════════ */}
            {phase === "step" && step && choice && (
              <motion.div
                key={`c${stepIdx}-${choice.id}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border-2 border-white bg-white/95 p-6 sm:p-8 shadow-xl shadow-sky-900/10 backdrop-blur space-y-5"
              >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 border border-cyan-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-900">
                  <Zap className="size-3.5 text-amber-500 fill-amber-400" />
                  <span>Dampak & Konsekuensi Keputusan</span>
                </div>

                <div className="rounded-2xl border-l-4 border-[#00a9d6] bg-[#f8fbfe] p-5 sm:p-6 shadow-sm">
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium">
                    {choice.consequence}
                  </p>
                </div>

                {/* Acquired Skills Experience */}
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Skill Experience Acquired:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {choice.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-[#0066ae] shadow-sm"
                      >
                        <Sparkles className="size-3 text-[#00a9d6]" />
                        <span>+ {s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={next}
                  className="mt-6 group w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#063b66] to-[#0066ae] px-6 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-lg shadow-sky-900/20 transition-all hover:scale-[1.02] hover:bg-[#063b66]"
                >
                  <span>
                    {stepIdx + 1 < mission.steps.length ? "Lanjut ke Tahap Berikutnya" : "Selesaikan Quest Misi"}
                  </span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                4. DONE / VICTORY SCREEN
                ══════════════════════════════════════════════════════════════ */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border-2 border-white bg-white/95 p-8 sm:p-10 text-center shadow-2xl shadow-sky-900/10 backdrop-blur"
              >
                <div className="mx-auto grid size-24 place-items-center rounded-3xl bg-gradient-to-tr from-[#0066ae] to-[#00c2ff] text-white shadow-xl shadow-sky-500/30">
                  <Trophy className="size-12 animate-bounce text-amber-300" style={{ animationDuration: "2s" }} />
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-800">
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Quest Cleared · +250 EXP Gained!</span>
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#063b66]">
                  Misi Berhasil Diselesaikan!
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Keputusanmu telah tersimpan dalam log petualangan. Ambil 30 detik untuk mengisi refleksi singkat dan membuka <strong>Future Card</strong> eksklusifmu!
                </p>

                <button
                  onClick={() => setPhase("reflect")}
                  className="mt-6 group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0066ae] to-[#00a9d6] px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
                >
                  <span>Lanjut ke Refleksi & Kartu Karakter</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                5. REFLECTION FORM
                ══════════════════════════════════════════════════════════════ */}
            {phase === "reflect" && (
              <div className="rounded-3xl border-2 border-white bg-white/95 p-6 sm:p-8 shadow-xl shadow-sky-900/10 backdrop-blur">
                <ReflectionForm key="reflect" mission={mission} onSubmit={submitReflection} />
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                6. FUTURE CARD HASIL
                ══════════════════════════════════════════════════════════════ */}
            {phase === "card" && (
              <div className="rounded-3xl border-2 border-white bg-white/95 p-6 sm:p-8 shadow-xl shadow-sky-900/10 backdrop-blur">
                <FutureCard key="card" mission={mission} progress={progress} />
              </div>
            )}
          </AnimatePresence>
        )}

        {!reopened && phase === "card" && (
          <div className="mt-5 text-center">
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 bg-white text-xs font-black uppercase tracking-wider text-slate-700 shadow-sm hover:bg-slate-50 transition"
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

// ── Reflection Form ──────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ enjoyed, challenged, nextTry, note: note || undefined });
      }}
      className="space-y-7"
    >
      <div>
        <span className="text-[11px] font-black uppercase tracking-wider text-[#0066ae]">
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
          <legend className="font-extrabold text-sm text-[#063b66] mb-3">{blk.q}</legend>
          <div className="flex flex-wrap gap-2">
            {blk.opts.map((o) => (
              <button
                type="button"
                key={o}
                onClick={() => toggle(blk.val, blk.set, o)}
                aria-pressed={blk.val.includes(o)}
                className={`min-h-11 px-4 py-2 rounded-full text-xs font-bold border-2 transition ${
                  blk.val.includes(o)
                    ? "bg-[#0066ae] text-white border-[#0066ae] shadow-md shadow-sky-500/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#00a9d6]"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <div>
        <label htmlFor="nextTry" className="block font-extrabold text-sm text-[#063b66] mb-2">
          Apa yang ingin kamu coba berikutnya?
        </label>
        <input
          id="nextTry"
          value={nextTry}
          onChange={(e) => setNextTry(e.target.value)}
          required
          maxLength={200}
          placeholder="misal: eksplorasi security, cerita awardee PPTI, kurikulum data…"
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#00a9d6]"
        />
      </div>

      <div>
        <label htmlFor="note" className="block font-extrabold text-sm text-[#063b66] mb-2">
          Catatan singkat untuk dirimu (opsional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Satu kalimat pengalamanmu…"
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#00a9d6] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={enjoyed.length === 0 && challenged.length === 0}
        className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0066ae] to-[#00a9d6] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 disabled:opacity-40 hover:scale-[1.01] transition"
      >
        <span>BUAT FUTURE CARD SEKARANG</span>
        <Sparkles size={16} className="inline ml-2" />
      </button>
    </motion.form>
  );
}
