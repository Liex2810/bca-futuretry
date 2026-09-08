// ════════════════════════════════════════════════════════════════
//  ASK FUTURETRY — provider abstraction.
//  - Kalau AI_API_KEY + AI_BASE_URL + AI_MODEL terisi → pakai LLM
//    (OpenAI-compatible /chat/completions), di-ground ke knowledge base.
//  - Kalau tidak → MOCK fallback: retrieval sederhana dari knowledge
//    base lokal. Tetap berguna, tetap bersumber, tanpa API apa pun.
//  Chatbot TIDAK BOLEH: mengarang syarat resmi, memprediksi
//  penerimaan, memberi skor kecocokan.
// ════════════════════════════════════════════════════════════════
import { faqs, knowledgeBase } from "@/lib/content/futurepath";
import { missions } from "@/lib/content/missions";

export interface ChatReply { content: string; sources: string[]; mode: "ai" | "mock"; }

const SYSTEM_PROMPT = `Kamu "Ask FutureTry", asisten untuk siswa SMA/SMK yang menjelajahi PPBP & PPTI (program beasiswa ikatan dinas BCA).
Aturan keras:
- Hanya jelaskan informasi dari KNOWLEDGE BASE yang diberikan. Kalau tidak ada di sana, katakan tidak tahu dan arahkan ke FuturePath / bicara dengan manusia (awardee/counselor/recruiter).
- DILARANG mengarang persyaratan resmi, DILARANG memprediksi peluang diterima, DILARANG memberi skor kecocokan.
- Bahasa santai, ringkas (maks 4 kalimat), Indonesia.
- Akhiri dengan sitasi sumber bila memberi info program.`;

// ── Retrieval sederhana (mock mode) ─────────────────────────────
function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
}

export function retrieve(question: string): { answer: string; source: string } | null {
  const q = new Set(normalize(question));
  let best: { answer: string; source: string; score: number } | null = null;
  for (const f of faqs) {
    const words = new Set([...normalize(f.question), ...normalize(f.tags.join(" "))]);
    let hits = 0;
    for (const w of q) if (words.has(w)) hits++;
    const score = hits / Math.max(1, words.size) + hits * 0.5;
    if (hits > 0 && (!best || score > best.score)) best = { answer: f.answer, source: f.source, score };
  }
  if (best) return { answer: best.answer, source: best.source };
  // fallback: topik mission
  const m = missions.find((mm) => normalize(mm.title).some((w) => q.has(w)) || normalize(mm.role).some((w) => q.has(w)));
  if (m) return { answer: `Itu bagian dari misi "${m.title}" (${m.role}, ${m.program}). Coba langsung di Future World — tidak ada jawaban benar/salah, cuma pengalaman.`, source: `Mission: ${m.id}` };
  return null;
}

function mockReply(question: string): ChatReply {
  const hit = retrieve(question);
  if (hit) {
    return {
      content: `${hit.answer}\n\n(Sumber: ${hit.source}. Untuk pertanyaan lebih personal, kamu bisa minta bicara ke awardee/counselor lewat FuturePath → Connect.)`,
      sources: [hit.source],
      mode: "mock",
    };
  }
  return {
    content:
      "Aku belum punya jawaban terverifikasi untuk itu. Yang bisa aku bantu sekarang: info bedanya PPBP & PPTI, isi misi, kehidupan program, dan langkah berikutnya. Untuk pertanyaan spesifik (syarat resmi, jadwal seleksi), cek FuturePath → Check atau tanya langsung ke manusia lewat FuturePath → Connect — mereka yang paling jujur jawabnya.",
    sources: ["Kebijakan FutureTry"],
    mode: "mock",
  };
}

// ── AI mode (kalau env terisi) ──────────────────────────────────
async function aiReply(question: string, history: { role: string; content: string }[]): Promise<ChatReply> {
  const baseUrl = process.env.AI_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl || !apiKey || !model) throw new Error("AI env tidak lengkap");

  const kb = knowledgeBase.map((k) => `- [${k.topic}] ${k.answer} (sumber: ${k.source})`).join("\n");
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 400,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nKNOWLEDGE BASE:\n${kb}` },
        ...history.slice(-6),
        { role: "user", content: question },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`AI provider ${res.status}`);
  const data = await res.json();
  let content: string = data?.choices?.[0]?.message?.content ?? "";
  // beberapa model (minimax dkk) menyisipkan blok penalaran <think>…</think> — buang,
  // dan ambil hanya bagian setelahnya kalau terlanjur dicampur.
  content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim() || content.split(/<\/think>/i).pop()!.trim();
  if (!content) throw new Error("AI balas kosong");
  return { content, sources: ["Knowledge base FutureTry"], mode: "ai" };
}

export async function askFutureTry(question: string, history: { role: string; content: string }[] = []): Promise<ChatReply> {
  const aiReady = Boolean(process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL);
  if (aiReady) {
    try {
      return await aiReply(question, history);
    } catch (e) {
      console.error("AI gagal, fallback ke mock:", e instanceof Error ? e.message : e);
    }
  }
  return mockReply(question);
}
