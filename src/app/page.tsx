"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { characters } from "@/lib/content/characters";
import { useJourney } from "@/components/JourneyProvider";
import { ChooseYourWorld } from "@/components/ChooseYourWorld";
import {
  ArrowRight,
  Compass,
  Map as MapIcon,
  MessagesSquare,
  Route,
  Phone,
  MessageCircle,
  Building2,
  Globe,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  ShieldAlert,
  ChevronRight,
  Play,
  Sparkles,
  Users,
} from "lucide-react";

const leaves = [
  { left: "6%", size: 18, dur: 9, delay: 0, sway: "3vw", spin: 160, color: "#5da05e" },
  { left: "14%", size: 13, dur: 12, delay: 2, sway: "-3vw", spin: 240, color: "#84c07a" },
  { left: "22%", size: 22, dur: 10.5, delay: 4.5, sway: "4vw", spin: 200, color: "#a8d08a" },
  { left: "31%", size: 15, dur: 11, delay: 1.2, sway: "-4vw", spin: 180, color: "#6cab6a" },
  { left: "41%", size: 20, dur: 9.5, delay: 5.5, sway: "3vw", spin: 220, color: "#86c47c" },
  { left: "52%", size: 14, dur: 13, delay: 0.6, sway: "-3vw", spin: 150, color: "#5da05e" },
  { left: "61%", size: 19, dur: 10, delay: 3, sway: "4vw", spin: 260, color: "#a8d08a" },
  { left: "70%", size: 16, dur: 12.5, delay: 6, sway: "-4vw", spin: 190, color: "#84c07a" },
  { left: "79%", size: 23, dur: 9, delay: 2.5, sway: "3vw", spin: 230, color: "#6cab6a" },
  { left: "88%", size: 13, dur: 11.5, delay: 7, sway: "-3vw", spin: 170, color: "#86c47c" },
  { left: "95%", size: 17, dur: 10.5, delay: 0.2, sway: "3vw", spin: 210, color: "#5da05e" },
];

function FallingLeaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <span
          key={i}
          className="leaf"
          style={
            {
              left: leaf.left,
              width: leaf.size,
              "--dur": `${leaf.dur}s`,
              "--delay": `${leaf.delay}s`,
              "--sway": leaf.sway,
              "--spin": `${leaf.spin}deg`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 24 24" width={leaf.size} height={leaf.size * 1.9} fill="none">
            <path
              d="M12 1 C19 6.5 19 17.5 12 23 C5 17.5 5 6.5 12 1 Z"
              fill={leaf.color}
            />
            <path d="M12 3 L12 21" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <path d="M12 12 C10 11 8.2 9.6 7 8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M12 12 C14 11 15.8 9.6 17 8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M12 15 C10 14 8.6 12.8 7.6 11.4" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M12 15 C14 14 15.4 12.8 16.4 11.4" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

const journeySteps = [
  { icon: Compass, title: "Explore", desc: "Jelajahi peran baru" },
  { icon: Play, title: "Try", desc: "Langsung coba misinya" },
  { icon: Sparkles, title: "Discover", desc: "Refleksikan pilihanmu" },
  { icon: Users, title: "Connect", desc: "Dengar pengalaman nyata" },
  { icon: ArrowRight, title: "Act", desc: "Tentukan langkahmu" },
];

function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!lineRef.current) return;
      const r = lineRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.72 - r.top) / r.height));
      setProg(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative mt-12 sm:mt-16 mb-16 sm:mb-28 scroll-mt-24">
      {/* Decorative accessory — right side */}
      <img
        src="/journey-accessory.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20 z-0 hidden select-none md:block sm:-bottom-40 sm:-right-32 w-96 xl:w-[560px]"
      />
      {/* ── Heading ── */}
      <div className="mx-auto max-w-3xl text-center mb-14">
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-[40px] font-semibold text-[#005cab]">
          Kenali masa depanmu melalui pengalaman langsung
        </h2>
      </div>

      {/* ── Route / Journey ── */}
      <div ref={lineRef} className="journey-route relative">
        {/* Base route line */}
        <div className="absolute top-7 sm:top-8 left-[10%] right-[10%] h-[2px] bg-[#063b66]/15" />
        {/* Animated fill route (scroll progress) */}
        <div
          className="absolute top-7 sm:top-8 left-[10%] right-[10%] h-[2px] origin-left bg-[#0066ae]"
          style={{ transform: `scaleX(${prog})` }}
        />
        {/* Chaser dot (progress tip) */}
        <div
          className="absolute top-[25px] sm:top-[29px] h-[7px] w-[7px] rounded-full bg-[#00c8eb]"
          style={{ left: `calc(10% + ${prog} * 80%)` }}
        />

        {/* Nodes */}
        <div className="journey-nodes relative grid grid-cols-1 sm:grid-cols-5 gap-5 sm:gap-4">
          {journeySteps.map((s) => (
            <div key={s.title} className="group relative flex flex-col items-center text-center">
              {/* Node */}
              <div className="relative">
                <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full border-2 border-[#0066ae]/30 bg-white text-[#0066ae] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#0066ae]">
                  <s.icon size={26} strokeWidth={1.8} />
                </div>
              </div>

              <span className="mt-3 font-[family-name:var(--font-display)] text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#063b66] transition-colors duration-300 group-hover:text-[#0066ae]">
                {s.title}
              </span>
              <span className="mt-1.5 max-w-[150px] text-[11px] sm:text-xs leading-snug text-slate-500 transition-colors duration-300 group-hover:text-[#063b66]">
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mx-auto max-w-3xl text-center mt-12">
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Pengalaman interaktif untuk menjelajahi peran, menyelesaikan misi, menemukan pengalaman
          nyata dari mahasiswa, dan memahami langkah berikutnya.
        </p>
      </div>

      {/* CTA */}
      <div className="relative mt-12 text-center">
        <Link
          href="/world"
          className="-skew-x-12 inline-flex items-center px-8 py-2.5 border border-[#0066ae] bg-white/60 backdrop-blur-sm text-[#0066ae] hover:bg-[#0066ae] hover:text-white transition-colors duration-200"
        >
          <span className="skew-x-12 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm sm:text-base font-extrabold tracking-[0.25em] uppercase">
            Mulai Jelajahi
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const router = useRouter();
  const { reset } = useJourney();
  const [name, setName] = useState("");
  const [track, setTrack] = useState("ALL");
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        localStorage.setItem("ft_explorer_name", name.trim());
        localStorage.setItem("ft_explorer_track", track);
      } catch {
        // storage fallback
      }
    }
    router.push("/world");
  };

  const handleResetProgress = () => {
    if (confirm("Reset seluruh progres misi dan refleksi simulasi?")) {
      reset();
      setStatusMsg("Progres simulasi berhasil direset.");
      setTimeout(() => setStatusMsg(""), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#062b4c]">

      {/* ═══════════════ FULL-SCREEN HERO (full-page background, Yanmar style) ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-[#063b66] -mt-[68px]">
        {/* Background image: full from top to bottom, no cropping, pulled up under the navbar */}
        <img
          src="/hero-bg.png"
          alt="BCA FutureTry"
          className="relative w-full h-auto block"
        />
        <FallingLeaves />
        {/* Center Main Logo */}
        <div className="absolute inset-x-0 top-[10%] flex flex-col items-center">
          <h1 className="sr-only">BCA FutureTry — Coba simulasi kerja nyata PPBP &amp; PPTI sebelum memilih</h1>
          <img
            src="/main-logo.svg"
            alt="BCA FutureTry"
            className="w-full max-w-[806px] object-contain drop-shadow-lg px-8"
          />
          <Link
            href="/world"
            className="-skew-x-12 mt-8 inline-flex items-center px-8 py-3 border border-[#0066ae] bg-white/60 backdrop-blur-sm text-[#0066ae] hover:bg-[#0066ae] hover:text-white transition-colors duration-200 min-h-[44px]"
          >
            <span className="skew-x-12 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm sm:text-base font-extrabold tracking-[0.25em] uppercase">
              Start FutureTry
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
        </div>
        {/* Gradient transition at the bottom of the image into the page background */}
        <div
          className="absolute inset-x-0 bottom-0 h-96 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(244,247,251,0) 0%, rgba(244,247,251,0.35) 40%, rgba(244,247,251,0.75) 70%, rgba(244,247,251,1) 100%)",
          }}
        />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ═══════════════ HOW FUTURETRY WORKS ═══════════════ */}
        <HowItWorks />

      </div>

      {/* ═══════════════ CHOOSE YOUR WORLD (full width) ═══════════════ */}
      <ChooseYourWorld />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ═══════════════ ROW 1: EDUKATIPS & PORTAL LOGIN ═══════════════ */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ── Left Column (Edukatips & #AwasSalahJalur) ── */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            
            {/* Edukatips & #AwasSalahJalur */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                
                {/* Column 1: Edukatips */}
                <div className="pt-2 md:pt-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0066ae]">
                      EDUKA<span className="text-[#ff75b8]">TIPS</span>
                    </span>
                  </div>
                  <Link href="/futurepath" className="inline-flex items-start min-h-[44px] block group mt-2 py-1">
                    <h2 className="text-sm sm:text-base font-bold text-[#063b66] group-hover:text-[#0066ae] transition line-clamp-2 leading-snug">
                      8 Tips Memilih Antara Beasiswa Bisnis (PPBP) &amp; Teknologi (PPTI)
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    Ketahui perbedaan fokus pembelajaran intensif, kultur kerja perbankan digital, tantangan nyata di divisi IT vs Bisnis BCA, dan bagaimana menyesuaikan dengan minat karier jangka panjangmu.
                  </p>
                  <Link
                    href="/futurepath"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0066ae] hover:text-[#063b66] mt-3 group min-h-[44px]"
                  >
                    Pelajari selengkapnya <ChevronRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

                {/* Column 2: #AwasSalahJalur */}
                <div className="pt-6 md:pt-0 md:pl-8">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-5 h-5 text-[#00c8eb]" />
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0066ae]">
                      #AWAS<span className="text-[#00c8eb]">SALAHJALUR</span>
                    </span>
                  </div>
                  <Link href="/world" className="inline-flex items-start min-h-[44px] block group mt-2 py-1">
                    <h2 className="text-sm sm:text-base font-bold text-[#063b66] group-hover:text-[#0066ae] transition line-clamp-2 leading-snug">
                      #AwasSalahJalur Kenali Potensi Nyata Sebelum Menentukan Jurusan
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    Bukan skor tes yang menentukan kariermu, melainkan rasa senang saat menyelesaikan tantangan. Coba simulasi misi kerja nyata 5 menit tanpa rasa takut gagal atau salah langkah.
                  </p>
                  <Link
                    href="/world"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0066ae] hover:text-[#063b66] mt-3 group min-h-[44px]"
                  >
                    Coba simulasi misi <ChevronRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {/* ── Right Column: Portal Login / Akses Masuk ── */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full">
              
              <div>
                {/* Header */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#f0f7fd] text-[#0066ae] text-xs font-bold mb-2">
                    BCA ID / PORTAL AKSES
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#063b66] tracking-tight">
                    Mulai Eksplorasi
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Masuk untuk menyimpan progres misi &amp; mencetak <strong>Future Card</strong> milikmu.
                  </p>
                </div>

                {statusMsg && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                    {statusMsg}
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleStart} className="mt-5 space-y-5">
                  <div>
                    <label htmlFor="explorer-name" className="block text-xs font-bold text-[#063b66] mb-1.5">
                      BCA ID / Nama Explorer
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                      </div>
                      <input
                        id="explorer-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Santoso / Siswa SMA"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0066ae] focus:ring-1 focus:ring-[#0066ae] transition bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="explorer-track" className="block text-xs font-bold text-[#063b66]">
                        Jalur Pilihan / Kata Sandi Minat
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowRoleInfo(!showRoleInfo)}
                        className="text-[11px] text-[#0066ae] hover:underline flex items-center gap-1 min-h-[44px] px-1"
                      >
                        {showRoleInfo ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showRoleInfo ? "Tutup Info" : "Lihat Info"}
                      </button>
                    </div>
                    <select
                      id="explorer-track"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0066ae] focus:ring-1 focus:ring-[#0066ae] transition bg-white text-[#062b4c]"
                    >
                      <option value="ALL">Eksplorasi Semua Jalur (Rekomendasi)</option>
                      <option value="PPTI">Teknologi Informasi &amp; Digital (PPTI)</option>
                      <option value="PPBP">Bisnis &amp; Perbankan Finansial (PPBP)</option>
                    </select>

                    {showRoleInfo && (
                      <p className="mt-2 text-[11px] text-slate-500 bg-[#f0f7fd] p-2.5 rounded-lg border border-[#0066ae]/15 leading-relaxed">
                        💡 Kamu bebas mengubah pilihan jalur kapan saja di dalam peta atau mencoba misi dari divisi lain tanpa batasan.
                      </p>
                    )}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center justify-between text-xs pt-1 text-[#0066ae]">
                    <Link href="/world" className="inline-flex items-center min-h-[44px] hover:underline font-semibold">
                      Lupa Progres?
                    </Link>
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      className="inline-flex items-center min-h-[44px] hover:underline font-semibold text-slate-500 hover:text-rose-600 transition"
                    >
                      Reset Simulasi
                    </button>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#0066ae] hover:bg-[#063b66] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0066ae]/20 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Mulai Eksplorasi (Login)
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-slate-500">
                  Belum punya progres?{" "}
                  <Link href="/world" className="inline-flex items-center min-h-[44px] font-bold text-[#0066ae] hover:underline">
                    Mulai Langsung Tanpa Akun
                  </Link>
                </div>
              </div>

              {/* Bottom Yellow Alert Notice Box (myBCA style) */}
              <div className="mt-6 rounded-xl bg-[#fff8e5] border border-[#fde199] p-3.5 text-xs text-[#8a6405] flex items-start gap-3">
                <AlertCircle size={18} className="text-[#d97706] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p>
                    Simulasi FutureTry <strong>100% bebas skor &amp; tanpa benar-salah</strong>. Coba berbagai skenario kerja perbankan untuk menemukan peran yang paling kamu sukai.
                  </p>
                  <Link href="/futurepath" className="inline-flex items-center min-h-[44px] font-bold text-[#b45309] hover:underline mt-1">
                    Pelajari selengkapnya.
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ═══════════════ ROW 2: QUICK ACTION BAR (Bottom Pills) ═══════════════ */}
        <div className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                icon: <Phone size={18} />,
                label: "Halo BCA 1500888",
                href: "tel:1500888",
                isExternal: true,
              },
              {
                icon: <MessageCircle size={18} />,
                label: "WhatsApp BCA",
                href: "https://wa.me/628111500998",
                isExternal: true,
              },
              {
                icon: <Building2 size={18} />,
                label: "Solusi BCA",
                href: "https://www.bca.co.id",
                isExternal: true,
              },
              {
                icon: <Globe size={18} />,
                label: "Website bca.co.id",
                href: "https://www.bca.co.id",
                isExternal: true,
              },
              {
                icon: <GraduationCap size={18} />,
                label: "Beasiswa PPBP/PPTI",
                href: "/futurepath",
                isExternal: false,
              },
              {
                icon: <Compass size={18} />,
                label: "Future World Map",
                href: "/world",
                isExternal: false,
              },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.href}
                target={action.isExternal ? "_blank" : undefined}
                rel={action.isExternal ? "noopener noreferrer" : undefined}
                className="group rounded-2xl bg-white p-3.5 sm:p-4 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-[#00c8eb] hover:-translate-y-0.5 transition flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#f0f7fd] group-hover:bg-[#0066ae] text-[#0066ae] group-hover:text-white transition flex items-center justify-center shrink-0">
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-[13px] text-[#063b66] group-hover:text-[#0066ae] transition truncate">
                    {action.label}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ═══════════════ ROW 3: WHAT DO YOU WANT TO TRY FIRST ═══════════════ */}
        <div className="pt-8 sm:pt-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono text-xs font-bold tracking-widest text-[#0066ae] uppercase">
              Pintu Eksplorasi
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#063b66] mt-1.5">
              What do you want to <span className="text-brand-gradient">try first?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Lima pintu masuk berdasarkan rasa penasaran — bukan tes kepribadian, bebas dijelajahi sesukamu.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "Solve a problem", desc: "Kasus nyata & keputusan kritis", to: "/world" },
              { label: "Build something", desc: "Dari baris kode jadi aplikasi", to: "/world" },
              { label: "Understand people", desc: "Nasabah, tim, & interaksi manusia", to: "/world" },
              { label: "Make a decision", desc: "Pilih di tengah ketidakpastian", to: "/world" },
              { label: "Work with data", desc: "Angka yang bercerita & pola tren", to: "/world" },
            ].map((c) => (
              <Link
                key={c.label}
                href={c.to}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-[#00c8eb] hover:shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-[#063b66] text-sm sm:text-base group-hover:text-[#0066ae] transition">
                    {c.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-snug">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#0066ae] opacity-0 group-hover:opacity-100 transition">
                  Mulai misi <ChevronRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══════════════ ROW 4: MEET THE GUIDES ═══════════════ */}
        <div className="pt-8 sm:pt-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono text-xs font-bold tracking-widest text-[#0066ae] uppercase">
              Mentor Simulasi
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#063b66] mt-1.5">
              Meet your guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Lima karakter dengan lima sudut pandang kerja. Mereka pembuka percakapan untuk membantumu menemukan minatmu.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {characters.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 hover:shadow-md hover:border-[#00c8eb] hover:-translate-y-1 transition flex flex-col justify-between"
              >
                <div>
                  <div
                    className="grid place-items-center w-12 h-12 rounded-2xl text-white font-extrabold mb-3 shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${c.accent}, #063b66)` }}
                  >
                    {c.emojiSeed}
                  </div>
                  <p className="font-bold text-[#063b66] text-sm sm:text-base">{c.name}</p>
                  <p className="text-[11px] font-mono text-[#00c8eb] font-semibold">{c.field} · {c.program}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3 italic">
                    “{c.message}”
                  </p>
                </div>
                <Link
                  href="/world"
                  className="mt-4 pt-3 pb-1 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0066ae] hover:text-[#063b66] min-h-[44px]"
                >
                  <span>Ikuti misi {c.name}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ ROW 5: 3 PILLARS (EXPERIENCE · REFLECT · ACT) ═══════════════ */}
        <div className="pt-8">
          <div className="rounded-2xl sm:rounded-3xl bg-[#063b66] text-white p-8 sm:p-12 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Compass size={24} />,
                  step: "01",
                  title: "Experience",
                  body: "Jalankan misi 5–15 menit yang diadaptasi dari skenario kerja riil divisi IT dan Bisnis BCA.",
                },
                {
                  icon: <MessagesSquare size={24} />,
                  step: "02",
                  title: "Reflect",
                  body: "Ceritakan apa yang kamu sukai dan apa yang menantang. Tidak ada skor atau ranking.",
                },
                {
                  icon: <Route size={24} />,
                  step: "03",
                  title: "Act",
                  body: "Dapatkan Future Card, tanyakan langsung ke chatbot AI, dan mantapkan pilihan beasiswamu.",
                },
              ].map((c) => (
                <div key={c.title} className="relative">
                  <p className="font-mono text-xs text-[#8debfa] font-bold mb-2 tracking-widest">{c.step}</p>
                  <div className="text-[#00c8eb] mb-3">{c.icon}</div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════ ROW 6: PREVIEW CARDS ═══════════════ */}
        <div className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href="/world"
              className="group rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:shadow-md hover:border-[#00c8eb] transition"
            >
              <div className="h-28 bg-[#063b66] grid place-items-center">
                <MapIcon className="text-white/90" size={28} />
              </div>
              <div className="p-5">
                <p className="font-bold text-[#063b66] group-hover:text-[#0066ae] transition">
                  Future World Map
                </p>
                <p className="text-xs text-slate-500 mt-1">Jelajahi distrik, buka checkpoint, dan coba misi interaktif.</p>
              </div>
            </Link>

            <Link
              href="/stories"
              className="group rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:shadow-md hover:border-[#00c8eb] transition"
            >
              <div className="h-28 bg-[#0066ae] grid place-items-center">
                <MessagesSquare className="text-white/90" size={28} />
              </div>
              <div className="p-5">
                <p className="font-bold text-[#063b66] group-hover:text-[#0066ae] transition">
                  Real Awardee Stories
                </p>
                <p className="text-xs text-slate-500 mt-1">Ekspektasi vs realita beasiswa, diceritakan langsung oleh mahasiswa.</p>
              </div>
            </Link>

            <Link
              href="/futurepath"
              className="group rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:shadow-md hover:border-[#00c8eb] transition"
            >
              <div className="h-28 bg-[#00c8eb] grid place-items-center">
                <Route className="text-white/90" size={28} />
              </div>
              <div className="p-5">
                <p className="font-bold text-[#063b66] group-hover:text-[#0066ae] transition">
                  FuturePath &amp; Persyaratan
                </p>
                <p className="text-xs text-slate-500 mt-1">Info resmi syarat pendaftaran, fasilitas, dan jadwal seleksi.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ═══════════════ ROW 7: FINAL CTA ═══════════════ */}
        <div className="py-12 sm:py-16 text-center max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold text-[#063b66] leading-tight">
            Your future doesn&apos;t have to be<br />
            <span className="text-brand-gradient">decided today.</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3">
            Tetapi kamu bisa mulai mencobanya hari ini.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/world"
              className="px-7 py-3.5 rounded-full bg-[#0066ae] hover:bg-[#063b66] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0066ae]/20 transition -translate-y-px"
            >
              MULAI EKSPLORASI SEKARANG
            </Link>
            <Link
              href="/futurepath"
              className="px-7 py-3.5 rounded-full border border-slate-300 text-[#063b66] font-bold text-xs sm:text-sm hover:border-[#0066ae] hover:text-[#0066ae] transition"
            >
              CEK PERSYARATAN BEASISWA
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
