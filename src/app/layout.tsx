import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "DripWise — V60 Pour Over Calculator",
  description: "Smart V60 pour over coffee calculator with bean profiles, ratio guide, and brew recipes.",
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1 pb-24 md:pb-8">
            {children}
          </main>
          <footer className="hidden md:flex items-center justify-center gap-1.5 py-4 text-xs" style={{ color: "var(--ink-500)" }}>
            <span>☕</span>
            <span>Made by Abdulaziz-Saleh</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
