import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { Chatbot } from "@/components/chatbot";

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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
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
        <Chatbot />
      </body>
    </html>
  );
}
