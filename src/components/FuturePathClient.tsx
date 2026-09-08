"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, MessagesSquare, Send, UserRound, XCircle } from "lucide-react";
import { eligibilityRules, faqs, programInfo } from "@/lib/content/futurepath";
import { useJourney } from "@/components/JourneyProvider";
import { missions } from "@/lib/content/missions";
import { Events } from "@/lib/analytics";

const tabs = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "ask", label: "Ask", icon: HelpCircle },
  { id: "check", label: "Check", icon: CheckCircle2 },
  { id: "connect", label: "Connect", icon: UserRound },
  { id: "act", label: "Act", icon: Send },
] as const;

type Tab = (typeof tabs)[number]["id"];

export function FuturePathClient() {
  const [tab, setTab] = useState<Tab>("learn");
  useEffect(() => { Events.futurepathOpen(); }, []);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="font-mono text-xs tracking-[0.25em] text-cyan mb-2">FUTUREPATH</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-navy">From curious to confident.</h1>
      <p className="text-navy/60 mt-3 max-w-xl text-sm">Lima langkah: pelajari, tanyakan, cek syarat, bicara dengan manusia, lalu ambil aksi.</p>

      <div className="flex flex-wrap gap-2 mt-8 border-b border-navy/10 pb-4" role="tablist" aria-label="FuturePath sections">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${tab === t.id ? "bg-navy text-white shadow-md" : "bg-navy/5 text-navy/60 hover:bg-navy/10"}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        {tab === "learn" && <Learn />}
        {tab === "ask" && <Ask />}
        {tab === "check" && <Check />}
        {tab === "connect" && <Connect />}
        {tab === "act" && <Act />}
      </motion.div>
    </div>
  );
}

