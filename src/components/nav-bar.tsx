"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, BookOpen, BarChart2, Settings, Coffee, User, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "تحضير", icon: Calculator },
  { href: "/recipe", label: "الوصفة", icon: Coffee },
  { href: "/guide", label: "الدليل", icon: BarChart2 },
  { href: "/beans", label: "الحبوب", icon: BookOpen },
  { href: "/settings", label: "الإعدادات", icon: Settings },
  { href: "/log", label: "السجل", icon: ClipboardList },
  { href: "/about", label: "عن المشروع", icon: User },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-surface-900 border-b border-surface-600 sticky top-0 z-50 backdrop-blur-sm">
        <Link href="/" className="flex items-center">
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
            <span style={{fontSize:"22px",fontWeight:700,color:"#c49a3c",letterSpacing:"1px"}}>قطرة</span>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{height:"1px",width:"16px",background:"#3d3528"}}></div>
              <span style={{fontSize:"9px",fontWeight:400,color:"#6b5e47",letterSpacing:"4px",textTransform:"uppercase"}}>DripWise</span>
              <div style={{height:"1px",width:"16px",background:"#3d3528"}}></div>
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(pathname === href ? "nav-link-active" : "nav-link")}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900 border-t border-surface-600 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                  active ? "text-accent-500" : "text-ink-400 hover:text-ink-200"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-900 border-b border-surface-600 sticky top-0 z-40">
        <Link href="/" className="flex items-center">
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
            <span style={{fontSize:"22px",fontWeight:700,color:"#c49a3c",letterSpacing:"1px"}}>قطرة</span>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{height:"1px",width:"16px",background:"#3d3528"}}></div>
              <span style={{fontSize:"9px",fontWeight:400,color:"#6b5e47",letterSpacing:"4px",textTransform:"uppercase"}}>DripWise</span>
              <div style={{height:"1px",width:"16px",background:"#3d3528"}}></div>
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </header>
    </>
  );
}
