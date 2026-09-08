"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Play, RotateCcw, Sparkles, X, Clock, ArrowRight } from "lucide-react";
import { checkpoints, mapPaths, districtMeta } from "@/lib/content/map";
import { missionById } from "@/lib/content/missions";
import { useJourney } from "@/components/JourneyProvider";
import { progressSummary } from "@/lib/progress";
import type { Checkpoint } from "@/types";

const W = 1000, H = 640;
const px = (cp: Checkpoint) => ({ cx: (cp.x / 100) * W, cy: (cp.y / 100) * H });

export function FutureWorldMap() {
  const { progress, stateOf, reset } = useJourney();
  const [selected, setSelected] = useState<Checkpoint | null>(null);
  const { done, total, percent } = progressSummary(progress);

  const byId = (id: string) => checkpoints.find((c) => c.id === id)!;

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
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-navy/15 text-navy/70 hover:border-pink hover:text-pink transition" title="Reset progress">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div className="h-2 rounded-full bg-navy/10 mb-6 overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-bcadark to-neon" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6 }} />
      </div>

      {/* ═══════════ MAP ═══════════ */}
      <div className="relative rounded-3xl overflow-hidden border border-navy/10 shadow-xl shadow-navy/10 bg-gradient-to-b from-sky-soft to-white">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Peta Future World dengan lima distrik">
          <defs>
            <radialGradient id="glowTech" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#08bbd4" stopOpacity="0.25" /><stop offset="100%" stopColor="#08bbd4" stopOpacity="0" /></radialGradient>
            <radialGradient id="glowBiz" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0d70b4" stopOpacity="0.25" /><stop offset="100%" stopColor="#0d70b4" stopOpacity="0" /></radialGradient>
            <linearGradient id="pathDone" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0d70b4" /><stop offset="100%" stopColor="#08bbd4" /></linearGradient>
          </defs>

          {/* district blobs */}
          <ellipse cx={280} cy={150} rx={250} ry={140} fill="url(#glowTech)" />
          <ellipse cx={720} cy={150} rx={250} ry={140} fill="url(#glowBiz)" />
          <ellipse cx={500} cy={540} rx={200} ry={110} fill="url(#glowTech)" opacity={0.5} />
          <ellipse cx={840} cy={400} rx={150} ry={110} fill="url(#glowBiz)" opacity={0.4} />
          <ellipse cx={160} cy={400} rx={150} ry={110} fill="url(#glowTech)" opacity={0.4} />

          {/* district labels */}
          <text x={280} y={40} textAnchor="middle" className="fill-[#0b426c]" fontSize={17} fontWeight={800} fontFamily="var(--font-display)">TECHNOLOGY &amp; DIGITAL</text>
          <text x={280} y={58} textAnchor="middle" className="fill-[#08bbd4]" fontSize={12} fontFamily="var(--font-mono)">PPTI</text>
          <text x={720} y={40} textAnchor="middle" className="fill-[#0b426c]" fontSize={17} fontWeight={800} fontFamily="var(--font-display)">BUSINESS &amp; BANKING</text>
          <text x={720} y={58} textAnchor="middle" className="fill-[#0d70b4]" fontSize={12} fontFamily="var(--font-mono)">PPBP</text>
          <text x={500} y={600} textAnchor="middle" className="fill-[#f467b0]" fontSize={13} fontWeight={700} fontFamily="var(--font-display)">CHARACTER PLAZA</text>
          <text x={840} y={470} textAnchor="middle" className="fill-[#0d70b4]" fontSize={13} fontWeight={700} fontFamily="var(--font-display)">STORY QUARTER</text>
          <text x={160} y={470} textAnchor="middle" className="fill-[#08bbd4]" fontSize={13} fontWeight={700} fontFamily="var(--font-display)">FUTUREPATH GATE</text>

          {/* paths */}
          {mapPaths.map(([a, b]) => {
            const A = byId(a), B = byId(b);
            const pa = px(A), pb = px(B);
            const active = A.kind === "hub" || B.kind === "hub" || (stateOf(a) !== "locked" && stateOf(b) !== "locked");
            return <line key={`${a}-${b}`} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy}
              stroke={active ? "url(#pathDone)" : "#0b426c"} strokeOpacity={active ? 0.7 : 0.15}
              strokeWidth={active ? 3 : 2} strokeDasharray={active ? "0" : "6 8"} strokeLinecap="round" />;
          })}

          {/* checkpoints */}
          {checkpoints.map((cp) => {
            const { cx, cy } = px(cp);
            const st = stateOf(cp.id);
            const meta = districtMeta[cp.district];
            const color = st === "locked" ? "#94a3b8" : meta.color;
            return (
              <g key={cp.id} transform={`translate(${cx},${cy})`} className="cursor-pointer"
                onClick={() => st !== "locked" && setSelected(cp)}
                role="button" tabIndex={st === "locked" ? -1 : 0}
                aria-label={`${cp.label} — ${st}`}
                onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" && st !== "locked") setSelected(cp); }}>
                {st === "available" && <circle r={26} fill={color} opacity={0.35} className="pulse-ring" />}
                <circle r={22} fill={st === "locked" ? "#e2e8f0" : "#fff"} stroke={color} strokeWidth={3.5} />
                {st === "completed" && <circle r={22} fill={color} opacity={0.15} />}
                <g transform="translate(-11,-11)">
                  {st === "locked" ? <Lock size={22} color="#94a3b8" />
                    : st === "completed" ? <Check size={22} color={color} strokeWidth={3} />
                    : cp.kind === "hub" ? <Sparkles size={22} color={color} />
                    : <Play size={22} color={color} />}
                </g>
                <text y={44} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="var(--font-display)"
                  fill={st === "locked" ? "#94a3b8" : "#0b426c"}>{cp.label}</text>
              </g>
            );
          })}
        </svg>

        {/* legend */}
        <div className="absolute top-3 left-3 glass rounded-xl px-3 py-2 text-[11px] space-y-1 shadow-sm pointer-events-none select-none">
          <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan inline-block" /> Available</p>
          <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-bcablue inline-block" /> Completed</p>
          <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Locked</p>
        </div>
      </div>

      {/* ═══════════ CHECKPOINT POPOVER ═══════════ */}
      <AnimatePresence>
        {selected && (() => {
          const mission = selected.missionId ? missionById(selected.missionId) : null;
          const meta = districtMeta[selected.district];
          const st = stateOf(selected.id);
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 grid place-items-center p-4 bg-navy/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
              <motion.div initial={{ y: 20, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${meta.color}, #0b426c)` }} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] tracking-widest" style={{ color: meta.color }}>{meta.name.toUpperCase()}{meta.program ? ` · ${meta.program}` : ""}</p>
                      <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-navy mt-1">{mission?.title ?? selected.label}</h3>
                    </div>
                    <button onClick={() => setSelected(null)} aria-label="Tutup" className="p-1.5 rounded-lg hover:bg-navy/5 text-navy/50"><X size={18} /></button>
                  </div>

                  {mission ? (
                    <>
                      <p className="text-sm text-navy/70 mt-3 leading-relaxed">{mission.summary}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-navy/60">
                        <span className="inline-flex items-center gap-1"><Clock size={13} /> {mission.duration}</span>
                        <span className="inline-flex items-center gap-1"><Sparkles size={13} /> Role: {mission.role}</span>
                      </div>
                      <Link href={`/mission/${mission.id}`}
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neon text-navy font-bold shadow-lg shadow-neon/25 hover:-translate-y-0.5 transition">
                        ENTER MISSION <ArrowRight size={17} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-navy/70 mt-3 leading-relaxed">{meta.desc}</p>
                      <Link href={selected.district === "story" ? "/stories" : selected.district === "futurepath" ? "/futurepath" : "/world#characters"}
                        onClick={() => setSelected(null)}
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neon text-navy font-bold shadow-lg shadow-neon/25 hover:-translate-y-0.5 transition">
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
