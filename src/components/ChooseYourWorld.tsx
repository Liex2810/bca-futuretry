"use client";
import { Events } from "@/lib/analytics";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type WorldKind = "ppbp" | "ppti";

/* ══════════════════════════════════════════════════
   Character placeholder
   Mudah diganti: cukup beri prop `src` dengan asset asli.
   Tanpa `src`, menampilkan siluet placeholder abstrak
   yang sudah punya frame, glow, scale & responsif.
   ══════════════════════════════════════════════════ */
function Character({ type, src, alt }: { type: WorldKind; src?: string; alt: string }) {
  const isPpbp = type === "ppbp";

  return (
    <div className="cw-char-shell relative w-56 sm:w-64 lg:w-72">
      {/* Ambient glow behind character */}
      <div
        className="cw-glow pointer-events-none absolute -inset-6 rounded-[2rem] blur-2xl"
        style={{ background: "rgba(0,200,235,0.10)" }}
        aria-hidden
      />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute inset-[-18px] rounded-[2rem] border border-slate-200/80" aria-hidden />
      <div className="pointer-events-none absolute inset-[-40px] rounded-[3rem] border border-slate-200/40" aria-hidden />

      {/* Frame */}
      <div
        className={`cw-border-frame cw-char-inner relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs ${
          isPpbp ? "" : "rotate-2"
        }`}
      >
        {/* Pre-frame layer offset (PPTI = layered, PPBP = clean) */}
        {!isPpbp && (
          <div className="pointer-events-none absolute -inset-2 rounded-2xl border border-slate-200 -rotate-2" aria-hidden />
        )}

        {/* Bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-soft to-white" />

        {src ? (
          <img src={src} alt={alt} className="relative h-full w-full object-cover" />
        ) : (
          /* Placeholder silhouette — struktur berbeda per world */
          <>
            <div className="absolute inset-0 grid place-items-center px-8">
              <svg viewBox="0 0 120 150" className="w-full max-w-[110px]" role="img" aria-label={alt}>
                {/* structured halo (PPBP) / layered rhombus (PPTI) */}
                {isPpbp ? (
                  <rect x="12" y="8" width="96" height="96" rx="12" fill="none" stroke="rgba(0,102,174,0.25)" strokeWidth="1" />
                ) : (
                  <>
                    <rect x="6" y="2" width="108" height="108" transform="rotate(45 60 56)" fill="none" stroke="rgba(0,102,174,0.18)" strokeWidth="1" />
                    <circle cx="18" cy="18" r="3" fill="rgba(0,200,235,0.5)" />
                  </>
                )}
                {/* bust */}
                <circle cx="60" cy="52" r="20" fill="none" stroke="#063b66" strokeWidth="2" opacity="0.55" />
                <path
                  d="M60 76 C 60 76 34 94 18 110 L 102 110 C 86 94 60 76 60 76 Z"
                  fill="none"
                  stroke="#063b66"
                  strokeWidth="2"
                  opacity="0.55"
                />
                {/* accent shoulder line */}
                <path d="M44 92 C 52 96 68 96 76 92" stroke="#00c8eb" strokeWidth="1.5" fill="none" opacity="0.7" />
              </svg>
            </div>

            {/* Corner tag placeholder */}
            <span className="absolute left-3 top-3 rounded border border-slate-200 bg-white/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-slate-400">
              {isPpbp ? "CHAR · PPBP" : "CHAR · PPTI"}
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[9px] tracking-[0.2em] text-[#0066ae]/40">
              PLACEHOLDER
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Decorative environment per world (light theme)
   ══════════════════════════════════════════════════ */
function PPBPDecor() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* structured grid of thin lines */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* modular blocks */}
      <div className="cw-deco-strong absolute left-6 top-10 grid grid-cols-3 gap-2">
        <span className="h-6 w-6 border border-slate-300 bg-slate-50" />
        <span className="h-6 w-6 border border-slate-300/80 bg-slate-50/60" />
        <span className="h-6 w-6 border border-slate-300 bg-slate-50" />
      </div>
      <div className="cw-deco-weak absolute bottom-10 right-8 grid grid-cols-2 gap-2">
        <span className="h-5 w-5 border border-slate-300/80 bg-slate-50/60" />
        <span className="h-5 w-5 border border-slate-300/60" />
      </div>

      {/* subtle chart reference */}
      <svg className="cw-deco-strong absolute right-10 top-12 w-36 sm:w-44" viewBox="0 0 160 64" fill="none">
        <path d="M0 52 H 160" stroke="#cbd5e1" strokeWidth="1" />
        <polyline
          points="4,44 34,40 56,46 84,30 112,34 138,18 156,22"
          stroke="rgba(0,200,235,0.55)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="138" cy="18" r="2.5" fill="rgba(0,200,235,0.6)" />
      </svg>

      {/* thin corner ticks */}
      <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-slate-200 via-slate-200/40 to-transparent" />
      <span className="absolute bottom-0 left-10 h-px w-40 bg-gradient-to-r from-slate-200 to-transparent" />
    </div>
  );
}

function PPTIDecor() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* digital grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,44,76,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(6,44,76,0.9) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* node / network */}
      <svg className="cw-deco-strong absolute left-8 top-8 w-40 sm:w-52" viewBox="0 0 160 120" fill="none">
        <g stroke="#cbd5e1" strokeWidth="1">
          <path d="M20 100 L60 50 L100 84 L140 28" />
          <path d="M60 50 L110 22" />
          <path d="M100 84 L40 14" />
        </g>
        <g fill="rgba(0,102,174,0.55)">
          <circle cx="20" cy="100" r="3" />
          <circle cx="60" cy="50" r="3" />
          <circle cx="100" cy="84" r="3" />
          <circle cx="140" cy="28" r="3" />
          <circle cx="110" cy="22" r="2" />
          <circle cx="40" cy="14" r="2" />
        </g>
      </svg>

      {/* UI fragments */}
      <div className="cw-deco-weak absolute bottom-12 right-8 flex flex-col gap-1.5 font-mono text-[10px] text-slate-500">
        <span className="rounded border border-slate-200 bg-white/80 px-2 py-1">&lt;future /&gt;</span>
        <span className="rounded border border-slate-200 bg-white/80 px-2 py-1">system.online</span>
        <span className="rounded border border-slate-200 bg-white/80 px-2 py-1 text-[#0066ae]">{'{ edge: true }'}</span>
      </div>

      {/* floating marker */}
      <div className="cw-drift cw-deco-strong absolute right-14 top-6 flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-[#00c8eb]/70" />
        <span className="h-px w-10 bg-gradient-to-r from-[#00c8eb]/60 to-transparent" />
      </div>

      {/* thin corner ticks */}
      <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-slate-200 via-slate-200/40 to-transparent" />
      <span className="absolute bottom-0 right-0 h-1 w-1 bg-[#00c8eb]/40" />
      <span className="absolute bottom-2 right-2 h-1 w-1 bg-[#00c8eb]/30" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   World section
   ══════════════════════════════════════════════════ */
