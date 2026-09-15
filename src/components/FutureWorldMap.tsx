"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Play, RotateCcw, Sparkles, X, Clock, ArrowRight, ScrollText } from "lucide-react";
import { checkpoints, districtMeta } from "@/lib/content/map";
import { missionById } from "@/lib/content/missions";
import { characters } from "@/lib/content/characters";
import { useJourney } from "@/components/JourneyProvider";
import { FutureDistrictMap } from "@/components/FutureDistrictMap";
import { progressSummary, journeyLog } from "@/lib/progress";
import type { Checkpoint } from "@/types";

export function FutureWorldMap() {
  const { progress, stateOf, reset } = useJourney();
  const [selected, setSelected] = useState<Checkpoint | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected) return;
    const trigger = document.activeElement as HTMLElement | SVGElement | null;
    const dialog = dialogRef.current;
    const controls = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]') ?? []);
    controls()[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setSelected(null); }
      if (e.key === "Tab") {
        const items = controls(), first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; trigger?.focus(); };
  }, [selected]);
  const { done, total, percent } = progressSummary(progress);

  const byId = (id: string) => checkpoints.find((c) => c.id === id)!;

  // ── Journey Log + pemandu aktif (brief §8.2) ──
  const log = journeyLog(progress);
  const lastMission = log[0]?.mission;
  const guideChar =
    (lastMission ? characters.find((c) => c.program === lastMission.program) : null) ?? characters[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-cyan mb-1">FUTURE WORLD</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-navy">Explore the map</h1>
          <p className="text-navy/60 mt-1 text-sm">Klik checkpoint untuk melihat misi. Selesaikan misi untuk membuka jalur berikutnya.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-navy/50 font-mono">PROGRESS</p>
            <p className="font-bold text-navy">{done}/{total} misi · {percent}%</p>
          </div>
          <button onClick={() => { if (confirm("Reset seluruh perjalananmu? Misi yang selesai akan terkunci lagi.")) reset(); }}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border border-navy/15 text-navy/70 hover:border-pink hover:text-pink transition min-h-[44px]" title="Reset progress">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div className="h-2 rounded-full bg-navy/10 mb-6 overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <motion.div className="h-full rounded-full bg-bcablue" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6 }} />
      </div>

      {/* ═══════════ MAPLIBRE FUTURE DISTRICT ═══════════ */}
      <section className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-xl shadow-navy/10" aria-labelledby="future-map-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 px-4 py-3 sm:px-5">
          <div><h2 id="future-map-title" className="font-bold text-navy">Future District</h2><p className="text-xs text-navy/60">Peta simulasi digital — bukan lokasi fisik BCA.</p></div>
          <div className="flex flex-wrap gap-3 text-[11px] text-navy/65" aria-label="Legenda status"><span>● Bisa dimulai</span><span>✓ Selesai</span><span>○ Terkunci</span></div>
        </div>
        <FutureDistrictMap checkpoints={checkpoints} stateOf={stateOf} onSelect={setSelected} />
        <div className="border-t border-navy/10 bg-white px-4 py-3"><p className="font-mono text-[10px] tracking-widest text-navy/45">PEMANDU KAMU</p><p className="mt-1 text-xs leading-snug text-navy/70"><b>{guideChar.name}</b> ({guideChar.program}) menemani perjalananmu{lastMission ? ` — terakhir membahas “${lastMission.title}”.` : ". Geser dan zoom peta, lalu pilih checkpoint."}</p></div>
      </section>

      {/* ═══════════ JOURNEY LOG (brief §8.2) ═══════════ */}
      <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-5">
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-navy/50">
          <ScrollText size={14} className="text-pink" /> JOURNEY LOG
        </p>
        {log.length === 0 ? (
          <p className="text-sm text-navy/55 mt-2">Belum ada misi selesai. Klik checkpoint biru di peta, selesaikan satu misi — catatannya muncul di sini.</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {log.map((e) => {
              const r = progress.reflections[e.mission.id];
              const when = e.at ? new Date(e.at) : null;
              return (
                <li key={e.mission.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <Check size={14} className="text-green-600 shrink-0" />
                  <span className="font-semibold text-navy">{e.mission.title}</span>
                  <span className={`font-mono text-[11px] ${e.mission.program === "PPTI" ? "text-cyan" : "text-bcablue"}`}>{e.mission.program} · {e.mission.role}</span>
                  {when && <span className="text-xs text-navy/45">{when.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} {when.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>}
                  {r?.enjoyed?.length ? <span className="text-xs text-navy/55">senang: {r.enjoyed.slice(0, 2).join(", ")}</span> : null}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* ═══════════ CHECKPOINT POPOVER ═══════════ */}
      <AnimatePresence>
        {selected && (() => {
          const mission = selected.missionId ? missionById(selected.missionId) : null;
          const meta = districtMeta[selected.district];
          const st = stateOf(selected.id);
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              ref={dialogRef} role="dialog" aria-modal="true" aria-label="Detail checkpoint" className="fixed inset-0 z-[60] grid place-items-center p-4 bg-navy/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
              <motion.div initial={{ y: 20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md max-h-[calc(100dvh-32px)] rounded-3xl bg-white shadow-2xl overflow-y-auto">
                <div className="h-2" style={{ background: meta.color }} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] tracking-widest" style={{ color: meta.color }}>{meta.name.toUpperCase()}{meta.program ? ` · ${meta.program}` : ""}</p>
                      <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-navy mt-1">{mission?.title ?? selected.label}</h3>
                    </div>
                    <button onClick={() => setSelected(null)} aria-label="Tutup" className="min-h-11 min-w-11 grid place-items-center shrink-0 p-1.5 rounded-lg hover:bg-navy/5 text-navy/50"><X size={18} /></button>
                  </div>

                  {mission ? (
                    <>
                      <p className="text-sm text-navy/70 mt-3 leading-relaxed">{mission.summary}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-navy/60">
                        <span className="inline-flex items-center gap-1"><Clock size={13} /> {mission.duration}</span>
                        <span className="inline-flex items-center gap-1"><Sparkles size={13} /> Role: {mission.role}</span>
                      </div>
                      <Link href={`/mission/${mission.id}`}
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-bcablue text-white font-bold shadow-lg shadow-cyan/25 hover:-translate-y-0.5 transition">
                        {st === "completed" ? "LIHAT HASIL / ULANGI MISI" : "ENTER MISSION"} <ArrowRight size={17} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-navy/70 mt-3 leading-relaxed">{meta.desc}</p>
                      <Link href={selected.district === "story" ? "/stories" : selected.district === "futurepath" ? "/futurepath" : "/world#characters"}
                        onClick={() => setSelected(null)}
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-bcablue text-white font-bold shadow-lg shadow-cyan/25 hover:-translate-y-0.5 transition">
                        BUKA {selected.label.toUpperCase()} <ArrowRight size={17} />
                      </Link>
                    </>
                  )}
                  {st === "completed" && <p className="text-center text-xs text-green-600 mt-3 inline-flex items-center justify-center gap-1 w-full"><Check size={13} /> Misi sudah selesai — boleh diulang</p>}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
