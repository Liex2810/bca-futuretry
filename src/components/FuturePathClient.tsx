"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, Send, UserRound, XCircle, Sparkles } from "lucide-react";
import { eligibilityRules, faqs } from "@/lib/content/futurepath";
import { stories } from "@/lib/content/stories";
import type { Story } from "@/types";
import { useJourney } from "@/components/JourneyProvider";
import { missions } from "@/lib/content/missions";
import { Events } from "@/lib/analytics";

interface Msg { role: "user" | "assistant"; content: string; sources?: string[]; mode?: "ai" | "mock" }

function sessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ft.session");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("ft.session", id); }
  return id;
}

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
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <section className="relative isolate -mt-[68px] pt-[68px] min-h-[428px] overflow-hidden sm:min-h-[478px]">
        <Image
          src="/futurepath-bg.png"
          alt="Lingkungan belajar FuturePath"
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
            <p className="mb-2 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] text-[#0066ae]">FUTUREPATH</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[#005cab] drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:text-[42px]">From curious to confident.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#063b66]/85 sm:text-base">Lima langkah: pelajari, tanyakan, cek syarat, bicara dengan manusia, lalu ambil aksi.</p>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4 pb-10">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-[#063b66]/8" role="tablist" aria-label="Bagian FuturePath">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${tab === t.id ? "border-[#0066ae] bg-[#0066ae] text-white shadow-md" : "border-slate-200 bg-white text-[#063b66]/70 hover:border-[#0066ae] hover:text-[#0066ae]"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 w-full max-w-none">
          {tab === "learn" && <Learn />}
          {tab === "ask" && <Ask />}
          {tab === "check" && <Check />}
          {tab === "connect" && <Connect />}
          {tab === "act" && <Act />}
        </motion.div>
      </div>
    </div>
  );
}

