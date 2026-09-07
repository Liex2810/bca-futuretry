"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Download, MessagesSquare, Route, Sparkles } from "lucide-react";
import type { JourneyProgress, Mission } from "@/types";
import { missions } from "@/lib/content/missions";
import { districtMeta } from "@/lib/content/map";

// Saran eksplorasi berikutnya: misi lain di distrik sama (belum selesai),
// lalu cabang seberang. Deterministik, bukan "rekomendasi AI".
function nextSuggestions(mission: Mission, progress: JourneyProgress) {
  const sameDistrict = missions.filter((m) => m.district === mission.district && m.id !== mission.id && !progress.completedMissions.includes(m.id));
  const otherBranch = missions.filter((m) => m.program !== mission.program && !progress.completedMissions.includes(m.id));
  return [...sameDistrict.slice(0, 2), ...otherBranch.slice(0, 1)].map((m) => ({ id: m.id, title: m.title, program: m.program }));
}

export function FutureCard({ mission, progress }: { mission: Mission; progress: JourneyProgress }) {
  const reflection = progress.reflections[mission.id];
  const meta = districtMeta[mission.district];
  const next = nextSuggestions(mission, progress);
  const relatedArea = mission.program === "PPTI"
    ? "Technology & Digital — software, data, UI/UX, network, cyber security"
    : "Business & Banking — investasi, keuangan, akuntansi, manajemen, strategi";

  const download = () => {
    const lines = [
      "BCA FUTURETRY — FUTURE CARD", "===============================", "",
      `YOU EXPLORED   ${mission.program} — ${meta.name}`,
      `ROLE           ${mission.role}`,
      `MISSION        ${mission.title}`, "",
      "YOU ENJOYED", ...(reflection?.enjoyed.length ? reflection.enjoyed.map((e) => `• ${e}`) : ["(dilewati)"]), "",
      "YOU FOUND CHALLENGING", ...(reflection?.challenged.length ? reflection.challenged.map((e) => `• ${e}`) : ["(dilewati)"]), "",
      reflection?.nextTry ? `NEXT YOU WANT TO TRY\n${reflection.nextTry}\n` : "",
      reflection?.note ? `YOUR NOTE\n${reflection.note}\n` : "",
      "EXPLORE NEXT", ...next.map((n) => `• ${n.title} (${n.program})`), "",
      `RELATED AREA   ${relatedArea}`, "",
      "Catatan: Future Card adalah ringkasan refleksimu — bukan skor,",
      "bukan prediksi diterima. Keputusan resmi hanya lewat jalur BCA.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `future-card-${mission.id}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <p className="font-mono text-xs tracking-widest text-pink mb-2 text-center">YOUR FUTURE CARD</p>
      <div className="rounded-3xl overflow-hidden border border-navy/10 shadow-2xl shadow-navy/15 bg-white">
        <div className="p-6 text-white" style={{ background: `linear-gradient(120deg, #0b426c, ${meta.color})` }}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/70">FUTURETRY</p>
            <Sparkles size={16} className="text-white/70" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mt-4">{mission.program} — {meta.name}</h2>
          <p className="text-sm text-white/80 mt-1">Role yang kamu coba: <strong>{mission.role}</strong></p>
        </div>

        <div className="p-6 space-y-5">
          {[
            { label: "YOU ENJOYED", items: reflection?.enjoyed ?? [] },
            { label: "YOU FOUND CHALLENGING", items: reflection?.challenged ?? [] },
          ].map((blk) => (
            <div key={blk.label}>
              <p className="font-mono text-[11px] tracking-widest text-navy/45 mb-2">{blk.label}</p>
              {blk.items.length ? (
                <ul className="space-y-1">{blk.items.map((i) => <li key={i} className="text-sm text-navy/80 flex gap-2"><span className="text-cyan">•</span>{i}</li>)}</ul>
              ) : <p className="text-sm text-navy/40 italic">Dilewati — boleh diisi ulang nanti.</p>}
            </div>
          ))}
          {reflection?.nextTry && (
            <div>
              <p className="font-mono text-[11px] tracking-widest text-navy/45 mb-2">WHAT YOU WANT TO TRY NEXT</p>
              <p className="text-sm text-navy/80">“{reflection.nextTry}”</p>
            </div>
          )}
          {next.length > 0 && (
            <div>
              <p className="font-mono text-[11px] tracking-widest text-navy/45 mb-2">EXPLORE NEXT</p>
              <div className="space-y-2">
                {next.map((n) => (
                  <Link key={n.id} href={`/mission/${n.id}`} className="flex items-center justify-between rounded-xl border border-navy/10 px-4 py-2.5 hover:border-cyan hover:bg-sky-soft/50 transition">
                    <span className="text-sm font-medium text-navy">{n.title}</span>
                    <span className="text-[10px] font-mono text-cyan">{n.program}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="font-mono text-[11px] tracking-widest text-navy/45 mb-2">RELATED PPBP/PPTI AREA</p>
            <p className="text-sm text-navy/70">{relatedArea}</p>
          </div>
          <p className="text-[11px] text-navy/40 border-t border-navy/8 pt-4 leading-relaxed">
            Future Card adalah ringkasan refleksimu — bukan skor, bukan prediksi diterima. Keputusan penerimaan hanya lewat proses resmi BCA.
          </p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <Link href="/world" className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-navy/15 text-navy font-bold hover:border-cyan transition text-sm">
          <Compass size={16} /> LANJUT EKSPLORASI
        </Link>
        <Link href="/futurepath" className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-bcablue to-cyan text-white font-bold shadow-lg shadow-cyan/25 hover:-translate-y-0.5 transition text-sm">
          <Route size={16} /> FUTUREPATH <ArrowRight size={14} />
        </Link>
        <button onClick={download} className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-navy/15 text-navy font-bold hover:border-pink hover:text-pink transition text-sm">
          <Download size={16} /> SIMPAN KARTU
        </button>
      </div>
      <p className="text-center text-xs text-navy/45 mt-4 inline-flex items-center gap-1.5 w-full justify-center">
        <MessagesSquare size={13} /> Punya pertanyaan? Tanya Ask FutureTry (tombol biru di pojok) atau ajak bicara awardee lewat FuturePath → Connect.
      </p>
    </motion.div>
  );
}
