"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleQuestion, X, Send, Sparkles } from "lucide-react";
import { Events } from "@/lib/analytics";

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  mode?: "ai" | "mock";
}

const SUGGESTIONS = [
  "Apa bedanya PPBP dan PPTI?",
  "Aku anak IPS, bisa PPTI nggak?",
  "Sehari-hari di program kayak gimana?",
];

// Sesi demo tanpa login — id acak utk sinkronisasi opsional ke DB.
function sessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ft.session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("ft.session", id);
  }
  return id;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = messagesRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [msgs, open]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

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
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: "Hmm, ada gangguan sebentar. Coba lagi ya — atau langsung ke halaman FuturePath untuk info resmi.",
          sources: [],
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Karakter Game Companion di Samping Tombol Chat (Saat chat tertutup) */}
      {!open && (
        <aside
          aria-label="Panduan Karakter NPC"
          className="fixed bottom-5 right-20 sm:right-24 z-50 flex items-end gap-2 pointer-events-auto select-none"
        >
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 10 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(true)}
              className="relative hidden sm:block max-w-[200px] cursor-pointer rounded-2xl rounded-br-none border border-[#00a9d6]/30 bg-white/95 p-3 text-xs shadow-xl shadow-[#063b66]/10 backdrop-blur-md transition-all hover:scale-[1.03]"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                className="absolute -left-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-300"
                title="Tutup pesan"
                aria-label="Tutup pesan guide"
              >
                ×
              </button>
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#0066ae]">
                <Sparkles className="size-3 text-[#00a9d6] animate-pulse" />
                <span>NPC Companion</span>
              </div>
              <p className="font-bold leading-snug text-[#063b66]">
                👋 Butuh rute misi atau info beasiswa? Tanya aku yuk!
              </p>
            </motion.div>
          )}

          {/* 3D Character Avatar Mascot */}
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group relative size-16 sm:size-20 shrink-0 cursor-pointer focus:outline-none drop-shadow-2xl"
            aria-label="Buka Chat Bersama Guide Companion"
          >
            <img
              src="/character-ppti.png"
              alt="Guide Companion"
              className="h-full w-full object-contain object-bottom filter drop-shadow-[0_8px_12px_rgba(0,102,174,0.35)] transition-transform group-hover:rotate-3"
            />
            {/* Status Online Ping Ring */}
            <span className="absolute bottom-1 right-2 size-3.5 rounded-full border-2 border-white bg-emerald-500 ring-2 ring-emerald-300 animate-pulse" />
          </motion.button>
        </aside>
      )}

      {/* Floating Chat Launcher Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setOpen(!open)}
        className="chat-launcher fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#063b66] to-[#0066ae] text-white shadow-xl shadow-[#00a9d6]/30 transition hover:scale-105 hover:shadow-[#00a9d6]/50"
        aria-label={open ? "Tutup Ask FutureTry" : "Buka Ask FutureTry"}
      >
        {open ? <X size={22} /> : <MessageCircleQuestion size={24} />}
      </motion.button>

      {/* Chat Panel Box */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="chat-panel fixed bottom-22 right-4 sm:bottom-24 sm:right-6 z-50 flex h-[62vh] max-h-[580px] min-h-[360px] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-3xl border-2 border-white bg-white shadow-2xl shadow-navy/20"
            role="dialog"
            aria-label="Ask FutureTry"
          >
            {/* Game RPG Header */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#063b66] via-[#005baa] to-[#008caf] px-4 py-3 text-white shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-cyan-300 bg-white/10 shadow-inner">
                  <img
                    src="/character-ppti.png"
                    alt="Guide Companion"
                    className="h-full w-full object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border border-white bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black leading-tight tracking-wide">Ask FutureTry</p>
                    <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-cyan-200">
                      NPC Mentor
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-cyan-100">Siap pandu misi PPBP & PPTI</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Tutup chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div ref={messagesRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#f8fafc] p-4">
              {msgs.length === 0 && (
                <div className="space-y-2.5">
                  <div className="rounded-2xl border border-sky-100 bg-white p-3.5 shadow-sm">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0066ae]">
                      <Sparkles className="size-3 text-[#00a9d6]" />
                      <span>Halo, Petualang!</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                      Aku asisten AI & mentor panduanmu. Kamu bisa tanyakan apa saja seputar jalur beasiswa, kurikulum IT,
                      atau rute misi di peta:
                    </p>
                  </div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block min-h-11 w-full rounded-xl border border-cyan-100 bg-white px-3.5 py-2.5 text-left text-xs font-bold text-[#0066ae] shadow-sm transition hover:border-[#00a9d6] hover:bg-cyan-50"
                    >
                      💬 {s}
                    </button>
                  ))}
                </div>
              )}

              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="mr-2 size-7 shrink-0 overflow-hidden rounded-full border border-[#00a9d6]/50 bg-white shadow-sm mt-0.5">
                      <img
                        src="/character-ppti.png"
                        alt="NPC"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-gradient-to-r from-[#0066ae] to-[#008caf] font-medium text-white shadow-sm"
                        : "rounded-tl-sm border border-slate-200/90 bg-white text-slate-800 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    {m.mode === "mock" && (
                      <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-1.5 text-[10px] text-slate-500 font-medium">
                        📌 Mode referensi resmi FuturePath.
                      </p>
                    )}
                    {m.sources && m.sources.length > 0 && (
                      <p className="mt-1.5 font-mono text-[10px] font-bold text-[#0066ae]">
                        Sumber: {m.sources.join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0066ae] animate-pulse">
                  <div className="size-6 overflow-hidden rounded-full border border-[#00a9d6] bg-white">
                    <img src="/character-ppti.png" alt="NPC Thinking" className="h-full w-full object-cover object-top" />
                  </div>
                  <span>Guide sedang menyiapkan jawaban…</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex shrink-0 gap-2 border-t border-slate-200/80 bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Pertanyaan untuk Ask FutureTry"
                placeholder="Tulis pertanyaan seputar beasiswa & misi…"
                maxLength={500}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:border-[#00a9d6] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Kirim"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-[#0066ae] to-[#00a9d6] text-white shadow-md shadow-sky-500/20 disabled:opacity-40 transition hover:scale-105"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
