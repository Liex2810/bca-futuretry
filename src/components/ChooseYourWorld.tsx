"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Events } from "@/lib/analytics";

type WorldKind = "ppbp" | "ppti";

/* ══════════════════════════════════════════════════
   Character placeholder (simple illustration)
   Mudah diganti: beri prop `src` dengan asset asli.
   ══════════════════════════════════════════════════ */
function Character({ type, src, alt }: { type: WorldKind; src?: string; alt: string }) {
  const isPpbp = type === "ppbp";

  if (src) {
    return (
      <div className="relative w-full max-w-[280px]">
        <img src={src} alt={alt} className="w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] w-full max-w-[260px]">
      {/* Ambient glow behind character */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] blur-2xl"
        style={{ background: "rgba(0,200,235,0.12)" }}
        aria-hidden
      />

      {/* Frame */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-soft to-white" />
        <div className="absolute inset-0 grid place-items-center">
          <svg viewBox="0 0 120 150" className="w-full max-w-[110px]" role="img" aria-label={alt}>
            {isPpbp ? (
              <rect x="12" y="8" width="96" height="96" rx="12" fill="none" stroke="rgba(0,102,174,0.25)" strokeWidth="1" />
            ) : (
              <>
                <rect x="6" y="2" width="108" height="108" transform="rotate(45 60 56)" fill="none" stroke="rgba(0,102,174,0.18)" strokeWidth="1" />
                <circle cx="18" cy="18" r="3" fill="rgba(0,200,235,0.5)" />
              </>
            )}
            <circle cx="60" cy="52" r="20" fill="none" stroke="#063b66" strokeWidth="2" opacity="0.55" />
            <path
              d="M60 76 C 60 76 34 94 18 110 L 102 110 C 86 94 60 76 60 76 Z"
              fill="none"
              stroke="#063b66"
              strokeWidth="2"
              opacity="0.55"
            />
            <path d="M44 92 C 52 96 68 96 76 92" stroke="#00c8eb" strokeWidth="1.5" fill="none" opacity="0.7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Simple world card (white card, 2 cols, vertically centered)
   ══════════════════════════════════════════════════ */
function WorldSection({
  title,
  subtitle,
  href,
  type,
  alt,
  charSrc,
  children,
}: {
  title: ReactNode;
  subtitle: string;
  href: string;
  type: WorldKind;
  alt: string;
  charSrc?: string;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
        {/* Left — visual */}
        <div className="mx-auto flex w-full justify-center">
          <Character type={type} src={charSrc} alt={alt} />
        </div>

        {/* Right — content & CTA */}
        <div className="text-left">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-[#005cab] md:text-3xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p>

          <div className="mt-7">
            <Link
              href={href}
              onClick={() => Events.worldOpen(type === "ppbp" ? "ppbp" : "ppti")}
              className="inline-flex items-center gap-2 rounded-full bg-[#0066ae] px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-white transition-colors hover:bg-[#063b66]"
            >
              Lihat Detail
              <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Choose Your World — ONE UNIVERSE. TWO WORLDS.
   ══════════════════════════════════════════════════ */
export function ChooseYourWorld() {
  return (
    <section aria-labelledby="choose-world-heading" className="relative w-full bg-[#eaf2f9] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center">
          <h2
            id="choose-world-heading"
            className="font-[family-name:var(--font-display)] text-2xl md:text-[40px] font-semibold text-[#005cab]"
          >
            Dari mana kamu mau memulai?
          </h2>
        </div>

        {/* World 01 — PPBP */}
        <div className="mx-auto mt-12 max-w-6xl sm:mt-14">
          <WorldSection
            title="Program Pendidikan Bisnis dan Perbankan (PPBP)"
            subtitle="Bangun strategi bisnis, kuasai keuangan, dan jadilah pemimpin masa depan perbankan digital."
            href="/world"
            type="ppbp"
            charSrc="/character-ppbp.png"
            alt="Karakter yang mewakili dunia bisnis dan perbankan (PPBP)"
          />
        </div>

        {/* World 02 — PPTI */}
        <div className="mx-auto mt-8 max-w-6xl sm:mt-10">
          <WorldSection
            title="Program Pendidikan Teknik Informatika (PPTI)"
            subtitle="Asah keterampilan teknologi, data, dan aplikasi untuk masa depan perbankan digital."
            href="/world"
            type="ppti"
            charSrc="/character-ppti.png"
            alt="Karakter yang mewakili dunia teknologi dan informatika (PPTI)"
          />
        </div>

        {/* Belum yakin? — subtle secondary CTA */}
        <div className="mt-14 text-center">
          <Link href="/world" className="cw-link inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-[#063b66] min-h-[44px] px-3">
            Belum yakin?
            <span className="font-semibold text-[#0066ae]">Coba keduanya</span>
            <ArrowRight size={16} aria-hidden className="cw-link-arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}