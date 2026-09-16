"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { progressSummary } from "@/lib/progress";
import { useJourney } from "./JourneyProvider";

const links = [
  { href: "/", label: "BERANDA" },
  { href: "/world", label: "EKSPLORASI MISI" },
  { href: "/stories", label: "CERITA AWARDEE" },
  { href: "/futurepath", label: "FUTUREPATH (BEASISWA)" },
];

function FlagUS({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} rounded-full shadow-xs shrink-0`} aria-hidden="true">
      <mask id="us-mask">
        <circle cx="12" cy="12" r="12" fill="#fff" />
      </mask>
      <g mask="url(#us-mask)">
        <rect width="24" height="24" fill="#b91c1c" />
        <path d="M0 3.7h24M0 7.4h24M0 11.1h24M0 14.8h24M0 18.5h24M0 22.2h24" stroke="#fff" strokeWidth="1.85" />
        <rect width="11" height="13" fill="#1d4ed8" />
        <circle cx="3" cy="3.5" r="0.8" fill="#fff" />
        <circle cx="8" cy="3.5" r="0.8" fill="#fff" />
        <circle cx="5.5" cy="6.5" r="0.8" fill="#fff" />
        <circle cx="3" cy="9.5" r="0.8" fill="#fff" />
        <circle cx="8" cy="9.5" r="0.8" fill="#fff" />
      </g>
    </svg>
  );
}

function FlagID({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} rounded-full shadow-xs shrink-0 border border-slate-200/90 overflow-hidden`} aria-hidden="true">
      <mask id="id-mask">
        <circle cx="12" cy="12" r="12" fill="#fff" />
      </mask>
      <g mask="url(#id-mask)">
        <rect width="24" height="12" fill="#dc2626" />
        <rect y="12" width="24" height="12" fill="#ffffff" />
      </g>
    </svg>
  );
}

function FlagZH({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} rounded-full shadow-xs shrink-0`} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#de2910" />
      <polygon points="6,3.5 7.1,6.8 10.5,6.8 7.8,8.8 8.8,12 6,10 3.2,12 4.2,8.8 1.5,6.8 4.9,6.8" fill="#ffde00" transform="translate(0.5, 0.5) scale(0.75)" />
      <circle cx="11" cy="4.5" r="0.75" fill="#ffde00" />
      <circle cx="12.5" cy="6.5" r="0.75" fill="#ffde00" />
      <circle cx="12.5" cy="9" r="0.75" fill="#ffde00" />
      <circle cx="11" cy="11" r="0.75" fill="#ffde00" />
    </svg>
  );
}

const languages = [
  { code: "id", short: "ID", label: "Bahasa Indonesia", flag: <FlagID className="w-5 h-5" /> },
  { code: "en", short: "EN", label: "English", flag: <FlagUS className="w-5 h-5" /> },
  { code: "zh", short: "ZH", label: "中文（简体）", flag: <FlagZH className="w-5 h-5" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [homeNavRevealed, setHomeNavRevealed] = useState(false);
  const { progress } = useJourney();
  const { done, total } = progressSummary(progress);
  const isHome = pathname === "/";
  const navVisible = !isHome || homeNavRevealed;

  useEffect(() => {
    if (!isHome) {
      setHomeNavRevealed(false);
      return;
    }

    setHomeNavRevealed(window.scrollY > 24);
    const revealNavbar = () => {
      if (window.scrollY > 24) setHomeNavRevealed(true);
    };

    window.addEventListener("scroll", revealNavbar, { passive: true });
    return () => window.removeEventListener("scroll", revealNavbar);
  }, [isHome]);

  return (
    <header
      className={`sticky top-0 z-50 w-full select-none transition duration-300 ease-out ${
        navVisible ? "translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-full opacity-0"
      }`}
      aria-hidden={!navVisible}
      inert={!navVisible}
    >
      {/* ── Geometric Winged Background Shape (Miru / Anime console style) ── */}
      <div className="absolute inset-0 w-full h-[68px] flex pointer-events-none filter drop-shadow-xs">
        
        {/* Left Wing */}
        <svg
          className="w-16 sm:w-24 md:w-28 h-[68px] shrink-0"
          viewBox="0 0 100 68"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0 H100 V68 H80 C55 68 55 34 30 34 H0 Z"
            fill="#ffffff"
          />
          <path d="M0 0.75 H100" stroke="#0066ae" strokeWidth="1.5" />
          <path
            d="M0 34 H30 C55 34 55 68 80 68 H100"
            stroke="#0066ae"
            strokeWidth="1.5"
          />
        </svg>

        {/* Center Extensible Bar */}
        <div className="flex-1 bg-white border-t-[1.5px] border-b-[1.5px] border-[#0066ae] h-[68px]" />

        {/* Right Wing */}
        <svg
          className="w-16 sm:w-24 md:w-28 h-[68px] shrink-0"
          viewBox="0 0 100 68"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0 H100 V34 H70 C45 34 45 68 20 68 H0 Z"
            fill="#ffffff"
          />
          <path d="M0 0.75 H100" stroke="#0066ae" strokeWidth="1.5" />
          <path
            d="M0 68 H20 C45 68 45 34 70 34 H100"
            stroke="#0066ae"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* ── Foreground Navigation Content ── */}
      <nav
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 h-[68px] flex items-center justify-between"
        aria-label="Navigasi utama"
      >
        {/* Main Logo from User Assets */}
        <Link href="/" className="shrink-0 flex items-center pr-2 transition-opacity hover:opacity-85">
          <Image
            src="/horizontal-logo.png"
            alt="BCA FutureTry"
            width={320}
            height={79}
            priority
            unoptimized
            className="h-[38px] sm:h-[42px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu without Dots & with Balanced Font Weight */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative flex min-h-11 items-center py-2 group"
              >
                <span
                  className={`block tracking-wide text-xs xl:text-[13px] transition-colors duration-150 ${
                    isActive ? "text-[#0066ae] font-bold" : "text-[#063b66] font-medium group-hover:text-[#0066ae]"
                  }`}
                >
                  {l.label}
                </span>
                {/* Underline animates from left to right on hover */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#0066ae] transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right CTA / Tracker & Language Dropdown */}
        <div className="flex items-center gap-3">
          {done > 0 && (
            <span
              className="hidden md:inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#00c8eb]/10 text-[#0066ae] border border-[#00c8eb]/20"
              title={`${done} dari ${total} misi selesai`}
            >
              {done}/{total} Selesai ✓
            </span>
          )}
          
          {/* Clean BCA Pill CTA Button */}
          <Link
            href="/world"
            className="hidden min-h-11 sm:inline-flex items-center px-5 py-2 rounded-full border border-[#0066ae] text-[#0066ae] hover:bg-[#0066ae] hover:text-white font-medium text-xs tracking-wider transition-colors duration-150"
          >
            MULAI SEKARANG
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className="lg:hidden grid min-h-11 min-w-11 place-items-center rounded-full text-[#063b66] hover:bg-sky-50"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="lg:hidden border-b border-[#0066ae] bg-white px-5 py-4 space-y-1 shadow-md">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center py-2 text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-[#0066ae] font-bold border-l-2 border-[#0066ae] pl-2.5"
                    : "text-[#063b66] font-medium hover:text-[#0066ae]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/world"
              onClick={() => setOpen(false)}
              className="block text-center w-full py-2.5 rounded-full border border-[#0066ae] text-[#0066ae] hover:bg-[#0066ae] hover:text-white text-xs font-medium tracking-wider transition-colors"
            >
              MULAI SEKARANG
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