// ── LEARN ────────────────────────────────────────────────────────
function Learn() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {(Object.entries(programInfo) as [string, typeof programInfo.PPBP][]).map(([prog, info]) => (
        <div key={prog} className="rounded-2xl border border-navy/10 bg-white p-6">
          <p className={`font-mono text-xs tracking-widest ${prog === "PPTI" ? "text-cyan" : "text-bcablue"}`}>{prog}</p>
          <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-navy mt-1">{info.tag}</h3>
          <p className="text-sm text-navy/65 mt-2 leading-relaxed">{info.blurb}</p>
          <ul className="mt-4 space-y-3">
            {info.learn.map((l) => (
              <li key={l.title} className="text-sm">
                <p className="font-bold text-navy">{l.title}</p>
                <p className="text-navy/65 mt-0.5 leading-relaxed">{l.body}</p>
                <p className="text-[10px] text-navy/35 font-mono mt-1">sumber: {l.source}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ── ASK ──────────────────────────────────────────────────────────
function Ask() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <div key={f.id} className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
          <button onClick={() => setOpen(open === f.id ? null : f.id)} aria-expanded={open === f.id}
            className="w-full flex items-center justify-between gap-3 p-4 text-left">
            <span className="font-semibold text-navy text-sm">{f.question}</span>
            <span className={`text-navy/40 transition-transform ${open === f.id ? "rotate-45" : ""}`}>+</span>
          </button>
          {open === f.id && (
            <div className="px-4 pb-4 text-sm text-navy/70 leading-relaxed">
              {f.answer}
              <p className="text-[10px] text-navy/35 font-mono mt-2">sumber: {f.source}</p>
            </div>
          )}
        </div>
      ))}
      <p className="text-xs text-navy/50 flex items-center gap-1.5 pt-2">
        <MessagesSquare size={13} className="text-cyan" /> Pertanyaan lain? Klik tombol <strong>Ask FutureTry</strong> di pojok kanan bawah — dia menjawab dari knowledge base yang sama.
      </p>
    </div>
  );
}

// ── CHECK (deterministic, BUKAN prediksi diterima) ───────────────
function Check() {
  const [prog, setProg] = useState<"PPBP" | "PPTI">("PPTI");
  const rules = eligibilityRules.filter((r) => r.program === prog);
  return (
    <div>
      <div className="flex gap-2 mb-5">
        {(["PPTI", "PPBP"] as const).map((p) => (
          <button key={p} onClick={() => setProg(p)} aria-pressed={prog === p}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${prog === p ? "bg-bcablue text-white" : "bg-navy/5 text-navy/60 hover:bg-navy/10"}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-navy/10 bg-white p-6 space-y-4">
        <p className="text-sm text-navy/60">Persyaratan di bawah adalah <strong>contoh struktur</strong> untuk demo. Sebelum produksi, setiap baris WAJIB dicocokkan dengan pengumuman resmi BCA dan diberi tautan sumber.</p>
        {rules.map((r) => (
          <div key={r.id} className="flex gap-3 items-start border-t border-navy/8 pt-4 first:border-0 first:pt-0">
            <CheckCircle2 size={18} className="text-cyan shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-navy text-sm">{r.requirement}</p>
              <p className="text-xs text-navy/60 mt-1">{r.explanation}</p>
              <p className="text-[10px] text-navy/35 font-mono mt-1">sumber: {r.source}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-navy/45 flex items-center gap-1.5">
        <XCircle size={13} className="text-pink" /> FutureTry tidak memprediksi peluang diterima. Yang dihitung di sini hanya kecocokan dengan syarat resmi — dan itu pun harus kamu verifikasi ulang di kanal resmi.
      </p>
    </div>
  );
}

// ── CONNECT ──────────────────────────────────────────────────────
function Connect() {
  const [sent, setSent] = useState(false);
  const [to, setTo] = useState("Awardee");
  const [q, setQ] = useState("");
  if (sent) {
    return (
      <div className="rounded-2xl border border-cyan/30 bg-sky-soft p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-cyan" />
        <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-navy mt-3">Terkirim (demo)</h3>
        <p className="text-sm text-navy/60 mt-2 max-w-sm mx-auto">Di versi produksi, pesan ini diteruskan ke pool awardee/counselor. Untuk sekarang, anggap ini proof-of-concept — pertanyaanmu tidak ke mana-mana. 😄</p>
        <button onClick={() => setSent(false)} className="mt-4 text-sm font-bold text-bcablue hover:underline">Kirim pertanyaan lain</button>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-2xl border border-navy/10 bg-white p-6 max-w-lg">
      <p className="font-[family-name:var(--font-display)] text-lg font-extrabold text-navy">Some questions are better answered by someone who&apos;s been there.</p>
      <div className="mt-5">
        <label className="block text-sm font-bold text-navy mb-2" htmlFor="who">Mau bicara dengan siapa?</label>
        <select id="who" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-navy/15 text-sm focus:outline-none focus:border-cyan">
          <option>Awardee</option><option>Guru BK / Counselor</option><option>Recruiter</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-bold text-navy mb-2" htmlFor="q">Pertanyaanmu</label>
        <textarea id="q" required value={q} onChange={(e) => setQ(e.target.value)} rows={4} maxLength={800}
          placeholder="misal: apa yang paling bikin kaget di bulan pertama PPTI?"
          className="w-full px-4 py-3 rounded-xl bg-white border border-navy/15 text-sm focus:outline-none focus:border-cyan resize-none" />
      </div>
      <button type="submit" className="mt-5 w-full px-6 py-3.5 rounded-full bg-neon text-navy font-bold shadow-lg shadow-neon/25 hover:-translate-y-0.5 transition">
        KIRIM PERTANYAAN
      </button>
    </form>
  );
}

// ── ACT ──────────────────────────────────────────────────────────
function Act() {
  const { progress } = useJourney();
  const done = progress.completedMissions.length;
  const total = missions.length;
  return (
    <div className="space-y-3 max-w-lg">
      <Link href="/world" className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-5 hover:border-cyan transition group">
        <div><p className="font-bold text-navy">Explore more</p><p className="text-xs text-navy/55 mt-0.5">{done}/{total} misi selesai — sisa {total - done} menunggumu.</p></div>
        <ArrowRight size={18} className="text-navy/40 group-hover:text-cyan transition" />
      </Link>
      <Link href="/stories" className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-5 hover:border-cyan transition group">
        <div><p className="font-bold text-navy">Talk to an awardee</p><p className="text-xs text-navy/55 mt-0.5">Dengar langsung dari yang menjalani.</p></div>
        <ArrowRight size={18} className="text-navy/40 group-hover:text-cyan transition" />
      </Link>
      <div className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-5">
        <div><p className="font-bold text-navy">Save my journey</p><p className="text-xs text-navy/55 mt-0.5">Progresmu otomatis tersimpan di perangkat ini — tanpa akun.</p></div>
        <CheckCircle2 size={18} className="text-green-500" />
      </div>
      <a href="https://www.bca.co.id" target="_blank" rel="noopener noreferrer" onClick={() => Events.applyClick("bca.co.id")} className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-navy to-bcablue p-5 text-white hover:shadow-lg hover:shadow-bcablue/25 transition group">
        <div><p className="font-bold">Apply officially →</p><p className="text-xs text-white/70 mt-0.5">Pendaftaran resmi hanya melalui kanal BCA.</p></div>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
      </a>
    </div>
  );
}
