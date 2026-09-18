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
  AlertCircle,
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
  { icon: Users, title: "Connect", desc: "Lihat template pengalaman" },
  { icon: ArrowRight, title: "Act", desc: "Tentukan langkahmu" },
];

const guidePositions = [
  { x: 27, image: "/guides/fino.png" },
  { x: 37, image: "/guides/elia.png" },
  { x: 50, image: "/guides/seno.png" },
  { x: 63, image: "/guides/esha.png" },
  { x: 75, image: "/guides/adit.png" },
];

const carouselImages = [
  { src: "/carousel/ryn-8659.jpg", alt: "Keseruan peserta dalam kegiatan FutureTry" },
  { src: "/carousel/img-9121.jpg", alt: "Peserta FutureTry mengikuti kegiatan bersama" },
  { src: "/carousel/dscf5220.jpg", alt: "Momen peserta selama rangkaian FutureTry" },
  { src: "/carousel/dscf5441.jpg", alt: "Suasana kegiatan peserta FutureTry" },
  { src: "/carousel/dscf5332.jpg", alt: "Kolaborasi peserta dalam kegiatan FutureTry" },
  { src: "/carousel/dsc-9428.jpg", alt: "Pengalaman peserta bersama FutureTry" },
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
          Pengalaman interaktif untuk menjelajahi peran, menyelesaikan misi, melihat cerita
          ilustratif, dan memahami rancangan langkah berikutnya.
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

function PhotoCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame = 0;
    let previousTime = performance.now();
    let initialized = false;
    let scrollPosition = 0;

    const animate = (time: number) => {
      const elapsed = Math.min(time - previousTime, 50);
      const firstImage = scroller.children[0] as HTMLElement | undefined;
      const middleCopy = scroller.children[carouselImages.length] as HTMLElement | undefined;
      const finalCopy = scroller.children[carouselImages.length * 2] as HTMLElement | undefined;
      const loopWidth = middleCopy && finalCopy ? finalCopy.offsetLeft - middleCopy.offsetLeft : 0;

      if (!initialized && firstImage && middleCopy && loopWidth) {
        scrollPosition = middleCopy.offsetLeft - firstImage.offsetLeft;
        scroller.scrollLeft = scrollPosition;
        initialized = true;
      }

      if (initialized) {
        scrollPosition += elapsed * 0.04;
        if (scrollPosition >= loopWidth * 2) scrollPosition -= loopWidth;
        scroller.scrollLeft = scrollPosition;
      }

      previousTime = time;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section
      className="relative left-1/2 w-screen -translate-x-1/2 py-8 sm:py-12"
      aria-label="Galeri kegiatan FutureTry"
    >
      <div
        ref={scrollerRef}
        className="carousel-scroller pointer-events-none flex gap-3 overflow-hidden px-4 sm:gap-5 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2))]"
      >
        {[...carouselImages, ...carouselImages, ...carouselImages].map((image, index) => {
          const duplicate = index < carouselImages.length || index >= carouselImages.length * 2;
          return (
            <figure
              key={`${image.src}-${Math.floor(index / carouselImages.length)}`}
              aria-hidden={duplicate || undefined}
              className="relative aspect-[3/2] w-[63vw] max-w-[390px] shrink-0 overflow-hidden bg-[#dcecf6] shadow-[0_18px_50px_-28px_rgba(6,59,102,0.55)]"
            >
              <img
                src={image.src}
                alt={duplicate ? "" : image.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
              <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" />
            </figure>
          );
        })}
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
        <h1 className="sr-only">BCA FutureTry — coba pengalaman PPBP dan PPTI sebelum menentukan pilihan</h1>
        {/* Shift upward slightly to trim excess sky and keep the hero compact. */}
        <img
          src="/hero-bg.png"
          alt="BCA FutureTry"
          className="relative -mt-[clamp(48px,10vw,160px)] block h-auto w-full"
        />
        <FallingLeaves />
        {/* Center Main Logo */}
        <div className="absolute inset-x-0 top-[8%] flex flex-col items-center">
          <img
            src="/main-logo.svg"
            alt="BCA FutureTry"
            className="w-full max-w-[806px] object-contain drop-shadow-lg px-8"
          />
          <Link
            href="/world"
            className="-skew-x-12 mt-8 inline-flex min-h-11 items-center px-8 py-2.5 border border-[#0066ae] bg-white/75 backdrop-blur-sm text-[#0066ae] hover:bg-[#0066ae] hover:text-white transition-colors duration-200"
          >
            <span className="skew-x-12 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm sm:text-base font-extrabold tracking-[0.25em] uppercase">
              Coba Sekarang
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
        </div>
        {/* Gradient transition at the bottom of the image into the page background */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[32rem] sm:h-[38rem]"
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

      <div className="mx-auto max-w-7xl space-y-16 px-4 pt-16 sm:px-6 lg:space-y-24 lg:pt-24">

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
                    PROFIL SIMULASI
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#063b66] tracking-tight">
                    Mulai Eksplorasi
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Personalisasi perjalananmu. Progress hanya disimpan di browser perangkat ini.
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
                      Nama panggilan
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
                        Jalur yang ingin dieksplorasi
                      </label>
                      <button type="button" onClick={() => setShowRoleInfo(!showRoleInfo)} className="flex min-h-11 items-center px-2 text-xs font-semibold text-[#0066ae] hover:underline">
                        {showRoleInfo ? "Tutup info" : "Tentang pilihan jalur"}
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

                  <div className="flex items-center justify-end pt-1 text-xs text-[#0066ae]">
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      className="min-h-11 px-2 hover:underline font-semibold text-slate-500 hover:text-rose-600 transition"
                    >
                      Reset Simulasi
                    </button>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#0066ae] hover:bg-[#063b66] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0066ae]/20 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Mulai Eksplorasi
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-slate-500">
                  Tidak ingin mengisi profil?{" "}
                  <Link href="/world" className="inline-flex min-h-11 items-center px-2 font-bold text-[#0066ae] hover:underline">
                    Lewati dan mulai langsung
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

        <PhotoCarousel />

        {/* Meet the guides */}
        <div>
          <div className="relative left-1/2 h-[620px] w-screen -translate-x-1/2 overflow-hidden bg-[#f4f7fb] sm:aspect-[16/10] sm:h-auto">
            <img
              src="/meet-your-guides.png"
              alt="Lima guide FutureTry di depan lingkungan belajar"
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 sm:inset-x-0 sm:bottom-0 sm:top-auto sm:h-auto sm:object-contain ${
                activeGuide === null
                  ? "scale-100 opacity-100 saturate-100"
                  : "scale-[1.02] opacity-20 blur-[3px] saturate-50"
              }`}
            />

              <div
              aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-10 bg-[#d9eef2]/55 transition-opacity duration-500 ${
                activeGuide === null ? "opacity-0" : "opacity-55"
              }`}
            />

            <div
              className="absolute inset-x-0 top-0 z-50 h-[42%] px-4 pt-8 sm:px-6 sm:pt-12"
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
              <>
                <img
                  key={guidePositions[activeGuide].image}
                  src={guidePositions[activeGuide].image}
                  alt={characters[activeGuide].name}
                  className="guide-character-reveal pointer-events-none absolute top-[28%] z-30 h-[72%] w-[48%] object-contain object-bottom sm:h-[74%] sm:w-[40%]"
                  style={{ left: `${guidePositions[activeGuide].x}%`, transform: "translateX(-50%)" }}
                />
                <div
                  className="guide-info-reveal pointer-events-none absolute bottom-5 z-40 w-[min(78vw,280px)] -translate-x-1/2 rounded-2xl border border-white/90 bg-white/90 p-4 text-[#063b66] shadow-xl backdrop-blur-md sm:bottom-8 sm:w-[min(26vw,300px)] sm:p-5"
                  style={{ left: `${guidePositions[activeGuide].x}%` }}
                  role="status"
                  aria-live="polite"
                >
                  <span className="inline-flex rounded-full bg-[#0066ae] px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-white">
                    {characters[activeGuide].program}
                  </span>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
                    {characters[activeGuide].name}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-[#0066ae] sm:text-base">
                    {characters[activeGuide].field}
                  </p>
                </div>
              </>
            )}

            <div className="absolute inset-0 z-40 hidden lg:block">
              {characters.map((guide, index) => (
                <button
                  key={guide.id}
                  type="button"
                  aria-label={`Lihat detail ${guide.name}`}
                  onMouseEnter={() => setActiveGuide(index)}
                  onMouseLeave={(event) => {
                    if (document.activeElement !== event.currentTarget) setActiveGuide(null);
                  }}
                  onFocus={() => setActiveGuide(index)}
                  onBlur={() => setActiveGuide(null)}
                  onClick={() => router.push(`/world?guide=${guide.id}`)}
                  className="group absolute bottom-[5%] h-[58%] w-[9%] -translate-x-1/2 cursor-pointer rounded-[45%] bg-white/0 transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
                  style={{ left: `${guidePositions[index].x}%` }}
                >
                </button>
              ))}
            </div>
            <div className="absolute inset-x-4 bottom-4 z-40 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Pilih guide">
              {characters.map((guide, index) => (
                <button key={guide.id} type="button" onClick={() => router.push(`/world?guide=${guide.id}`)} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold shadow-sm transition-colors ${activeGuide === index ? "border-[#0066ae] bg-[#0066ae] text-white" : "border-white/80 bg-white/90 text-[#063b66]"}`} aria-pressed={activeGuide === index}>{guide.name}</button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
