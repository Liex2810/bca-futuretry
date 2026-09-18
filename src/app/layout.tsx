import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Open_Sans } from "next/font/google";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import "./globals.css";
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
  title: "BCA FutureTry — Try before you choose",
  description:
    "Jelajahi role di balik PPBP & PPTI lewat misi interaktif, refleksi, dan cerita ilustratif. Bukan tes, bukan prediksi — tempat mencoba sebelum memilih.",
  openGraph: {
    title: "BCA FutureTry — Try before you choose",
    description: "Coba role PPBP/PPTI sebelum menentukan langkah. Interaktif, gratis, tanpa login.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={openSans.variable}>
      <body className="antialiased">
        <JourneyProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-[#0066ae]/15 bg-white text-sm text-[#063b66]">
            <div className="mx-auto max-w-[1460px] px-6 py-14 sm:px-10 lg:px-12 lg:py-16">
              <Image src="/bca-logo.svg" alt="BCA Grup BCA" width={1000} height={313} className="h-auto w-28 sm:w-32" />

              <div className="mt-12 grid gap-10 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1.5fr_1.5fr] xl:gap-14">
                <section>
                  <h2 className="font-semibold text-[#063b66]">Kantor Pusat</h2>
                  <div className="mt-6 space-y-4 leading-relaxed">
                    <p>Menara BCA, Grand Indonesia</p>
                    <p>Jl. MH Thamrin No. 1</p>
                    <p>Jakarta 10310</p>
                    <a href="https://www.bca.co.id/id/lokasi-bca" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-2 hover:text-[#0066ae]">
                      <MapPin size={20} /> Lokasi BCA Lainnya
                    </a>
                  </div>
                </section>

                <section>
                  <h2 className="font-semibold text-[#063b66]">Hubungi Kami</h2>
                  <div className="mt-6 space-y-4">
                    <a href="tel:1500888" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><Phone size={20} /> Halo BCA 1500888</a>
                    <a href="mailto:halobca@bca.co.id" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><Mail size={20} /> halobca@bca.co.id</a>
                    <a href="https://wa.me/628111500998" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><MessageCircle size={20} /> 62 811 1500 998</a>
                  </div>
                </section>

                <section>
                  <h2 className="font-semibold text-[#063b66]">Media Sosial</h2>
                  <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    <a href="https://www.instagram.com/goodlifebca" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#0066ae] text-[11px] font-bold text-white">f</span> GoodLife BCA</a>
                    <a href="https://www.youtube.com/@SolusiBCA" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></svg> Solusi BCA</a>
                    <a href="https://www.instagram.com/goodlifebca" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> @goodlifebca</a>
                    <a href="https://x.com/BankBCA" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 hover:text-[#0066ae]"><span className="text-xl leading-none">X</span> @BankBCA</a>
                  </div>
                  <a href="https://www.bca.co.id/id/informasi/Sosial-Media" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center underline underline-offset-2 hover:text-[#0066ae]">Lihat Semua Media Sosial</a>
                </section>

                <section className="xl:pl-4">
                  <h2 className="max-w-sm text-xl font-medium leading-snug text-[#063b66] sm:text-2xl">Dapatkan promo dan penawaran terbaik dari BCA</h2>
                  <div className="mt-8 flex max-w-md items-center border-b border-[#063b66]/60">
                    <label htmlFor="footer-email" className="sr-only">Masukkan email</label>
                    <input id="footer-email" type="email" placeholder="Masukkan Email" className="min-w-0 flex-1 bg-transparent py-3 text-base text-[#063b66] outline-none placeholder:text-slate-400" />
                    <button type="button" className="grid min-h-11 min-w-11 place-items-center text-[#063b66] hover:text-[#0066ae]" aria-label="Daftar penawaran melalui email"><ArrowRight size={25} /></button>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">This page is protected by reCAPTCHA Enterprise.</p>
                </section>
              </div>

              <div className="mt-14 border-t border-[#0066ae]/25 pt-10 lg:mt-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl space-y-4 leading-relaxed text-[#063b66]">
                    <p>BCA berizin dan diawasi oleh Otoritas Jasa Keuangan &amp; Bank Indonesia</p>
                    <p>BCA merupakan peserta penjaminan LPS. Maksimum nilai simpanan yang dijamin LPS per Nasabah per Bank adalah Rp2 miliar.<br />Untuk cek Tingkat Bunga Penjaminan LPS, klik <a href="https://www.lps.go.id" target="_blank" rel="noopener noreferrer" className="text-[#0066ae] hover:underline">di sini</a>.</p>
                  </div>
                  <nav className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 font-medium" aria-label="Tautan legal">
                    <a href="https://www.bca.co.id/id/informasi/kurs" target="_blank" rel="noopener noreferrer" className="hover:text-[#0066ae]">SBDK</a>
                    <span aria-hidden="true">|</span>
                    <Link href="/futurepath" className="hover:text-[#0066ae]">Kebijakan</Link>
                    <span aria-hidden="true">|</span>
                    <Link href="/futurepath" className="hover:text-[#0066ae]">Syarat dan Ketentuan</Link>
                  </nav>
                </div>
              </div>
            </div>
          </footer>
          <ChatWidget />
        </JourneyProvider>
      </body>
    </html>
  );
}
