# BCA FutureTry — Try before you choose

Website konsep interaktif untuk **BCA FutureTry** (brief YNFEST): siswa SMA/SMK bisa
* mencoba peran nyata di dunia kerja BCA lewat misi singkat ±5 menit,
* merefleksikan pengalamannya (tanpa skor / tanpa jawaban benar-salah),
* membuka **Future Card** & menjelajah **FuturePath** (Learn → Ask → Check → Connect → Act).

> ⚠️ **Ini proyek konsep / demo.** Bukan situs resmi BCA. Semua angka, syarat,
> dan kutipan di `src/lib/content/` adalah placeholder yang WAJIB diverifikasi ke
> kanal resmi BCA sebelum dipublikasikan. Cerita awardee di `stories.ts` fiktif.

## Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (design tokens BCA di `globals.css`) |
| Animasi | Framer Motion |
| Ikon | lucide-react |
| Database (opsional) | PostgreSQL + Prisma 6 |
| Validasi API | Zod |
| Tests | Vitest (14 test logic progression) |

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
```

### Tanpa database (default)
Semua progres tersimpan di **localStorage** browser. API route tetap jalan
(mengembalikan `saved: false`). Chatbot memakai **knowledge-base mock** offline.

### Dengan PostgreSQL (opsional)
```bash
cp .env.example .env.local      # isi DATABASE_URL + (opsional) AI_* keys
npx prisma db push              # buat tabel
npx prisma db seed              # isi konten misi/choice/stories
npm run dev
```
Kalau `AI_API_KEY` + `AI_BASE_URL` + `AI_MODEL` diisi, **Ask FutureTry** otomatis
pakai LLM OpenAI-compatible; kalau kosong, fallback ke mock KB (deterministik,
aman untuk demo). Key tidak pernah dikirim ke client.

## Struktur penting

```
src/
  app/                 # routes: / , /world, /mission/[id], /stories, /futurepath
    api/               # /api/content, /api/mission/complete, /api/chat
  components/          # FutureWorldMap, MissionPlayer, FutureCard, ChatWidget, ...
  lib/
    content/           # SEMUA konten: characters, missions, map, stories, futurepath
    progress.ts        # logic unlock/checkpoint (murni, unit-tested)
    chat.ts            # provider abstraction LLM + mock fallback
prisma/schema.prisma   # User, Mission, Choice, Reflection, ChatLog, Story
```

## Verifikasi yang sudah dilakukan

- `npx tsc --noEmit` → 0 error
- `npx vitest run` → 14/14 pass (unlock chain, idempotency, reflection, persistence)
- `npm run build` → exit 0, 9 routes
- Acceptance flow di browser (Playwright): map → mission → 3 step → reflection →
  Future Card → reload → state persist + checkpoint berikutnya terbuka ✓
- Chatbot mock menjawab pertanyaan PPBP/PPTI ✓

## Known trade-offs

- Konten & angka placeholder (sengaja, sesuai brief).
- Chat log DB hanya tercatat saat `DATABASE_URL` ada; mock mode tetap menjawab.
- Future Card "download" memakai `window.print()` (tanpa lib PDF).
