"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { progressSummary } from "@/lib/progress";
import { useJourney } from "./JourneyProvider";

const links = [
  { href: "/", label: "BERANDA" },
  { href: "/world", label: "EKSPLORASI MISI" },
  { href: "/stories", label: "CERITA AWARDEE" },
  { href: "/futurepath", label: "FUTUREPATH (BEASISWA)" },
];

function FlagID() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" className="rounded-[2px] shadow-sm">
      <rect width="16" height="6" fill="#ce1126" />
      <rect y="6" width="16" height="6" fill="#fff" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { progress } = useJourney();
  const { done, total } = progressSummary(progress);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-6xl px-4 h-[68px] flex items-center justify-between gap-4" aria-label="Navigasi utama">
        {/* Logo kiri: chip BCA + FutureTry biru */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid place-items-center h-9 rounded-lg bg-bcadark text-white text-[11px] font-extrabold px-2 font-[family-name:var(--font-display)] tracking-tight">BCA</span>
          <span className="font-[family-name:var(--font-display)] font-bold text-bcadark text-lg leading-none">
            FutureTry
          </span>
        </Link>

        {/* Menu uppercase biru */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`relative px-3 py-2 text-[12px] font-bold tracking-wide transition ${
                pathname === l.href ? "text-bcadark" : "text-navy/70 hover:text-bcadark"
              }`}>
              {l.label}
              {pathname === l.href && <span className="absolute left-3 right-3 -bottom-px h-[3px] rounded-full bg-bcadark" />}
            </Link>
          ))}
        </div>

        {/* Kanan: MULAI SEKARANG pill + ID flag */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {done > 0 && (
            <span className="text-xs font-mono text-navy/50" title={`${done} dari ${total} misi selesai`}>{done}/{total} ✓</span>
          )}
          <Link href="/world" className="px-5 py-2 rounded-full border-[1.5px] border-skyblue text-bcadark text-[12px] font-bold hover:bg-bcadark hover:text-white hover:border-bcadark transition">
            MULAI SEKARANG
          </Link>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-navy/15 text-navy text-xs font-bold hover:border-bcadark transition" aria-label="Bahasa Indonesia">
            <FlagID /> ID
          </button>
        </div>

        {/* Mobile */}
        <button className="lg:hidden p-2 text-navy" onClick={() => setOpen(!open)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide ${pathname === l.href ? "text-bcadark bg-bcadark/5" : "text-navy/70"}`}>
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <Link href="/world" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-full border-[1.5px] border-skyblue text-bcadark text-[12px] font-bold">
              MULAI SEKARANG
            </Link>
            <span className="flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-navy/15 text-navy text-xs font-bold"><FlagID /> ID</span>
          </div>
        </div>
      )}
    </header>
  );
}
