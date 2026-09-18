"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { Clock, Filter, Sparkles, Sun, UserRound } from "lucide-react";
import type { Story } from "@/types";

type Prog = "ALL" | "PPBP" | "PPTI";

export function StoriesExplorer({ stories }: { stories: Story[] }) {
  const [prog, setProg] = useState<Prog>("ALL");
  const [role, setRole] = useState<string>("ALL");
  const [open, setOpen] = useState<string | null>(null);
  const roles = ["ALL", ...Array.from(new Set(stories.filter((story) => prog === "ALL" || story.program === prog).map((story) => story.role)))];
  const visible = stories.filter(
    (s) => (prog === "ALL" || s.program === prog) && (role === "ALL" || s.role === role)
  );

  return (
    <div className="pb-10">
      <section className="relative isolate -mt-[68px] pt-[68px] min-h-[428px] overflow-hidden sm:min-h-[478px]">
        <Image
          src="/stories-bg.png"
          alt="Cerita Awardee"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center opacity-90 saturate-100"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(244,247,251,0.96) 0%, rgba(244,247,251,0.88) 30%, rgba(244,247,251,0.52) 54%, rgba(244,247,251,0.08) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-b from-transparent to-[#f4f7fb]" />

        <div className="mx-auto flex min-h-[360px] max-w-5xl items-center px-4 pb-14 pt-12 sm:min-h-[410px] sm:pb-16">
          <div className="max-w-2xl">
            <p className="mb-2 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] text-[#0066ae]">CERITA PARA AWARDEE</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[#005cab] drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:text-[42px]">Beragam perjalanan, satu langkah menuju masa depan.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#063b66]/85 sm:text-base">
              Dengarkan pengalaman para awardee PPBP dan PPTI saat belajar, beradaptasi, dan menemukan bidang yang paling sesuai dengan mereka.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 mt-8">
        <Filter size={15} className="text-[#0066ae]/60" />
        {(["ALL", "PPBP", "PPTI"] as Prog[]).map((p) => (
          <button key={p} onClick={() => { setProg(p); setRole("ALL"); }} aria-pressed={prog === p}
            className={`min-h-11 rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${prog === p ? "border-[#0066ae] bg-[#0066ae] text-white" : "border-slate-200 bg-white text-[#063b66]/70 hover:border-[#0066ae] hover:text-[#0066ae]"}`}>
            {p === "ALL" ? "Semua" : p}
          </button>
        ))}
        <div className="flex basis-full items-center gap-2 mt-3 flex-wrap" role="group" aria-label="Filter divisi">
          <UserRound size={15} className="text-[#0066ae]/60" />
          {roles.map((r) => (
            <button key={r} onClick={() => setRole(r)} aria-pressed={role === r}
              className={`min-h-11 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${role === r ? "border-[#0066ae] bg-[#f0f7fd] text-[#0066ae]" : "border-slate-200 bg-white text-[#063b66]/65 hover:border-[#0066ae] hover:text-[#0066ae]"}`}>
              {r === "ALL" ? "Semua Divisi" : r}
            </button>
          ))}
        </div>
        <span aria-live="polite" className="text-xs font-medium text-[#063b66]/50">{visible.length} cerita</span>
      </div>

      {/* list */}
      {visible.length === 0 && <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" role="status">
        <h2 className="font-[family-name:var(--font-display)] font-semibold text-[#063b66]">Belum ada cerita untuk kombinasi filter ini</h2>
        <p className="mt-2 text-sm text-slate-500">Coba program atau divisi lain untuk menemukan cerita.</p>
        <button onClick={() => { setProg("ALL"); setRole("ALL"); }} className="mt-4 min-h-11 min-w-11 rounded-full bg-[#0066ae] px-5 font-bold text-white hover:bg-[#063b66]">Reset filter</button>
      </section>}
      <div className="mt-6 grid grid-cols-1 gap-4">
        {visible.map((s) => {
          const isOpen = open === s.id;
          return (
            <motion.article key={s.id} layout="position"
              transition={{ layout: { duration: 0.34, ease: [0.25, 1, 0.5, 1] } }}
              className={`overflow-hidden rounded-2xl border bg-white transition ${isOpen ? "border-[#0066ae] shadow-lg shadow-[#0066ae]/10" : "border-slate-200 hover:border-[#0066ae]/50 hover:shadow-md"}`}>
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full text-left" aria-expanded={isOpen}>
                {isOpen ? (
                  <div>
                    <div className="relative h-40 overflow-hidden bg-[#0066ae] sm:h-48">
                      <Image src={s.coverImage} alt={`Cover profil ${s.name}`} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover object-center" />
                      <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#063b66]/20" />
                    </div>
                    <div className="px-5 pb-6 sm:px-7">
                      <div className="relative z-10 -mt-14 flex items-end justify-between gap-4">
                        <Image src={s.profileImage} alt={`Foto profil ${s.name}`} width={160} height={160} className="relative z-10 h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-lg sm:h-32 sm:w-32" />
                        <span className="mb-2 rounded-full border border-[#0066ae]/20 bg-[#f0f7fd] px-3 py-1.5 text-xs font-bold text-[#0066ae]">{s.program}</span>
                      </div>
                      <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#063b66]">{s.name}</h2>
                      <p className="mt-1 text-sm font-semibold text-[#063b66]/85">{s.role} | Awardee {s.program}</p>
                      <p className="mt-1 text-xs text-slate-500">Indonesia</p>
                      <span className="mt-4 inline-flex text-xs font-bold text-[#0066ae]">Tutup profil ↑</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <Image src={s.profileImage} alt={`Foto profil ${s.name}`} width={96} height={96} className="h-20 w-20 shrink-0 rounded-full border-2 border-white object-cover shadow-md" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#063b66]">{s.name}</p>
                          <span className="rounded-full bg-[#f0f7fd] px-2 py-0.5 text-[10px] font-bold text-[#0066ae]">{s.program}</span>
                        </div>
                        <p className="text-xs font-semibold text-[#063b66]/75">{s.role}</p>
                        <p className="mt-1 text-xs text-slate-400">Awardee</p>
                      </div>
                    </div>
                    <p className="mt-4 font-[family-name:var(--font-display)] font-semibold text-[#063b66]">{s.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{s.excerpt}</p>
                    <span className="mt-4 inline-flex text-xs font-bold text-[#0066ae]">Lihat profil &amp; cerita →</span>
                  </div>
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                <motion.div key="details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.26, ease: [0.25, 1, 0.5, 1] }} className="overflow-hidden">
                  <div className="space-y-5 border-t border-slate-100 px-5 pb-5 pt-4">
                    <section>
                      <p className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold text-[#0066ae]">Tentang perjalanan</p>
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#063b66]">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.excerpt}</p>
                    </section>
                    <section>
                      <p className="mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)] text-[11px] font-bold tracking-widest text-[#0066ae]"><Sun size={13} className="text-[#ff75b8]" /> EKSPEKTASI vs REALITA</p>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-[#f0f7fd] p-3.5"><p className="mb-1 text-xs text-slate-500">Kira-kira…</p><p className="text-[#063b66]/85">{s.expectationVsReality.expectation}</p></div>
                        <div className="rounded-xl border border-[#00c8eb]/25 bg-[#00c8eb]/5 p-3.5"><p className="mb-1 text-xs text-slate-500">Ternyata…</p><p className="text-[#063b66]/85">{s.expectationVsReality.reality}</p></div>
                      </div>
                    </section>
                    <section>
                      <p className="mb-2 flex items-center gap-1.5 font-[family-name:var(--font-display)] text-[11px] font-bold tracking-widest text-[#0066ae]"><Clock size={13} className="text-[#00c8eb]" /> DAY IN THE LIFE</p>
                      <ol className="relative ml-1.5 space-y-2.5 border-l-2 border-[#0066ae]/15">
                        {s.dayInLife.map((d) => (
                          <li key={d.time} className="pl-4 text-sm">
                            <span className="absolute -left-[7px] h-3 w-3 rounded-full border-2 border-white bg-[#00c8eb]" />
                            <span className="mr-2 text-xs font-bold text-[#0066ae]">{d.time}</span>
                            <span className="text-[#063b66]/75">{d.activity}</span>
                          </li>
                        ))}
                      </ol>
                    </section>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-slate-200 p-3.5"><p className="mb-1 text-xs text-slate-500">Tersulit</p><p className="text-[#063b66]/85">{s.hardestPart}</p></div>
                      <div className="rounded-xl border border-slate-200 p-3.5"><p className="mb-1 text-xs text-slate-500">Favorit</p><p className="text-[#063b66]/85">{s.favoriteMoment}</p></div>
                      <div className="rounded-xl border border-[#0066ae]/15 bg-[#f0f7fd] p-3.5 sm:col-span-2">
                        <p className="mb-3 flex items-center gap-1.5 font-[family-name:var(--font-display)] text-xs font-bold text-[#0066ae]"><Sparkles size={13} /> Tools &amp; Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {s.tools.map((tool) => (
                            <span key={tool} className="rounded-full border border-[#0066ae]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#063b66] shadow-sm">{tool}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500"><UserRound size={12} className="text-[#0066ae]" /> Bisa lihat dirimu di sini? Coba misinya di Future World, atau tanya langsung lewat FuturePath → Connect.</p>
                  </div>
                </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
