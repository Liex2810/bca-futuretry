"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Filter, Sun, UserRound, Camera } from "lucide-react";
import type { Story } from "@/types";

type Prog = "ALL" | "PPBP" | "PPTI";

export function StoriesExplorer({ stories }: { stories: Story[] }) {
  const [prog, setProg] = useState<Prog>("ALL");
  const [role, setRole] = useState<string>("ALL");
  const [open, setOpen] = useState<string | null>(null);
  const roles = ["ALL", ...Array.from(new Set(stories.map((s) => s.role)))];
  const visible = stories.filter(
    (s) => (prog === "ALL" || s.program === prog) && (role === "ALL" || s.role === role)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="font-mono text-xs tracking-[0.25em] text-cyan mb-2">REAL STORIES</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-navy">Meet someone who&apos;s already there.</h1>
      <p className="text-navy/60 mt-3 max-w-xl text-sm leading-relaxed">
        Cerita dari mereka yang menjalani program — ekspektasi, realita, bagian tersulit, dan favorit.
        <span className="text-navy/45"> (Untuk demo: cerita di bawah adalah ilustrasi, bukan awardee sungguhan.)</span>
      </p>

      {/* filter */}
      <div className="flex flex-wrap items-center gap-2 mt-8" role="group" aria-label="Filter program">
        <Filter size={15} className="text-navy/40" />
        {(["ALL", "PPBP", "PPTI"] as Prog[]).map((p) => (
          <button key={p} onClick={() => setProg(p)} aria-pressed={prog === p}
            className={`min-h-11 px-4 py-1.5 rounded-full text-sm font-bold transition ${prog === p ? "bg-navy text-white" : "bg-navy/5 text-navy/60 hover:bg-navy/10"}`}>
            {p === "ALL" ? "Semua" : p}
          </button>
        ))}
        <div className="flex basis-full items-center gap-2 mt-3 flex-wrap" role="group" aria-label="Filter peran">
          <UserRound size={15} className="text-navy/40" />
          {roles.map((r) => (
            <button key={r} onClick={() => setRole(r)} aria-pressed={role === r}
              className={`min-h-11 px-3 py-1 rounded-full text-xs font-semibold transition ${role === r ? "bg-cyan/90 text-navy" : "bg-navy/5 text-navy/55 hover:bg-navy/10"}`}>
              {r === "ALL" ? "Semua peran" : r}
            </button>
          ))}
        </div>
        <span aria-live="polite" className="text-xs text-navy/40 font-mono">{visible.length} cerita</span>
      </div>

      {/* list */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((s) => {
            const isOpen = open === s.id;
            return (
              <motion.article layout key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`rounded-2xl border bg-white overflow-hidden transition ${isOpen ? "md:col-span-2 border-cyan shadow-lg shadow-cyan/10" : "border-navy/10 hover:border-cyan/50"}`}>
                <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full text-left p-5" aria-expanded={isOpen}>
                  <div className="flex items-center gap-3">
                    <span className={`grid place-items-center w-11 h-11 rounded-2xl text-white font-extrabold ${s.program === "PPTI" ? "bg-bcablue" : "bg-navy"}`}>
                      {s.name[0]}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-navy">{s.title}</p>
                      <p className="text-xs text-navy/50">{s.name} · {s.role} · <span className={s.program === "PPTI" ? "text-cyan" : "text-bcablue"}>{s.program}</span></p>
                    </div>
                  </div>
                  <p className="text-sm text-navy/65 mt-3 leading-relaxed line-clamp-2">{s.excerpt}</p>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-5 border-t border-navy/8 pt-4">
                        {/* placeholder foto/video (brief §8.5) */}
                        <div className="rounded-xl border border-dashed border-navy/20 bg-sky-soft/40 p-6 text-center">
                          <Camera size={22} className="mx-auto text-navy/35" />
                          <p className="text-xs text-navy/50 mt-2">Foto / video “{s.name}” — slot aset, menunggu materi asli + izin publikasi.</p>
                        </div>
                        <section>
                          <p className="font-mono text-[11px] tracking-widest text-navy/45 mb-2 flex items-center gap-1.5"><Sun size={13} className="text-pink" /> EXPEKTASI vs REALITA</p>
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl bg-sky-soft/60 p-3.5"><p className="text-navy/50 text-xs mb-1">Kira-kira…</p><p className="text-navy/80">{s.expectationVsReality.expectation}</p></div>
                            <div className="rounded-xl bg-cyan/8 p-3.5 border border-cyan/20"><p className="text-navy/50 text-xs mb-1">Ternyata…</p><p className="text-navy/80">{s.expectationVsReality.reality}</p></div>
                          </div>
                        </section>
                        <section>
                          <p className="font-mono text-[11px] tracking-widest text-navy/45 mb-2 flex items-center gap-1.5"><Clock size={13} className="text-cyan" /> DAY IN THE LIFE</p>
                          <ol className="relative border-l-2 border-navy/10 ml-1.5 space-y-2.5">
                            {s.dayInLife.map((d) => (
                              <li key={d.time} className="pl-4 text-sm">
                                <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-cyan border-2 border-white" />
                                <span className="font-mono text-xs text-bcablue font-bold mr-2">{d.time}</span>
                                <span className="text-navy/75">{d.activity}</span>
                              </li>
                            ))}
                          </ol>
                        </section>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl border border-navy/10 p-3.5"><p className="text-navy/50 text-xs mb-1">Tersulit</p><p className="text-navy/80">{s.hardestPart}</p></div>
                          <div className="rounded-xl border border-navy/10 p-3.5"><p className="text-navy/50 text-xs mb-1">Favorit</p><p className="text-navy/80">{s.favoriteMoment}</p></div>
                        </div>
                        <p className="text-xs text-navy/45 flex items-center gap-1.5"><UserRound size={12} /> Bisa lihat dirimu di sini? Coba misinya di Future World, atau tanya langsung lewat FuturePath → Connect.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
