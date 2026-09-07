import Image from "next/image";
import Link from "next/link";
import { characters } from "@/lib/content/characters";
import { ArrowRight, Compass, Map as MapIcon, MessagesSquare, Route, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-white to-white">
          <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative z-10 order-2 lg:order-1">
              <p className="font-mono text-xs tracking-[0.3em] text-bcablue mb-4">BCA FUTURETRY</p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-extrabold leading-[1.05] text-navy">
                Try before<br />you <span className="text-brand-gradient">choose.</span>
              </h1>
              <p className="mt-5 text-lg text-navy/70 max-w-md leading-relaxed">
                Jelajahi role di balik <strong className="text-bcablue">PPBP</strong> &amp; <strong className="text-bcablue">PPTI</strong>, coba misinya, dan lihat ke mana futurumu bisa membawa.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-navy/55 bg-cyan/10 border border-cyan/20 rounded-full px-3.5 py-1.5">
                <Sparkles size={14} className="text-cyan" /> No test. No right or wrong answer. Just try.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/world" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-bcablue to-cyan text-white font-bold shadow-lg shadow-cyan/30 hover:shadow-cyan/50 hover:-translate-y-0.5 transition">
                  START FUTURETRY <ArrowRight size={18} />
                </Link>
                <Link href="/world#map" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-navy/15 text-navy font-bold hover:border-cyan hover:text-bcablue transition">
                  EXPLORE FUTURE WORLD
                </Link>
              </div>
            </div>

            {/* Hero artwork — portrait, crop aman utk mobile */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-bcablue/20 via-cyan/20 to-pink/10 blur-3xl rounded-full" aria-hidden="true" />
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <Image
                  src="/hero.jpg"
                  alt="Lima karakter pemandu FutureTry — Fino, Elia, Seno, Esha, dan Adit — di kampus futuristik BCA"
                  width={914} height={1280} priority
                  className="w-full h-auto max-h-[70vh] object-cover object-top rounded-3xl shadow-2xl shadow-navy/25 border border-white/60"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ WHAT DO YOU WANT TO TRY ═══════════ */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-navy text-center">
              What do you want to <span className="text-brand-gradient">try first?</span>
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
                  className="group rounded-2xl border border-navy/10 bg-white p-5 hover:border-cyan hover:shadow-lg hover:shadow-cyan/10 hover:-translate-y-1 transition">
                  <p className="font-bold text-navy text-sm sm:text-base group-hover:text-bcablue transition">{c.label}</p>
                  <p className="text-xs text-navy/55 mt-1.5 leading-snug">{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ EXPERIENCE · REFLECT · ACT ═══════════ */}
        <section className="py-14 bg-navy text-white">
          <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8">
            {[
              { icon: <Compass size={22} />, step: "01", title: "Experience", body: "Try a real role scenario — misi singkat 5–15 menit dari dunia kerja PPBP & PPTI." },
              { icon: <MessagesSquare size={22} />, step: "02", title: "Reflect", body: "Ceritakan apa yang kamu rasakan. Tidak ada skor — hanya kamu yang menilai pengalamanmu." },
              { icon: <Route size={22} />, step: "03", title: "Act", body: "Dapat gambaran? Cek informasi resmi, tanya awardee, dan tentukan langkahmu." },
            ].map((c) => (
              <div key={c.title} className="relative">
                <p className="font-mono text-xs text-lightcyan/60 mb-3">{c.step}</p>
                <div className="text-cyan mb-3">{c.icon}</div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">{c.title}</h3>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ MEET THE GUIDES ═══════════ */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-navy text-center">Meet your guides</h2>
            <p className="text-center text-navy/60 mt-3 max-w-xl mx-auto">
              Lima karakter, lima sudut pandang. Mereka bukan penentu jurusanmu — mereka pembuka percakapan.
            </p>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {characters.map((c) => (
                <div key={c.id} className="rounded-2xl border border-navy/10 bg-white p-5 hover:shadow-lg hover:shadow-cyan/10 hover:-translate-y-1 transition">
                  <div className="grid place-items-center w-12 h-12 rounded-2xl text-white font-extrabold mb-3" style={{ background: `linear-gradient(135deg, ${c.accent}, #0b426c)` }}>
                    {c.emojiSeed}
                  </div>
                  <p className="font-bold text-navy">{c.name}</p>
                  <p className="text-[11px] font-mono text-cyan">{c.fesea} · {c.program}</p>
                  <p className="text-xs text-navy/60 mt-2 leading-snug line-clamp-3">“{c.message}”</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PREVIEW CARDS ═══════════ */}
        <section className="py-14">
          <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-4">
            <Link href="/world" className="group rounded-2xl overflow-hidden border border-navy/10 bg-white hover:shadow-xl hover:shadow-cyan/10 transition">
              <div className="h-32 bg-gradient-to-br from-navy via-bcablue to-cyan grid place-items-center"><MapIcon className="text-white/90" size={30} /></div>
              <div className="p-5">
                <p className="font-bold text-navy group-hover:text-bcablue transition">Future World Map</p>
                <p className="text-sm text-navy/60 mt-1">Jelajahi distrik, buka checkpoint, coba misi.</p>
              </div>
            </Link>
            <Link href="/stories" className="group rounded-2xl overflow-hidden border border-navy/10 bg-white hover:shadow-xl hover:shadow-cyan/10 transition">
              <div className="h-32 bg-gradient-to-br from-bcablue via-cyan to-lightcyan grid place-items-center"><MessagesSquare className="text-white/90" size={30} /></div>
              <div className="p-5">
                <p className="font-bold text-navy group-hover:text-bcablue transition">Real Awardee Stories</p>
                <p className="text-sm text-navy/60 mt-1">Ekspektasi vs realita, dari orang yang menjalaninya.</p>
              </div>
            </Link>
            <Link href="/futurepath" className="group rounded-2xl overflow-hidden border border-navy/10 bg-white hover:shadow-xl hover:shadow-cyan/10 transition">
              <div className="h-32 bg-gradient-to-br from-cyan via-aqua to-pink/60 grid place-items-center"><Route className="text-white/90" size={30} /></div>
              <div className="p-5">
                <p className="font-bold text-navy group-hover:text-bcablue transition">FuturePath</p>
                <p className="text-sm text-navy/60 mt-1">Info resmi, syarat, dan langkah berikutnya.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
              Your future doesn&apos;t have to be<br /><span className="text-brand-gradient">decided today.</span>
            </h2>
            <p className="text-navy/60 mt-4">But you can start exploring it today.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/world" className="px-6 py-3 rounded-xl bg-gradient-to-r from-bcablue to-cyan text-white font-bold shadow-lg shadow-cyan/25 hover:-translate-y-0.5 transition">
                START EXPLORING
              </Link>
              <Link href="/futurepath" className="px-6 py-3 rounded-xl border-2 border-navy/15 text-navy font-bold hover:border-cyan transition">
                CHECK REQUIREMENTS
              </Link>
            </div>
          </div>
        </section>
      </>
  );
}
