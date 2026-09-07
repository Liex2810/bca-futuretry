"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { progressSummary } from "@/lib/progress";
import { useJourney } from "./JourneyProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/world", label: "Explore" },
  { href: "/stories", label: "Stories" },
  { href: "/futurepath", label: "FuturePath" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { progress } = useJourney();
  const { done, total } = progressSummary(progress);

  return (
    <header className="sticky top-0 z-40 glass border-b border-navy/10">
      <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between" aria-label="Navigasi utama">
        <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] font-bold tracking-tight text-navy">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-bcablue to-cyan text-white text-sm font-extrabold">FT</span>
          FUTURE<span className="text-cyan">TRY</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === l.href ? "text-bcablue bg-bcablue/10" : "text-navy/70 hover:text-navy hover:bg-navy/5"
              }`}>
              {l.label}
            </Link>
          ))}
          {done > 0 && (
            <span className="ml-2 text-xs font-mono text-navy/50" title={`${done} dari ${total} misi selesai`}>
              {done}/{total} ✓
            </span>
          )}
          <Link href="/world" className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-bcablue to-cyan text-white text-sm font-bold shadow-md shadow-cyan/25 hover:shadow-cyan/40 hover:-translate-y-px transition">
            TRY NOW
          </Link>
        </div>

        <button className="md:hidden p-2 text-navy" onClick={() => setOpen(!open)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-navy/10 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === l.href ? "text-bcablue bg-bcablue/10" : "text-navy/70"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/world" onClick={() => setOpen(false)} className="block text-center mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-bcablue to-cyan text-white text-sm font-bold">
            TRY NOW
          </Link>
        </div>
      )}
    </header>
  );
}
