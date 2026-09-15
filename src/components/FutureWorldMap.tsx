"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Play, RotateCcw, Sparkles, X, Clock, ArrowRight, ScrollText } from "lucide-react";
import { checkpoints, mapPaths, districtMeta } from "@/lib/content/map";
import { missionById } from "@/lib/content/missions";
import { characters } from "@/lib/content/characters";
import { useJourney } from "@/components/JourneyProvider";
import { progressSummary, journeyLog } from "@/lib/progress";
import type { Checkpoint } from "@/types";

const W = 1000, H = 640;
const px = (cp: Checkpoint) => ({ cx: (cp.x / 100) * W, cy: (cp.y / 100) * H });

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

      {/* ═══════════ FUTURE DISTRICT ═══════════ */}
      <section className="overflow-hidden border border-navy/15 bg-white" aria-labelledby="district-map-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 bg-[#f4f8fb] px-4 py-3 sm:px-5">
          <div>
            <h2 id="district-map-title" className="font-bold text-navy">Peta perjalanan FutureTry</h2>
            <p className="text-xs text-navy/55">Simulasi digital — bukan lokasi fisik BCA.</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-navy/65" aria-label="Legenda status">
            <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-cyan" />Bisa dimulai</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-green-600" />Selesai</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-slate-400" />Terkunci</span>
          </div>
        </div>

        {/* Desktop: dua jalur program paralel dengan urutan bawah-ke-atas yang jelas. */}
        <div className="relative hidden md:block bg-[#edf6fa]">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Dua jalur eksplorasi: PPTI di kiri dan PPBP di kanan">
            <defs>
              <pattern id="districtGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0b426c" strokeOpacity=".055" /></pattern>
              <linearGradient id="activeRoute" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#0d70b4"/><stop offset="100%" stopColor="#08bbd4"/></linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#districtGrid)" />
            <rect x="90" y="80" width="365" height="420" rx="20" fill="#ffffff" fillOpacity=".7" stroke="#08bbd4" strokeOpacity=".25" />
            <rect x="545" y="80" width="365" height="420" rx="20" fill="#ffffff" fillOpacity=".7" stroke="#0d70b4" strokeOpacity=".25" />
            <text x="272" y="114" textAnchor="middle" fill="#0b426c" fontSize="18" fontWeight="800">PPTI · TECHNOLOGY</text>
            <text x="728" y="114" textAnchor="middle" fill="#0b426c" fontSize="18" fontWeight="800">PPBP · BUSINESS</text>
            <text x="272" y="137" textAnchor="middle" fill="#527086" fontSize="12">3 checkpoint karier digital</text>
            <text x="728" y="137" textAnchor="middle" fill="#527086" fontSize="12">3 checkpoint bisnis perbankan</text>

            {mapPaths.map(([a, b]) => {
              const A = byId(a), B = byId(b), pa = px(A), pb = px(B);
              const active = A.kind === "hub" || B.kind === "hub" || (stateOf(a) !== "locked" && stateOf(b) !== "locked");
              return <line key={`${a}-${b}`} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} stroke={active ? "url(#activeRoute)" : "#7890a2"} strokeOpacity={active ? .85 : .35} strokeWidth={active ? 4 : 2} strokeDasharray={active ? "0" : "7 9"} strokeLinecap="round" />;
            })}

            {checkpoints.map((cp) => {
              const { cx, cy } = px(cp), st = stateOf(cp.id), meta = districtMeta[cp.district];
              const color = st === "locked" ? "#94a3b8" : st === "completed" ? "#16854b" : meta.color;
              return <g key={cp.id} transform={`translate(${cx},${cy})`} className={st === "locked" ? "" : "cursor-pointer"}
                onClick={() => st !== "locked" && setSelected(cp)} role="button" tabIndex={st === "locked" ? -1 : 0}
                aria-label={`${cp.label}, ${st === "completed" ? "selesai" : st === "locked" ? "terkunci" : "bisa dimulai"}`} aria-disabled={st === "locked"}
                onKeyDown={(e: React.KeyboardEvent) => { if ((e.key === "Enter" || e.key === " ") && st !== "locked") { e.preventDefault(); setSelected(cp); } }}>
                <circle r="31" fill="transparent" />
                {st === "available" && <circle r="28" fill={color} opacity=".18" className="pulse-ring pointer-events-none" />}
                <circle r="23" fill="#fff" stroke={color} strokeWidth="4" />
                <g transform="translate(-11,-11)">{st === "locked" ? <Lock size={22} color={color}/> : st === "completed" ? <Check size={22} color={color} strokeWidth={3}/> : cp.kind === "hub" ? <Sparkles size={22} color={color}/> : <Play size={22} color={color}/>}</g>
                <rect x="-75" y="35" width="150" height="27" rx="5" fill="#fff" stroke="#dbe7ee" />
                <text y="53" textAnchor="middle" fontSize="13" fontWeight="700" fill={st === "locked" ? "#718596" : "#0b426c"}>{cp.label}</text>
              </g>;
            })}
            <rect x="445" y="612" width="110" height="22" rx="11" fill="#0b426c" />
            <text x="500" y="627" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">MULAI DI SINI</text>
          </svg>
        </div>

        {/* Mobile: perjalanan vertikal, bukan desktop map yang dikecilkan. */}
        <div className="md:hidden bg-[#edf6fa] p-4">
          <button onClick={() => setSelected(byId("cp-characters"))} className="mb-4 min-h-12 w-full border border-pink/35 bg-white px-4 py-3 text-left">
            <span className="block text-[11px] font-mono tracking-widest text-pink">START</span><span className="font-bold text-navy">Meet the Guides</span>
          </button>
          <div className="grid gap-4">
            {(["technology", "business"] as const).map((district) => {
              const meta = districtMeta[district];
              return <section key={district} className="border border-navy/10 bg-white p-3">
                <div className="mb-3"><h3 className="font-bold text-navy">{meta.program} · {meta.name}</h3><p className="text-xs text-navy/55">{meta.desc}</p></div>
                <ol className="space-y-2">
                  {checkpoints.filter(cp => cp.district === district).map((cp, index) => {
                    const st = stateOf(cp.id);
                    return <li key={cp.id} className="relative pl-7">
                      {index > 0 && <span className="absolute -top-2 bottom-8 left-[10px] w-px bg-navy/20" />}
                      <span className={`absolute left-0 top-[17px] h-5 w-5 rounded-full border-4 border-white ${st === "completed" ? "bg-green-600" : st === "locked" ? "bg-slate-400" : "bg-cyan"}`} />
                      <button disabled={st === "locked"} onClick={() => setSelected(cp)} className="min-h-14 w-full border border-navy/10 bg-[#f8fbfd] px-3 py-2 text-left disabled:opacity-65">
                        <span className="flex items-center justify-between gap-3"><span className="font-semibold text-navy">{index + 1}. {cp.label}</span><span className="shrink-0 text-xs text-navy/60">{st === "locked" ? "Terkunci" : st === "completed" ? "Selesai" : "Mulai →"}</span></span>
                      </button>
                    </li>;
                  })}
                </ol>
              </section>;
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[byId("cp-futurepath"), byId("cp-stories")].map(cp => <button key={cp.id} onClick={() => setSelected(cp)} className="min-h-14 border border-navy/10 bg-white p-3 text-left text-sm font-semibold text-navy">{cp.label}<span className="mt-1 block text-xs font-normal text-navy/55">Resource hub →</span></button>)}
          </div>
        </div>

        <div className="border-t border-navy/10 bg-white px-4 py-3">
          <p className="font-mono text-[10px] tracking-widest text-navy/45">PEMANDU KAMU</p>
          <p className="mt-1 text-xs leading-snug text-navy/70"><b>{guideChar.name}</b> ({guideChar.program}) menemani perjalananmu{lastMission ? ` — terakhir membahas “${lastMission.title}”.` : ". Mulai dari Meet the Guides, lalu pilih jalur program."}</p>
        </div>
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
