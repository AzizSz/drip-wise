import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "قطرة — أداة عبدالعزيز للقهوة",
  description: "حاسبة V60 ذكية مع ملفات الحبوب ودليل النسب ووصفات التحضير",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "DripWise" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1 pb-24 md:pb-8">
            {children}
          </main>
          <footer className="hidden md:flex items-center justify-center gap-3 py-4 text-xs" style={{ color: "var(--ink-500)" }}>
            <span>صنع بـ ☕ وشغف من عبدالعزيز صالح — الهفوف</span>
            <span>·</span>
            <a href="/about" style={{ color: "var(--ink-400)" }} className="hover:text-ink-100 transition-colors">
              تواصل معي
            </a>
          </footer>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
