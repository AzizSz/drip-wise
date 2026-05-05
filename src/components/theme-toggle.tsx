"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("dripwise_theme") as "dark" | "light" | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("dripwise_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-all"
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
    >
      {theme === "dark"
        ? <Sun size={16} className="text-accent-400" />
        : <Moon size={16} className="text-ink-300" />
      }
    </button>
  );
}
