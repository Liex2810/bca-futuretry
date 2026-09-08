import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { JourneyProvider } from "@/components/JourneyProvider";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

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
        <Analytics />
      </body>
    </html>
  );
}
