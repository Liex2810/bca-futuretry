"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Lightbulb, Sparkles } from "lucide-react";
import type { Mission } from "@/types";
import { Events } from "@/lib/analytics";
import { useJourney } from "./JourneyProvider";
import { checkpoints } from "@/lib/content/map";
import { FutureCard } from "./FutureCard";

type Phase = "intro" | "step" | "done" | "reflect" | "card";

function sessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ft.session");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("ft.session", id); }
  return id;
}

export function MissionPlayer({ mission }: { mission: Mission }) {
  const { progress, finishMission, saveReflect, stateOf } = useJourney();
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [picks, setPicks] = useState<{ stepId: string; choiceId: string }[]>([]);
  const [lastChoice, setLastChoice] = useState<string | null>(null);

  const cpId = checkpoints.find((c) => c.missionId === mission.id)?.id;
  const locked = cpId ? stateOf(cpId) === "locked" : false;
  const step = mission.steps[stepIdx];
  const choice = lastChoice ? step?.choices.find((c) => c.id === lastChoice) : null;

  const pick = (choiceId: string) => { setLastChoice(choiceId); setPicks((p) => [...p, { stepId: step.id, choiceId }]); };
  const next = () => {
    setLastChoice(null);
    if (stepIdx + 1 < mission.steps.length) setStepIdx(stepIdx + 1);
    else { finishMission(mission.id); Events.missionComplete(mission.id, mission.program ?? mission.id); setPhase("done"); }
  };

  const submitReflection = async (r: { enjoyed: string[]; challenged: string[]; nextTry: string; note?: string }) => {
    saveReflect({ missionId: mission.id, ...r });
    Events.reflectionSave(mission.id);
    setPhase("card");
    try {
      await fetch("/api/mission/complete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: mission.id, choices: picks, reflection: r, sessionId: sessionId() }),
      });
    } catch { /* offline/demo: localStorage sudah menyimpan */ }
  };

  if (locked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-mono text-xs tracking-widest text-pink mb-3">CHECKPOINT LOCKED</p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-navy">Misi ini belum terbuka</h1>
        <p className="text-navy/60 mt-2 text-sm">Selesaikan misi sebelumnya di distrik ini untuk membuka jalur berikutnya.</p>
        <Link href="/world" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-bcablue text-white font-bold">
          <ArrowLeft size={16} /> Kembali ke Peta
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/world" className="inline-flex items-center gap-1.5 text-sm text-navy/60 hover:text-bcablue transition">
          <ArrowLeft size={15} /> Peta
        </Link>
        <span className={`font-mono text-[11px] px-2.5 py-1 rounded-full border ${mission.program === "PPTI" ? "text-cyan border-cyan/30 bg-cyan/5" : "text-bcablue border-bcablue/30 bg-bcablue/5"}`}>
          {mission.program} · {mission.role}
        </span>
      </div>

      {/* progress dots */}
      {phase !== "intro" && phase !== "card" && (
        <div className="flex items-center gap-2 mb-6" aria-label={`Langkah ${stepIdx + 1} dari ${mission.steps.length}`}>
          {mission.steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i < stepIdx ? "bg-cyan" : i === stepIdx ? "bg-bcablue" : "bg-navy/10"}`} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <p className="font-mono text-xs tracking-widest text-cyan mb-2">MISSION BRIEF</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-navy">{mission.title}</h1>
            <p className="inline-flex items-center gap-1.5 text-xs text-navy/55 mt-2"><Clock size={13} /> {mission.duration} · tanpa jawaban benar/salah</p>
            <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-6 space-y-4">
              <p className="text-navy/80 leading-relaxed whitespace-pre-line">{mission.intro}</p>
              <div className="rounded-xl bg-sky-soft border border-cyan/15 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-bcablue"><Lightbulb size={15} className="text-cyan" /> Yang akan kamu rasakan</p>
                <p className="text-sm text-navy/70 mt-1.5 leading-relaxed">
                  {mission.steps[0]?.narration ?? mission.summary}
                </p>
              </div>
            </div>
            <button onClick={() => setPhase("step")} className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-bcablue text-white font-bold shadow-lg shadow-cyan/25 hover:-translate-y-0.5 transition">
              MULAI MISI <ArrowRight size={17} />
            </button>
          </motion.div>
        )}

        {/* ── STEP ── */}
        {phase === "step" && step && !choice && (
          <motion.div key={`s${stepIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <p className="font-mono text-xs text-navy/45 mb-2">LANGKAH {stepIdx + 1}/{mission.steps.length}</p>
            <p className="text-sm text-navy/60 leading-relaxed mb-3 border-l-2 border-cyan/40 pl-3">{step.narration}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-navy leading-snug">{step.prompt}</h2>
            <div className="mt-5 space-y-3">
              {step.choices.map((c) => (
                <button key={c.id} onClick={() => pick(c.id)}
                  className="w-full text-left rounded-2xl border border-navy/10 bg-white p-4 hover:border-cyan hover:shadow-md hover:shadow-cyan/10 transition group">
                  <p className="font-semibold text-navy group-hover:text-bcablue transition">{c.label}</p>
                  {c.detail && <p className="text-xs text-navy/50 mt-1">{c.detail}</p>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CONSEQUENCE ── */}
        {phase === "step" && step && choice && (
          <motion.div key={`c${stepIdx}-${choice.id}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <p className="font-mono text-xs text-cyan mb-2">YANG TERJADI…</p>
            <div className="rounded-2xl border-l-4 border-cyan bg-white p-6 shadow-sm">
              <p className="text-navy/85 leading-relaxed">{choice.consequence}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {choice.skills.map((s) => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-bcablue/8 text-bcablue font-medium border border-bcablue/15">{s}</span>
              ))}
            </div>
            <button onClick={next} className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-navy text-white font-bold hover:bg-bcablue transition">
              {stepIdx + 1 < mission.steps.length ? "LANJUT" : "SELESAIKAN MISI"} <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* ── DONE → lanjut ke refleksi ── */}
        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="mx-auto grid place-items-center w-20 h-20 rounded-3xl bg-bcablue text-white shadow-xl shadow-cyan/30">
              <Check size={36} strokeWidth={3} />
            </motion.div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-navy mt-6">Misi selesai!</h2>
            <p className="text-navy/60 mt-2 text-sm">Checkpoint berikutnya di peta mungkin sudah terbuka. Tapi sebelum lanjut — 30 detik buat dirimu sendiri:</p>
            <button onClick={() => setPhase("reflect")} className="mt-6 px-8 py-3.5 rounded-2xl bg-bcablue text-white font-bold shadow-lg shadow-cyan/25">
              ISI REFLEKSI <ArrowRight size={16} className="inline ml-1" />
            </button>
          </motion.div>
        )}

        {/* ── REFLECT ── */}
        {phase === "reflect" && (
          <ReflectionForm key="reflect" mission={mission} onSubmit={submitReflection} />
        )}

        {/* ── FUTURE CARD ── */}
        {phase === "card" && (
          <FutureCard key="card" mission={mission} progress={progress} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Reflection: chips + satu field pendek. Bukan survei. ─────────
function ReflectionForm({ mission, onSubmit }: { mission: Mission; onSubmit: (r: { enjoyed: string[]; challenged: string[]; nextTry: string; note?: string }) => void }) {
  const [enjoyed, setEnjoyed] = useState<string[]>([]);
  const [challenged, setChallenged] = useState<string[]>([]);
  const [nextTry, setNextTry] = useState("");
  const [note, setNote] = useState("");
  const hints = mission.reflectionHints;

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <motion.form key="rf" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => { e.preventDefault(); onSubmit({ enjoyed, challenged, nextTry, note: note || undefined }); }}
      className="space-y-7">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-navy">What did you discover?</h2>
        <p className="text-sm text-navy/55 mt-1">Tidak ada skor. Ini cuma buat kamu sendiri.</p>
      </div>
      {[
        { q: "Bagian mana yang kamu nikmati?", opts: hints.enjoy, val: enjoyed, set: (v: string[]) => setEnjoyed(v) },
        { q: "Apa yang terasa menantang?", opts: hints.challenge, val: challenged, set: (v: string[]) => setChallenged(v) },
      ].map((blk) => (
        <fieldset key={blk.q}>
          <legend className="font-bold text-navy text-sm mb-3">{blk.q}</legend>
          <div className="flex flex-wrap gap-2">
            {blk.opts.map((o) => (
              <button type="button" key={o} onClick={() => toggle(blk.val, blk.set, o)} aria-pressed={blk.val.includes(o)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                  blk.val.includes(o) ? "bg-bcablue text-white border-bcablue" : "bg-white text-navy/70 border-navy/15 hover:border-cyan"
                }`}>
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <div>
        <label htmlFor="nextTry" className="block font-bold text-navy text-sm mb-3">Apa yang ingin kamu coba berikutnya?</label>
        <input id="nextTry" value={nextTry} onChange={(e) => setNextTry(e.target.value)} required maxLength={200}
          placeholder="misal: misi cybersecurity, cerita awardee PPTI…"
          className="w-full px-4 py-3 rounded-xl bg-white border border-navy/15 text-sm focus:outline-none focus:border-cyan" />
      </div>
      <div>
        <label htmlFor="note" className="block font-bold text-navy text-sm mb-3">Catatan singkat (opsional)</label>
        <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3}
          placeholder="Satu kalimat pun cukup…"
          className="w-full px-4 py-3 rounded-xl bg-white border border-navy/15 text-sm focus:outline-none focus:border-cyan resize-none" />
      </div>
      <button type="submit" disabled={enjoyed.length === 0 && challenged.length === 0}
        className="w-full px-6 py-4 rounded-2xl bg-bcablue text-white font-bold shadow-lg shadow-cyan/25 disabled:opacity-40 hover:-translate-y-0.5 transition">
        BUAT FUTURE CARD <Sparkles size={16} className="inline ml-1" />
      </button>
    </motion.form>
  );
}
