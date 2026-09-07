import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { JourneyProvider } from "@/components/JourneyProvider";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "BCA FutureTry — Try before you choose",
  description:
    "Jelajahi role di balik PPBP & PPTI lewat misi interaktif, refleksi, dan cerita awardee. Bukan tes, bukan prediksi — tempat mencoba sebelum memilih.",
  openGraph: {
    title: "BCA FutureTry — Try before you choose",
    description: "Coba role PPBP/PPTI sebelum menentukan langkah. Interaktif, gratis, tanpa login.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${grotesk.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <JourneyProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-navy/10 py-8 mt-8">
            <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-navy/50">
              <p>© {new Date().getFullYear()} BCA FutureTry — proyek konsep YNFEST. Bukan situs resmi BCA.</p>
              <p className="font-mono text-xs">Experience → Relevance → Trust → Action</p>
            </div>
          </footer>
          <ChatWidget />
        </JourneyProvider>
      </body>
    </html>
  );
}