function WorldSection({
  program,
  short,
  categories,
  tagline,
  href,
  type,
  decor,
  alt,
  charSrc,
  align,
}: {
  program: string;
  short: string;
  categories: string[];
  tagline: string;
  href: string;
  type: WorldKind;
  decor: ReactNode;
  alt: string;
  charSrc?: string;
  align: "ppbp" | "ppti";
}) {
  const isPpbp = align === "ppbp";
  const worldLabel = isPpbp ? "WORLD 01" : "WORLD 02";
  const numLabel = isPpbp ? "01" : "02";

  return (
    <div className="cw-world group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
      {decor}

      {/* accent overhead line */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0066ae]/40 to-transparent" />

      <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:py-20">
        {/* Content */}
        <div className="flex flex-col justify-center order-2 text-left lg:order-none lg:col-span-7">
          <p className="font-mono text-[11px] tracking-[0.35em] text-[#0066ae]">{worldLabel}</p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none text-[#063b66] sm:text-6xl">
            {program}
          </h3>
          <p className="mt-2 font-mono text-xs tracking-[0.25em] text-[#00c8eb]">{short}</p>

          <ul className="mt-7 space-y-2 text-sm text-slate-500 sm:text-base">
            {categories.map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="h-px w-4 shrink-0 translate-y-[-3px] bg-[#00c8eb]/70" />
                {c}
              </li>
            ))}
          </ul>

          <p className="mt-8 font-[family-name:var(--font-display)] text-lg font-extrabold text-[#0066ae] sm:text-xl">
            {tagline}
          </p>

          <div className="mt-8">
            <Link
              onClick={() => Events.worldOpen(program)}
              href={href}
              className="cw-cta -skew-x-12 inline-flex items-center border border-[#0066ae] bg-white/60 px-7 py-2.5 text-[#0066ae] hover:bg-[#0066ae] hover:text-white"
            >
              <span className="skew-x-12 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-extrabold uppercase tracking-[0.25em]">
                Explore {program}
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden className="cw-arrow" />
              </span>
            </Link>
          </div>
        </div>

        {/* Character */}
        <div className="relative order-1 flex justify-center lg:order-none lg:col-span-5 lg:justify-end lg:self-center">
          <Character type={type} src={charSrc} alt={alt} />
        </div>
      </div>

      {/* bottom barcode-ish strip (subtle, per world) */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-4 sm:px-10">
        <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400">{numLabel} / 02</span>
        <span className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="w-px bg-slate-200" style={{ height: isPpbp ? 8 + (i % 3) * 3 : 12 - (i % 5) * 2 }} />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   World transition (visual separator)
   ══════════════════════════════════════════════════ */
function WorldTransition() {
  return (
    <div className="relative flex items-center justify-center py-8 sm:py-10" aria-hidden>
      <span className="absolute left-1/2 top-1/2 h-px w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <span className="cw-glow relative h-2.5 w-2.5 rotate-45 border border-[#0066ae] bg-[#0066ae]/15" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Choose Your World — ONE UNIVERSE. TWO WORLDS.
   ══════════════════════════════════════════════════ */
export function ChooseYourWorld() {
  return (
    <section aria-labelledby="choose-world-heading">
      {/* Section header */}
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-[#0066ae]">03 · CHOOSE YOUR WORLD</p>
        <h2
          id="choose-world-heading"
          className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#063b66] sm:text-4xl lg:text-5xl"
        >
          Where do you want to start?
        </h2>
      </div>

      {/* World 01 — PPBP (structured world) */}
      <div className="mt-12 sm:mt-14">
        <WorldSection
          program="PPBP"
          short="BUSINESS & BANKING"
          categories={["Investment", "Finance", "Accounting", "Management", "Business Strategy"]}
          tagline="BUILD YOUR EDGE."
          href="/world"
          type="ppbp"
          align="ppbp"
          decor={<PPBPDecor />}
          alt="Karakter yang mewakili dunia bisnis dan strategi (PPBP)"
        />
      </div>

      {/* Visual transition */}
      <WorldTransition />

      {/* World 02 — PPTI (dynamic world) */}
      <WorldSection
        program="PPTI"
        short="TECHNOLOGY & DIGITAL"
        categories={["Application", "Website", "UI/UX", "Data", "Network", "Cyber Security"]}
        tagline="ENTER THE DIGITAL FRONTIER."
        href="/world"
        type="ppti"
        align="ppti"
        decor={<PPTIDecor />}
        alt="Karakter yang mewakili dunia teknologi dan digital (PPTI)"
      />

      {/* Try both — subtle secondary CTA */}
      <div className="mt-14 text-center sm:mt-16">
        <Link
          href="/world"
          className="cw-link inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-[#063b66]"
        >
          Not sure yet?
          <span className="font-semibold text-[#0066ae]">Try both</span>
          <ArrowRight size={16} aria-hidden className="cw-link-arrow" />
        </Link>
      </div>
    </section>
  );
}