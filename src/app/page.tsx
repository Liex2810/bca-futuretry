import Image from "next/image";
import Link from "next/link";
import { characters } from "@/lib/content/characters";
import { ArrowRight, Compass, Map as MapIcon, MessagesSquare, Route } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ═══════════════ HERO — full-bleed artwork, teks tengah (sama spt referensi) ═══════════════ */}
      <section className="relative isolate overflow-hidden bg-skyblue">
        <Image
          src="/hero.jpg"
          alt="Lima karakter pemandu FutureTry — Fino, Elia, Seno, Esha, dan Adit — di kampus futuristik BCA"
          fill priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* sedikit gelap biar teks tengah kebaca, langit tetap cerah */}
        <div className="absolute inset-0 bg-navy/10" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 min-h-[82vh] flex flex-col items-center justify-center text-center">
          <span className="grid place-items-center h-12 rounded-xl bg-bcadark text-white text-sm font-extrabold px-4 font-[family-name:var(--font-display)] tracking-tight shadow-lg shadow-bcadark/30">BCA</span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight">
            <span className="text-brand-gradient drop-shadow-[0_2px_12px_rgba(255,255,255,0.55)]">Future<span className="text-neon">Try</span></span>
          </h1>
          <p className="mt-4 font-[family-name:var(--font-display)] text-lg sm:text-2xl font-extrabold tracking-[0.25em] text-white drop-shadow-[0_2px_8px_rgba(3,66,180,0.65)]">
            TRY BEFORE YOU CHOOSE
          </p>
          <p className="mt-4 max-w-md text-sm text-white/95 drop-shadow-[0_1px_4px_rgba(11,66,108,0.8)]">
            Jelajahi role di balik PPBP &amp; PPTI — coba misinya, refleksikan, lihat ke mana futurumu membawa. Tanpa tes, tanpa jawaban benar/salah.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/world" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-bcadark text-white font-bold shadow-lg shadow-bcadark/30 hover:bg-navy hover:-translate-y-0.5 transition">
              MULAI SEKARANG <ArrowRight size={17} />
            </Link>
            <Link href="/world#map" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-[1.5px] border-white/80 text-white font-bold bg-white/10 backdrop-blur-sm hover:bg-white hover:text-bcadark transition">
              EXPLORE FUTURE WORLD
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT DO YOU WANT TO TRY ═══════════ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-navy text-center">
            Mau coba <span className="text-bcadark">apa</span> dulu?
          </h2>
          <p className="text-center text-navy/60 mt-3 max-w-xl mx-auto">
            Lima pintu masuk berdasarkan rasa penasaran — bukan tes kepribadian, bukan pengelompokan.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Solve a problem", desc: "Kasus nyata, keputusan nyata", to: "/world" },
              { label: "Build something", desc: "Dari ide jadi jalan", to: "/world" },
              { label: "Understand people", desc: "Nasabah, tim, pengguna", to: "/world" },
              { label: "Make a decision", desc: "Pilih di tengah ketidakpastian", to: "/world" },
              { label: "Work with data", desc: "Angka yang bercerita", to: "/world" },
            ].map((c) => (
              <Link key={c.label} href={c.to}
                className="group rounded-2xl border border-navy/10 bg-white p-5 hover:border-bcadark hover:shadow-lg hover:shadow-bcadark/10 hover:-translate-y-1 transition">
                <p className="font-bold text-navy text-sm sm:text-base group-hover:text-bcadark transition">{c.label}</p>
                <p className="text-xs text-navy/55 mt-1.5 leading-snug">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ EXPERIENCE · REFLECT · ACT — section gelap ═══════════ */}
      <section className="py-16 bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-center">
            Jelajahi <span className="text-neon">dulu.</span>
          </h2>
          <p className="text-center text-white/65 mt-3 max-w-lg mx-auto text-sm">
            Tiga langkah sederhana — tanpa akun, tanpa skor, tanpa tekanan.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { icon: <Compass size={22} />, step: "01", title: "Experience", body: "Try a real role scenario — misi singkat 5–15 menit dari dunia kerja PPBP & PPTI." },
              { icon: <MessagesSquare size={22} />, step: "02", title: "Reflect", body: "Ceritakan apa yang kamu rasakan. Tidak ada skor — hanya kamu yang menilai pengalamanmu." },
              { icon: <Route size={22} />, step: "03", title: "Act", body: "Dapat gambaran? Cek informasi resmi, tanya awardee, dan tentukan langkahmu." },
            ].map((c) => (
              <div key={c.title} className="relative">
                <p className="font-mono text-xs text-lightcyan/60 mb-3">{c.step}</p>
                <div className="grid place-items-center w-12 h-12 rounded-full bg-neon/15 border border-neon/30 text-neon mb-4">{c.icon}</div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">{c.title}</h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MEET THE GUIDES ═══════════ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-navy text-center">Kenalan sama pemandunya</h2>
          <p className="text-center text-navy/60 mt-3 max-w-xl mx-auto">
            Lima karakter, lima sudut pandang. Mereka bukan penentu jurusanmu — mereka pembuka percakapan.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {characters.map((c) => (
              <div key={c.id} className="rounded-2xl border border-navy/10 bg-white p-5 hover:shadow-lg hover:shadow-bcadark/10 hover:-translate-y-1 transition">
                <div className="grid place-items-center w-12 h-12 rounded-full text-white font-extrabold mb-3" style={{ background: `linear-gradient(135deg, ${c.accent}, #0342b4)` }}>
                  {c.emojiSeed}
                </div>
                <p className="font-bold text-navy">{c.name}</p>
                <p className="text-[11px] font-mono text-bcadark">{c.fesea} · {c.program}</p>
                <p className="text-xs text-navy/60 mt-2 leading-snug line-clamp-3">“{c.message}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PREVIEW CARDS ═══════════ */}
      <section className="py-14 bg-paper">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-4">
          <Link href="/world" className="group rounded-2xl overflow-hidden border border-navy/10 bg-white hover:shadow-xl hover:shadow-bcadark/10 transition">
            <div className="h-32 bg-gradient-to-br from-bcadark via-bcablue to-neon grid place-items-center"><MapIcon className="text-white/90" size={30} /></div>
            <div className="p-5">
              <p className="font-bold text-navy group-hover:text-bcadark transition">Future World Map</p>
              <p className="text-sm text-navy/60 mt-1">Jelajahi distrik, buka checkpoint, coba misi.</p>
            </div>
          </Link>
          <Link href="/stories" className="group rounded-2xl overflow-hidden border border-navy/10 bg-white hover:shadow-xl hover:shadow-bcadark/10 transition">
            <div className="h-32 bg-gradient-to-br from-bcablue via-neon to-skyblue grid place-items-center"><MessagesSquare className="text-white/90" size={30} /></div>
            <div className="p-5">
              <p className="font-bold text-navy group-hover:text-bcadark transition">Real Awardee Stories</p>
              <p className="text-sm text-navy/60 mt-1">Ekspektasi vs realita, dari orang yang menjalaninya.</p>
            </div>
          </Link>
          <Link href="/futurepath" className="group rounded-2xl overflow-hidden border border-navy/10 bg-white hover:shadow-xl hover:shadow-bcadark/10 transition">
            <div className="h-32 bg-gradient-to-br from-navy via-bcadark to-neon grid place-items-center"><Route className="text-white/90" size={30} /></div>
            <div className="p-5">
              <p className="font-bold text-navy group-hover:text-bcadark transition">FuturePath</p>
              <p className="text-sm text-navy/60 mt-1">Info resmi, syarat, dan langkah berikutnya.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-20 bg-navy">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Masa depanmu nggak harus<br />diputuskan <span className="text-neon">hari ini.</span>
          </h2>
          <p className="text-white/65 mt-4">Tapi kamu bisa mulai menjelajahnya hari ini.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/world" className="px-7 py-3.5 rounded-full bg-neon text-navy font-bold shadow-lg shadow-neon/25 hover:bg-white transition">
              START EXPLORING
            </Link>
            <Link href="/futurepath" className="px-7 py-3.5 rounded-full border-2 border-white/40 text-white font-bold hover:border-white hover:bg-white/10 transition">
              CHECK REQUIREMENTS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
