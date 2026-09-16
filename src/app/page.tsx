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

const guidePositions = [
  { x: 30, cropX: 24 },
  { x: 40, cropX: 37 },
  { x: 50, cropX: 50 },
  { x: 60, cropX: 63 },
  { x: 71, cropX: 77 },
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
    <section className="relative scroll-mt-24">
      {/* Decorative accessory on the right */}
      <img
        src="/journey-accessory.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20 z-0 hidden select-none md:block sm:-bottom-40 sm:-right-32 w-96 xl:w-[560px]"
      />
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center mb-14">
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-[40px] font-semibold text-[#005cab]">
          Kenali masa depanmu melalui pengalaman langsung
        </h2>
      </div>

      {/* Route / Journey */}
      <div ref={lineRef} className="relative">
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
        <div className="relative grid grid-cols-5 gap-2 sm:gap-4">
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
  const [activeGuide, setActiveGuide] = useState<number | null>(null);

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

      {/* Full-screen hero */}
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
          <img
            src="/main-logo.svg"
            alt="BCA FutureTry"
            className="w-full max-w-[806px] object-contain drop-shadow-lg px-8"
          />
          <Link
            href="/world"
            className="-skew-x-12 mt-8 inline-flex items-center px-8 py-2.5 border border-[#0066ae] bg-white/60 backdrop-blur-sm text-[#0066ae] hover:bg-[#0066ae] hover:text-white transition-colors duration-200"
          >
            <span className="skew-x-12 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm sm:text-base font-extrabold tracking-[0.25em] uppercase">
              Coba Sekarang
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

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">

        {/* How FutureTry works */}
        <HowItWorks />

      </div>

      {/* Choose Your World */}
      <ChooseYourWorld />

      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-4 pt-16 sm:px-6 lg:space-y-24 lg:pb-12 lg:pt-24">

        {/* Edukatips and portal login */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          
          {/* Edukatips and #AwasSalahJalur */}
          <div className="grid h-full gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
            <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
              <div>
                <span className="text-base font-extrabold tracking-tight text-[#0066ae] sm:text-lg">
                  EDUKA<span className="text-[#ff75b8]">TIPS</span>
                </span>
                <Link href="/futurepath" className="group mt-3 block">
                  <h2 className="text-lg font-bold leading-snug text-[#063b66] transition-colors group-hover:text-[#0066ae] sm:text-xl">
                    8 Tips Memilih Beasiswa PPBP atau PPTI
                  </h2>
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Bandingkan fokus belajar, kultur kerja, dan tantangan nyata di jalur bisnis maupun teknologi agar pilihanmu terasa lebih mantap.
                </p>
              </div>
              <Link href="/futurepath" className="group mt-5 inline-flex w-fit items-center gap-1 text-sm font-bold text-[#0066ae] hover:text-[#063b66]">
                Baca tipsnya <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>

            <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-[#00c8eb]" />
                  <span className="text-base font-extrabold tracking-tight text-[#0066ae] sm:text-lg">
                    #AWAS<span className="text-[#00c8eb]">SALAHJALUR</span>
                  </span>
                </div>
                <Link href="/world" className="group mt-3 block">
                  <h2 className="text-lg font-bold leading-snug text-[#063b66] transition-colors group-hover:text-[#0066ae] sm:text-xl">
                    Kenali Potensimu Sebelum Menentukan Jurusan
                  </h2>
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Coba misi kerja singkat tanpa takut salah. Perhatikan tantangan mana yang paling membuatmu penasaran dan menikmati prosesnya.
                </p>
              </div>
              <Link href="/world" className="group mt-5 inline-flex w-fit items-center gap-1 text-sm font-bold text-[#0066ae] hover:text-[#063b66]">
                Coba simulasinya <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          </div>

          {/* Portal login */}
          <div className="flex flex-col">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              
              <div>
                {/* Header */}
                <div className="border-b border-slate-100 pb-4">
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
                <form onSubmit={handleStart} className="mt-5 space-y-4">
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
                        className="text-[11px] text-[#0066ae] hover:underline flex items-center gap-1"
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
                        Info: Kamu bebas mengubah pilihan jalur kapan saja di dalam peta atau mencoba misi dari divisi lain tanpa batasan.
                      </p>
                    )}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center justify-between text-xs pt-1 text-[#0066ae]">
                    <Link href="/world" className="hover:underline font-semibold">
                      Lupa Progres?
                    </Link>
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      className="hover:underline font-semibold text-slate-500 hover:text-rose-600 transition"
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
                  <Link href="/world" className="font-bold text-[#0066ae] hover:underline">
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
                  <Link href="/futurepath" className="font-bold text-[#b45309] hover:underline mt-1 inline-block">
                    Pelajari selengkapnya.
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Meet the guides */}
        <div>
          <div className="relative left-1/2 aspect-[16/10] w-screen -translate-x-1/2 overflow-hidden bg-[#f4f7fb]">
            <img
              src="/meet-your-guides.png"
              alt="Lima guide FutureTry di depan lingkungan belajar"
              loading="lazy"
              className={`absolute inset-x-0 bottom-0 h-auto w-full transition duration-500 ease-out ${
                activeGuide === null
                  ? "scale-100 opacity-[0.58] saturate-[0.8]"
                  : "scale-[1.025] opacity-[0.28] blur-[7px] saturate-[0.65]"
              }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-white/10" aria-hidden />

            <div
              className="absolute inset-x-0 top-0 z-20 h-[48%] px-4 pt-8 sm:px-6 sm:pt-12"
              style={{
                background:
                  "linear-gradient(to bottom, #f4f7fb 0%, rgba(244,247,251,0.98) 24%, rgba(244,247,251,0.82) 48%, rgba(244,247,251,0.42) 72%, rgba(244,247,251,0) 100%)",
              }}
            >
              <div className="mx-auto max-w-7xl text-center">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[#005cab] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] sm:text-[42px] lg:text-5xl">
                  Kenalan dengan para guide-mu
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#063b66]/80 sm:text-base">
                  Mereka akan menemanimu melihat dunia bisnis dan teknologi dari sudut pandang yang berbeda.
                </p>
              </div>
            </div>

            {activeGuide !== null && (
              <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 h-[62%] w-[280px] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-2xl sm:bottom-10 sm:w-[360px]">
                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: 'url("/meet-your-guides.png")',
                    backgroundPosition: `${guidePositions[activeGuide].cropX}% 72%`,
                    backgroundSize: "430% auto",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#063b66]/95 via-[#063b66]/55 to-transparent px-5 pb-5 pt-16 text-white">
                  <p className="font-[family-name:var(--font-display)] text-xl font-bold">
                    {characters[activeGuide].name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/80">
                    {characters[activeGuide].field} / {characters[activeGuide].program}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 z-40 hidden lg:block">
              {characters.map((guide, index) => (
                <button
                  key={guide.id}
                  type="button"
                  aria-label={`Lihat detail ${guide.name}`}
                  onMouseEnter={() => setActiveGuide(index)}
                  onMouseLeave={() => setActiveGuide(null)}
                  onFocus={() => setActiveGuide(index)}
                  onBlur={() => setActiveGuide(null)}
                  className="group absolute bottom-[5%] h-[58%] w-[9%] -translate-x-1/2 cursor-zoom-in rounded-[45%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066ae]"
                  style={{ left: `${guidePositions[index].x}%` }}
                >
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#063b66] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {guide.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience, Reflect, Act */}
        <div>
          <div className="rounded-2xl sm:rounded-3xl bg-[#063b66] text-white p-8 sm:p-12 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Compass size={24} />,
                  step: "01",
                  title: "Experience",
                  body: "Jalankan misi 5-15 menit yang diadaptasi dari skenario kerja riil divisi IT dan Bisnis BCA.",
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

        {/* Preview cards */}
        <div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href="/world"
              className="group rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:shadow-md hover:border-[#00c8eb] transition"
            >
              <div className="h-28 bg-gradient-to-br from-[#063b66] via-[#0066ae] to-[#00c8eb] grid place-items-center">
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
              <div className="h-28 bg-gradient-to-br from-[#0066ae] via-[#00c8eb] to-[#8debfa] grid place-items-center">
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
              <div className="h-28 bg-gradient-to-br from-[#00c8eb] via-[#19d9f5] to-[#ff75b8]/70 grid place-items-center">
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

        {/* Final CTA */}
        <div className="mx-auto max-w-3xl text-center">
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
