"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleQuestion, X, Send, Sparkles } from "lucide-react";
import { Events } from "@/lib/analytics";

interface Msg { role: "user" | "assistant"; content: string; sources?: string[] }

const SUGGESTIONS = [
  "Apa bedanya PPBP dan PPTI?",
  "Aku anak IPS, bisa PPTI nggak?",
  "Sehari-hari di program kayak gimana?",
];

// Sesi demo tanpa login — id acak utk sinkronisasi opsional ke DB.
function sessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ft.session");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("ft.session", id); }
  return id;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

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
      setMsgs((m) => [...m, { role: "assistant", content: data.content, sources: data.sources }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Hmm, ada gangguan sebentar. Coba lagi ya — atau langsung ke halaman FuturePath untuk info resmi.", sources: [] }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-bcablue to-cyan text-white shadow-xl shadow-cyan/30 hover:scale-105 transition"
        aria-label={open ? "Tutup Ask FutureTry" : "Buka Ask FutureTry"}
      >
        {open ? <X size={22} /> : <MessageCircleQuestion size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] h-[min(70vh,520px)] rounded-2xl glass shadow-2xl shadow-navy/20 flex flex-col overflow-hidden"
            role="dialog" aria-label="Ask FutureTry"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-navy to-bcablue text-white flex items-center gap-2">
              <Sparkles size={16} className="text-lightcyan" />
              <div>
                <p className="font-bold text-sm leading-tight">Ask FutureTry</p>
                <p className="text-[11px] text-lightcyan/90">Bertanya soal PPBP/PPTI — tanpa prediksi, tanpa skor.</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-navy/70">Hai! Aku bisa bantu jelaskan program, misi, dan langkah berikutnya. Coba tanya:</p>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-cyan/10 text-bcablue hover:bg-cyan/20 transition font-medium">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-bcablue text-white rounded-br-md" : "bg-white border border-navy/10 text-ink rounded-bl-md"
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.sources && m.sources.length > 0 && (
                      <p className="mt-1.5 text-[10px] text-navy/45 font-mono">sumber: {m.sources.join(" · ")}</p>
                    )}
                  </div>
                </div>
              ))}
              {busy && <p className="text-xs text-navy/50 animate-pulse">Ask FutureTry sedang berpikir…</p>}
              <div ref={endRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-navy/10 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pertanyaan…" maxLength={500}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-navy/15 text-sm focus:outline-none focus:border-cyan" />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Kirim"
                className="grid place-items-center w-10 rounded-xl bg-gradient-to-br from-bcablue to-cyan text-white disabled:opacity-40">
                <Send size={16} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
