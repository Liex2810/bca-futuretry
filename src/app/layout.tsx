import type { Metadata } from "next";
import Link from "next/link";
import { Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { JourneyProvider } from "@/components/JourneyProvider";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-bca-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bca-futuretry.vercel.app"),
  title: "BCA FutureTry — Try before you choose",
  description:
    "Jelajahi role di balik PPBP & PPTI lewat misi interaktif, refleksi, dan cerita awardee. Bukan tes, bukan prediksi — tempat mencoba sebelum memilih.",
  keywords: ["BCA", "PPBP", "PPTI", "beasiswa", "karier", "YNFEST", "futuretry", "eksplorasi karier"],
  openGraph: {
    title: "BCA FutureTry — Try before you choose",
    description: "Coba role PPBP/PPTI sebelum menentukan langkah. Interaktif, gratis, tanpa login.",
    type: "website",
    url: "https://bca-futuretry.vercel.app",
    siteName: "BCA FutureTry",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BCA FutureTry — Try before you choose" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCA FutureTry — Try before you choose",
    description: "Coba role PPBP/PPTI sebelum menentukan langkah. Gratis, tanpa login.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={openSans.variable}>
      <body className="antialiased">
        <JourneyProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-slate-200/80 bg-white/70 py-10 mt-12 text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="max-w-2xl space-y-1.5 leading-relaxed text-slate-500">
                <p>
                  BCA berizin dan diawasi oleh <strong>Otoritas Jasa Keuangan (OJK)</strong> &amp; <strong>Bank Indonesia</strong>. 
                  BCA merupakan peserta penjaminan Lembaga Penjamin Simpanan (LPS).
                </p>
                <p>
                  <strong>BCA FutureTry</strong> adalah platform konsep interaktif eksplorasi peran perbankan &amp; teknologi (PPBP &amp; PPTI) bagi talenta muda Indonesia. 
                  Semua hak cipta dan merek dagang milik PT Bank Central Asia Tbk.
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  © {new Date().getFullYear()} PT Bank Central Asia Tbk. All Rights Reserved. Protected by BCA FutureTry Security.
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 text-[11px] sm:text-xs">
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-600">
                  <Link href="/futurepath" className="inline-flex items-center min-h-[44px] hover:text-bcablue transition">Lisensi Font</Link>
                  <span className="text-slate-300">|</span>
                  <a href="https://www.bca.co.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] hover:text-bcablue transition">Lokasi BCA</a>
                  <span className="text-slate-300">|</span>
                  <Link href="/stories" className="inline-flex items-center min-h-[44px] hover:text-bcablue transition">Cerita Awardee</Link>
                  <span className="text-slate-300">|</span>
                  <Link href="/futurepath" className="inline-flex items-center min-h-[44px] hover:text-bcablue transition">Beasiswa PPBP &amp; PPTI</Link>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-500">
                  <Link href="/futurepath" className="inline-flex items-center min-h-[44px] hover:text-bcablue transition">Syarat &amp; Ketentuan</Link>
                  <span className="text-slate-300">|</span>
                  <Link href="/futurepath" className="inline-flex items-center min-h-[44px] hover:text-bcablue transition">Kebijakan Privasi</Link>
                  <span className="text-slate-300">|</span>
                  <span className="text-bcablue font-mono text-[10px]">Experience → Relevance → Action</span>
                </div>
              </div>
            </div>
          </footer>
          <ChatWidget />
        </JourneyProvider>
        <Analytics />
      </body>
    </html>
  );
}