// ── LEARN ────────────────────────────────────────────────────────
function Learn() {
  return (
    <div className="w-full max-w-none space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#005cab]">Apa itu Beasiswa BCA?</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          Merupakan salah satu program Corporate Social Responsibility, beasiswa BCA ditujukan kepada para lulusan SMA/SMK/sederajat yang berprestasi. Beasiswa ini diberikan dalam bentuk Program Pendidikan Bisnis dan Perbankan (PPBP) dan Program Pendidikan Teknik Informatika (PPTI) yang diselenggarakan oleh BCA.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Durasi dan Tempat</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col rounded-xl border border-slate-100 bg-[#f4f7fb] p-5">
            <div className="relative aspect-video max-h-32 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/program-bca.png" alt="Program Beasiswa BCA" fill sizes="(max-width: 768px) 100vw, 200px" className="object-contain" />
            </div>
            <p className="mt-auto text-xs font-bold uppercase tracking-wider text-[#0066ae]">Program</p>
            <p className="mt-1 text-sm font-semibold text-[#063b66]">Program Berlangsung selama 2.5 Tahun</p>
          </div>
          <div className="flex flex-col rounded-xl border border-slate-100 bg-[#f4f7fb] p-5">
            <div className="relative aspect-video max-h-160 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/lokasi-bca.png" alt="Lokasi Beasiswa BCA" fill sizes="(max-width: 768px) 100vw, 200px" className="object-contain" />
            </div>
            <p className="mt-auto text-xs font-bold uppercase tracking-wider text-[#0066ae]">Lokasi</p>
            <p className="mt-1 text-sm font-semibold text-[#063b66]">Bertempat di BCA Learning Institute, Sentul</p>
          </div>
          <div className="flex flex-col rounded-xl border border-slate-100 bg-[#f4f7fb] p-5">
            <div className="relative aspect-video max-h-32 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/waktu-bca.png" alt="Waktu Belajar Beasiswa BCA" fill sizes="(max-width: 768px) 100vw, 200px" className="object-contain" />
            </div>
            <p className="mt-auto text-xs font-bold uppercase tracking-wider text-[#0066ae]">Waktu Belajar</p>
            <p className="mt-1 text-sm font-semibold text-[#063b66]">Senin - Jum&rsquo;at<br />Pukul 08.00 - 17.00 WIB</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Apa yang kamu dapat dari Beasiswa BCA?</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-100 p-5 bg-white shadow-xs">
            <div className="relative h-32 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/benefit-bayar.png" alt="Benefit Bebas Biaya" fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain" />
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0066ae]/10 text-[#0066ae] font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-sm text-[#063b66]">Bebas Biaya Pendidikan &amp; Uang Saku</p>
                <p className="mt-0.5 text-xs text-slate-600">Bebas biaya pendidikan dan mendapatkan uang saku setiap bulan.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-100 p-5 bg-white shadow-xs">
            <div className="relative h-32 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/buku-laptop.png" alt="Buku & Fasilitas Laptop" fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain" />
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0066ae]/10 text-[#0066ae] font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-sm text-[#063b66]">Buku &amp; Fasilitas Laptop</p>
                <p className="mt-0.5 text-xs text-slate-600">Disediakan buku pelajaran sepanjang program pembelajaran berlangsung dan fasilitas laptop (khusus untuk PPTI).</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-100 p-5 bg-white shadow-xs">
            <div className="relative h-32 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/magang.png" alt="Magang & Penawaran Kerja" fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain" />
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0066ae]/10 text-[#0066ae] font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-sm text-[#063b66]">Magang &amp; Penawaran Kerja</p>
                <p className="mt-0.5 text-xs text-slate-600">Mendapatkan kesempatan magang dan penawaran kerja di BCA.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-xl border border-slate-100 p-5 bg-white shadow-xs">
            <div className="relative h-32 w-full overflow-hidden flex items-center justify-center p-2">
              <Image src="/dormitory.png" alt="Dormitory & Makan Siang" fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain" />
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0066ae]/10 text-[#0066ae] font-bold text-sm">4</div>
              <div>
                <p className="font-semibold text-sm text-[#063b66]">Dormitory &amp; Makan Siang</p>
                <p className="mt-0.5 text-xs text-slate-600">Fasilitas dormitory dan makan siang selama masa pendidikan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ASK ──────────────────────────────────────────────────────────
function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = messagesRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [msgs]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setBusy(true);
    Events.chatAsk(q.length);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: msgs.slice(-6), sessionId: sessionId() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal");
      setMsgs((m) => [...m, { role: "assistant", content: data.content, sources: data.sources, mode: data.mode }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Hmm, ada gangguan sebentar. Coba lagi ya — atau langsung ke halaman FuturePath untuk info resmi.", sources: [] }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-[480px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="shrink-0 px-5 py-3 bg-[#0066ae] text-white flex items-center gap-2">
        <Sparkles size={16} />
        <div>
          <p className="font-bold text-sm leading-tight">Ask FutureTry</p>
          <p className="text-[11px] text-white/70">Bertanya soal PPBP/PPTI — tanpa prediksi, tanpa skor.</p>
        </div>
      </div>

      <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Hai! Aku bisa bantu jelaskan program, syarat, dan langkah berikutnya. Coba tanya:</p>
            <div className="flex flex-wrap gap-2">
              {faqs.slice(0, 4).map((f) => (
                <button key={f.id} onClick={() => send(f.question)}
                  className="min-h-10 rounded-full border border-[#0066ae]/20 bg-[#f0f7fd] px-4 text-xs font-semibold text-[#0066ae] hover:bg-[#0066ae] hover:text-white transition">
                  {f.question}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === "user" ? "bg-[#0066ae] text-white rounded-br-md" : "bg-slate-50 border border-slate-200 text-slate-700 rounded-bl-md"
            }`}>
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              {m.sources && m.sources.length > 0 && (
                <p className="mt-1 text-[10px] text-slate-400 font-mono">sumber: {m.sources.join(" · ")}</p>
              )}
            </div>
          </div>
        ))}
        {busy && <p className="text-xs text-slate-400 animate-pulse">Ask FutureTry sedang berpikir…</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="shrink-0 p-3 border-t border-slate-100 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Pertanyaan untuk Ask FutureTry" placeholder="Tulis pertanyaan…" maxLength={500}
          className="min-w-0 flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#0066ae]" />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Kirim"
          className="grid place-items-center min-h-11 w-11 shrink-0 rounded-xl bg-[#0066ae] text-white disabled:opacity-40">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

// ── CHECK (PPTI detail) ──────────────────────────────────
function Check() {
  const [prog, setProg] = useState<"PPBP" | "PPTI">("PPTI");
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["PPTI", "PPBP"] as const).map((p) => (
          <button key={p} onClick={() => setProg(p)} aria-pressed={prog === p}
            className={`px-6 py-2.5 rounded-full border text-sm font-bold transition ${prog === p ? "border-[#0066ae] bg-[#0066ae] text-white" : "border-slate-200 bg-white text-[#063b66]/70 hover:border-[#0066ae] hover:text-[#0066ae]"}`}>
            {p}
          </button>
        ))}
      </div>

      {prog === "PPTI" ? (
        <div className="space-y-5">
          {/* Hero card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-[#0066ae]" />
              <span className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] uppercase text-[#0066ae]">PPTI · BCA</span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-[#005cab]">Program Pendidikan<br />Teknik Informatika</h2>
            <p className="mt-3 text-sm text-slate-500">Beasiswa BCA untuk lulusan SMA / SMK</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Experience Level", value: "Fresh Graduate" },
                { label: "Job Pipeline", value: "Beasiswa" },
                { label: "Timeline", value: "13 Apr – 20 Okt 2026" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-[#f4f7fb] p-3 border border-slate-100">
                  <p className="text-[10px] text-[#0066ae] uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-sm mt-1 text-[#063b66]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066ae]/10 flex items-center justify-center">
                <BookOpen size={18} className="text-[#0066ae]" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Tentang Program</h3>
                <p className="text-xs text-slate-400">Overview &amp; Deskripsi</p>
              </div>
            </div>
            <div className="space-y-4 pl-1">
              <p className="text-base leading-relaxed text-slate-700">
                Program Pendidikan Teknik Informatika (PPTI) berlangsung selama <span className="font-semibold text-[#005cab]">30 bulan</span>, ditujukan bagi lulusan SMA / SMK yang mengambil mata pelajaran Matematika atau yang berkaitan dengan Teknik Informatika. Selain kegiatan belajar di kelas, peserta juga wajib mengikuti <span className="font-semibold text-[#005cab]">on the job training</span> di unit kerja BCA, serta mendapatkan pembekalan soft skill seperti kepemimpinan, kerja tim, pembentukan karakter, dan perencanaan keuangan.
              </p>
              <p className="text-base leading-relaxed text-slate-700">
                Program ini <span className="font-semibold text-[#005cab]">tidak memiliki ikatan dinas</span>. Setelah lulus, para peserta berkesempatan mendapatkan penawaran kerja di BCA.
              </p>
              <div className="flex gap-2 flex-wrap mt-1">
                {["30 Bulan", "OTW BCA", "Soft Skill", "Job Offer"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#0066ae]/5 text-[#0066ae] text-xs font-semibold border border-[#0066ae]/10">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-cyan" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Persyaratan</h3>
                <p className="text-xs text-slate-400">Syarat yang harus dipenuhi</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                "Warga Negara Indonesia",
                "Siswa/i kelas XII atau lulusan SMA/SMK (Teknik Informatika)",
                "Usia maksimal 19 tahun saat mendaftar",
                "Rata-rata nilai rapor kelas X, XI, XII minimal 75,00",
                "Rata-rata nilai Matematika &amp; Penjurusan minimal 75,00",
                "Mampu berbahasa Inggris dasar",
                "Tidak pernah tinggal kelas (SD–SMA/SMK)",
                "Tidak pernah terlibat narkoba / pelanggaran hukum",
                "Lulus dalam proses seleksi",
              ].map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold mt-0.5">✓</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Selection stages */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ArrowRight size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Tahapan Seleksi</h3>
                <p className="text-xs text-slate-400">7 tahapan menuju diterima</p>
              </div>
            </div>
            <div className="space-y-0">
              {[
                { title: "Seleksi Administrasi", desc: "Verifikasi berkas & kelengkapan" },
                { title: "Tes Online", desc: "Tes kemampuan akademik" },
                { title: "Psikotes", desc: "Evaluasi kepribadian & potensi" },
                { title: "Wawancara HR", desc: "Wawancara oleh tim SDM" },
                { title: "Pemeriksaan Kesehatan", desc: "Medical check-up" },
                { title: "Perjanjian Kerja", desc: "Penandatanganan kontrak" },
                { title: "Diterima", desc: "Selamat! Kamu resmi diterima" },
              ].map((stage, i) => (
                <div key={i} className="flex gap-4 items-start">
                  {i < 6 && <div className="flex flex-col items-center shrink-0 pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#0066ae]" />
                    {i < 6 && <div className="w-px h-8 bg-slate-100 mt-1" />}
                  </div>}
                  <div className="pb-6 flex-1">
                    <p className="text-base font-bold text-[#005cab]">{stage.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400 flex items-center gap-2 justify-center">
            <XCircle size={13} className="text-pink-400" /> FutureTry tidak memprediksi peluang diterima. Informasi di atas harus diverifikasi di kanal resmi BCA.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-[#0066ae]" />
              <span className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] uppercase text-[#0066ae]">PPBP · BCA</span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-[#005cab]">Program Pendidikan<br />Bisnis dan Perbankan</h2>
            <p className="mt-3 text-sm text-slate-500">Beasiswa BCA untuk lulusan SMA / SMK</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Experience Level", value: "Fresh Graduate" },
                { label: "Job Pipeline", value: "Beasiswa" },
                { label: "Timeline", value: "13 Apr – 20 Okt 2026" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-[#f4f7fb] p-3 border border-slate-100">
                  <p className="text-[10px] text-[#0066ae] uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-sm mt-1 text-[#063b66]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066ae]/10 flex items-center justify-center">
                <BookOpen size={18} className="text-[#0066ae]" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Tentang Program</h3>
                <p className="text-xs text-slate-400">Overview &amp; Deskripsi</p>
              </div>
            </div>
            <div className="space-y-4 pl-1">
              <p className="text-base leading-relaxed text-slate-700">
                Program Pendidikan Bisnis dan Perbankan (PPBP) berlangsung selama <span className="font-semibold text-[#005cab]">30 bulan</span>, ditujukan bagi lulusan SMA / SMK yang berprestasi dari seluruh jurusan dan memiliki minat di bidang Bisnis dan Perbankan. Selain kegiatan belajar di kelas, peserta juga wajib mengikuti <span className="font-semibold text-[#005cab]">on the job training</span> di unit kerja BCA, serta mendapatkan pembekalan soft skill seperti kepemimpinan, kerja tim, pembentukan karakter, dan perencanaan keuangan.
              </p>
              <p className="text-base leading-relaxed text-slate-700">
                Program ini <span className="font-semibold text-[#005cab]">tidak memiliki ikatan dinas</span>. Namun demikian, peserta diberikan kesempatan untuk bekerja di BCA selepas menyelesaikan program tersebut, sesuai dengan kebutuhan perusahaan.
              </p>
              <div className="flex gap-2 flex-wrap mt-1">
                {["30 Bulan", "OTW BCA", "Soft Skill", "Job Offer"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#0066ae]/5 text-[#0066ae] text-xs font-semibold border border-[#0066ae]/10">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-cyan" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Persyaratan</h3>
                <p className="text-xs text-slate-400">Syarat yang harus dipenuhi</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                "Warga Negara Indonesia",
                "Siswa/i kelas XII atau lulusan SMA/SMK",
                "Usia maksimal 19 tahun saat mendaftar",
                "Rata-rata nilai rapor kelas X, XI, XII minimal 75,00",
                "Rata-rata nilai Matematika &amp; Penjurusan minimal 75,00",
                "Mampu berbahasa Inggris dasar",
                "Tidak pernah tinggal kelas (SD–SMA/SMK)",
                "Tidak pernah terlibat narkoba / pelanggaran hukum",
                "Lulus dalam proses seleksi",
              ].map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold mt-0.5">✓</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{req}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ArrowRight size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Tahapan Seleksi</h3>
                <p className="text-xs text-slate-400">7 tahapan menuju diterima</p>
              </div>
            </div>
            <div className="space-y-0">
              {[
                { title: "Seleksi Administrasi", desc: "Verifikasi berkas & kelengkapan" },
                { title: "Tes Online", desc: "Tes kemampuan akademik" },
                { title: "Psikotes", desc: "Evaluasi kepribadian & potensi" },
                { title: "Wawancara HR", desc: "Wawancara oleh tim SDM" },
                { title: "Pemeriksaan Kesehatan", desc: "Medical check-up" },
                { title: "Perjanjian Kerja", desc: "Penandatanganan kontrak" },
                { title: "Diterima", desc: "Selamat! Kamu resmi diterima" },
              ].map((stage, i) => (
                <div key={i} className="flex gap-4 items-start">
                  {i < 6 && <div className="flex flex-col items-center shrink-0 pt-1">
                    <div className="w-3 h-3 rounded-full bg-[#0066ae]" />
                    {i < 6 && <div className="w-px h-8 bg-slate-100 mt-1" />}
                  </div>}
                  <div className="pb-6 flex-1">
                    <p className="text-base font-bold text-[#005cab]">{stage.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400 flex items-center gap-2 justify-center">
            <XCircle size={13} className="text-pink-400" /> FutureTry tidak memprediksi peluang diterima. Informasi di atas harus diverifikasi di kanal resmi BCA.
          </p>
        </div>
      )}
    </div>
  );
}

// ── CONNECT ──────────────────────────────────────────────────────
function Connect() {
  const [sent, setSent] = useState(false);
  const [q, setQ] = useState("");
  const awardees = stories.slice(0, 3);
  if (sent) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 size={36} className="mx-auto text-cyan" />
        <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[#005cab] mt-3">Pesan Terkirim</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">Pesanmu telah dikirim. Awardee akan segera membalas ceritanya.</p>
        <button onClick={() => setSent(false)} className="min-h-11 mt-4 px-5 py-2 rounded-xl border border-[#0066ae] text-[#0066ae] text-sm font-bold hover:bg-[#0066ae] hover:text-white transition">Kirim pesan lain</button>
      </div>
    );
  }
  return (
    <div className="space-y-5">
<div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <UserRound size={18} className="text-cyan" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] text-[#0066ae]">CERITA AWARDEE</p>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#005cab]">Connect with Awardee</h3>
            <p className="text-xs text-slate-400">Dengar langsung dari yang menjalani</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-3">Dapatkan insight langsung dari alumni yang sudah menjalani program ini.</p>
      </div>

      <Link href="/stories" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#0066ae] transition group">
        <div><p className="font-bold text-[#005cab]">Lihat semua Cerita Awardee</p><p className="text-xs text-slate-450 mt-0.5">Cerita lengkap dari para alumni PPBP dan PPTI.</p></div>
        <ArrowRight size={18} className="text-navy/30 group-hover:text-[#0066ae] group-hover:translate-x-0.5 transition" />
      </Link>

      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#005cab] mb-2" htmlFor="q">Kirim pesan</label>
          <textarea id="q" required value={q} onChange={(e) => setQ(e.target.value)} rows={3} maxLength={800}
            placeholder="Tulis apa yang ingin kamu tanyakan..."
            className="w-full px-4 py-3 rounded-xl bg-[#f4f7fb] border border-slate-200 text-sm focus:outline-none focus:border-[#0066ae] resize-none" />
        </div>
        <button type="submit" className="w-full px-6 py-3.5 rounded-2xl bg-[#0066ae] text-white font-bold shadow-sm hover:bg-[#005cab] transition">
          KIRIM PESAN
        </button>
      </form>
    </div>
  );
}

// ── ACT ──────────────────────────────────────────────────────────
function Act() {
  const { progress } = useJourney();
  const done = progress.completedMissions.length;
  const total = missions.length;
  return (
    <div className="space-y-3 w-full items-stretch">
      <Link href="/world" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#0066ae] transition group">
        <div><p className="font-bold text-[#005cab]">Explore more</p><p className="text-xs text-slate-450 mt-0.5">{done}/{total} misi selesai — sisa {total - done} menunggumu.</p></div>
        <ArrowRight size={18} className="text-navy/30 group-hover:text-[#0066ae] transition" />
      </Link>
      <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
        <div><p className="font-bold text-navy">Save my journey</p><p className="text-xs text-navy/55 mt-0.5">Progresmu otomatis tersimpan di perangkat ini — tanpa akun.</p></div>
        <CheckCircle2 size={18} className="text-green-500" />
      </div>
      <a href="https://www.bca.co.id" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-between rounded-2xl bg-navy p-5 text-white hover:shadow-lg hover:shadow-bcablue/25 transition group">
        <div><p className="font-bold">Apply officially →</p><p className="text-xs text-white/70 mt-0.5">Pendaftaran resmi hanya melalui kanal BCA.</p></div>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
      </a>
    </div>
  );
}
